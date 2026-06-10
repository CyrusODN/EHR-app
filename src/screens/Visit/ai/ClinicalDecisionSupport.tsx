import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    Modal, Pressable, ActivityIndicator, FlatList,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { GetClinicalDecisionSupport, GetPreviousVisits } from '../../../Services/Visit.Service';

interface ClinicalDecisionSupportProps {
    visitData: any;
    visitId: string;
    onSuggestionAccept?: (suggestion: any) => void;
}

const ClinicalDecisionSupport = ({ visitData, visitId, onSuggestionAccept }: ClinicalDecisionSupportProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createStyles(tc, isDark);

    const [isExpanded, setIsExpanded] = useState(false);
    const [showDataSelector, setShowDataSelector] = useState(false);
    const [selectedData, setSelectedData] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [riskAssessments, setRiskAssessments] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [previousVisits, setPreviousVisits] = useState<any[]>([]);
    const [isLoadingVisits, setIsLoadingVisits] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisText, setAnalysisText] = useState('');

    useEffect(() => {
        if (visitId) {
            fetchPreviousVisits();
            loadExistingAnalysis();
        }
    }, [visitId]);

    const fetchPreviousVisits = async () => {
        setIsLoadingVisits(true);
        try {
            const response = await GetPreviousVisits(visitId, 10);
            const visits = response?.previousVisits || response?.data?.previousVisits || [];
            setPreviousVisits(visits);
        } catch (err) {
            console.error('Error fetching previous visits:', err);
        } finally {
            setIsLoadingVisits(false);
        }
    };

    const loadExistingAnalysis = () => {
        if (!visitData?.clinicalDecisionSupport) return;
        const cds = visitData.clinicalDecisionSupport;
        if (cds.analysis) {
            setAnalysisText(cds.analysis);
            setSuggestions(cds.suggestions || []);
            setRiskAssessments(cds.riskAssessments || []);
            setShowResults(true);
        }
    };

    const analyzeClinicalData = async () => {
        if (!visitId) return;
        setIsAnalyzing(true);
        setShowResults(false);
        setShowDataSelector(false);
        setError(null);

        try {
            const selectedVisitIds = selectedData
                .filter(id => id.startsWith('visit-'))
                .map(id => id.replace('visit-', ''));

            const response = await GetClinicalDecisionSupport(visitId, selectedVisitIds);

            if (response) {
                setSuggestions(response.suggestions || []);
                setRiskAssessments(response.riskAssessments || []);
                setAnalysisText(response.analysis || '');
                setShowResults(true);
            }
        } catch (err: any) {
            setError(err?.message || t('visit.ai.cds.analysisError'));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const clearResults = () => {
        setShowResults(false);
        setSelectedData([]);
        setAnalysisText('');
        setSuggestions([]);
        setRiskAssessments([]);
    };

    const toggleDataSelection = (id: string) => {
        setSelectedData(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        );
    };

    return (
        <View style={ds.container}>
            {/* Header */}
            <TouchableOpacity style={ds.header} onPress={() => setIsExpanded(!isExpanded)} activeOpacity={0.7}>
                <View style={ds.headerLeft}>
                    <View style={ds.iconBg}>
                        <MaterialCommunityIcons name="brain" size={24} color={tc.accent} />
                    </View>
                    <View>
                        <Text style={ds.headerTitle}>{t('visit.ai.tabs.cds')}</Text>
                        <Text style={ds.headerSubtitle}>{t('visit.ai.interview.subtitle')}</Text>
                    </View>
                </View>
                <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={tc.textPrimary} />
            </TouchableOpacity>

            {/* Error */}
            {error && (
                <View style={ds.errorBox}>
                    <Feather name="alert-triangle" size={16} color="#EF4444" />
                    <Text style={ds.errorText}>{error}</Text>
                </View>
            )}

            {isExpanded && (
                <View style={ds.content}>
                    {isAnalyzing && (
                        <View style={ds.loadingContainer}>
                            <ActivityIndicator size="large" color={tc.accent} />
                            <Text style={ds.loadingText}>{t('visit.ai.cds.analyzing') || 'Analyzing clinical data...'}</Text>
                        </View>
                    )}

                    {!showResults && !isAnalyzing && (
                        <TouchableOpacity onPress={() => setShowDataSelector(true)}>
                            <LinearGradient
                                colors={['#58A7B3', '#8ED1CC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={ds.analyzeButton}
                            >
                                <Feather name="file-text" size={18} color="#fff" />
                                <Text style={ds.analyzeButtonText}>{t('visit.ai.cds.selectData') || 'Select Data for Analysis'}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}

                    {showResults && !isAnalyzing && (
                        <View style={ds.resultsContainer}>
                            <View style={ds.resultsHeader}>
                                <Text style={ds.resultsTitle}>{t('visit.ai.cds.analysisResults') || 'Analysis Results'}</Text>
                                <View style={ds.resultActions}>
                                    <TouchableOpacity style={ds.newAnalysisBtn} onPress={clearResults}>
                                        <Feather name="plus-circle" size={14} color={tc.accent} />
                                        <Text style={ds.newAnalysisBtnText}>{t('visit.ai.cds.newAnalysis') || 'New'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Analysis Text */}
                            {analysisText ? (
                                <View style={ds.analysisTextBox}>
                                    <View style={ds.analysisTextHeader}>
                                        <Feather name="file-text" size={16} color={tc.accent} />
                                        <Text style={ds.analysisTextTitle}>{t('visit.ai.cds.detailedAnalysis') || 'Detailed Analysis'}</Text>
                                    </View>
                                    <Text style={ds.analysisTextContent}>{analysisText}</Text>
                                </View>
                            ) : null}

                            {/* Suggestions */}
                            {suggestions.map((suggestion, index) => (
                                <View key={`sug-${index}`} style={ds.suggestionCard}>
                                    <View style={ds.suggestionHeader}>
                                        <View style={ds.suggestionLeft}>
                                            <Feather name="activity" size={18} color={tc.accent} />
                                            <Text style={ds.suggestionTitle}>{suggestion.suggestion}</Text>
                                        </View>
                                        <View style={ds.confidenceRow}>
                                            <Text style={ds.confidenceText}>
                                                {Math.round((suggestion.confidence || 0) * 100)}%
                                            </Text>
                                            {onSuggestionAccept && (
                                                <TouchableOpacity onPress={() => onSuggestionAccept(suggestion)}>
                                                    <Feather name="plus-circle" size={20} color={tc.accent} />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                    <Text style={ds.reasoningText}>{suggestion.reasoning}</Text>
                                    {suggestion.evidence?.length > 0 && (
                                        <View style={ds.evidenceSection}>
                                            <Text style={ds.evidenceLabel}>{t('visit.ai.cds.evidence') || 'Evidence'}:</Text>
                                            {suggestion.evidence.map((item: string, i: number) => (
                                                <Text key={i} style={ds.evidenceItem}>• {item}</Text>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}

                            {/* Risk Assessments */}
                            {riskAssessments.map((assessment, index) => (
                                <View key={`risk-${index}`} style={ds.riskCard}>
                                    <View style={ds.riskHeader}>
                                        <Feather name="alert-triangle" size={18} color="#EF4444" />
                                        <Text style={ds.riskTitle}>
                                            {(assessment.type || '').charAt(0).toUpperCase() + (assessment.type || '').slice(1)} Risk
                                        </Text>
                                        <View style={[ds.riskBadge, assessment.level === 'low' ? ds.riskLow : assessment.level === 'moderate' ? ds.riskMod : ds.riskHigh]}>
                                            <Text style={[ds.riskBadgeText, assessment.level === 'low' ? ds.riskLowText : assessment.level === 'moderate' ? ds.riskModText : ds.riskHighText]}>
                                                {(assessment.level || '').toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>
                                    {assessment.factors?.length > 0 && (
                                        <View style={ds.riskSection}>
                                            <Text style={ds.riskSectionTitle}>{t('visit.ai.cds.riskFactors') || 'Risk Factors'}:</Text>
                                            {assessment.factors.map((f: string, i: number) => (
                                                <Text key={i} style={ds.riskItem}>• {f}</Text>
                                            ))}
                                        </View>
                                    )}
                                    {assessment.recommendations?.length > 0 && (
                                        <View style={ds.riskSection}>
                                            <Text style={ds.riskSectionTitle}>{t('visit.ai.cds.recommendations') || 'Recommendations'}:</Text>
                                            {assessment.recommendations.map((r: string, i: number) => (
                                                <Text key={i} style={ds.riskItem}>• {r}</Text>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            )}

            {/* Data Selector Modal */}
            <Modal visible={showDataSelector} transparent animationType="fade" onRequestClose={() => setShowDataSelector(false)}>
                <Pressable style={ds.modalOverlay} onPress={() => setShowDataSelector(false)}>
                    <View style={ds.modalContent} onStartShouldSetResponder={() => true}>
                        <View style={ds.modalHeader}>
                            <Text style={ds.modalTitle}>{t('visit.ai.cds.selectData') || 'Select Data for Analysis'}</Text>
                            <TouchableOpacity onPress={() => setShowDataSelector(false)}>
                                <Feather name="x" size={20} color={tc.textMuted} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={ds.modalBody}
                            contentContainerStyle={ds.modalBodyContent}
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                        >
                            <Text style={ds.sectionLabel}>{t('visit.ai.cds.currentVisit') || 'Current Visit'}</Text>
                            <TouchableOpacity
                                style={[ds.checkItem, selectedData.includes('current-interview') && ds.checkItemActive]}
                                onPress={() => toggleDataSelection('current-interview')}
                            >
                                <View style={[ds.checkbox, selectedData.includes('current-interview') && ds.checkboxActive]}>
                                    {selectedData.includes('current-interview') && <Feather name="check" size={12} color="#fff" />}
                                </View>
                                <View style={ds.checkItemContent}>
                                    <Text style={ds.checkItemTitle}>{t('visit.ai.cds.currentInterview') || 'Current Interview'}</Text>
                                    <Text style={ds.checkItemDesc}>{t('visit.ai.cds.currentInterviewDesc') || 'Include current visit interview data'}</Text>
                                </View>
                            </TouchableOpacity>

                            <Text style={[ds.sectionLabel, { marginTop: 16 }]}>{t('visit.ai.cds.previousVisits') || 'Previous Visits'}</Text>
                            {isLoadingVisits ? (
                                <ActivityIndicator size="small" color={tc.accent} style={{ marginVertical: 16 }} />
                            ) : previousVisits.length > 0 ? (
                                previousVisits.map((visit: any) => (
                                    <TouchableOpacity
                                        key={visit._id}
                                        style={[ds.checkItem, selectedData.includes(`visit-${visit._id}`) && ds.checkItemActive]}
                                        onPress={() => toggleDataSelection(`visit-${visit._id}`)}
                                    >
                                        <View style={[ds.checkbox, selectedData.includes(`visit-${visit._id}`) && ds.checkboxActive]}>
                                            {selectedData.includes(`visit-${visit._id}`) && <Feather name="check" size={12} color="#fff" />}
                                        </View>
                                        <View style={ds.checkItemContent}>
                                            <Text style={ds.checkItemTitle}>
                                                {new Date(visit.date).toLocaleDateString()}
                                            </Text>
                                            <Text style={ds.checkItemDesc}>
                                                {visit.visitType} - {visit.doctor?.name || 'Unknown'}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={ds.emptyText}>{t('visit.ai.cds.noPreviousVisits') || 'No previous visits found'}</Text>
                            )}
                        </ScrollView>

                        <View style={ds.modalFooter}>
                            <TouchableOpacity style={ds.cancelButton} onPress={() => setShowDataSelector(false)}>
                                <Text style={ds.cancelButtonText}>{t('common.cancel') || 'Cancel'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={ds.analyzeModalBtnWrapper}
                                disabled={selectedData.length === 0 || isAnalyzing}
                                onPress={analyzeClinicalData}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={selectedData.length === 0 ? ['#9CA3AF', '#9CA3AF'] : ['#58A7B3', '#8ED1CC']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={ds.analyzeModalBtn}
                                >
                                    <MaterialCommunityIcons name="brain" size={16} color="#fff" />
                                    <Text style={ds.analyzeModalBtnText}>{t('visit.ai.cds.analyze') || 'Analyze'}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const createStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: { marginBottom: 8 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: tc.cardBackground, borderRadius: 8, borderWidth: 1, borderColor: tc.borderColor },
    headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconBg: { width: 40, height: 40, borderRadius: 8, backgroundColor: tc.accentLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    headerTitle: { fontSize: 16, fontWeight: '700', color: tc.textPrimary },
    headerSubtitle: { fontSize: 12, color: tc.textMuted, marginTop: 2 },
    content: { marginTop: 12 },
    errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#FEF2F2', padding: 12, borderRadius: 8, marginTop: 8, gap: 8, borderWidth: 1, borderColor: isDark ? 'rgba(239,68,68,0.2)' : '#FECACA' },
    errorText: { fontSize: 13, color: '#EF4444', flex: 1 },
    loadingContainer: { alignItems: 'center', padding: 32 },
    loadingText: { fontSize: 14, color: tc.textMuted, marginTop: 12 },
    analyzeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',height: 48, borderRadius: 8, gap: 8 },
    analyzeButtonText: { fontSize: 15, fontWeight: '600', color: '#fff' },
    resultsContainer: { gap: 12 },
    resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    resultsTitle: { fontSize: 16, fontWeight: '700', color: tc.textPrimary },
    resultActions: { flexDirection: 'row', gap: 8 },
    newAnalysisBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: tc.accent },
    newAnalysisBtnText: { fontSize: 12, color: tc.accent, fontWeight: '600' },
    analysisTextBox: { backgroundColor: isDark ? 'rgba(88,167,179,0.1)' : '#F0F9FA', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: isDark ? 'rgba(88,167,179,0.2)' : '#B2DFE5' },
    analysisTextHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    analysisTextTitle: { fontSize: 15, fontWeight: '600', color: tc.accent },
    analysisTextContent: { fontSize: 13, color: tc.textSecondary, lineHeight: 20 },
    suggestionCard: { backgroundColor: tc.cardBackground, borderRadius: 10, padding: 14, borderLeftWidth: 4, borderLeftColor: tc.accent, borderWidth: 1, borderColor: tc.borderColor },
    suggestionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    suggestionLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
    suggestionTitle: { fontSize: 14, fontWeight: '600', color: tc.textPrimary, flex: 1 },
    confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    confidenceText: { fontSize: 12, color: tc.textMuted },
    reasoningText: { fontSize: 13, color: tc.textSecondary, marginTop: 8, lineHeight: 18 },
    evidenceSection: { marginTop: 10 },
    evidenceLabel: { fontSize: 12, fontWeight: '600', color: tc.textSecondary, marginBottom: 4 },
    evidenceItem: { fontSize: 12, color: tc.textMuted, lineHeight: 18 },
    riskCard: { backgroundColor: isDark ? 'rgba(239,68,68,0.08)' : '#FEF2F2', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: isDark ? 'rgba(239,68,68,0.2)' : '#FECACA' },
    riskHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    riskTitle: { fontSize: 14, fontWeight: '600', color: isDark ? '#FCA5A5' : '#991B1B', flex: 1 },
    riskBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
    riskLow: { backgroundColor: '#DCFCE7' },
    riskMod: { backgroundColor: '#FEF9C3' },
    riskHigh: { backgroundColor: '#FEE2E2' },
    riskBadgeText: { fontSize: 10, fontWeight: '700' },
    riskLowText: { color: '#166534' },
    riskModText: { color: '#854D0E' },
    riskHighText: { color: '#991B1B' },
    riskSection: { marginTop: 8 },
    riskSectionTitle: { fontSize: 12, fontWeight: '600', color: isDark ? '#FCA5A5' : '#991B1B', marginBottom: 4 },
    riskItem: { fontSize: 12, color: isDark ? '#FECACA' : '#7F1D1D', lineHeight: 18 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: wp(85), height: hp(70), backgroundColor: tc.cardBackground, borderRadius: 14, overflow: 'hidden' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: tc.borderColor },
    modalTitle: { fontSize: 16, fontWeight: '700', color: tc.textPrimary, flex: 1, marginRight: 12 },
    modalBody: { flex: 1, paddingHorizontal: 16 },
    modalBodyContent: { paddingVertical: 16, paddingBottom: 8 },
    sectionLabel: { fontSize: 12, fontWeight: '600', color: tc.textMuted, marginBottom: 8, textTransform: 'uppercase' },
    checkItem: { flexDirection: 'row', alignItems: 'flex-start', padding: 12, borderRadius: 8, borderWidth: 1.5, borderColor: tc.borderColor, marginBottom: 8, gap: 10 },
    checkItemActive: { borderColor: tc.accent, backgroundColor: isDark ? 'rgba(88,167,179,0.1)' : '#F0F9FA' },
    checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: tc.borderColor, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
    checkboxActive: { backgroundColor: tc.accent, borderColor: tc.accent },
    checkItemContent: { flex: 1 },
    checkItemTitle: { fontSize: 14, fontWeight: '600', color: tc.textPrimary },
    checkItemDesc: { fontSize: 12, color: tc.textMuted, marginTop: 2 },
    emptyText: { fontSize: 13, color: tc.textMuted, textAlign: 'center', paddingVertical: 16 },
    modalFooter: { flexShrink: 0, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: tc.borderColor, backgroundColor: tc.cardBackground },
    cancelButton: { minHeight: 44, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: tc.borderColor, justifyContent: 'center', alignItems: 'center' },
    cancelButtonText: { fontSize: 14, color: tc.textSecondary, fontWeight: '500' },
    analyzeModalBtnWrapper: { flexShrink: 0, borderRadius: 8, overflow: 'hidden' },
    analyzeModalBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 12, minHeight: 44, borderRadius: 8 },
    analyzeModalBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});

export default ClinicalDecisionSupport;
