import { Camera, CameraType } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReturnIcon from "./../assets/Icons/return_icon.svg";
import uploadImage from "../Data/UploadService";
import postUrlToApi from "../Data/ApiCallerService";

import { deleteFolder } from '../FileSystem/FolderOP'

const CameraComponent = ({ navigation }) => {

  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const [imageUri, setImageUri] = useState(null); // New state for image URI
  const cameraRef = useRef(null); // Ref to access camera methods

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  const takePicture = async () => {
    //console.log(cameraRef.current);
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const photo = await cameraRef.current.takePictureAsync(options);
      console.log(photo.uri); // Log the image URI to the console
      setImageUri(photo.uri); // Set the image URI to display the picture

      // logic moved to processPicture
      // try {
      //   const downloadURL = await uploadImage(photo.uri);
      //   console.log('Download URL:', downloadURL);

      //   const apiResponse = await postUrlToApi(downloadURL);
      //   console.log('API Response:', apiResponse);
      // } catch (error) {
      //   console.error('Error during upload or API call:', error);
      // }
    }
  };


  const processPicture = async () => {
    try {
      const downloadURL = await uploadImage(imageUri);
      console.log('Download URL:', downloadURL);

      //deleteing file after it was uploaded to the server
      deleteFolder(imageUri);

      const apiResponse = await postUrlToApi(downloadURL);
      console.log('API Response:', apiResponse);

      navigation.navigate('CreateExpense', { receipt: apiResponse });
    } catch (error) {
      console.error('Error during upload or API call:', error);
    }
  }


  const returnToCamera = () => {
    if (imageUri) {
      deleteFolder(imageUri);
    }
    setImageUri(null); // Clear the image URI, returning to camera view
  };


  return (
    <SafeAreaView style={styles.container}>
      {imageUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={returnToCamera}>
              <Text style={styles.returnButtonText}>Return</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={processPicture}>
              <Text style={styles.returnButtonText}>ProcessPicture</Text>
            </TouchableOpacity>
          </View>

        </View>
      ) : (
        <Camera ref={cameraRef} style={styles.camera} type={type}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => {
              navigation.navigate('CreateExpense');
            }}>
              <ReturnIcon width={25} height={25} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </SafeAreaView>
  );

}

export default CameraComponent;

const styles = StyleSheet.create({
  container: {

    flex: 1,
    justifyContent: 'center',

  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute', // Add positioning
    flexDirection: 'row',
    backgroundColor: 'transparent',
    bottom: 20, // Position at the bottom like the return button
    left: 20, // Keep consistent spacing
    right: 20, // Keep consistent spacing
    justifyContent: 'space-between', // Spread the buttons across the container
  },

  button: {
    alignSelf: 'center',
    alignItems: 'center',
  },

  text: {
    fontSize: 24, // Adjust size as needed
    color: 'white',
    fontWeight: 'bold',
  },


  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch', // Add this line
  },
  returnButton: {
    position: 'absolute',
    bottom: 20,
    // left: 20,
    // right: 20,
    // backgroundColor: '#fff',
    // padding: 10,
    // borderRadius: 5,
    alignItems: 'center',
  },
  returnButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

});
