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

interface ClinicalTrialsProps {
    serviceToken: string | null;
    onShowAlert?: (message: string, type?: 'success' | 'warning' | 'error') => void;
}

const ClinicalTrials = ({ serviceToken, onShowAlert }: ClinicalTrialsProps) => {
    const { t } = useTranslation();
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
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: hp(5) }} showsVerticalScrollIndicator={false}>
            <View style={styles.searchSection}>
                <View style={styles.inputRow}>
                    <View style={styles.inputCol}>
                        <Text style={styles.inputLabel}>{t('aiAssistant.clinicalTrials.diagnosis')}</Text>
                        <CustomTextInput
                            placeholder={t('aiAssistant.clinicalTrials.diagnosisPlaceholder')}
                            value={diagnosis}
                            onChangeText={setDiagnosis}
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.inputCol}>
                        <Text style={styles.inputLabel}>{t('aiAssistant.clinicalTrials.location')}</Text>
                        <CustomTextInput
                            placeholder={t('aiAssistant.clinicalTrials.locationPlaceholder')}
                            value={location}
                            onChangeText={setLocation}
                            style={styles.textInput}
                        />
                    </View>
                </View>

                <Gap height={hp(2)} />

                <PrimaryButton
                    label={loading ? t('aiAssistant.clinicalTrials.searching') : t('aiAssistant.clinicalTrials.searchTrials')}
                    filled={true}
                    onPress={handleSearch}
                    style={styles.searchBtn}
                    icon={loading ? <ActivityIndicator color="white" size="small" /> : <Feather name="search" color={"white"} size={18} />}
                    disabled={loading}
                />
            </View>

            {searched && (
                <View style={styles.resultsHeader}>
                    <Text style={styles.foundText}>{t('aiAssistant.clinicalTrials.foundTrials', { count: trials.length })}</Text>
                </View>
            )}

            {trials.map((trial, index) => (
                <View key={trial.id || index} style={styles.trialCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.trialTitle}>{trial.title}</Text>
                        <Gap height={hp(1)} />
                        <Text style={styles.trialMeta}>{t('aiAssistant.clinicalTrials.id')}: {trial.id}</Text>
                        <Text style={styles.trialMeta}>{t('aiAssistant.clinicalTrials.sponsor')}: {trial.sponsor}</Text>
                        <Text style={styles.trialMeta}>{t('aiAssistant.clinicalTrials.phase')}: {trial.phase}</Text>
                    </View>

                    <View style={styles.locationContainer}>
                        <Feather name="map-pin" size={14} color="#9CA3AF" style={{ marginRight: 5 }} />
                        <Text style={styles.locationText} numberOfLines={1}>{trial.location}</Text>
                    </View>

                    <View style={styles.criteriaRow}>
                        <View style={styles.criteriaCol}>
                            <Text style={styles.criteriaTitle}>{t('aiAssistant.clinicalTrials.inclusionCriteria')}</Text>
                            {(trial.criteria?.inclusion || []).map((item: string, i: number) => (
                                <Text key={i} style={styles.criteriaItem}>• {item}</Text>
                            ))}
                        </View>
                        <View style={styles.criteriaCol}>
                            <Text style={styles.criteriaTitle}>{t('aiAssistant.clinicalTrials.exclusionCriteria')}</Text>
                            {(trial.criteria?.exclusion || []).map((item: string, i: number) => (
                                <Text key={i} style={styles.criteriaItem}>• {item}</Text>
                            ))}
                        </View>
                    </View>

                    <View style={styles.cardFooter}>
                        <TouchableOpacity style={styles.detailsBtn}>
                            <Feather name="file-text" size={14} color="#4A90B9" style={{ marginRight: 5 }} />
                            <Text style={styles.detailsBtnText}>{t('aiAssistant.clinicalTrials.details')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            {searched && trials.length === 0 && !loading && (
                <View style={styles.noResults}>
                    <Text style={styles.noResultsText}>{t('aiAssistant.clinicalTrials.noResults')}</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    searchSection: {
        padding: 15,
        backgroundColor: '#FFFFFF',
        margin: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputCol: {
        width: '48%',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    searchBtn: {
        width: '100%',
        backgroundColor: '#67B7B1',
        borderRadius: 8,
        height: hp(6),
    },
    resultsHeader: {
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    foundText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    trialCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    cardHeader: {
        padding: 15,
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    trialTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#111827',
        lineHeight: 20,
    },
    trialMeta: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    locationText: {
        fontSize: 12,
        color: '#6B7280',
        flex: 1,
    },
    criteriaRow: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    criteriaCol: {
        flex: 1,
    },
    criteriaTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 8,
    },
    criteriaItem: {
        fontSize: 12,
        color: '#4B5563',
        marginBottom: 4,
        lineHeight: 18,
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        padding: 10,
        alignItems: 'flex-end',
    },
    detailsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4A90B9',
    },
    detailsBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A90B9',
    },
    noResults: {
        padding: 20,
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 14,
        color: '#6B7280',
    },
});

export default ClinicalTrials;
