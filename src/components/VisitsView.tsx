import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../hooks/useThemeColors';
import { GetPatientVisits, GetPreviousVisits } from '../Services/Visit.Service';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Visit {
    id: string;
    date: string;
    startTime?: string;
    endTime?: string;
    patient?: { id: string; name: string };
    doctor?: { id: string; name: string };
    visitType?: string;
    status?: string;
    notes?: string;
    note?: string;
    interview?: {
        mainSymptoms?: string;
        currentMedications?: string[];
        additionalNotes?: string;
        psychiatricScales?: Record<string, number>;
    };
    examination?: {
        bloodPressure?: string;
        heartRate?: string;
        temperature?: string;
        generalCondition?: string;
        additionalFindings?: string;
    };
}

interface VisitsViewProps {
    patientId: string;
    mode?: 'all' | 'history';
    excludeCurrentVisit?: boolean;
    currentVisitId?: string;
    maxHeight?: number;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    completed: { bg: '#D1FAE5', text: '#065F46' },
    scheduled: { bg: '#DBEAFE', text: '#1E40AF' },
    cancelled: { bg: '#FEE2E2', text: '#991B1B' },
    'in-progress': { bg: '#FEF3C7', text: '#92400E' },
};

const SCALE_NAMES: Record<string, string> = {
    hamd: 'HAM-D',
    madrs: 'MADRS',
    asrs: 'ASRS',
    hama: 'HAM-A',
    isi: 'ISI',
    cars2: 'CARS-2',
};

