import { View, Text, StyleSheet, NativeModules, Image, TouchableOpacity,ScrollView } from "react-native"
const { StatusBarManager } = NativeModules;
import { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import api from '../api/axiosConfig'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { set } from "date-fns";

import { formatTime, formatDate } from '../utils/dateHelpers'; 
import { useSelector, useDispatch } from 'react-redux';

import EventList from "../components/EventList";


function FavoriteScreen(){
    const [favouriteEvents, setFavouriteEvents] = useState([])
    const [joinedEvents, setJoinedEvents] = useState([])
    const [clubs, setClubs] = useState([])
    const [friends, setFriends] = useState([])
    const [content, setContent] = useState(0)
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const userData = useSelector(state => state.user.userData);

    const [isLoading, setIsLoading] = useState(false)
    

    const UsersList = ({users}) => {

        return (
                <View style={{ width: '100%'}}>
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
                                <Text style={styles.username}>{user.username}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    </ScrollView>
                </View>
        )
    }

    const Content = () => {
        if(content == 0){
            return <EventList navigation={navigation} posts={favouriteEvents}/>
        }else if(content == 1){
            return <UsersList users={clubs}/>
        }else if(content == 2){
            return <UsersList users={friends}/>
        }else if(content == 3){
            return <EventList navigation={navigation} posts={joinedEvents}/>
        }
    }

    useEffect(() => {

        setIsLoading(true)

        console.log("Mounting favouriteScreen")
        api.get(`/Event/LikedPostsOfUser?token=${userData.token}`)
          .then((response) => {
            setFavouriteEvents(response.data)
            console.log('Data:', response.data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });

          api.get(`/Event/JoiningPostsOfUser?token=${userData.token}`)
          .then((response) => {
            setJoinedEvents(response.data)
            console.log('Data:', response.data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });

        api.get(`/Event/FollowedClubs?token=${userData.token}`)
        .then((response) => {
            setClubs(response.data)
            console.log('Data clubs:', response.data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        api.get(`/Event/Friends?token=${userData.token}`)
        .then((response) => {   
            setFriends(response.data)
            console.log('Data clubs:', response.data);
        })
        .catch((error) => {
            console.error('Error:', error);
        })
        .finally(() => {
            setIsLoading(false)
        });

        
      }, [userData, isFocused]);

    return(
        <View style={styles.container}> 
            <View style={{flex: 1, width: '100%', alignItems: 'center', marginTop: 20}}>
                <View style={{width: '90%'}}>
                    <Text style={styles.title}>Favorites</Text>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => setContent(0)}>
                            <Text style={{...styles.textButton, textDecorationLine: content == 0 ? 'underline' : 'none'}}>
                                Events
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setContent(1)}>
                        <Text style={{...styles.textButton, textDecorationLine: content == 1 ? 'underline' : 'none'}}>
                                Clubs
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setContent(2)}>
                            <Text style={{...styles.textButton, textDecorationLine: content == 2 ? 'underline' : 'none'}}>
                                Friends
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setContent(3)}>
                            <Text style={{...styles.textButton, textDecorationLine: content == 3 ? 'underline' : 'none'}}>
                                Joining
                            </Text>
                        </TouchableOpacity>
                    </View>
                <View style={styles.divider}/>
                </View>
                {isLoading ? null : <Content/>}
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
    title:{
        fontSize: 28,
        color: 'white',
        paddingVertical: 10,
        fontFamily: 'Montserrat_400Regular'
    },
    divider: {
      marginTop: '3%',
      borderBottomColor: '#ab162b',
      marginBottom: 10,
      borderBottomWidth: 1,
      alignSelf:'stretch'
    },
    textButton: {
        fontSize: 16,
        color: '#ab162b',
        fontFamily: 'Montserrat_400Regular',
        paddingRight: 15,
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
        fontSize: 16,
        color: 'white',
        padding: 10,
        fontFamily: 'Montserrat_400Regular'
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
    }
    });

export default FavoriteScreen