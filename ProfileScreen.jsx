/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Auth } from 'aws-amplify';
import { DataStore } from 'aws-amplify/datastore';

// Define the User model inline (based on your schema)
const User = {
  name: 'User',
  fields: {
    id: 'ID!',
    name: 'String!',
    age: 'Int!',
    bio: 'String',
    imageUrl: 'String!',
    gender: 'Gender',
    lookingFor: '[Gender]',
    location: 'String',
    interests: '[String]',
    lastActive: 'AWSDateTime',
    createdAt: 'AWSDateTime',
    updatedAt: 'AWSDateTime',
    sentLikes: '[Match]',
    receivedLikes: '[Match]',
    sentMessages: '[Message]',
    receivedMessages: '[Message]',
    conversations: '[Conversation]',
  },
};

const ProfileScreen = ({ navigation, signOut }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Remove loadProfileData from useEffect dependencies to avoid infinite loops
  useEffect(() => {
    loadProfileData();
  }, []); // Empty dependency array since we only want this to run once on mount

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const currentUser = await Auth.currentAuthenticatedUser();
      const userId = currentUser.attributes.sub; // Cognito sub is the user ID

      // Query the User model using the authenticated user's ID
      const userProfile = await DataStore.query(User, userId);

      if (!userProfile) {
        console.log('No profile found, redirecting to ProfileCreation');
        navigation.navigate('ProfileCreation');
        return;
      }

      // Format the data based on the schema
      const formattedData = {
        name: userProfile.name,
        age: userProfile.age,
        location: userProfile.location,
        bio: userProfile.bio || 'No bio provided',
        imageUrl: userProfile.imageUrl || 'https://randomuser.me/api/portraits/men/4.jpg', // Use imageUrl instead of avatar
        interests: userProfile.interests || [], // No need for JSON.parse unless stored as a stringified JSON
        joinedDate: userProfile.createdAt,
        // No photos field in schema, so we'll leave it as an empty array for now
        photos: [], 
      };

      setProfileData(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(`Failed to fetch profile data: ${err.message}`);
      navigation.navigate('ProfileCreation'); // Redirect on error
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => signOut() },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfileData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profileData.imageUrl }} style={styles.avatar} />
        <Text style={styles.name}>{profileData.name}</Text>
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => navigation.navigate('ProfileCreation')}
        >
          <Ionicons name="pencil" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <InfoItem label="Age" value={profileData.age} />
        <InfoItem label="Location" value={profileData.location} />
        <InfoItem label="Bio" value={profileData.bio} />
        <InfoItem label="Joined" value={new Date(profileData.joinedDate).toLocaleDateString()} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.interestsContainer}>
          {profileData.interests.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {profileData.photos.map((photo, index) => (
            <Image key={index} source={{ uri: photo }} style={styles.photo} />
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const InfoItem = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value || 'Not set'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  editIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    width: 80,
    color: '#666',
  },
  value: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  interestText: {
    color: '#fff',
    fontSize: 14,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;