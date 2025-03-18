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

// Sample data - in a real app, you'd fetch this from a backend
const getSampleMessages = (matchId) => {
  const now = new Date();
  
  // Create timestamps for messages
  const getTime = (minutesAgo) => {
    const time = new Date(now);
    time.setMinutes(now.getMinutes() - minutesAgo);
    return time.toISOString();
  };

  const messages = {
    '1': [
      { 
        id: '1', 
        text: 'Hey, how are you?', 
        sender: 'match', 
        timestamp: getTime(45),
        read: true
      },
      { 
        id: '2', 
        text: 'I\'m good, thanks for asking! How about you?', 
        sender: 'user', 
        timestamp: getTime(44),
        read: true
      },
      { 
        id: '3', 
        text: 'Pretty good! Just finished work. Any plans for the weekend?', 
        sender: 'match', 
        timestamp: getTime(42),
        read: true
      },
      { 
        id: '4', 
        text: 'Thinking about hiking, weather permitting. Would you be interested?', 
        sender: 'user', 
        timestamp: getTime(40),
        read: true
      },
      { 
        id: '5', 
        text: 'That sounds fun! I love hiking. Where were you thinking of going?', 
        sender: 'match', 
        timestamp: getTime(38),
        read: true
      },
    ],
    '2': [
      { 
        id: '1', 
        text: 'Nice to match with you!', 
        sender: 'match', 
        timestamp: getTime(120),
        read: true
      },
      { 
        id: '2', 
        text: 'Thanks! I liked your profile. What do you enjoy doing in your free time?', 
        sender: 'user', 
        timestamp: getTime(118),
        read: true
      },
      { 
        id: '3', 
        text: 'I enjoy painting, reading, and going for walks in the park. How about you?', 
        sender: 'match', 
        timestamp: getTime(115),
        read: true
      },
    ],
    '3': [
      { 
        id: '1', 
        text: 'What\'s your favorite movie?', 
        sender: 'match', 
        timestamp: getTime(1440), // 24 hours ago
        read: true
      },
      { 
        id: '2', 
        text: 'I\'d have to say The Shawshank Redemption. It\'s a classic! What about you?', 
        sender: 'user', 
        timestamp: getTime(1435),
        read: true
      },
      { 
        id: '3', 
        text: 'I love Inception! The concept is so fascinating.', 
        sender: 'match', 
        timestamp: getTime(1430),
        read: true
      },
    ],
  };

  return messages[matchId] || [];
};

// Function to format timestamp
const formatMessageTime = (timestamp) => {
  const messageDate = new Date(timestamp);
  const now = new Date();
  
  // Check if the message is from today
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Check if the message is from yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  // For older messages, show the date
  return messageDate.toLocaleDateString();
};

const ChatScreen = ({ route, navigation }) => {
  const { matchId, matchName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [matchInfo, setMatchInfo] = useState(null);
  const flatListRef = useRef(null);

  // Fetch match info
  useEffect(() => {
    // In a real app, you'd fetch this from your backend
    const fetchMatchInfo = () => {
      // Find the match in our sample data
      const matchData = MATCHES_DATA.find(match => match.id === matchId);
      setMatchInfo(matchData);
    };

    fetchMatchInfo();
  }, [matchId]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Simulate API call
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const fetchedMessages = getSampleMessages(matchId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [matchId]);

  // Set up header with match name
  useEffect(() => {
    navigation.setOptions({
      title: matchName,
      headerRight: () => (
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('Profile', { matchId })}
        >
          <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, matchName, matchId]);

  // Function to send a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMessageObj = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages(prevMessages => [...prevMessages, newMessageObj]);
    setNewMessage('');

    // Simulate a reply after a delay
    setTimeout(() => {
      const replyMessage = {
        id: (Date.now() + 1).toString(),
        text: getRandomReply(),
        sender: 'match',
        timestamp: new Date().toISOString(),
        read: false,
      };
      setMessages(prevMessages => [...prevMessages, replyMessage]);
    }, 1500);
  };

  // Function to get a random reply
  const getRandomReply = () => {
    const replies = [
      "That's interesting!",
      "Tell me more about that.",
      "I see what you mean.",
      "That sounds fun!",
      "I'd like to hear more about that.",
      "Have you always felt that way?",
      "What else do you enjoy?",
      "That's a great point!",
      "I hadn't thought of it that way before.",
      "You have great taste!",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  // Render each message
  const renderMessage = ({ item }) => {
    const isUserMessage = item.sender === 'user';
    
    return (
      <View style={[
        styles.messageContainer,
        isUserMessage ? styles.userMessageContainer : styles.matchMessageContainer
      ]}>
        {!isUserMessage && matchInfo && (
          <Image source={{ uri: matchInfo.avatar }} style={styles.messageAvatar} />
        )}
        
        <View style={[
          styles.messageBubble,
          isUserMessage ? styles.userMessageBubble : styles.matchMessageBubble
        ]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
        
        <Text style={styles.messageTime}>
          {formatMessageTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  // Date header for messages
  const renderDateHeader = () => {
    if (messages.length === 0) return null;
    
    const firstMessageDate = new Date(messages[0].timestamp);
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

// Sample data for matches (same as in MatchesScreen)
const MATCHES_DATA = [
  {
    id: '1',
    name: 'Alex Johnson',
    lastMessage: 'Hey, how are you?',
    time: '2:30 PM',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    lastMessage: 'Nice to match with you!',
    time: '1:15 PM',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '3',
    name: 'Mike Thompson',
    lastMessage: "What is your favorite movie?",
    time: 'Yesterday',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

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
  userMessageText: {
    color: '#FFFFFF',
  },
  matchMessageText: {
    color: '#000000',
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