import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    LayoutAnimation,
    Platform,
    UIManager,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { GetPatientVisits } from '../../../Services/Visit.Service';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type SortOrder = 'newest' | 'oldest';
type StatusFilter = 'all' | 'completed' | 'scheduled' | 'cancelled';

const StatusBadge = ({ status, t, ds, isDark }: { status: string; t: any; ds: any; isDark: boolean }) => {
    const lower = status?.toLowerCase() || '';
    const isScheduled = lower === 'scheduled';
    const isCompleted = lower === 'completed' || lower === 'zakończona';
    const isCancelled = lower === 'cancelled' || lower === 'anulowana';

    let badgeStyle = ds.statusBadge;
    let textStyle = ds.statusText;

    if (isScheduled) {
        badgeStyle = [ds.statusBadge, ds.scheduledBadge];
        textStyle = [ds.statusText, ds.scheduledText];
    } else if (isCompleted) {
        badgeStyle = [ds.statusBadge, ds.completedBadge];
        textStyle = [ds.statusText, ds.completedText];
    } else if (isCancelled) {
        badgeStyle = [ds.statusBadge, ds.cancelledBadge];
        textStyle = [ds.statusText, ds.cancelledText];
    }

    return (
        <View style={badgeStyle}>
            <Text style={textStyle}>
                {t(`visitList.${lower.replace(/\s+/g, '') || 'noData'}`, { defaultValue: status })}
            </Text>
        </View>
    );
};

