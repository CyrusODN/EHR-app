import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomCheckbox from '../../../component/customCheckBox';
import CustomDropdown from '../../../component/customDropDown';

const MedicalFilterForm = () => {
    // State for form values
    const [timeRange, setTimeRange] = useState<string | number | null>(null);
    const [department, setDepartment] = useState<string | number | null>(null);
    const [doctor, setDoctor] = useState<string | null>(null);
    const [metrics, setMetrics] = useState({
        visits: true,
        diagnoses: false
    });

    // Data for dropdowns
    const timeRangeOptions = [
        { label: 'Last Month', value: 'last_month' },
        { label: 'Last Week', value: 'last_week' },
        { label: 'Last Year', value: 'last_year' }
    ];

    const departmentOptions = [
        { label: 'All Branches', value: 'all' },
        { label: 'Cardiology', value: 'cardiology' },
        { label: 'Neurology', value: 'neurology' },
        { label: 'Surgery', value: 'surgery' }
    ];

    const doctorOptions = [
        { label: 'All doctors', value: 'all' },
        { label: 'Dr Jan Kowalski', value: 'kowalski' },
        { label: 'Dr Anna Nowak', value: 'nowak' },
        { label: 'Dr Piotr Wiśniewski', value: 'wisniewski' }
    ];

    // Handle checkbox changes
    const handleMetricChange = (metric: string, value: boolean) => {
        setMetrics(prev => ({
            ...prev,
            [metric]: value
        }));
    };

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Time Range</Text>
                <CustomDropdown
                    placeholder="Last month"
                    options={timeRangeOptions}
                    value={timeRange}
                    onChange={setTimeRange} icon={undefined} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Branch</Text>
                <CustomDropdown
                    placeholder="All branches"
                    options={departmentOptions}
                    value={department}
                    onChange={setDepartment} icon={undefined} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Doctors</Text>
                <View style={{
                    borderWidth: 1,
                    borderColor: '#e0e0e0',
                    borderRadius: 5,
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    backgroundColor: 'white',
                }}>
                    {doctorOptions.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setDoctor(prev => prev == item.value ? null : item.value)
                                }}
                                style={{
                                    backgroundColor: doctor == item.value ? '#4A90B9' : 'white',
                                    borderRadius: 5, padding: 5
                                }}>
                                <Text style={{
                                    color: doctor == item.value ? 'white' : 'black',
                                    fontSize: 16
                                }}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                {/* <CustomDropdown
                    placeholder="Wszyscy lekarze"
                    options={doctorOptions}
                    value={doctor}
                    onChange={setDoctor}
                    icon={<Ionicons name="people-outline" size={20} color="#666" />}
                /> */}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Metrics</Text>
                <CustomCheckbox
                    label="Visits"
                    checked={metrics.visits}
                    onChange={(value) => handleMetricChange('visits', value)}
                />
                <CustomCheckbox
                    label="Recognitions"
                    checked={metrics.diagnoses}
                    onChange={(value) => handleMetricChange('diagnoses', value)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        // Android shadow
        elevation: 4,
        width: '100%',
        maxWidth: 500,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    }
});

export default MedicalFilterForm;