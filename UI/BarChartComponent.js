import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Svg, Rect, Text } from 'react-native-svg';
import { scaleBand, scaleLinear } from 'd3-scale';

const BarChart = ({ chartData }) => {
    //console.log(chartData);

    const { series, sliceColor } = chartData;
    //console.log(data);
    // Dimensions
    const screenWidth = Dimensions.get('window').width;
    const chartHeight = 200;
    const chartWidth = screenWidth * 0.9; // Use 90% of screen width

    // Prepare the data: Convert amounts to numbers and extract categories
    const preparedData = series.map((item, index) => ({
        value: Number(item.amount), // Convert string amount to number
        label: item.category, // Use the category as the label
        color: sliceColor[index % sliceColor.length] // Assign a color to each item
    }));

    //console.log(preparedData);

    const maxValue = Math.max(...preparedData.map(item => item.value));

    const adjustedMaxValue = maxValue + (maxValue * 0.15);

    // Scales
    const xScale = scaleBand()
        .domain(preparedData.map((item) => item.label))
        .range([0, chartWidth])
        .padding(0.2);

    const yScale = scaleLinear()
        .domain([0, adjustedMaxValue]) // Use adjustedMaxValue here
        .range([chartHeight, 0]);

    return (
        <View style={styles.container}>
            <Svg width={chartWidth} height={chartHeight}>
                {preparedData.map((item, index) => (
                    <React.Fragment key={`bar-${index}`}>
                        <Rect
                            x={xScale(item.label)}
                            y={yScale(item.value)}
                            width={xScale.bandwidth()}
                            height={chartHeight - yScale(item.value)}
                            fill={item.color}
                        />
                        <Text
                            x={xScale(item.label) + xScale.bandwidth() / 2}
                            y={yScale(item.value) - 5} // Adjust this value to change the text position
                            fontSize="14"
                            fill="black"
                            textAnchor="middle" // Centers the text horizontally
                        >
                            {item.value}
                        </Text>
                    </React.Fragment>
                ))}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        //backgroundColor: "grey",
        //marginTop: 10
    }
});

export default BarChart;