import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import ExpenseRepository from '../Data/Repositories/ExpenseRepository';
import CategoryRepository from '../Data/Repositories/CategoryRepository';
import ReoccurrenceRepository from '../Data/Repositories/RecurrenceRepository';
import React, { useEffect, useState } from 'react';
import { categoryUIObjects } from '../constants/categoryTypes';
import { recurrenceUIObjects } from '../constants/recurrenceTypes';
import NavigationCreateExpenseMenu from "../UI/NavigationCreateExpenseMenu"
import ExpenseForm from "../UI/ExpenseForm"


const UpdateExpense = ({ navigation, route }) => {

    const id = route.params.expenseId;

    const [categories, setCategories] = useState([]);
    const [recurrences, setRecurrences] = useState([]);
    const [selectedUICategory, setSelectedUICategory] = useState(null);
    const [selectedUIRecurrence, setSelectedUIRecurrence] = useState(null);
    const [description, setDescription] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [amount, setAmount] = useState(null);
    const [categoryUIMapping, setCategoryUIMapping] = useState({});
    const [recurrenceUIMapping, setRecurrenceUIMapping] = useState({});

    useEffect(() => {
        fetchCategories();
        fetchRecurrences();
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            const mappedCategories = mapCategories(categoryUIObjects, categories);
            setCategoryUIMapping(mappedCategories);
        }
    }, [categories]);

    useEffect(() => {
        if (recurrences.length > 0) {
            const mappedRecurrences = mapRecurrences(recurrenceUIObjects, recurrences);
            setRecurrenceUIMapping(mappedRecurrences);
        }
    }, [recurrences]);

    useEffect(() => {
        if (categoryUIMapping !== null && recurrenceUIMapping !== null) {
            fetchExpenseDetails(id);
        }
    }, [categoryUIMapping, recurrenceUIMapping],);

    const renderCategoryIcons = () => {
        return categoryUIObjects.map((category) => (
            <TouchableOpacity
                key={category.id}
                style={[
                    styles.categoryIcon,
                    selectedUICategory === category.id && styles.selectedCategoryIcon
                ]}
                onPress={() => setSelectedUICategory(category.id)}
            >
                {category.icon}
            </TouchableOpacity>
        ));
    };


    const renderRecurrenceButtons = () => {
        //console.log(recurrence);
        return recurrenceUIObjects.map((recurrence) => (
            <TouchableOpacity
                key={recurrence.id}
                style={[
                    styles.recurrenceButton,
                    selectedUIRecurrence === recurrence.id && styles.selectedRecurrenceButton
                ]}
                onPress={() => setSelectedUIRecurrence(recurrence.id)}
            >
                <Text style={[styles.recurrenceButtonText, selectedUIRecurrence === recurrence.id && styles.selectedRecurrenceText]}>
                    {recurrence.label}
                </Text>
            </TouchableOpacity>
        ));
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false); // Hide the date picker after selection
        if (selectedDate) {
            setSelectedDate(selectedDate);
        }
    };

    const fetchExpenseDetails = async (expenseId) => {

        // console.log(expenseId);

        try {
            const expenseDetails = await ExpenseRepository.getExpenseById(expenseId);
            if (expenseDetails.length > 0) {
                const {
                    description: expenseDescription,
                    date: expenseDate,
                    amount: expenseAmount,
                    category_id: categoryId,
                    recurrence_id: recurrenceId,
                } = expenseDetails[0]; // Assuming getExpenseById returns an array
                setDescription(expenseDescription);
                setSelectedDate(new Date(expenseDate)); // Convert date string to Date object
                setAmount(expenseAmount.toString()); // Convert amount to string if needed
                // Set the selected category and recurrence based on fetched IDs
                setSelectedUICategory(getUICategoryFromMapping(categoryId));
                setSelectedUIRecurrence(getUIRecurrenceFromMapping(recurrenceId));
            }
        } catch (error) {
            console.error('Error fetching expense details:', error);
        }
    };

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
            const recurrencesData = await ReoccurrenceRepository.getAllRecurrences();
            setRecurrences(recurrencesData);
            //console.log(recurrencesData)
        } catch (error) {
            console.error('Error fetching recurrences:', error);
        }
    };

    const mapCategories = (uiObjects, fetchedCategories) => {
        return fetchedCategories.reduce((mapping, fetchedCategory) => {
            const matchedUIObject = uiObjects.find(
                (uiCategory) => uiCategory.label.toLowerCase() === fetchedCategory.name.toLowerCase()
            );

            if (matchedUIObject) {
                mapping[matchedUIObject.id] = fetchedCategory.id;
            }
            //console.log(mapping);

            return mapping;
        }, {});
    };

    const mapRecurrences = (uiObjects, fetchedRecurrences) => {
        //console.log(fetchedRecurrences);
        return fetchedRecurrences.reduce((mapping, fetchedRecurrence) => {

            if (fetchedRecurrence.type) {
                const matchedUIObject = uiObjects.find(
                    (uiRecurrence) => uiRecurrence.label.toLowerCase() === fetchedRecurrence.type.toLowerCase()
                );

                if (matchedUIObject) {
                    mapping[matchedUIObject.id] = fetchedRecurrence.id;
                }
            }
            //console.log(mapping);
            return mapping;
        }, {});
    };

    const getUICategoryFromMapping = (categoryId) => {
        for (const [key, value] of Object.entries(categoryUIMapping)) {
            if (value === categoryId) {
                return key;
            }
        }
        return null; // Return null if no match is found
    };

    const getUIRecurrenceFromMapping = (recurrenceId) => {
        for (const [key, value] of Object.entries(recurrenceUIMapping)) {
            if (value === recurrenceId) {
                return key;
            }
        }
        return null; // Return null if no match is found
    };

    const updateExpense = async (description, selectedDate, amount, categoryUIId, recurrenceUIId) => {
        //console.log(categoryUIId);
        const mappedCategoryId = categoryUIMapping[categoryUIId];
        const mappedRecurrenceId = recurrenceUIMapping[recurrenceUIId];

        const formattedDate = selectedDate.toISOString().split('T')[0];

        try {
            const updatedId = await ExpenseRepository.updateExpense(id, description, formattedDate, amount, mappedCategoryId, mappedRecurrenceId);
            //console.log('Updated expense ID:', updatedId);
            if (updatedId) {
                navigation.navigate('Expenses');
            }
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    return (
        <View style={styles.container}>

            <NavigationCreateExpenseMenu navigation={navigation} />
            <ExpenseForm
                amount={amount}
                setAmount={(text) => setAmount(text)}
                selectedDate={selectedDate}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
                handleDateChange={handleDateChange}
                renderCategoryIcons={renderCategoryIcons}
                renderRecurrenceButtons={renderRecurrenceButtons}
                description={description}
                setDescription={setDescription}
            />




            <View style={styles.footer}>
                <TouchableOpacity style={styles.button}
                    onPress={() => {
                        updateExpense(description, selectedDate, amount, selectedUICategory, selectedUIRecurrence);
                    }}>
                    <Text style={styles.buttonText}>UPDATE</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};




export default UpdateExpense

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        marginLeft: 30,
        marginRight: 30,
    },


    titleContainer: {
        flexDirection: "row",
        marginTop: 25,
        alignItems: 'center',
        justifyContent: "center"

        //backgroundColor: "grey"

    },
    titleText: {
        fontSize: 25,
        fontWeight: "500",
        color: '#f14258'

    },
    backIconContainer: {
        position: 'absolute', // Position the back icon absolutely
        left: 0, // Align it to the far left
    },
    inputContainer: {
        marginTop: 20,
        marginBottom: 20,
        //backgroundColor: "blue"
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    categoryIcon: {
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 50,
        padding: 5,
        backgroundColor: "white"
    },

    selectedCategoryIcon: {
        //borderColor: '#f14258',
        backgroundColor: "#f14258"// Change border color for selected category
    },

    recurrenceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    recurrenceButton: {
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 50,
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        width: 80, // Set the width for the buttons
    },
    recurrenceButtonText: {
        color: 'black',
        //fontWeight: 'bold',
        textAlign: 'center', // Center the text inside the button
    },
    selectedRecurrenceButton: {
        backgroundColor: '#f14258',
    },
    selectedRecurrenceText: {
        color: 'white', // Change text color to white when selected
    },


    rowContainer: {
        marginTop: 15,
        marginBottom: 15,
    },
    tagContainer: {
        marginBottom: 5
    },
    inputContainerAmount: {
        backgroundColor: "white",
        borderRadius: 10,
        height: 50,
        justifyContent: 'center', // Aligns content vertically

    },
    inputAmountWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10
    },
    icon: {
        // Adjust spacing between icon and input field
    },

    input: {
        marginLeft: 10
    },

    inputContainerDate: {
        backgroundColor: "white",
        borderRadius: 20,
        height: 35,
        justifyContent: 'center', // Aligns content vertically
    },

    inputDateWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        justifyContent: 'space-between', // To create space between elements

    },
    calendarIcon: {
        marginRight: 10
    },
    inputContainerDescription: {
        backgroundColor: "white",
        borderRadius: 10,
        height: 80,
    },
    textTag: {
        fontSize: 14,
        fontWeight: "500"

    },
    pickerContainer: {
        backgroundColor: "white"
    },
    footer: {
        marginTop: 20,
    },
    button: {
        backgroundColor: '#f14258',
        borderRadius: 20,
        height: 30,
        justifyContent: 'center',
        alignItems: "center"
    },
    buttonText: {
        color: "white",
        fontWeight: 'bold', // Make the text bold

    }

})