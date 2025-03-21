import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getCurrentUser } from 'aws-amplify/auth';
import { DataStore } from 'aws-amplify/datastore';
import { User, Gender } from './src/models';

const ProfileCreation = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState(Gender.MALE);
  const [interests, setInterests] = useState('');

  const handleSave = async () => {
    const { username, userId } = await getCurrentUser();
      console.log(`Creating profile for user: ${username}, ID: ${userId}`);

      const newUser = new User({
        id: userId, // Use Cognito user ID as the profile ID
        name,
        age: age ? age : null,
        bio,
        location,
        gender,
        interests: interests ? interests.split(',').map(i => i.trim()) : [],
      });

      await DataStore.save(newUser);
      console.log('Profile created successfully!');

      navigation.navigate('ProfileScreen');
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