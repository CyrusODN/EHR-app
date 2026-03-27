import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
    Dimensions,
    Platform,
    ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface TrendAnalysisModalProps {
    visible: boolean;
    onClose: () => void;
    totalVisits?: number;
    scalesCompleted?: number;
    loading?: boolean;
}

const TrendAnalysisModal = ({ 
    visible, 
    onClose, 
    totalVisits = 0, 
    scalesCompleted = 0,
    loading = false
}: TrendAnalysisModalProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    damping: 25,
                    stiffness: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible]);

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View style={[ds.overlay, { opacity: fadeAnim }]}>
                <TouchableOpacity 
                    style={ds.dismissArea} 
                    activeOpacity={1} 
                    onPress={onClose} 
                />
                <Animated.View 
                    style={[
                        ds.modalContainer, 
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={ds.header}>
                        <View style={ds.headerTitleContainer}>
                            <View style={ds.headerIconContainer}>
                                <MaterialCommunityIcons name="brain" size={26} color="#58A7B3" />
                            </View>
                            <View>
                                <Text style={ds.title}>{t('trends.title')}</Text>
                                <Text style={ds.subtitle}>{t('trends.subtitle')}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} style={ds.closeBtn}>
                            <View style={ds.closeIconWrapper}>
                                <Feather name="x" size={20} color={tc.textSecondary} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={ds.body}>
                        {/* Top: Chart/Empty State Area */}
                        <View style={ds.chartArea}>
                            <View style={ds.emptyChartContainer}>
                                <View style={ds.largeIconBackground}>
                                    <MaterialCommunityIcons name="brain" size={50} color={isDark ? '#475569' : '#CBD5E1'} />
                                </View>
                                <Text style={ds.emptyChartTitle}>{t('trends.emptyTitle')}</Text>
                                <Text style={ds.emptyChartSubtitle}>{t('trends.emptySubtitle')}</Text>
                            </View>
                        </View>

                        {/* Bottom: Insights & Stats */}
                        <View style={ds.insightsArea}>
                            <Text style={ds.sectionLabel}>{t('trends.aiInsights')}</Text>
                            <View style={ds.insightBox}>
                                <View style={ds.insightIconCircle}>
                                    <MaterialCommunityIcons name="brain" size={18} color="#3B82F6" />
                                </View>
                                {loading ? (
                                    <ActivityIndicator size="small" color="#3B82F6" style={{marginLeft: 12}} />
                                ) : (
                                    <Text style={ds.insightText}>
                                        {scalesCompleted > 0 
                                            ? t('trends.analyzing', { count: totalVisits })
                                            : t('trends.insufficientData')}
                                    </Text>
                                )}
                            </View>

                            <View style={ds.statsRow}>
                                <View style={ds.statItem}>
                                    <Text style={ds.statLabel}>{t('trends.totalVisits')}</Text>
                                    <Text style={ds.statValue}>{loading ? '...' : totalVisits}</Text>
                                    <TouchableOpacity>
                                        <Text style={ds.statSubText}>{t('trends.visitHistory')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={ds.statItem}>
                                    <Text style={ds.statLabel}>{t('trends.scalesCompleted')}</Text>
                                    <Text style={ds.statValue}>{loading ? '...' : scalesCompleted}</Text>
                                    <TouchableOpacity>
                                        <Text style={ds.statSubTextGreen}>{t('trends.combinedScales')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(15, 23, 42, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        dismissArea: {
            ...StyleSheet.absoluteFillObject,
        },
        modalContainer: {
            backgroundColor: tc.cardBackground,
            borderRadius: 24,
            width: wp(94),
            maxWidth: 720,
            overflow: 'hidden',
            ...Platform.select({
                ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: isDark ? 0.3 : 0.15,
                    shadowRadius: 24,
                },
                android: {
                    elevation: 12,
                },
            }),
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 24,
            paddingBottom: 20,
            backgroundColor: tc.cardBackground,
        },
        headerTitleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        headerIconContainer: {
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: isDark ? 'rgba(88, 167, 179, 0.15)' : '#E2F2F4',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
        },
        title: {
            fontSize: 19,
            fontWeight: '800',
            color: tc.textPrimary,
            letterSpacing: -0.5,
        },
        subtitle: {
            fontSize: 13,
            color: tc.textSecondary,
            marginTop: 2,
            fontWeight: '500',
        },
        closeBtn: {
            marginLeft: 12,
        },
        closeIconWrapper: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: tc.cardBackgroundAlt,
            justifyContent: 'center',
            alignItems: 'center',
        },
        body: {
            padding: 24,
            paddingTop: 0,
            paddingBottom: 32,
            backgroundColor: tc.cardBackground,
        },
        chartArea: {
            width: '100%',
            minHeight: 220,
            backgroundColor: tc.cardBackgroundAlt,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 32,
            marginBottom: 24,
        },
        largeIconBackground: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: tc.cardBackground,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.4 : 0.05,
            shadowRadius: 10,
            elevation: 2,
        },
        emptyChartContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        emptyChartTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: tc.textPrimary,
            textAlign: 'center',
        },
        emptyChartSubtitle: {
            fontSize: 13,
            color: tc.textSecondary,
            marginTop: 8,
            textAlign: 'center',
            lineHeight: 18,
            paddingHorizontal: 24,
        },
        insightsArea: {
            width: '100%',
        },
        sectionLabel: {
            fontSize: 14,
            fontWeight: '800',
            color: tc.textPrimary,
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        insightBox: {
            flexDirection: 'row',
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#F0F7FF',
            padding: 16,
            borderRadius: 16,
            alignItems: 'flex-start',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#DBEAFE',
        },
        insightIconCircle: {
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#3B82F6',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        insightText: {
            flex: 1,
            fontSize: 13,
            color: isDark ? '#93C5FD' : '#1E3A8A',
            marginLeft: 12,
            lineHeight: 19,
            fontWeight: '500',
        },
        statsRow: {
            flexDirection: 'row',
            marginTop: 24,
            justifyContent: 'space-between',
        },
        statItem: {
            flex: 1,
        },
        statLabel: {
            fontSize: 12,
            fontWeight: '700',
            color: tc.textSecondary,
            marginBottom: 8,
            textTransform: 'uppercase',
        },
        statValue: {
            fontSize: 28,
            fontWeight: '800',
            color: tc.textPrimary,
            marginBottom: 4,
        },
        statSubText: {
            fontSize: 12,
            color: '#3B82F6',
            fontWeight: '700',
            textDecorationLine: 'underline',
        },
        statSubTextGreen: {
            fontSize: 12,
            color: '#10B981',
            fontWeight: '700',
            lineHeight: 16,
        },
    });

export default TrendAnalysisModal;
