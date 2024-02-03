import {View, Text, ImageBackground, Image, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native'
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig'
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../redux/slices/userSlice';
import { useNavigation, useFocusEffect, CommonActions } from '@react-navigation/native';
import { BackHandler } from 'react-native';


const validateEmail = (email, setEmailError) => {
    if (email === '') {
        setEmailError('*Email is required');
        return false;
    } else if (!email.endsWith('@ku.edu.tr')) { // Simple validation check
        setEmailError('*Please enter a KU email');
        return false;
    }
    setEmailError('');
    return true;
};

const validatePassword = (password, setPasswordError) => {
    if (password === '') {
        setPasswordError('*Password is required');
        return false;
    }else if(password.length <= 5){
        setPasswordError('*Password length must be atleast 6');
        return false;
    }
    setPasswordError('');
    return true;
};


function Login({navigation}){
    const [email, onChangeUsername] = useState('');
    const [password, onChangePassword] = useState('');

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();


    useFocusEffect(
        React.useCallback(() => {
          const onBackPress = () => {
            // Optionally do something when the back button is pressed
            // ...
            navigation.navigate('Welcome')
            // Prevent going back to Signup
            return true;
          };
    
          // Add back button listener
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          // Remove listener on unmount
          return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
      );


    const handleSubmit = () => {
        const isEmailValid = validateEmail(email, setEmailError);
        const isPasswordValid = validatePassword(password, setPasswordError);

        if (!isEmailValid || !isPasswordValid) {
            // Don't submit if validation fails
            return;
        }

        setIsLoading(true); // Start loading

        const loginData = {
            email: email, // Replace with the actual email
            password: password,  // Replace with the actual password
        };

        var token;

        api.post('/Event/AppLogin', loginData)
        .then((response) => {
            // Handle the successful response here
            console.log('Login Successful:', response.data);
            token = response.data.message
            api.get('/Event/loggedUser', {
                params: {
                  token: response.data.message,
                },
            })
            .then((response) => {
                console.log('Data:', response.data);
                //setUser({...response.data, token: token})
                dispatch(setUserData({...response.data, token: token}));
                navigation.navigate("MainApp")
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setPasswordError('*Incorrect password or email');
                setIsLoading(false);
            });
        })
        .catch((error) => {
            // Handle any errors here
            console.error('Login Error:', error);
            setIsLoading(false);

        });
    }
    

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
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeUsername}
                            value={email}
                            placeholder='Email'
                            autoCapitalize='none'
                            placeholderTextColor='#d1d1d1'
                        />
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangePassword}
                            value={password}
                            placeholder='Password'
                            secureTextEntry={true}
                            placeholderTextColor='#d1d1d1'
                        />
                        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                    </View>

                    <TouchableOpacity onPress={handleSubmit} style={styles.button} disabled={isLoading}>
    {isLoading ? (
        <ActivityIndicator size={31} color="#FFFFFF" />
    ) : (
        <Text style={{...styles.text, color: 'white'}}>Sign in</Text>
    )}
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
      alignItems: 'center'
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
    errorText: {
        color: 'red',
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        marginTop: 3,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
        backgroundColor: 'transparent', 
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center'
    },
    inputContainer: {
        height: 70, // Adjust this value based on your design needs
        width: '100%',
    },
    input: {
        width: '100%', // Adjust width as needed
        height: 45,    // Set a fixed height or adjust as needed
        color: 'white',
        borderBottomWidth: 1, // Add a bottom border
        borderBottomColor: 'white', // Set the color for the bottom border
        fontFamily: 'Montserrat_400Regular',
    },
  });


export default Login