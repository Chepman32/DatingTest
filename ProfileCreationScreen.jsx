import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView, SafeAreaView, Modal, FlatList } from 'react-native';
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
  const [gender, setGender] = useState('MALE');
  const [interests, setInterests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  const genderOptions = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' }
  ];

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
        age: age || 0,
        bio,
        imageUrl: "https://us-east-2.admin.amplifyapp.com/static/media/amplify-logo.677fad72.svg",
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

  // Get the label of the selected gender
  const getSelectedGenderLabel = () => {
    const selected = genderOptions.find(option => option.value === gender);
    return selected ? selected.label : 'Select Gender';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.header}>Create Your Profile</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about yourself"
              value={bio}
              onChangeText={setBio}
              multiline={true}
              numberOfLines={4}
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="City, Country"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#999"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setDropdownVisible(true)}
            >
              <Text style={styles.dropdownButtonText}>{getSelectedGenderLabel()}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            
            <Modal
              visible={dropdownVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setDropdownVisible(false)}
            >
              <TouchableOpacity 
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setDropdownVisible(false)}
              >
                <View style={styles.dropdownModal}>
                  <View style={styles.dropdown}>
                    {genderOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.dropdownItem,
                          gender === option.value && styles.dropdownItemSelected
                        ]}
                        onPress={() => {
                          setGender(option.value);
                          setDropdownVisible(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          gender === option.value && styles.dropdownItemTextSelected
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Interests</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. hiking, reading, cooking (comma-separated)"
              value={interests}
              onChangeText={setInterests}
              placeholderTextColor="#999"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Create Profile'}
            </Text>
          </TouchableOpacity>
          
          {isProfileCreated && (
            <Text style={styles.successMessage}>Profile created successfully!</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  dropdownButton: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 14,
    color: '#555',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    width: '80%',
    backgroundColor: 'transparent',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemSelected: {
    backgroundColor: '#f0f7ff',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  successMessage: {
    color: '#28a745',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
  },
});

export default ProfileCreation;