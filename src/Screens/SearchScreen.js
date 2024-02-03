import { StyleSheet, Text, View, TextInput, TouchableOpacity,KeyboardAvoidingView,  SafeAreaView, Platform, NativeModules, Button, Image, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
const { StatusBarManager } = NativeModules;
import { Ionicons } from '@expo/vector-icons';
import api from '../api/axiosConfig'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';


function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([])
    const navigation = useNavigation();

    const userData = useSelector(state => state.user.userData);

    const handleSearch = (query) => {
      setSearchQuery(query);
      console.log(userData)

      api.get(`/Event/SearchUsers?searchString=${query}`)
      .then((response) => {
        // Handle the successful response here
        setUsers(response.data)
        console.log('Data:', users);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
    };
  
    return (
            <View style={styles.container}>
                <View style={{flex:1, width: '90%', marginTop: 20}}>
                    <TextInput
                    style={styles.input}
                    placeholder="Search"
                    onChangeText={handleSearch}
                    value={searchQuery}
                    placeholderTextColor='grey'
                    />
                    <View style={{ flex: 1}}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center'}}>
                        {users.map((user, index) => (
                            <TouchableOpacity  
                                onPress={() => navigation.navigate('OtherProfile', {email: user.email})}
                                key={index} style={{ flexDirection: 'row', width: '100%',   padding: 10, borderRadius: 10 }}>
                                <View style={{width: '10%', justifyContent: 'center'}}>
                                    <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} />
                                </View>
                                <View style={{flex: 1, marginLeft: 10}}>
                                    <Text style={styles.userDisplayName}>{user.displayName}</Text>
                                    <Text style={styles.userSurname}>{user.username}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        </ScrollView>
                    </View>
                </View>
                
            </View>
    );
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 50,
    },
    imageBackground: {
      flex: 1,
      resizeMode: 'cover', // You can adjust the resizeMode as needed
    },
    title:{
        fontSize: 28,
        color: 'white',
        paddingVertical: 10,
        fontFamily: 'Montserrat_400Regular'
    },
    input: {
        height: 40,
        width: '100%',
        color: 'white',
        marginVertical: 5,
        borderBottomWidth: 1, // Add a bottom border
        borderBottomColor: '#ab162b', // Set the color for the bottom border
        fontFamily: 'Montserrat_400Regular',
        fontSize: 20

    },
    divider: {
        marginTop: '3%',
        borderBottomColor: '#393e46',
        borderBottomWidth: 1,
        alignSelf:'stretch'
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
    userDisplayName: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
    },
    userSurname: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
    },
    profileImage: {
        aspectRatio: 1, // 1:1 aspect ratio (square)
        width: '100%',  // You can adjust the width as needed
        alignSelf: 'center', // Center the image horizontally
        borderRadius: 100
    }
  });

export default SearchScreen
