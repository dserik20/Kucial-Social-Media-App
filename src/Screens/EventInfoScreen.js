import React, { useEffect } from 'react';
import { View, Text, StyleSheet, NativeModules, ActivityIndicator,TouchableOpacity, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Import the hook for route parameters
const { StatusBarManager } = NativeModules;
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../api/axiosConfig'
import { useState } from 'react';
import { formatTime, formatDate } from '../utils/dateHelpers'; 
import { Image } from 'expo-image';


import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../redux/slices/userSlice';

const updateUser = (token) => {

  const dispatch = useDispatch();


  api.get('/Event/loggedUser', {
    params: {
      token: token,
    },
  })
  .then((response) => {
      console.log('Data:', response.data);
      dispatch(setUserData({...response.data, token: token}));
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}

const FavoriteButton = ({userData, post}) => {

  const [hasFavourited, setHasFavourited] = useState()
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    
    const isUserFavourited = post.users_liked.includes(userData.email);
    setHasFavourited(isUserFavourited);

  },[]);

  const handleFavouriteEvent = (token, eventId) => {
  
    setIsLoading(true)
    if(hasFavourited){
      api.delete('/Event/RemoveUserLikeFromPost', {data: { userToken: token, eventId: eventId }})
      .then((response) => {
        console.log("Success:", response.data);
        setHasFavourited(!hasFavourited)
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setIsLoading(false)
        updateUser(userData.token)
      });
    }else{
    api.post('/Event/AddUserLikeToPost', {userToken: token, eventId: eventId})
      .then((response) => {
        console.log("Success:", response.data);
        setHasFavourited(!hasFavourited)
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setIsLoading(false)
        updateUser(userData.token)
      });
    }
  }

  return (
    <TouchableOpacity onPress={() => handleFavouriteEvent(userData.token,post.postId)} style={{ ...styles.followButton,  borderColor: hasFavourited ? 'red' : 'green'}}>
      {isLoading ? 
      (
        <ActivityIndicator/>
      ) 
      : 
      (        
        <Text style={{ ...styles.text, fontSize: 14, color: 'white', textAlign: 'center' }}>{hasFavourited ? "Remove from Favorites" : "Add to Favorites"}</Text>
      )
      }
    </TouchableOpacity>
  )
}

const JoinButton = ({userData, post}) => {

  const [hasJoined, setHasJoined] = useState()
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    
    const isUserJoined = post.users_joining.includes(userData.email);
    setHasJoined(isUserJoined);

  },[]);

  const handleJoinEvent = (token, eventId) => {

    setIsLoading(true)
    if(hasJoined){
      api.delete('/Event/RemoveUserJoinFromEvent', {data: { userToken: token, eventId: eventId }})
      .then((response) => {
        console.log("Success:", response.data);
        setHasJoined(!hasJoined)
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setIsLoading(false)
        updateUser(userData.token)
      });
    }else{
      api.post('/Event/JoinEvent', {userToken: token, eventId: eventId})
      .then((response) => {
        console.log("Success:", response.data);
        setHasJoined(!hasJoined)
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setIsLoading(false)
        updateUser(userData.token)
      });
    }
    
  }

  return (
    <TouchableOpacity onPress={() => handleJoinEvent(userData.token,post.postId)} style={{ ...styles.followButton, borderColor: hasJoined ? 'red' : 'green'}}>
      {isLoading ? 
      (
        <ActivityIndicator/>
      ) 
      : 
      (
        <Text style={{ ...styles.text, fontSize: 14, color: 'white', textAlign: 'center' }}>{hasJoined ? "Leave" : "Join"}</Text>
      )
      }
    </TouchableOpacity>
  )
}


const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


