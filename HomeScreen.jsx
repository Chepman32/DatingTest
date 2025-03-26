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
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const client = generateClient();

// Mock data for generating random users
const maleNames = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
  'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
  'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan',
  'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon',
  'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Patrick', 'Frank', 'Raymond', 'Jack', 'Dennis', 'Jerry'
];
const femaleNames = [
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
  'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle',
  'Carol', 'Amanda', 'Dorothy', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Laura', 'Sharon', 'Cynthia',
  'Kathleen', 'Amy', 'Angela', 'Shirley', 'Anna', 'Ruth', 'Brenda', 'Pamela', 'Nicole', 'Katherine',
  'Samantha', 'Christine', 'Emma', 'Catherine', 'Debra', 'Virginia', 'Rachel', 'Carolyn', 'Janet', 'Maria'
];
const locations = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
  'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'San Francisco', 'Charlotte', 'Indianapolis', 'Seattle', 'Denver', 'Washington DC',
  'Boston', 'El Paso', 'Nashville', 'Detroit', 'Portland', 'Memphis', 'Oklahoma City', 'Las Vegas', 'Louisville', 'Baltimore',
  'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento', 'Long Beach', 'Kansas City', 'Mesa', 'Atlanta', 'Colorado Springs',
  'Miami', 'Raleigh', 'Omaha', 'Minneapolis', 'Tulsa', 'Cleveland', 'Wichita', 'Arlington', 'New Orleans', 'Bakersfield'
];
const bios = [
  'Love hiking and outdoor adventures',
  'Foodie who enjoys trying new restaurants',
  'Passionate about photography and travel',
  'Bookworm and coffee enthusiast',
  'Fitness fanatic and health conscious',
  'Music lover and concert goer',
  'Tech enthusiast and gamer',
  'Art lover and museum visitor',
  'Movie buff and Netflix binger',
  'Animal lover and pet owner',
  'Entrepreneur building my own business',
  'Yoga instructor and wellness advocate',
  'Chef who loves experimenting with new recipes',
  'Writer working on my first novel',
  'Musician playing in a local band',
  'Teacher who loves making a difference',
  'Engineer with a creative side',
  'Doctor passionate about healthcare',
  'Lawyer fighting for justice',
  'Scientist exploring the unknown',
  'Traveler who has visited 30+ countries',
  'Dancer with a background in ballet',
  'Comedian who loves making people laugh',
  'Environmentalist working to save the planet',
  'Fashion designer with a unique style',
  'Athlete training for my next marathon',
  'Volunteer dedicated to community service',
  'Photographer capturing life\'s moments',
  'Gardener with a green thumb',
  'History buff fascinated by the past',
  'Adventurer seeking new experiences',
  'Surfer who lives for the waves',
  'Skier who spends winters on the slopes',
  'Painter expressing emotions through art',
  'Podcaster sharing interesting stories',
  'Investor building for the future',
  'Minimalist embracing simple living',
  'Foodie with a passion for cooking',
  'Blogger sharing my journey',
  'DIY enthusiast always working on projects'
];
const interests = [
  ['hiking', 'camping', 'nature'],
  ['cooking', 'restaurants', 'food'],
  ['photography', 'travel', 'adventure'],
  ['reading', 'writing', 'coffee'],
  ['fitness', 'yoga', 'health'],
  ['music', 'concerts', 'festivals'],
  ['technology', 'gaming', 'coding'],
  ['art', 'museums', 'culture'],
  ['movies', 'tv shows', 'cinema'],
  ['animals', 'pets', 'wildlife'],
  ['dancing', 'nightlife', 'parties'],
  ['sports', 'football', 'basketball'],
  ['meditation', 'mindfulness', 'spirituality'],
  ['entrepreneurship', 'business', 'startups'],
  ['fashion', 'shopping', 'style'],
  ['gardening', 'plants', 'outdoors'],
  ['history', 'politics', 'current events'],
  ['science', 'astronomy', 'physics'],
  ['languages', 'linguistics', 'communication'],
  ['volunteering', 'charity', 'community'],
  ['cars', 'motorcycles', 'mechanics'],
  ['fishing', 'hunting', 'outdoor sports'],
  ['crafts', 'DIY', 'making'],
  ['wine', 'beer', 'spirits'],
  ['podcasts', 'audiobooks', 'radio'],
  ['comedy', 'stand-up', 'humor'],
  ['investing', 'finance', 'economics'],
  ['philosophy', 'psychology', 'thinking'],
  ['architecture', 'design', 'interior'],
  ['swimming', 'beach', 'water sports']
];

// Generate array of male profile image URLs from randomuser.me (1-99)
const maleImages = Array.from({ length: 99 }, (_, i) =>
  `https://randomuser.me/api/portraits/men/${i + 1}.jpg`
);

// Generate array of female profile image URLs from randomuser.me (1-99)
const femaleImages = Array.from({ length: 99 }, (_, i) =>
  `https://randomuser.me/api/portraits/women/${i + 1}.jpg`
);

