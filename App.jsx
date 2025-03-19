import React from 'react';
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
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import ConfirmSignUpScreen from './ConfirmSignUpScreen';
import { Image } from 'react-native';

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const MatchesStack = createStackNavigator();
const MainStack = createStackNavigator();

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ headerShown: false }}
      />
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
  return (
    <NavigationContainer>
      <MainStack.Navigator>
        <MainStack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <MainStack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{ headerShown: false }}
        />
        <MainStack.Screen 
          name="ConfirmSignUp" 
          component={ConfirmSignUpScreen} 
          options={{ title: 'Confirm Sign Up' }}
        />
        <MainStack.Screen 
          name="Main" 
          component={MainTabNavigator} 
          options={{ headerShown: false }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default App;