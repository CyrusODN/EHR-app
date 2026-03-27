import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart, BarChart } from "react-native-gifted-charts";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

const MedicalCharts = () => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);

    // Colors for line series
    const lineColors = isDark ? ['#4A90B9', '#5BA6B6', '#68BFB3'] : ['#4A90B9', '#5EC4B6', '#88C3D8'];

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
        { value: 60, label: t('aiAnalysis.charts.remission'), frontColor: isDark ? 'rgba(255,255,255,0.2)' : '#cccccc' },
        { value: 45, label: t('aiAnalysis.charts.partial'), frontColor: tc.accent },
        { value: 35, label: t('aiAnalysis.charts.stabilize'), frontColor: tc.accent },
        { value: 15, label: t('aiAnalysis.charts.noImprovement'), frontColor: tc.accent },
    ];

    return (
        <View style={ds.container}>
            {/* Diagnostic Trends Chart */}
            <View style={ds.chartContainer}>
                <Text style={ds.chartTitle}>{t('aiAnalysis.charts.diagnosticTrends')}</Text>
                <View style={ds.chartInner}>
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
                        yAxisColor={tc.borderSubtle}
                        xAxisColor={tc.borderSubtle}
                        yAxisTextStyle={{ color: tc.textMuted, fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: tc.textMuted, fontSize: 10, textAlign: 'center' }}
                        noOfSections={4}
                        maxValue={60}
                        rulesType="dashed"
                        rulesColor={tc.borderSubtle}
                        hideDataPoints={false}
                        yAxisThickness={1}
                        xAxisThickness={1}
                        pointerConfig={{
                            pointerStripColor: isDark ? 'rgba(255,255,255,0.2)' : 'lightgray',
                            pointerStripWidth: 2,
                            pointerColor: isDark ? tc.accent : 'lightgray',
                            radius: 6,
                            pointerLabelComponent: (items: any) => {
                                return (
                                    <View style={{
                                        backgroundColor: tc.cardBackground,
                                        padding: 8,
                                        borderRadius: 8,
                                        elevation: 5,
                                        shadowColor: tc.shadow,
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: isDark ? 0.3 : 0.1,
                                        borderWidth: isDark ? 1 : 0,
                                        borderColor: tc.borderSubtle,
                                    }}>
                                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: tc.textPrimary }}>{items[0].value}</Text>
                                    </View>
                                )
                            }
                        }}
                    />
                </View>
            </View>

            {/* Treatment Results Chart */}
            <View style={[ds.chartContainer, { marginVertical: 20 }]}>
                <Text style={ds.chartTitle}>{t('aiAnalysis.charts.treatmentResults')}</Text>
                <View style={ds.chartInner}>
                    <BarChart
                        data={barData}
                        height={180}
                        width={wp(72)}
                        barWidth={wp(10)}
                        initialSpacing={20}
                        spacing={wp(6)}
                        barBorderRadius={4}
                        yAxisColor={tc.borderSubtle}
                        xAxisColor={tc.borderSubtle}
                        yAxisTextStyle={{ color: tc.textMuted, fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: tc.textMuted, fontSize: 9, textAlign: 'center' }}
                        noOfSections={4}
                        maxValue={60}
                        rulesType="dashed"
                        rulesColor={tc.borderSubtle}
                        yAxisThickness={1}
                        xAxisThickness={1}
                    />
                </View>
            </View>
        </View >
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        width: "100%"
    },
    chartContainer: {
        backgroundColor: tc.cardBackground,
        borderRadius: 12,
        padding: 16,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.2 : 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: tc.textPrimary,
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
