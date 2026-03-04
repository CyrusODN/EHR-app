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

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatTime = (start: string, end: string) => {
    if (!start || !end) return 'N/A';
    return `${start} - ${end}`;
};

const StatusBadge = ({ status }: { status: string }) => {
    const isScheduled = status?.toLowerCase() === 'scheduled';
    return (
        <View style={[styles.statusBadge, isScheduled && styles.scheduledBadge]}>
            <Text style={[styles.statusText, isScheduled && styles.scheduledText]}>{status}</Text>
        </View>
    );
};

const VisitList = ({ patientData }: { patientData: any }) => {
    const [visitsData, setVisitsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(true);
    const [expandedVisitId, setExpandedVisitId] = useState<string | null>(null);

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
                <ActivityIndicator size="large" color="#4A90B9" />
                <Text style={{ marginTop: 15, color: '#64748b' }}>Fetching visit history...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
                <TouchableOpacity 
                    style={[styles.header, expanded && styles.expandedHeader]} 
                    onPress={toggleExpand}
                    activeOpacity={0.7}
                >
                    <View style={styles.headerLeft}>
                        <Feather name="calendar" size={18} color="#58a6b8" style={styles.icon} />
                        <Text style={styles.title}>VISIT HISTORY</Text>
                    </View>
                    <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#94a3b8" />
                </TouchableOpacity>

                {expanded && (
                    <View style={styles.content}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.subHeader}>Visit History</Text>
                            <Text style={styles.totalText}>Total visits: {visitsData?.total || 0}</Text>
                        </View>
                        
                        {visitsData?.visits?.length > 0 ? (
                            visitsData.visits.map((visit: any) => (
                                <View key={visit.id || visit._id} style={styles.visitItemCard}>
                                    <TouchableOpacity 
                                        style={styles.visitSummary} 
                                        onPress={() => toggleVisitExpand(visit.id || visit._id)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.visitDetailsRow}>
                                            <View style={styles.calendarIconContainer}>
                                                <Feather name="calendar" size={18} color="#4A90B9" />
                                            </View>
                                            <View style={styles.visitBasicInfo}>
                                                <Text style={styles.visitDateText}>{formatDate(visit.date)}</Text>
                                                <Text style={styles.visitTypeText}>{visit.visitType || 'regular'}</Text>
                                                <Text style={styles.visitTimeText}>{formatTime(visit.startTime, visit.endTime)}</Text>
                                            </View>
                                            <View style={styles.visitRightSection}>
                                                <StatusBadge status={visit.status} />
                                                <Feather 
                                                    name={expandedVisitId === (visit.id || visit._id) ? "chevron-up" : "chevron-down"} 
                                                    size={18} 
                                                    color="#94a3b8" 
                                                    style={{ marginLeft: 8 }}
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                    {expandedVisitId === (visit.id || visit._id) && (
                                        <View style={styles.visitExpandedContent}>
                                            <View style={styles.infoRow}>
                                                <Feather name="user" size={14} color="#64748b" />
                                                <Text style={styles.infoLabel}>Doctor</Text>
                                            </View>
                                            <Text style={styles.infoValue}>{visit.doctor?.name || 'N/A'}</Text>

                                            <View style={styles.infoRow}>
                                                <Feather name="file-text" size={14} color="#64748b" />
                                                <Text style={styles.infoLabel}>Notes</Text>
                                            </View>
                                            <Text style={styles.infoValue}>{visit.notes || 'No notes available'}</Text>

                                            <View style={styles.infoRow}>
                                                <Feather name="file-text" size={14} color="#64748b" />
                                                <Text style={styles.infoLabel}>Medical Interview</Text>
                                            </View>
                                            <View style={styles.subInfoSection}>
                                                <Text style={styles.subInfoLabel}>Main Symptoms</Text>
                                                <Text style={styles.subInfoValue}>No data available</Text>
                                                
                                                <View style={styles.infoRowSmall}>
                                                    <Feather name="brain" size={14} color="#64748b" />
                                                    <Text style={styles.infoLabel}>Psychiatric Scales</Text>
                                                </View>
                                            </View>

                                            <View style={styles.infoRow}>
                                                <Feather name="activity" size={14} color="#64748b" />
                                                <Text style={styles.infoLabel}>Examination</Text>
                                            </View>
                                            <View style={styles.examGrid}>
                                                <View style={styles.examItem}>
                                                    <Text style={styles.examLabel}>Blood Pressure: <Text style={styles.examValue}>No data available</Text></Text>
                                                </View>
                                                <View style={styles.examItem}>
                                                    <Text style={styles.examLabel}>General Condition: <Text style={styles.examValue}>No data available</Text></Text>
                                                </View>
                                                <View style={styles.examItem}>
                                                    <Text style={styles.examLabel}>Heart Rate: <Text style={styles.examValue}>No data available</Text></Text>
                                                </View>
                                                <View style={styles.examItem}>
                                                    <Text style={styles.examLabel}>Temperature: <Text style={styles.examValue}>No data available</Text></Text>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No visits found</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
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
        borderBottomColor: '#f1f5f9',
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
        color: '#1e293b',
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
        color: '#1e293b',
    },
    totalText: {
        fontSize: 13,
        color: '#94a3b8',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    emptyText: {
        fontSize: 14,
        color: '#94a3b8',
    },
    visitItemCard: {
        backgroundColor: '#fdfdfd',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#f1f5f9',
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
        backgroundColor: '#f0f9fb',
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
        color: '#1e293b',
    },
    visitTypeText: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    visitTimeText: {
        fontSize: 11,
        color: '#94a3b8',
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
        backgroundColor: '#f1f5f9',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'lowercase',
    },
    scheduledBadge: {
        backgroundColor: '#e0f2fe',
    },
    scheduledText: {
        color: '#0284c7',
    },
    visitExpandedContent: {
        padding: 16,
        paddingTop: 0,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
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
        color: '#64748b',
        marginLeft: 6,
    },
    infoValue: {
        fontSize: 14,
        color: '#1e293b',
        marginLeft: 20,
        marginBottom: 4,
    },
    subInfoSection: {
        marginLeft: 20,
    },
    subInfoLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1e293b',
        marginTop: 4,
    },
    subInfoValue: {
        fontSize: 13,
        color: '#64748b',
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
        color: '#1e293b',
    },
    examValue: {
        fontWeight: '400',
        color: '#64748b',
    }
});

export default VisitList;
