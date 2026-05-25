import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { GetInterviewAnalysis } from '../../../Services/Visit.Service';

interface InterviewCoachToolProps {
    visitData: any;
    visitId: string;
    onQuestionSelect?: (question: any) => void;
}

const InterviewCoachTool = ({ visitData, visitId, onQuestionSelect }: InterviewCoachToolProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createStyles(tc, isDark);

    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'suggestions' | 'analysis' | 'literature'>('suggestions');
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [usedQuestions, setUsedQuestions] = useState<string[]>([]);

    const hasDataForAnalysis = visitData?.transcription?.text ||
        visitData?.interview?.mainSymptoms ||
        visitData?.aiNotes?.content;

    useEffect(() => {
        if (visitData?.interviewAnalysis) {
            const transformed = {
                ...visitData.interviewAnalysis,
                suggestedQuestions: visitData.interviewAnalysis.suggestedQuestions?.map((q: any, idx: number) => ({
                    id: q._id || `q_${idx}`,
                    text: q.question || q.text,
                    category: q.category || 'timeline',
                    reasoning: q.reasoning || q.diagnosticPurpose,
                    followUp: q.followUpQuestions || q.followUp || [],
                    tags: q.tags || [],
                    priority: q.priority || 'medium',
                    icd10Code: q.icd10Code,
                })) || [],
            };
            setAnalysisData(transformed);
        } else if (hasDataForAnalysis && !isAnalyzing && !analysisData) {
            performAnalysis();
        }
    }, [visitData, hasDataForAnalysis]);

    const performAnalysis = async () => {
        if (!visitId || !hasDataForAnalysis) return;
        setIsAnalyzing(true);
        setAnalysisError(null);

        try {
            const result = await GetInterviewAnalysis(visitId);
            const transformed = {
                ...result,
                suggestedQuestions: result.suggestedQuestions?.map((q: any, idx: number) => ({
                    id: q._id || `q_${idx}`,
                    text: q.question || q.text,
                    category: q.category || 'timeline',
                    reasoning: q.reasoning || q.diagnosticPurpose,
                    followUp: q.followUpQuestions || q.followUp || [],
                    tags: q.tags || [],
                    priority: q.priority || 'medium',
                    icd10Code: q.icd10Code,
                })) || [],
            };
            setAnalysisData(transformed);
        } catch (err) {
            setAnalysisError(t('visit.ai.interview.analysisError') || 'Analysis failed. Try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleQuestionSelect = (question: any) => {
        setUsedQuestions(prev => [...prev, question.id]);
        onQuestionSelect?.(question);
    };

    const suggestions = analysisData?.suggestedQuestions || [];
    const sortedSuggestions = [...suggestions].sort((a: any, b: any) => {
        const p: any = { high: 3, medium: 2, low: 1 };
        return (p[b.priority] || 0) - (p[a.priority] || 0);
    });

    const mockLiterature = [
        { title: 'Structured Interview Guidelines for Depression', source: 'Journal of Clinical Psychiatry, 2023', relevance: '95%' },
        { title: 'Best Practices in Patient Communication', source: 'Medical Communication Quarterly, 2023', relevance: '88%' },
    ];

    const renderSuggestionsTab = () => {
        if (isAnalyzing) {
            return (
                <View style={ds.centeredPad}>
                    <ActivityIndicator size="small" color={tc.accent} />
                    <Text style={ds.analyzingText}>{t('visit.ai.interview.analyzing') || 'Analyzing...'}</Text>
                </View>
            );
        }

        return (
            <View>
                <Text style={ds.countLabel}>
                    {t('visit.ai.interview.suggestedCount', { count: sortedSuggestions.length })}
                    {sortedSuggestions.length > 0 && ` (${sortedSuggestions.filter((q: any) => q.priority === 'high').length} high priority)`}
                </Text>
                {sortedSuggestions.map((q: any) => {
                    const isUsed = usedQuestions.includes(q.id);
                    return (
                        <TouchableOpacity
                            key={q.id}
                            style={[ds.questionCard, isUsed && ds.questionCardUsed]}
                            onPress={() => handleQuestionSelect(q)}
                            activeOpacity={0.7}
                        >
                            <View style={ds.questionTop}>
                                <View style={[ds.priorityBadge, q.priority === 'high' ? ds.priorityHigh : q.priority === 'medium' ? ds.priorityMed : ds.priorityLow]}>
                                    <Text style={[ds.priorityText, q.priority === 'high' ? ds.priorityHighText : q.priority === 'medium' ? ds.priorityMedText : ds.priorityLowText]}>
                                        {q.priority}
                                    </Text>
                                </View>
                                {q.icd10Code && (
                                    <View style={ds.icdBadge}>
                                        <Text style={ds.icdBadgeText}>{q.icd10Code}</Text>
                                    </View>
                                )}
                                {isUsed && <Feather name="check-circle" size={14} color="#10B981" />}
                            </View>
                            <Text style={ds.questionText}>{q.text}</Text>
                            {q.reasoning && <Text style={ds.questionReasoning}>{q.reasoning}</Text>}
                            {q.followUp?.length > 0 && (
                                <View style={ds.followUpSection}>
                                    <Text style={ds.followUpLabel}>{t('visit.ai.interview.followUp') || 'Follow-up'}:</Text>
                                    {q.followUp.slice(0, 2).map((f: string, i: number) => (
                                        <Text key={i} style={ds.followUpItem}>• {f}</Text>
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
                {sortedSuggestions.length === 0 && !isAnalyzing && (
                    <Text style={ds.emptyText}>{t('visit.ai.interview.noSuggestions') || 'No suggestions available'}</Text>
                )}
            </View>
        );
    };

    const renderAnalysisTab = () => {
        if (isAnalyzing) {
            return (
                <View style={ds.centeredPad}>
                    <ActivityIndicator size="small" color={tc.accent} />
                    <Text style={ds.analyzingText}>{t('visit.ai.interview.analyzing') || 'Analyzing...'}</Text>
                </View>
            );
        }

        if (!analysisData) {
            return (
                <View style={ds.centeredPad}>
                    <MaterialCommunityIcons name="brain" size={40} color={tc.textMuted} />
                    <Text style={ds.emptyText}>{t('visit.ai.interview.noAnalysis') || 'No analysis data available'}</Text>
                </View>
            );
        }

        return (
            <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ds.metricsRow}>
                    <View style={ds.metricCard}>
                        <View style={ds.metricCardText}>
                            <Text style={ds.metricLabel}>{t('visit.ai.interview.analysis.clusters')}</Text>
                            <Text style={ds.metricValue}>{analysisData.symptomClusters?.length || 0}</Text>
                            <Text style={ds.metricSub}>{t('visit.ai.interview.analysis.identified')}</Text>
                        </View>
                        <MaterialCommunityIcons name="brain" size={32} color={tc.accent} />
                    </View>
                    <View style={ds.metricCard}>
                        <View style={ds.metricCardText}>
                            <Text style={ds.metricLabel}>{t('visit.ai.interview.analysis.potential')}</Text>
                            <Text style={ds.metricValue}>{analysisData.potentialDiagnoses?.length || 0}</Text>
                            <Text style={ds.metricSub}>{t('visit.ai.interview.analysis.toConsider')}</Text>
                        </View>
                        <MaterialCommunityIcons name="target" size={32} color="#10B981" />
                    </View>
                    <View style={ds.metricCard}>
                        <View style={ds.metricCardText}>
                            <Text style={ds.metricLabel}>{t('visit.ai.interview.analysis.gaps')}</Text>
                            <Text style={ds.metricValue}>{analysisData.diagnosticGaps?.length || 0}</Text>
                            <Text style={ds.metricSub}>{t('visit.ai.interview.analysis.attention')}</Text>
                        </View>
                        <Feather name="alert-triangle" size={32} color="#F59E0B" />
                    </View>
                </ScrollView>

                {/* Symptom Clusters */}
                {analysisData.symptomClusters?.map((cluster: any, i: number) => (
                    <View key={`sc-${i}`} style={ds.clusterCard}>
                        <View style={ds.clusterHeader}>
                            <Text style={ds.clusterName}>{cluster.name}</Text>
                            <View style={[ds.severityBadge, cluster.severity === 'severe' ? ds.severeSeverity : cluster.severity === 'moderate' ? ds.modSeverity : ds.mildSeverity]}>
                                <Text style={ds.severityText}>{cluster.severity}</Text>
                            </View>
                        </View>
                        <Text style={ds.clusterSymptoms}>{cluster.symptoms?.join(', ')}</Text>
                        {cluster.duration && <Text style={ds.clusterDuration}>Duration: {cluster.duration}</Text>}
                    </View>
                ))}

                {/* Potential Diagnoses */}
                {analysisData.potentialDiagnoses?.map((diag: any, i: number) => (
                    <View key={`pd-${i}`} style={ds.diagCard}>
                        <View style={ds.diagHeader}>
                            <View>
                                <Text style={ds.diagName}>{diag.name}</Text>
                                <Text style={ds.diagCode}>ICD-10: {diag.icd10Code}</Text>
                            </View>
                            <View style={[ds.confBadge, (diag.confidence || 0) >= 80 ? ds.confHigh : (diag.confidence || 0) >= 60 ? ds.confMed : ds.confLow]}>
                                <Text style={ds.confBadgeText}>{diag.confidence}%</Text>
                            </View>
                        </View>
                        <Text style={ds.diagReasoning}>{diag.reasoning}</Text>
                    </View>
                ))}

                {/* Diagnostic Gaps */}
                {analysisData.diagnosticGaps?.map((gap: any, i: number) => (
                    <View key={`dg-${i}`} style={ds.gapCard}>
                        <View style={ds.gapHeader}>
                            <Text style={ds.gapName}>{gap.diagnosisName}</Text>
                            <View style={[ds.priorityBadge, gap.priority === 'high' ? ds.priorityHigh : ds.priorityMed]}>
                                <Text style={[ds.priorityText, gap.priority === 'high' ? ds.priorityHighText : ds.priorityMedText]}>{gap.priority}</Text>
                            </View>
                        </View>
                        {gap.missingCriteria && <Text style={ds.gapInfo}>Missing: {gap.missingCriteria.join(', ')}</Text>}
                        {gap.significance && <Text style={ds.gapInfo}>Significance: {gap.significance}</Text>}
                    </View>
                ))}

                {/* Recommendations */}
                {analysisData.clinicalRecommendations && (
                    <View style={ds.recommendBox}>
                        <Text style={ds.recommendTitle}>{t('visit.ai.interview.analysis.recommendations')}</Text>
                        {analysisData.clinicalRecommendations.areasToExplore?.map((area: string, i: number) => (
                            <Text key={i} style={ds.recommendItem}>• {area}</Text>
                        ))}
                        {analysisData.clinicalRecommendations.suggestedScales?.map((scale: string, i: number) => (
                            <Text key={`s-${i}`} style={ds.recommendItem}>📊 {scale}</Text>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    const renderLiteratureTab = () => (
        <View>
            {mockLiterature.map((ref, index) => (
                <View key={index} style={ds.litItem}>
                    <View style={ds.litLeft}>
                        <View style={ds.litHeaderRow}>
                            <Feather name="book-open" size={14} color={tc.accent} />
                            <Text style={ds.litTitle}>{ref.title}</Text>
                        </View>
                        <Text style={ds.litSource}>{ref.source}</Text>
                        <View style={ds.litAccRow}>
                            <Feather name="star" size={12} color="#EAB308" />
                            <Text style={ds.litAccText}>{t('visit.ai.interview.relevance') || 'Relevance'}: {ref.relevance}</Text>
                        </View>
                    </View>
                    <Feather name="external-link" size={16} color={tc.accent} />
                </View>
            ))}
        </View>
    );

    return (
        <View style={ds.container}>
            <TouchableOpacity style={ds.header} onPress={() => setIsExpanded(!isExpanded)} activeOpacity={0.7}>
                <View style={ds.headerLeft}>
                    <View style={ds.iconBg}>
                        <MaterialCommunityIcons name="brain" size={24} color={tc.accent} />
                    </View>
                    <View>
                        <Text style={ds.headerTitle}>{t('visit.ai.interview.title')}</Text>
                        <Text style={ds.headerSubtitle}>{t('visit.ai.interview.subtitle')}</Text>
                    </View>
                </View>
                <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={tc.textPrimary} />
            </TouchableOpacity>

            {isExpanded && (
                <View style={ds.content}>
                    {/* Re-analyze button */}
                    {hasDataForAnalysis && (
                        <TouchableOpacity style={ds.reanalyzeBtn} onPress={performAnalysis} disabled={isAnalyzing}>
                            <Feather name="refresh-cw" size={14} color={tc.accent} style={isAnalyzing ? { opacity: 0.5 } : undefined} />
                            <Text style={ds.reanalyzeBtnText}>
                                {isAnalyzing ? (t('visit.ai.interview.analyzing') || 'Analyzing...') : (t('visit.ai.interview.analyzeAgain') || 'Re-analyze')}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {!hasDataForAnalysis && (
                        <View style={ds.alertBox}>
                            <Ionicons name="alert-circle-outline" size={20} color={isDark ? '#FBBF24' : '#856404'} />
                            <View style={ds.alertTextContainer}>
                                <Text style={ds.alertTitle}>{t('visit.ai.interview.noData')}</Text>
                                <Text style={ds.alertSubtitle}>{t('visit.ai.interview.noDataDesc')}</Text>
                            </View>
                        </View>
                    )}

                    {analysisError && (
                        <View style={[ds.alertBox, { borderColor: isDark ? 'rgba(239,68,68,0.2)' : '#FECACA', backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : '#FEF2F2' }]}>
                            <Feather name="alert-circle" size={18} color="#EF4444" />
                            <Text style={{ fontSize: 13, color: '#EF4444', flex: 1, marginLeft: 8 }}>{analysisError}</Text>
                        </View>
                    )}

                    {/* Tabs */}
                    <View style={ds.tabsContainer}>
                        {(['suggestions', 'analysis', 'literature'] as const).map(tab => (
                            <TouchableOpacity
                                key={tab}
                                style={[ds.tab, activeTab === tab && ds.tabActive]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Feather
                                    name={tab === 'suggestions' ? 'message-square' : tab === 'analysis' ? 'bar-chart-2' : 'book-open'}
                                    size={14}
                                    color={activeTab === tab ? tc.accent : tc.textMuted}
                                />
                                <Text style={[ds.tabText, activeTab === tab && ds.tabTextActive]}>
                                    {tab === 'suggestions' ? t('visit.ai.interview.tabs.suggestions')
                                        : tab === 'analysis' ? t('visit.ai.interview.tabs.analysis')
                                            : t('visit.ai.interview.tabs.literature')}
                                </Text>
                                {tab === 'suggestions' && sortedSuggestions.length > 0 && (
                                    <View style={ds.tabBadge}>
                                        <Text style={ds.tabBadgeText}>{sortedSuggestions.length}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={ds.tabContent}>
                        {activeTab === 'suggestions' && renderSuggestionsTab()}
                        {activeTab === 'analysis' && renderAnalysisTab()}
                        {activeTab === 'literature' && renderLiteratureTab()}
                    </View>
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
    headerSubtitle: { fontSize: 12, color: tc.textMuted, marginTop: 2 },
    content: { marginTop: 12 },
    reanalyzeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: isDark ? 'rgba(88,167,179,0.1)' : '#F0F9FA', borderRadius: 8, marginBottom: 12 },
    reanalyzeBtnText: { fontSize: 13, color: tc.accent, fontWeight: '500' },
    alertBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: isDark ? 'rgba(245,158,11,0.1)' : '#FFFBEB', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: isDark ? 'rgba(245,158,11,0.2)' : '#FEF3C7', marginBottom: 12 },
    alertTextContainer: { marginLeft: 10, flex: 1 },
    alertTitle: { fontSize: 14, fontWeight: '600', color: isDark ? '#FBBF24' : '#856404' },
    alertSubtitle: { fontSize: 13, color: isDark ? '#FBBF24' : '#856404', marginTop: 2 },
    tabsContainer: { flexDirection: 'row', backgroundColor: tc.searchBarBg || (isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'), padding: 4, borderRadius: 8, marginBottom: 12 },
    tab: { flex: 1, alignItems: 'center', justifyContent: 'center',minHeight: 58, borderRadius: 6 ,gap:5},
    tabActive: { backgroundColor: tc.cardBackground, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: isDark ? 0.3 : 0.05, shadowRadius: 1, elevation: 1 },
    tabText: { fontSize: 11, color: tc.textMuted,textAlign:'center' },
    tabTextActive: { color: tc.accent, fontWeight: '700' },
    tabBadge: { backgroundColor: tc.accent, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1, marginLeft: 2,alignSelf:'center' },
    tabBadgeText: { fontSize: 10, color: '#fff', fontWeight: '700' },
    tabContent: { minHeight: 100 },
    centeredPad: { alignItems: 'center', paddingVertical: 24, gap: 8 },
    analyzingText: { fontSize: 13, color: tc.textMuted },
    countLabel: { fontSize: 13, color: tc.textMuted, marginBottom: 10 },
    questionCard: { backgroundColor: tc.cardBackground, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: tc.borderColor, marginBottom: 8 },
    questionCardUsed: { opacity: 0.6 },
    questionTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
    priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    priorityHigh: { backgroundColor: '#FEE2E2' },
    priorityMed: { backgroundColor: '#FEF9C3' },
    priorityLow: { backgroundColor: '#DBEAFE' },
    priorityText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
    priorityHighText: { color: '#991B1B' },
    priorityMedText: { color: '#854D0E' },
    priorityLowText: { color: '#1E40AF' },
    icdBadge: { backgroundColor: isDark ? 'rgba(88,167,179,0.15)' : '#E2F2F4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    icdBadgeText: { fontSize: 10, fontWeight: '600', color: tc.accent, fontFamily: 'monospace' },
    questionText: { fontSize: 14, fontWeight: '500', color: tc.textPrimary, lineHeight: 20 },
    questionReasoning: { fontSize: 12, color: tc.textMuted, marginTop: 4, lineHeight: 17 },
    followUpSection: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: tc.borderColor },
    followUpLabel: { fontSize: 11, fontWeight: '600', color: tc.textMuted, marginBottom: 4 },
    followUpItem: { fontSize: 12, color: tc.textSecondary, lineHeight: 17 },
    emptyText: { fontSize: 13, color: tc.textMuted, textAlign: 'center', paddingVertical: 16 },

    // Analysis tab
    metricsRow: { flexDirection: 'row', gap: 12, paddingVertical: 8, paddingHorizontal: 4, marginBottom: 12 },
    metricCard: { width: wp(42), backgroundColor: tc.cardBackground, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: tc.borderColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    metricCardText: { flex: 1 },
    metricLabel: { fontSize: 11, color: tc.textMuted, fontWeight: '600', marginBottom: 4 },
    metricValue: { fontSize: 22, fontWeight: '800', color: tc.textPrimary },
    metricSub: { fontSize: 10, color: tc.textMuted, marginTop: 2 },
    clusterCard: { backgroundColor: tc.cardBackground, borderRadius: 8, padding: 12, borderLeftWidth: 4, borderLeftColor: tc.accent, borderWidth: 1, borderColor: tc.borderColor, marginBottom: 8 },
    clusterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    clusterName: { fontSize: 14, fontWeight: '600', color: tc.textPrimary },
    severityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    severeSeverity: { backgroundColor: '#FEE2E2' },
    modSeverity: { backgroundColor: '#FEF9C3' },
    mildSeverity: { backgroundColor: '#DCFCE7' },
    severityText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
    clusterSymptoms: { fontSize: 12, color: tc.textSecondary, lineHeight: 17 },
    clusterDuration: { fontSize: 11, color: tc.textMuted, marginTop: 4 },
    diagCard: { backgroundColor: tc.cardBackground, borderRadius: 8, padding: 12, borderWidth: 1, borderColor: tc.borderColor, marginBottom: 8 },
    diagHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    diagName: { fontSize: 14, fontWeight: '600', color: tc.textPrimary },
    diagCode: { fontSize: 11, color: tc.textMuted },
    confBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    confHigh: { backgroundColor: '#DCFCE7' },
    confMed: { backgroundColor: '#FEF9C3' },
    confLow: { backgroundColor: '#FEE2E2' },
    confBadgeText: { fontSize: 10, fontWeight: '700' },
    diagReasoning: { fontSize: 12, color: tc.textSecondary, lineHeight: 17 },
    gapCard: { backgroundColor: tc.cardBackground, borderRadius: 8, padding: 12, borderLeftWidth: 4, borderLeftColor: '#F59E0B', borderWidth: 1, borderColor: tc.borderColor, marginBottom: 8 },
    gapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    gapName: { fontSize: 14, fontWeight: '600', color: tc.textPrimary },
    gapInfo: { fontSize: 12, color: tc.textSecondary, lineHeight: 17, marginTop: 2 },
    recommendBox: { backgroundColor: tc.cardBackground, borderRadius: 8, padding: 12, borderWidth: 1, borderColor: tc.borderColor, marginTop: 4 },
    recommendTitle: { fontSize: 14, fontWeight: '700', color: tc.textPrimary, marginBottom: 8 },
    recommendItem: { fontSize: 12, color: tc.textSecondary, lineHeight: 18, marginBottom: 2 },

    // Literature tab
    litItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: tc.cardBackground, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: tc.borderColor, marginBottom: 10 },
    litLeft: { flex: 1 },
    litHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    litTitle: { fontSize: 14, fontWeight: '700', color: tc.textPrimary, marginLeft: 8, flex: 1 },
    litSource: { fontSize: 12, color: tc.textMuted, marginLeft: 22, marginBottom: 4 },
    litAccRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 22, gap: 4 },
    litAccText: { fontSize: 12, color: tc.textMuted, fontWeight: '600' },
});

export default InterviewCoachTool;
