import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStackNavigator from './AuthStackNavigator';
import { Ionicons } from '@expo/vector-icons';
import React, {useRef, useEffect} from 'react';
import {Animated, Text, View} from 'react-native';

import HomeScreen from '../Screens/HomeScreen'
import CreateScreen from '../Screens/CreateScreen';
import ProfileScreen from '../Screens/Profile/ProfileScreen';
import SearchScreen from '../Screens/SearchScreen';
import FavoriteScreen from '../Screens/FavoriteScreen';
import EventInfoScreen from '../Screens/EventInfoScreen';
import OtherProfileScreen from '../Screens/Profile/OtherProfileScren'// Import other screens and icons
import FriendRequestsScreen from '../Screens/Profile/FriendRequests';
import EditProfileScreen from '../Screens/Profile/EditProfileScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator()

const HomeStack = () => {
    return (
      <Stack.Navigator
        headerMode="none"

      >
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="EventInfo" component={EventInfoScreen} />
        <Stack.Screen name="OtherProfile" component={OtherProfileScreen} />
      </Stack.Navigator>
    );
  };

  const ProfileStack = () => {
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EventInfo" component={EventInfoScreen} />
        <Stack.Screen name="OtherProfile" component={OtherProfileScreen} />
        <Stack.Screen name="FriendRequests" component={FriendRequestsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      </Stack.Navigator>
    );
  };

  const FavoritesStack = () => {    
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Favorites" component={FavoriteScreen} />
        <Stack.Screen name="EventInfo" component={EventInfoScreen} />
        <Stack.Screen name="OtherProfile" component={OtherProfileScreen} />
      </Stack.Navigator>
    );
  };


const MainTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      >
        <Tab.Screen
          name="HomeScreen"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name="home" color={focused ? '#ab162b' : color} size={size} />
                ),
          }}
        >
          {(props) => <HomeStack {...props}/>}
        </Tab.Screen>
        <Tab.Screen
          name="Search"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name="search" color={focused ? '#ab162b' : color} size={size} />
                ),
          }}
        >
          {(props) => <SearchScreen {...props}/>}
        </Tab.Screen>
        <Tab.Screen
          name="Create"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name="add-circle" color={focused ? '#ab162b' : color} size={size} />
                ),
          }}
        >
          {(props) => <CreateScreen {...props} />}
        </Tab.Screen>
        <Tab.Screen
          name="FavoritesScreen"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name="heart" color={focused ? '#ab162b' : color} size={size} />
                ),
          }}
        >
          {(props) => <FavoritesStack {...props}/>}
        </Tab.Screen>
        <Tab.Screen
          name="ProfileScreen"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name="person" color={focused ? '#ab162b' : color} size={size} />
                ),
          }}
        >
          {(props) => <ProfileStack {...props}/>}
        </Tab.Screen>
      </Tab.Navigator>
  );
};

export default MainTabNavigator;
