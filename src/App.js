import { StyleSheet, Text, View, StatusBar, TextInput, ImageBackground, SafeAreaView, Platform, NativeModules, Button, Image, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useCallback } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const { StatusBarManager } = NativeModules;
import {  useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import store from './redux/store';
import { useSelector, useDispatch } from 'react-redux';
import MainTabNavigator from './navigation/MainTabNavigator';

import * as SplashScreen from 'expo-splash-screen';
import Welcome from './Login/WelcomeScreen'
import AuthStackNavigator from './navigation/AuthStackNavigator';


const MyTheme = {
  ...DefaultTheme,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'black',
    card: 'black',
    text: 'white',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};


const RootStack = createStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular, Montserrat_700Bold
  });

  const userData = useSelector(state => state.user.userData);

  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  LogBox.ignoreAllLogs();//Ignore all log notifications

  

  console.log(fontsLoaded)
  if (!fontsLoaded) {
    return null;
  }

  return (
      <View style={styles.container}>
        <StatusBar 
          translucent
          backgroundColor="transparent" 
          barStyle="light-content" />
        <NavigationContainer theme={MyTheme}>
          <RootStack.Navigator 
              screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Auth" component={AuthStackNavigator} />
            {userData ? <RootStack.Screen name="MainApp" component={MainTabNavigator} /> : null}
          </RootStack.Navigator>
        </NavigationContainer>
      </View>   

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover', // You can adjust the resizeMode as needed
  },
  input: {
    height: '5%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    minWidth: '45%'
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  postImage: {
    aspectRatio: 1, // 1:1 aspect ratio (square)
    width: '85%',  // You can adjust the width as needed
    alignSelf: 'center', // Center the image horizontally
  }
});
