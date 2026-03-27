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
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <TouchableOpacity 
                    style={styles.dismissArea} 
                    activeOpacity={1} 
                    onPress={onClose} 
                />
                <Animated.View 
                    style={[
                        styles.modalContainer, 
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.header}>
                        <View style={styles.headerTitleContainer}>
                            <View style={styles.headerIconContainer}>
                                <MaterialCommunityIcons name="brain" size={26} color="#58A7B3" />
                            </View>
                            <View>
                                <Text style={styles.title}>{t('trends.title')}</Text>
                                <Text style={styles.subtitle}>{t('trends.subtitle')}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <View style={styles.closeIconWrapper}>
                                <Feather name="x" size={20} color="#64748B" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.body}>
                        {/* Top: Chart/Empty State Area */}
                        <View style={styles.chartArea}>
                            <View style={styles.emptyChartContainer}>
                                <View style={styles.largeIconBackground}>
                                    <MaterialCommunityIcons name="brain" size={50} color="#CBD5E1" />
                                </View>
                                <Text style={styles.emptyChartTitle}>{t('trends.emptyTitle')}</Text>
                                <Text style={styles.emptyChartSubtitle}>{t('trends.emptySubtitle')}</Text>
                            </View>
                        </View>

                        {/* Bottom: Insights & Stats */}
                        <View style={styles.insightsArea}>
                            <Text style={styles.sectionLabel}>{t('trends.aiInsights')}</Text>
                            <View style={styles.insightBox}>
                                <View style={styles.insightIconCircle}>
                                    <MaterialCommunityIcons name="brain" size={18} color="#3B82F6" />
                                </View>
                                {loading ? (
                                    <ActivityIndicator size="small" color="#3B82F6" style={{marginLeft: 12}} />
                                ) : (
                                    <Text style={styles.insightText}>
                                        {scalesCompleted > 0 
                                            ? t('trends.analyzing', { count: totalVisits })
                                            : t('trends.insufficientData')}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.statsRow}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>{t('trends.totalVisits')}</Text>
                                    <Text style={styles.statValue}>{loading ? '...' : totalVisits}</Text>
                                    <TouchableOpacity>
                                        <Text style={styles.statSubText}>{t('trends.visitHistory')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>{t('trends.scalesCompleted')}</Text>
                                    <Text style={styles.statValue}>{loading ? '...' : scalesCompleted}</Text>
                                    <TouchableOpacity>
                                        <Text style={styles.statSubTextGreen}>{t('trends.combinedScales')}</Text>
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

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dismissArea: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 24,
        width: wp(94),
        maxWidth: 720,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.15,
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
        backgroundColor: '#E2F2F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    title: {
        fontSize: 19,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        color: '#64748B',
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
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        padding: 24,
        paddingTop: 0,
        paddingBottom: 32,
    },
    chartArea: {
        width: '100%',
        minHeight: 220,
        backgroundColor: '#F8FAFC',
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
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
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
        color: '#475569',
        textAlign: 'center',
    },
    emptyChartSubtitle: {
        fontSize: 13,
        color: '#94A3B8',
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
        color: '#1E293B',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    insightBox: {
        flexDirection: 'row',
        backgroundColor: '#F0F7FF',
        padding: 16,
        borderRadius: 16,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    insightIconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
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
        color: '#1E3A8A',
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
        color: '#64748B',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    statValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0F172A',
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
