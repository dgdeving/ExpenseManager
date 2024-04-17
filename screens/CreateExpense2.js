import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import ExpenseRepository from '../Data/Repositories/ExpenseRepository';
import CategoryRepository from '../Data/Repositories/CategoryRepository';
import ReoccurrenceRepository from '../Data/Repositories/RecurrenceRepository';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import RonLogo from "./../assets/Logo/RON.svg";
import CalendarIcon from "./../assets/Icons/calendar_icon.svg"
import BackIcon from "./../assets/Icons/back_icon.svg"
import CameraIcon from "./../assets/Icons/camera_icon.svg"
import { categoryUIObjects } from '../UI/CategoryIcons';
import { parse } from 'date-fns';


const CreateExpense = ({ navigation, route }) => {

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

    //const receipt = useState(route.params?.receipt || {});


    useEffect(() => {
        console.log(route.params);

        if (route.params?.receipt) {
            const { Date, Merchant, Total } = route.params.receipt;
            setDescription(Merchant || '');
            setAmount(Total?.replace(',', '.') || '');  // Replace commas with dots for consistency in amount
            setSelectedDate(tryParseDate(Date));
        }
    }, [route.params]);

    const tryParseDate = (dateString) => {
        const formats = ["dd/MM/yyyy", "yyyy.MM.dd"];  // List of expected formats
        for (const format of formats) {
            const parsedDate = parse(dateString, format, new Date());
            if (!isNaN(parsedDate)) return parsedDate;  // Check if parsedDate is a valid date
        }
        return new Date();  // Return current date as fallback
    };

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

    const recurrenceUIObjects = [
        { id: 'Once', label: 'Once' },
        { id: 'Daily', label: 'Daily' },
        { id: 'Monthly', label: 'Monthly' },
    ];

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
            console.log(mapping);

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
            <View style={styles.titleContainer}>
                <TouchableOpacity style={styles.backIconContainer} onPress={() => {
                    navigation.navigate('Expenses');
                }}>
                    <BackIcon width={25} height={25} />
                </TouchableOpacity>
                <Text style={styles.titleText}>ADD</Text>
                <TouchableOpacity style={styles.cameraContainer} onPress={() => {
                    navigation.navigate('CameraScreen');
                }}>
                    <CameraIcon width={35} height={35} />
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <View style={styles.rowContainer}>
                    <View style={styles.tagContainer}>
                        <Text style={styles.textTag}>Amount</Text>
                    </View>
                    <View style={styles.inputContainerAmount}>
                        {/* Add input for amount */}
                        <View style={styles.inputAmountWithIcon}>
                            <RonLogo width={25} height={25} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter amount"
                                value={amount}
                                keyboardType="numeric"
                                onChangeText={(text) => setAmount(text)}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.tagContainer}>
                        <Text style={styles.textTag}>Date</Text>
                    </View>
                    <TouchableOpacity onPress={showDatepicker}>
                        <View style={styles.inputContainerDate}>
                            <View style={styles.inputDateWithIcon}>
                                <Text style={styles.input}>
                                    {selectedDate.toLocaleDateString()}
                                </Text>
                                <CalendarIcon width={25} height={25} style={styles.calendarIcon} />
                            </View>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.tagContainer}>
                        <Text style={styles.textTag}>Category</Text>
                    </View>
                    <View style={styles.categoryContainer}>
                        {renderCategoryIcons()}
                    </View>
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.tagContainer}>
                        <Text style={styles.textTag}>Reoccurence</Text>
                    </View>
                    <View style={styles.recurrenceContainer}>
                        {renderRecurrenceButtons()}
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.tagContainer}>
                        <Text style={styles.textTag}>Description</Text>
                    </View>
                    <View style={styles.inputContainerDescription}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your description"
                            value={description}
                            onChangeText={(text) => setDescription(text)}
                        />
                    </View>
                </View>
            </View>

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

    cameraContainer: {
        position: 'absolute', // Position the back icon absolutely
        right: 0, // Align it to the far left
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
        //backgroundColor: "grey",
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