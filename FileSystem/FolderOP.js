import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';


export const listDirectoryContents = async (directory) => {
    try {
        const dirInfo = await FileSystem.readDirectoryAsync(directory);
        console.log(`Contents of ${directory}:`, dirInfo);
    } catch (error) {
        console.error(`Error reading ${directory}:`, error);
    }
};


export const deleteFolder = async (directory) => {
    try {
        // Check if the directory exists
        const dirExists = await FileSystem.getInfoAsync(directory);
        if (dirExists.exists) {
            // Delete the directory and its contents
            await FileSystem.deleteAsync(directory, { idempotent: true });
            console.log(`Deleted contents of ${directory}`);
        } else {
            console.log(`Directory ${directory} does not exist.`);
        }
    } catch (error) {
        console.error(`Error deleting ${directory}:`, error);
    }
};

export const createFile = async (filePath, fileContent) => {
    try {
        await FileSystem.writeAsStringAsync(filePath, fileContent);
        console.log('File created successfully!');
    } catch (error) {
        console.error('Error creating file:', error);
    }
};


const FileInterogation = () => {

    const documentDirectory = FileSystem.documentDirectory;
    const cacheDirectory = FileSystem.cacheDirectory;
    const sqliteDirectory = `${documentDirectory}SQLite`;

    const listDirectoryContents = async (directory) => {
        try {
            const dirInfo = await FileSystem.readDirectoryAsync(directory);
            console.log(`Contents of ${directory}:`, dirInfo);
        } catch (error) {
            console.error(`Error reading ${directory}:`, error);
        }
    };

    const deleteFolderContents = async (directory) => {
        try {
            // Check if the directory exists
            const dirExists = await FileSystem.getInfoAsync(directory);
            if (dirExists.exists) {
                // Delete the directory and its contents
                await FileSystem.deleteAsync(directory, { idempotent: true });
                console.log(`Deleted contents of ${directory}`);
            } else {
                console.log(`Directory ${directory} does not exist.`);
            }
        } catch (error) {
            console.error(`Error deleting ${directory}:`, error);
        }
    };

    const createSQLiteFolder = async () => {
        try {
            const documentDirectory = FileSystem.documentDirectory;
            const sqliteDirectory = `${documentDirectory}SQLite`;

            // Check if the SQLite directory exists, create if it doesn't
            const dirInfo = await FileSystem.getInfoAsync(sqliteDirectory);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(sqliteDirectory, { intermediates: true });
            }


            console.log('SQLite folder created.');
        } catch (error) {
            console.error('Error creating SQLite folder', error);
        }
    };


}


