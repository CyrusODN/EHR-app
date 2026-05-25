import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

interface RefundationSelectProps {
    categories: string[];
    selectedCategory: string;
    onChange: (category: string) => void;
}

const RefundationSelect = ({ categories, selectedCategory, onChange }: RefundationSelectProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createStyles(tc, isDark);

    const getOptionLabel = (category: string) => {
        switch (category) {
            case '100%': return t('refundationSelect.options.free');
            case 'R': return t('refundationSelect.options.lump');
            case 'B': return t('refundationSelect.options.freeLimit');
            case 'S': return t('refundationSelect.options.senior');
            default: return `${t('refundationSelect.options.payment')}${category}`;
        }
    };

    const allOptions = ['', ...categories];

    return (
        <View style={ds.container}>
            <Text style={ds.label}>
                <Feather name="percent" size={14} color={tc.textSecondary} />
                {'  '}{t('refundationSelect.label')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={ds.scrollRow}>
                {allOptions.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                        <TouchableOpacity
                            key={cat || 'full'}
                            style={[ds.chip, isSelected && ds.chipActive]}
                            onPress={() => onChange(cat)}
                            activeOpacity={0.7}
                        >
                            <Text style={[ds.chipText, isSelected && ds.chipTextActive]}>
                                {cat === '' ? t('refundationSelect.options.fullPrice') : getOptionLabel(cat)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const createStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        container: {
            marginBottom: 16,
        },
        label: {
            fontSize: 13,
            fontWeight: '600',
            color: tc.textSecondary,
            marginBottom: 10,
        },
        scrollRow: {
            flexDirection: 'row',
        },
        chip: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginRight: 8,
            backgroundColor: tc.cardBackgroundAlt,
        },
        chipActive: {
            borderColor: '#58A7B3',
            backgroundColor: isDark ? 'rgba(88,167,179,0.15)' : '#E2F2F4',
        },
        chipText: {
            fontSize: 13,
            fontWeight: '600',
            color: tc.textSecondary,
        },
        chipTextActive: {
            color: '#58A7B3',
        },
    });

export default RefundationSelect;
