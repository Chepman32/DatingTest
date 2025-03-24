import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView, SafeAreaView, Modal, Image, Platform } from 'react-native';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { launchImageLibrary } from 'react-native-image-picker';
import * as queries from './src/graphql/queries';
import * as mutations from './src/graphql/mutations';

const client = generateClient();

const ProfileEdit = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState('MALE');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [lookingFor, setLookingFor] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [genderDropdownVisible, setGenderDropdownVisible] = useState(false);
  const [lookingForDropdownVisible, setLookingForDropdownVisible] = useState(false);

  const genderOptions = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Non-binary', value: 'NON_BINARY' },
    { label: 'Other', value: 'OTHER' }
  ];

  const lookingForOptions = [
    { label: 'FEMALE', value: 'FEMALE' },
    { label: 'MALE', value: 'MALE' },
  ];

  const availableInterests = [
    'Hiking', 'Reading', 'Cooking', 'Gaming', 'Traveling',
    'Photography', 'Music', 'Sports', 'Art', 'Technology',
    'Movies', 'Fitness', 'Writing', 'Dancing', 'Gardening'
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const { userId } = await getCurrentUser();
      const userData = await client.graphql({
        query: queries.getUser,
        variables: { id: userId },
        authMode: 'userPool',
      });

      if (userData.data.getUser) {
        const user = userData.data.getUser;
        setName(user.name || '');
        setAge(user.age?.toString() || '');
        setBio(user.bio || '');
        setLocation(user.location || '');
        setGender(user.gender || 'MALE');
        setSelectedInterests(user.interests || []);
        setLookingFor(user.lookingFor || []);
        setImageUrl(user.imageUrl || null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 500,
      maxWidth: 500,
      quality: 0.5,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        if (response.errorCode === 'permission') {
          alert('Permission to access photo library is required!');
        }
      } else if (response.assets && response.assets.length > 0) {
        const base64String = response.assets[0].base64;
        setImageUrl(`data:image/jpeg;base64,${base64String}`);
      }
    });
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const toggleLookingFor = (value) => {
    if (lookingFor.includes(value)) {
      setLookingFor(lookingFor.filter(item => item !== value));
    } else {
      setLookingFor([...lookingFor, value]);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setIsProfileUpdated(false);
    try {
      const { userId } = await getCurrentUser();
      
      const updatedUser = {
        id: userId,
        name,
        age: age ? parseInt(age) : 0,
        bio,
        location,
        gender,
        interests: selectedInterests,
        lookingFor,
        imageUrl,
      };

      const result = await client.graphql({
        query: mutations.updateUser,
        variables: { input: updatedUser },
        authMode: 'userPool'
      });
      
      console.log('Profile updated successfully:', result);
      setIsProfileUpdated(true);
      setTimeout(() => navigation.navigate('Profile'), 1500);
      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedGenderLabel = () => {
    const selected = genderOptions.find(option => option.value === gender);
    return selected ? selected.label : 'Select Gender';
  };

  const getLookingForLabel = () => {
    if (lookingFor.length === 0) return 'What are you looking for?';
    return lookingFor
      .map(value => lookingForOptions.find(opt => opt.value === value)?.label)
      .join(', ');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.header}>Edit Your Profile</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Profile Photo</Text>
            <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
              {imageUrl ? (
                <Image 
                  source={{ uri: imageUrl }} 
                  style={styles.profileImage}
                />
              ) : (
                <Text style={styles.photoPickerText}>Tap to select photo</Text>
              )}
            </TouchableOpacity>
          </View>

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
              onPress={() => setGenderDropdownVisible(true)}
            >
              <Text style={styles.dropdownButtonText}>{getSelectedGenderLabel()}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            
            <Modal
              visible={genderDropdownVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setGenderDropdownVisible(false)}
            >
              <TouchableOpacity 
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setGenderDropdownVisible(false)}
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
                          setGenderDropdownVisible(false);
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
            <Text style={styles.label}>Looking For</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setLookingForDropdownVisible(true)}
            >
              <Text style={styles.dropdownButtonText}>{getLookingForLabel()}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            
            <Modal
              visible={lookingForDropdownVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setLookingForDropdownVisible(false)}
            >
              <TouchableOpacity 
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setLookingForDropdownVisible(false)}
              >
                <View style={styles.dropdownModal}>
                  <View style={styles.dropdown}>
                    {lookingForOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.dropdownItem,
                          lookingFor.includes(option.value) && styles.dropdownItemSelected
                        ]}
                        onPress={() => toggleLookingFor(option.value)}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          lookingFor.includes(option.value) && styles.dropdownItemTextSelected
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
            <View style={styles.interestsContainer}>
              {availableInterests.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestBubble,
                    selectedInterests.includes(interest) && styles.selectedInterestBubble
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text style={[
                    styles.interestText,
                    selectedInterests.includes(interest) && styles.selectedInterestText
                  ]}>
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Text>
          </TouchableOpacity>
          
          {isProfileUpdated && (
            <Text style={styles.successMessage}>Profile updated successfully!</Text>
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
  photoPicker: {
    height: 150,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoPickerText: {
    color: '#999',
    fontSize: 16,
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
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestBubble: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedInterestBubble: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  interestText: {
    color: '#333',
    fontSize: 14,
  },
  selectedInterestText: {
    color: '#fff',
    fontWeight: '500',
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

export default ProfileEdit;