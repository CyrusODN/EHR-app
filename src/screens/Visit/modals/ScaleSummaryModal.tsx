import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Animated,
    Dimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import type { ScaleResult } from '../../../types/visit';

interface ScaleSummaryModalProps {
    visible: boolean;
    result: ScaleResult | null;
    onClose: () => void;
    onAddToInterview: () => void;
}

const getSeverityLevel = (type: string, score: number): string => {
    switch (type) {
        case 'HAM-D':
            if (score <= 7) return 'none';
            if (score <= 12) return 'mild';
            if (score <= 18) return 'moderate';
            return 'severe';
        case 'MADRS':
            if (score <= 6) return 'none';
            if (score <= 19) return 'mild';
            if (score <= 34) return 'moderate';
            return 'severe';
        case 'ASRS':
            return score >= 4 ? 'severe' : 'moderate';
        case 'HAM-A':
            if (score <= 17) return 'mild';
            if (score <= 24) return 'moderate';
            if (score <= 30) return 'severe';
            return 'verySevere';
        case 'ISI':
            if (score <= 7) return 'none';
            if (score <= 14) return 'mild';
            if (score <= 21) return 'moderate';
            return 'severe';
        case 'CARS-2':
            if (score <= 25) return 'none';
            if (score <= 30) return 'mild';
            if (score <= 36) return 'moderate';
            return 'severe';
        default:
            return 'moderate';
    }
};

const getSeverityColor = (severity: string): string => {
    switch (severity) {
        case 'none': return '#10B981';
        case 'mild': return '#F59E0B';
        case 'moderate': return '#F97316';
        case 'severe': return '#EF4444';
        case 'verySevere': return '#7F1D1D';
        default: return '#6B7280';
    }
};

