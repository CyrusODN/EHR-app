import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { GetAvailableLabTests } from '../../../Services/Visit.Service';
import type { LabTest, LabTestPriority, LabOrder } from '../../../types/laboratory';

interface LabOrderFormProps {
    onSubmit: (order: Partial<LabOrder>) => void;
    visitId: string;
}

const PRIORITY_OPTIONS: { value: LabTestPriority; labelKey: string; color: string }[] = [
    { value: 'routine', labelKey: 'visit.laboratory.priority.routine', color: '#6B7280' },
    { value: 'urgent', labelKey: 'visit.laboratory.priority.urgent', color: '#F59E0B' },
    { value: 'stat', labelKey: 'visit.laboratory.priority.stat', color: '#EF4444' },
];

const MOCK_TESTS: LabTest[] = [
    { id: '1', code: 'CBC', name: 'Complete Blood Count', category: 'hematology', description: 'Basic blood panel', turnaroundTime: 24, cost: 30, preparationInstructions: ['Fasting (8-12h without food)'] },
    { id: '2', code: 'GLU', name: 'Glucose', category: 'biochemistry', description: 'Blood sugar level', turnaroundTime: 24, cost: 15, preparationInstructions: ['Fasting (8-12h without food)'] },
    { id: '3', code: 'TSH', name: 'Thyroid Stimulating Hormone', category: 'immunology', description: 'Thyroid function', turnaroundTime: 48, cost: 40 },
    { id: '4', code: 'CRP', name: 'C-Reactive Protein', category: 'biochemistry', description: 'Inflammation marker', turnaroundTime: 24, cost: 25 },
    { id: '5', code: 'LIP', name: 'Lipid Panel', category: 'biochemistry', description: 'Cholesterol and triglycerides', turnaroundTime: 24, cost: 35, preparationInstructions: ['Fasting (12h without food)'] },
    { id: '6', code: 'FER', name: 'Ferritin', category: 'hematology', description: 'Iron stores', turnaroundTime: 48, cost: 30 },
    { id: '7', code: 'VIT-D', name: 'Vitamin D (25-OH)', category: 'biochemistry', description: 'Vitamin D levels', turnaroundTime: 72, cost: 50 },
    { id: '8', code: 'HBA1C', name: 'Glycated Hemoglobin', category: 'biochemistry', description: 'Long-term glucose control', turnaroundTime: 48, cost: 45 },
];

