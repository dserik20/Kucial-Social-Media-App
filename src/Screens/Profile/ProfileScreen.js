import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, Image,NativeModules } from "react-native"
import { Ionicons } from '@expo/vector-icons';
const { StatusBarManager } = NativeModules;
import { useState, useEffect } from "react";
import api from '../../api/axiosConfig'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import EventList from "../../components/EventList";

import { formatTime, formatDate } from '../../utils/dateHelpers'; 
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from "../../redux/slices/userSlice";

function ProfileScreen({navigation}){
    const [posts, setPosts] = useState([])
    const isFocused = useIsFocused();
    

    const userData = useSelector(state => state.user.userData);
    const dispatch = useDispatch();



    useEffect(() => {
        console.log("Mounting profile")
        // Perform GET request when the component mounts
        api.get(`/Event/PostsOfUser?token=${userData.token}&email=${userData.email}`)
        .then((response) => {
            // Handle the successful response here
            setPosts(response.data)
            console.log('Data posts in profile:', response.data);
            console.log(posts.length)
          })
          .catch((error) => {
            // Handle any errors here
            console.error('Error:', error);
          });
    }, [userData, isFocused]);

    const handleExit = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
            })
        );

        setTimeout(() => {
            dispatch(setUserData(null));
        }, 1000);
    }

    return(
        <View style={styles.container}>
            <View style={styles.container1}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="exit-outline" color={"black"} size={25}/>
                </TouchableOpacity>
                <Text style={styles.text}>@{userData.username}</Text>
                <TouchableOpacity onPress={handleExit} style={styles.iconButton}>
                    <Ionicons name="exit-outline" color={"white"} size={25}/>
                </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
                <View style={styles.container2}>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('EditProfile')} 
                        style={styles.profileImgContainer}>
                        <Image source={{uri: userData.profileImageUrl}} style={styles.profileImg}/>
                        <View
                            style={{position: 'absolute', right: -5, bottom: -5}}>
                            <Ionicons name="create-outline" color={"white"} size={30}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{flex:1,flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center'}}>
                        <View style={{width:'80%'}}>
                            <View style={{width:'100%', flexDirection:'row', alignItems: 'center', justifyContent: 'center'}}>
                                <View style={{alignItems: 'center'}}>
                                    <Text style={styles.textNum}>{userData.friends.length}</Text>
                                    <Text style={styles.textFollow}>friends</Text>
                                </View>
                            </View>
                            <TouchableOpacity  onPress={() => navigation.navigate('FriendRequests')} style={{...styles.button, marginTop:10,}}>
                                    <Text style={{ ...styles.text, fontSize: 14 }}>Friend Requests</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </View>
                <View style={styles.divider}/>
                <View style={{padding:15}}>
                    <Text style={styles.text}>{userData.displayName}</Text>
                    <Text style={{...styles.text, fontSize: 14, paddingTop: 10}}>{userData.description}</Text>
                </View>
                <View style={styles.divider}/>            
                <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
                    {posts.length !== 0 ? (
                        <EventList navigation={navigation} posts={posts}/>
                    ) : (
                        <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name="calendar" color={"white"} size={150}/>
                            <Text style={{...styles.text, fontSize: 20}}>No upcoming events</Text>
                        </View>
                        
                    )}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 50,
        
    },
    container1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    container2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title:{
        fontSize: 28,
        color: 'white',
        paddingVertical: 10,
        fontFamily: 'Montserrat_400Regular'
    },
    input: {
        width: '100%', // Adjust width as needed
        height: 40,   // Set a fixed height or adjust as needed
        borderColor: '#00adb5',
        backgroundColor: 'white',
        color: 'grey',
        borderWidth: 2,
        borderRadius: 10,
        paddingLeft: 10,
        marginTop: 10
    },
    divider: {
        marginTop: '3%',
        borderBottomColor: '#393e46',
        borderBottomWidth: 1,
        alignSelf:'stretch'
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
    iconButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
    },
    iconCheck: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
      },
    textNum: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
    },
    textFollow: {
        fontSize: 16,
        color: 'grey',
        fontFamily: 'Montserrat_400Regular'
    },
    profileImgContainer:{
        aspectRatio: 1, // 1:1 aspect ratio (square)
        width: '25%',  // You can adjust the width as needed
        alignSelf: 'center', // Center the image horizontally
        margin: 20
    },
    profileImg: {
        aspectRatio: 1, // 1:1 aspect ratio (square)
        width: '100%',  // You can adjust the width as needed
        alignSelf: 'center', // Center the image horizontally
        borderRadius: 50,
    },
    clubImg: {
        aspectRatio: 1, // 1:1 aspect ratio (square)
        width: '40%',  // You can adjust the width as needed
        alignSelf: 'center', // Center the image horizontally
       
    },
    userDisplayName: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
    },
    username: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
    },
    profileImage: {
        aspectRatio: 1, // 1:1 aspect ratio (square)
        width: '100%',  // You can adjust the width as needed
        alignSelf: 'center', // Center the image horizontally
        borderRadius: 100
    },
    postTitle: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
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
        fontSize: 9,
        color: 'white',
        fontFamily: 'Montserrat_400Regular'
      },
      postImage: {
          aspectRatio: 4/3, // 1:1 aspect ratio (square)
          width: '100%',  // You can adjust the width as needed
          alignSelf: 'center', // Center the image horizontally
          borderRadius: 5
      }
});


export default ProfileScreen