import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import { getUser, listUsers, matchesByLikerId, matchesByLikeeId } from './src/graphql/queries';
import { createMatch, updateMatch } from './src/graphql/mutations';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

const { height: windowHeight } = Dimensions.get('window');

const HomeScreen = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [sentLikeeIds, setSentLikeeIds] = useState([]);
  const [receivedLikerIds, setReceivedLikerIds] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const swiperRef = useRef(null);

  const fetchUsers = async () => {
    const usersData = await client.graphql({ query: listUsers });
        console.log('Users data:', usersData.data.listUsers.items);
        setUsersList(usersData.data.listUsers.items);
        return usersData.data.listUsers.items
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        console.log("Username:", username);
        console.log("User ID:", userId);
        console.log("Sign-in details:", signInDetails);
        const userInfo = signInDetails;
        const currentUserId = userId

        // Fetch current user details
        const userData = await client.graphql({ query: getUser, variables: { id: currentUserId } });
        const fetchedUser = userData.data.getUser;
        setCurrentUser(fetchedUser);

        // Fetch sent likes (matches where current user is the liker)
        const sentLikesData = await API.graphql(graphqlOperation(matchesByLikerId, { likerId: currentUserId }));
        const sentLikes = sentLikesData.data.matchesByLikerId.items;
        const likeeIds = sentLikes.map(match => match.likeeId);
        setSentLikeeIds(likeeIds);

        // Fetch received likes (matches where current user is the likee)
        const receivedLikesData = await API.graphql(graphqlOperation(matchesByLikeeId, { likeeId: currentUserId }));
        const receivedLikes = receivedLikesData.data.matchesByLikeeId.items;
        const likerIds = receivedLikes.map(match => match.likerId);
        setReceivedLikerIds(likerIds);

        // Fetch potential matches
        const filter = {
          lookingFor: { contains: fetchedUser.gender },
          id: { ne: currentUserId }
        };
        const usersData = await client.graphql({ query: listUsers });
        console.log('Users data:', usersData);
        const potentialMatches = usersData.data.listUsers.items.filter(user =>
          fetchedUser.lookingFor.includes(user.gender) && !likeeIds.includes(user.id)
        );
        setUsers(potentialMatches);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleLike = async (index) => {
    const swipedUser = users[index];
    const swipedUserId = swipedUser.id;
    try {
      const matchInput = {
        likerId: currentUser.id,
        likeeId: swipedUserId,
        matched: false,
      };
      const createMatchResponse = await API.graphql(graphqlOperation(createMatch, { input: matchInput }));
      const createdMatch = createMatchResponse.data.createMatch;

      // Check if the swiped user has already liked the current user
      if (receivedLikerIds.includes(swipedUserId)) {
        const existingMatchData = await API.graphql(graphqlOperation(matchesByLikeeId, { likeeId: currentUser.id }));
        const existingMatch = existingMatchData.data.matchesByLikeeId.items.find(
          match => match.likerId === swipedUserId
        );
        if (existingMatch) {
          await client.graphql({ query: updateMatch, variables: { input: { id: existingMatch.id, matched: true } } });
          await client.graphql({ query: updateMatch, variables: { input: { id: createdMatch.id, matched: true } } });
        }
      }

      // Update local state to prevent re-showing this user
      setSentLikeeIds(prev => [...prev, swipedUserId]);
      setUsers(prev => prev.filter(user => user.id !== swipedUserId));
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleDislike = (index) => {
    const swipedUser = users[index];
    setUsers(prev => prev.filter(user => user.id !== swipedUser.id));
  };

  const renderCard = (card) => {
    console.log('Rendering card:', card);
    return (
      <View style={styles.card}>
        <Image source={{ uri: card?.imageUrl }} style={styles.image} />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{card?.name}, {card?.age}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {
        usersList.length > 0 ? (
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
              label: { backgroundColor: 'transparent', borderColor: '#E5566D', color: '#E5566D', fontSize: 30, fontWeight: 'bold' },
              wrapper: { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: 20, marginLeft: -20 },
            },
          },
          right: {
            title: 'Like',
            style: {
              label: { backgroundColor: 'transparent', borderColor: '#4CCC93', color: '#4CCC93', fontSize: 30, fontWeight: 'bold' },
              wrapper: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 20, marginLeft: 20 },
            },
          },
        }}
        onSwipedRight={handleLike}
        onSwipedLeft={handleDislike}
      />
        )
        :
        (
          <View style={styles.noMatchesContainer}>
            <Text style={styles.noMatchesText}>No matches found</Text>
          </View>
        )
      }
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
  noMatchesText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  }
});

export default HomeScreen;