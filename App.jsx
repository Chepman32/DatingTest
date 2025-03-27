import React from 'react';
import { useAuthenticator, withAuthenticator } from '@aws-amplify/ui-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './redux/store';
import home from './assets/home.png';
import match from './assets/match.png';
import profile from './assets/profile.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import ProfileCreationScreen from './ProfileCreationScreen';
import LikesScreen from './LikesScreen';
import ChatScreen from './ChatScreen';
import DirectChatScreen from './DirectChatScreen';
import { Image } from 'react-native';
import ProfileEdit from './ProfileEditScreen';

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const LikesStack = createStackNavigator();
const MainStack = createStackNavigator();

const ProfileStackScreen = () => {
  const { signOut } = useAuthenticator();
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
      <ProfileStack.Screen 
        name="ProfileCreation" 
        component={ProfileCreationScreen} 
        options={{ title: 'Create Profile' }}
      />
      <ProfileStack.Screen 
        name="ProfileEdit" 
        component={ProfileEdit} 
        options={{ title: 'Edit Profile' }}
      />
    </ProfileStack.Navigator>
  );
};

const LikesStackScreen = () => {
  return (
    <LikesStack.Navigator>
      <LikesStack.Screen
        name="LikesList"
        component={LikesScreen}
        options={{ headerShown: false }}
      />
      <LikesStack.Screen
        name="Chat"
        component={ChatScreen}
      />
      <LikesStack.Screen
        name="DirectChat"
        component={DirectChatScreen}
        options={{ title: 'Messages' }}
      />
      <LikesStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'User Profile' }}
      />
    </LikesStack.Navigator>
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
          } else if (route.name === 'LikesTab') {
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
        name="LikesTab"
        component={LikesStackScreen} 
        options={{ title: 'Likes', headerShown: false }}
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
    <Provider store={store}>
      <NavigationContainer>
        <MainStack.Navigator>
          <MainStack.Screen 
            name="Main" 
            component={MainTabNavigator} 
            options={{ headerShown: false }}
          />
        </MainStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default withAuthenticator(App);