function EventInfoScreen({navigation}) {
  const route = useRoute(); // Use the route hook to access parameters

  const post = route.params?.post || null; // Access the postId parameter
  const userData = useSelector(state => state.user.userData);

  const [hasFollowed, setHasFollowed] = useState()
  const [hasPending, setHasPending] = useState()


  useEffect(() => {
    const fetchData = async () => {
      // Fetch data based on postId
      const postData = await fetchPostData(route.params.postId);
      // Set state with fetched data
    };
    
    fetchData();
  }, [route.params.postId]);

  useEffect(() => {
    if (post && userData) {
      // Check if the user has joined
      console.log("User in info screen",userData)
      console.log("Event info screen", post)


      const isFollowed = userData.friends.includes(post.ownerId); 
      setHasFollowed(isFollowed)
      console.log("Is followed", isFollowed)

      const isPending = userData.out_requests.includes(post.ownerId);
      setHasPending(isPending)

      // Check if the user has favorited
      
    }
  }, [post, userData]);

  const handleFollowUser = (token, email) => {

    console.log(hasFollowed, token, email)
    if(hasFollowed){
      api.delete(`/Event/RemoveFriend?token=${token}&email=${email}`)
      .then((response) => {
        console.log("Success:", response.data);
        setHasFollowed(!hasFollowed)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }else if(hasPending){
      api.post(`/Event/CancelFriendRequest?token=${token}&email=${email}`)
      .then((response) => {
        console.log("Success:", response.data);
        setHasPending(!hasPending)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }else {
      api.post(`/Event/SendFriendRequest?token=${token}&email=${email}`)
      .then((response) => {
        console.log("Success:", response.data);
        setHasPending(!hasFollowed)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }
    
  }

  const handleDelete = () => {
    
    api.delete(`/Event/post?postId=${post.postId}`)
    .then((response) => {
        console.log('Data:', response.data);
        navigation.navigate('Home')
      })
    .catch((error) => {
        console.error('Error:', error);
    });
  }

  return (
    <View style={styles.container}>
      <View style={{flex:1,width: '90%'}}>
        <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
          <TouchableOpacity 
            onPress={() => navigation.goBack() } 
            style={{marginVertical: 10}}> 
            <Ionicons name="arrow-back" color={'white'} size={40} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={userData.email == post.ownerId ? handleDelete : null} 
            style={{marginVertical: 10}}> 
            <Ionicons name="trash" color={userData.email == post.ownerId ? 'white' : 'black'} size={40} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Image 
            placeholder={blurhash}
            source={{ uri: post.imageUrl }} style={styles.postImage} />
          <Text style={styles.title}>{post.title}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('OtherProfile', {email: post.ownerId})} style={{...styles.button, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{ ...styles.text, fontSize: 14, color: 'black' }}>{post.ownerId}</Text>
            </View>
            <TouchableOpacity onPress={() => handleFollowUser(userData.token,post.ownerId)} style={{...styles.pendingButton, backgroundColor: hasFollowed ? 'red' : (hasPending ? 'green' :'#3659e3')}}>
              <Text style={{ ...styles.text, fontSize: 14, color: 'white' }}>{hasFollowed ? "Unfollow" : (hasPending ? "Pending" : "Follow")}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <Ionicons name="calendar" color={'white'} size={30} />
            <View style={{marginLeft: 10}}>
              <Text style={{fontFamily: 'Montserrat_400Regular',fontSize: 14, color: 'white' }}>{formatDate(post.event_date)}</Text>
              <Text style={{fontFamily: 'Montserrat_400Regular',fontSize: 12, color: 'white' }}>{formatTime(post.event_date)}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Ionicons name="location" color={'white'} size={30} />
            <View style={{marginLeft: 10, justifyContent:'center'}}>
              <Text style={{fontFamily: 'Montserrat_400Regular',fontSize: 14, color: 'white' }}>Event Location: {post.location}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Ionicons name="cash" color={'white'} size={30} />
            <View style={{marginLeft: 10}}>
              <Text style={{fontFamily: 'Montserrat_400Regular',fontSize: 14, color: 'white' }}>Price</Text>
              <Text style={{fontFamily: 'Montserrat_400Regular',fontSize: 12, color: 'white' }}>{post.price} ₺</Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
            <JoinButton userData={userData} post={post}/>
            <FavoriteButton userData={userData} post={post}/>
          </View>
        </ScrollView>
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
  title:{
      fontSize: 28,
      color: 'white',
      paddingVertical: 10,
      marginVertical: 15,
      fontFamily: 'Montserrat_400Regular'
  },
  divider: {
    marginTop: '3%',
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
      paddingHorizontal: 16,
      borderRadius: 10,
      elevation: 3,
      backgroundColor: 'white',
      minWidth: '25%'
  },
  pendingButton: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    borderRadius: 10,
    width: '40%',
},
  followButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    elevation: 3,
    borderRadius: 10,
    width: '45%',
    height: '40%',
    borderWidth: 1
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
      borderRadius: 15,
  },
  avatarImage: {
    aspectRatio: 1, // 1:1 aspect ratio (square)
    width: '20%',  // You can adjust the width as needed
    alignSelf: 'center', // Center the image horizontally
    borderRadius: 5,
}
  });

export default EventInfoScreen;
