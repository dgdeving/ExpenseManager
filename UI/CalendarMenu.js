import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import CalendarLogo from "../assets/Icons/calendar_icon2.svg";


const CalendarMenu = ({ months, selectedMonth, setSelectedMonth, setSelectedMonthIndex }) => {
    return (
        <View style={styles.calendarMenu}>
            <View style={styles.titleBar}>

                <Text style={styles.titleText}>Expenses</Text>
                <View style={styles.currentDateContainer}>
                    {/* <Text style={styles.currentMonthText}>JAN</Text> */}
                    <Text style={styles.currentYearText}>2024</Text>
                    <CalendarLogo />
                </View>
            </View>
            <ScrollView style={styles.monthsArray} horizontal={true} showsHorizontalScrollIndicator={false}>
                {months.map((month, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => { setSelectedMonth(month); setSelectedMonthIndex(index + 1); }} // Update selected month state on press
                    >
                        <Text
                            style={[
                                styles.monthText,
                                selectedMonth === month && styles.selectedMonthText // Apply selected text style if month is selected
                            ]}
                        >
                            {month}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

export default CalendarMenu

const styles = StyleSheet.create({
    calendarMenu: {
        marginTop: 10,
        marginBottom: 10,
    },
    titleBar: {
        marginTop: 10,
        //marginLeft: 12,
        //marginRight: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
    },
    currentDateContainer: {
        flexDirection: 'row',
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        //color: "#ff6c00"
    },
    selectedMonthText: {
        fontSize: 18,
        marginRight: 4,
        color: "#ff6c00"
    },
    currentYearText: {
        fontSize: 18,
        //color: "#ff6c00",
        color: "grey",
        marginRight: 10,
    },
    monthsArray: {
        marginTop: 5
        //margin: 12,
        //marginBottom: 10,
        //justifyContent: 'space-around'
    },
    monthText: {
        fontSize: 15,
        marginRight: 5,
        marginLeft: 5,
        color: "grey"
    },
})