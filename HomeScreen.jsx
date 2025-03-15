import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { faker } from '@faker-js/faker';

const { height: windowHeight } = Dimensions.get('window');

const mockUsers = Array.from({ length: 40 }, (_, i) => ({
  id: i.toString(),
  name: faker.person.firstName(),
  age: Math.floor(Math.random() * 15) + 20,
  image: `https://picsum.photos/800/800?random=${i}`,
}));

// Home Screen (Original Swiper)
const HomeScreen = () => {
  const [users] = useState(mockUsers);
  const swiperRef = useRef(null);

  const renderCard = (card) => (
    <View style={styles.card}>
      <Image source={{ uri: card.image }} style={styles.image} />
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{card.name}, {card.age}</Text>
      </View>
    </View>
  );

  const handleLike = () => swiperRef.current?.swipeRight();
  const handleDislike = () => swiperRef.current?.swipeLeft();

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
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.dislikeButton} onPress={handleDislike}>
          <Text style={styles.buttonText}>Dislike</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
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
    bottom: 80, // Adjusted to appear above tab bar
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
  screenContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  screenText: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen