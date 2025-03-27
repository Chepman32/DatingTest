import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLikesData } from './redux/actions';

const LikesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { sentLikes, receivedLikes, likesLoading } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchLikesData());
  }, [dispatch]);

  const combinedLikes = [
    ...sentLikes.map(item => ({ ...item, isSent: true })),
    ...receivedLikes.map(item => ({ ...item, isSent: false }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const renderLikeItem = ({ item }) => {
    const user = item.isSent ? item.likee : item.liker;
    if (!user) {
      return (
        <View style={styles.likeItem}>
          <Text style={styles.name}>User not found</Text>
        </View>
      );
    }

    const isMatched = item.isMatched === true || item.isMatched === 'true';
    const hasRegularConversation = !!item.conversationId;
    const hasDirectConversation = !!item.directConversation &&
                                 Array.isArray(item.directConversation.messages) &&
                                 item.directConversation.messages.length > 0;

    let navigationTarget;
    if (isMatched && hasRegularConversation) {
      navigationTarget = {
        screen: 'Chat',
        params: { conversationId: item.conversationId, matchName: user.name }
      };
    } else if (hasDirectConversation) {
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
      navigationTarget = {
        screen: 'Profile',
        params: { userId: user.id }
      };
    }

    return (
      <TouchableOpacity
        style={styles.likeItem}
        onPress={() => navigation.navigate(navigationTarget.screen, navigationTarget.params)}
      >
        <View style={[styles.avatarContainer, !item.isSent && styles.incomingLike]}>
          <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
        </View>
        <View style={styles.likeInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.status}>
            {isMatched
              ? (hasRegularConversation
                 ? 'Matched! Tap to chat'
                 : (hasDirectConversation
                    ? 'Matched! Tap to view messages'
                    : 'Matched!'))
              : item.isSent
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

  if (likesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CCC93" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Likes</Text>
      <FlatList
        data={combinedLikes}
        renderItem={renderLikeItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No likes yet</Text>
          </View>
        }
      />
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
  likeItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  incomingLike: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 27,
    padding: 2,
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