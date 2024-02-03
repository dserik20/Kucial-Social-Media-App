import { View, Text, TouchableOpacity, StyleSheet, NativeModules } from "react-native"
const { StatusBarManager } = NativeModules;


function Signup1({setContent}){

    const onClick = (userType) => {
        setContent('2')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Who are you?</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => onClick()} style={styles.button}>
                    <Text style={styles.buttonText}>I'm a Student</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onClick()} style={styles.button}>
                    <Text style={styles.buttonText}>I'm a Professor</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onClick()} style={styles.button}>
                    <Text style={styles.buttonText}>I'm an Organisation</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#222831',
      alignItems: 'center',
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
export default Signup1