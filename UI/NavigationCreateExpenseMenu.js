import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import BackIcon from "./../assets/Icons/back_icon.svg";
import CameraIcon from "./../assets/Icons/camera_icon.svg";

const NavigationCreateExpenseMenu = ({ navigation }) => {
    return (
        <View style={styles.titleContainer}>
            <TouchableOpacity style={styles.backIconContainer} onPress={() => {
                navigation.navigate('Expenses');
            }}>
                <BackIcon width={25} height={25} />
            </TouchableOpacity>
            <Text style={styles.titleText}>ADD</Text>
            <TouchableOpacity style={styles.cameraContainer} onPress={() => {
                navigation.navigate('CreatePicture');
            }}>
                <CameraIcon width={35} height={35} />
            </TouchableOpacity>
        </View>
    )
}

export default NavigationCreateExpenseMenu

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        marginTop: 25,
        alignItems: 'center',
        justifyContent: "center"
        //backgroundColor: "grey"
    },

    backIconContainer: {
        position: 'absolute', // Position the back icon absolutely
        left: 0, // Align it to the far left
    },
    titleText: {
        fontSize: 25,
        fontWeight: "500",
        color: '#f14258'
    },
    cameraContainer: {
        position: 'absolute', // Position the back icon absolutely
        right: 0, // Align it to the far left
    },
})