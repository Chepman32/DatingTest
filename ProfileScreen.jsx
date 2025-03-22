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
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import * as queries from './src/graphql/queries';
import edit from './assets/edit.png';

const client = generateClient();

const ProfileScreen = ({ navigation, signOut }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const { username, userId } = await getCurrentUser();
      if (!userId || !username) {
        throw new Error('User information not available');
      }

      console.log(`Checking profile for user: ${username}, ID: ${userId}`);

      const existingUser = await client.graphql({
        query: queries.getUser,
        variables: { id: userId },
        authMode: 'userPool',
      });

      console.log('GraphQL response:', existingUser);

      if (existingUser.data.getUser) {
        console.log('User profile already exists:', existingUser.data.getUser);
        setProfileData(existingUser.data.getUser);
      } else {
        console.log('User profile does not exist');
        navigation.navigate('ProfileEdit');
      }

      setError(null);
    } catch (err) {
      setError('Failed to fetch profile data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: () => signOut() },
    ]);
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
        <Image
          source={edit}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.retryButton} onPress={loadProfileData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No profile data available</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.navigate('ProfileEdit')}
        >
          <Text style={styles.retryButtonText}>Create Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={profileData.imageUrl ? { uri: profileData.imageUrl } : edit}
          style={styles.avatar}
        />
        <Text style={styles.name}>{profileData?.name}</Text>
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => navigation.navigate('ProfileEdit')}
        >
          <Image source={edit} style={styles.editImage} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <InfoItem label="Age" value={profileData?.age} />
        <InfoItem label="Location" value={profileData?.location} />
        <InfoItem label="Bio" value={profileData?.bio} />
        <InfoItem label="Gender" value={profileData?.gender} />
        <InfoItem label="Joined" value={new Date(profileData?.createdAt).toLocaleDateString()} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.interestsContainer}>
          {profileData?.interests?.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
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
    <Text style={styles.value}>{value || 'Not provided'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  editImage: {
    width: 24,
    height: 24,
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