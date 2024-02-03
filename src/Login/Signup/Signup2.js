import { View, Text, TouchableOpacity,Image,Alert,ScrollView, KeyboardAvoidingView, TextInput,StyleSheet, NativeModules } from "react-native"
const { StatusBarManager } = NativeModules;
import Checkbox from 'expo-checkbox';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';

function Signup2({setContent, setUserInfo, setUserImage}){
    const [isChecked, setChecked] = useState(false);
    const [info, setInfo] = useState({});
    const [image, setImage] = useState(null);

    

    const handleSubmit = () => {
       
        if (!info.displayName || !info.username || !info.email || !info.password || !image || !isChecked) {
          Alert.alert('','Please fill in all the fields.',[
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {
            cancelable: true,
          });
        } else {
            if (info.email.endsWith("@ku.edu.tr")) {
              setUserInfo({ ...info });
              setUserImage(image);
              setContent('3');
            } else {
              console.error('Invalid email domain. Must end with "@ku.edu.tr"');
            }
          }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
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
    
    return (
      <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Adjust as needed
      >
        <ScrollView style={{ flex: 1,width: '100%'}}         
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, alignItems: 'center'}}>
            <Text style={styles.title}>Sign Up</Text>
            <View style={styles.form}>
                <TouchableOpacity onPress={pickImage} style={styles.imgContainer}>
                    {image ? <Image source={{ uri: image }} style={styles.img}/> :(
                        <View style={styles.placeholderImg}>
                          <Ionicons name="add-outline" color={"white"} size={75} />
                        </View> 
                    )}
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    autoCapitalize='none'
                    placeholderTextColor='grey'
                    placeholder='Display name'
                    onChangeText={(text) => setInfo({ ...info, displayName: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Username'
                    autoCapitalize='none'
                    placeholderTextColor='grey'
                    onChangeText={(text) => setInfo({ ...info, username: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    autoCapitalize='none'
                    placeholderTextColor='grey'
                    onChangeText={(text) => setInfo({ ...info, email: text })}
                    />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setInfo({ ...info, password: text })}
                    secureTextEntry
                    autoCapitalize='none'
                    placeholderTextColor='grey'
                    placeholder='Password'
                />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Checkbox
                        style={styles.checkbox}
                        value={isChecked}
                        onValueChange={setChecked}
                        color={isChecked ? '#4630EB' : undefined}
                    />
                    <Text style={styles.checkBoxText}>I agree with Terms & Conditions</Text>
                </View>
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      alignItems: 'center',
      paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 50,
    },
    form: {
        width: '80%',
        gap: 15
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'Montserrat_400Regular',
        marginTop: '20%',
        marginBottom: '10%'
    },
    checkBoxText: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'Montserrat_400Regular',
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'Montserrat_400Regular',
    },
    input: {
      height: 40,
      width: '100%',
      color: 'white',
      borderWidth: 1, 
      borderColor: 'white',
      borderRadius: 10,
      fontFamily: 'Montserrat_400Regular',
      fontSize: 14,
      padding: 10
    },
    img: {
      width: '75%',
      aspectRatio: 1, 
      borderRadius: 200,
      borderWidth: 1,
      borderColor: 'white',
    },
    imgContainer: {
      width: '100%',
      marginBottom: 25,
      alignItems: 'center'
    },
    placeholderImg: {  
      aspectRatio: 1,
      width: '75%',  
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 200,
      justifyContent: 'center',
      alignItems:'center' 
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        borderColor: 'white'
    },
    buttonPic: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#1e9bd4',
        marginTop: 10
    },
    checkbox: {
        marginRight: 8,
        height: 30,
        width: 30,
        borderRadius: 5
      },
  });
export default Signup2