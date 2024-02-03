import { View, Text, TouchableOpacity, Alert, ActivityIndicator, TextInput, StyleSheet, NativeModules} from "react-native"
const { StatusBarManager } = NativeModules;
import api from '../../api/axiosConfig'
import { useState, useEffect } from "react";




function Signup3({navigation, userInfo, userImage}){
    const [enteredCode, setEnteredCode] = useState('')
    const [code, setCode] = useState(0)
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        updateCode()
    }, []);

    const handleSubmit = () => {

        if(code > 0 && enteredCode == code){
            postUser()
        }else{
            Alert.alert('','Wrong code.',[
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              {
                cancelable: true,
              });
            console.log('Error wrong code')
        }
    }

    const handleResendCode = () => {
        updateCode()
    }
    
    const updateCode = () => {
        api.get('/Event/verifyEmail', {
            params: {
              email: userInfo.email,
            },
        })
            .then((response) => {
                console.log('Data:', response.data);
                setCode(response.data)
            })
            .catch((error) => {
              console.error('Error:', error);
            });
    }

    const postUser = () => {
        const formData = new FormData();
        formData.append('email', userInfo.email);
        formData.append('username', userInfo.username);
        formData.append('displayName', userInfo.displayName);
        formData.append('password', userInfo.password);
        formData.append('profileImg', userImage);


        setIsLoading(true)
        api.post('/Event/user', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        })
        .then((response) => {
            // Handle the successful response here
            console.log('Data:', response.data);
            //setUser(response.data);
            navigation.navigate('Login')
        })
        .catch((error) => {
            // Handle any errors here
            setIsLoading(false)
            console.error('Error:', error);
        })
        .finally((error) => {
            // Handle any errors here
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify Email</Text>
            <View style={styles.buttonContainer}>
                <Text style={{...styles.text, marginVertical: 20}}>Please, enter the verification code you've received on your email</Text>
                <TextInput
                    style={styles.input}
                    placeholder='XXXXXX'
                    onChangeText={(text) => setEnteredCode(text)}
                />
                <View style={{flexDirection: 'row', justifyContent:'center', marginTop: 20}}>
                    <Text style={styles.text}>I didn't receive a code. Please, </Text>
                    <TouchableOpacity onPress={!isLoading ? handleResendCode : null}>
                        <Text style={styles.resendCodeText}>re-send code</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={!isLoading ? handleSubmit : null} style={styles.button}>
                    {isLoading ? (
                        <ActivityIndicator/>
                    ) : (
                        <Text style={styles.buttonText}>Verify</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
        width: '80%'
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'Montserrat_400Regular',
    },
    text: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        textAlign: 'center',

      },
      resendCodeText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        textDecorationLine: 'underline',
      },
    input: {
        width: '100%', // Adjust width as needed
        height: 50,   // Set a fixed height or adjust as needed
        backgroundColor: 'white',
        color: '#2e4374',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        marginVertical: 10,
        fontFamily: 'Montserrat_400Regular'
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: '#2e4374',
        fontSize: 24,
        fontFamily: 'Montserrat_400Regular',
    },
  });
export default Signup3