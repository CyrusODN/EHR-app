import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomCheckbox from '../../../component/customCheckBox';
import CustomDropdown from '../../../component/customDropDown';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

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

    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);

    return (
        <View style={ds.container}>
            <View style={ds.section}>
                <Text style={ds.sectionTitle}>{t('aiAnalysis.filterForm.timeRange')}</Text>
                <CustomDropdown
                    placeholder={t('aiAnalysis.filterForm.lastMonth')}
                    options={timeRangeOptions}
                    value={timeRange}
                    onChange={setTimeRange} icon={undefined} />
            </View>

            <View style={ds.section}>
                <Text style={ds.sectionTitle}>{t('aiAnalysis.filterForm.branch')}</Text>
                <CustomDropdown
                    placeholder={t('aiAnalysis.filterForm.allBranches')}
                    options={departmentOptions}
                    value={department}
                    onChange={setDepartment} icon={undefined} />
            </View>

            <View style={ds.section}>
                <Text style={ds.sectionTitle}>{t('aiAnalysis.filterForm.doctors')}</Text>
                <View style={ds.doctorListContainer}>
                    {doctorOptions.map((item, index) => {
                        const isSelected = doctor === item.value;
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setDoctor(prev => prev == item.value ? null : item.value)
                                }}
                                style={[
                                    ds.doctorItem,
                                    isSelected && ds.doctorItemActive
                                ]}>
                                <Text style={[
                                    ds.doctorItemText,
                                    isSelected && ds.doctorItemTextActive
                                ]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>

            <View style={ds.section}>
                <Text style={ds.sectionTitle}>{t('aiAnalysis.filterForm.metrics')}</Text>
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

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: {
        backgroundColor: tc.cardBackground,
        padding: 10,
        borderRadius: 10,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.15,
        shadowRadius: 5,
        elevation: 4,
        width: '100%',
        maxWidth: 500,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: tc.textPrimary,
    },
    doctorListContainer: {
        borderWidth: 1,
        borderColor: tc.borderSubtle,
        borderRadius: 8,
        padding: 5,
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'white',
    },
    doctorItem: {
        backgroundColor: 'transparent',
        borderRadius: 6,
        padding: 8,
        marginVertical: 2,
    },
    doctorItemActive: {
        backgroundColor: tc.accent,
    },
    doctorItemText: {
        color: tc.textPrimary,
        fontSize: 16,
    },
    doctorItemTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    }
});

export default MedicalFilterForm;