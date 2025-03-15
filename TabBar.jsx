// TabBar.js
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

const TabBar = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        onPress={() => setActiveTab('discover')}
        style={[styles.tab, activeTab === 'discover' ? styles.activeTab : null]}
      >
        <Icon name="fire" size={26} color={activeTab === 'discover' ? '#FF4458' : '#999'} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveTab('matches')}
        style={[styles.tab, activeTab === 'matches' ? styles.activeTab : null]}
      >
        <Icon name="comments" size={26} color={activeTab === 'matches' ? '#FF4458' : '#999'} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveTab('profile')}
        style={[styles.tab, activeTab === 'profile' ? styles.activeTab : null]}
      >
        <Icon name="user" size={26} color={activeTab === 'profile' ? '#FF4458' : '#999'} />
      </TouchableOpacity>
    </View>
  );
};

export default TabBar;