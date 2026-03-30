import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

interface VisitDiagnosisProps {
    onNext: () => void;
    onBack: () => void;
    visitData?: any;
}

const VisitDiagnosis = ({ onNext, onBack, visitData }: VisitDiagnosisProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDiagnoses, setSelectedDiagnoses] = useState<any[]>(visitData?.diagnosis?.icd10 || []);

    useEffect(() => {
        if (visitData?.diagnosis?.icd10) {
            setSelectedDiagnoses(visitData.diagnosis.icd10);
        }
    }, [visitData]);

    return (
        <ScrollView style={ds.container} showsVerticalScrollIndicator={false}>
            <View style={ds.card}>
                <Text style={ds.title}>{t('visit.diagnosis.title')}</Text>

                <View style={ds.searchSection}>
                    <Text style={ds.searchLabel}>{t('visit.diagnosis.search_title')}</Text>
                    <View style={ds.searchInputContainer}>
                        <Feather name="search" size={20} color={tc.textMuted} style={ds.searchIcon} />
                        <TextInput
                            style={ds.searchInput}
                            placeholder={t('visit.diagnosis.search_placeholder')}
                            placeholderTextColor={tc.textMuted}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                <View style={ds.selectedSection}>
                    <Text style={ds.selectedLabel}>{t('visit.diagnosis.selected')}</Text>
                    
                    {selectedDiagnoses.length > 0 ? (
                        <View style={ds.diagnosesList}>
                            {selectedDiagnoses.map((diag, index) => (
                                <View key={index} style={ds.diagnosisItem}>
                                    <Text style={ds.diagnosisCode}>{diag.code || diag}</Text>
                                    <Text style={ds.diagnosisName}>{diag.name || diag.description || t('visit.diagnosis.title')}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={ds.emptyStateContainer}>
                            <View style={ds.emptyIconCircle}>
                                <Feather name="search" size={40} color={tc.textMuted} />
                            </View>
                            <Text style={ds.emptyTitle}>{t('visit.diagnosis.empty')}</Text>
                            <Text style={ds.emptySubtitle}>{t('visit.diagnosis.empty_desc')}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Footer */}
            <View style={ds.footer}>
                <TouchableOpacity style={ds.backButton} onPress={onBack}>
                    <Feather name="arrow-left" size={18} color="#58A7B3" />
                    <Text style={ds.backButtonText}>{t('visit.navigation.previous')}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onNext}>
                    <LinearGradient
                        colors={['#58A7B3', '#8ED1CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={ds.nextButton}
                    >
                        <Text style={ds.nextButtonText}>{t('visit.navigation.next')}</Text>
                        <Feather name="arrow-right" size={18} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 12,
        },
        card: {
            backgroundColor: tc.cardBackground,
            borderRadius: 12,
            padding: 24,
            borderWidth: 1,
            borderColor: tc.borderColor,
            minHeight: hp(60),
        },
        title: {
            fontSize: 18,
            fontWeight: '700',
            color: tc.textPrimary,
            marginBottom: 24,
        },
        searchSection: {
            marginBottom: 24,
        },
        searchLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textSecondary,
            marginBottom: 12,
        },
        searchInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 52,
            backgroundColor: tc.cardBackgroundAlt,
        },
        searchIcon: {
            marginRight: 10,
        },
        searchInput: {
            flex: 1,
            fontSize: 14,
            color: tc.textPrimary,
        },
        selectedSection: {
            flex: 1,
        },
        selectedLabel: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.textSecondary,
            marginBottom: 16,
        },
        diagnosesList: {
            marginTop: 8,
        },
        diagnosisItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            backgroundColor: tc.searchBarBg,
            borderRadius: 8,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: tc.borderColor,
        },
        diagnosisCode: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.textPrimary,
            marginRight: 12,
            minWidth: 50,
        },
        diagnosisName: {
            flex: 1,
            fontSize: 14,
            color: tc.textSecondary,
        },
        emptyStateContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60,
        },
        emptyIconCircle: {
            marginBottom: 16,
        },
        emptyTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: tc.textSecondary,
            marginBottom: 8,
        },
        emptySubtitle: {
            fontSize: 14,
            color: tc.textMuted,
            textAlign: 'center',
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            width:wp(80),
            alignItems:'center',
            gap:wp(2)
        },
        backButton: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: '#58A7B3',
            borderRadius: 8,
            width: wp(43),
            height: 50,
            justifyContent: 'center',
        },
        backButtonText: {
            fontSize: 16,
            color: '#58A7B3',
            fontWeight: '700',
            marginLeft: 8,
        },
        nextButton: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 8,
            width: wp(43),
            height: 50,
            justifyContent: 'center',
        },
        nextButtonText: {
            fontSize: 16,
            color: '#fff',
            fontWeight: '700',
            marginRight: 8,
        },
    });

export default VisitDiagnosis;
