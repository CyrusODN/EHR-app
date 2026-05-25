import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import type { ScheduledProcedure, ProcedureCategory } from '../../../types/procedures';

interface ProcedureFormProps {
    onSubmit: (procedure: Partial<ScheduledProcedure>) => void;
    visitId: string;
    patientId?: string;
}

const CATEGORIES: { value: ProcedureCategory; labelKey: string; icon: string }[] = [
    { value: 'diagnostic', labelKey: 'visit.procedures.category.diagnostic', icon: 'search' },
    { value: 'therapeutic', labelKey: 'visit.procedures.category.therapeutic', icon: 'heart' },
    { value: 'preventive', labelKey: 'visit.procedures.category.preventive', icon: 'shield' },
    { value: 'surgical', labelKey: 'visit.procedures.category.surgical', icon: 'scissors' },
];

const ProcedureForm = ({ onSubmit, visitId, patientId }: ProcedureFormProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    const [name, setName] = useState('');
    const [category, setCategory] = useState<ProcedureCategory>('diagnostic');
    const [icd9Code, setIcd9Code] = useState('');
    const [description, setDescription] = useState('');
    const [scheduledDate, setScheduledDate] = useState(new Date());
    const [duration, setDuration] = useState('30');
    const [notes, setNotes] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSubmit = () => {
        if (!name.trim()) return;

        const procedure: Partial<ScheduledProcedure> = {
            id: Date.now().toString(),
            name: name.trim(),
            category,
            icd9Code: icd9Code.trim(),
            description: description.trim(),
            duration: parseInt(duration) || 30,
            scheduledDate: scheduledDate.toISOString(),
            status: 'planned',
            visitId,
            patientId: patientId || '',
            notes: notes.trim(),
            requiredSpecialization: [],
            contraindications: [],
            preparationInstructions: [],
            risks: [],
            expectedOutcomes: [],
            aftercareInstructions: [],
            estimatedCost: 0,
            assignedDoctor: '',
        };

        onSubmit(procedure);
        setName('');
        setIcd9Code('');
        setDescription('');
        setNotes('');
        setDuration('30');
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={ds.container}>
            <Text style={ds.sectionTitle}>{t('visit.procedures.form.title')}</Text>

            <Text style={ds.label}>{t('visit.procedures.form.name')} *</Text>
            <TextInput
                style={ds.input}
                placeholder={t('visit.procedures.form.namePlaceholder')}
                placeholderTextColor={tc.textMuted}
                value={name}
                onChangeText={setName}
            />

            <Text style={ds.label}>{t('visit.procedures.form.category')}</Text>
            <View style={ds.categoryRow}>
                {CATEGORIES.map(cat => (
                    <TouchableOpacity
                        key={cat.value}
                        style={[ds.categoryChip, category === cat.value && ds.categoryChipActive]}
                        onPress={() => setCategory(cat.value)}
                    >
                        <Feather name={cat.icon} size={14} color={category === cat.value ? '#fff' : tc.textMuted} />
                        <Text style={[ds.categoryText, category === cat.value && ds.categoryTextActive]}>
                            {t(cat.labelKey)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={ds.row}>
                <View style={ds.halfField}>
                    <Text style={ds.label}>{t('visit.procedures.form.icd9Code')}</Text>
                    <TextInput
                        style={ds.input}
                        placeholder="00.00"
                        placeholderTextColor={tc.textMuted}
                        value={icd9Code}
                        onChangeText={setIcd9Code}
                    />
                </View>
                <View style={ds.halfField}>
                    <Text style={ds.label}>{t('visit.procedures.form.duration')}</Text>
                    <TextInput
                        style={ds.input}
                        placeholder="30"
                        placeholderTextColor={tc.textMuted}
                        value={duration}
                        onChangeText={setDuration}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <Text style={ds.label}>{t('visit.procedures.form.scheduledDate')}</Text>
            <TouchableOpacity style={ds.dateInput} onPress={() => setShowDatePicker(true)}>
                <Feather name="calendar" size={16} color={tc.accent} />
                <Text style={ds.dateText}>{formatDate(scheduledDate)}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={scheduledDate}
                    mode="datetime"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, date) => {
                        if (Platform.OS === 'android') setShowDatePicker(false);
                        if (date) setScheduledDate(date);
                    }}
                />
            )}
            {showDatePicker && Platform.OS === 'ios' && (
                <TouchableOpacity style={ds.donePicker} onPress={() => setShowDatePicker(false)}>
                    <Text style={ds.donePickerText}>{t('common.done')}</Text>
                </TouchableOpacity>
            )}

            <Text style={ds.label}>{t('visit.procedures.form.description')}</Text>
            <TextInput
                style={[ds.input, ds.textArea]}
                placeholder={t('visit.procedures.form.descriptionPlaceholder')}
                placeholderTextColor={tc.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
            />

            <Text style={ds.label}>{t('visit.procedures.form.notes')}</Text>
            <TextInput
                style={[ds.input, ds.textArea]}
                placeholder={t('visit.procedures.form.notesPlaceholder')}
                placeholderTextColor={tc.textMuted}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={2}
            />

            <TouchableOpacity
                style={[ds.submitButton, !name.trim() && ds.submitDisabled]}
                onPress={handleSubmit}
                disabled={!name.trim()}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={name.trim() ? ['#4A90B9', '#5BA6B6', '#68BFB3'] : [tc.borderColor, tc.borderColor]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={ds.submitGradient}
                >
                    <Feather name="plus" size={16} color="#fff" />
                    <Text style={ds.submitText}>{t('visit.procedures.form.submit')}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

export default ProcedureForm;

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: { padding: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: tc.textPrimary, marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '600', color: tc.textSecondary, marginBottom: 6 },
    input: {
        borderWidth: 1, borderColor: tc.borderColor, borderRadius: 8, paddingHorizontal: 12,
        paddingVertical: 10, fontSize: 14, color: tc.textPrimary, backgroundColor: tc.inputBackground, marginBottom: 14,
    },
    textArea: { minHeight: 70, textAlignVertical: 'top' },
    categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    categoryChip: {
        flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12,
        paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: tc.borderColor,
    },
    categoryChipActive: { backgroundColor: '#58A7B3', borderColor: '#58A7B3' },
    categoryText: { fontSize: 12, color: tc.textMuted, fontWeight: '500' },
    categoryTextActive: { color: '#fff', fontWeight: '600' },
    row: { flexDirection: 'row', gap: 12 },
    halfField: { flex: 1 },
    dateInput: {
        flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1,
        borderColor: tc.borderColor, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12,
        backgroundColor: tc.inputBackground, marginBottom: 14,
    },
    dateText: { fontSize: 14, color: tc.textPrimary },
    donePicker: { alignSelf: 'flex-end', marginBottom: 12 },
    donePickerText: { fontSize: 14, fontWeight: '700', color: tc.accent },
    submitButton: { borderRadius: 8, overflow: 'hidden', marginTop: 4 },
    submitDisabled: { opacity: 0.5 },
    submitGradient: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 14, paddingHorizontal: 20,
    },
    submitText: { color: '#fff', fontSize: 15, fontWeight: '600', marginLeft: 8 },
});
