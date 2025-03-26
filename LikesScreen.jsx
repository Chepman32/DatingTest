import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { likesByLikerId, likesByLikeeId, getUser, getConversation } from './src/graphql/queries';
import { deleteLike } from './src/graphql/mutations';

const client = generateClient();

const LikesScreen = ({ navigation }) => {
  const [sentLikes, setSentLikes] = useState([]);
  const [receivedLikes, setReceivedLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const { userId } = await getCurrentUser();
        setCurrentUserId(userId);

        const sentLikesData = await client.graphql({
          query: likesByLikerId,
          variables: { likerId: userId },
          authMode: 'userPool',
        });
        if (sentLikesData.errors) {
          console.error('Errors fetching sent likes:', sentLikesData.errors);
        }
        const sentLikesList = sentLikesData.data?.likesByLikerId?.items || [];
        console.log('Raw sent likes:', sentLikesList);

        const enrichedSentLikes = [];
        for (let like of sentLikesList) {
          // Fetch user data if needed
          if (!like.likee && like.likeeId) {
            const userData = await client.graphql({
              query: getUser,
              variables: { id: like.likeeId },
              authMode: 'userPool',
            });
            like.likee = userData.data?.getUser;
          }

          // Fetch conversation data if this is a matched like with a conversation
          if (like.isMatched && like.conversationId && !like.conversation) {
            try {
              console.log(`Fetching conversation data for like ${like.id} with conversationId ${like.conversationId}`);
              const conversationData = await client.graphql({
                query: getConversation,
                variables: { id: like.conversationId },
                authMode: 'userPool',
              });
              like.conversation = conversationData.data?.getConversation;
              console.log(`Fetched conversation:`, like.conversation);
            } catch (error) {
              console.error(`Error fetching conversation for like ${like.id}:`, error);
            }
          }

          // Log direct conversation data if it exists
          if (like.directConversation) {
            console.log(`Like ${like.id} has direct conversation:`, like.directConversation);
          }

          if (like.likee) {
            enrichedSentLikes.push(like);
          } else {
            console.warn(`Deleting like with missing likee: ${like.id}`);
            await client.graphql({
              query: deleteLike,
              variables: { input: { id: like.id } },
              authMode: 'userPool',
            });
          }
        }
        setSentLikes(enrichedSentLikes);
        console.log('Enriched sent likes:', enrichedSentLikes);

        const receivedLikesData = await client.graphql({
          query: likesByLikeeId,
          variables: { likeeId: userId },
          authMode: 'userPool',
        });
        if (receivedLikesData.errors) {
          console.error('Errors fetching received likes:', receivedLikesData.errors);
        }
        const receivedLikesList = receivedLikesData.data?.likesByLikeeId?.items || [];
        console.log('Raw received likes:', receivedLikesList);

        const enrichedReceivedLikes = [];
        for (let like of receivedLikesList) {
          // Fetch user data if needed
          if (!like.liker && like.likerId) {
            const userData = await client.graphql({
              query: getUser,
              variables: { id: like.likerId },
              authMode: 'userPool',
            });
            like.liker = userData.data?.getUser;
          }

          // Fetch conversation data if this is a matched like with a conversation
          if (like.isMatched && like.conversationId && !like.conversation) {
            try {
              console.log(`Fetching conversation data for received like ${like.id} with conversationId ${like.conversationId}`);
              const conversationData = await client.graphql({
                query: getConversation,
                variables: { id: like.conversationId },
                authMode: 'userPool',
              });
              like.conversation = conversationData.data?.getConversation;
              console.log(`Fetched conversation for received like:`, like.conversation);
            } catch (error) {
              console.error(`Error fetching conversation for received like ${like.id}:`, error);
            }
          }

          // Log direct conversation data if it exists
          if (like.directConversation) {
            console.log(`Received like ${like.id} has direct conversation:`, like.directConversation);
          }

          if (like.liker) {
            enrichedReceivedLikes.push(like);
          } else {
            console.warn(`Deleting like with missing liker: ${like.id}`);
            await client.graphql({
              query: deleteLike,
              variables: { input: { id: like.id } },
              authMode: 'userPool',
            });
          }
        }
        setReceivedLikes(enrichedReceivedLikes);
        console.log('Enriched received likes:', enrichedReceivedLikes);
      } catch (error) {
        console.error('Error fetching likes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, []);

  const renderLikeItem = ({ item, isSent }) => {
    const user = isSent ? item.likee : item.liker;
    console.log('Rendering like item:', JSON.stringify(item, null, 2));

    if (!user) {
      console.warn(`User data missing for like item: ${item.id}, isSent: ${isSent}`);
      return (
        <View style={styles.likeItem}>
          <Text style={styles.name}>User not found</Text>
        </View>
      );
    }

    // Debug the item properties in detail
    console.log(`Item details - id: ${item.id}, isMatched: ${item.isMatched}, conversationId: ${item.conversationId}`);

    // Make sure we're using the correct boolean value for isMatched
    // Some GraphQL responses might return it as a string or null
    const isMatched = item.isMatched === true || item.isMatched === 'true';

    // Check for different types of conversations
    const hasRegularConversation = !!item.conversationId;
    const hasDirectConversation = !!item.directConversation &&
                                 Array.isArray(item.directConversation.messages) &&
                                 item.directConversation.messages.length > 0;

    // Determine navigation target based on conversation type
    let navigationTarget;

    if (isMatched && hasRegularConversation) {
      // Navigate to regular chat if there's a conversationId
      navigationTarget = {
        screen: 'Chat',
        params: {
          conversationId: item.conversationId,
          matchName: user.name
        }
      };
    } else if (isMatched && hasDirectConversation) {
      // Navigate to direct chat if there's a directConversation
      navigationTarget = {
        screen: 'DirectChat',
        params: {
          likeId: item.id,
          matchName: user.name,
          directConversation: item.directConversation,
          otherUserId: user.id
        }
      };
    } else {
      // Default to profile view
      navigationTarget = {
        screen: 'Profile',
        params: {
          userId: user.id
        }
      };
    }

    console.log(`Navigation decision for like ${item.id}: isMatched=${isMatched}, hasRegularConversation=${hasRegularConversation}, hasDirectConversation=${hasDirectConversation}, conversationId=${item.conversationId}, target=`, JSON.stringify(navigationTarget));

    return (
      <TouchableOpacity
        style={styles.likeItem}
        onPress={() => {
          console.log(`Navigating to: ${navigationTarget.screen} with params:`, JSON.stringify(navigationTarget.params));
          navigation.navigate("DirectChat", {
            conversationId: item.conversationId,
            matchName: user.name
          })
        }}
      >
        <Image 
          source={{ uri: user.imageUrl }} 
          style={styles.avatar} 
        />
        <View style={styles.likeInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.status}>
            {isMatched
              ? (hasRegularConversation
                 ? 'Matched! Tap to chat'
                 : (hasDirectConversation
                    ? 'Matched! Tap to view messages'
                    : 'Matched!'))
              : isSent
                ? 'Like sent'
                : 'Liked you'}
          </Text>
        </View>
        <Text style={styles.time}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSection = (title, data, isSent) => (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>{title}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => renderLikeItem({ item, isSent })}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {title.toLowerCase()} yet</Text>
          </View>
        }
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CCC93" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Likes</Text>
      {renderSection('Outgoing Likes', sentLikes, true)}
      {renderSection('Incoming Likes', receivedLikes, false)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  section: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  likeItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  likeInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default LikesScreen;