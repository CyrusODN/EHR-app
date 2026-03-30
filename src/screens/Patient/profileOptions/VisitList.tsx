import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView,
    LayoutAnimation,
    Platform,
    UIManager,
    ActivityIndicator
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { GetPatientVisits } from '../../../Services/Visit.Service';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useMemo } from 'react';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}



 

const StatusBadge = ({ status, t, ds, tc }: { status: string, t: any, ds: any, tc: any }) => {
    const isScheduled = status?.toLowerCase() === 'scheduled';
    const isCompleted = status?.toLowerCase() === 'completed' || status?.toLowerCase() === 'zakończona';
    
    let badgeStyle = ds.statusBadge;
    let textStyle = ds.statusText;
    
    if (isScheduled) {
        badgeStyle = [ds.statusBadge, ds.scheduledBadge];
        textStyle = [ds.statusText, ds.scheduledText];
    } else if (isCompleted) {
        badgeStyle = [ds.statusBadge, ds.completedBadge];
        textStyle = [ds.statusText, ds.completedText];
    }

    return (
        <View style={badgeStyle}>
            <Text style={textStyle}>
                {t(`visitList.${status?.toLowerCase()?.replace(/\s+/g, '') || 'noData'}`, { defaultValue: status })}
            </Text>
        </View>
    );
};

