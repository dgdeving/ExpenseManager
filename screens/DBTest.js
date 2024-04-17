import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { setupDatabase, debugDatabase, listDBDetails, listTables, inspectTableSchema, closeDatabase, deleteDatabase, setupDatabaseWithValidation } from '../Data/Database';
import { listDirectoryContents, deleteFolder, createFile } from '../FileSystem/FolderOP'
import * as FileSystem from 'expo-file-system';



const DBTest = ({ navigation }) => {


    // useEffect(() => {

    //     setupDatabase();
    // }, []);

    const handleDBSetup = () => {
        setupDatabase();
    }

    const handleListTables = () => {
        listTables();
    }

    const handleListDbDetails = () => {
        listDBDetails();
    }

    const handleDbClose = () => {
        closeDatabase();
    }

    const handleDbDelete = () => {
        deleteDatabase();
    }

    const handleReadFolderContent = (folderAddress) => {
        listDirectoryContents(folderAddress);
    }

    const handleDeleteFolderContent = (folderAddress) => {
        deleteFolder(folderAddress);
    }

    const handleDebugDb = () => {
        debugDatabase();
    }

    const handleCreateFile = (filePath, fileContent) => {
        createFile(filePath, fileContent);
    }

    const handleDBSetupWithValidation = () => {
        setupDatabaseWithValidation((success) => {
            if (success) {
                console.log('Database setup with validation completed successfully.');
                // Additional logic or UI changes on success
                createFile(`${FileSystem.documentDirectory}SQLite/DbSetup.txt`, 'Database setup with validation completed successfully.')
            } else {
                console.error('Database setup with validation failed.');
                // Handle failure case
            }
        });
    };

    const handleListSchema = (tableName) => {
        inspectTableSchema(tableName);
    }

    return (
        <View style={styles.container}>
            <View style={styles.folderContentContainer}>
                <TouchableOpacity style={styles.buttonRow} onPress={() => handleDBSetup()}>
                    <Text style={styles.buttonText}>Db Setup</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonRow} onPress={() => handleDBSetupWithValidation()}>
                    <Text style={styles.buttonText}>Db Setup with Validation</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => handleListDbDetails()}>
                <Text style={styles.buttonText}>Db details</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => handleListTables()}>
                <Text style={styles.buttonText}>List Tables</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => handleDbClose()}>
                <Text style={styles.buttonText}>Close Db</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => handleDbDelete()}>
                <Text style={styles.buttonText}>Delete Db</Text>
            </TouchableOpacity>

            <View style={styles.folderContentContainer}>
                <TouchableOpacity style={styles.buttonRow} onPress={() => handleReadFolderContent(`${FileSystem.documentDirectory}SQLite`)}>
                    <Text style={styles.buttonText}>List content SQLite</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonRow} onPress={() => handleDeleteFolderContent(`${FileSystem.documentDirectory}SQLite`)}>
                    <Text style={styles.buttonText}>Delete SQLite Folder</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => handleDebugDb()}>
                <Text style={styles.buttonText}>Debug DB</Text>
            </TouchableOpacity>

            <View style={styles.folderContentContainer}>
                <TouchableOpacity style={styles.buttonRow} onPress={() => handleCreateFile(`${FileSystem.documentDirectory}SQLite/DbSetup.txt`, 'This is the content of my file!')}>
                    <Text style={styles.buttonText}>Create File</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonRow} onPress={() => handleReadFolderContent(`${FileSystem.documentDirectory}`)}>
                    <Text style={styles.buttonText}>List content Document Directory</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.folderContentContainer}>
                <TouchableOpacity style={styles.buttonRow} onPress={() => handleListSchema('Expenses')}>
                    <Text style={styles.buttonText}>List DB schema Expenses</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonRow} onPress={() => navigation.navigate('Expenses')}>
                    <Text style={styles.buttonText}>Expenses UI</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default DBTest

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