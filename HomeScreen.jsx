import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { getUser, listUsers, matchesByLikerId, matchesByLikeeId } from './src/graphql/queries';
import { createMatch, updateMatch } from './src/graphql/mutations';

const { height: windowHeight } = Dimensions.get('window');

const HomeScreen = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [sentLikeeIds, setSentLikeeIds] = useState([]);
  const [receivedLikerIds, setReceivedLikerIds] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await Auth.currentAuthenticatedUser();
        const currentUserId = userInfo.attributes.sub;

        // Fetch current user details
        const userData = await API.graphql(graphqlOperation(getUser, { id: currentUserId }));
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
        const usersData = await API.graphql(graphqlOperation(listUsers, { filter }));
        const potentialMatches = usersData.data.listUsers.items.filter(user =>
          fetchedUser.lookingFor.includes(user.gender) && !likeeIds.includes(user.id)
        );
        setUsers(potentialMatches);
      } catch (error) {
        console.error('Error fetching data:', error);
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
          await API.graphql(graphqlOperation(updateMatch, { input: { id: existingMatch.id, matched: true } }));
          await API.graphql(graphqlOperation(updateMatch, { input: { id: createdMatch.id, matched: true } }));
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

  const renderCard = (card) => (
    <View style={styles.card}>
      <Image source={{ uri: card?.imageUrl }} style={styles.image} />
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{card?.name}, {card?.age}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        cards={users}
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
});

export default HomeScreen;