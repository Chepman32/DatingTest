import React, { useState, useRef } from 'react';
import { Animated, PanResponder, ScrollView, View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SCREEN_WIDTH, CARD_WIDTH } from './styles';
import styles from './styles';

const Card = ({ profile, handleLike, handleNope, index, isCurrentCard, isSwipingRef }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const hasSwiped = useRef(false); // Prevents multiple swipes on this card

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleSwipe = (direction) => {
    if (hasSwiped.current || isSwipingRef.current) return; // Exit if already swiped or another swipe is in progress
    hasSwiped.current = true;
    isSwipingRef.current = true; // Lock swipes globally

    Animated.timing(position, {
      toValue: { x: direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      if (direction === 'right') handleLike();
      else handleNope();
      position.setValue({ x: 0, y: 0 });
      hasSwiped.current = false;
      isSwipingRef.current = false; // Unlock swipes after completion
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isCurrentCard && !hasSwiped.current && !isSwipingRef.current, // Only respond if no swipe is in progress
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > 120) {
          handleSwipe('right');
        } else if (gesture.dx < -120) {
          handleSwipe('left');
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.card,
        { transform: [{ translateX: position.x }, { rotate }], zIndex: isCurrentCard ? 1 : 0 },
      ]}
      {...(isCurrentCard ? panResponder.panHandlers : {})}
    >
      <View style={styles.cardImageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
            setCurrentImageIndex(index);
          }}
        >
          {profile.images.map((image, idx) => (
            <Image key={idx} source={{ uri: image }} style={styles.cardImage} />
          ))}
        </ScrollView>
        <View style={styles.imageNav}>
          {profile.images.map((_, i) => (
            <View key={i} style={[styles.imageDot, i === currentImageIndex ? styles.activeImageDot : null]} />
          ))}
        </View>
        <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
          <Text style={styles.likeLabelText}>LIKE</Text>
        </Animated.View>
        <Animated.View style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
          <Text style={styles.nopeLabelText}>NOPE</Text>
        </Animated.View>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.nameText}>{profile.name}</Text>
        <Text style={styles.ageText}>{profile.age}</Text>
      </View>
    </Animated.View>
  );
};

export default Card;