import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator, Platform } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeData, createLikeAction, createTestUserAction } from './redux/actions';

const { height: windowHeight } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { usersList, currentUser, sentLikeeIds, receivedLikerIds, listLoading } = useSelector(state => state.user);
  const swiperRef = useRef(null);

  useEffect(() => {
    console.log('Fetching home data');
    dispatch(fetchHomeData(navigation));
  }, [dispatch, navigation]);

  useEffect(() => {
    if (sentLikeeIds && receivedLikerIds && currentUser) {
      const newMatches = sentLikeeIds.filter(id => receivedLikerIds.includes(id));
      if (newMatches.length > 0) {
        console.log('New matches found:', newMatches);
      }
    }
  }, [sentLikeeIds, receivedLikerIds, currentUser]);

  const handleCreateTestUser = () => {
    if (currentUser && currentUser.gender) {
      dispatch(createTestUserAction(currentUser.gender));
    }
  };

  const handleLike = (index) => {
    if (!usersList[index] || listLoading) return;
    const swipedUser = usersList[index];
    const isMatched = receivedLikerIds.includes(swipedUser.id);

    const likeInput = {
      likerId: currentUser.id,
      likeeId: swipedUser.id,
      isMatched: isMatched,
    };

    dispatch(createLikeAction(likeInput));
    const newUsersList = usersList.filter(user => user?.id !== swipedUser?.id);
    dispatch({ type: 'SET_USERS_LIST', payload: newUsersList });

    if (isMatched) {
      alert(`You matched with ${swipedUser.name}!`);
    }
  };

  const handleDislike = (index) => {
    if (!usersList[index] || listLoading) return;
    const swipedUser = usersList[index];
    const newUsersList = usersList.filter(user => user?.id !== swipedUser?.id);
    dispatch({ type: 'SET_USERS_LIST', payload: newUsersList });
  };

  const renderCard = (card) => {
    if (!card) return null;

    return (
      <View style={styles.card}>
        <Image
          source={card.imageUrl ? { uri: card.imageUrl } : null}
          style={styles.image}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{card.name || 'Unknown'}, {card.age || '?'}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {listLoading ? (
        // Case 1: Loading indicator when data is being fetched
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CCC93" />
          <Text style={styles.loadingText}>Loading potential matches...</Text>
        </View>
      ) : usersList.length > 0 ? (
        // Case 2: Show swiper and buttons when users are available
        <View style={styles.contentContainer}>
          <Swiper
            ref={swiperRef}
            cards={usersList}
            renderCard={renderCard}
            cardIndex={0}
            backgroundColor="#f0f0f0"
            stackSize={3}
            cardVerticalMargin={0}
            cardHorizontalMargin={0}
            cardStyle={{ height: windowHeight * 0.85, width: '100%' }}
            overlayLabels={{
              left: {
                title: 'Nope',
                style: {
                  label: {
                    backgroundColor: 'transparent',
                    borderColor: '#E5566D',
                    color: '#E5566D',
                    fontSize: 36,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 20,
                    marginLeft: -20,
                  },
                },
              },
              right: {
                title: 'Like',
                style: {
                  label: {
                    backgroundColor: 'transparent',
                    borderColor: '#4CCC93',
                    color: '#4CCC93',
                    fontSize: 36,
                    fontWeight: 'bold',
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 20,
                    marginLeft: 20,
                  },
                },
              },
            }}
            onSwipedRight={handleLike}
            onSwipedLeft={handleDislike}
            disableTopSwipe={true}
            disableBottomSwipe={true}
            animateOverlayLabelsOpacity
            animateCardOpacity
            swipeBackCard
            useViewOverflow={Platform.OS === 'ios'}
            verticalSwipe={false}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.dislikeButton}
              onPress={() => swiperRef.current?.swipeLeft()}
            >
              <Text style={styles.buttonText}>Dislike</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.likeButton}
              onPress={() => swiperRef.current?.swipeRight()}
            >
              <Text style={styles.buttonText}>Like</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Case 3: Show empty state with refresh button when no users are available
        <View style={styles.noMatchesContainer}>
          <Text style={styles.noMatchesText}>No potential matches found</Text>
          <Text style={styles.noMatchesSubText}>
            This could be because there are no users that match your preferences,
            or you've already interacted with all potential matches.
          </Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => dispatch(fetchHomeData(navigation))}
          >
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  // Loading state styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  // Content container for swiper and buttons
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  // No matches state styles
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noMatchesText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  noMatchesSubText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 30,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  // Card styles
  card: {
    height: windowHeight * 0.85,
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: windowHeight * 0.70,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  nameContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  // Button styles
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  likeButton: {
    backgroundColor: '#4CCC93',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  dislikeButton: {
    backgroundColor: '#E5566D',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;