// Function to generate a random mock user
const generateRandomUser = (index) => {
  // Create a more balanced gender distribution (not strictly alternating)
  const isMale = Math.random() > 0.5;
  const gender = isMale ? 'MALE' : 'FEMALE';

  // Select random name from appropriate gender list
  const name = isMale
    ? maleNames[Math.floor(Math.random() * maleNames.length)]
    : femaleNames[Math.floor(Math.random() * femaleNames.length)];

  // Generate age with a more realistic distribution (18-65)
  // More users in 25-35 range, fewer in older ranges
  let age;
  const ageDistribution = Math.random();
  if (ageDistribution < 0.5) {
    // 50% chance of being 21-35
    age = Math.floor(Math.random() * 15) + 21;
  } else if (ageDistribution < 0.8) {
    // 30% chance of being 36-45
    age = Math.floor(Math.random() * 10) + 36;
  } else {
    // 20% chance of being 46-65
    age = Math.floor(Math.random() * 20) + 46;
  }

  const location = locations[Math.floor(Math.random() * locations.length)];
  const bio = bios[Math.floor(Math.random() * bios.length)];

  // Select 1-3 interest categories randomly
  const numInterestCategories = Math.floor(Math.random() * 3) + 1;
  let userInterests = [];
  const availableInterests = [...interests]; // Copy the array to avoid modifying the original

  for (let i = 0; i < numInterestCategories; i++) {
    if (availableInterests.length === 0) break;

    // Select a random interest category and remove it from available options
    const randomIndex = Math.floor(Math.random() * availableInterests.length);
    const selectedInterests = availableInterests.splice(randomIndex, 1)[0];

    // Add each interest from the category
    userInterests = [...userInterests, ...selectedInterests];
  }

  // Select random profile image from appropriate gender list
  const imageUrl = isMale
    ? maleImages[Math.floor(Math.random() * maleImages.length)]
    : femaleImages[Math.floor(Math.random() * femaleImages.length)];

  // Determine sexual preference with some diversity
  // 90% heterosexual, 5% homosexual, 5% bisexual
  const sexualPreference = Math.random();
  let lookingFor;

  if (sexualPreference < 0.9) {
    // Heterosexual
    lookingFor = [isMale ? 'FEMALE' : 'MALE'];
  } else if (sexualPreference < 0.95) {
    // Homosexual
    lookingFor = [isMale ? 'MALE' : 'FEMALE'];
  } else {
    // Bisexual
    lookingFor = ['MALE', 'FEMALE'];
  }

  return {
    id: uuidv4(),
    name,
    age,
    bio,
    imageUrl,
    location,
    gender,
    lookingFor,
    interests: userInterests,
  };
};

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
      console.log('Received likes:', receivedLikes);

      const usersData = await client.graphql({ query: listUsers, authMode: 'userPool' });
      const potentialMatches = usersData.data.listUsers.items.filter(user => existingUser.data.getUser.lookingFor.includes(user.gender)
        && !sentLikes.some(like => like.likeeId === user.id)
        && !receivedLikes.some(like => like.likerId === user.id)
      );
      console.log("genders:", usersData.data.listUsers.items.filter(user => existingUser.data.getUser.lookingFor.includes(user.gender)));
      setUsersList(potentialMatches);
      console.log('Fetched users:', potentialMatches);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setListLoading(false);
  }, [navigation]);

  // Function to create mock users
  const createMockUsers = async () => {
    console.log('Creating mock users...');
    try {
      // Check if we already have enough users in the database
      const usersData = await client.graphql({
        query: listUsers,
        authMode: 'userPool'
      });

      const existingUsers = usersData.data.listUsers.items;
      console.log(`Found ${existingUsers.length} existing users`);

      // Target number of users (210 = original 10 + 200 more)
      const targetUserCount = 210;

      // Only create mock users if we have fewer than the target number
      if (existingUsers.length >= targetUserCount) {
        console.log(`Already have ${existingUsers.length} users, skipping mock user creation`);
        return false; // No users created
      }

      // Create enough random users to reach the target
      const mockUsersToCreate = targetUserCount - existingUsers.length;
      console.log(`Creating ${mockUsersToCreate} mock users to reach target of ${targetUserCount}`);

      // Create users in batches to avoid overwhelming the API
      const batchSize = 10;
      const batches = Math.ceil(mockUsersToCreate / batchSize);

      for (let batch = 0; batch < batches; batch++) {
        const batchStart = batch * batchSize;
        const currentBatchSize = Math.min(batchSize, mockUsersToCreate - batchStart);

        console.log(`Processing batch ${batch + 1}/${batches} (${currentBatchSize} users)`);

        for (let i = 0; i < currentBatchSize; i++) {
          const overallIndex = batchStart + i;
          const mockUser = generateRandomUser(overallIndex);
          console.log(`Creating mock user ${overallIndex + 1}/${mockUsersToCreate}:`, mockUser.name);

          try {
            await client.graphql({
              query: mutations.createUser,
              variables: { input: mockUser },
              authMode: 'userPool'
            });
            console.log(`Created mock user: ${mockUser.name}`);
          } catch (error) {
            // If this specific user creation fails, continue with the next one
            console.error(`Error creating mock user ${mockUser.name}:`, error);
          }
        }

        // Small delay between batches to avoid rate limiting
        if (batch < batches - 1) {
          console.log('Pausing briefly between batches...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      console.log(`Finished creating ${mockUsersToCreate} mock users`);
      return true; // Users were created
    } catch (error) {
      console.error('Error in createMockUsers:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      await fetchData();
      // Create mock users when the component mounts
      const mockUsersCreated = await createMockUsers();

      // If new mock users were created, refresh the data to include them
      if (mockUsersCreated) {
        console.log('Mock users created, refreshing data...');
        await fetchData();
      }
    };

    initializeApp();
  }, [fetchData]);

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
            <Text style={styles.noMatchesText}>No more potential matches</Text>
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
  },
  noMatchesText: {
    fontSize: 20,
    color: '#999',
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
  },
});

export default HomeScreen;