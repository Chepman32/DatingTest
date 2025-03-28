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
import { addMessageToDirectConversation } from './utils/matchUtils';
import { v4 as uuidv4 } from 'uuid';

const client = generateClient();

const DirectChatScreen = ({ route, navigation }) => {
  const { likeId, matchName, directConversation, otherUserId } = route.params || {};
  const [messages, setMessages] = useState(directConversation?.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [like, setLike] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: matchName || 'Chat',
    });

    const initializeChat = async () => {
      try {
        const userInfo = await getCurrentUser();
        setCurrentUserId(userInfo.userId);

        if (!likeId) {
          console.log('No likeId provided in route params');
          setLoading(false);
          return;
        }

        const likeData = await client.graphql({
          query: getLike,
          variables: { id: likeId },
          authMode: 'userPool',
        });

        const fetchedLike = likeData.data?.getLike;
        setLike(fetchedLike);

        // Try to get messages from directConversation
        let chatMessages = [];
        if (fetchedLike?.directConversation?.messages) {
          chatMessages = [...fetchedLike.directConversation.messages];
        }
        // If no messages in directConversation, try to parse from _directConversationString
        else if (fetchedLike?._directConversationString) {
          try {
            const parsedConversation = JSON.parse(fetchedLike._directConversationString);
            if (parsedConversation.messages && Array.isArray(parsedConversation.messages)) {
              chatMessages = parsedConversation.messages;
            }
          } catch (parseError) {
            console.error('Error parsing directConversationString:', parseError);
          }
        }

        if (chatMessages.length > 0) {
          const sortedMessages = [...chatMessages].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );
          setMessages(sortedMessages);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [likeId, matchName, navigation]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId) return;

    try {
      if (!likeId) {
        console.error('Cannot send message: No likeId provided');
        return;
      }

      // Create a new message object
      const messageText = newMessage.trim();

      // Create the message locally first for immediate display
      let senderName = "You";
      if (like) {
        senderName = currentUserId === like.likerId
          ? (like.liker?.name || "You")
          : (like.likee?.name || "You");
      }

      const newMessageObj = {
        id: uuidv4(),
        text: messageText,
        senderId: currentUserId,
        senderName: senderName,
        date: new Date().toISOString(),
      };

      // Update local state immediately for better UX
      const updatedLocalMessages = [...messages, newMessageObj];
      setMessages(updatedLocalMessages);
      setNewMessage('');

      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }

      // Then use the utility function to add the message to the conversation in the database
      await addMessageToDirectConversation(likeId, currentUserId, messageText);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === currentUserId;
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
    const displayName = isCurrentUser ? 'You' : (item.senderName || matchName || 'User');

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        <View style={styles.messageContent}>
          {!isCurrentUser && <Text style={styles.messageSender}>{displayName}</Text>}
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