const LabOrderForm = ({ onSubmit, visitId }: LabOrderFormProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    const [availableTests, setAvailableTests] = useState<LabTest[]>(MOCK_TESTS);
    const [selectedTests, setSelectedTests] = useState<LabTest[]>([]);
    const [priority, setPriority] = useState<LabTestPriority>('routine');
    const [notes, setNotes] = useState('');
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const result = await GetAvailableLabTests();
                if (result?.tests?.length > 0) {
                    setAvailableTests(result.tests);
                }
            } catch (e) {
                // Use mock data on failure
            }
        };
        fetchTests();
    }, []);

    const filteredTests = availableTests.filter(test =>
        test.name.toLowerCase().includes(searchText.toLowerCase()) ||
        test.code.toLowerCase().includes(searchText.toLowerCase())
    );

    const toggleTest = (test: LabTest) => {
        setSelectedTests(prev =>
            prev.some(t => t.id === test.id)
                ? prev.filter(t => t.id !== test.id)
                : [...prev, test]
        );
    };

    const handleSubmit = () => {
        if (selectedTests.length === 0) return;

        const order: Partial<LabOrder> = {
            visitId,
            tests: selectedTests.map(test => ({ ...test, orderNotes: notes })),
            priority,
            status: 'ordered',
            orderedAt: new Date().toISOString(),
        };

        onSubmit(order);
        setSelectedTests([]);
        setPriority('routine');
        setNotes('');
    };

    return (
        <View style={ds.container}>
            <Text style={ds.sectionTitle}>{t('visit.laboratory.orderForm.title')}</Text>

            <View style={ds.searchBar}>
                <Feather name="search" size={16} color={tc.textMuted} />
                <TextInput
                    style={ds.searchInput}
                    placeholder={t('visit.laboratory.orderForm.searchTests')}
                    placeholderTextColor={tc.textMuted}
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            <ScrollView style={ds.testsList} nestedScrollEnabled>
                {filteredTests.map(test => {
                    const isSelected = selectedTests.some(t => t.id === test.id);
                    return (
                        <TouchableOpacity
                            key={test.id}
                            style={[ds.testItem, isSelected && ds.testItemSelected]}
                            onPress={() => toggleTest(test)}
                            activeOpacity={0.7}
                        >
                            <View style={[ds.checkbox, isSelected && ds.checkboxSelected]}>
                                {isSelected && <Feather name="check" size={12} color="#fff" />}
                            </View>
                            <View style={ds.testInfo}>
                                <Text style={ds.testName}>{test.name}</Text>
                                <Text style={ds.testCode}>{test.code} • {test.description}</Text>
                            </View>
                            {test.preparationInstructions && test.preparationInstructions.length > 0 && (
                                <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#F59E0B" />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {selectedTests.length > 0 && (
                <View style={ds.selectedBadge}>
                    <Text style={ds.selectedBadgeText}>
                        {t('visit.laboratory.orderForm.selectedCount', { count: selectedTests.length })}
                    </Text>
                </View>
            )}

            <Text style={ds.label}>{t('visit.laboratory.orderForm.priority')}</Text>
            <View style={ds.priorityRow}>
                {PRIORITY_OPTIONS.map(opt => (
                    <TouchableOpacity
                        key={opt.value}
                        style={[ds.priorityChip, priority === opt.value && { borderColor: opt.color, backgroundColor: opt.color + '15' }]}
                        onPress={() => setPriority(opt.value)}
                    >
                        <View style={[ds.priorityDot, { backgroundColor: opt.color }]} />
                        <Text style={[ds.priorityText, priority === opt.value && { color: opt.color, fontWeight: '700' }]}>
                            {t(opt.labelKey)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={ds.label}>{t('visit.laboratory.orderForm.notes')}</Text>
            <TextInput
                style={ds.notesInput}
                placeholder={t('visit.laboratory.orderForm.notesPlaceholder')}
                placeholderTextColor={tc.textMuted}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
            />

            <TouchableOpacity
                style={[ds.submitButton, selectedTests.length === 0 && ds.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={selectedTests.length === 0}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={selectedTests.length > 0 ? ['#4A90B9', '#5BA6B6', '#68BFB3'] : [tc.borderColor, tc.borderColor]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={ds.submitGradient}
                >
                    <Feather name="plus" size={16} color="#fff" />
                    <Text style={ds.submitText}>{t('visit.laboratory.orderForm.submit')}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

export default LabOrderForm;

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: { padding: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: tc.textPrimary, marginBottom: 12 },
    searchBar: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: tc.inputBackground,
        borderWidth: 1, borderColor: tc.borderColor, borderRadius: 8, paddingHorizontal: 12, height: 42, marginBottom: 12,
    },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: tc.textPrimary, padding: 0 },
    testsList: { maxHeight: hp(25), marginBottom: 12 },
    testItem: {
        flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8,
        borderWidth: 1, borderColor: tc.borderColor, marginBottom: 8, backgroundColor: tc.cardBackground,
    },
    testItemSelected: { borderColor: '#58A7B3', backgroundColor: isDark ? 'rgba(88,167,179,0.1)' : '#E8F7F9' },
    checkbox: {
        width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: tc.borderColor,
        justifyContent: 'center', alignItems: 'center', marginRight: 12,
    },
    checkboxSelected: { backgroundColor: '#58A7B3', borderColor: '#58A7B3' },
    testInfo: { flex: 1 },
    testName: { fontSize: 14, fontWeight: '600', color: tc.textPrimary },
    testCode: { fontSize: 12, color: tc.textMuted, marginTop: 2 },
    selectedBadge: {
        alignSelf: 'flex-start', backgroundColor: '#58A7B3', borderRadius: 12,
        paddingHorizontal: 12, paddingVertical: 4, marginBottom: 16,
    },
    selectedBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    label: { fontSize: 13, fontWeight: '600', color: tc.textSecondary, marginBottom: 8 },
    priorityRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    priorityChip: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8,
        borderRadius: 8, borderWidth: 1.5, borderColor: tc.borderColor,
    },
    priorityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    priorityText: { fontSize: 13, color: tc.textSecondary },
    notesInput: {
        borderWidth: 1, borderColor: tc.borderColor, borderRadius: 8, padding: 12,
        fontSize: 14, color: tc.textPrimary, backgroundColor: tc.inputBackground,
        minHeight: 70, textAlignVertical: 'top', marginBottom: 16,
    },
    submitButton: { borderRadius: 8, overflow: 'hidden' },
    submitButtonDisabled: { opacity: 0.5 },
    submitGradient: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 14, paddingHorizontal: 20,
    },
    submitText: { color: '#fff', fontSize: 15, fontWeight: '600', marginLeft: 8 },
});
