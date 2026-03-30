import React, { useState, useEffect, useMemo } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView,
    TextInput,
    LayoutAnimation,
    Platform,
    UIManager,
    ActivityIndicator,
    Modal,
    Pressable
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { GetPatientLogs } from '../../../Services/PatientLogs.Service';
import { useThemeColors } from '../../../hooks/useThemeColors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const formatDateTime = (dateString: string, t: any) => {
    if (!dateString) return { date: t('common.na'), time: t('common.na') };
    const date = new Date(dateString);
    const months = t('common.monthsShort', { returnObjects: true }) || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    
    return { date: formattedDate, time: formattedTime };
};

const formatActivityType = (type: string, t: any) => {
    const key = `patientLogs.activityTypes.${type}`;
    const translated = t(key);
    if (translated !== key) return translated;

    return type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const formatSummary = (log: any, t: any) => {
    const { type, details } = log;
    if (type === 'visit_scheduled') {
        const dateStr = details?.date || t('common.na');
        const timeStr = details?.startTime || t('common.na');
        return `${t('visitWizard.form.date')}: ${dateStr}, ${t('common.time')}: ${timeStr}`;
    }
    if (type === 'medical_record_accessed' || type === 'profile_viewed') {
        return t('patientLogs.viewedMedicalInformation');
    }
    if (type === 'medical_data_updated') {
        const fields = details?.fieldsUpdated?.[0];
        if (fields) {
            return t('patientLogs.updated', { field: fields.replace(/([A-Z])/g, ' $1').toLowerCase() });
        }
        return t('patientLogs.updatedMedicalData');
    }
    if (type === 'patient_record_updated' || type === 'personal_data_updated') {
        // Return stringified details without braces for a cleaner look
        return JSON.stringify(details).replace(/[{}]/g, '');
    }
    return typeof details === 'string' ? details : JSON.stringify(details);
};

const getIcon = (type: string) => {
    switch (type) {
        case 'medical_data_updated': return 'edit-3';
        case 'medical_record_accessed':
        case 'profile_viewed': return 'eye';
        case 'patient_record_updated': return 'activity';
        case 'personal_data_updated': return 'user';
        case 'visit_scheduled': return 'calendar';
        default: return 'info';
    }
};

const getIconColor = (type: string, tc: any) => {
    switch (type) {
        case 'medical_data_updated': return tc.accentGreen || '#22c55e';
        case 'personal_data_updated': return '#3b82f6'; // Blue
        case 'medical_record_accessed':
        case 'profile_viewed': return tc.textMuted;
        case 'patient_record_updated': return tc.textMuted;
        default: return tc.textMuted;
    }
};

const PatientLogs = ({ patientData }: { patientData: any }) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(t('patientLogs.allCategories'));
    const [showDropdown, setShowDropdown] = useState(false);

    const categories = [t('patientLogs.allCategories'), t('patientLogs.medical'), t('patientLogs.other'), t('patientLogs.personal'), t('patientLogs.system')];

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const patientId = patientData?.id || patientData?._id;
                if (!patientId) {
                    setLoading(false);
                    return;
                }
                const response: any = await GetPatientLogs(patientId);
                if (response) {
                    setLogs(response);
                }
            } catch (error) {
                console.log("Fetch logs error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [patientData]);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = 
            formatActivityType(log.type, t).toLowerCase().includes(searchText.toLowerCase()) ||
            (log.performedBy?.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
            formatSummary(log, t).toLowerCase().includes(searchText.toLowerCase());
        
        if (selectedCategory === t('patientLogs.allCategories')) return matchesSearch;
        
        let categoryMatch = false;
        const logType = log.type.toLowerCase();
        
        if (selectedCategory === t('patientLogs.system')) {
            categoryMatch = ['medical_record_accessed', 'profile_viewed'].includes(logType);
        } else if (selectedCategory === t('patientLogs.medical')) {
            categoryMatch = ['medical_data_updated', 'visit_scheduled', 'prescription_added'].includes(logType);
        } else if (selectedCategory === t('patientLogs.personal')) {
            categoryMatch = ['personal_data_updated'].includes(logType);
        } else if (selectedCategory === t('patientLogs.other')) {
            categoryMatch = ['patient_record_updated'].includes(logType);
        }
        
        return matchesSearch && categoryMatch;
    });

    return (
        <ScrollView style={ds.container} showsVerticalScrollIndicator={false}>
            <View style={ds.card}>
                <TouchableOpacity 
                    style={[ds.header, expanded && ds.expandedHeader]} 
                    onPress={toggleExpand}
                    activeOpacity={0.7}
                >
                    <Text style={ds.title}>{t('patientLogs.patientActivityLogs')}</Text>
                    <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color={tc.textMuted} />
                </TouchableOpacity>

                {expanded && (
                    <View style={ds.content}>
                        <View style={ds.filterRow}>
                            <View style={ds.searchBar}>
                                <Feather name="search" size={16} color={tc.textMuted} />
                                <TextInput 
                                    style={ds.searchInput}
                                    placeholder={t('patientLogs.searchLogs')}
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholderTextColor={tc.textMuted}
                                />
                            </View>
                            <View>
                                <TouchableOpacity 
                                    style={ds.categoryButton}
                                    onPress={() => setShowDropdown(true)}
                                >
                                    <Feather name="filter" size={16} color={tc.textMuted} />
                                    <Text style={ds.categoryText}>{selectedCategory}</Text>
                                    <Modal
                                        visible={showDropdown}
                                        transparent={true}
                                        animationType="fade"
                                        onRequestClose={() => setShowDropdown(false)}
                                    >
                                        <Pressable 
                                            style={ds.modalOverlay} 
                                            onPress={() => setShowDropdown(false)}
                                        >
                                            <View style={ds.dropdownMenu}>
                                                {categories.map((cat) => (
                                                    <TouchableOpacity
                                                        key={cat}
                                                        style={[
                                                            ds.dropdownItem,
                                                            selectedCategory === cat && ds.selectedDropdownItem
                                                        ]}
                                                        onPress={() => {
                                                            setSelectedCategory(cat);
                                                            setShowDropdown(false);
                                                        }}
                                                    >
                                                        <View style={ds.dropdownItemContent}>
                                                            {selectedCategory === cat ? (
                                                                <Feather name="check" size={16} color="#fff" style={ds.checkIcon} />
                                                            ) : (
                                                                <View style={ds.checkPlaceholder} />
                                                            )}
                                                            <Text style={[
                                                                ds.dropdownItemText,
                                                                selectedCategory === cat && ds.selectedDropdownItemText
                                                            ]}>
                                                                {cat}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </Pressable>
                                    </Modal>
                                </TouchableOpacity>
                            </View>
                            <Text style={ds.showingText}>
                                {t('patientLogs.showingLogs', { count: filteredLogs.length, total: logs.length })}
                            </Text>
                        </View>

                        {loading ? (
                            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                                <ActivityIndicator size="small" color={tc.accent} />
                                <Text style={{ marginTop: 10, color: tc.textMuted, fontSize: 12 }}>{t('patientLogs.loadingLogs')}</Text>
                            </View>
                        ) : (
                            <View style={ds.tableContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={ds.tableMinWidth}>
                                        <View style={ds.tableHeader}>
                                            <Text style={[ds.columnLabelText, { width: 180 }]}>{t('patientLogs.activityType')}</Text>
                                            <Text style={[ds.columnLabelText, { width: 140 }]}>{t('patientLogs.performedBy')}</Text>
                                            <View style={[ds.columnLabel, { width: 140, flexDirection: 'row', alignItems: 'center' }]}>
                                                <Text style={ds.columnLabelText}>{t('patientLogs.dateTime')}</Text>
                                                <Feather name="arrow-down" size={12} color={tc.textMuted} style={{ marginLeft: 4 }} />
                                            </View>
                                            <Text style={[ds.columnLabelText, { width: 220 }]}>{t('patientLogs.summary')}</Text>
                                        </View>

                                        {filteredLogs.length > 0 ? (
                                            filteredLogs.map((log, index) => {
                                                const { date, time } = formatDateTime(log.createdAt, t);
                                                return (
                                                    <View key={log.id || index} style={[ds.tableRow, index === filteredLogs.length - 1 && { borderBottomWidth: 0 }]}>
                                                        <View style={{ width: 180, flexDirection: 'row', alignItems: 'center' }}>
                                                            <Feather name="chevron-right" size={14} color={tc.textMuted} style={{ marginRight: 8, opacity: 0.5 }} />
                                                            <Feather name={getIcon(log.type) as any} size={15} color={getIconColor(log.type, tc)} style={{ marginRight: 10 }} />
                                                            <Text style={ds.activityType}>{formatActivityType(log.type, t)}</Text>
                                                        </View>
                                                        <View style={{ width: 140 }}>
                                                            <Text style={ds.cellText}>{log.performedBy?.name || t('common.na')}</Text>
                                                        </View>
                                                        <View style={{ width: 140 }}>
                                                            <Text style={ds.cellText}>{date}</Text>
                                                            <Text style={ds.timeText}>{time}</Text>
                                                        </View>
                                                        <View style={{ width: 220 }}>
                                                            <Text style={ds.cellText} numberOfLines={1}>{formatSummary(log, t)}</Text>
                                                        </View>
                                                    </View>
                                                );
                                            })
                                        ) : (
                                            <View style={{ padding: 20, alignItems: 'center', width: 680 }}>
                                                <Text style={{ color: tc.textMuted, fontSize: 12 }}>{t('patientLogs.noLogsFound')}</Text>
                                            </View>
                                        )}
                                    </View>
                                </ScrollView>
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
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    content: {
        padding: 16,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
        gap: 8,
    },
    searchBar: {
        width: 150,
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
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tc.cardBackground,
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 36,
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '600',
        color: tc.textPrimary,
        marginLeft: 6,
    },
    showingText: {
        fontSize: 12,
        color: tc.textMuted,
        marginLeft: 'auto',
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 8,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: tc.cardBackgroundAlt || (isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'),
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
    },
    tableMinWidth: {
        minWidth: 680,
    },
    columnLabel: {
        justifyContent: 'center',
    },
    columnLabelText: {
        fontSize: 11,
        fontWeight: '700',
        color: tc.textMuted,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: tc.divider,
        alignItems: 'center',
    },
    activityType: {
        fontSize: 12,
        fontWeight: '600',
        color: tc.textPrimary,
        flex: 1,
    },
    cellText: {
        fontSize: 12,
        color: tc.textSecondary,
    },
    timeText: {
        fontSize: 11,
        color: tc.textMuted,
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownMenu: {
        backgroundColor: isDark ? tc.modalBg : '#4c4c4c',
        borderRadius: 12,
        padding: 6,
        width: 180,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderColor,
    },
    dropdownItem: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    selectedDropdownItem: {
        backgroundColor: tc.accent,
    },
    dropdownItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownItemText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '500',
    },
    selectedDropdownItemText: {
        fontWeight: '700',
    },
    checkIcon: {
        marginRight: 10,
        width: 16,
    },
    checkPlaceholder: {
        width: 26, // width of icon + margin
    }
});

export default PatientLogs;
