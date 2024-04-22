import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CameraComponent from '../Camera/CameraComponent'

const CreatePicture = ({ navigation }) => {
    return <CameraComponent navigation={navigation} />;
}

export default CreatePicture;
