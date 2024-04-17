import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { listDirectoryContents, deleteFolder, createFile } from '../FileSystem/FolderOP'
import * as FileSystem from 'expo-file-system';

const handleReadFolderContent = (folderAddress) => {
    listDirectoryContents(folderAddress);
}

const handleDeleteFolderContent = (folderAddress) => {
    deleteFolder(folderAddress);
}

const PhotoTestHelper = () => {
    return (
        <View style={styles.container}>
            <View style={styles.folderContentContainer}>
                <View style={styles.folderContentContainer}>
                    <TouchableOpacity style={styles.buttonRow} onPress={() => handleReadFolderContent(`${FileSystem.cacheDirectory}ExperienceData/%2540anonymous%252FExpenseManager-62771c1f-e091-4de5-9443-efab43aa7060/Camera/`)}>
                        <Text style={styles.buttonText}>List content CameraFolder</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonRow} onPress={() => handleDeleteFolderContent(`${FileSystem.cacheDirectory}ExperienceData/%2540anonymous%252FExpenseManager-62771c1f-e091-4de5-9443-efab43aa7060/Camera/`)}>
                        <Text style={styles.buttonText}>Delete Camera Folder</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default PhotoTestHelper

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',

    },
    button: {
        borderRadius: 50,
        backgroundColor: "#f86464",
        width: 200,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        marginBottom: 20,
    },
    buttonText: {
        color: "white"
    },

    folderContentContainer: {
        flexDirection: 'row',
        justifyContent: "space-around",
        width: 350
    },

    buttonRow: {
        borderRadius: 50,
        backgroundColor: "#f86464",
        width: 150,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        marginBottom: 20,
    }
})