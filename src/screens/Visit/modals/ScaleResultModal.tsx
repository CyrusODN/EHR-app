import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { getSeverityColor } from '../../../utils/psychiatricScaleScoring';
import type { ScaleResult } from '../../../types/visit';

interface ScaleResultModalProps {
    visible: boolean;
    result: ScaleResult | null;
    onClose: () => void;
    onAddToInterview: () => void;
}

const ScaleResultModal = ({ visible, result, onClose, onAddToInterview }: ScaleResultModalProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const insets = useSafeAreaInsets();

    if (!result) return null;

    const severityColor = getSeverityColor(result.type, result.score);
    const scaleI18nKey = result.type.replace('-', '').toLowerCase() + 'Scale';

    const getAiAnalysis = () => {
        const baseKey = `scaleSummary.aiAnalysis.${result.type.replace('-', '').toLowerCase()}`;
        return {
            mainPoints: [
                t(`${baseKey}.${result.severityKey}.mainPoints.0`, { defaultValue: '' }),
                t(`${baseKey}.${result.severityKey}.mainPoints.1`, { defaultValue: '' }),
                t(`${baseKey}.${result.severityKey}.mainPoints.2`, { defaultValue: '' }),
            ].filter(Boolean),
            recommendations: [
                t(`${baseKey}.${result.severityKey}.recommendations.0`, { defaultValue: '' }),
                t(`${baseKey}.${result.severityKey}.recommendations.1`, { defaultValue: '' }),
                t(`${baseKey}.${result.severityKey}.recommendations.2`, { defaultValue: '' }),
            ].filter(Boolean),
            riskFactors: [
                t(`${baseKey}.${result.severityKey}.riskFactors.0`, { defaultValue: '' }),
                t(`${baseKey}.${result.severityKey}.riskFactors.1`, { defaultValue: '' }),
            ].filter(Boolean),
        };
    };

    const aiAnalysis = getAiAnalysis();
    const hasAiAnalysis = aiAnalysis.mainPoints.length > 0
        || aiAnalysis.recommendations.length > 0
        || aiAnalysis.riskFactors.length > 0;

    const handleAdd = () => {
        onAddToInterview();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={[ds.safeArea, { paddingTop: insets.top }]}>
                <StatusBar
                    barStyle={isDark ? 'light-content' : 'dark-content'}
                    backgroundColor={tc.background}
                />
                <View style={ds.container}>
                    {/* Header */}
                    <View style={ds.modalHeader}>
                        <TouchableOpacity onPress={onClose} style={ds.headerCloseButton}>
                            <Ionicons name="chevron-back" size={28} color={tc.textPrimary} />
                        </TouchableOpacity>
                        <View style={ds.headerCenter}>
                            <MaterialCommunityIcons name="brain" size={22} color={tc.accent} />
                            <Text style={ds.headerTitle}>
                                {t('scaleSummary.header.title')} {result.type}
                            </Text>
                        </View>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView
                        style={ds.scrollContent}
                        contentContainerStyle={ds.scrollContentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Score Card */}
                        <View style={ds.scoreCard}>
                            <Text style={ds.scoreLabel}>{t('scaleSummary.header.score')}</Text>
                            <Text style={[ds.scoreValue, { color: severityColor }]}>
                                {result.score} {t('scaleSummary.points')}
                            </Text>
                            <View style={[ds.severityBadge, { backgroundColor: severityColor + '20' }]}>
                                <Text style={[ds.severityText, { color: severityColor }]}>
                                    {result.interpretation}
                                </Text>
                            </View>
                        </View>

                        {/* Details */}
                        <View style={ds.detailsCard}>
                            <Text style={ds.sectionTitle}>
                                {t(`${scaleI18nKey}.interpretation.${result.severityKey}.title`)}
                            </Text>
                            <Text style={ds.detailsText}>
                                {t(`${scaleI18nKey}.interpretation.${result.severityKey}.details`)}
                            </Text>
                        </View>

                        {/* AI Analysis */}
                        {hasAiAnalysis && (
                            <>
                                {aiAnalysis.mainPoints.length > 0 && (
                                    <View style={ds.analysisCard}>
                                        <View style={ds.analysisTitleRow}>
                                            <Ionicons name="analytics-outline" size={18} color={tc.accent} />
                                            <Text style={ds.analysisSectionTitle}>
                                                {t('scaleSummary.sections.aiAnalysis')}
                                            </Text>
                                        </View>
                                        {aiAnalysis.mainPoints.map((point, index) => (
                                            <View key={index} style={ds.bulletRow}>
                                                <Feather name="check-circle" size={14} color={tc.accent} style={ds.bulletIcon} />
                                                <Text style={ds.bulletText}>{point}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {aiAnalysis.recommendations.length > 0 && (
                                    <View style={ds.analysisCard}>
                                        <View style={ds.analysisTitleRow}>
                                            <Feather name="arrow-right-circle" size={18} color={tc.accent} />
                                            <Text style={ds.analysisSectionTitle}>
                                                {t('scaleSummary.sections.recommendations')}
                                            </Text>
                                        </View>
                                        {aiAnalysis.recommendations.map((rec, index) => (
                                            <View key={index} style={ds.bulletRow}>
                                                <Feather name="arrow-right" size={14} color={tc.accent} style={ds.bulletIcon} />
                                                <Text style={ds.bulletText}>{rec}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {aiAnalysis.riskFactors.length > 0 && (
                                    <View style={ds.analysisCard}>
                                        <View style={ds.analysisTitleRow}>
                                            <Ionicons name="warning-outline" size={18} color="#F59E0B" />
                                            <Text style={ds.analysisSectionTitle}>
                                                {t('scaleSummary.sections.riskFactors')}
                                            </Text>
                                        </View>
                                        {aiAnalysis.riskFactors.map((risk, index) => (
                                            <View key={index} style={ds.bulletRow}>
                                                <Ionicons name="alert-circle-outline" size={14} color="#F59E0B" style={ds.bulletIcon} />
                                                <Text style={ds.bulletText}>{risk}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </>
                        )}
                    </ScrollView>

                    {/* Footer */}
                    <View style={ds.footer}>
                        <TouchableOpacity style={ds.closeButton} onPress={onClose}>
                            <Text style={ds.closeButtonText}>
                                {t('scaleSummary.buttons.close')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleAdd}>
                            <LinearGradient
                                colors={[tc.accentGradientStart, tc.accentGradientEnd]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={ds.addButton}
                            >
                                <Feather name="arrow-right" size={16} color={tc.textOnPrimary} />
                                <Text style={ds.addButtonText}>
                                    {t('scaleSummary.buttons.addToInterview')}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: tc.background,
        },
        container: {
            flex: 1,
            backgroundColor: tc.background,
        },
        modalHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        headerCloseButton: {
            padding: 4,
            marginLeft: -4,
        },
        headerCenter: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        scrollContent: {
            flex: 1,
        },
        scrollContentContainer: {
            padding: 16,
            paddingBottom: 30,
            gap: 16,
        },
        scoreCard: {
            backgroundColor: tc.cardBackground,
            borderRadius: 12,
            padding: 24,
            borderWidth: 1,
            borderColor: tc.borderColor,
            alignItems: 'center',
        },
        scoreLabel: {
            fontSize: 14,
            color: tc.textSecondary,
            marginBottom: 8,
        },
        scoreValue: {
            fontSize: 36,
            fontWeight: '800',
            marginBottom: 12,
        },
        severityBadge: {
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 6,
        },
        severityText: {
            fontSize: 14,
            fontWeight: '700',
        },
        detailsCard: {
            backgroundColor: tc.cardBackground,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: tc.borderColor,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: tc.textPrimary,
            marginBottom: 8,
        },
        detailsText: {
            fontSize: 14,
            color: tc.textSecondary,
            lineHeight: 22,
        },
        analysisCard: {
            backgroundColor: tc.cardBackground,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: tc.borderColor,
        },
        analysisTitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
        },
        analysisSectionTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        bulletRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 8,
        },
        bulletIcon: {
            marginTop: 3,
            marginRight: 10,
        },
        bulletText: {
            flex: 1,
            fontSize: 14,
            color: tc.textSecondary,
            lineHeight: 20,
        },
        footer: {
            paddingHorizontal: 16,
            paddingBottom: hp(5),
            paddingTop: 12,
            backgroundColor: tc.background,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        closeButton: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: tc.accent,
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: wp(8),
        },
        closeButtonText: {
            fontSize: 14,
            color: tc.accent,
            fontWeight: '700',
        },
        addButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: wp(6),
            gap: 6,
        },
        addButtonText: {
            fontSize: 14,
            color: '#fff',
            fontWeight: '700',
        },
    });

export default ScaleResultModal;
