import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, processColor } from 'react-native';
import React, { useEffect, useState } from 'react';
import ExpenseRepository from '../Data/Repositories/ExpenseRepository';
import { categoryUIObjects } from '../constants/categoryTypes';
import RonLogo from "./../assets/Logo/RON.svg";
import EditIcon from "../assets/Icons/edit_icon.svg";
import DeleteIcon from "../assets/Icons/delete_icon.svg";
import PieChart from '../UI/PieChartComponent';
import postData from './../NetworkCalls/postData';
import BarChart from "../UI/BarChartComponent";
import { useFocusEffect } from '@react-navigation/native';
import CalendarMenu from '../UI/CalendarMenu'


const Expenses = ({ navigation }) => {
    const currentMonthIndex = new Date().getMonth();
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const [expenses, setExpenses] = useState([]);
    const [categoryUIMapping, setCategoryUIMapping] = useState({});
    const [chartData, setChartData] = useState({ series: [], sliceColor: [] });
    const sliceColorArray = ['#fbd203', '#ffb300', '#ff9100', '#ff6c00', '#ff3c00', '#e63900'];
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex + 1);



    useFocusEffect(
        React.useCallback(() => {
            console.log("Screen focused, fetching expenses...");
            //fetchAllExpenses();
            fetchAllExpensesByMonth(selectedMonthIndex);
            // No dependency array here means this effect runs every time the screen focuses

            // Optional cleanup function
            return () => {
                console.log("Screen losing focus...");
                // Any cleanup actions if necessary
            };
        }, []) // Empty dependency array ensures the effect doesn't rely on any state or props
    );

    useEffect(() => {
        console.log("Expenses first useEffect");

        fetchAllExpensesByMonth(selectedMonthIndex);
        //fetchAllExpensesByMonth();

    }, [selectedMonthIndex]);

    useEffect(() => {
        console.log("Expenses second useEffect");

        if (expenses.length > 0) {
            generateCategoryUIMapping();
            setTotalAmount(calculateTotalAmount(expenses));
        }

        generateChartData();

    }, [expenses]);

    const calculateTotalAmount = (expensesArray) => {
        return expensesArray.reduce((accumulator, currentExpense) => accumulator + parseFloat(currentExpense.amount), 0);
    };

    const generateCategoryUIMapping = () => {
        const mapping = categoryUIObjects.reduce((map, category, index) => {
            map[category.id] = index;
            return map;
        }, {});
        setCategoryUIMapping(mapping);
    };

    const fetchAllExpenses = async () => {
        try {
            const allExpenses = await ExpenseRepository.getAllExpensesWithDetails();
            setExpenses(allExpenses);
            //console.log(allExpenses);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllExpensesByMonth = async (month) => {
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;
        console.log(formattedMonth);
        try {
            const allExpensesByMonth = await ExpenseRepository.getAllExpensesWithDetailsByMonth(`2024-${formattedMonth}`);
            setExpenses(allExpensesByMonth);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeExpense = async (id) => {
        console.log(id);

        try {
            await ExpenseRepository.deleteExpense(id);
            console.log('Deleted expense ID:', id);
            //fetchAllExpenses();
            fetchAllExpensesByMonth(selectedMonthIndex);

        } catch (error) {
            console.error('Error deleted expense:', error);
        }
    };

    const generateChartData = () => {
        if (expenses.length > 0) {
            // Group expenses by category
            const groupedExpenses = expenses.reduce((result, item) => {
                const category = item.category;
                if (!result[category]) {
                    result[category] = 0;
                }
                result[category] += parseFloat(item.amount);
                return result;
            }, {});

            // Extract categories and corresponding amounts
            const categories = Object.keys(groupedExpenses);
            const amounts = categories.map((category) => groupedExpenses[category]);
            const series = categories.map((category, index) => ({
                category,
                amount: amounts[index].toFixed(2),
            }));
            // Generate series and sliceColor props for ChartComponent
            //const series = amounts.map((amount) => amount.toFixed(2));
            const sliceColor = categories.map((category, index) => sliceColorArray[index]);

            setChartData({ series, sliceColor });
        }
        else {
            setChartData({ series: [], sliceColor: [] });
        }
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';  // Truncate and add ellipsis
        }
        return text;  // Return original if it's short enough
    };

    const renderExpense = ({ item }) => {

        //console.log('Rendering Expense:', item);

        if (!item) {
            return null; // Add some handling for undefined items
        }


        const categoryObject = categoryUIObjects[categoryUIMapping[item.category]];
        if (!categoryObject) {
            return null; // Or any placeholder/loading content
        }

        const formatDate = (inputDate) => {
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            const date = new Date(inputDate);
            return date.toLocaleDateString('en-US', options);
        };

        const formatAmount = (amount) => {
            return parseFloat(amount).toFixed(2);
        };

        return (
            <View style={styles.expenseContainer}>
                <View style={styles.expenseInfo}>
                    <View style={styles.leftSide}>
                        <View style={styles.iconContainer}>
                            {/* <FoodIcon width={25} height={25} /> */}
                            {categoryObject.icon}
                        </View>
                        <View style={{ marginLeft: 10 }}>
                            {/* <Text>Category: {item.category}</Text> 
                        <Text>Description: {item.description}</Text>
                        <Text>Date: {item.date}</Text>
                        <Text>Recurrence: {item.recurrence}</Text>*/}
                            <Text style={styles.firstLineText}>{truncateText(item.description, 15)}</Text>
                            <View style={styles.secondLineContainer}>
                                <Text style={[styles.secondLineText, { color: "grey" }]}>{formatDate(item.date)}</Text>
                                <Text style={[styles.secondLineText, { marginLeft: 5, marginRight: 5 }]}>·</Text>
                                <Text style={[styles.secondLineText, { color: "grey" }]}>{item.recurrence}</Text>
                            </View>

                        </View>
                    </View>

                    <View style={styles.rightSide}>
                        <View style={styles.amountContainer}>
                            <Text style={{ marginRight: 5, }}>{formatAmount(item.amount)}</Text>
                            <RonLogo width={12} height={12} />
                        </View>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('UpdateExpense', { expenseId: item.id })}
                                style={styles.buttonContainer}>
                                <EditIcon width={15} height={15} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    removeExpense(item.id);
                                }}
                                style={styles.buttonContainer}>
                                <DeleteIcon width={15} height={15} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

            </View>
        );
    };

    const handleSendButton = async () => {
        const url = ""; // Replace with your actual endpoint URL
        await postData(url, expenses);
    };


    return (
        <View style={styles.container}>

            <CalendarMenu
                months={months}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                setSelectedMonthIndex={setSelectedMonthIndex}
            />

            {/* <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Expenses</Text>
            </View> */}

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <>

                    {chartData.series.length > 0 && (
                        <View style={styles.pieChartContainer}>
                            <PieChart

                                widthAndHeight={200}
                                series={chartData.series}
                                sliceColor={chartData.sliceColor}
                            // series={[123, 321, 123, 789, 537]}
                            // sliceColor={['#fbd203', '#ffb300', '#ff9100', '#ff6c00', '#ff3c00']}
                            />
                        </View>
                    )}
                    {/* Total
                    <View>
                        <Text>total {totalAmount.toFixed(2)} RON</Text>
                    </View> */}
                    <View style={styles.barChartContainer}>
                        <BarChart chartData={chartData} />
                    </View>
                    {/* <Chart
                style={styles.chartContainer}
                widthAndHeight={250}
                // series={chartData.series}
                // sliceColor={chartData.sliceColor}
                series={[123, 321, 123, 789, 537]}
                sliceColor={['#fbd203', '#ffb300', '#ff9100', '#ff6c00', '#ff3c00']}

            /> */}
                    {/* <ScrollView style={styles.flatListContainer}>
                        {expenses.map((item) => (
                            <View key={item.id}>{renderExpense(item)}</View>
                        ))}
                    </ScrollView> */}

                    <FlatList
                        style={styles.flatListContainer}
                        data={expenses}
                        renderItem={renderExpense}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                    />

                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateExpense')}>
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('DBTest')}>
                        <Text style={styles.buttonText2}>Db Test</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button3} onPress={handleSendButton}>
                        <Text style={styles.buttonText2}>Send</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button4} onPress={() => navigation.navigate('PhotoTestHelper')}>
                        <Text style={styles.buttonText2}>Photo Test</Text>
                    </TouchableOpacity>

                </>
            )}
        </View>
    );
};


