import { Camera, CameraType } from 'expo-camera';
import { StyleSheet, Text, View, TextInput, TouchableOpacity,ImageBackground, SafeAreaView, Platform, NativeModules, Button, Image, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';

const CameraPreview = ({photo}) => {
    console.log('sdsfds', photo.uri)
    return (
 
        <View
            style={{
                flex: 2,
            }}
        >
            <ImageBackground
                source={{uri: photo && photo.uri}}
                style={{
                flex: 1
                }}
            />
        </View>
    )
  }


let camera

function CameraScreen({setImage, setStartCamera}){
    const [previewVisible, setPreviewVisible] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)


    const __takePicture = async () => {
        if (!camera) return
        const photo = await camera.takePictureAsync()
        console.log(photo)
        setPreviewVisible(true)
        setCapturedImage(photo)

        setImage(photo.uri)
        setStartCamera(false)
    }

    const __switchCamera = () => {
        if (cameraType === 'back') {
          setCameraType('front')
        } else {
          setCameraType('back')
        }
      }

    return(
        <View
            style={{flex: 1}}>
            {previewVisible && capturedImage ? (
                <CameraPreview photo={capturedImage} />
            ) : (
                <Camera
                type={cameraType}
                style={{flex: 3,width:"100%"}}
                ref={(r) => {
                    camera = r
                }}
                ></Camera>
            )}
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={__switchCamera}
                    style={{
                    marginTop: 20,
                    borderRadius: 50,
                    height: 25,
                    width: 25
                    }}
                >
                    <Text

                        >
                    Flip
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={__takePicture}
                    style={{
                    width: 70,
                    height: 70,
                    bottom: 0,
                    borderRadius: 50,
                    backgroundColor: '#000'
                    }}
                    />
            </View>
        </View>
    )
}

export default CameraScreen