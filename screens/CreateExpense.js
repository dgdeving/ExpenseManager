import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import ExpenseRepository from '../Data/Repositories/ExpenseRepository';
import CategoryRepository from '../Data/Repositories/CategoryRepository';
import ReoccurrenceRepository from '../Data/Repositories/RecurrenceRepository';
import React, { useEffect, useState } from 'react';
import { categoryUIObjects } from '../constants/categoryTypes';
import { recurrenceUIObjects } from '../constants/recurrenceTypes';
import dateUtils from '../utils/dateUtils';
import NavigationCreateExpenseMenu from "../UI/NavigationCreateExpenseMenu"
import ExpenseForm from "../UI/ExpenseForm"

const CreateExpense = ({ navigation, route }) => {

    const [categories, setCategories] = useState([]);
    const [recurrences, setRecurrences] = useState([]);
    const [selectedUICategory, setSelectedUICategory] = useState(null);
    const [selectedUIRecurrence, setSelectedUIRecurrence] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [amount, setAmount] = useState(null);
    const [description, setDescription] = useState(null);
    const [categoryUIMapping, setCategoryUIMapping] = useState({});
    const [recurrenceUIMapping, setRecurrenceUIMapping] = useState({});

    //const receipt = useState(route.params?.receipt || {});

    useEffect(() => {
        console.log("UseEffect route.params: ", route.params);
        if (route.params?.receipt) {
            const { Date, Merchant, Total } = route.params.receipt;
            setDescription(Merchant || '');
            setAmount(Total?.replace(',', '.') || '');  // Replace commas with dots for consistency in amount
            setSelectedDate(dateUtils(Date));
        }
    }, [route.params]);

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

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false); // Hide the date picker after selection
        if (selectedDate) {
            setSelectedDate(selectedDate);
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
        return fetchedRecurrences.reduce((mapping, fetchedRecurrence) => {

            if (fetchedRecurrence.type) {
                const matchedUIObject = uiObjects.find(
                    (uiRecurrence) => uiRecurrence.label.toLowerCase() === fetchedRecurrence.type.toLowerCase()
                );

                if (matchedUIObject) {
                    mapping[matchedUIObject.id] = fetchedRecurrence.id;
                }
            }
            return mapping;
        }, {});
    };

    const addExpense = async (description, selectedDate, amount, categoryUIId, recurrenceUIId) => {
        console.log(selectedDate);
        const mappedCategoryId = categoryUIMapping[categoryUIId];
        const mappedRecurrenceId = recurrenceUIMapping[recurrenceUIId];

        const formattedDate = selectedDate.toISOString().split('T')[0];

        try {
            const insertedId = await ExpenseRepository.createExpense(description, formattedDate, amount, mappedCategoryId, mappedRecurrenceId);
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
                        addExpense(description, selectedDate, amount, selectedUICategory, selectedUIRecurrence);
                    }}>
                    <Text style={styles.buttonText}>SAVE</Text>
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
        marginLeft: 30,
        marginRight: 30,
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
    footer: {
        //backgroundColor: "grey",
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