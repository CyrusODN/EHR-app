import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView,
    TextInput,
    LayoutAnimation,
    Platform,
    UIManager
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PatientLogs = ({ patientData }: { patientData: any }) => {
    const [expanded, setExpanded] = useState(true);
    const [searchText, setSearchText] = useState('');

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const logs = [
        {
            type: 'Medical Record Accessed',
            by: 'Hamad Alvi',
            date: 'Feb 26, 2026',
            time: '01:54 PM',
            summary: 'Viewed Medical Information',
            icon: 'eye'
        },
        {
            type: 'Profile Viewed',
            by: 'Hamad Alvi',
            date: 'Feb 26, 2026',
            time: '01:24 PM',
            summary: 'section: personal_data, dataType: personal_inf...',
            icon: 'eye'
        }
    ];

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
                            <TouchableOpacity style={styles.categoryButton}>
                                <Feather name="filter" size={16} color="#4DA1C0" />
                                <Text style={styles.categoryText}>All Categories</Text>
                            </TouchableOpacity>
                            <Text style={styles.showingText}>Showing 2 of 2 logs</Text>
                        </View>

                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.columnLabel, { flex: 2 }]}>ACTIVITY TYPE</Text>
                                <Text style={[styles.columnLabel, { flex: 1.5 }]}>PERFORMED BY</Text>
                                <View style={[styles.columnLabel, { flex: 1.5, flexDirection: 'row', alignItems: 'center' }]}>
                                    <Text style={styles.columnLabelText}>DATE & TIME</Text>
                                    <Feather name="arrow-down" size={12} color="#94a3b8" style={{ marginLeft: 4 }} />
                                </View>
                                <Text style={[styles.columnLabel, { flex: 2 }]}>SUMMARY</Text>
                            </View>

                            {logs.map((log, index) => (
                                <View key={index} style={[styles.tableRow, index === logs.length - 1 && { borderBottomWidth: 0 }]}>
                                    <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                                        <Feather name="chevron-right" size={14} color="#94a3b8" style={{ marginRight: 8 }} />
                                        <Feather name={log.icon as any} size={14} color="#64748b" style={{ marginRight: 8 }} />
                                        <Text style={styles.activityType}>{log.type}</Text>
                                    </View>
                                    <View style={{ flex: 1.5 }}>
                                        <Text style={styles.cellText}>{log.by}</Text>
                                    </View>
                                    <View style={{ flex: 1.5 }}>
                                        <Text style={styles.cellText}>{log.date}</Text>
                                        <Text style={styles.timeText}>{log.time}</Text>
                                    </View>
                                    <View style={{ flex: 2 }}>
                                        <Text style={styles.cellText} numberOfLines={1}>{log.summary}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
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
        borderColor: '#3b82f6',
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
});

export default PatientLogs;
