import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import type { Medication } from '../../../types/visit';

interface DosageFormProps {
    medication: Medication;
    onDosageChange: (dosage: string) => void;
    onPackageCountChange: (count: number) => void;
    onRefillsChange: (refills: number) => void;
    onInstructionsChange: (instructions: string) => void;
    packageCount: number;
    refills: number;
    instructions: string;
}

const COMMON_PATTERNS = [
    { pattern: '1x1', suggestions: ['1x1 rano', '1x1 wieczorem'] },
    { pattern: '2x1', suggestions: ['2x1 rano i wieczorem', '2x1 co 12 godzin'] },
    { pattern: '3x1', suggestions: ['3x1 co 8 godzin', '3x1 przy posiłkach'] },
    { pattern: '1x2', suggestions: ['1x2 rano', '1x2 wieczorem'] },
    { pattern: '2x2', suggestions: ['2x2 rano i wieczorem', '2x2 co 12 godzin'] },
];

const DosageForm = ({
    medication,
    onDosageChange,
    onPackageCountChange,
    onRefillsChange,
    onInstructionsChange,
    packageCount,
    refills,
    instructions,
}: DosageFormProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createStyles(tc, isDark);

    const [dosage, setDosage] = useState(medication.commonDosage || '');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleDosageChange = (value: string) => {
        setDosage(value);
        onDosageChange(value);

        const match = COMMON_PATTERNS.find(p =>
            value.toLowerCase().includes(p.pattern.toLowerCase())
        );
        setSuggestions(match ? match.suggestions : []);
    };

    const handleSuggestionPress = (suggestion: string) => {
        setDosage(suggestion);
        onDosageChange(suggestion);
        setSuggestions([]);
    };

    const adjustPackageCount = (delta: number) => {
        const next = Math.max(1, packageCount + delta);
        onPackageCountChange(next);
    };

    return (
        <View style={ds.container}>
            <View style={ds.field}>
                <Text style={ds.label}>{t('dosageForm.labels.dosage')}</Text>
                <View style={ds.inputWrapper}>
                    <Feather name="clock" size={18} color={tc.textMuted} style={ds.icon} />
                    <TextInput
                        style={ds.input}
                        value={dosage}
                        onChangeText={handleDosageChange}
                        placeholder={t('dosageForm.placeholders.dosage')}
                        placeholderTextColor={tc.textMuted}
                    />
                </View>
            </View>

            {suggestions.length > 0 && (
                <View style={ds.suggestionsContainer}>
                    <View style={ds.suggestionsHeader}>
                        <Feather name="info" size={14} color={tc.textSecondary} />
                        <Text style={ds.suggestionsTitle}>{t('dosageForm.suggestions.title')}</Text>
                    </View>
                    <View style={ds.suggestionsRow}>
                        {suggestions.map((suggestion, i) => (
                            <TouchableOpacity
                                key={i}
                                style={ds.suggestionChip}
                                onPress={() => handleSuggestionPress(suggestion)}
                                activeOpacity={0.7}
                            >
                                <Text style={ds.suggestionText}>{suggestion}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            <View style={ds.row}>
                <View style={ds.halfField}>
                    <Text style={ds.label}>{t('dosageForm.labels.packageCount')}</Text>
                    <View style={ds.stepperWrapper}>
                        <TouchableOpacity
                            style={ds.stepperButton}
                            onPress={() => adjustPackageCount(-1)}
                            activeOpacity={0.7}
                        >
                            <Feather name="minus" size={16} color={tc.textPrimary} />
                        </TouchableOpacity>
                        <Text style={ds.stepperValue}>{packageCount}</Text>
                        <TouchableOpacity
                            style={ds.stepperButton}
                            onPress={() => adjustPackageCount(1)}
                            activeOpacity={0.7}
                        >
                            <Feather name="plus" size={16} color={tc.textPrimary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={ds.halfField}>
                    <Text style={ds.label}>{t('dosageForm.labels.refills')}</Text>
                    <View style={ds.refillRow}>
                        {[0, 1, 2, 3].map((val) => (
                            <TouchableOpacity
                                key={val}
                                style={[ds.refillChip, refills === val && ds.refillChipActive]}
                                onPress={() => onRefillsChange(val)}
                                activeOpacity={0.7}
                            >
                                <Text style={[ds.refillText, refills === val && ds.refillTextActive]}>
                                    {val}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            <View style={ds.field}>
                <Text style={ds.label}>{t('dosageForm.labels.instructions')}</Text>
                <TextInput
                    style={ds.textArea}
                    value={instructions}
                    onChangeText={onInstructionsChange}
                    placeholder={t('dosageForm.placeholders.instructions')}
                    placeholderTextColor={tc.textMuted}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                />
            </View>
        </View>
    );
};

const createStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        container: {
            marginBottom: 8,
        },
        field: {
            marginBottom: 16,
        },
        label: {
            fontSize: 13,
            fontWeight: '600',
            color: tc.textSecondary,
            marginBottom: 8,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 48,
            backgroundColor: tc.cardBackgroundAlt,
        },
        icon: {
            marginRight: 8,
        },
        input: {
            flex: 1,
            fontSize: 14,
            color: tc.textPrimary,
        },
        suggestionsContainer: {
            marginBottom: 16,
        },
        suggestionsHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginBottom: 8,
        },
        suggestionsTitle: {
            fontSize: 12,
            color: tc.textSecondary,
        },
        suggestionsRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
        },
        suggestionChip: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6',
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 6,
        },
        suggestionText: {
            fontSize: 13,
            color: tc.textPrimary,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
        },
        halfField: {
            width: '48%',
        },
        stepperWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            backgroundColor: tc.cardBackgroundAlt,
            height: 48,
            justifyContent: 'space-between',
            paddingHorizontal: 4,
        },
        stepperButton: {
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F3F4F6',
        },
        stepperValue: {
            fontSize: 16,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        refillRow: {
            flexDirection: 'row',
            gap: 6,
        },
        refillChip: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            width: 40,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tc.cardBackgroundAlt,
        },
        refillChipActive: {
            borderColor: '#58A7B3',
            backgroundColor: isDark ? 'rgba(88,167,179,0.15)' : '#E2F2F4',
        },
        refillText: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textSecondary,
        },
        refillTextActive: {
            color: '#58A7B3',
        },
        textArea: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            padding: 12,
            fontSize: 14,
            color: tc.textPrimary,
            backgroundColor: tc.cardBackgroundAlt,
            minHeight: 72,
        },
    });

export default DosageForm;
