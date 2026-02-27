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

const ActionOutlineButton = ({ title, icon, onPress }: any) => (
    <TouchableOpacity style={styles.outlineButton} onPress={onPress}>
        <Feather name={icon} size={16} color="#58a6b8" />
        <Text style={styles.outlineButtonText}>{title}</Text>
    </TouchableOpacity>
);

const Insurance = ({ patientData }: { patientData: any }) => {
    const [expanded, setExpanded] = useState(true);
    const [searchText, setSearchText] = useState('');

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
                <TouchableOpacity 
                    style={[styles.header, expanded && styles.expandedHeader]} 
                    onPress={toggleExpand}
                    activeOpacity={0.7}
                >
                    <View style={styles.headerLeft}>
                        <Feather name="clock" size={18} color="#58a6b8" style={styles.icon} />
                        <Text style={styles.title}>INSURANCE HISTORY</Text>
                    </View>
                    <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#94a3b8" />
                </TouchableOpacity>

                {expanded && (
                    <View style={styles.content}>
                        <View style={styles.actionRow}>
                            <View style={styles.searchBar}>
                                <Feather name="search" size={18} color="#94a3b8" />
                                <TextInput 
                                    style={styles.searchInput}
                                    placeholder="Search in insurance history..."
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                            <View style={styles.buttonGroup}>
                                <ActionOutlineButton title="Filter" icon="calendar" />
                                <ActionOutlineButton title="Export" icon="download" />
                            </View>
                        </View>

                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No insurance history</Text>
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
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: '#1e293b',
        padding: 0,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    outlineButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#58a6b8',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        height: 44,
    },
    outlineButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#58a6b8',
        marginLeft: 6
    },
    emptyContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        padding: 16,
        alignItems: 'flex-start',
    },
    emptyText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
});

export default Insurance;
