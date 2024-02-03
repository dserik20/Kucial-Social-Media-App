import { View, Text, StyleSheet, Platform, Alert, TextInput, Modal, ActivityIndicator, TouchableOpacity, ScrollView, Image,NativeModules } from "react-native"
import { useState, useEffect } from "react";
const { StatusBarManager } = NativeModules;
import api from '../../api/axiosConfig'
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { setUserData } from "../../redux/slices/userSlice";
import { CommonActions } from '@react-navigation/native';


const EditProfileScreen = ({navigation}) => {
    const userData = useSelector(state => state.user.userData);

    const [displayName, onChangeDisplayName] = useState(userData.displayName);
    const [description, onChangeDescription] = useState(userData.description);
    const [image, setImage] = useState(userData.profileImageUrl);

    const [isLoading, setIsLoading] = useState(false);
    const [postStatus, setPostStatus] = useState(-1) //0 success, 1 error

    const dispatch = useDispatch();

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


    
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
  
        //console.log(result);
  
        if (!result.canceled) {
          // Get the URI of the selected image
          const imageUri = result.assets[0].uri;
  
          setImage(imageUri)
          // Download the image data from the URI
          const response = await fetch(imageUri);
          const imageBuffer = await response.arrayBuffer();
  
          setImage({
            name: 'image.jpg', // Name of the file to be sent
            type: 'image/jpeg', // MIME type of the file
            uri: imageUri,
            data: imageBuffer, // The image data as a buffer
          })
        }
      };


    const isValidForm = () => {
        if(description == userData.description && displayName == userData.displayName && image == userData.profileImageUrl){
            Alert.alert('','You did not edit anything',[
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              {
                cancelable: true,
              });
              //alert("Please fill all the fields.");
              return false;
        }
        else if (!description || !displayName || !image) {

            Alert.alert('','Please fill all the fields.',[
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {
              cancelable: true,
            });
            //alert("Please fill all the fields.");
            return false;
        }
  
        return true;
      };


    const postEdit = () => {


        if (!isValidForm()) return;
  
        const formData = new FormData();
        formData.append('profileImg', image)
        formData.append('displayName', displayName);
        formData.append('description', description);
        formData.append('token', userData.token);
  
        console.log(formData)
  
        setIsLoading(true); // Start loading
        setPostStatus(-1)
  
        api.put(`/Event/EditUser`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
        })
        .then(response => {
            console.log(response.data);
            setPostStatus(0)

            api.get('/Event/loggedUser', {
                params: {
                  token: userData.token,
                },
            })
            .then((response) => {
                console.log('Data:', response.data);
                dispatch(setUserData({...response.data, token: userData.token}));
            })
            .catch((error) => {
                console.error('Error:', error);
            });
  
            setTimeout(() => {
              navigation.goBack()
            }, 1000);
        })
        .catch(error => {
            if(error.response.data.message === 'No file uploaded.'){
            }
            setPostStatus(1)
            console.log(error.response.data.message);
        })
        .finally(() => {
          setTimeout(() => {
            setIsLoading(false);
            setPostStatus(-1)
          }, 1000);
        });
      }

    return (
        <View style={styles.container}>
            <Modal
            transparent={true}
            animationType="fade"
            visible={isLoading}
            >
            <View style={styles.modalBackground}>
              <View style={styles.activityIndicatorWrapper}>
                {postStatus == 1 ? (
                    <Text style={{ ...styles.text, fontSize: 20, color: 'white'}}>Could not edit profile :(</Text>
                      ) : (
                  postStatus == 0 ? (
                    <Text style={{ ...styles.text, fontSize: 20, color: 'white'}}>Profile edited :)</Text>
                    ) : (
                    <ActivityIndicator size="large" color="#ab162b" />
                  )
                )}
              </View>
            </View>
            </Modal>
            <View style={styles.container1}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Ionicons name="arrow-back-outline" color={"white"} size={25}/>
                </TouchableOpacity>
                <Text style={styles.text}>Edit</Text>
                <TouchableOpacity onPress={handleExit} style={styles.iconButton}>
                    <Ionicons name="exit-outline" color={"white"} size={25}/>
                </TouchableOpacity>
            </View>
            <View style={{width: '90%'}}>
                <TouchableOpacity onPress={pickImage} style={styles.imgContainer}>
                    {image ? <Image source={{ uri: image }} style={styles.img}/> :(
                        <Image source={{ uri: image }} style={styles.placeholderImg}/>
                    )}
                </TouchableOpacity>
                <Text style={{ ...styles.text, fontSize: 20, color: 'grey', marginTop: 10}}>Display name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeDisplayName}
                    placeholder="Display Name"
                    placeholderTextColor='grey'
                    value={displayName}
                />
                <Text style={{ ...styles.text, fontSize: 20, color: 'grey', marginTop: 20}}>Description</Text>
                <TextInput
                    style={{...styles.input, height: 100,
                    textAlignVertical: 'top'}}
                    onChangeText={onChangeDescription}
                    placeholder="Description"
                    multiline={true} 
                    numberOfLines={4}
                    maxLength={196}
                    value={description}
                    placeholderTextColor='grey'
                />
                <TouchableOpacity onPress={postEdit} style={styles.button}>
                      <Text style={{ ...styles.text, fontSize: 14}}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default EditProfileScreen

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
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(0,0,0,0.8)' // semi-transparent background
      },
      activityIndicatorWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
      },
    title:{
        fontSize: 28,
        color: 'white',
        marginTop: 10,
        fontFamily: 'Montserrat_400Regular'
    },
    input: {
        height: 40,
        width: '100%',
        color: 'white',
        marginVertical: 5,
        borderWidth: 1, 
        borderColor: 'white',
        borderRadius: 10,
        fontFamily: 'Montserrat_400Regular',
        fontSize: 14,
        padding: 10
      },
    divider: {
        marginTop: '3%',
        borderBottomColor: '#393e46',
        borderBottomWidth: 1,
        alignSelf:'stretch'
      },
    button: {
        maxWidth:'30%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        paddingVertical: 12,
        paddingHorizontal: 22,
        marginTop: 20,
        borderRadius: 10,
        elevation: 1,
        borderColor: 'white',
        borderWidth: 1,
        backgroundColor: '#ab162b'
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
      },
      imgContainer: {
        width: '100%',

        marginVertical: 5,
        alignItems: 'center'
      },
      img: {
        width: '60%',
        aspectRatio: 1, 
        borderRadius: 200,
        borderWidth: 1,
        borderColor: 'white',
      },
      placeholderImg: {  
        aspectRatio: 1,
        width: '60%',  
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 200,
        justifyContent: 'center',
        alignItems:'center' 
      }
});