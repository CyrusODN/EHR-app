import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView,
    LayoutAnimation,
    Platform,
    UIManager
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const VisitList = ({ patientData }: { patientData: any }) => {
    const [expanded, setExpanded] = useState(true);

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
                        <Feather name="calendar" size={18} color="#58a6b8" style={styles.icon} />
                        <Text style={styles.title}>VISIT HISTORY</Text>
                    </View>
                    <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#94a3b8" />
                </TouchableOpacity>

                {expanded && (
                    <View style={styles.content}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.subHeader}>Visit History</Text>
                            <Text style={styles.totalText}>Total visits: 0</Text>
                        </View>
                        
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No visits found</Text>
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
    }
});

export default VisitList;
