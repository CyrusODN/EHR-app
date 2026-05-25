import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import type { LabResults, TestResult } from '../../../types/laboratory';

interface LabResultsViewProps {
    results: LabResults;
    onClose: () => void;
}

const FLAG_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
    normal: { bg: '#D1FAE5', text: '#065F46', icon: 'check-circle' },
    high: { bg: '#FEE2E2', text: '#991B1B', icon: 'arrow-up' },
    low: { bg: '#DBEAFE', text: '#1E40AF', icon: 'arrow-down' },
    critical: { bg: '#FEE2E2', text: '#7F1D1D', icon: 'alert-triangle' },
};

const LabResultsView = ({ results, onClose }: LabResultsViewProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    const renderResultRow = (result: TestResult, index: number) => {
        const flag = FLAG_COLORS[result.flag || 'normal'];
        return (
            <View key={index} style={[ds.resultRow, index % 2 === 0 && ds.resultRowAlt]}>
                <View style={ds.resultLeft}>
                    <Text style={ds.resultTestName}>{result.testName || result.testId}</Text>
                    {result.referenceRange && (
                        <Text style={ds.resultRefRange}>{t('visit.laboratory.results.refRange')}: {result.referenceRange}</Text>
                    )}
                </View>
                <View style={ds.resultRight}>
                    <Text style={[ds.resultValue, { color: flag.text }]}>
                        {result.value} {result.unit}
                    </Text>
                    {result.flag && result.flag !== 'normal' && (
                        <View style={[ds.flagBadge, { backgroundColor: isDark ? flag.text + '20' : flag.bg }]}>
                            <Feather name={flag.icon} size={10} color={flag.text} />
                            <Text style={[ds.flagText, { color: flag.text }]}>
                                {t(`visit.laboratory.results.flag.${result.flag}`)}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={ds.container}>
            <View style={ds.header}>
                <View>
                    <Text style={ds.title}>{t('visit.laboratory.results.title')}</Text>
                    <Text style={ds.subtitle}>
                        {t('visit.laboratory.results.verifiedAt')}: {new Date(results.verifiedAt).toLocaleDateString()}
                    </Text>
                </View>
                <TouchableOpacity onPress={onClose} style={ds.closeBtn}>
                    <Feather name="x" size={20} color={tc.textMuted} />
                </TouchableOpacity>
            </View>

            {results.criticalValues && (
                <View style={ds.criticalBanner}>
                    <Feather name="alert-triangle" size={16} color="#DC2626" />
                    <Text style={ds.criticalText}>{t('visit.laboratory.results.criticalWarning')}</Text>
                </View>
            )}

            <ScrollView style={ds.resultsScroll} nestedScrollEnabled>
                {results.testResults.map(renderResultRow)}
            </ScrollView>

            {results.interpretation && (
                <View style={ds.interpretationBox}>
                    <Text style={ds.interpretationLabel}>{t('visit.laboratory.results.interpretation')}</Text>
                    <Text style={ds.interpretationText}>{results.interpretation}</Text>
                </View>
            )}

            {results.attachments && results.attachments.length > 0 && (
                <View style={ds.attachmentsSection}>
                    <Text style={ds.attachmentsLabel}>{t('visit.laboratory.results.attachments')}</Text>
                    {results.attachments.map(att => (
                        <View key={att.id} style={ds.attachmentRow}>
                            <Feather name="paperclip" size={14} color={tc.accent} />
                            <Text style={ds.attachmentName}>{att.name}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

export default LabResultsView;

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: { padding: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    title: { fontSize: 16, fontWeight: '700', color: tc.textPrimary },
    subtitle: { fontSize: 12, color: tc.textMuted, marginTop: 2 },
    closeBtn: { padding: 4 },
    criticalBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: isDark ? 'rgba(220,38,38,0.1)' : '#FEF2F2',
        padding: 12, borderRadius: 8, marginBottom: 16,
        borderWidth: 1, borderColor: isDark ? 'rgba(220,38,38,0.2)' : '#FECACA',
    },
    criticalText: { fontSize: 13, fontWeight: '600', color: '#DC2626' },
    resultsScroll: { maxHeight: hp(35) },
    resultRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 10, paddingHorizontal: 12, borderRadius: 6,
    },
    resultRowAlt: { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC' },
    resultLeft: { flex: 1 },
    resultTestName: { fontSize: 13, fontWeight: '600', color: tc.textPrimary },
    resultRefRange: { fontSize: 11, color: tc.textMuted, marginTop: 2 },
    resultRight: { alignItems: 'flex-end' },
    resultValue: { fontSize: 14, fontWeight: '700' },
    flagBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginTop: 2 },
    flagText: { fontSize: 10, fontWeight: '600' },
    interpretationBox: {
        marginTop: 16, padding: 12, borderRadius: 8,
        backgroundColor: isDark ? 'rgba(88,167,179,0.1)' : '#E8F7F9',
        borderWidth: 1, borderColor: isDark ? 'rgba(88,167,179,0.2)' : '#B2EBF2',
    },
    interpretationLabel: { fontSize: 13, fontWeight: '600', color: tc.textPrimary, marginBottom: 6 },
    interpretationText: { fontSize: 13, color: tc.textSecondary, lineHeight: 20 },
    attachmentsSection: { marginTop: 16 },
    attachmentsLabel: { fontSize: 13, fontWeight: '600', color: tc.textPrimary, marginBottom: 8 },
    attachmentRow: {
        flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8,
        paddingHorizontal: 12, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
        borderRadius: 6, marginBottom: 4,
    },
    attachmentName: { fontSize: 13, color: tc.accent, fontWeight: '500' },
});
