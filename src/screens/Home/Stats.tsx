import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Platform,
} from 'react-native';
import { Text, Card, IconButton, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

export const DashboardStatsCard = () => {
    const { colors } = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);
    const expandAnimation = useRef(new Animated.Value(0)).current;
    const rotateAnimation = useRef(new Animated.Value(0)).current;
    const isAnimating = useRef(false);
    const totalPatients = '1393 total';

    const toggleExpand = () => {
        if (isAnimating.current) return;
        isAnimating.current = true;

        setIsExpanded(prev => {
            const nextState = !prev;
            const toValue = nextState ? 1 : 0;

            Animated.parallel([
                Animated.timing(expandAnimation, {
                    toValue,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(rotateAnimation, {
                    toValue,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => {
                isAnimating.current = false;
            });

            return nextState;
        });
    };

    const cardHeight = expandAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 300]
    });

    const iconRotation = rotateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    });

    const statItems = [
        { icon: 'account-multiple', label: "Today's Patients", value: '24', color: '#4A90B9' },
        { icon: 'file-document-outline', label: 'Pending Reports', value: '8', color: '#F59E0B' },
        { icon: 'calendar-clock', label: 'Scheduled Visits', value: '156', color: '#8B5CF6' },
        { icon: 'check-circle-outline', label: 'Completed Visits', value: '1205', color: '#10B981' },
    ];

    return (
        <View style={styles.statsCard}>
            <TouchableOpacity
                onPress={toggleExpand}
                activeOpacity={0.7}
                style={styles.statsHeader}
            >
                <View style={styles.statsHeaderLeft}>
                    <View style={styles.statsIconContainer}>
                        <Feather name="bar-chart-2" size={18} color="#4A90B9" />
                    </View>
                    <View>
                        <Text style={styles.dashboardText}>Dashboard</Text>
                        <Text style={styles.totalText}>{totalPatients}</Text>
                    </View>
                </View>
                <Animated.View style={{ transform: [{ rotate: iconRotation }] }}>
                    <View style={styles.expandBtn}>
                        <Feather name="chevron-down" size={18} color="#6B7280" />
                    </View>
                </Animated.View>
            </TouchableOpacity>

            <Animated.View style={[styles.expandableContent, { height: cardHeight }]}>
                <View style={styles.statsGrid}>
                    {statItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.statsBox} activeOpacity={0.7}>
                            <View style={[styles.statIconBg, { backgroundColor: item.color + '15' }]}>
                                <Icon name={item.icon} size={20} color={item.color} />
                            </View>
                            <Text style={styles.statsLabel}>{item.label}</Text>
                            <View style={styles.statValueRow}>
                                <Text style={styles.statsValue}>{item.value}</Text>
                                <View style={styles.statsArrowBtn}>
                                    <Feather name="arrow-right" size={12} color="#9CA3AF" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    statsCard: {
        width: '100%',
        borderRadius: 16,
        backgroundColor: 'white',
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 10,
            },
            android: { elevation: 2 },
        }),
    },
    statsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    statsHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statsIconContainer: {
        backgroundColor: '#EBF5FA',
        height: 38,
        width: 38,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 11,
        marginRight: 12,
    },
    dashboardText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    totalText: {
        color: '#9CA3AF',
        fontSize: 13,
        marginTop: 1,
    },
    expandBtn: {
        width: 32,
        height: 32,
        borderRadius: 9,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandableContent: {
        overflow: 'hidden',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        gap: 10,
    },
    statsBox: {
        width: '47.5%',
        backgroundColor: '#FAFBFC',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#F0F2F5',
    },
    statIconBg: {
        height: 36,
        width: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 10,
    },
    statsLabel: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 6,
    },
    statValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statsValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937',
    },
    statsArrowBtn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
});