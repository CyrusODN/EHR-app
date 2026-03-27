import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomCheckbox from '../../../component/customCheckBox';
import CustomDropdown from '../../../component/customDropDown';
import { useTranslation } from 'react-i18next';

const MedicalFilterForm = () => {
    const { t } = useTranslation();

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
        { label: t('aiAnalysis.filterForm.lastMonth'), value: 'last_month' },
        { label: t('aiAnalysis.filterForm.lastWeek'), value: 'last_week' },
        { label: t('aiAnalysis.filterForm.lastYear'), value: 'last_year' }
    ];

    const departmentOptions = [
        { label: t('aiAnalysis.filterForm.allBranches'), value: 'all' },
        { label: t('aiAnalysis.filterForm.cardiology'), value: 'cardiology' },
        { label: t('aiAnalysis.filterForm.neurology'), value: 'neurology' },
        { label: t('aiAnalysis.filterForm.surgery'), value: 'surgery' }
    ];

    const doctorOptions = [
        { label: t('aiAnalysis.filterForm.allDoctors'), value: 'all' },
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
                <Text style={styles.sectionTitle}>{t('aiAnalysis.filterForm.timeRange')}</Text>
                <CustomDropdown
                    placeholder={t('aiAnalysis.filterForm.lastMonth')}
                    options={timeRangeOptions}
                    value={timeRange}
                    onChange={setTimeRange} icon={undefined} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('aiAnalysis.filterForm.branch')}</Text>
                <CustomDropdown
                    placeholder={t('aiAnalysis.filterForm.allBranches')}
                    options={departmentOptions}
                    value={department}
                    onChange={setDepartment} icon={undefined} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('aiAnalysis.filterForm.doctors')}</Text>
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
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('aiAnalysis.filterForm.metrics')}</Text>
                <CustomCheckbox
                    label={t('aiAnalysis.filterForm.visits')}
                    checked={metrics.visits}
                    onChange={(value) => handleMetricChange('visits', value)}
                />
                <CustomCheckbox
                    label={t('aiAnalysis.filterForm.recognitions')}
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