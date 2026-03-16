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
import { GetPreviousVisits } from '../../Services/Visit.Service';
import { useEffect } from 'react';

interface VisitInterviewProps {
    onNext: () => void;
    onBack: () => void;
    visitId?: string;
    patientId?: string;
}

const VisitInterview = ({ onNext, onBack, visitId, patientId }: VisitInterviewProps) => {
    const [mainSymptoms, setMainSymptoms] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [showScalesModal, setShowScalesModal] = useState(false);
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);
    const [selectedScale, setSelectedScale] = useState('');
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [visits, setVisits] = useState<any[]>([]);
    const [totalVisits, setTotalVisits] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visitId) {
            fetchVisitHistory();
        }
    }, [visitId]);

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
        <View style={styles.container}>
            <View style={styles.card}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <Text style={styles.title}>Medical Interview</Text>
                    <TouchableOpacity onPress={() => setShowScalesModal(true)}>
                        <LinearGradient
                            colors={['#58A7B3', '#8ED1CC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.psychiatricButton}
                        >
                            <MaterialCommunityIcons name="brain" size={18} color="#fff" />
                            <Text style={styles.psychiatricButtonText}>Psychiatric Scales</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Main Symptoms */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Main Symptoms</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Main Symptoms"
                        placeholderTextColor="#94A3B8"
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                        value={mainSymptoms}
                        onChangeText={setMainSymptoms}
                    />
                </View>

                {/* Previous Visits */}
                <View style={styles.previousVisitsRow}>
                    <Text style={styles.sectionLabel}>Previous Visits</Text>
                    <TouchableOpacity 
                        style={styles.showVisitsButton}
                        onPress={() => setShowHistoryModal(true)}
                    >
                        <MaterialCommunityIcons name="history" size={18} color="#58A7B3" />
                        <Text style={styles.showVisitsText}>Show Previous Visits ({totalVisits})</Text>
                    </TouchableOpacity>
                </View>

                {/* Additional Notes */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Additional Notes</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Additional Notes"
                        placeholderTextColor="#94A3B8"
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                        value={additionalNotes}
                        onChangeText={setAdditionalNotes}
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.backButton} onPress={onBack}>
                        <Feather name="arrow-left" size={18} color="#58A7B3" />
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onNext}>
                        <LinearGradient
                            colors={['#58A7B3', '#8ED1CC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.nextButton}
                        >
                            <Text style={styles.nextButtonText}>Next</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
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
        color: '#1E293B',
    },
    psychiatricButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(5),
        width: wp(45),
        // paddingHorizontal: wp(4),
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
        color: '#1E293B',
        marginBottom: 8,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        minHeight: hp(14),
        fontSize: 14,
        color: '#1E293B',
        backgroundColor: '#fff',
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
        color: '#1E293B',
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