export default Expenses

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
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
    selectedMonthContainer: {
        backgroundColor: "#ff6c00", // Background color for selected month
        borderRadius: 5,
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

    pieChartContainer: {
        //alignItems: 'center', // Horizontally center content
        marginTop: 20,
        //marginBottom: 20,
    },
    barChartContainer: {
        //marginTop: 10
    },
    flatListContainer: {
        marginTop: 20,
        marginBottom: 20,
        //backgroundColor: "#FFCC33",
    },
    expenseContainer: {
        backgroundColor: "white",
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 10,
        height: 60,
        justifyContent: "center",
    },

    expenseInfo: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftSide: {
        flexDirection: 'row',
        alignItems: "center",
        marginLeft: 10
        //backgroundColor: "grey"
    },

    rightSide: {
        flexDirection: 'row',

    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: "center",
        marginRight: 10

    },
    buttonsContainer: {
        marginRight: 10,
        marginLeft: 10,
        //backgroundColor: "grey"
    },
    buttonContainer: {
        marginTop: 5,
        marginBottom: 5
    },

    iconContainer: {
        borderWidth: 1,
        //borderColor: '#f14258',
        borderColor: '#dbdadb',
        borderRadius: 50,
        padding: 5,
        backgroundColor: "#f3f2f3",
        //borderColor: 'transparent',

    },
    firstLineText: {
        fontSize: 16,
    },
    secondLineContainer: {
        flexDirection: 'row',

    },
    secondLineText: {
        fontSize: 12,
    },

    separator: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginBottom: 5,
        marginTop: 5,
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

    button3: {
        position: 'absolute',
        bottom: 20,
        right: 120,
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
    button4: {
        position: 'absolute',
        bottom: 20,
        right: 170,
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
    },


});