import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../../component/button';
import Gap from '../../../component/gap';
import CustomDropdown from '../../../component/customDropDown';
import CustomCheckbox from '../../../component/customCheckBox';

const StatisticalAnalysis = () => {
    const navigation = useNavigation<any>();

    const [timeRange, setTimeRange] = useState('Last Year');
    const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
    const [grouping, setGrouping] = useState('Month');

    const metrics = [
        'Visits',
        'Diagnoses',
        'Procedures',
        'Test Results'
    ];

    const timeRangeOptions = [
        { label: 'Last Year', value: 'Last Year' },
        { label: 'Last Month', value: 'Last Month' },
        { label: 'Last Week', value: 'Last Week' },
        { label: 'Last Quarter', value: 'Last Quarter' }
    ];

    const groupingOptions = [
        { label: 'Month', value: 'Month' },
        { label: 'Week', value: 'Week' },
        { label: 'Day', value: 'Day' },
        { label: 'Year', value: 'Year' }
    ];

    const handleMetricToggle = (metric: string) => {
        if (selectedMetrics.includes(metric)) {
            setSelectedMetrics(selectedMetrics.filter(item => item !== metric));
        } else {
            setSelectedMetrics([...selectedMetrics, metric]);
        }
    };

    return (
        <View style={styles.contentContainer}>
            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.sectionTitle}>AI Statistical Analysis</Text>
                <PrimaryButton
                    label={"Export Report"}
                    filled={true}
                    onPress={() => { }}
                    style={{ width: "45%" }}
                    icon={<Feather name="download" color="white" size={18} />}
                    image={undefined}
                    iconStyle={undefined}
                    imageStyle={undefined}
                />
            </View>

            <View style={styles.dropdownContainer}>
                <Text>Time Range</Text>
                <Gap height={hp(1)} />
                <CustomDropdown
                    placeholder={timeRange}
                    options={timeRangeOptions}
                    value={timeRange}
                    onChange={(value) => setTimeRange(String(value))}
                    icon={undefined}
                />
            </View>
            <View style={styles.checkboxContainer}>
                <Text style={styles.checkboxTitle}>Metrics</Text>
                {
                    metrics.map((metric, index) => (
                        <CustomCheckbox
                            key={index}
                            label={metric}
                            checked={selectedMetrics.includes(metric)}
                            onChange={() => handleMetricToggle(metric)}
                        />
                    ))
                }
            </View>
            <View style={styles.dropdownContainer}>
                <Text>Grouping</Text>
                <Gap height={hp(1)} />
                <CustomDropdown
                    placeholder={grouping}
                    options={groupingOptions}
                    value={grouping}
                    onChange={(value) => setGrouping(String(value))}
                    icon={undefined}
                />
            </View>
            <PrimaryButton
                label={"Analyze"}
                filled={true}
                onPress={() => navigation.navigate('AI-Analysis')}
                style={{ width: "100%" }}
                icon={<Feather name="bar-chart-2" color="white" size={18} />}
                image={undefined}
                iconStyle={undefined}
                imageStyle={undefined}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        padding: 15,
        backgroundColor: '#FFFFFF',
        margin: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333333',
        width: "50%"
    },
    dropdownContainer: {
        marginBottom: 15,
    },
    checkboxContainer: {
        marginBottom: 15,
    },
    checkboxTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default StatisticalAnalysis;
