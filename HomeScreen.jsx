import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator, Platform } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeData, createLikeAction } from './redux/actions';
import { generateClient } from 'aws-amplify/api';
import * as queries from './src/graphql/queries';
import { getCurrentUser } from 'aws-amplify/auth';

const client = generateClient()

const { height: windowHeight } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { usersList, currentUser, sentLikeeIds, receivedLikerIds, listLoading } = useSelector(state => state.user);

  const checkUser = useCallback(async () => {
    try {
      const { username, userId } = await getCurrentUser();
            if (!userId || !username) {
              throw new Error('User information not available');
            }
            const existingUser = await client.graphql({
              query: queries.getUser,
              variables: { id: userId },
              authMode: 'userPool',
            });
            if (existingUser.data.getUser) {
              console.log('User profile already exists:', existingUser.data.getUser);
              navigation.navigate("ProfileTab", {
                screen: "ProfileCreation",
                initial: true
            });
              return;
            }
    }
    catch (err) {
      console.error(err);
    }
  }, [navigation])

  useEffect(() => {
    checkUser();
  }, [checkUser])
  const swiperRef = useRef(null);
  const [randomizedUsers, setRandomizedUsers] = useState([]);

  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initial data fetch
  useEffect(() => {
    console.log('Fetching home data');
    dispatch(fetchHomeData(navigation));
  }, [dispatch, navigation]);

  // Initialize randomizedUsers only when it's empty and usersList has data
  useEffect(() => {
    if (usersList && usersList.length > 0 && randomizedUsers.length === 0) {
      console.log('Initializing randomizedUsers');
      const usersCopy = JSON.parse(JSON.stringify(usersList));
      setRandomizedUsers(shuffleArray(usersCopy));
    }
  }, [usersList, randomizedUsers]);

  const handleLike = (index) => {
    if (!randomizedUsers[index] || listLoading) return;
    const swipedUser = randomizedUsers[index];
    const isMatched = receivedLikerIds.includes(swipedUser.id);

    const likeInput = {
      likerId: currentUser.id,
      likeeId: swipedUser.id,
      isMatched: isMatched,
    };

    dispatch(createLikeAction(likeInput));

    // Remove the user from randomizedUsers
    const newRandomizedUsers = randomizedUsers.filter(user => user?.id !== swipedUser?.id);
    setRandomizedUsers(newRandomizedUsers);

    if (isMatched) {
      alert(`You matched with ${swipedUser.name}!`);
    }
  };

  const handleDislike = (index) => {
    if (!randomizedUsers[index] || listLoading) return;
    const swipedUser = randomizedUsers[index];

    // Remove the user from randomizedUsers
    const newRandomizedUsers = randomizedUsers.filter(user => user?.id !== swipedUser?.id);
    setRandomizedUsers(newRandomizedUsers);

    // Update usersList in Redux
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

  // Debug information
  useEffect(() => {
    console.log('Render state:', {
      listLoading,
      usersListLength: usersList?.length || 0,
      randomizedUsersLength: randomizedUsers?.length || 0
    });

    if (usersList && usersList.length > 0) {
      console.log('Users in usersList:', usersList.map(user => ({
        id: user.id,
        name: user.name,
        gender: user.gender,
        lookingFor: user.lookingFor
      })));
    }
  }, [listLoading, usersList, randomizedUsers]);

  return (
    <View style={styles.container}>
      {listLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CCC93" />
          <Text style={styles.loadingText}>Loading potential matches...</Text>
        </View>
      ) : randomizedUsers.length > 0 ? (
        <View style={styles.contentContainer}>
          <Swiper
            ref={swiperRef}
            cards={randomizedUsers}
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
        <View style={styles.noMatchesContainer}>
          <Text style={styles.noMatchesText}>No potential matches found</Text>
          <Text style={styles.noMatchesSubText}>
            This could be because there are no users that match your preferences,
            or you've already interacted with all potential matches.
          </Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              dispatch(fetchHomeData(navigation));
            }}
          >
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.refreshButton, {marginTop: 10, backgroundColor: '#FF9500'}]}
            onPress={async () => {
              try {
                const client = generateClient();
                const response = await client.graphql({
                  query: queries.listUsers,
                  variables: {
                    filter: {
                      name: {
                        eq: 'wow'
                      }
                    }
                  },
                  authMode: 'userPool'
                });

                const wowUser = response.data.listUsers.items.find(user => user.name === 'wow');
                if (wowUser) {
                  console.log('Found wow user directly:', wowUser);
                  setRandomizedUsers([wowUser]);
                } else {
                  console.log('Wow user not found in direct query');
                }
              } catch (error) {
                console.log('Error fetching wow user directly:', error);
              }
            }}
          >
            <Text style={styles.buttonText}>Show Test User</Text>
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
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
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