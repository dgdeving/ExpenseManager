import React from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import PieChart from 'react-native-pie-chart';

const ChartComponent = ({ widthAndHeight, series, sliceColor }) => {
    const totalSum = series.reduce((sum, value) => sum + parseFloat(value.amount) || 0, 0);
    //console.log(totalSum);
    //console.log(series);
    //console.log(sliceColor);
    return (
        <View style={styles.container}>
            <PieChart
                widthAndHeight={widthAndHeight}
                series={series.map(item => parseFloat(item.amount))}
                sliceColor={sliceColor}
                coverRadius={0.45}
            //coverFill={'#FFF'}
            />
            <View style={styles.legendContainer}>
                {sliceColor.map((color, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.colorIndicator, { backgroundColor: color }]} />
                        <View style={styles.seriesDataContainer}>
                            <Text style={styles.categoryText}>
                                {/* {`${((parseFloat(series[index].amount) / totalSum) * 100).toFixed(2)}%`} */}
                                {/* {`${series[index].category}: ${series[index].amount} (${((parseFloat(series[index].amount) / totalSum) * 100).toFixed(2)}%)`} */}
                                {`${series[index].category}`}
                            </Text>
                            <Text style={styles.percentageText}>
                                {` ${((parseFloat(series[index].amount) / totalSum) * 100).toFixed(2)}%`}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default ChartComponent;

const styles = StyleSheet.create({
    container: {
        //alignItems: 'center',
        justifyContent: 'space-around',
        //justifyContent: 'space-between',
        flexDirection: "row",
        //backgroundColor: "green"
    },
    legendContainer: {
        //backgroundColor: "grey",

    },
    seriesDataContainer: {
        marginTop: 2,
        marginBottom: 2,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center', // Align items in the center vertically
        //width: "100%"

    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    colorIndicator: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 5,
    },
    categoryText: {
        fontSize: 12,
        //fontWeight: 'bold', // Optional: Make the category text bold
    },
    percentageText: {
        fontSize: 12,
        fontWeight: "700"
    },
})