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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { GetPatientAuditTrail } from '../../../Services/PatientLogs.Service';
import { useThemeColors } from '../../../hooks/useThemeColors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AuditChange {
    field: string;
    oldValue: string;
    newValue: string;
}

interface AuditEntry {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    action: 'create' | 'modify' | 'view' | 'sign' | 'print' | 'export';
    documentType: string;
    documentId: string;
    changes?: AuditChange[];
    ipAddress: string;
    systemInfo: string;
}

const formatDateTime = (dateString: string, i18nLang: string) => {
    if (!dateString) return { date: 'N/A', time: 'N/A' };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString(i18nLang === 'pl' ? 'pl-PL' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
    return { date: formattedDate, time: formattedTime };
};

const getActionIcon = (action: string): string => {
    switch (action) {
        case 'create': return 'file-plus';
        case 'modify': return 'edit-3';
        case 'view': return 'eye';
        case 'sign': return 'lock';
        case 'print': return 'printer';
        case 'export': return 'download';
        default: return 'clock';
    }
};

const getActionColor = (action: string, isDark: boolean) => {
    switch (action) {
        case 'create': return '#22c55e';
        case 'modify': return '#3b82f6';
        case 'view': return isDark ? '#94a3b8' : '#64748b';
        case 'sign': return '#8b5cf6';
        case 'print': return '#f59e0b';
        case 'export': return '#06b6d4';
        default: return isDark ? '#94a3b8' : '#64748b';
    }
};

const AuditTrail = ({ patientData }: { patientData: any }) => {
    const { t, i18n } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    const [entries, setEntries] = useState<AuditEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(true);
    const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

    const toggleExpand = useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(prev => !prev);
    }, []);

    const toggleEntry = useCallback((id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedEntryId(prev => prev === id ? null : id);
    }, []);

    useEffect(() => {
        const fetchAuditTrail = async () => {
            try {
                const patientId = patientData?.id || patientData?._id;
                if (!patientId) {
                    setLoading(false);
                    return;
                }
                const response: any = await GetPatientAuditTrail(patientId);
                if (response && Array.isArray(response)) {
                    setEntries(response);
                } else if (response?.entries) {
                    setEntries(response.entries);
                }
            } catch (error) {
                console.log("Fetch audit trail error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAuditTrail();
    }, [patientData]);

    return (
        <ScrollView style={ds.container} showsVerticalScrollIndicator={false}>
            <View style={ds.card}>
                <TouchableOpacity
                    style={[ds.header, expanded && ds.expandedHeader]}
                    onPress={toggleExpand}
                    activeOpacity={0.7}
                >
                    <View style={ds.headerLeft}>
                        <View style={ds.headerIconWrap}>
                            <Feather name="clock" size={18} color={tc.accent} />
                        </View>
                        <View>
                            <Text style={ds.title}>{t('auditTrail.header.title')}</Text>
                            <Text style={ds.subtitle}>{t('auditTrail.header.subtitle')}</Text>
                        </View>
                    </View>
                    <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color={tc.textMuted} />
                </TouchableOpacity>

                {expanded && (
                    <View style={ds.content}>
                        {loading ? (
                            <View style={ds.loadingContainer}>
                                <ActivityIndicator size="small" color={tc.accent} />
                                <Text style={ds.loadingText}>{t('auditTrail.loading')}</Text>
                            </View>
                        ) : entries.length > 0 ? (
                            entries.map((entry, index) => {
                                const { date, time } = formatDateTime(entry.timestamp, i18n.language);
                                const isEntryExpanded = expandedEntryId === entry.id;
                                const actionColor = getActionColor(entry.action, isDark);

                                return (
                                    <TouchableOpacity
                                        key={entry.id || index}
                                        style={[ds.entryCard, isEntryExpanded && ds.entryCardExpanded]}
                                        onPress={() => toggleEntry(entry.id || String(index))}
                                        activeOpacity={0.7}
                                    >
                                        <View style={ds.entryHeader}>
                                            <View style={ds.entryLeft}>
                                                <View style={[ds.actionIconWrap, { backgroundColor: actionColor + '20' }]}>
                                                    <Feather
                                                        name={getActionIcon(entry.action) as any}
                                                        size={16}
                                                        color={actionColor}
                                                    />
                                                </View>
                                                <View style={ds.entryInfo}>
                                                    <Text style={ds.actionText}>
                                                        {t(`auditTrail.actions.${entry.action}`)}
                                                    </Text>
                                                    <View style={ds.entryMetaRow}>
                                                        <Feather name="user" size={12} color={tc.textMuted} />
                                                        <Text style={ds.metaText}>{entry.userName}</Text>
                                                        <Feather name="clock" size={12} color={tc.textMuted} style={{ marginLeft: 8 }} />
                                                        <Text style={ds.metaText}>{date}, {time}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={ds.entryRight}>
                                                <Text style={ds.ipText}>{entry.ipAddress}</Text>
                                                <Feather
                                                    name={isEntryExpanded ? 'chevron-up' : 'chevron-down'}
                                                    size={16}
                                                    color={tc.textMuted}
                                                />
                                            </View>
                                        </View>

                                        {isEntryExpanded && (
                                            <View style={ds.entryExpandedContent}>
                                                {entry.changes && entry.changes.length > 0 && (
                                                    <View style={ds.changesSection}>
                                                        <Text style={ds.changesSectionTitle}>
                                                            {t('auditTrail.changes.title')}
                                                        </Text>
                                                        {entry.changes.map((change, idx) => (
                                                            <View key={idx} style={ds.changeRow}>
                                                                <Text style={ds.changeField}>{change.field}:</Text>
                                                                <View style={ds.changeValues}>
                                                                    <Text style={ds.oldValue}>{change.oldValue}</Text>
                                                                    <Feather name="arrow-right" size={12} color={tc.textMuted} style={{ marginHorizontal: 6 }} />
                                                                    <Text style={ds.newValue}>{change.newValue}</Text>
                                                                </View>
                                                            </View>
                                                        ))}
                                                    </View>
                                                )}
                                                <View style={ds.systemInfoRow}>
                                                    <Text style={ds.systemInfoLabel}>
                                                        {t('auditTrail.changes.system')}
                                                    </Text>
                                                    <Text style={ds.systemInfoValue}>{entry.systemInfo}</Text>
                                                </View>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })
                        ) : (
                            <View style={ds.emptyContainer}>
                                <Feather name="clock" size={40} color={tc.borderColor} />
                                <Text style={ds.emptyText}>{t('auditTrail.noEntries')}</Text>
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
        flex: 1,
    },
    headerIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: isDark ? 'rgba(88, 167, 179, 0.15)' : '#E2F2F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    subtitle: {
        fontSize: 12,
        color: tc.textSecondary,
        marginTop: 1,
    },
    content: {
        padding: 16,
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: tc.textMuted,
        fontSize: 12,
    },
    entryCard: {
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : tc.cardBackgroundAlt,
        overflow: 'hidden',
    },
    entryCardExpanded: {
        borderLeftWidth: 3,
        borderLeftColor: tc.accent,
    },
    entryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
    },
    entryLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    actionIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    entryInfo: {
        flex: 1,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textPrimary,
    },
    entryMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    metaText: {
        fontSize: 12,
        color: tc.textMuted,
        marginLeft: 4,
    },
    entryRight: {
        alignItems: 'flex-end',
        marginLeft: 8,
    },
    ipText: {
        fontSize: 11,
        color: tc.textMuted,
        marginBottom: 4,
    },
    entryExpandedContent: {
        padding: 14,
        paddingTop: 0,
        borderTopWidth: 1,
        borderTopColor: tc.borderColor,
    },
    changesSection: {
        marginTop: 12,
    },
    changesSectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: tc.textPrimary,
        marginBottom: 8,
    },
    changeRow: {
        marginBottom: 8,
    },
    changeField: {
        fontSize: 12,
        color: tc.textSecondary,
        fontWeight: '600',
        marginBottom: 2,
    },
    changeValues: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    oldValue: {
        fontSize: 12,
        color: '#ef4444',
        textDecorationLine: 'line-through',
    },
    newValue: {
        fontSize: 12,
        color: '#22c55e',
        fontWeight: '600',
    },
    systemInfoRow: {
        marginTop: 12,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    systemInfoLabel: {
        fontSize: 11,
        color: tc.textMuted,
        fontWeight: '600',
    },
    systemInfoValue: {
        fontSize: 11,
        color: tc.textMuted,
        marginLeft: 4,
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: tc.textMuted,
        fontWeight: '500',
        marginTop: 12,
    },
});

export default AuditTrail;
