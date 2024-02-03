import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, Image,NativeModules } from "react-native"
import { useState, useEffect } from "react";
const { StatusBarManager } = NativeModules;
import api from '../../api/axiosConfig'
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';


const FriendRequestsScreen = ({navigation}) => {
    const [friendRequests, setFriendRequests] = useState([])

    const userData = useSelector(state => state.user.userData);

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

    const handleAccept = (friendRequest) => {
        api.post(`/Event/AcceptFriendRequest?token=${userData.token}&email=${friendRequest.email}`)
        .then((response) => {
            // Handle the successful response here
            updateFriendRequest()
            console.log('Data posts in profile:', response.data);
        })
        .catch((error) => {
            // Handle any errors here
            console.error('Error:', error);
        });

    }

    const updateFriendRequest = () => {
        api.get(`/Event/InFriendRequests?token=${userData.token}`)
            .then((response) => {
                // Handle the successful response here
                setFriendRequests(response.data)
                console.log('Data friend requests in profile:', response.data);
            })
            .catch((error) => {
                // Handle any errors here
                console.error('Error:', error);
            });
    }

    const handleReject = (friendRequest) => {
        
        api.post(`/Event/DenyFriendRequest?token=${userData.token}&email=${friendRequest}`)
        .then((response) => {
            // Handle the successful response here
            updateFriendRequest()
            console.log('Data posts in profile:', response.data);
        })
        .catch((error) => {
            // Handle any errors here
            console.error('Error:', error);
        });
    }

    useEffect(() => {
        updateFriendRequest()
    }, []);

    return(
        <View style={styles.container}>
            <View style={styles.container1}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Ionicons name="arrow-back-outline" color={"white"} size={25}/>
                </TouchableOpacity>
                <Text style={styles.text}>Friend Requests</Text>
                <TouchableOpacity onPress={handleExit} style={styles.iconButton}>
                    <Ionicons name="exit-outline" color={"white"} size={25}/>
                </TouchableOpacity>
            </View>
            <View style={{width: '90%'}}>
                <View style={{ height: '90%', marginTop:15}}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center'}}>
                    {friendRequests.map((userData, index) => (
                        <TouchableOpacity  
                            onPress={() => navigation.navigate('OtherProfile', {email: userData.email})}
                            key={index} style={{ flexDirection: 'row', justifyContent:'space-between', width: '100%',   padding: 10, borderRadius: 10 }}>
                            <View style={{width:'70%', flexDirection: 'row', alignItems:'center'}}>
                                <View style={{width: '20%', justifyContent: 'center'}}>
                                    <Image source={{ uri: userData.profileImageUrl }} style={styles.profileImage} />
                                </View>
                                <View style={{flex: 1, marginLeft: 10}}>
                                    <Text style={styles.userDisplayName}>{userData.displayName}</Text>
                                    <Text style={styles.username}>{userData.username}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity onPress={() => handleAccept(userData)} style={{...styles.iconCheck, marginRight: 10}}>
                                    <Ionicons name="checkmark-outline" color={"white"} size={25} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleReject(userData)} style={styles.iconCheck}>
                                    <Ionicons name="close-outline" color={"white"} size={25} />
                                </TouchableOpacity>
                            </View>
                            
                            
                        </TouchableOpacity>
                    ))}
                    </ScrollView>
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
        alignItems: 'center'
    },
    container1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    container2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title:{
        fontSize: 28,
        color: 'white',
        marginTop: 10,
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 10,
        elevation: 1,
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
    profileImg: {
        aspectRatio: 1, // 1:1 aspect ratio (square)
        width: '25%',  // You can adjust the width as needed
        alignSelf: 'center', // Center the image horizontally
        borderRadius: 50,
        margin: 20
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

export default FriendRequestsScreen