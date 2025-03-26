import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { getLike } from './src/graphql/queries';
import { updateLike } from './src/graphql/mutations';
import { v4 as uuidv4 } from 'uuid';

const client = generateClient();

const DirectChatScreen = ({ route, navigation }) => {
  const { likeId, matchName, directConversation, otherUserId } = route.params;
  const [messages, setMessages] = useState(directConversation?.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [like, setLike] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Set the title of the screen to the match's name
    navigation.setOptions({
      title: matchName || 'Chat',
    });

    const initializeChat = async () => {
      try {
        // Get current user ID
        const userInfo = await getCurrentUser();
        setCurrentUserId(userInfo.userId);

        // If we already have directConversation data from navigation params, use it
        if (directConversation && directConversation.messages) {
          // Sort messages by date
          const sortedMessages = [...directConversation.messages].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );
          setMessages(sortedMessages);

          // We still need to fetch the like for other data
          const likeData = await client.graphql({
            query: getLike,
            variables: { id: likeId },
            authMode: 'userPool',
          });

          setLike(likeData.data?.getLike);
        } else {
          // If no directConversation was passed, fetch everything from the API
          const likeData = await client.graphql({
            query: getLike,
            variables: { id: likeId },
            authMode: 'userPool',
          });

          const fetchedLike = likeData.data?.getLike;
          console.log('Fetched like data:', fetchedLike);

          if (fetchedLike) {
            setLike(fetchedLike);

            // If there's a direct conversation with messages, set them
            if (fetchedLike.directConversation &&
                fetchedLike.directConversation.messages &&
                fetchedLike.directConversation.messages.length > 0) {
              // Sort messages by date
              const sortedMessages = [...fetchedLike.directConversation.messages].sort(
                (a, b) => new Date(a.date) - new Date(b.date)
              );
              setMessages(sortedMessages);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [likeId, matchName, navigation, directConversation]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId) return;

    try {
      // Get sender name - either from the like object or use "You" as fallback
      let senderName = "You";
      if (like) {
        senderName = currentUserId === like.likerId ?
          (like.liker?.name || "You") :
          (like.likee?.name || "You");
      }

      // Create a new message object
      const newMessageObj = {
        id: uuidv4(),
        text: newMessage.trim(),
        senderId: currentUserId,
        senderName: senderName,
        date: new Date().toISOString(),
      };

      // If we don't have the like object yet, fetch it first
      let currentLike = like;
      if (!currentLike) {
        const likeData = await client.graphql({
          query: getLike,
          variables: { id: likeId },
          authMode: 'userPool',
        });
        currentLike = likeData.data?.getLike;
        setLike(currentLike);
      }

      if (!currentLike) {
        console.error('Cannot send message: Like not found');
        return;
      }

      // Create or update the directConversation object
      const existingConversation = currentLike.directConversation || {
        startDate: currentLike.createdAt || new Date().toISOString(),
        messages: [],
      };

      // Add the new message to the messages array
      const updatedMessages = [...(existingConversation.messages || []), newMessageObj];

      // Update the directConversation object
      const updatedDirectConversation = {
        ...existingConversation,
        messages: updatedMessages,
        lastMessageDate: new Date().toISOString(),
      };

      // Update the like with the new directConversation
      await client.graphql({
        query: updateLike,
        variables: {
          input: {
            id: likeId,
            directConversation: updatedDirectConversation,
          },
        },
        authMode: 'userPool',
      });

      // Update local state
      setMessages([...messages, newMessageObj]);
      setNewMessage('');

      // Scroll to the bottom of the chat
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === currentUserId;

    // Format the message time
    let messageTime;
    try {
      messageTime = new Date(item.date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting message time:', error);
      messageTime = '';
    }

    // Determine sender name for display
    let displayName = item.senderName || 'User';
    if (isCurrentUser) {
      displayName = 'You';
    } else if (otherUserId && item.senderId === otherUserId && matchName) {
      displayName = matchName;
    }

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        <View style={styles.messageContent}>
          {!isCurrentUser && (
            <Text style={styles.messageSender}>{displayName}</Text>
          )}
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTime}>{messageTime}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CCC93" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet. Say hello!</Text>
          </View>
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  messageSender: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#4CCC93',
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default DirectChatScreen;