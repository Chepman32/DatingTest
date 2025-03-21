import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getCurrentUser } from 'aws-amplify/auth';
import { DataStore } from 'aws-amplify/datastore';
import { User, Gender } from './src/models';
import { generateClient } from 'aws-amplify/api';
import * as queries from './src/graphql/queries';
import * as mutations from './src/graphql/mutations';

const client = generateClient()

const ProfileCreation = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState(Gender.MALE);
  const [interests, setInterests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileCreated, setIsProfileCreated] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
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

      if (existingUser.data.getUser) {
        console.log('User profile already exists:', existingUser.data.getUser);
        setIsProfileCreated(true);
        navigation.navigate('Profile');
        return;
      }

      console.log(`Creating profile for user: ${username}, ID: ${userId}`);

      const newUser = {
        id: userId,
        name,
        age: age || 0, // Ensure not null
        bio,
        imageUrl: "https://us-east-2.admin.amplifyapp.com/static/media/amplify-logo.677fad72.svg", // Add this, ensure it's provided in the form
        location,
        gender,
        interests: interests ? interests.split(',').map(i => i.trim()) : [],
      };

      const createdUser = await client.graphql({
        query: mutations.createUser,
        variables: { input: newUser },
        authMode: 'userPool'
      });
      
      console.log('Profile created successfully:', createdUser);
      setIsProfileCreated(true);
      return createdUser;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <Picker
        selectedValue={gender}
        onValueChange={(itemValue) => setGender(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Male" value={Gender.MALE} />
        <Picker.Item label="Female" value={Gender.FEMALE} />
        <Picker.Item label="Non-binary" value={Gender.NON_BINARY} />
        <Picker.Item label="Other" value={Gender.OTHER} />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Interests (comma-separated)"
        value={interests}
        onChangeText={setInterests}
      />
      <Button title="Save Profile" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default ProfileCreation;