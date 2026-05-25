import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

interface AdditionalRightsProps {
    selectedRights: string[];
    onChange: (rights: string[]) => void;
}

const RIGHTS_CODES = ['IB', 'IW', 'ZK', 'C', 'DN', 'AZ'];

const AdditionalRights = ({ selectedRights, onChange }: AdditionalRightsProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createStyles(tc, isDark);

    const handleToggle = (code: string) => {
        const next = selectedRights.includes(code)
            ? selectedRights.filter(r => r !== code)
            : [...selectedRights, code];
        onChange(next);
    };

    return (
        <View style={ds.container}>
            <Text style={ds.label}>{t('additionalRights.label')}</Text>

            <View style={ds.infoBox}>
                <Feather name="info" size={14} color="#3B82F6" style={ds.infoIcon} />
                <Text style={ds.infoText}>{t('additionalRights.info')}</Text>
            </View>

            <View style={ds.grid}>
                {RIGHTS_CODES.map((code) => {
                    const isSelected = selectedRights.includes(code);
                    return (
                        <TouchableOpacity
                            key={code}
                            style={[ds.card, isSelected && ds.cardActive]}
                            onPress={() => handleToggle(code)}
                            activeOpacity={0.7}
                        >
                            <View style={ds.cardHeader}>
                                <View style={[ds.checkbox, isSelected && ds.checkboxChecked]}>
                                    {isSelected && <Feather name="check" size={12} color="#fff" />}
                                </View>
                                <View style={ds.cardTitleRow}>
                                    <MaterialCommunityIcons
                                        name="shield-check"
                                        size={16}
                                        color="#58A7B3"
                                    />
                                    <Text style={ds.cardName}>
                                        {t(`additionalRights.rights.${code}.name`)}
                                    </Text>
                                    <Text style={ds.cardCode}>({code})</Text>
                                </View>
                            </View>
                            <Text style={ds.cardDesc}>
                                {t(`additionalRights.rights.${code}.description`)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
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
            marginBottom: 8,
        },
        infoBox: {
            backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : '#EFF6FF',
            borderRadius: 8,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 12,
        },
        infoIcon: {
            marginRight: 8,
            marginTop: 2,
        },
        infoText: {
            flex: 1,
            fontSize: 12,
            color: isDark ? '#93C5FD' : '#3B82F6',
            lineHeight: 18,
        },
        grid: {
            gap: 10,
        },
        card: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            padding: 12,
            backgroundColor: tc.cardBackgroundAlt,
        },
        cardActive: {
            borderColor: '#58A7B3',
            backgroundColor: isDark ? 'rgba(88,167,179,0.08)' : '#F0FAFB',
        },
        cardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
        },
        checkbox: {
            width: 18,
            height: 18,
            borderRadius: 4,
            borderWidth: 1.5,
            borderColor: tc.borderColor,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
            backgroundColor: tc.cardBackgroundAlt,
        },
        checkboxChecked: {
            backgroundColor: '#58A7B3',
            borderColor: '#58A7B3',
        },
        cardTitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            flex: 1,
        },
        cardName: {
            fontSize: 13,
            fontWeight: '600',
            color: tc.textPrimary,
        },
        cardCode: {
            fontSize: 12,
            color: '#58A7B3',
            fontWeight: '600',
        },
        cardDesc: {
            fontSize: 12,
            color: tc.textSecondary,
            marginLeft: 28,
            lineHeight: 17,
        },
    });

export default AdditionalRights;
