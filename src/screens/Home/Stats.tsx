import React, { useState, useRef, useMemo } from 'react';
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
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

interface DashboardStatsCardProps {
    todaysPatients?: number;
    scheduledVisits?: number;
    completedVisits?: number;
}

export const DashboardStatsCard = ({
    todaysPatients = 0,
    scheduledVisits = 0,
    completedVisits = 0,
}: DashboardStatsCardProps) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const [isExpanded, setIsExpanded] = useState(false);
    const expandAnimation = useRef(new Animated.Value(0)).current;
    const rotateAnimation = useRef(new Animated.Value(0)).current;
    const isAnimating = useRef(false);
    const total = todaysPatients + scheduledVisits + completedVisits;
    const totalPatients = `${total} ${t('dashboard.total')}`;

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
        { icon: 'account-multiple', label: t('dashboard.todayPatients'), value: String(todaysPatients), color: '#4A90B9' },
        { icon: 'file-document-outline', label: t('dashboard.pendingReports'), value: '0', color: '#F59E0B' },
        { icon: 'calendar-clock', label: t('dashboard.scheduledVisits'), value: String(scheduledVisits), color: '#8B5CF6' },
        { icon: 'check-circle-outline', label: t('dashboard.completedVisits'), value: String(completedVisits), color: '#10B981' },
    ];

    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    return (
        <View style={ds.statsCard}>
            <TouchableOpacity
                onPress={toggleExpand}
                activeOpacity={0.7}
                style={ds.statsHeader}
            >
                <View style={ds.statsHeaderLeft}>
                    <View style={ds.statsIconContainer}>
                        <Feather name="bar-chart-2" size={18} color="#4A90B9" />
                    </View>
                    <View>
                        <Text style={ds.dashboardText}>{t('dashboard.title')}</Text>
                        <Text style={ds.totalText}>{totalPatients}</Text>
                    </View>
                </View>
                <Animated.View style={{ transform: [{ rotate: iconRotation }] }}>
                    <View style={ds.expandBtn}>
                        <Feather name="chevron-down" size={18} color={tc.textSecondary} />
                    </View>
                </Animated.View>
            </TouchableOpacity>

            <Animated.View style={[ds.expandableContent, { height: cardHeight }]}>
                <View style={ds.statsGrid}>
                    {statItems.map((item, index) => (
                        <TouchableOpacity key={index} style={ds.statsBox} activeOpacity={0.7}>
                            <View style={[ds.statIconBg, { backgroundColor: item.color + (isDark ? '25' : '15') }]}>
                                <Icon name={item.icon} size={20} color={item.color} />
                            </View>
                            <Text style={ds.statsLabel}>{item.label}</Text>
                            <View style={ds.statValueRow}>
                                <Text style={ds.statsValue}>{item.value}</Text>
                                <View style={ds.statsArrowBtn}>
                                    <Feather name="arrow-right" size={12} color={tc.textMuted} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>
        </View>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        statsCard: {
            width: '100%',
            borderRadius: 16,
            backgroundColor: tc.cardBackground,
            overflow: 'hidden',
            borderWidth: isDark ? 1 : 0,
            borderColor: tc.borderColor,
            ...Platform.select({
                ios: {
                    shadowColor: tc.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0 : 0.06,
                    shadowRadius: 10,
                },
                android: { elevation: isDark ? 0 : 2 },
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
            backgroundColor: tc.accentLight,
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
            color: tc.textPrimary,
        },
        totalText: {
            color: tc.textMuted,
            fontSize: 13,
            marginTop: 1,
        },
        expandBtn: {
            width: 32,
            height: 32,
            borderRadius: 9,
            backgroundColor: tc.buttonMutedBg,
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
            backgroundColor: tc.cardBackgroundAlt,
            borderRadius: 14,
            padding: 14,
            borderWidth: 1,
            borderColor: tc.divider,
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
            color: tc.textSecondary,
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
            color: tc.textPrimary,
        },
        statsArrowBtn: {
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: tc.buttonMutedBg,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });