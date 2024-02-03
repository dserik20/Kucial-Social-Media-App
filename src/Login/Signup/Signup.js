import { View, Text, TouchableOpacity, StyleSheet, NativeModules } from "react-native"
import { useState } from "react";
import Signup1 from "./Signup1";
import Signup2 from "./Signup2";
import Signup3 from "./Signup3";
const { StatusBarManager } = NativeModules;


function Signup({navigation}){
    const [content, setContent] = useState('2')
    const [userInfo, setUserInfo] = useState({})
    const [image, setUserImage] = useState(null)


    const Content = () => {
        if(content === '1'){
            return <Signup1 setContent={setContent}/>
        }else if(content === '2'){
            return <Signup2 setUserInfo={setUserInfo} setContent={setContent} setUserImage={setUserImage}/>
        }else if(content === '3'){
            return <Signup3 userInfo={userInfo} navigation={navigation} userImage={image}/>
        }
    }
    return (
        <View style={styles.container}>
            <Content/>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#222831',
    },
    buttonContainer: {
        width: '80%'
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'Montserrat_400Regular',
        marginTop: '20%'
    },
    buttonText: {
        color: '#2e4374',
        fontSize: 24,
        fontFamily: 'Montserrat_400Regular',
      },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center'
    },
  });
export default Signup