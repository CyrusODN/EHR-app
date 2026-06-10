import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

const requestMicPermission = async () => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
};

export const useMobileAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => () => {
        if (timerRef.current) clearInterval(timerRef.current);
        audioRecorderPlayer.stopRecorder().catch(() => undefined);
    }, []);

    const startRecording = useCallback(async () => {
        const hasPermission = await requestMicPermission();
        if (!hasPermission) {
            setError('permission_denied');
            return false;
        }

        try {
            setError(null);
            setRecordingTime(0);
            await audioRecorderPlayer.startRecorder();
            setIsRecording(true);
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
            return true;
        } catch (err) {
            console.error('Failed to start recording:', err);
            setError('start_failed');
            return false;
        }
    }, []);

    const stopRecording = useCallback(async (): Promise<string | null> => {
        if (!isRecording) return null;

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        try {
            const filePath = await audioRecorderPlayer.stopRecorder();
            setIsRecording(false);
            return filePath || null;
        } catch (err) {
            console.error('Failed to stop recording:', err);
            setIsRecording(false);
            setError('stop_failed');
            return null;
        }
    }, [isRecording]);

    const toggleRecording = useCallback(async () => {
        if (isRecording) {
            return stopRecording();
        }
        const started = await startRecording();
        return started ? null : null;
    }, [isRecording, startRecording, stopRecording]);

    return {
        isRecording,
        recordingTime,
        error,
        startRecording,
        stopRecording,
        toggleRecording,
        setError,
    };
};
