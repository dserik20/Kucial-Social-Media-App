import {View, Text, ImageBackground, Image, StyleSheet, TouchableOpacity} from 'react-native'
import { useState } from 'react';
import Login from './Login';
import Signup from './Signup/Signup';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();



function WelcomeScreen({navigation}){


    return (
        <ImageBackground
        source={{uri: 'https://www.hse.ru/data/2021/01/29/1404113422/4e85321c55852563872ba13ec6f60c2.jpg'}} // Replace with the path to your image
        style={styles.imageBackground}
        blurRadius={3}
    >
        <View style={styles.overlay} />
        <View>
            <Text style={styles.text}>Welcome to</Text>
            <Text style={styles.textBold}>kucial</Text>
        </View>
        <View style={{
            width: '80%',
        }}>
            <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.button}>
                <Text style={{...styles.text, color: 'white'}}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={styles.button}>
                <Text style={{...styles.text, color: 'white'}}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    </ImageBackground>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    imageBackground: {
      flex: 1, // This makes the image cover the entire view
      resizeMode: 'cover', // You can adjust the resizeMode as needed
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    },
    text: {
      color: 'white',
      fontSize: 24,
      fontFamily: 'Montserrat_400Regular'
    },
    textBold: {
        color: 'white',
        fontSize: 34,
        fontFamily: 'Montserrat_700Bold'
      },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        alignItems: 'center'
    },
  });


export default WelcomeScreen