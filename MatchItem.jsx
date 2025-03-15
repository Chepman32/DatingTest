// MatchItem.js
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './styles';

const MatchItem = ({ match }) => {
  return (
    <TouchableOpacity style={styles.matchItem}>
      <Image source={{ uri: match.image }} style={styles.matchImage} />
      <View style={styles.matchInfo}>
        <Text style={styles.matchName}>{match.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {match.lastMessage}
        </Text>
      </View>
      <View style={styles.matchMeta}>
        <Text style={styles.timeText}>{match.time}</Text>
        {match.unread && <View style={styles.unreadBadge} />}
      </View>
    </TouchableOpacity>
  );
};

export default MatchItem;