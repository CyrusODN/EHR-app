import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import PsychiatricScalesModal from './modals/PsychiatricScalesModal';
import ScaleQuestionnaireModal from './modals/ScaleQuestionnaireModal';
import VisitHistoryModal from './modals/VisitHistoryModal';
import { GetPreviousVisits, GetPatientVisits } from '../../Services/Visit.Service';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

interface VisitInterviewProps {
    onNext: () => void;
    onBack: () => void;
    visitId?: string;
    patientId?: string;
    visitData?: any;
    onUpdate?: (data: any) => void;
}

const VisitInterview = ({ onNext, onBack, visitId, patientId, visitData, onUpdate }: VisitInterviewProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const [mainSymptoms, setMainSymptoms] = useState(visitData?.interview?.mainSymptoms || '');
    const [additionalNotes, setAdditionalNotes] = useState(visitData?.notes || '');
    const [showScalesModal, setShowScalesModal] = useState(false);
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);
    const [selectedScale, setSelectedScale] = useState('');
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [visits, setVisits] = useState<any[]>([]);
    const [totalVisits, setTotalVisits] = useState(0);
    const [loading, setLoading] = useState(false);
    const [completedScales, setCompletedScales] = useState<Record<string, number>>(visitData?.interview?.psychiatricScales || {});

    // Update state if visitData changes
    useEffect(() => {
        if (visitData) {
            if (visitData.interview) {
                setMainSymptoms(visitData.interview.mainSymptoms || '');
                if (visitData.interview.psychiatricScales && typeof visitData.interview.psychiatricScales === 'object') {
                    setCompletedScales(visitData.interview.psychiatricScales);
                }
            }
            if (visitData.notes) {
                setAdditionalNotes(visitData.notes || '');
            }
        }
    }, [visitData]);

    // Fetch previous visits for history modal using GetPreviousVisits
    useEffect(() => {
        if (visitId) {
            fetchVisitHistory();
        }
    }, [visitId]);

    // Removed fetchInterviewData since we pass visitData directly

    const fetchVisitHistory = async () => {
        setLoading(true);
        try {
            const result = await GetPreviousVisits(visitId);
            const data = result?.data || result;
            if (data) {
                setVisits(data.previousVisits || []);
                setTotalVisits(data.total || data.previousVisits?.length || 0);
            }
        } catch (error) {
            console.error("Error fetching visit history:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={ds.container}>
            <View style={ds.card}>
                {/* Header */}
                <View style={ds.headerRow}>
                    <Text style={ds.title}>{t('visit.interview.title')}</Text>
                    <TouchableOpacity onPress={() => setShowScalesModal(true)}>
                        <LinearGradient
                            colors={['#58A7B3', '#8ED1CC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={ds.psychiatricButton}
                        >
                            <MaterialCommunityIcons name="brain" size={18} color="#fff" />
                            <Text style={ds.psychiatricButtonText}>{t('visit.interview.scales.title')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Main Symptoms */}
                <View style={ds.fieldContainer}>
                    <Text style={ds.label}>{t('visit.interview.mainSymptoms')}</Text>
                    <TextInput
                        style={ds.textArea}
                        placeholder={t('visit.interview.mainSymptoms')}
                        placeholderTextColor={tc.textMuted}
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                        value={mainSymptoms}
                        onChangeText={(text) => {
                            setMainSymptoms(text);
                            if (onUpdate) {
                                onUpdate({ interview: { mainSymptoms: text } });
                            }
                        }}
                    />
                </View>

                {/* Complete Scales */}
                {Object.keys(completedScales).length > 0 && (
                    <View style={ds.fieldContainer}>
                        <Text style={ds.sectionLabel}>{t('visit.history_labels.scales')}</Text>
                        <View style={ds.scalesCard}>
                            {Object.entries(completedScales).map(([scaleName, score]) => (
                                <View key={scaleName} style={ds.scaleRow}>
                                    <Text style={ds.scaleName}>{scaleName.toUpperCase()}:</Text>
                                    <Text style={ds.scaleScore}>{score}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Previous Visits */}
                <View style={ds.previousVisitsRow}>
                    <Text style={ds.sectionLabel}>{t('visit.interview.previousVisits')}</Text>
                    <TouchableOpacity 
                        style={ds.showVisitsButton}
                        onPress={() => setShowHistoryModal(true)}
                    >
                        <MaterialCommunityIcons name="history" size={18} color="#58A7B3" />
                        <Text style={ds.showVisitsText}>{t('visit.interview.showPreviousVisits')} ({totalVisits})</Text>
                    </TouchableOpacity>
                </View>

                {/* Additional Notes */}
                <View style={ds.fieldContainer}>
                    <Text style={ds.label}>{t('visit.interview.additionalNotes')}</Text>
                    <TextInput
                        style={ds.textArea}
                        placeholder={t('visit.interview.additionalNotes')}
                        placeholderTextColor={tc.textMuted}
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                        value={additionalNotes}
                        onChangeText={(text) => {
                            setAdditionalNotes(text);
                            if (onUpdate) {
                                onUpdate({ notes: text });
                            }
                        }}
                    />
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

                <PsychiatricScalesModal
                    visible={showScalesModal}
                    onClose={() => setShowScalesModal(false)}
                    onSelectScale={(scale) => {
                        setSelectedScale(scale);
                        setShowScalesModal(false);
                        setShowQuestionnaire(true);
                    }}
                />

                <ScaleQuestionnaireModal
                    visible={showQuestionnaire}
                    onClose={() => setShowQuestionnaire(false)}
                    scaleId={selectedScale}
                />

                <VisitHistoryModal
                    visible={showHistoryModal}
                    onClose={() => setShowHistoryModal(false)}
                    visits={visits}
                    total={totalVisits}
                    loading={loading}
                />
            </View>
        </View>
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
            padding: 16,
            borderWidth: 1,
            borderColor: tc.borderColor,
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
        },
        title: {
            fontSize: 18,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        psychiatricButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: hp(5),
            width: wp(45),
            borderRadius: 8,
        },
        psychiatricButtonText: {
            color: '#fff',
            fontSize: 14,
            fontWeight: '700',
            marginLeft: 8,
        },
        fieldContainer: {
            marginBottom: 20,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textPrimary,
            marginBottom: 8,
        },
        textArea: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            padding: 12,
            minHeight: hp(14),
            fontSize: 14,
            color: tc.textPrimary,
            backgroundColor: tc.cardBackgroundAlt,
        },
        previousVisitsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            paddingTop: 4,
        },
        sectionLabel: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.textPrimary,
            marginBottom: 12,
        },
        scalesCard: {
            backgroundColor: tc.searchBarBg,
            borderRadius: 8,
            padding: 16,
            marginTop: 4,
        },
        scaleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: tc.cardBackground,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 6,
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: tc.borderColor,
        },
        scaleName: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        scaleScore: {
            fontSize: 14,
            fontWeight: '700',
            color: '#58A7B3',
        },
        showVisitsButton: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: '#58A7B3',
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 8,
        },
        showVisitsText: {
            fontSize: 14,
            fontWeight: '700',
            color: '#58A7B3',
            marginLeft: 6,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 16,
            paddingTop: 10,
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

export default VisitInterview;
