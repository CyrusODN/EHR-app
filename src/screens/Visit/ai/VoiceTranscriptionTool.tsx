import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    ActivityIndicator,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { UploadAudioFile, TranscribeAudio } from '../../../Services/Visit.Service';

interface VoiceTranscriptionToolProps {
    visitId?: string;
    visitData?: any;
    onTranscriptionComplete?: (text: string) => void;
    onUpdate?: (data: any) => void;
}

const VoiceTranscriptionTool = ({ visitId, visitData, onTranscriptionComplete, onUpdate }: VoiceTranscriptionToolProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState<'uploading' | 'transcribing' | null>(null);
    const [transcription, setTranscription] = useState('');
    const [error, setError] = useState<string | null>(null);

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.3, duration: 800, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                ])
            ).start();

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            pulseAnim.stopAnimation();
            pulseAnim.setValue(1);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRecording]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const requestMicPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (e) {
                return false;
            }
        }
        return true;
    };

    const handleToggleRecording = async () => {
        if (isRecording) {
            setIsRecording(false);
            await processRecording();
        } else {
            const hasPermission = await requestMicPermission();
            if (!hasPermission) {
                setError(t('visit.voiceTranscription.permissionDenied'));
                return;
            }
            setError(null);
            setRecordingTime(0);
            setTranscription('');
            setIsRecording(true);
        }
    };

    const processRecording = async () => {
        if (!visitId) {
            setError(t('visit.voiceTranscription.noVisit'));
            return;
        }

        setIsProcessing(true);
        try {
            setProcessingStep('uploading');
            const uploadResult = await UploadAudioFile(new FormData());
            const audioUrl = uploadResult?.url || uploadResult?.data?.url;

            if (!audioUrl) {
                throw new Error('Upload failed');
            }

            setProcessingStep('transcribing');
            const transcriptionResult = await TranscribeAudio(visitId, audioUrl);

            if (transcriptionResult?.transcription?.text) {
                const text = transcriptionResult.transcription.text;
                setTranscription(text);
                if (onTranscriptionComplete) onTranscriptionComplete(text);
                if (onUpdate) {
                    onUpdate({ interview: { mainSymptoms: text } });
                }
            } else {
                throw new Error(transcriptionResult?.error || 'Transcription failed');
            }
        } catch (e: any) {
            setError(e.message || t('visit.voiceTranscription.error'));
        } finally {
            setIsProcessing(false);
            setProcessingStep(null);
        }
    };

    const handleApplyToInterview = () => {
        if (transcription && onUpdate) {
            const currentSymptoms = visitData?.interview?.mainSymptoms || '';
            const updated = currentSymptoms
                ? `${currentSymptoms}\n\n${transcription}`
                : transcription;
            onUpdate({ interview: { mainSymptoms: updated } });
        }
    };

    return (
        <View style={ds.container}>
            <View style={ds.header}>
                <MaterialCommunityIcons name="microphone-message" size={20} color={tc.accent} />
                <Text style={ds.title}>{t('visit.voiceTranscription.title')}</Text>
            </View>

            <Text style={ds.description}>{t('visit.voiceTranscription.description')}</Text>

            <View style={ds.recordingArea}>
                <Animated.View style={[ds.pulseCircle, { transform: [{ scale: isRecording ? pulseAnim : 1 }] }]}>
                    <TouchableOpacity
                        style={[ds.micButton, isRecording && ds.micButtonActive]}
                        onPress={handleToggleRecording}
                        disabled={isProcessing}
                        activeOpacity={0.8}
                    >
                        <Feather
                            name={isRecording ? 'mic-off' : 'mic'}
                            size={28}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </Animated.View>

                {isRecording && (
                    <View style={ds.timerContainer}>
                        <View style={ds.recordingDot} />
                        <Text style={ds.timerText}>{formatTime(recordingTime)}</Text>
                    </View>
                )}

                <Text style={ds.micHint}>
                    {isRecording
                        ? t('visit.voiceTranscription.tapToStop')
                        : t('visit.voiceTranscription.tapToStart')}
                </Text>
            </View>

            {isProcessing && (
                <View style={ds.processingContainer}>
                    <ActivityIndicator size="small" color={tc.accent} />
                    <Text style={ds.processingText}>
                        {processingStep === 'uploading'
                            ? t('visit.voiceTranscription.uploading')
                            : t('visit.voiceTranscription.transcribing')}
                    </Text>
                </View>
            )}

            {error && (
                <View style={ds.errorContainer}>
                    <Feather name="alert-circle" size={14} color="#DC2626" />
                    <Text style={ds.errorText}>{error}</Text>
                </View>
            )}

            {transcription && (
                <View style={ds.transcriptionContainer}>
                    <Text style={ds.transcriptionLabel}>{t('visit.voiceTranscription.result')}</Text>
                    <Text style={ds.transcriptionText}>{transcription}</Text>
                    <TouchableOpacity style={ds.applyButton} onPress={handleApplyToInterview}>
                        <Feather name="plus-circle" size={14} color="#fff" />
                        <Text style={ds.applyButtonText}>{t('visit.voiceTranscription.applyToInterview')}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default VoiceTranscriptionTool;

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: { padding: 16 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    title: { fontSize: 15, fontWeight: '700', color: tc.textPrimary },
    description: { fontSize: 13, color: tc.textMuted, marginBottom: 20, lineHeight: 18 },
    recordingArea: { alignItems: 'center', paddingVertical: 20 },
    pulseCircle: { marginBottom: 12 },
    micButton: {
        width: 64, height: 64, borderRadius: 32, backgroundColor: '#58A7B3',
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#58A7B3', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
    },
    micButtonActive: { backgroundColor: '#EF4444' },
    timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    recordingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
    timerText: { fontSize: 16, fontWeight: '700', color: tc.textPrimary },
    micHint: { fontSize: 12, color: tc.textMuted },
    processingContainer: {
        flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center',
        paddingVertical: 12, backgroundColor: isDark ? 'rgba(88,167,179,0.1)' : '#E8F7F9',
        borderRadius: 8, marginTop: 12,
    },
    processingText: { fontSize: 13, color: tc.accent, fontWeight: '500' },
    errorContainer: {
        flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12,
        padding: 10, backgroundColor: isDark ? 'rgba(220,38,38,0.1)' : '#FEF2F2',
        borderRadius: 8,
    },
    errorText: { fontSize: 12, color: '#DC2626' },
    transcriptionContainer: {
        marginTop: 16, padding: 14, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
        borderRadius: 10, borderWidth: 1, borderColor: tc.borderColor,
    },
    transcriptionLabel: { fontSize: 12, fontWeight: '600', color: tc.textMuted, marginBottom: 8 },
    transcriptionText: { fontSize: 14, color: tc.textPrimary, lineHeight: 20 },
    applyButton: {
        flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12,
        alignSelf: 'flex-start', backgroundColor: '#58A7B3', paddingHorizontal: 12,
        paddingVertical: 8, borderRadius: 6,
    },
    applyButtonText: { fontSize: 12, fontWeight: '600', color: '#fff' },
});
