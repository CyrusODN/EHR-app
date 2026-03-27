import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PrimaryButton from '../../../component/button';
import CustomTextInput from '../../../component/customTextInput';
import Gap from '../../../component/gap';
import { searchClinicalTrials } from '../../../Services/AiAssitants.Service';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

interface ClinicalTrialsProps {
    serviceToken: string | null;
    onShowAlert?: (message: string, type?: 'success' | 'warning' | 'error') => void;
}

const ClinicalTrials = ({ serviceToken, onShowAlert }: ClinicalTrialsProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const [diagnosis, setDiagnosis] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [trials, setTrials] = useState<any[]>([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!diagnosis.trim()) {
            if (onShowAlert) onShowAlert(t('aiAssistant.clinicalTrials.enterDiagnosis'), "warning");
            return;
        }

        setLoading(true);
        setSearched(true);
        try {
            const results = await searchClinicalTrials(serviceToken as string, diagnosis, location);
            setTrials(results || []);
        } catch (error) {
            console.error("[ClinicalTrials] Search Error:", error);
            if (onShowAlert) onShowAlert(t('aiAssistant.clinicalTrials.fetchFailed'), "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={ds.container} contentContainerStyle={{ paddingBottom: hp(5) }} showsVerticalScrollIndicator={false}>
            <View style={ds.searchSection}>
                <View style={ds.inputRow}>
                    <View style={ds.inputCol}>
                        <Text style={ds.inputLabel}>{t('aiAssistant.clinicalTrials.diagnosis')}</Text>
                        <CustomTextInput
                            placeholder={t('aiAssistant.clinicalTrials.diagnosisPlaceholder')}
                            value={diagnosis}
                            onChangeText={setDiagnosis}
                            style={ds.textInput}
                        />
                    </View>
                    <View style={ds.inputCol}>
                        <Text style={ds.inputLabel}>{t('aiAssistant.clinicalTrials.location')}</Text>
                        <CustomTextInput
                            placeholder={t('aiAssistant.clinicalTrials.locationPlaceholder')}
                            value={location}
                            onChangeText={setLocation}
                            style={ds.textInput}
                        />
                    </View>
                </View>

                <Gap height={hp(2)} />

                <PrimaryButton
                    label={loading ? t('aiAssistant.clinicalTrials.searching') : t('aiAssistant.clinicalTrials.searchTrials')}
                    filled={true}
                    onPress={handleSearch}
                    style={ds.searchBtn}
                    icon={loading ? <ActivityIndicator color="white" size="small" /> : <Feather name="search" color={"white"} size={18} />}
                    disabled={loading}
                />
            </View>

            {searched && (
                <View style={ds.resultsHeader}>
                    <Text style={ds.foundText}>{t('aiAssistant.clinicalTrials.foundTrials', { count: trials.length })}</Text>
                </View>
            )}

            {trials.map((trial, index) => (
                <View key={trial.id || index} style={ds.trialCard}>
                    <View style={ds.cardHeader}>
                        <Text style={ds.trialTitle}>{trial.title}</Text>
                        <Gap height={hp(1)} />
                        <Text style={ds.trialMeta}>{t('aiAssistant.clinicalTrials.id')}: {trial.id}</Text>
                        <Text style={ds.trialMeta}>{t('aiAssistant.clinicalTrials.sponsor')}: {trial.sponsor}</Text>
                        <Text style={ds.trialMeta}>{t('aiAssistant.clinicalTrials.phase')}: {trial.phase}</Text>
                    </View>

                    <View style={ds.locationContainer}>
                        <Feather name="map-pin" size={14} color={tc.textMuted} style={{ marginRight: 5 }} />
                        <Text style={ds.locationText} numberOfLines={1}>{trial.location}</Text>
                    </View>

                    <View style={ds.criteriaRow}>
                        <View style={ds.criteriaCol}>
                            <Text style={ds.criteriaTitle}>{t('aiAssistant.clinicalTrials.inclusionCriteria')}</Text>
                            {(trial.criteria?.inclusion || []).map((item: string, i: number) => (
                                <Text key={i} style={ds.criteriaItem}>• {item}</Text>
                            ))}
                        </View>
                        <Gap width={12} />
                        <View style={ds.criteriaCol}>
                            <Text style={ds.criteriaTitle}>{t('aiAssistant.clinicalTrials.exclusionCriteria')}</Text>
                            {(trial.criteria?.exclusion || []).map((item: string, i: number) => (
                                <Text key={i} style={ds.criteriaItem}>• {item}</Text>
                            ))}
                        </View>
                    </View>

                    <View style={ds.cardFooter}>
                        <TouchableOpacity style={ds.detailsBtn}>
                            <Feather name="file-text" size={14} color={tc.accent} style={{ marginRight: 5 }} />
                            <Text style={ds.detailsBtnText}>{t('aiAssistant.clinicalTrials.details')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            {searched && trials.length === 0 && !loading && (
                <View style={ds.noResults}>
                    <Text style={ds.noResultsText}>{t('aiAssistant.clinicalTrials.noResults')}</Text>
                </View>
            )}
        </ScrollView>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    searchSection: {
        padding: 20,
        backgroundColor: tc.cardBackground,
        margin: 15,
        borderRadius: 12,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    inputCol: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: tc.textPrimary,
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: tc.inputBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: tc.borderSubtle,
    },
    searchBtn: {
        width: '100%',
        borderRadius: 8,
        height: 48,
        marginBottom: 0,
    },
    resultsHeader: {
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    foundText: {
        fontSize: 16,
        fontWeight: '800',
        color: tc.textPrimary,
    },
    trialCard: {
        backgroundColor: tc.cardBackground,
        marginHorizontal: 15,
        marginBottom: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: tc.borderSubtle,
        overflow: 'hidden',
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.2 : 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        padding: 16,
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    trialTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: tc.textPrimary,
        lineHeight: 22,
    },
    trialMeta: {
        fontSize: 12,
        color: tc.textSecondary,
        marginTop: 2,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    locationText: {
        fontSize: 12,
        color: tc.textSecondary,
        flex: 1,
    },
    criteriaRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    criteriaCol: {
        flex: 1,
    },
    criteriaTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: tc.textPrimary,
        marginBottom: 8,
    },
    criteriaItem: {
        fontSize: 12,
        color: tc.textSecondary,
        marginBottom: 4,
        lineHeight: 18,
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: tc.borderSubtle,
        padding: 12,
        alignItems: 'flex-end',
        backgroundColor: isDark ? 'rgba(255,255,255,0.01)' : 'transparent',
    },
    detailsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: tc.accent,
    },
    detailsBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: tc.accent,
    },
    noResults: {
        padding: 40,
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 14,
        color: tc.textMuted,
    },
});

export default ClinicalTrials;
