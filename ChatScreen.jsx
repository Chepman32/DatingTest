import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { messagesByConversationId, getConversation, getUser } from './src/graphql/queries';
import { createMessage } from './src/graphql/mutations';

const client = generateClient();

const formatMessageTime = (timestamp) => {
  const messageDate = new Date(timestamp);
  const now = new Date();

  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return messageDate.toLocaleDateString();
};

const ChatScreen = ({ route, navigation }) => {
  const { conversationId, matchName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [matchInfo, setMatchInfo] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchUserAndConversation = async () => {
      try {
        const { userId } = await getCurrentUser();
        setCurrentUserId(userId);

        const conversationData = await client.graphql({
          query: getConversation,
          variables: { id: conversationId },
          authMode: 'userPool',
        });
        const conversation = conversationData.data?.getConversation;
        if (!conversation) {
          console.error('Conversation not found:', conversationId);
          return;
        }

        const matchId = conversation.participants.find(id => id !== userId);
        const matchData = await client.graphql({
          query: getUser,
          variables: { id: matchId },
          authMode: 'userPool',
        });
        setMatchInfo(matchData.data?.getUser);
      } catch (error) {
        console.error('Error fetching conversation or match info:', error);
      }
    };

    fetchUserAndConversation();
  }, [conversationId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const messagesData = await client.graphql({
          query: messagesByConversationId,
          variables: { conversationId },
          authMode: 'userPool',
        });
        const fetchedMessages = messagesData.data?.messagesByConversationId?.items || [];
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    navigation.setOptions({
      title: matchName,
      headerRight: () => (
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('Profile', { userId: matchInfo?.id })}
        >
          <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, matchName, matchInfo]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const messageInput = {
        conversationId,
        senderId: currentUserId,
        receiverId: matchInfo.id,
        text: newMessage,
        read: false,
      };
      const createMessageResponse = await client.graphql({
        query: createMessage,
        variables: { input: messageInput },
        authMode: 'userPool',
      });
      const newMessageObj = createMessageResponse.data.createMessage;
      setMessages(prevMessages => [...prevMessages, newMessageObj]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }) => {
    const isUserMessage = item.senderId === currentUserId;

    return (
      <View style={[
        styles.messageContainer,
        isUserMessage ? styles.userMessageContainer : styles.matchMessageContainer
      ]}>
        {!isUserMessage && matchInfo && (
          <Image source={{ uri: matchInfo.imageUrl }} style={styles.messageAvatar} />
        )}
        
        <View style={[
          styles.messageBubble,
          isUserMessage ? styles.userMessageBubble : styles.matchMessageBubble
        ]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
        
        <Text style={styles.messageTime}>
          {formatMessageTime(item.createdAt)}
        </Text>
      </View>
    );
  };

  const renderDateHeader = () => {
    if (messages.length === 0) return null;
    
    const firstMessageDate = new Date(messages[0].createdAt);
    const formattedDate = firstMessageDate.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    
    return (
      <View style={styles.dateHeaderContainer}>
        <Text style={styles.dateHeaderText}>{formattedDate}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={item => item.id}
              ListHeaderComponent={renderDateHeader}
              contentContainerStyle={styles.messagesList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
              onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
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
                style={styles.sendButton}
                onPress={handleSendMessage}
                disabled={newMessage.trim() === ''}
              >
                <Ionicons
                  name="send"
                  size={24}
                  color={newMessage.trim() === '' ? '#B0C4DE' : '#007AFF'}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    marginRight: 15,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  matchMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 4,
  },
  userMessageBubble: {
    backgroundColor: '#007AFF',
    marginLeft: 'auto',
  },
  matchMessageBubble: {
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  messageTime: {
    fontSize: 10,
    color: '#8E8E93',
    marginHorizontal: 8,
    marginBottom: 4,
  },
  dateHeaderContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateHeaderText: {
    fontSize: 12,
    color: '#8E8E93',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    padding: 8,
  },
});

export default ChatScreen;