const VisitList = ({ patientData }: { patientData: any }) => {
    const { t, i18n } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);
    const commonProps = { ds, tc };
    
    const [visitsData, setVisitsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(true);
    const [expandedVisitId, setExpandedVisitId] = useState<string | null>(null);
 
    const formatTime = (start: string, end: string) => {
        if (!start || !end) return t('visitList.noData');
        return `${start} - ${end}`;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return t('visitList.noData');
        const date = new Date(dateString);
        return date.toLocaleDateString(i18n.language === 'pl' ? 'pl-PL' : 'en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    React.useEffect(() => {
        const fetchVisits = async () => {
            try {
                const patientId = patientData?.id || patientData?._id;
                if (!patientId) {
                    setLoading(false);
                    return;
                }
                // Fetch visits for this specific patient
                const response: any = await GetPatientVisits(patientId);
                if (response) {
                    setVisitsData(response);
                }
            } catch (error) {
                console.log("Fetch visits list error:", error);
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
                    <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color={tc.textMuted} />
                </TouchableOpacity>

                {expanded && (
                    <View style={ds.content}>
                        <View style={ds.sectionHeaderRow}>
                            <Text style={ds.subHeader}>{t('visitList.visitHistory')}</Text>
                            <Text style={ds.totalText}>{t('visitList.totalVisits', { count: visitsData?.total || 0 })}</Text>
                        </View>
                        
                        {visitsData?.visits?.length > 0 ? (
                            visitsData.visits.map((visit: any) => (
                                <View key={visit.id || visit._id} style={ds.visitItemCard}>
                                    <TouchableOpacity 
                                        style={ds.visitSummary} 
                                        onPress={() => toggleVisitExpand(visit.id || visit._id)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={ds.visitDetailsRow}>
                                            <View style={ds.calendarIconContainer}>
                                                <Feather name="calendar" size={18} color={tc.accent} />
                                            </View>
                                            <View style={ds.visitBasicInfo}>
                                                <Text style={ds.visitDateText}>{formatDate(visit.date)}</Text>
                                                <Text style={ds.visitTypeText}>
                                                    {visit.visitType ? t(`visitList.${visit.visitType.toLowerCase()}`, { defaultValue: visit.visitType }) : t('visitList.regular')}
                                                </Text>
                                                <Text style={ds.visitTimeText}>{formatTime(visit.startTime, visit.endTime)}</Text>
                                            </View>
                                            <View style={ds.visitRightSection}>
                                                <StatusBadge {...commonProps} status={visit.status} t={t} />
                                                <Feather 
                                                    name={expandedVisitId === (visit.id || visit._id) ? "chevron-up" : "chevron-down"} 
                                                    size={18} 
                                                    color={tc.textMuted} 
                                                    style={{ marginLeft: 8 }}
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                    {expandedVisitId === (visit.id || visit._id) && (
                                        <View style={ds.visitExpandedContent}>
                                            <View style={ds.infoRow}>
                                                <Feather name="user" size={14} color={tc.textSecondary} />
                                                <Text style={ds.infoLabel}>{t('visitList.doctor')}</Text>
                                            </View>
                                            <Text style={ds.infoValue}>{visit.doctor?.name || t('visitList.noData')}</Text>
 
                                            <View style={ds.infoRow}>
                                                <Feather name="file-text" size={14} color={tc.textSecondary} />
                                                <Text style={ds.infoLabel}>{t('visitList.notes')}</Text>
                                            </View>
                                            <Text style={ds.infoValue}>{visit.notes || t('visitList.noNotes')}</Text>

                                            <View style={ds.infoRow}>
                                                <Feather name="file-text" size={14} color={tc.textSecondary} />
                                                <Text style={ds.infoLabel}>{t('visitList.medicalInterview')}</Text>
                                            </View>
                                            <View style={ds.subInfoSection}>
                                                <Text style={ds.subInfoLabel}>{t('visitList.mainSymptoms')}</Text>
                                                <Text style={ds.subInfoValue}>{t('visitList.noData')}</Text>
                                                
                                                <View style={ds.infoRowSmall}>
                                                    <Feather name="brain" size={14} color={tc.textSecondary} />
                                                    <Text style={ds.infoLabel}>{t('visitList.psychiatricScales')}</Text>
                                                </View>
                                            </View>

                                            <View style={ds.infoRow}>
                                                <Feather name="activity" size={14} color={tc.textSecondary} />
                                                <Text style={ds.infoLabel}>{t('visitList.examination')}</Text>
                                            </View>
                                            <View style={ds.examGrid}>
                                                <View style={ds.examItem}>
                                                    <Text style={ds.examLabel}>{t('visitList.bloodPressure')}: <Text style={ds.examValue}>{t('visitList.noData')}</Text></Text>
                                                </View>
                                                <View style={ds.examItem}>
                                                    <Text style={ds.examLabel}>{t('visitList.generalCondition')}: <Text style={ds.examValue}>{t('visitList.noData')}</Text></Text>
                                                </View>
                                                <View style={ds.examItem}>
                                                    <Text style={ds.examLabel}>{t('visitList.heartRate')}: <Text style={ds.examValue}>{t('visitList.noData')}</Text></Text>
                                                </View>
                                                <View style={ds.examItem}>
                                                    <Text style={ds.examLabel}>{t('visitList.temperature')}: <Text style={ds.examValue}>{t('visitList.noData')}</Text></Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            ))
                        ) : (
                            <View style={ds.emptyContainer}>
                                <Text style={ds.emptyText}>{t('visitList.noVisits')}</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
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
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
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
        paddingVertical: 20,
    },
    emptyText: {
        fontSize: 14,
        color: tc.textMuted,
    },
    visitItemCard: {
        backgroundColor: tc.cardBackgroundAlt || (isDark ? 'rgba(255,255,255,0.03)' : '#fdfdfd'),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: tc.borderColor,
        marginBottom: 12,
        overflow: 'hidden',
    },
    visitSummary: {
        padding: 16,
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
    visitExpandedContent: {
        padding: 16,
        paddingTop: 0,
        borderTopWidth: 1,
        borderTopColor: tc.borderColor,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 4,
    },
    infoRowSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: tc.textSecondary,
        marginLeft: 6,
    },
    infoValue: {
        fontSize: 14,
        color: tc.textPrimary,
        marginLeft: 20,
        marginBottom: 4,
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
    },
    examGrid: {
        marginLeft: 20,
        marginTop: 4,
    },
    examItem: {
        marginBottom: 4,
    },
    examLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    examValue: {
        fontWeight: '400',
        color: tc.textSecondary,
    }
});

export default VisitList;
