import React, { useEffect, useState } from 'react';
import {
  useAuthenticator,
  withAuthenticator,
} from '@aws-amplify/ui-react-native';
import * as mutations from './src/graphql/mutations';
import * as queries from './src/graphql/queries';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import home from './assets/home.png';
import match from './assets/match.png';
import profile from './assets/profile.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import ProfileCreationScreen from './ProfileCreationScreen';
import MatchesScreen from './MatchesScreen';
import ChatScreen from './ChatScreen';
import { Image } from 'react-native';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { Gender } from './src/models';

const client = generateClient({
  authMode: 'userPool',
});

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const MatchesStack = createStackNavigator();
const MainStack = createStackNavigator();

const ProfileStackScreen = () => {
  const { signOut } = useAuthenticator();
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="ProfileCreation" 
        component={ProfileCreationScreen} 
        options={{ title: 'Edit Profile' }}
      />
    </ProfileStack.Navigator>
  );
};

const MatchesStackScreen = () => {
  return (
    <MatchesStack.Navigator>
      <MatchesStack.Screen 
        name="MatchesList" 
        component={MatchesScreen} 
        options={{ headerShown: false }}
      />
      <MatchesStack.Screen 
        name="Chat" 
        component={ChatScreen}
      />
    </MatchesStack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }
          if (route.name === 'Home') {
            return <Image source={home} style={{ width: 30, height: 30 }} />;
          } else if (route.name === 'MatchesTab') {
            return <Image source={match} style={{ width: 30, height: 30 }} />;
          } else if (route.name === 'ProfileTab') {
            return <Image source={profile} style={{ width: 30, height: 30 }} />;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="MatchesTab" 
        component={MatchesStackScreen} 
        options={{ title: 'Matches', headerShown: false }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStackScreen} 
        options={{ title: 'Profile', headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const { user } = useAuthenticator();

  const listExistingUsers = async () => {
    try {
      const existingUsers = await client.graphql({
        query: queries.listUsers,
        authMode: 'userPool'
      });
      console.log('Existing users:', existingUsers.data.listUsers.items);
      return existingUsers.data.listUsers.items;
    } catch (error) {
      console.error('Error listing users:', error);
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      const initializeData = async () => {
        try {
          await listExistingUsers();
          await handleSave();
        } catch (error) {
          console.error('Error initializing data:', error);
        }
      };
      initializeData();
    }
  }, [user]);

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
        return;
      }

      console.log(`Creating profile for user: ${username}, ID: ${userId}`);

      const newUser = {
        id: userId,
        name: username,
        age: 18,
        imageUrl: "https://example.com/default-profile.jpg",
        gender: Gender.MALE,
        lookingFor: ["MALE", "FEMALE"],
        bio: "1",
        location: "1",
        interests: ["1", "2"]
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
    <NavigationContainer>
      <MainStack.Navigator>
        <MainStack.Screen 
          name="Main" 
          component={MainTabNavigator} 
          options={{
            headerShown: false,
          }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default withAuthenticator(App);
