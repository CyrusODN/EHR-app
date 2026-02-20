import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart, BarChart } from "react-native-gifted-charts";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const MedicalCharts = () => {
    // Colors for line series
    const lineColors = ['#4A90B9', '#5EC4B6', '#88C3D8'];

    // Data for Diagnostic Trends Line Chart
    const lineData1 = [
        { value: 45, label: 'Sty' },
        { value: 50, label: 'Feb' },
        { value: 48, label: 'Mar' },
        { value: 53, label: 'Apr' },
        { value: 57, label: 'May' },
        { value: 50, label: 'Jun' },
    ];

    const lineData2 = [
        { value: 30 },
        { value: 35 },
        { value: 38 },
        { value: 32 },
        { value: 40 },
        { value: 37 },
    ];

    const lineData3 = [
        { value: 25 },
        { value: 28 },
        { value: 30 },
        { value: 27 },
        { value: 32 },
        { value: 29 },
    ];

    // Data for Treatment Results Bar Chart
    const barData = [
        { value: 60, label: 'Remission', frontColor: '#cccccc' },
        { value: 45, label: 'Partial', frontColor: '#4A90B9' },
        { value: 35, label: 'Stabilize', frontColor: '#4A90B9' },
        { value: 15, label: 'No imp.', frontColor: '#4A90B9' },
    ];

    return (
        <View style={styles.container}>
            {/* Diagnostic Trends Chart */}
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Diagnostic trends</Text>
                <View style={styles.chartInner}>
                    <LineChart
                        data={lineData1}
                        data2={lineData2}
                        data3={lineData3}
                        height={180}
                        width={wp(72)}
                        initialSpacing={20}
                        spacing={wp(10)}
                        color1={lineColors[0]}
                        color2={lineColors[1]}
                        color3={lineColors[2]}
                        thickness={2}
                        dataPointsColor1={lineColors[0]}
                        dataPointsColor2={lineColors[1]}
                        dataPointsColor3={lineColors[2]}
                        dataPointsRadius={4}
                        yAxisColor="#e0e0e0"
                        xAxisColor="#e0e0e0"
                        yAxisTextStyle={{ color: '#777', fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: '#777', fontSize: 10, textAlign: 'center' }}
                        noOfSections={4}
                        maxValue={60}
                        rulesType="dashed"
                        rulesColor="#e0e0e0"
                        hideDataPoints={false}
                        yAxisThickness={1}
                        xAxisThickness={1}
                        pointerConfig={{
                            pointerStripColor: 'lightgray',
                            pointerStripWidth: 2,
                            pointerColor: 'lightgray',
                            radius: 6,
                            pointerLabelComponent: (items: any) => {
                                return (
                                    <View style={{
                                        backgroundColor: 'white',
                                        padding: 8,
                                        borderRadius: 8,
                                        elevation: 5,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                    }}>
                                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{items[0].value}</Text>
                                    </View>
                                )
                            }
                        }}
                    />
                </View>
            </View>

            {/* Treatment Results Chart */}
            <View style={[styles.chartContainer, { marginVertical: 20 }]}>
                <Text style={styles.chartTitle}>Treatment Results</Text>
                <View style={styles.chartInner}>
                    <BarChart
                        data={barData}
                        height={180}
                        width={wp(72)}
                        barWidth={wp(10)}
                        initialSpacing={20}
                        spacing={wp(6)}
                        barBorderRadius={4}
                        yAxisColor="#e0e0e0"
                        xAxisColor="#e0e0e0"
                        yAxisTextStyle={{ color: '#777', fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: '#777', fontSize: 9, textAlign: 'center' }}
                        noOfSections={4}
                        maxValue={60}
                        rulesType="dashed"
                        rulesColor="#e0e0e0"
                        yAxisThickness={1}
                        xAxisThickness={1}
                    />
                </View>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%"
    },
    chartContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#4A90B9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 20,
    },
    chartInner: {
        height: 250,
        width: '100%',
        alignItems: 'center',
        paddingLeft: 0
    },
});

export default MedicalCharts;
