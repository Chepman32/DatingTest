import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { likesByLikerId, likesByLikeeId, getUser } from './src/graphql/queries';
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
          if (!like.likee && like.likeeId) {
            const userData = await client.graphql({
              query: getUser,
              variables: { id: like.likeeId },
              authMode: 'userPool',
            });
            like.likee = userData.data?.getUser;
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
          if (!like.liker && like.likerId) {
            const userData = await client.graphql({
              query: getUser,
              variables: { id: like.likerId },
              authMode: 'userPool',
            });
            like.liker = userData.data?.getUser;
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
    console.log('Rendering like item:', item);

    if (!user) {
      console.warn(`User data missing for like item: ${item.id}, isSent: ${isSent}`);
      return (
        <View style={styles.likeItem}>
          <Text style={styles.name}>User not found</Text>
        </View>
      );
    }

    const isMatched = item.isMatched;
    const navigationTarget = isMatched && item.conversationId 
      ? { screen: 'Chat', params: { conversationId: item.conversationId, matchName: user.name } }
      : { screen: 'Profile', params: { userId: user.id } };
    console.log(`Navigation decision for like ${item.id}: isMatched=${isMatched}, conversationId=${item.conversationId}, target=`, navigationTarget);

    return (
      <TouchableOpacity 
        style={styles.likeItem}
        onPress={() => navigation.navigate(navigationTarget.screen, navigationTarget.params)}
      >
        <Image 
          source={{ uri: user.imageUrl }} 
          style={styles.avatar} 
        />
        <View style={styles.likeInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.status}>
            {isMatched ? 'Matched!' : isSent ? 'Like sent' : 'Liked you'}
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