const ScaleSummaryModal = ({ visible, result, onClose, onAddToInterview }: ScaleSummaryModalProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    if (!result) return null;

    const severity = getSeverityLevel(result.type, result.score);
    const severityColor = getSeverityColor(severity);

    const getAnalysisPoints = (): string[] => {
        const baseKey = `visit.scaleSummary.analysis.${result.type.toLowerCase().replace('-', '')}.${severity}`;
        return [
            t(`${baseKey}.point1`, { defaultValue: t('visit.scaleSummary.analysis.defaultPoint1') }),
            t(`${baseKey}.point2`, { defaultValue: t('visit.scaleSummary.analysis.defaultPoint2') }),
            t(`${baseKey}.point3`, { defaultValue: t('visit.scaleSummary.analysis.defaultPoint3') }),
        ];
    };

    const getRecommendations = (): string[] => {
        const baseKey = `visit.scaleSummary.recommendations.${result.type.toLowerCase().replace('-', '')}.${severity}`;
        return [
            t(`${baseKey}.rec1`, { defaultValue: t('visit.scaleSummary.recommendations.defaultRec1') }),
            t(`${baseKey}.rec2`, { defaultValue: t('visit.scaleSummary.recommendations.defaultRec2') }),
        ];
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={ds.overlay}>
                <View style={ds.modal}>
                    <View style={ds.header}>
                        <View style={ds.headerLeft}>
                            <MaterialCommunityIcons name="brain" size={22} color={tc.accent} />
                            <Text style={ds.headerTitle}>{t('visit.scaleSummary.title')}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={22} color={tc.textMuted} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={ds.body} showsVerticalScrollIndicator={false}>
                        {/* Score Card */}
                        <View style={[ds.scoreCard, { borderColor: severityColor + '40' }]}>
                            <View style={ds.scoreRow}>
                                <View>
                                    <Text style={ds.scaleType}>{result.type}</Text>
                                    <Text style={ds.scaleDate}>{new Date(result.date).toLocaleDateString()}</Text>
                                </View>
                                <View style={[ds.scoreBadge, { backgroundColor: severityColor + '15' }]}>
                                    <Text style={[ds.scoreValue, { color: severityColor }]}>{result.score}</Text>
                                </View>
                            </View>
                            <View style={[ds.severityBar, { backgroundColor: severityColor + '20' }]}>
                                <Text style={[ds.severityText, { color: severityColor }]}>
                                    {result.interpretation || t(`visit.scaleSummary.severity.${severity}`)}
                                </Text>
                            </View>
                        </View>

                        {/* AI Analysis */}
                        <View style={ds.section}>
                            <View style={ds.sectionHeader}>
                                <MaterialCommunityIcons name="auto-fix" size={16} color={tc.accent} />
                                <Text style={ds.sectionTitle}>{t('visit.scaleSummary.aiAnalysis')}</Text>
                            </View>
                            {getAnalysisPoints().map((point, idx) => (
                                <View key={idx} style={ds.pointRow}>
                                    <View style={[ds.pointDot, { backgroundColor: severityColor }]} />
                                    <Text style={ds.pointText}>{point}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Recommendations */}
                        <View style={ds.section}>
                            <View style={ds.sectionHeader}>
                                <Feather name="check-circle" size={16} color="#10B981" />
                                <Text style={ds.sectionTitle}>{t('visit.scaleSummary.recommendationsTitle')}</Text>
                            </View>
                            {getRecommendations().map((rec, idx) => (
                                <View key={idx} style={ds.recRow}>
                                    <Feather name="arrow-right" size={12} color={tc.accent} />
                                    <Text style={ds.recText}>{rec}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Details */}
                        {result.details && (
                            <View style={ds.section}>
                                <Text style={ds.sectionTitle}>{t('visit.scaleSummary.details')}</Text>
                                <Text style={ds.detailsText}>{result.details}</Text>
                            </View>
                        )}
                    </ScrollView>

                    <View style={ds.footer}>
                        <TouchableOpacity style={ds.closeBtn} onPress={onClose}>
                            <Text style={ds.closeBtnText}>{t('common.cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={ds.addBtn} onPress={onAddToInterview}>
                            <LinearGradient
                                colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={ds.addBtnGradient}
                            >
                                <Feather name="plus-circle" size={14} color="#fff" />
                                <Text style={ds.addBtnText}>{t('visit.scaleSummary.addToInterview')}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ScaleSummaryModal;

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
    modal: {
        backgroundColor: tc.modalBg || tc.cardBackground, borderRadius: 16, width: '100%',
        maxHeight: hp(80), borderWidth: isDark ? 1 : 0, borderColor: tc.borderColor,
    },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 16, borderBottomWidth: 1, borderBottomColor: tc.borderColor,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    headerTitle: { fontSize: 17, fontWeight: '700', color: tc.textPrimary },
    body: { padding: 16 },
    scoreCard: {
        borderWidth: 1.5, borderRadius: 12, padding: 16, marginBottom: 20,
        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FAFAFA',
    },
    scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    scaleType: { fontSize: 18, fontWeight: '800', color: tc.textPrimary },
    scaleDate: { fontSize: 12, color: tc.textMuted, marginTop: 2 },
    scoreBadge: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    scoreValue: { fontSize: 20, fontWeight: '800' },
    severityBar: { marginTop: 12, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
    severityText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
    section: { marginBottom: 20 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: tc.textPrimary },
    pointRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, paddingLeft: 4 },
    pointDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6, marginRight: 10 },
    pointText: { flex: 1, fontSize: 13, color: tc.textSecondary, lineHeight: 18 },
    recRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, paddingLeft: 4, gap: 8 },
    recText: { flex: 1, fontSize: 13, color: tc.textSecondary, lineHeight: 18 },
    detailsText: { fontSize: 13, color: tc.textSecondary, lineHeight: 18 },
    footer: {
        flexDirection: 'row', justifyContent: 'flex-end', gap: 12, padding: 16,
        borderTopWidth: 1, borderTopColor: tc.borderColor,
    },
    closeBtn: {
        paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8,
        borderWidth: 1, borderColor: tc.borderColor,
    },
    closeBtnText: { fontSize: 14, fontWeight: '600', color: tc.textSecondary },
    addBtn: { borderRadius: 8, overflow: 'hidden' },
    addBtnGradient: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10 },
    addBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