const VisitList = ({ patientData }: { patientData: any }) => {
    const { t, i18n } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    const [visitsData, setVisitsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(true);
    const [expandedVisitId, setExpandedVisitId] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    const formatTime = (start: string, end: string) => {
        if (!start || !end) return t('visitList.noData');
        return `${start} - ${end}`;
    };

    const formatDate = useCallback((dateString: string) => {
        if (!dateString) return t('visitList.noData');
        const date = new Date(dateString);
        return date.toLocaleDateString(i18n.language === 'pl' ? 'pl-PL' : 'en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }, [i18n.language, t]);

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const patientId = patientData?.id || patientData?._id;
                if (!patientId) {
                    setLoading(false);
                    return;
                }
                const response: any = await GetPatientVisits(patientId);
                if (response) {
                    setVisitsData(response);
                }
            } catch (error) {
                console.log('Fetch visits list error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVisits();
    }, [patientData]);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const toggleVisitExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedVisitId(expandedVisitId === id ? null : id);
    };

    const toggleSort = () => {
        setSortOrder(prev => (prev === 'newest' ? 'oldest' : 'newest'));
    };

    const filteredAndSortedVisits = useMemo(() => {
        let visits = visitsData?.visits || [];

        if (statusFilter !== 'all') {
            visits = visits.filter((v: any) => {
                const status = (v.status || '').toLowerCase();
                if (statusFilter === 'completed') return status === 'completed' || status === 'zakończona';
                if (statusFilter === 'scheduled') return status === 'scheduled';
                if (statusFilter === 'cancelled') return status === 'cancelled' || status === 'anulowana';
                return true;
            });
        }

        if (searchText.trim()) {
            const query = searchText.toLowerCase();
            visits = visits.filter((v: any) => {
                const date = formatDate(v.date).toLowerCase();
                const doctor = (v.doctor?.name || '').toLowerCase();
                const type = (v.visitType || '').toLowerCase();
                const notes = (v.notes || v.note || '').toLowerCase();
                return date.includes(query) || doctor.includes(query) || type.includes(query) || notes.includes(query);
            });
        }

        const sorted = [...visits].sort((a: any, b: any) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return sorted;
    }, [visitsData, statusFilter, searchText, sortOrder, formatDate]);

    const statusFilters: { key: StatusFilter; label: string }[] = [
        { key: 'all', label: t('visitList.filterAll') },
        { key: 'completed', label: t('visitList.filterCompleted') },
        { key: 'scheduled', label: t('visitList.filterScheduled') },
        { key: 'cancelled', label: t('visitList.filterCancelled') },
    ];

    if (loading) {
        return (
            <View style={{ flex: 1, paddingVertical: 40, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={tc.accent} />
                <Text style={{ marginTop: 15, color: tc.textSecondary }}>{t('visitList.fetchingVisitHistory')}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={ds.container} showsVerticalScrollIndicator={false}>
            <View style={ds.card}>
                <TouchableOpacity
                    style={[ds.header, expanded && ds.expandedHeader]}
                    onPress={toggleExpand}
                    activeOpacity={0.7}
                >
                    <View style={ds.headerLeft}>
                        <Feather name="calendar" size={18} color={tc.accent} style={ds.icon} />
                        <Text style={ds.title}>{t('visitList.visitHistory')}</Text>
                    </View>
                    <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={tc.textMuted} />
                </TouchableOpacity>

                {expanded && (
                    <View style={ds.content}>
                        {/* Search & Filter Bar */}
                        <View style={ds.filterBar}>
                            <View style={ds.searchBar}>
                                <Feather name="search" size={16} color={tc.textMuted} />
                                <TextInput
                                    style={ds.searchInput}
                                    placeholder={t('visitList.searchPlaceholder')}
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholderTextColor={tc.textMuted}
                                />
                                {searchText.length > 0 && (
                                    <TouchableOpacity onPress={() => setSearchText('')}>
                                        <Feather name="x" size={14} color={tc.textMuted} />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <TouchableOpacity style={ds.sortButton} onPress={toggleSort}>
                                <Feather
                                    name={sortOrder === 'newest' ? 'arrow-down' : 'arrow-up'}
                                    size={14}
                                    color={tc.accent}
                                />
                                <Text style={ds.sortText}>
                                    {sortOrder === 'newest' ? t('visitList.sortNewest') : t('visitList.sortOldest')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Status Filter Pills */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={ds.filtersRow}>
                            {statusFilters.map(f => (
                                <TouchableOpacity
                                    key={f.key}
                                    style={[ds.filterPill, statusFilter === f.key && ds.filterPillActive]}
                                    onPress={() => setStatusFilter(f.key)}
                                >
                                    <Text style={[ds.filterPillText, statusFilter === f.key && ds.filterPillTextActive]}>
                                        {f.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Header with count */}
                        <View style={ds.sectionHeaderRow}>
                            <Text style={ds.subHeader}>{t('visitList.visitHistory')}</Text>
                            <Text style={ds.totalText}>
                                {t('visitList.totalVisits', { count: filteredAndSortedVisits.length })}
                                {statusFilter !== 'all' && ` / ${visitsData?.total || visitsData?.visits?.length || 0}`}
                            </Text>
                        </View>

                        {filteredAndSortedVisits.length > 0 ? (
                            filteredAndSortedVisits.map((visit: any) => {
                                const visitId = visit.id || visit._id;
                                const isExpanded = expandedVisitId === visitId;

                                return (
                                    <View key={visitId} style={[ds.visitItemCard, isExpanded && ds.visitItemCardExpanded]}>
                                        <TouchableOpacity
                                            style={[ds.visitSummary, isExpanded && ds.visitSummaryExpanded]}
                                            onPress={() => toggleVisitExpand(visitId)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={ds.visitDetailsRow}>
                                                <View style={ds.calendarIconContainer}>
                                                    <Feather name="calendar" size={18} color={tc.accent} />
                                                </View>
                                                <View style={ds.visitBasicInfo}>
                                                    <Text style={ds.visitDateText}>{formatDate(visit.date)}</Text>
                                                    <Text style={ds.visitTypeText}>
                                                        {visit.visitType
                                                            ? t(`visitList.${visit.visitType.toLowerCase()}`, { defaultValue: visit.visitType })
                                                            : t('visitList.regular')}
                                                    </Text>
                                                    <Text style={ds.visitTimeText}>
                                                        {formatTime(visit.startTime, visit.endTime)}
                                                    </Text>
                                                </View>
                                                <View style={ds.visitRightSection}>
                                                    <StatusBadge status={visit.status} t={t} ds={ds} isDark={isDark} />
                                                    <Feather
                                                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                                        size={18}
                                                        color={tc.textMuted}
                                                        style={{ marginLeft: 8 }}
                                                    />
                                                </View>
                                            </View>
                                        </TouchableOpacity>

                                        {isExpanded && (
                                            <View style={ds.visitExpandedContent}>
                                                {/* Doctor */}
                                                <View style={ds.sectionBlock}>
                                                    <View style={ds.infoRow}>
                                                        <Feather name="user" size={14} color={tc.textSecondary} />
                                                        <Text style={ds.infoLabel}>{t('visitList.doctor')}</Text>
                                                    </View>
                                                    <Text style={ds.infoValue}>
                                                        {visit.doctor?.name || t('visitList.noData')}
                                                    </Text>
                                                </View>

                                                {/* Notes */}
                                                {(visit.notes || visit.note) && (
                                                    <View style={ds.sectionBlock}>
                                                        <View style={ds.infoRow}>
                                                            <Feather name="file-text" size={14} color={tc.textSecondary} />
                                                            <Text style={ds.infoLabel}>{t('visitList.notes')}</Text>
                                                        </View>
                                                        <Text style={ds.infoValue}>{visit.notes || visit.note}</Text>
                                                    </View>
                                                )}

                                                {/* Medical Interview */}
                                                <View style={ds.sectionBlock}>
                                                    <View style={ds.infoRow}>
                                                        <Feather name="file-text" size={14} color={tc.textSecondary} />
                                                        <Text style={ds.infoLabel}>{t('visitList.medicalInterview')}</Text>
                                                    </View>

                                                    <View style={ds.subInfoSection}>
                                                        <Text style={ds.subInfoLabel}>{t('visitList.mainSymptoms')}</Text>
                                                        <Text style={ds.subInfoValue}>
                                                            {visit.interview?.mainSymptoms || visit.mainSymptoms || t('visitList.noData')}
                                                        </Text>

                                                        {/* Current Medications */}
                                                        {visit.interview?.currentMedications && visit.interview.currentMedications.length > 0 && (
                                                            <>
                                                                <Text style={[ds.subInfoLabel, { marginTop: 10 }]}>
                                                                    {t('visitList.currentMedications')}
                                                                </Text>
                                                                {visit.interview.currentMedications.map((med: string, idx: number) => (
                                                                    <View key={idx} style={ds.medicationRow}>
                                                                        <View style={ds.bulletDot} />
                                                                        <Text style={ds.subInfoValue}>{med}</Text>
                                                                    </View>
                                                                ))}
                                                            </>
                                                        )}

                                                        {/* Additional Notes */}
                                                        {visit.interview?.additionalNotes && (
                                                            <>
                                                                <Text style={[ds.subInfoLabel, { marginTop: 10 }]}>
                                                                    {t('visitList.additionalNotes')}
                                                                </Text>
                                                                <Text style={ds.subInfoValue}>{visit.interview.additionalNotes}</Text>
                                                            </>
                                                        )}

                                                        {/* Psychiatric Scales */}
                                                        {visit.interview?.psychiatricScales && (
                                                            <>
                                                                <View style={[ds.infoRow, { marginTop: 12 }]}>
                                                                    <MaterialCommunityIcons name="brain" size={14} color={tc.textSecondary} />
                                                                    <Text style={ds.infoLabel}>{t('visitList.psychiatricScales')}</Text>
                                                                </View>
                                                                <View style={ds.scalesGrid}>
                                                                    {Object.entries(visit.interview.psychiatricScales).map(
                                                                        ([scale, value]) =>
                                                                            value !== null && value !== undefined ? (
                                                                                <View key={scale} style={ds.scaleItem}>
                                                                                    <Text style={ds.scaleLabel}>{scale.toUpperCase()}</Text>
                                                                                    <Text style={ds.scaleValue}>{String(value)}</Text>
                                                                                </View>
                                                                            ) : null
                                                                    )}
                                                                </View>
                                                            </>
                                                        )}
                                                    </View>
                                                </View>

                                                {/* Examination */}
                                                <View style={ds.sectionBlock}>
                                                    <View style={ds.infoRow}>
                                                        <Feather name="activity" size={14} color={tc.textSecondary} />
                                                        <Text style={ds.infoLabel}>{t('visitList.examination')}</Text>
                                                    </View>
                                                    <View style={ds.examGrid}>
                                                        <View style={ds.examRow}>
                                                            <View style={ds.examItem}>
                                                                <Text style={ds.examLabel}>
                                                                    {t('visitList.bloodPressure')}:
                                                                </Text>
                                                                <Text style={ds.examValue}>
                                                                    {visit.examination?.bloodPressure || t('visitList.noData')}
                                                                </Text>
                                                            </View>
                                                            <View style={ds.examItem}>
                                                                <Text style={ds.examLabel}>
                                                                    {t('visitList.generalCondition')}:
                                                                </Text>
                                                                <Text style={ds.examValue}>
                                                                    {visit.examination?.generalCondition || t('visitList.noData')}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View style={ds.examRow}>
                                                            <View style={ds.examItem}>
                                                                <Text style={ds.examLabel}>
                                                                    {t('visitList.heartRate')}:
                                                                </Text>
                                                                <Text style={ds.examValue}>
                                                                    {visit.examination?.heartRate || t('visitList.noData')}
                                                                </Text>
                                                            </View>
                                                            <View style={ds.examItem}>
                                                                <Text style={ds.examLabel}>
                                                                    {t('visitList.temperature')}:
                                                                </Text>
                                                                <Text style={ds.examValue}>
                                                                    {visit.examination?.temperature || t('visitList.noData')}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        {visit.examination?.additionalFindings && (
                                                            <View style={ds.examRow}>
                                                                <View style={[ds.examItem, { flex: 1 }]}>
                                                                    <Text style={ds.examLabel}>
                                                                        {t('visitList.additionalFindings')}:
                                                                    </Text>
                                                                    <Text style={ds.examValue}>
                                                                        {visit.examination.additionalFindings}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        )}
                                                    </View>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                );
                            })
                        ) : (
                            <View style={ds.emptyContainer}>
                                <Feather name="calendar" size={40} color={tc.borderColor} />
                                <Text style={ds.emptyText}>{t('visitList.noVisits')}</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: 16,
        },
        card: {
            backgroundColor: tc.cardBackground,
            borderRadius: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: tc.borderColor,
            overflow: 'hidden',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
        },
        expandedHeader: {
            borderBottomWidth: 1,
            borderBottomColor: tc.borderColor,
        },
        headerLeft: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        icon: {
            marginRight: 10,
        },
        title: {
            fontSize: 13,
            fontWeight: '700',
            color: tc.textPrimary,
            letterSpacing: 0.5,
        },
        content: {
            padding: 16,
        },
        filterBar: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
            gap: 8,
        },
        searchBar: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: tc.inputBackground,
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 10,
            height: 36,
        },
        searchInput: {
            flex: 1,
            marginLeft: 6,
            fontSize: 12,
            color: tc.textPrimary,
            padding: 0,
        },
        sortButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: tc.cardBackground,
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 10,
            height: 36,
        },
        sortText: {
            fontSize: 11,
            fontWeight: '600',
            color: tc.accent,
            marginLeft: 4,
        },
        filtersRow: {
            marginBottom: 16,
            maxHeight: 36,
        },
        filterPill: {
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 16,
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
            marginRight: 8,
            borderWidth: 1,
            borderColor: 'transparent',
        },
        filterPillActive: {
            backgroundColor: isDark ? 'rgba(88, 167, 179, 0.2)' : '#E2F2F4',
            borderColor: tc.accent,
        },
        filterPillText: {
            fontSize: 12,
            fontWeight: '600',
            color: tc.textMuted,
        },
        filterPillTextActive: {
            color: tc.accent,
        },
        sectionHeaderRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        subHeader: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textPrimary,
        },
        totalText: {
            fontSize: 13,
            color: tc.textMuted,
        },
        emptyContainer: {
            alignItems: 'center',
            paddingVertical: 40,
        },
        emptyText: {
            fontSize: 14,
            color: tc.textMuted,
            marginTop: 12,
        },
        visitItemCard: {
            backgroundColor: tc.cardBackgroundAlt || (isDark ? 'rgba(255,255,255,0.03)' : '#fdfdfd'),
            borderRadius: 10,
            borderWidth: 1,
            borderColor: tc.borderColor,
            marginBottom: 12,
            overflow: 'hidden',
        },
        visitItemCardExpanded: {
            borderLeftWidth: 3,
            borderLeftColor: tc.accent,
        },
        visitSummary: {
            padding: 16,
        },
        visitSummaryExpanded: {
            borderBottomWidth: 1,
            borderBottomColor: tc.borderColor,
        },
        visitDetailsRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        calendarIconContainer: {
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f0f9fb',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        visitBasicInfo: {
            flex: 1,
        },
        visitDateText: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        visitTypeText: {
            fontSize: 12,
            color: tc.textSecondary,
            marginTop: 2,
        },
        visitTimeText: {
            fontSize: 11,
            color: tc.textMuted,
            marginTop: 1,
        },
        visitRightSection: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        statusBadge: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
        },
        statusText: {
            fontSize: 11,
            fontWeight: '600',
            color: tc.textSecondary,
            textTransform: 'lowercase',
        },
        scheduledBadge: {
            backgroundColor: isDark ? 'rgba(2, 132, 199, 0.2)' : '#e0f2fe',
        },
        scheduledText: {
            color: isDark ? '#38bdf8' : '#0284c7',
        },
        completedBadge: {
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#DCFCE7',
        },
        completedText: {
            color: isDark ? '#34d399' : '#166534',
        },
        cancelledBadge: {
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2',
        },
        cancelledText: {
            color: isDark ? '#f87171' : '#991b1b',
        },
        visitExpandedContent: {
            padding: 16,
            backgroundColor: tc.cardBackground,
        },
        sectionBlock: {
            marginBottom: 16,
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
        },
        infoLabel: {
            fontSize: 13,
            fontWeight: '600',
            color: tc.textSecondary,
            marginLeft: 6,
        },
        infoValue: {
            fontSize: 14,
            color: tc.textPrimary,
            marginLeft: 20,
            marginBottom: 4,
            lineHeight: 20,
        },
        subInfoSection: {
            marginLeft: 20,
        },
        subInfoLabel: {
            fontSize: 13,
            fontWeight: '700',
            color: tc.textPrimary,
            marginTop: 4,
        },
        subInfoValue: {
            fontSize: 13,
            color: tc.textSecondary,
            marginTop: 2,
            lineHeight: 18,
        },
        medicationRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: 4,
            paddingLeft: 4,
        },
        bulletDot: {
            width: 5,
            height: 5,
            borderRadius: 3,
            backgroundColor: tc.textMuted,
            marginTop: 6,
            marginRight: 8,
        },
        scalesGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 8,
            marginLeft: 20,
            gap: 8,
        },
        scaleItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: tc.borderColor,
        },
        scaleLabel: {
            fontSize: 12,
            fontWeight: '700',
            color: tc.textPrimary,
            marginRight: 6,
        },
        scaleValue: {
            fontSize: 12,
            color: tc.textSecondary,
        },
        examGrid: {
            marginLeft: 20,
            marginTop: 4,
        },
        examRow: {
            flexDirection: 'row',
            marginBottom: 6,
        },
        examItem: {
            flex: 1,
        },
        examLabel: {
            fontSize: 13,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        examValue: {
            fontWeight: '400',
            color: tc.textSecondary,
            fontSize: 13,
            marginTop: 2,
        },
    });

export default VisitList;
