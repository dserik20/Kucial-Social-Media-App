import { StyleSheet, Text, View, TextInput,Animated, TouchableOpacity, SafeAreaView, Platform, NativeModules, Button, Image, Pressable, ScrollView } from 'react-native';
import api from '../api/axiosConfig'
import {  useState } from "react";
const { StatusBarManager } = NativeModules;
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import React, {useRef, useEffect} from 'react';
import EventList from '../components/EventList';



function HomeScreen(props) {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState(0)
  const isFocused = useIsFocused();

  const userData = useSelector(state => state.user.userData);


  const navigation = useNavigation();

  const logo = {
    uri: 'https://reactnative.dev/img/tiny_logo.png',
  };

  useEffect(() => {
    console.log("User in homescreen", userData)
    api.get(`Event/PostsbyToken?token=${userData.token}`)
      .then((response) => {
        // Handle the successful response here
        setPosts(response.data)
        console.log('Data:', response.data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
  }, []);

  const handleAll = () => {
    setContent(0)
    api.get(`Event/PostsbyToken?token=${userData.token}`)
    .then((response) => {
      // Handle the successful response here
      setPosts(response.data)
      console.log('Data:', response.data);
    })
    .catch((error) => {
      // Handle any errors here
      console.error('Error:', error);
    });
  }

  const handleFriends = () => {
    setContent(1)
    api.get(`Event/PostsOfFriends?token=${userData.token}`)
      .then((response) => {
        // Handle the successful response here
        setPosts(response.data)
        console.log('Data:', response.data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
      });
  }

  return (
    <View style={styles.container}>
      <View 
        style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}}  
      >   
        <TouchableOpacity onPress={handleAll} style={styles.button}>
          <Text style={{...styles.text, textDecorationLine: content == 0 ? 'underline' : 'none', }}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFriends} style={styles.button}>
        <Text style={{...styles.text, textDecorationLine: content == 1 ? 'underline' : 'none', }}>Friends</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider}/>
      <View style={{ flex: 1}}>
        <EventList onRefreshParent={handleAll} navigation={navigation} posts={posts}/>
      </View>
    </View>

  );
}


const styles = StyleSheet.create({
container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 50,
  },
divider: {
  borderBottomColor: '#393e46',
  borderBottomWidth: 1,
  alignSelf:'stretch'
},
input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    color: 'black',
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
    fontSize: 20,
    color: '#ab162b',
    padding: 10,
    fontFamily: 'Montserrat_400Regular'
},
postTitle: {
  fontSize: 16,
  color: 'black',
  fontFamily: 'Montserrat_400Regular',
  paddingVertical: 10,
  paddingHorizontal: 16
},
postOwner: {
  fontSize: 12,
  color: 'black',
  fontFamily: 'Montserrat_400Regular',
  paddingHorizontal: 16,
  paddingBottom: 10
},
postDate: {
  fontSize: 12,
  color: 'white',
  fontFamily: 'Montserrat_400Regular'
},
postParticipants: {
  fontSize: 8,
  color: 'white',
  fontFamily: 'Montserrat_400Regular'
},
participantCount: {
  fontSize: 16,
  color: 'black',
  fontFamily: 'Montserrat_400Regular'
},
postImage: {
    aspectRatio: 4/3, // 1:1 aspect ratio (square)
    width: '100%',  // You can adjust the width as needed
    alignSelf: 'center', // Center the image horizontally
    borderRadius: 15,
},
postInfoContainer: {
  position: 'absolute',
  backgroundColor: 'white',
  borderRadius: 10,
  width: '90%',
  left: '5%',
  right: '5%',
  bottom: '5%'
}
});

export default HomeScreen