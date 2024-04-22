import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import RonLogo from "../assets/Logo/RON.svg";
import CalendarIcon from "../assets/Icons/calendar_icon.svg";
import DateTimePicker from '@react-native-community/datetimepicker';

const ExpenseForm = ({
    amount,
    setAmount,
    selectedDate,
    showDatePicker,
    setShowDatePicker,
    handleDateChange,
    renderCategoryIcons,
    renderRecurrenceButtons,
    description,
    setDescription
}) => {
    return (
        <View style={styles.inputContainer}>
            <View style={styles.rowContainer}>
                <View style={styles.tagContainer}>
                    <Text style={styles.textTag}>Amount</Text>
                </View>
                <View style={styles.inputContainerAmount}>
                    <View style={styles.inputAmountWithIcon}>
                        <RonLogo width={25} height={25} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter amount"
                            value={amount}
                            keyboardType="numeric"
                            onChangeText={setAmount}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.rowContainer}>
                <View style={styles.tagContainer}>
                    <Text style={styles.textTag}>Date</Text>
                </View>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
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
                        onChangeText={setDescription}
                    />
                </View>
            </View>
        </View>
    );
};

export default ExpenseForm;

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 20,
        marginBottom: 20,
        //backgroundColor: "blue"
    },

    rowContainer: {
        //backgroundColor: "grey",
        marginTop: 15,
        marginBottom: 15,
    },
    tagContainer: {
        marginBottom: 5
    },
    textTag: {
        fontSize: 14,
        fontWeight: "500"

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

    input: {
        marginLeft: 10
    },

    calendarIcon: {
        marginRight: 10
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

    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    recurrenceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    inputContainerDescription: {
        backgroundColor: "white",
        borderRadius: 10,
        height: 80,
    },
})