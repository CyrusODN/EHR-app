import React, { useState, useEffect } from 'react';
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
import { GetPatientLogs } from '../../../Services/PatientLogs.Service';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const formatDateTime = (dateString: string) => {
    if (!dateString) return { date: 'N/A', time: 'N/A' };
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    
    return { date: formattedDate, time: formattedTime };
};

const formatActivityType = (type: string) => {
    return type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const formatSummary = (log: any) => {
    const { type, details } = log;
    if (type === 'visit_scheduled') {
        return `Date: ${details.date}, Time: ${details.startTime}`;
    }
    if (type === 'medical_record_accessed' || type === 'profile_viewed') {
        return 'Viewed Medical Information';
    }
    if (type === 'medical_data_updated') {
        const fields = details?.fieldsUpdated?.[0] || 'medical data';
        return `Updated ${fields.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
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

const getIconColor = (type: string) => {
    switch (type) {
        case 'medical_data_updated': return '#22c55e'; // Green
        case 'personal_data_updated': return '#3b82f6'; // Blue
        case 'medical_record_accessed':
        case 'profile_viewed': return '#64748b'; // Slate
        case 'patient_record_updated': return '#64748b'; // Slate
        default: return '#94a3b8';
    }
};

const PatientLogs = ({ patientData }: { patientData: any }) => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [showDropdown, setShowDropdown] = useState(false);

    const categories = ['All Categories', 'Medical', 'Other', 'Personal', 'System'];

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
            formatActivityType(log.type).toLowerCase().includes(searchText.toLowerCase()) ||
            (log.performedBy?.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
            formatSummary(log).toLowerCase().includes(searchText.toLowerCase());
        
        if (selectedCategory === 'All Categories') return matchesSearch;
        
        let categoryMatch = false;
        const logType = log.type.toLowerCase();
        
        if (selectedCategory === 'System') {
            categoryMatch = ['medical_record_accessed', 'profile_viewed'].includes(logType);
        } else if (selectedCategory === 'Medical') {
            categoryMatch = ['medical_data_updated', 'visit_scheduled', 'prescription_added'].includes(logType);
        } else if (selectedCategory === 'Personal') {
            categoryMatch = ['personal_data_updated'].includes(logType);
        } else if (selectedCategory === 'Other') {
            categoryMatch = ['patient_record_updated'].includes(logType);
        }
        
        return matchesSearch && categoryMatch;
    });

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
                <TouchableOpacity 
                    style={[styles.header, expanded && styles.expandedHeader]} 
                    onPress={toggleExpand}
                    activeOpacity={0.7}
                >
                    <Text style={styles.title}>Patient Activity Logs</Text>
                    <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#94a3b8" />
                </TouchableOpacity>

                {expanded && (
                    <View style={styles.content}>
                        <View style={styles.filterRow}>
                            <View style={styles.searchBar}>
                                <Feather name="search" size={16} color="#94a3b8" />
                                <TextInput 
                                    style={styles.searchInput}
                                    placeholder="Search logs..."
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                            <View>
                                <TouchableOpacity 
                                    style={styles.categoryButton}
                                    onPress={() => setShowDropdown(true)}
                                >
                                    <Feather name="filter" size={16} color="#94a3b8" />
                                    <Text style={styles.categoryText}>{selectedCategory}</Text>
                                    <Modal
                                        visible={showDropdown}
                                        transparent={true}
                                        animationType="fade"
                                        onRequestClose={() => setShowDropdown(false)}
                                    >
                                        <Pressable 
                                            style={styles.modalOverlay} 
                                            onPress={() => setShowDropdown(false)}
                                        >
                                            <View style={styles.dropdownMenu}>
                                                {categories.map((cat) => (
                                                    <TouchableOpacity
                                                        key={cat}
                                                        style={[
                                                            styles.dropdownItem,
                                                            selectedCategory === cat && styles.selectedDropdownItem
                                                        ]}
                                                        onPress={() => {
                                                            setSelectedCategory(cat);
                                                            setShowDropdown(false);
                                                        }}
                                                    >
                                                        <View style={styles.dropdownItemContent}>
                                                            {selectedCategory === cat ? (
                                                                <Feather name="check" size={16} color="#fff" style={styles.checkIcon} />
                                                            ) : (
                                                                <View style={styles.checkPlaceholder} />
                                                            )}
                                                            <Text style={[
                                                                styles.dropdownItemText,
                                                                selectedCategory === cat && styles.selectedDropdownItemText
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
                            <Text style={styles.showingText}>
                                Showing {filteredLogs.length} of {logs.length} logs
                            </Text>
                        </View>

                        {loading ? (
                            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                                <ActivityIndicator size="small" color="#4DA1C0" />
                                <Text style={{ marginTop: 10, color: '#94a3b8', fontSize: 12 }}>Loading logs...</Text>
                            </View>
                        ) : (
                            <View style={styles.tableContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={styles.tableMinWidth}>
                                        <View style={styles.tableHeader}>
                                            <Text style={[styles.columnLabel, { width: 180 }]}>ACTIVITY TYPE</Text>
                                            <Text style={[styles.columnLabel, { width: 140 }]}>PERFORMED BY</Text>
                                            <View style={[styles.columnLabel, { width: 140, flexDirection: 'row', alignItems: 'center' }]}>
                                                <Text style={styles.columnLabelText}>DATE & TIME</Text>
                                                <Feather name="arrow-down" size={12} color="#94a3b8" style={{ marginLeft: 4 }} />
                                            </View>
                                            <Text style={[styles.columnLabel, { width: 220 }]}>SUMMARY</Text>
                                        </View>

                                        {filteredLogs.length > 0 ? (
                                            filteredLogs.map((log, index) => {
                                                const { date, time } = formatDateTime(log.createdAt);
                                                return (
                                                    <View key={log.id || index} style={[styles.tableRow, index === filteredLogs.length - 1 && { borderBottomWidth: 0 }]}>
                                                        <View style={{ width: 180, flexDirection: 'row', alignItems: 'center' }}>
                                                            <Feather name="chevron-right" size={14} color="#94a3b8" style={{ marginRight: 8, opacity: 0.5 }} />
                                                            <Feather name={getIcon(log.type) as any} size={15} color={getIconColor(log.type)} style={{ marginRight: 10 }} />
                                                            <Text style={styles.activityType}>{formatActivityType(log.type)}</Text>
                                                        </View>
                                                        <View style={{ width: 140 }}>
                                                            <Text style={styles.cellText}>{log.performedBy?.name || 'N/A'}</Text>
                                                        </View>
                                                        <View style={{ width: 140 }}>
                                                            <Text style={styles.cellText}>{date}</Text>
                                                            <Text style={styles.timeText}>{time}</Text>
                                                        </View>
                                                        <View style={{ width: 220 }}>
                                                            <Text style={styles.cellText} numberOfLines={1}>{formatSummary(log)}</Text>
                                                        </View>
                                                    </View>
                                                );
                                            })
                                        ) : (
                                            <View style={{ padding: 20, alignItems: 'center', width: 680 }}>
                                                <Text style={{ color: '#94a3b8', fontSize: 12 }}>No logs found</Text>
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
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
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
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 36,
    },
    searchInput: {
        flex: 1,
        marginLeft: 6,
        fontSize: 12,
        color: '#1e293b',
        padding: 0,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 36,
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1e293b',
        marginLeft: 6,
    },
    showingText: {
        fontSize: 12,
        color: '#94a3b8',
        marginLeft: 'auto',
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
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
        color: '#94a3b8',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        alignItems: 'center',
    },
    activityType: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1e293b',
        flex: 1,
    },
    cellText: {
        fontSize: 12,
        color: '#475569',
    },
    timeText: {
        fontSize: 11,
        color: '#94a3b8',
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownMenu: {
        backgroundColor: '#4c4c4c',
        borderRadius: 12,
        padding: 6,
        width: 180,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    dropdownItem: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    selectedDropdownItem: {
        backgroundColor: '#3b82f6',
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
