import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

interface VisitConfirmationModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
    visitData?: any;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const VisitConfirmationModal = ({
    visible,
    onClose,
    onConfirm,
    loading = false,
    visitData,
}: VisitConfirmationModalProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);

    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                    stiffness: 200,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    damping: 18,
                    stiffness: 200,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const diagnosesCount = visitData?.diagnosis?.icd10?.length || 0;
    const patientName = visitData?.patient?.name || visitData?.patient?.firstName || '';

    const getDocumentCount = () => {
        let count = 0;
        if (visitData?.prescriptions?.length) count += visitData.prescriptions.length;
        else if (visitData?.isPrescription) count += 1;
        if (visitData?.referrals?.length) count += visitData.referrals.length;
        else if (visitData?.isReferral) count += 1;
        if (visitData?.sickLeave) count += 1;
        return count;
    };

    const docCount = getDocumentCount();
    const hasRecommendations = !!(visitData?.recommendations?.medications?.length ||
        visitData?.recommendations?.scales?.length ||
        visitData?.recommendations?.aiAssistance?.features);
    const hasNextVisit = !!visitData?.nextVisit;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View style={[ds.overlay, { opacity: fadeAnim }]}>
                <TouchableOpacity style={ds.overlayTouch} onPress={onClose} activeOpacity={1} />
                <Animated.View
                    style={[
                        ds.modalContainer,
                        {
                            transform: [
                                { translateY: slideAnim },
                                { scale: scaleAnim },
                            ],
                        },
                    ]}
                >
                    {/* Icon */}
                    <View style={ds.iconContainer}>
                        <LinearGradient
                            colors={['#58A7B3', '#8ED1CC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={ds.iconGradient}
                        >
                            <Feather name="check-circle" size={32} color="#fff" />
                        </LinearGradient>
                    </View>

                    {/* Title */}
                    <Text style={ds.title}>{t('visit.confirmation.title')}</Text>
                    <Text style={ds.subtitle}>{t('visit.confirmation.subtitle')}</Text>

                    {/* Summary Items */}
                    <View style={ds.summaryContainer}>
                        {patientName ? (
                            <View style={ds.summaryRow}>
                                <Feather name="user" size={16} color={tc.textMuted} />
                                <Text style={ds.summaryLabel}>{t('common.patient')}:</Text>
                                <Text style={ds.summaryValue}>{patientName}</Text>
                            </View>
                        ) : null}

                        <View style={ds.summaryRow}>
                            <Feather name="activity" size={16} color={tc.textMuted} />
                            <Text style={ds.summaryLabel}>{t('visit.confirmation.diagnoses')}:</Text>
                            <Text style={ds.summaryValue}>{diagnosesCount}</Text>
                        </View>

                        <View style={ds.summaryRow}>
                            <Feather name="file-text" size={16} color={tc.textMuted} />
                            <Text style={ds.summaryLabel}>{t('visit.confirmation.documents')}:</Text>
                            <Text style={ds.summaryValue}>
                                {docCount > 0 ? `${docCount} ${t('visit.confirmation.issued').toLowerCase()}` : t('visit.confirmation.none')}
                            </Text>
                        </View>

                        {/* Detailed document breakdown */}
                        {visitData?.prescriptions?.length > 0 && (
                            <View style={ds.detailRow}>
                                <MaterialCommunityIcons name="pill" size={14} color="#58A7B3" />
                                <Text style={ds.detailText}>
                                    {visitData.prescriptions.length} {visitData.prescriptions.length === 1 ? t('visit.summary.documentTypes.prescription') : t('visit.summary.documentTypes.prescription') + 's'}
                                </Text>
                            </View>
                        )}
                        {visitData?.referrals?.length > 0 && (
                            <View style={ds.detailRow}>
                                <Feather name="send" size={14} color="#58A7B3" />
                                <Text style={ds.detailText}>
                                    {visitData.referrals.length} {visitData.referrals.length === 1 ? t('visit.summary.documentTypes.referral') : t('visit.summary.documentTypes.referral') + 's'}
                                </Text>
                            </View>
                        )}
                        {visitData?.sickLeave && (
                            <View style={ds.detailRow}>
                                <Feather name="calendar" size={14} color="#58A7B3" />
                                <Text style={ds.detailText}>
                                    {t('visit.summary.documentTypes.sickLeave')}: {visitData.sickLeave.startDate} - {visitData.sickLeave.endDate}
                                </Text>
                            </View>
                        )}

                        {hasRecommendations && (
                            <View style={ds.summaryRow}>
                                <MaterialCommunityIcons name="brain" size={16} color={tc.textMuted} />
                                <Text style={ds.summaryLabel}>{t('visit.summary.sections.recommendations')}:</Text>
                                <Text style={ds.summaryValue}>{t('visit.confirmation.issued')}</Text>
                            </View>
                        )}

                        {hasNextVisit && (
                            <View style={ds.summaryRow}>
                                <Feather name="calendar" size={16} color={tc.textMuted} />
                                <Text style={ds.summaryLabel}>{t('visit.summary.sections.nextVisit')}:</Text>
                                <Text style={ds.summaryValue}>
                                    {visitData.nextVisit.date} {visitData.nextVisit.startTime}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Warning */}
                    <View style={ds.warningBox}>
                        <MaterialCommunityIcons name="information-outline" size={18} color={isDark ? '#FBBF24' : '#856404'} />
                        <Text style={ds.warningText}>{t('visit.confirmation.warning')}</Text>
                    </View>

                    {/* Actions */}
                    <View style={ds.actionsContainer}>
                        <TouchableOpacity style={ds.cancelButton} onPress={onClose} disabled={loading}>
                            <Text style={ds.cancelButtonText}>{t('common.cancel')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onConfirm} disabled={loading}>
                            <LinearGradient
                                colors={['#58A7B3', '#8ED1CC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={ds.confirmButton}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <>
                                        <Feather name="check" size={18} color="#fff" />
                                        <Text style={ds.confirmButtonText}>{t('visit.confirmation.confirm')}</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        overlayTouch: {
            ...StyleSheet.absoluteFillObject,
        },
        modalContainer: {
            width: wp(85),
            backgroundColor: tc.cardBackground,
            borderRadius: 20,
            padding: 28,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 20,
        },
        iconContainer: {
            marginBottom: 20,
        },
        iconGradient: {
            width: 64,
            height: 64,
            borderRadius: 32,
            justifyContent: 'center',
            alignItems: 'center',
        },
        title: {
            fontSize: 20,
            fontWeight: '800',
            color: tc.textPrimary,
            textAlign: 'center',
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 14,
            color: tc.textMuted,
            textAlign: 'center',
            marginBottom: 24,
            lineHeight: 20,
        },
        summaryContainer: {
            width: '100%',
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFB',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
        },
        summaryRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
        },
        summaryLabel: {
            fontSize: 14,
            color: tc.textMuted,
            marginLeft: 10,
            fontWeight: '600',
        },
        summaryValue: {
            fontSize: 14,
            color: tc.textPrimary,
            fontWeight: '700',
            marginLeft: 8,
        },
        detailRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 4,
            paddingLeft: 26,
        },
        detailText: {
            fontSize: 12,
            color: '#58A7B3',
            fontWeight: '600',
            marginLeft: 6,
        },
        warningBox: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(245,158,11,0.1)' : '#FFFBEB',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(245,158,11,0.2)' : '#FEF3C7',
            borderRadius: 10,
            padding: 12,
            marginBottom: 24,
            width: '100%',
        },
        warningText: {
            fontSize: 12,
            color: isDark ? '#FBBF24' : '#856404',
            marginLeft: 10,
            flex: 1,
            lineHeight: 18,
        },
        actionsContainer: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            gap: 12,
        },
        cancelButton: {
            flex: 1,
            height: 48,
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: tc.borderColor,
            justifyContent: 'center',
            alignItems: 'center',
        },
        cancelButtonText: {
            fontSize: 15,
            fontWeight: '700',
            color: tc.textSecondary,
        },
        confirmButton: {
            flex: 1,
            height: 48,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: wp(38),
            paddingHorizontal: 16,
        },
        confirmButtonText: {
            fontSize: 15,
            fontWeight: '700',
            color: '#fff',
            marginLeft: 8,
        },
    });

export default VisitConfirmationModal;
