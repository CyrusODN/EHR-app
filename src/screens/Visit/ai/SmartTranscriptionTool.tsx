import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert,
    Platform, Modal, Share,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import DocumentPicker from 'react-native-document-picker';
import QRCode from 'react-native-qrcode-svg';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { GenerateVisitNoteStreaming, GetPreviousVisits, TranscribeAudio } from '../../../Services/Visit.Service';
import { uploadFileOnServer } from '../../../Services/Upload.Service';
import { environmentUrls } from '../../../constants/env';
import { useMobileAudioRecorder } from '../../../hooks/useMobileAudioRecorder';
import { getChatbotServiceToken } from '../../../Services/AiAssitants.Service';
import ConsultChat from '../../AIAssistant/AI_Tools/consultChat';
import PharmacopediaChat from '../../AIAssistant/AI_Tools/pharmacopediaChat';

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
    const [showConsult, setShowConsult] = useState(false);
    const [showPharmacopedia, setShowPharmacopedia] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [serviceToken, setServiceToken] = useState<string | null>(null);

    const [noteType, setNoteType] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [visitType, setVisitType] = useState('');
    const [noteLength, setNoteLength] = useState('large');
    const [isGeneratingNote, setIsGeneratingNote] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcriptionText, setTranscriptionText] = useState('');
    const [generatedNote, setGeneratedNote] = useState('');
    const [showNotePreview, setShowNotePreview] = useState(false);
    const [previousVisits, setPreviousVisits] = useState<any[]>([]);
    const [selectedPreviousVisits, setSelectedPreviousVisits] = useState<string[]>([]);
    const [hasPreviousVisits, setHasPreviousVisits] = useState(false);

    const {
        isRecording,
        recordingTime,
        startRecording,
        stopRecording,
        setError: setRecordingError,
    } = useMobileAudioRecorder();

    useEffect(() => {
        if (visitId) fetchPreviousVisits();
    }, [visitId]);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response: any = await getChatbotServiceToken();
                if (response?.serviceToken) setServiceToken(response.serviceToken);
            } catch (err) {
                console.error('SmartTranscription: failed to fetch service token', err);
            }
        };
        fetchToken();
    }, []);

    useEffect(() => {
        if (visitData?.transcription?.text?.trim()) {
            setTranscriptionText(visitData.transcription.text);
        }
    }, [visitData?.transcription?.text]);

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

    const connectUrl = `${(environmentUrls.front_end || environmentUrls.file_url || '').replace(/\/$/, '')}/connect/${visitId}`;

    const formatRecordingTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const applyTranscription = (text: string, utterances?: any[]) => {
        setTranscriptionText(text);
        if (onUpdate) {
            onUpdate({
                transcription: {
                    text,
                    isTranscribed: true,
                    utterances: utterances || [],
                },
            });
        }
        if (onTranscriptionComplete) onTranscriptionComplete(text);
    };

    const processAudioFile = async (file: { uri: string; name?: string; type?: string }) => {
        if (!visitId) {
            Alert.alert(t('common.error') || 'Error', t('visit.voiceTranscription.noVisit'));
            return;
        }

        setIsTranscribing(true);
        try {
            const uploadResult: any = await uploadFileOnServer({
                uri: file.uri,
                name: file.name || 'recording.m4a',
                type: file.type || 'audio/m4a',
            });
            const audioUrl = uploadResult?.data?.url || uploadResult?.url || uploadResult?.data;

            if (!audioUrl) throw new Error('Upload failed');

            const transcriptionResult: any = await TranscribeAudio(visitId, audioUrl);
            const transcription = transcriptionResult?.transcription;

            if (!transcription?.text) {
                throw new Error(transcriptionResult?.error || t('visit.ai.transcription.transcriptionFailed'));
            }

            applyTranscription(transcription.text, transcription.utterances);
            Alert.alert(t('common.success') || 'Success', t('visit.ai.transcription.transcriptionSuccess'));
        } catch (err: any) {
            Alert.alert(t('common.error') || 'Error', err?.message || t('visit.ai.transcription.audioProcessingFailed'));
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleToggleRecording = async () => {
        if (isRecording) {
            setIsTranscribing(true);
            const filePath = await stopRecording();
            if (!filePath) {
                setIsTranscribing(false);
                return;
            }
            const uri = Platform.OS === 'android' && !filePath.startsWith('file://')
                ? `file://${filePath}`
                : filePath;
            await processAudioFile({ uri, name: 'recording.m4a', type: 'audio/m4a' });
            return;
        }

        setRecordingError(null);
        const started = await startRecording();
        if (!started) {
            Alert.alert(
                t('common.error') || 'Error',
                t('visit.voiceTranscription.permissionDenied') || t('visit.ai.transcription.recordingFailed'),
            );
        }
    };

    const handleAudioUpload = async () => {
        try {
            const result = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.audio, 'audio/*'],
                copyTo: 'cachesDirectory',
            });
            const uri = result.fileCopyUri || result.uri;
            await processAudioFile({
                uri,
                name: result.name || 'audio.m4a',
                type: result.type || 'audio/m4a',
            });
        } catch (err: any) {
            if (!DocumentPicker.isCancel(err)) {
                Alert.alert(t('common.error') || 'Error', err?.message || t('visit.ai.transcription.audioProcessingFailed'));
            }
        }
    };

    const handleShareConnectLink = async () => {
        try {
            await Share.share({
                message: connectUrl,
                title: t('visit.ai.transcription.mobileRecordingTitle'),
            });
        } catch (err) {
            console.error('Share connect link failed:', err);
        }
    };

    const hasTranscriptionContent = transcriptionText?.trim() || visitData?.transcription?.text?.trim() || generatedNote?.trim();

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

    const ToolSection = ({
        title,
        subtitle,
        icon,
        expanded,
        onToggle,
        children,
    }: {
        title: string;
        subtitle: string;
        icon: string;
        expanded: boolean;
        onToggle: () => void;
        children?: React.ReactNode;
    }) => (
        <View style={ds.toolSection}>
            <TouchableOpacity style={ds.header} onPress={onToggle} activeOpacity={0.7}>
                <View style={ds.headerLeft}>
                    <View style={ds.iconBg}>
                        <MaterialCommunityIcons name={icon} size={24} color={tc.accent} />
                    </View>
                    <View style={ds.headerTextWrap}>
                        <Text style={ds.headerTitle}>{title}</Text>
                        <Text style={ds.headerSubtitle}>{subtitle}</Text>
                    </View>
                </View>
                <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={24} color={tc.textPrimary} />
            </TouchableOpacity>
            {expanded && children}
        </View>
    );

    return (
        <View style={ds.container}>
            <ToolSection
                title={t('visit.ai.transcription.smart')}
                subtitle={t('visit.ai.transcription.smartDesc')}
                icon="brain"
                expanded={isExpanded}
                onToggle={() => setIsExpanded(!isExpanded)}
            >
                <View style={ds.content}>
                    <View style={ds.controlsRow}>
                        <TouchableOpacity
                            style={[ds.controlButton, isRecording && ds.controlButtonActive]}
                            onPress={handleToggleRecording}
                            disabled={isTranscribing}
                        >
                            {isTranscribing ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Feather name={isRecording ? 'mic-off' : 'mic'} size={22} color="#fff" />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={ds.controlButtonOutline}
                            onPress={handleAudioUpload}
                            disabled={isTranscribing || isRecording}
                        >
                            <MaterialCommunityIcons name="waveform" size={22} color={tc.accent} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={ds.controlButtonOutline}
                            onPress={() => setShowQrModal(true)}
                            disabled={isTranscribing || isRecording}
                        >
                            <MaterialCommunityIcons name="qrcode-scan" size={22} color={tc.accent} />
                        </TouchableOpacity>

                        {isRecording && (
                            <View style={ds.recordingTimer}>
                                <View style={ds.recordingDot} />
                                <Text style={ds.recordingTimerText}>{formatRecordingTime(recordingTime)}</Text>
                            </View>
                        )}
                    </View>

                    <Text style={ds.controlsHint}>
                        {t('visit.ai.transcription.controlsHint')}
                    </Text>

                    {isTranscribing && (
                        <View style={ds.processingBox}>
                            <ActivityIndicator size="small" color={tc.accent} />
                            <Text style={ds.processingText}>{t('visit.ai.transcription.processing')}</Text>
                        </View>
                    )}

                    {visitData?.transcription?.isTranscribed || transcriptionText ? (
                        <View style={ds.transcriptionBox}>
                            <View style={ds.statusBadge}>
                                <View style={ds.statusDot} />
                                <Text style={ds.statusText}>{t('visit.ai.transcription.transcribed')}</Text>
                            </View>
                            <ScrollView style={ds.transcriptionScroll} nestedScrollEnabled>
                                <Text style={ds.transcriptionText}>
                                    {transcriptionText || visitData?.transcription?.text}
                                </Text>
                            </ScrollView>
                        </View>
                    ) : (
                        <View style={ds.emptyTranscription}>
                            <Feather name="mic" size={32} color={tc.textMuted} />
                            <Text style={ds.emptyTitle}>{t('visit.ai.transcription.noTranscription')}</Text>
                            <Text style={ds.emptySubtitle}>{t('visit.ai.transcription.noTranscriptionDesc')}</Text>
                        </View>
                    )}

                    <View style={ds.section}>
                        <Text style={ds.sectionTitle}>{t('visit.ai.transcription.noteGeneration')}</Text>

                        <Text style={ds.fieldLabel}>{t('visit.ai.transcription.noteType')} *</Text>
                        <View style={ds.optionsRow}>
                            <OptionButton label={t('visit.ai.transcription.soap')} selected={noteType === 'SOAP'} onPress={() => setNoteType('SOAP')} />
                            <OptionButton label={t('visit.ai.transcription.clinical')} selected={noteType === 'Clinical'} onPress={() => setNoteType('Clinical')} />
                        </View>

                        <Text style={ds.fieldLabel}>{t('visit.ai.transcription.specialization')} *</Text>
                        <View style={ds.optionsRow}>
                            <OptionButton label={t('visit.ai.transcription.psychiatry')} selected={specialization === 'psychiatry'} onPress={() => setSpecialization('psychiatry')} />
                            <OptionButton label={t('visit.ai.transcription.smartSelect')} selected={specialization === 'smartSelect'} onPress={() => setSpecialization('smartSelect')} />
                        </View>
                        <View style={ds.optionsRow}>
                            <OptionButton label={t('visit.ai.transcription.childPsychiatry')} selected={specialization === 'childPsychiatry'} onPress={() => setSpecialization('childPsychiatry')} />
                            <OptionButton label={t('visit.ai.transcription.surgery')} selected={specialization === 'surgery'} onPress={() => setSpecialization('surgery')} />
                        </View>

                        <Text style={ds.fieldLabel}>{t('visit.ai.transcription.visitType')} *</Text>
                        <View style={ds.optionsRow}>
                            <OptionButton label={t('visit.ai.transcription.firstVisit')} selected={visitType === 'first-visit'} onPress={() => setVisitType('first-visit')} />
                            <TouchableOpacity
                                onPress={() => hasPreviousVisits && setVisitType('follow-up')}
                                style={[{ flex: 1 }, !hasPreviousVisits && { opacity: 0.5 }]}
                            >
                                {visitType === 'follow-up' ? (
                                    <LinearGradient colors={['#58A7B3', '#8ED1CC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={ds.optionBtn}>
                                        <Text style={ds.optionBtnTextActive}>{t('visit.ai.transcription.followUp')}</Text>
                                    </LinearGradient>
                                ) : (
                                    <View style={ds.optionBtnOutline}>
                                        <Text style={ds.optionBtnText}>{t('visit.ai.transcription.followUp')}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {visitType === 'follow-up' && previousVisits.length > 0 && (
                            <View style={ds.previousVisitsBox}>
                                <Text style={ds.previousVisitsTitle}>{t('visit.ai.transcription.selectPrevious')}</Text>
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

                        <Text style={ds.fieldLabel}>{t('visit.ai.transcription.noteLength')}</Text>
                        <View style={ds.optionsRow}>
                            <OptionButton label={t('visit.ai.transcription.small')} selected={noteLength === 'small'} onPress={() => setNoteLength('small')} />
                            <OptionButton label={t('visit.ai.transcription.medium')} selected={noteLength === 'medium'} onPress={() => setNoteLength('medium')} />
                            <OptionButton label={t('visit.ai.transcription.large')} selected={noteLength === 'large'} onPress={() => setNoteLength('large')} />
                        </View>

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
                                        ? t('visit.ai.transcription.generating')
                                        : t('visit.ai.transcription.generateNote')}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {showNotePreview && generatedNote?.trim() && (
                        <View style={ds.notePreview}>
                            <View style={ds.notePreviewHeader}>
                                <Text style={ds.notePreviewTitle}>{t('visit.ai.transcription.notePreview')}</Text>
                                <View style={ds.noteActions}>
                                    <TouchableOpacity style={ds.noteActionBtn} onPress={handleCopyToInterview}>
                                        <Feather name="file-text" size={14} color={tc.accent} />
                                        <Text style={ds.noteActionText}>{t('visit.ai.transcription.toInterview')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <ScrollView style={ds.noteContent} nestedScrollEnabled>
                                <Text style={ds.noteText}>{generatedNote}</Text>
                            </ScrollView>
                            <TouchableOpacity style={ds.regenerateBtn} onPress={handleGenerateNote}>
                                <Feather name="refresh-cw" size={14} color={tc.accent} />
                                <Text style={ds.regenerateBtnText}>{t('visit.ai.transcription.regenerate')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ToolSection>

            <ToolSection
                title={t('visit.ai.transcription.consult')}
                subtitle={t('visit.ai.transcription.consultDesc')}
                icon="stethoscope"
                expanded={showConsult}
                onToggle={() => setShowConsult(!showConsult)}
            >
                <View style={ds.embeddedTool}>
                    <ConsultChat serviceToken={serviceToken} />
                </View>
            </ToolSection>

            <ToolSection
                title={t('visit.ai.transcription.pharmacopedia')}
                subtitle={t('visit.ai.transcription.pharmacopediaDesc')}
                icon="pill"
                expanded={showPharmacopedia}
                onToggle={() => setShowPharmacopedia(!showPharmacopedia)}
            >
                <View style={ds.embeddedTool}>
                    <PharmacopediaChat serviceToken={serviceToken} />
                </View>
            </ToolSection>

            <Modal visible={showQrModal} transparent animationType="fade" onRequestClose={() => setShowQrModal(false)}>
                <View style={ds.qrOverlay}>
                    <View style={ds.qrModal}>
                        <View style={ds.qrHeader}>
                            <Text style={ds.qrTitle}>{t('visit.ai.transcription.mobileRecordingTitle')}</Text>
                            <TouchableOpacity onPress={() => setShowQrModal(false)}>
                                <Feather name="x" size={20} color={tc.textMuted} />
                            </TouchableOpacity>
                        </View>
                        <View style={ds.qrCodeWrap}>
                            <QRCode value={connectUrl} size={160} />
                        </View>
                        <Text style={ds.qrInstructions}>{t('visit.ai.transcription.mobileRecordingInstructions')}</Text>
                        <Text style={ds.qrValidity}>{t('visit.ai.transcription.mobileRecordingValidity')}</Text>
                        <TouchableOpacity style={ds.shareLinkBtn} onPress={handleShareConnectLink}>
                            <Feather name="share-2" size={16} color={tc.accent} />
                            <Text style={ds.shareLinkText}>{t('visit.ai.transcription.shareConnectLink')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SmartTranscriptionTool;

const createStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: { marginBottom: 8, gap: 8 },
    toolSection: { marginBottom: 4 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: tc.cardBackground, borderRadius: 8, borderWidth: 1, borderColor: tc.borderColor },
    headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    headerTextWrap: { flex: 1, marginRight: 8 },
    iconBg: { width: 40, height: 40, borderRadius: 8, backgroundColor: tc.accentLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    headerTitle: { fontSize: 16, fontWeight: '700', color: tc.textPrimary },
    headerSubtitle: { fontSize: 12, color: tc.textMuted, marginTop: 2 },
    content: { marginTop: 12, gap: 12 },
    controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' },
    controlButton: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#58A7B3', justifyContent: 'center', alignItems: 'center', elevation: 4 },
    controlButtonActive: { backgroundColor: '#EF4444' },
    controlButtonOutline: { width: 52, height: 52, borderRadius: 26, backgroundColor: tc.cardBackground, borderWidth: 1, borderColor: tc.borderColor, justifyContent: 'center', alignItems: 'center' },
    controlsHint: { fontSize: 12, color: tc.textMuted, textAlign: 'center' },
    recordingTimer: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEF2F2', borderRadius: 8 },
    recordingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
    recordingTimerText: { fontSize: 14, fontWeight: '600', color: tc.textPrimary },
    processingBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, backgroundColor: isDark ? 'rgba(88,167,179,0.1)' : '#E8F7F9', borderRadius: 8 },
    processingText: { fontSize: 13, color: tc.accent, fontWeight: '500' },
    transcriptionBox: { backgroundColor: tc.cardBackground, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: tc.borderColor, gap: 10 },
    transcriptionScroll: { maxHeight: 160 },
    transcriptionText: { fontSize: 13, color: tc.textSecondary, lineHeight: 20 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : '#ECFDF5', borderRadius: 12 },
    statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
    statusText: { fontSize: 12, color: '#10B981', fontWeight: '500' },
    emptyTranscription: { alignItems: 'center', paddingVertical: 24, gap: 8 },
    emptyTitle: { fontSize: 14, fontWeight: '600', color: tc.textSecondary },
    emptySubtitle: { fontSize: 12, color: tc.textMuted, textAlign: 'center', paddingHorizontal: 16 },
    section: { backgroundColor: tc.cardBackground, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: tc.borderColor },
    sectionTitle: { fontSize: 15, fontWeight: '700', color: tc.textPrimary, marginBottom: 12 },
    fieldLabel: { fontSize: 12, fontWeight: '600', color: tc.textSecondary, marginBottom: 6, marginTop: 10 },
    optionsRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
    optionBtn: { borderRadius: 8, alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: 10 },
    optionBtnOutline: { paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: tc.borderColor },
    optionBtnTextActive: { fontSize: 13, fontWeight: '600', color: '#fff' },
    optionBtnText: { fontSize: 13, fontWeight: '500', color: tc.textSecondary },
    previousVisitsBox: { backgroundColor: isDark ? 'rgba(88,167,179,0.1)' : '#F0F9FA', borderRadius: 8, padding: 10, marginTop: 8, borderWidth: 1, borderColor: isDark ? 'rgba(88,167,179,0.2)' : '#B2DFE5' },
    previousVisitsTitle: { fontSize: 12, fontWeight: '600', color: tc.accent, marginBottom: 8 },
    prevVisitItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
    checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: tc.borderColor, justifyContent: 'center', alignItems: 'center' },
    checkboxActive: { backgroundColor: tc.accent, borderColor: tc.accent },
    prevVisitText: { fontSize: 12, color: tc.textSecondary },
    generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, borderRadius: 8, gap: 8 },
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
    embeddedTool: { height: hp(55), marginTop: 8, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: tc.borderColor },
    qrOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    qrModal: { width: wp(85), backgroundColor: tc.cardBackground, borderRadius: 14, padding: 20 },
    qrHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    qrTitle: { fontSize: 16, fontWeight: '700', color: tc.textPrimary, flex: 1, marginRight: 12 },
    qrCodeWrap: { alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 12, marginBottom: 12 },
    qrInstructions: { fontSize: 13, color: tc.textSecondary, textAlign: 'center', lineHeight: 18 },
    qrValidity: { fontSize: 12, color: tc.textMuted, textAlign: 'center', marginTop: 8 },
    shareLinkBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: tc.borderColor },
    shareLinkText: { fontSize: 14, color: tc.accent, fontWeight: '600' },
});