const VisitsView = ({ patientId, mode = 'all', excludeCurrentVisit = false, currentVisitId, maxHeight }: VisitsViewProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    const [visits, setVisits] = useState<Visit[]>([]);
    const [expandedVisits, setExpandedVisits] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchVisits();
    }, [patientId, mode]);

    const fetchVisits = async () => {
        if (!patientId) return;
        setLoading(true);
        setError(null);

        try {
            let response;
            if (mode === 'history' && currentVisitId) {
                response = await GetPreviousVisits(currentVisitId);
                const data = response?.data || response;
                setVisits(data?.previousVisits || []);
            } else {
                response = await GetPatientVisits(patientId);
                const data = response?.data || response;
                const allVisits = data?.visits || (Array.isArray(data) ? data : []);
                const filtered = excludeCurrentVisit && currentVisitId
                    ? allVisits.filter((v: Visit) => v.id !== currentVisitId)
                    : allVisits;
                setVisits(filtered.sort((a: Visit, b: Visit) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                ));
            }
        } catch (e: any) {
            setError(e.message || t('visitsView.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = useCallback((visitId: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedVisits(prev =>
            prev.includes(visitId)
                ? prev.filter(id => id !== visitId)
                : [...prev, visitId]
        );
    }, []);

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
        } catch { return dateStr; }
    };

    if (loading) {
        return (
            <View style={ds.loadingContainer}>
                <ActivityIndicator size="large" color={tc.accent} />
                <Text style={ds.loadingText}>{t('visitsView.loading')}</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={ds.errorContainer}>
                <Feather name="alert-circle" size={24} color="#EF4444" />
                <Text style={ds.errorText}>{error}</Text>
                <TouchableOpacity style={ds.retryBtn} onPress={fetchVisits}>
                    <Text style={ds.retryText}>{t('visitsView.retry')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (visits.length === 0) {
        return (
            <View style={ds.emptyContainer}>
                <MaterialCommunityIcons name="calendar-blank" size={36} color={tc.textMuted} />
                <Text style={ds.emptyText}>{t('visitsView.noVisits')}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[ds.container, maxHeight ? { maxHeight } : {}]} nestedScrollEnabled showsVerticalScrollIndicator={false}>
            <View style={ds.headerRow}>
                <Text style={ds.title}>{t('visitsView.title')}</Text>
                <Text style={ds.countBadge}>{visits.length} {t('common.total')}</Text>
            </View>

            {visits.map(visit => {
                const isExpanded = expandedVisits.includes(visit.id);
                const statusStyle = STATUS_COLORS[visit.status || 'completed'] || STATUS_COLORS.completed;

                return (
                    <TouchableOpacity
                        key={visit.id}
                        style={ds.visitCard}
                        onPress={() => toggleExpand(visit.id)}
                        activeOpacity={0.8}
                    >
                        <View style={ds.visitHeader}>
                            <View style={ds.visitHeaderLeft}>
                                <View style={ds.dateContainer}>
                                    <Feather name="calendar" size={14} color={tc.accent} />
                                    <Text style={ds.dateText}>{formatDate(visit.date)}</Text>
                                </View>
                                {visit.startTime && (
                                    <View style={ds.timeContainer}>
                                        <Feather name="clock" size={12} color={tc.textMuted} />
                                        <Text style={ds.timeText}>{visit.startTime} - {visit.endTime}</Text>
                                    </View>
                                )}
                            </View>
                            <View style={ds.visitHeaderRight}>
                                {visit.status && (
                                    <View style={[ds.statusBadge, { backgroundColor: isDark ? statusStyle.text + '20' : statusStyle.bg }]}>
                                        <Text style={[ds.statusText, { color: statusStyle.text }]}>
                                            {t(`visitsView.status.${visit.status}`, { defaultValue: visit.status })}
                                        </Text>
                                    </View>
                                )}
                                <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={tc.textMuted} />
                            </View>
                        </View>

                        {visit.visitType && (
                            <Text style={ds.visitType}>{visit.visitType}</Text>
                        )}

                        {visit.doctor && (
                            <View style={ds.doctorRow}>
                                <Feather name="user" size={12} color={tc.textMuted} />
                                <Text style={ds.doctorText}>{visit.doctor.name}</Text>
                            </View>
                        )}

                        {isExpanded && (
                            <View style={ds.expandedContent}>
                                {/* Notes */}
                                {(visit.notes || visit.note) && (
                                    <View style={ds.expandedSection}>
                                        <Text style={ds.expandedLabel}>{t('visitsView.notes')}</Text>
                                        <Text style={ds.expandedText}>{visit.notes || visit.note}</Text>
                                    </View>
                                )}

                                {/* Interview */}
                                {visit.interview && (
                                    <View style={ds.expandedSection}>
                                        <Text style={ds.expandedLabel}>{t('visitsView.interview')}</Text>
                                        {visit.interview.mainSymptoms && (
                                            <View style={ds.detailRow}>
                                                <Text style={ds.detailLabel}>{t('visitsView.mainSymptoms')}:</Text>
                                                <Text style={ds.detailText}>{visit.interview.mainSymptoms}</Text>
                                            </View>
                                        )}
                                        {visit.interview.currentMedications && visit.interview.currentMedications.length > 0 && (
                                            <View style={ds.detailRow}>
                                                <Text style={ds.detailLabel}>{t('visitsView.medications')}:</Text>
                                                <Text style={ds.detailText}>{visit.interview.currentMedications.join(', ')}</Text>
                                            </View>
                                        )}

                                        {/* Psychiatric Scales */}
                                        {visit.interview.psychiatricScales && Object.keys(visit.interview.psychiatricScales).some(k => visit.interview!.psychiatricScales![k]) && (
                                            <View style={ds.scalesGrid}>
                                                {Object.entries(visit.interview.psychiatricScales)
                                                    .filter(([_, v]) => v > 0)
                                                    .map(([key, value]) => (
                                                        <View key={key} style={ds.scaleChip}>
                                                            <Text style={ds.scaleLabel}>{SCALE_NAMES[key] || key}</Text>
                                                            <Text style={ds.scaleValue}>{value}</Text>
                                                        </View>
                                                    ))
                                                }
                                            </View>
                                        )}
                                    </View>
                                )}

                                {/* Examination */}
                                {visit.examination && (
                                    <View style={ds.expandedSection}>
                                        <Text style={ds.expandedLabel}>{t('visitsView.examination')}</Text>
                                        <View style={ds.examGrid}>
                                            {visit.examination.bloodPressure && (
                                                <View style={ds.examItem}>
                                                    <MaterialCommunityIcons name="heart-pulse" size={14} color={tc.accent} />
                                                    <Text style={ds.examLabel}>BP</Text>
                                                    <Text style={ds.examValue}>{visit.examination.bloodPressure}</Text>
                                                </View>
                                            )}
                                            {visit.examination.heartRate && (
                                                <View style={ds.examItem}>
                                                    <Feather name="activity" size={14} color={tc.accent} />
                                                    <Text style={ds.examLabel}>HR</Text>
                                                    <Text style={ds.examValue}>{visit.examination.heartRate}</Text>
                                                </View>
                                            )}
                                            {visit.examination.temperature && (
                                                <View style={ds.examItem}>
                                                    <MaterialCommunityIcons name="thermometer" size={14} color={tc.accent} />
                                                    <Text style={ds.examLabel}>Temp</Text>
                                                    <Text style={ds.examValue}>{visit.examination.temperature}</Text>
                                                </View>
                                            )}
                                        </View>
                                        {visit.examination.generalCondition && (
                                            <View style={ds.detailRow}>
                                                <Text style={ds.detailLabel}>{t('visitsView.generalCondition')}:</Text>
                                                <Text style={ds.detailText}>{visit.examination.generalCondition}</Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        )}
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

export default VisitsView;

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: { paddingHorizontal: 4 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    title: { fontSize: 16, fontWeight: '700', color: tc.textPrimary },
    countBadge: { fontSize: 12, color: tc.textMuted },
    loadingContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' },
    loadingText: { marginTop: 12, fontSize: 13, color: tc.textMuted },
    errorContainer: { padding: 30, alignItems: 'center', gap: 10 },
    errorText: { fontSize: 13, color: '#EF4444', textAlign: 'center' },
    retryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, backgroundColor: tc.accent },
    retryText: { color: '#fff', fontSize: 13, fontWeight: '600' },
    emptyContainer: { padding: 40, alignItems: 'center', gap: 12 },
    emptyText: { fontSize: 14, color: tc.textMuted },
    visitCard: {
        backgroundColor: tc.cardBackground, borderRadius: 12, borderWidth: 1,
        borderColor: tc.borderColor, marginBottom: 10, padding: 14,
    },
    visitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    visitHeaderLeft: { flex: 1 },
    dateContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dateText: { fontSize: 14, fontWeight: '600', color: tc.textPrimary },
    timeContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    timeText: { fontSize: 12, color: tc.textMuted },
    visitHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    statusText: { fontSize: 11, fontWeight: '600' },
    visitType: { fontSize: 12, color: tc.textMuted, marginTop: 6, fontStyle: 'italic' },
    doctorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
    doctorText: { fontSize: 12, color: tc.textMuted },
    expandedContent: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: tc.borderColor },
    expandedSection: { marginBottom: 14 },
    expandedLabel: { fontSize: 13, fontWeight: '700', color: tc.textPrimary, marginBottom: 6 },
    expandedText: { fontSize: 13, color: tc.textSecondary, lineHeight: 18 },
    detailRow: { marginBottom: 6 },
    detailLabel: { fontSize: 12, fontWeight: '600', color: tc.textMuted },
    detailText: { fontSize: 13, color: tc.textSecondary, marginTop: 2, lineHeight: 18 },
    scalesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
    scaleChip: {
        flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10,
        paddingVertical: 4, borderRadius: 6, backgroundColor: isDark ? 'rgba(88,167,179,0.1)' : '#E8F7F9',
    },
    scaleLabel: { fontSize: 11, fontWeight: '600', color: tc.accent },
    scaleValue: { fontSize: 12, fontWeight: '700', color: tc.textPrimary },
    examGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 },
    examItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    examLabel: { fontSize: 11, fontWeight: '600', color: tc.textMuted },
    examValue: { fontSize: 12, fontWeight: '700', color: tc.textPrimary },
});
