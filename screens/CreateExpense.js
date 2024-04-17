import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import ExpenseRepository from '../Data/Repositories/ExpenseRepository';
import CategoryRepository from '../Data/Repositories/CategoryRepository';
import RecurrenceRepository from '../Data/Repositories/RecurrenceRepository';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';



const CreateExpense = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [recurrences, setRecurrences] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedRecurrence, setSelectedRecurrence] = useState(null);
    const [description, setDescription] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [amount, setAmount] = useState(null);

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false); // Hide the date picker after selection
        if (selectedDate) {
            setSelectedDate(selectedDate);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchRecurrences();
    }, []);

    const fetchCategories = async () => {
        try {
            const categoriesData = await CategoryRepository.getAllCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchRecurrences = async () => {
        try {
            const recurrencesData = await RecurrenceRepository.getAllRecurrences();
            setRecurrences(recurrencesData);
        } catch (error) {
            console.error('Error fetching recurrences:', error);
        }
    };

    const addExpense = async (description, selectedDate, amount, categoryId, reoccurrenceId) => {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        try {
            const insertedId = await ExpenseRepository.createExpense(description, formattedDate, amount, categoryId, reoccurrenceId);
            console.log('Inserted expense ID:', insertedId);
            if (insertedId) {
                navigation.navigate('Expenses');
            }
        } catch (error) {
            console.error('Error inserting expense:', error);
        }
    };







    return (
        <View style={styles.container}>
            <View>
                <View style={styles.rowContainer}>
                    <View style={styles.tagContainer}>
                        <Text>Amount</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        {/* Add input for amount */}
                        <TextInput
                            style={styles.input}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                            onChangeText={(text) => setAmount(text)}
                        />
                    </View>
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.tagContainer}>
                        <Text>Description</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        {/* Add input for description */}
                        <TextInput
                            style={styles.input}
                            placeholder="Enter description"
                            onChangeText={(text) => setDescription(text)}
                        />
                    </View>
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.tagContainer}>
                        <Text>Date</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TouchableOpacity onPress={showDatepicker} >
                            <Text style={[styles.input, { textAlignVertical: 'center' }]}>{selectedDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={selectedDate}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}
                    </View>
                </View>



                <View style={styles.rowContainer}>
                    <View style={styles.tagContainer}>
                        <Text>Category</Text>
                    </View>
                    <Picker
                        selectedValue={selectedCategory}
                        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                        style={styles.pickerContainer}>

                        {categories.map((category) => (
                            <Picker.Item key={category.id} label={category.name} value={category.id} style={styles.picker} />
                        ))}
                    </Picker>
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.tagContainer}>
                        <Text>Reoccurence</Text>
                    </View>
                    <Picker
                        selectedValue={selectedRecurrence}
                        onValueChange={(itemValue) => setSelectedRecurrence(itemValue)}
                        style={styles.pickerContainer}>
                        {recurrences.map((recurrence) => (
                            <Picker.Item key={recurrence.id} label={recurrence.type} value={recurrence.id} style={styles.picker} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.button}
                    onPress={() => {
                        addExpense(description, selectedDate, amount, selectedCategory, selectedRecurrence);
                    }}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};






export default CreateExpense

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',

    },

    header: {
        marginBottom: 50,
        alignItems: 'center', // Center items horizontally
    },

    footer: {
        marginTop: 50,
        alignItems: 'center', // Center items horizontally
    },

    headerText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    rowContainer: {

        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'center', // Center items horizontally
        marginBottom: 20,
        paddingHorizontal: 50, // Padding for inner content

    },

    inputContainer: {
        flex: 1,
        backgroundColor: 'lightgray',
        //borderRadius: 8,
        marginHorizontal: 20,
        justifyContent: 'center',
        paddingHorizontal: 10,

    },
    input: {
        height: 40,
        color: 'black',
    },
    tagContainer: {
        width: 100
    },
    pickerContainer: {
        width: 150, // Set the width of the picker container
        height: 40, // Set the height of the picker container
        borderRadius: 8, // Optional border radius
        backgroundColor: 'lightgray', // Optional background color
        marginHorizontal: 20, // Adjust margin if needed

    },
    picker: {
        width: '100%', // Ensure picker fills the container
        height: '100%', // Ensure picker fills the container
        color: 'black', // Optional text color
        fontSize: 14
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
        color: "white",
        fontWeight: 'bold',

    }
})