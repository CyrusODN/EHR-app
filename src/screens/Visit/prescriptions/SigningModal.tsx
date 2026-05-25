import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    ActivityIndicator,
    Switch,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import type { Prescription } from '../../../types/visit';

interface SigningModalProps {
    visible: boolean;
    prescription: Prescription | null;
    onClose: () => void;
    onComplete: (prescription: Prescription) => void;
}

type SigningMethod = 'zus' | 'qualified' | 'trusted';
type SigningStep = 'method' | 'password' | 'verification' | 'processing' | 'complete';

const METHODS: SigningMethod[] = ['zus', 'qualified', 'trusted'];

const SigningModal = ({ visible, prescription, onClose, onComplete }: SigningModalProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createStyles(tc, isDark);

    const [selectedMethod, setSelectedMethod] = useState<SigningMethod>('zus');
    const [step, setStep] = useState<SigningStep>('method');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [rememberPassword, setRememberPassword] = useState(false);

    if (!visible || !prescription) return null;

    const resetAndClose = () => {
        setStep('method');
        setPassword('');
        setVerificationCode('');
        setRememberPassword(false);
        onClose();
    };

    const handleStartSigning = () => {
        if (selectedMethod === 'trusted') {
            setStep('verification');
        } else {
            setStep('password');
        }
    };

    const handlePasswordSubmit = () => {
        setStep('processing');
        setTimeout(() => setStep('complete'), 2000);
    };

    const handleVerify = () => {
        setStep('processing');
        setTimeout(() => setStep('complete'), 2000);
    };

    const handleComplete = () => {
        onComplete({
            ...prescription,
            status: 'signed',
            signedAt: new Date().toISOString(),
            signatureMethod: selectedMethod,
        });
        resetAndClose();
    };

    const renderMethodStep = () => (
        <View style={ds.stepContent}>
            {METHODS.map((method) => (
                <TouchableOpacity
                    key={method}
                    style={[ds.methodCard, selectedMethod === method && ds.methodCardActive]}
                    onPress={() => setSelectedMethod(method)}
                    activeOpacity={0.7}
                >
                    <View style={[ds.radio, selectedMethod === method && ds.radioActive]}>
                        {selectedMethod === method && <View style={ds.radioInner} />}
                    </View>
                    <View style={ds.methodInfo}>
                        <Text style={ds.methodTitle}>
                            {t(`signingModal.methods.${method}.title`)}
                        </Text>
                        <Text style={ds.methodDesc}>
                            {t(`signingModal.methods.${method}.description`)}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={handleStartSigning} activeOpacity={0.8}>
                <LinearGradient
                    colors={['#58A7B3', '#8ED1CC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={ds.fullWidthBtn}
                >
                    <Text style={ds.fullWidthBtnText}>{t('signingModal.buttons.startSigning')}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    const renderPasswordStep = () => (
        <View style={ds.stepContent}>
            <View style={ds.infoBox}>
                <Feather name="key" size={18} color="#3B82F6" style={{ marginRight: 10, marginTop: 2 }} />
                <Text style={ds.infoBoxText}>{t('signingModal.password.info')}</Text>
            </View>

            <View style={ds.field}>
                <Text style={ds.fieldLabel}>{t('signingModal.password.label')}</Text>
                <TextInput
                    style={ds.fieldInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder={t('signingModal.password.placeholder')}
                    placeholderTextColor={tc.textMuted}
                    secureTextEntry
                />
            </View>

            <View style={ds.switchRow}>
                <Switch
                    value={rememberPassword}
                    onValueChange={setRememberPassword}
                    trackColor={{ false: tc.borderColor, true: '#58A7B3' }}
                    thumbColor="#fff"
                />
                <Text style={ds.switchLabel}>{t('signingModal.password.remember')}</Text>
            </View>

            <TouchableOpacity
                onPress={handlePasswordSubmit}
                disabled={!password}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={password ? ['#58A7B3', '#8ED1CC'] : ['#9CA3AF', '#9CA3AF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={ds.fullWidthBtn}
                >
                    <Text style={ds.fullWidthBtnText}>{t('signingModal.buttons.signPrescription')}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    const renderVerificationStep = () => (
        <View style={ds.stepContent}>
            <View style={ds.infoBox}>
                <Feather name="alert-circle" size={18} color="#3B82F6" style={{ marginRight: 10, marginTop: 2 }} />
                <Text style={ds.infoBoxText}>{t('signingModal.verification.info')}</Text>
            </View>

            <View style={ds.field}>
                <Text style={ds.fieldLabel}>{t('signingModal.verification.label')}</Text>
                <TextInput
                    style={ds.fieldInput}
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    placeholder={t('signingModal.verification.placeholder')}
                    placeholderTextColor={tc.textMuted}
                    keyboardType="number-pad"
                />
            </View>

            <TouchableOpacity
                onPress={handleVerify}
                disabled={!verificationCode}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={verificationCode ? ['#58A7B3', '#8ED1CC'] : ['#9CA3AF', '#9CA3AF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={ds.fullWidthBtn}
                >
                    <Text style={ds.fullWidthBtnText}>{t('signingModal.buttons.verifyAndSign')}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    const renderProcessingStep = () => (
        <View style={ds.centerContent}>
            <ActivityIndicator size="large" color="#58A7B3" />
            <Text style={ds.centerTitle}>{t('signingModal.processing.title')}</Text>
            <Text style={ds.centerSubtitle}>{t('signingModal.processing.subtitle')}</Text>
        </View>
    );

    const renderCompleteStep = () => (
        <View style={ds.centerContent}>
            <View style={ds.successCircle}>
                <Feather name="check-circle" size={48} color="#22C55E" />
            </View>
            <Text style={ds.centerTitle}>{t('signingModal.complete.title')}</Text>
            <Text style={ds.centerSubtitle}>{t('signingModal.complete.description')}</Text>

            <TouchableOpacity onPress={handleComplete} activeOpacity={0.8} style={{ marginTop: 20 }}>
                <LinearGradient
                    colors={['#58A7B3', '#8ED1CC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={ds.fullWidthBtn}
                >
                    <Text style={ds.fullWidthBtnText}>{t('signingModal.buttons.complete')}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    const renderStep = () => {
        switch (step) {
            case 'method': return renderMethodStep();
            case 'password': return renderPasswordStep();
            case 'verification': return renderVerificationStep();
            case 'processing': return renderProcessingStep();
            case 'complete': return renderCompleteStep();
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={resetAndClose}>
            <View style={ds.overlay}>
                <View style={ds.modalContainer}>
                    {/* Modal Header */}
                    <View style={ds.modalHeader}>
                        <View style={ds.modalHeaderLeft}>
                            <View style={ds.lockIconBg}>
                                <Feather name="lock" size={20} color="#58A7B3" />
                            </View>
                            <Text style={ds.modalTitle}>{t('signingModal.title')}</Text>
                        </View>
                        {step !== 'processing' && (
                            <TouchableOpacity onPress={resetAndClose}>
                                <Feather name="x" size={22} color={tc.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {renderStep()}
                </View>
            </View>
        </Modal>
    );
};

const createStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        modalContainer: {
            width: '100%',
            maxWidth: 420,
            backgroundColor: tc.cardBackground,
            borderRadius: 12,
            padding: 20,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        modalHeaderLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        lockIconBg: {
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: isDark ? 'rgba(88,167,179,0.15)' : '#E2F2F4',
            alignItems: 'center',
            justifyContent: 'center',
        },
        modalTitle: {
            fontSize: 17,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        stepContent: {
            gap: 14,
        },
        methodCard: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            padding: 14,
            gap: 12,
        },
        methodCardActive: {
            borderColor: '#58A7B3',
            backgroundColor: isDark ? 'rgba(88,167,179,0.08)' : '#F0FAFB',
        },
        radio: {
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: tc.borderColor,
            alignItems: 'center',
            justifyContent: 'center',
        },
        radioActive: {
            borderColor: '#58A7B3',
        },
        radioInner: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: '#58A7B3',
        },
        methodInfo: {
            flex: 1,
        },
        methodTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textPrimary,
            marginBottom: 2,
        },
        methodDesc: {
            fontSize: 12,
            color: tc.textSecondary,
        },
        fullWidthBtn: {
            borderRadius: 8,
            paddingVertical: 14,
            alignItems: 'center',
        },
        fullWidthBtnText: {
            color: '#fff',
            fontSize: 15,
            fontWeight: '700',
        },
        infoBox: {
            backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : '#EFF6FF',
            borderRadius: 8,
            padding: 14,
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        infoBoxText: {
            flex: 1,
            fontSize: 13,
            color: isDark ? '#93C5FD' : '#1D4ED8',
            lineHeight: 19,
        },
        field: {
            marginBottom: 4,
        },
        fieldLabel: {
            fontSize: 13,
            fontWeight: '600',
            color: tc.textSecondary,
            marginBottom: 8,
        },
        fieldInput: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 14,
            paddingVertical: 10,
            fontSize: 14,
            color: tc.textPrimary,
            backgroundColor: tc.cardBackgroundAlt,
        },
        switchRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: 4,
        },
        switchLabel: {
            fontSize: 13,
            color: tc.textPrimary,
            flex: 1,
        },
        centerContent: {
            alignItems: 'center',
            paddingVertical: 30,
            gap: 12,
        },
        successCircle: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: isDark ? 'rgba(34,197,94,0.1)' : '#F0FDF4',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
        },
        centerTitle: {
            fontSize: 17,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        centerSubtitle: {
            fontSize: 13,
            color: tc.textSecondary,
            textAlign: 'center',
            lineHeight: 19,
            paddingHorizontal: 10,
        },
    });

export default SigningModal;
