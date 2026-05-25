import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { GenerateVisitNoteStreaming, GetPreviousVisits } from '../../../Services/Visit.Service';

interface SmartTranscriptionToolProps {
    visitData: any;
    visitId: string;
    onTranscriptionComplete?: (note: string) => void;
    onUpdate?: (fields: Record<string, any>) => void;
}

const SmartTranscriptionTool = ({ visitData, visitId, onTranscriptionComplete, onUpdate }: SmartTranscriptionToolProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createStyles(tc, isDark);

    const [isExpanded, setIsExpanded] = useState(false);
    const [noteType, setNoteType] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [visitType, setVisitType] = useState('');
    const [noteLength, setNoteLength] = useState('large');
    const [isGeneratingNote, setIsGeneratingNote] = useState(false);
    const [generatedNote, setGeneratedNote] = useState('');
    const [showNotePreview, setShowNotePreview] = useState(false);
    const [previousVisits, setPreviousVisits] = useState<any[]>([]);
    const [selectedPreviousVisits, setSelectedPreviousVisits] = useState<string[]>([]);
    const [hasPreviousVisits, setHasPreviousVisits] = useState(false);

    useEffect(() => {
        if (visitId) fetchPreviousVisits();
    }, [visitId]);

    useEffect(() => {
        if (visitData?.aiNotes) {
            const notes = Array.isArray(visitData.aiNotes) ? visitData.aiNotes : [visitData.aiNotes];
            const latest = notes[notes.length - 1];
            if (latest?.content?.trim()) {
                setGeneratedNote(latest.content);
                setShowNotePreview(true);
                if (latest.type) setNoteType(latest.type);
                if (latest.specialization) setSpecialization(latest.specialization);
                if (latest.visitType) setVisitType(latest.visitType);
            }
        }
    }, [visitData]);

    const fetchPreviousVisits = async () => {
        try {
            const response = await GetPreviousVisits(visitId, 5);
            const visits = response?.previousVisits || response?.data?.previousVisits || [];
            setPreviousVisits(visits);
            setHasPreviousVisits(visits.length > 0);
        } catch (err) {
            console.error('Error fetching previous visits:', err);
        }
    };

    const hasTranscriptionContent = visitData?.transcription?.text?.trim() || generatedNote?.trim();

    const handleGenerateNote = async () => {
        if (!noteType || !specialization || !visitType) {
            Alert.alert(t('common.error') || 'Error', t('visit.ai.transcription.selectAllRequired') || 'Please select all required options');
            return;
        }
        if (!hasTranscriptionContent) {
            Alert.alert(t('common.error') || 'Error', t('visit.ai.transcription.noContent') || 'No transcription content available');
            return;
        }

        setIsGeneratingNote(true);
        try {
            const previousForGeneration = visitType === 'follow-up' ? selectedPreviousVisits : [];
            const result = await GenerateVisitNoteStreaming({
                visitId,
                noteType,
                visitType,
                specialization,
                instructions: '',
                previousVisits: previousForGeneration,
                length: noteLength,
                customPromptId: null,
            });

            if (result?.note?.content) {
                setGeneratedNote(result.note.content);
                setShowNotePreview(true);
            }
        } catch (err: any) {
            Alert.alert(t('common.error') || 'Error', err?.message || 'Note generation failed');
        } finally {
            setIsGeneratingNote(false);
        }
    };

    const handleCopyToInterview = () => {
        if (!generatedNote?.trim() || !onUpdate) return;
        const currentSymptoms = visitData?.interview?.mainSymptoms || '';
        const updatedSymptoms = currentSymptoms
            ? `${currentSymptoms}\n\n${generatedNote}`
            : generatedNote;

        onUpdate({ interview: { ...visitData?.interview, mainSymptoms: updatedSymptoms } });
        Alert.alert(t('common.success') || 'Success', t('visit.ai.transcription.copiedToInterview') || 'Copied to interview');
    };

    const OptionButton = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
        <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
            {selected ? (
                <LinearGradient colors={['#58A7B3', '#8ED1CC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={ds.optionBtn}>
                    <Text style={ds.optionBtnTextActive}>{label}</Text>
                </LinearGradient>
            ) : (
                <View style={ds.optionBtnOutline}>
                    <Text style={ds.optionBtnText}>{label}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={ds.container}>
            {/* Smart Transcription */}
            <TouchableOpacity style={ds.header} onPress={() => setIsExpanded(!isExpanded)} activeOpacity={0.7}>
                <View style={ds.headerLeft}>
                    <View style={ds.iconBg}>
                        <MaterialCommunityIcons name="brain" size={24} color={tc.accent} />
                    </View>
                    <View>
                        <Text style={ds.headerTitle}>{t('visit.ai.transcription.smart')}</Text>
                        <Text style={ds.headerSubtitle}>{t('visit.ai.transcription.smartDesc')}</Text>
                    </View>
                </View>
                <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={tc.textPrimary} />
            </TouchableOpacity>

            {isExpanded && (
                <View style={ds.content}>
                    {/* Transcription Status */}
                    {visitData?.transcription?.isTranscribed ? (
                        <View style={ds.statusBadge}>
                            <View style={ds.statusDot} />
                            <Text style={ds.statusText}>{t('visit.ai.transcription.transcribed') || 'Transcribed'}</Text>
                        </View>
                    ) : (
                        <View style={ds.emptyTranscription}>
                            <Feather name="mic" size={32} color={tc.textMuted} />
                            <Text style={ds.emptyTitle}>{t('visit.ai.transcription.noTranscription') || 'No transcription yet'}</Text>
                            <Text style={ds.emptySubtitle}>{t('visit.ai.transcription.noTranscriptionDesc') || 'Record or upload audio to transcribe'}</Text>
                        </View>
                    )}

                    {/* Note Generation Controls */}
                    <View style={ds.section}>
                        <Text style={ds.sectionTitle}>{t('visit.ai.transcription.noteGeneration') || 'Note Generation'}</Text>

                        <Text style={ds.fieldLabel}>{t('visit.ai.transcription.noteType') || 'Note Type'} *</Text>
                        <View style={ds.optionsRow}>
                            <OptionButton label={t('visit.ai.transcription.soap') || 'SOAP'} selected={noteType === 'SOAP'} onPress={() => setNoteType('SOAP')} />
                            <OptionButton label={t('visit.ai.transcription.clinical') || 'Clinical'} selected={noteType === 'Clinical'} onPress={() => setNoteType('Clinical')} />
                        </View>

                        <Text style={ds.fieldLabel}>{t('visit.ai.transcription.specialization') || 'Specialization'} *</Text>
                        <View style={ds.optionsRow}>
                            <OptionButton label={t('visit.ai.transcription.psychiatry') || 'Psychiatry'} selected={specialization === 'psychiatry'} onPress={() => setSpecialization('psychiatry')} />
                            <OptionButton label={t('visit.ai.transcription.smartSelect') || 'Smart'} selected={specialization === 'smartSelect'} onPress={() => setSpecialization('smartSelect')} />
                        </View>
                        <View style={ds.optionsRow}>
                            <OptionButton label={t('visit.ai.transcription.childPsychiatry') || 'Child Psych'} selected={specialization === 'childPsychiatry'} onPress={() => setSpecialization('childPsychiatry')} />
                            <OptionButton label={t('visit.ai.transcription.surgery') || 'Surgery'} selected={specialization === 'surgery'} onPress={() => setSpecialization('surgery')} />
                        </View>

                        <Text style={ds.fieldLabel}>{t('visit.ai.transcription.visitType') || 'Visit Type'} *</Text>
                        <View style={ds.optionsRow}>
                            <OptionButton label={t('visit.ai.transcription.firstVisit') || 'First Visit'} selected={visitType === 'first-visit'} onPress={() => setVisitType('first-visit')} />
                            <TouchableOpacity
                                onPress={() => hasPreviousVisits && setVisitType('follow-up')}
                                style={[{ flex: 1 }, !hasPreviousVisits && { opacity: 0.5 }]}
                            >
                                {visitType === 'follow-up' ? (
                                    <LinearGradient colors={['#58A7B3', '#8ED1CC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={ds.optionBtn}>
                                        <Text style={ds.optionBtnTextActive}>{t('visit.ai.transcription.followUp') || 'Follow-up'}</Text>
                                    </LinearGradient>
                                ) : (
                                    <View style={ds.optionBtnOutline}>
                                        <Text style={ds.optionBtnText}>{t('visit.ai.transcription.followUp') || 'Follow-up'}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {visitType === 'follow-up' && previousVisits.length > 0 && (
                            <View style={ds.previousVisitsBox}>
                                <Text style={ds.previousVisitsTitle}>{t('visit.ai.transcription.selectPrevious') || 'Select previous visits'}</Text>
                                {previousVisits.map((visit: any) => (
                                    <TouchableOpacity
                                        key={visit._id}
                                        style={ds.prevVisitItem}
                                        onPress={() => {
                                            setSelectedPreviousVisits(prev =>
                                                prev.includes(visit._id) ? prev.filter(id => id !== visit._id) : [...prev, visit._id]
                                            );
                                        }}
                                    >
                                        <View style={[ds.checkbox, selectedPreviousVisits.includes(visit._id) && ds.checkboxActive]}>
                                            {selectedPreviousVisits.includes(visit._id) && <Feather name="check" size={10} color="#fff" />}
                                        </View>
                                        <Text style={ds.prevVisitText}>
                                            {new Date(visit.date).toLocaleDateString()} - {visit.visitType}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <Text style={ds.fieldLabel}>{t('visit.ai.transcription.noteLength') || 'Note Length'}</Text>
                        <View style={ds.optionsRow}>
                            <OptionButton label={t('visit.ai.transcription.small') || 'Small'} selected={noteLength === 'small'} onPress={() => setNoteLength('small')} />
                            <OptionButton label={t('visit.ai.transcription.medium') || 'Medium'} selected={noteLength === 'medium'} onPress={() => setNoteLength('medium')} />
                            <OptionButton label={t('visit.ai.transcription.large') || 'Large'} selected={noteLength === 'large'} onPress={() => setNoteLength('large')} />
                        </View>

                        {/* Generate Button */}
                        <TouchableOpacity
                            onPress={handleGenerateNote}
                            disabled={isGeneratingNote || !noteType || !specialization || !visitType}
                            style={{ marginTop: 16 }}
                        >
                            <LinearGradient
                                colors={(!noteType || !specialization || !visitType) ? ['#9CA3AF', '#9CA3AF'] : ['#58A7B3', '#8ED1CC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={ds.generateBtn}
                            >
                                {isGeneratingNote ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <MaterialCommunityIcons name="brain" size={18} color="#fff" />
                                )}
                                <Text style={ds.generateBtnText}>
                                    {isGeneratingNote
                                        ? (t('visit.ai.transcription.generating') || 'Generating...')
                                        : (t('visit.ai.transcription.generateNote') || 'Generate Note')}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Note Preview */}
                    {showNotePreview && generatedNote?.trim() && (
                        <View style={ds.notePreview}>
                            <View style={ds.notePreviewHeader}>
                                <Text style={ds.notePreviewTitle}>{t('visit.ai.transcription.notePreview') || 'Generated Note'}</Text>
                                <View style={ds.noteActions}>
                                    <TouchableOpacity style={ds.noteActionBtn} onPress={handleCopyToInterview}>
                                        <Feather name="file-text" size={14} color={tc.accent} />
                                        <Text style={ds.noteActionText}>{t('visit.ai.transcription.toInterview') || 'To Interview'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <ScrollView style={ds.noteContent} nestedScrollEnabled>
                                <Text style={ds.noteText}>{generatedNote}</Text>
                            </ScrollView>
                            <TouchableOpacity style={ds.regenerateBtn} onPress={handleGenerateNote}>
                                <Feather name="refresh-cw" size={14} color={tc.accent} />
                                <Text style={ds.regenerateBtnText}>{t('visit.ai.transcription.regenerate') || 'Regenerate'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const createStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: { marginBottom: 8 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: tc.cardBackground, borderRadius: 8, borderWidth: 1, borderColor: tc.borderColor },
    headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconBg: { width: 40, height: 40, borderRadius: 8, backgroundColor: tc.accentLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    headerTitle: { fontSize: 16, fontWeight: '700', color: tc.textPrimary },
    headerSubtitle: { fontSize: 12, color: tc.textMuted, marginTop: 2 ,flex:1,width:'90%',},
    content: { marginTop: 12, gap: 12 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : '#ECFDF5', borderRadius: 12 },
    statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
    statusText: { fontSize: 12, color: '#10B981', fontWeight: '500' },
    emptyTranscription: { alignItems: 'center', paddingVertical: 24, gap: 8 },
    emptyTitle: { fontSize: 14, fontWeight: '600', color: tc.textSecondary },
    emptySubtitle: { fontSize: 12, color: tc.textMuted },
    section: { backgroundColor: tc.cardBackground, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: tc.borderColor },
    sectionTitle: { fontSize: 15, fontWeight: '700', color: tc.textPrimary, marginBottom: 12 },
    fieldLabel: { fontSize: 12, fontWeight: '600', color: tc.textSecondary, marginBottom: 6, marginTop: 10 },
    optionsRow: { flexDirection: 'row', gap: 8 },
    optionBtn: {borderRadius: 8, alignItems: 'center', justifyContent: 'center',flex:1 },
    optionBtnOutline: { paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: tc.borderColor },
    optionBtnTextActive: { fontSize: 13, fontWeight: '600', color: '#fff' },
    optionBtnText: { fontSize: 13, fontWeight: '500', color: tc.textSecondary },
    previousVisitsBox: { backgroundColor: isDark ? 'rgba(88,167,179,0.1)' : '#F0F9FA', borderRadius: 8, padding: 10, marginTop: 8, borderWidth: 1, borderColor: isDark ? 'rgba(88,167,179,0.2)' : '#B2DFE5' },
    previousVisitsTitle: { fontSize: 12, fontWeight: '600', color: tc.accent, marginBottom: 8 },
    prevVisitItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
    checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: tc.borderColor, justifyContent: 'center', alignItems: 'center' },
    checkboxActive: { backgroundColor: tc.accent, borderColor: tc.accent },
    prevVisitText: { fontSize: 12, color: tc.textSecondary },
    generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',height: 48, borderRadius: 8, gap: 8 },
    generateBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
    notePreview: { backgroundColor: tc.cardBackground, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: tc.borderColor },
    notePreviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    notePreviewTitle: { fontSize: 15, fontWeight: '700', color: tc.textPrimary },
    noteActions: { flexDirection: 'row', gap: 8 },
    noteActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: tc.borderColor },
    noteActionText: { fontSize: 11, color: tc.accent, fontWeight: '600' },
    noteContent: { maxHeight: 300, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F9FAFB', borderRadius: 8, padding: 12, marginBottom: 10 },
    noteText: { fontSize: 13, color: tc.textSecondary, lineHeight: 20 },
    regenerateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: tc.borderColor },
    regenerateBtnText: { fontSize: 13, color: tc.accent, fontWeight: '600' },
});

export default SmartTranscriptionTool;
