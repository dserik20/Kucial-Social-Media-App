import { StyleSheet, Text, View, TextInput,RefreshControl,FlatList,  TouchableOpacity, SafeAreaView, Platform, NativeModules, Button, Pressable, ScrollView } from 'react-native';
const { StatusBarManager } = NativeModules;
import { Ionicons } from '@expo/vector-icons';
import { formatTime, formatDate } from '../utils/dateHelpers'; 
import React, { useState, useCallback } from 'react';
import { Image } from 'expo-image';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


function EventList ({onRefreshParent, navigation, posts}){

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Place your data refreshing logic here
    try {
      // For example, fetch new posts
      // await fetchNewPosts();
      onRefreshParent()
      console.log('Refreshing')
    } catch (error) {
      console.error(error);
    }
    setRefreshing(false);
  }, []);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('EventInfo', { post: item})} 
      key={index} style={{width: '95%', margin: 10, padding: 10,  borderRadius: 10 }}>
      <View style={{ flex: 1}}>
        <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
        <View style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }} />
        <View style={{ position: 'absolute', flexDirection: 'row', alignItems: 'center', left: '5%', top: '5%', backgroundColor: 'white', padding:10,borderRadius: 50, elevation: 20}}>
            <Ionicons name="person-outline" color={'black'} size={14} />
            <Text style={styles.participantCount}> {item.users_joining.length}</Text>
          </View>
        <View  style={styles.postInfoContainer}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}} >
            <Text style={styles.postOwner}>{item.ownerId}</Text>
            <Text style={{...styles.postOwner, color: 'grey'}}>{formatDate(item.event_date)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

    return (
      <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#ff0000", "#00ff00", "#0000ff"]}
          tintColor="#ff0000"
        />
      }
    />
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 50,
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
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        minWidth: '45%'
    },
    text: {
        fontSize: 16,
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
      bottom: '5%',
      elevation: 20
    }
    });
export default EventList