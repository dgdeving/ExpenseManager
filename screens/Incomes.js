import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import IncomeRepository from '../Data/Repositories/IncomeRepository';

const Incomes = ({ navigation }) => {
    const [incomes, setIncomes] = useState([]);

    return (
        <View style={styles.container}>

            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Incomes</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateIncome')}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('DBTest')}>
                <Text style={styles.buttonText2}>Db Test</Text>
            </TouchableOpacity>
        </View>

    )
}

export default Incomes

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    titleContainer: {
        alignItems: 'center', // Horizontally center content
        marginTop: 20,
        marginBottom: 20,
    },
    button: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        borderRadius: 20,
        //backgroundColor: "#f14258",
        backgroundColor: "#ff6c00",
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        zIndex: 2,
    },
    button2: {
        position: 'absolute',
        bottom: 20,
        right: 70,
        borderRadius: 20,
        //backgroundColor: "#f14258",
        backgroundColor: "#ff6c00",

        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        zIndex: 2,
    },
    buttonText: {
        color: "white",
        fontSize: 30
    },
    buttonText2: {
        color: "white",
        fontSize: 10
    }
});