import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Auth } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import { getUser, listUsers, likesByLikerId, likesByLikeeId } from './src/graphql/queries';
import { createLike, updateLike, createUser } from './src/graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import * as queries from './src/graphql/queries';
import * as mutations from './src/graphql/mutations';

const client = generateClient();

const { height: windowHeight } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [usersList, setUsersList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [sentLikeeIds, setSentLikeeIds] = useState([]);
  const [receivedLikerIds, setReceivedLikerIds] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const swiperRef = useRef(null);

  const fetchData = useCallback(async () => {
    setListLoading(true);
    try {
      const { userId, username } = await getCurrentUser();
      const currentUserId = userId;

      const existingUser = await client.graphql({
        query: queries.getUser,
        variables: { id: currentUserId },
        authMode: 'userPool',
      });
      console.log('existingUser GraphQL response:', existingUser);

      if (!existingUser.data.getUser) {
        console.log(`No user profile found. Creating default profile for user: ${username}, ID: ${currentUserId}`);

        // Create a default user profile
        const newUser = {
          id: currentUserId,
          name: username || 'New User',
          age: 25,
          bio: 'Tell us about yourself',
          imageUrl: "https://us-east-2.admin.amplifyapp.com/static/media/amplify-logo.677fad72.svg",
          location: 'Your Location',
          gender: 'MALE',
          lookingFor: ['FEMALE'], // Default looking for females
          interests: ['dating'],
        };

        try {
          const createdUser = await client.graphql({
            query: mutations.createUser,
            variables: { input: newUser },
            authMode: 'userPool'
          });

          console.log('Default profile created successfully:', createdUser);
          setCurrentUser(createdUser.data.createUser);

          // Redirect to profile edit to complete profile
          navigation.navigate('ProfileEdit');
          return;
        } catch (createError) {
          console.error('Error creating default profile:', createError);
          navigation.navigate('ProfileCreation');
          return;
        }
      }

      setCurrentUser(existingUser.data.getUser);
      console.log('Current user:', existingUser.data.getUser);

      const sentLikesData = await client.graphql({
        query: likesByLikerId,
        variables: { likerId: currentUserId },
        authMode: 'userPool',
      });
      if (sentLikesData.errors) {
        console.error('Errors in likesByLikerId:', sentLikesData.errors);
      }
      const sentLikes = sentLikesData.data?.likesByLikerId?.items || [];
      const likeeIds = sentLikes.map(like => like.likeeId);
      setSentLikeeIds(likeeIds);
      console.log('Sent likes:', sentLikes);

      const receivedLikesData = await client.graphql({
        query: likesByLikeeId,
        variables: { likeeId: currentUserId },
        authMode: 'userPool',
      });
      if (receivedLikesData.errors) {
        console.error('Errors in likesByLikeeId:', receivedLikesData.errors);
      }
      const receivedLikes = receivedLikesData.data?.likesByLikeeId?.items || [];
      const likerIds = receivedLikes.map(like => like.likerId);
      setReceivedLikerIds(likerIds);

      const usersData = await client.graphql({ query: listUsers, authMode: 'userPool' });

      // Filter out users that match the current user's preferences
      const potentialMatches = usersData.data.listUsers.items.filter(user =>
        // Don't show the current user in the list of potential matches
        user.id !== currentUserId &&
        // Check if the user's gender matches what the current user is looking for
        existingUser.data.getUser.lookingFor.includes(user.gender) &&
        // Don't show users that the current user has already liked
        !sentLikes.some(like => like.likeeId === user.id) &&
        // Don't show users that have already liked the current user
        !receivedLikes.some(like => like.likerId === user.id)
      );

      console.log("All users:", usersData.data.listUsers.items);
      console.log("Current user ID:", currentUserId);
      console.log("Current user lookingFor:", existingUser.data.getUser.lookingFor);
      console.log("Gender matching users:", usersData.data.listUsers.items.filter(user =>
        existingUser.data.getUser.lookingFor.includes(user.gender) && user.id !== currentUserId
      ));
      setUsersList(potentialMatches);
      console.log('Fetched users:', potentialMatches);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setListLoading(false);
  }, [navigation]);

  // Function to create a test user with opposite gender
  const createTestUser = async (currentUserGender) => {
    try {
      // Determine the opposite gender for the test user
      const testUserGender = currentUserGender === 'MALE' ? 'FEMALE' : 'MALE';

      // Create a unique username for the test user
      const testUsername = `test_${testUserGender.toLowerCase()}_${Date.now()}`;

      // Create the test user
      const testUser = {
        id: `test-${Date.now()}`,
        name: testUsername,
        age: 25,
        bio: 'Test user profile',
        imageUrl: "https://us-east-2.admin.amplifyapp.com/static/media/amplify-logo.677fad72.svg",
        location: 'Test Location',
        gender: testUserGender,
        lookingFor: [currentUserGender], // Looking for the current user's gender
        interests: ['dating'],
        owner: testUsername,
      };

      console.log('Creating test user with gender:', testUserGender);

      const createdTestUser = await client.graphql({
        query: mutations.createUser,
        variables: { input: testUser },
        authMode: 'userPool'
      });

      console.log('Test user created successfully:', createdTestUser);

      // Refresh the data to include the new test user
      fetchData();
    } catch (error) {
      console.error('Error creating test user:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add a button to create a test user if no matches are found
  const handleCreateTestUser = () => {
    if (currentUser && currentUser.gender) {
      createTestUser(currentUser.gender);
    } else {
      console.error('Current user or gender not available');
    }
  };

  const handleLike = async (index) => {
    console.log('handleLike called with index:', index);
    if (!usersList[index]) {
      console.error('No user found at index:', index, 'Users list:', usersList);
      return;
    }
    const swipedUser = usersList[index];
    const swipedUserId = swipedUser.id;
    console.log('Swiped user ID:', swipedUserId, 'Current user ID:', currentUser?.id);

    if (!currentUser?.id || !swipedUserId) {
      console.error('Missing IDs - Current user ID:', currentUser?.id, 'Swiped user ID:', swipedUserId);
      return;
    }

    try {
      const likeInput = {
        likerId: currentUser.id,
        likeeId: swipedUserId,
        isMatched: false,
      };
      console.log('Creating like with input:', likeInput);
      const createLikeResponse = await client.graphql({
        query: createLike,
        variables: { input: likeInput },
        authMode: 'userPool',
      });
      if (createLikeResponse.errors) {
        console.error('Errors in createLike:', createLikeResponse.errors);
        return;
      }
      const createdLike = createLikeResponse.data.createLike;
      console.log('Created like:', createdLike);

      if (receivedLikerIds.includes(swipedUserId)) {
        console.log('Checking for mutual like with:', swipedUserId);
        const existingLikeData = await client.graphql({
          query: likesByLikeeId,
          variables: { likeeId: currentUser.id },
          authMode: 'userPool',
        });
        if (existingLikeData.errors) {
          console.error('Errors in likesByLikeeId for mutual check:', existingLikeData.errors);
          return;
        }
        const existingLike = existingLikeData.data.likesByLikeeId.items.find(
          like => like.likerId === swipedUserId
        );
        if (existingLike) {
          console.log('Found mutual like, updating:', existingLike.id);
          await client.graphql({
            query: updateLike,
            variables: { input: { id: existingLike.id, isMatched: true } },
            authMode: 'userPool',
          });
          await client.graphql({
            query: updateLike,
            variables: { input: { id: createdLike.id, isMatched: true } },
            authMode: 'userPool',
          });
          console.log('Updated both likes to matched');
        }
      }

      setSentLikeeIds(prev => [...prev, swipedUserId]);
      setUsersList(prev => prev.filter(user => user.id !== swipedUserId));
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleDislike = (index) => {
    console.log('handleDislike called with index:', index);
    const swipedUser = usersList[index];
    setUsersList(prev => prev.filter(user => user?.id !== swipedUser?.id));
  };

  const renderCard = (card) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: card?.imageUrl }} style={styles.image} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{card?.name}, {card?.age}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {usersList.length > 0 ? (
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
                label: { backgroundColor: 'transparent', borderColor: '#E5566D', color: '#E5566D', fontSize: 36, fontWeight: 'bold', textalign: 'center' },
                wrapper: { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: 20, marginLeft: -20 },
              },
            },
            right: {
              title: 'Like',
              style: {
                label: { backgroundColor: 'transparent', borderColor: '#4CCC93', color: '#4CCC93', fontSize: 36, fontWeight: 'bold' },
                wrapper: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 20, marginLeft: 20 },
              },
            },
          }}
          onSwipedRight={handleLike}
          onSwipedLeft={handleDislike}
        />
      ) : (
        <View style={styles.noMatchesContainer}>
          {listLoading ? (
            <ActivityIndicator size="large" color="#4CCC93" />
          ) : (
            <>
              <Text style={styles.noMatchesText}>No potential matches found</Text>
              <Text style={styles.noMatchesSubText}>
                This could be because there are no users that match your preferences,
                or you've already interacted with all potential matches.
              </Text>
              <TouchableOpacity
                style={styles.createTestUserButton}
                onPress={handleCreateTestUser}
              >
                <Text style={styles.buttonText}>Create Test User for Demo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={fetchData}
              >
                <Text style={styles.buttonText}>Refresh</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.dislikeButton} onPress={() => swiperRef.current?.swipeLeft()}>
          <Text style={styles.buttonText}>Dislike</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.likeButton} onPress={() => swiperRef.current?.swipeRight()}>
          <Text style={styles.buttonText}>Like</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
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
  createTestUserButton: {
    backgroundColor: '#4CCC93',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
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
  },
  dislikeButton: {
    backgroundColor: '#E5566D',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;