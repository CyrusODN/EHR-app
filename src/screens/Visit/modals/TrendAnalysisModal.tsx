import React, { useRef, useEffect, useState, useMemo } from 'react';
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
    ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { LineChart } from 'react-native-gifted-charts';

import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { GetPatientVisits } from '../../../Services/Visit.Service';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ScaleConfig {
    key: string;
    name: string;
    maxScore: number;
    clinicalThreshold: number;
    color: string;
}

interface ScaleDataPoint {
    date: string;
    fullDate: string;
    score: number;
}

interface Insight {
    type: 'improvement' | 'warning' | 'observation';
    text: string;
}

interface TrendAnalysisModalProps {
    visible: boolean;
    onClose: () => void;
    patientId?: string;
    totalVisits?: number;
    scalesCompleted?: number;
    loading?: boolean;
}

const SCALE_CONFIGS: ScaleConfig[] = [
    { key: 'hamd', name: 'HAM-D', maxScore: 30, clinicalThreshold: 3, color: '#4A90A0' },
    { key: 'madrs', name: 'MADRS', maxScore: 60, clinicalThreshold: 5, color: '#F59E0B' },
    { key: 'asrs', name: 'ASRS', maxScore: 24, clinicalThreshold: 3, color: '#10B981' },
    { key: 'hama', name: 'HAM-A', maxScore: 56, clinicalThreshold: 4, color: '#8B5CF6' },
    { key: 'isi', name: 'ISI', maxScore: 28, clinicalThreshold: 3, color: '#F97316' },
    { key: 'cars2', name: 'CARS-2', maxScore: 60, clinicalThreshold: 2, color: '#EF4444' },
];

const TrendAnalysisModal = ({
    visible,
    onClose,
    patientId,
    totalVisits = 0,
    scalesCompleted = 0,
    loading = false
}: TrendAnalysisModalProps) => {
    const { t, i18n } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [visits, setVisits] = useState<any[]>([]);
    const [loadingVisits, setLoadingVisits] = useState(false);

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

            if (patientId) {
                fetchVisitData();
            }
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
    }, [visible, patientId]);

    const fetchVisitData = async () => {
        if (!patientId) return;
        setLoadingVisits(true);
        try {
            const response = await GetPatientVisits(patientId);
            if (response?.visits) {
                setVisits(response.visits);
            } else if (Array.isArray(response)) {
                setVisits(response);
            }
        } catch (err) {
            console.error('Error fetching visits for trends:', err);
        } finally {
            setLoadingVisits(false);
        }
    };

    const formatShortDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const monthNames = t('common.monthsShort', { returnObjects: true }) as string[];
        return `${day} ${monthNames[date.getMonth()]}`;
    };

    const extractScaleData = (scaleKey: string): ScaleDataPoint[] => {
        return visits
            .map(visit => {
                let score = 0;
                const scales = visit.interview?.psychiatricScales;
                if (scales?.[scaleKey]) {
                    score = scales[scaleKey];
                }
                if (!score && visit.clinicalAssessments) {
                    const assessment = visit.clinicalAssessments.find((a: any) =>
                        a.code?.coding?.some((c: any) => c.display === scaleKey.toUpperCase())
                    );
                    if (assessment) score = assessment.valueQuantity?.value || 0;
                }
                return {
                    date: formatShortDate(visit.date),
                    fullDate: visit.date,
                    score,
                };
            })
            .filter(d => d.score > 0);
    };

    const scaleDataMap = useMemo(() => {
        const map: Record<string, ScaleDataPoint[]> = {};
        SCALE_CONFIGS.forEach(config => {
            map[config.key] = extractScaleData(config.key);
        });
        return map;
    }, [visits]);

    const availableScales = useMemo(
        () => SCALE_CONFIGS.filter(c => scaleDataMap[c.key]?.length > 0),
        [scaleDataMap]
    );

    const computedTotalVisits = visits.length || totalVisits;
    const computedScalesCompleted = useMemo(
        () => availableScales.reduce((sum, s) => sum + scaleDataMap[s.key].length, 0) || scalesCompleted,
        [availableScales, scaleDataMap, scalesCompleted]
    );

    const clinicalInsights = useMemo((): Insight[] => {
        const insights: Insight[] = [];

        availableScales.forEach(scale => {
            const data = scaleDataMap[scale.key];
            if (data.length >= 2) {
                const latest = data[data.length - 1].score;
                const previous = data[data.length - 2].score;
                const change = previous - latest;
                const percentChange = Math.round((Math.abs(change) / previous) * 100);

                if (change >= scale.clinicalThreshold) {
                    insights.push({
                        type: 'improvement',
                        text: `${scale.name}: ${t('clinicalTrends.insights.improvement', {
                            previous, current: latest, change: percentChange
                        })}`
                    });
                } else if (change <= -scale.clinicalThreshold) {
                    insights.push({
                        type: 'warning',
                        text: `${scale.name}: ${t('clinicalTrends.insights.worsening', {
                            previous, current: latest, change: percentChange
                        })}`
                    });
                } else {
                    insights.push({
                        type: 'observation',
                        text: `${scale.name}: ${t('clinicalTrends.insights.stable', { score: latest })}`
                    });
                }
            }
        });

        if (availableScales.length >= 2) {
            const scaleChanges = availableScales.map(scale => {
                const data = scaleDataMap[scale.key];
                if (data.length >= 2) {
                    return {
                        scale: scale.name,
                        change: data[data.length - 2].score - data[data.length - 1].score,
                        threshold: scale.clinicalThreshold,
                    };
                }
                return null;
            }).filter(Boolean);

            const improving = scaleChanges.filter(s => s!.change >= s!.threshold);
            if (improving.length >= 2) {
                insights.push({
                    type: 'improvement',
                    text: t('clinicalTrends.insights.multiImprovement', {
                        scales: improving.map(s => s!.scale).join(', ')
                    })
                });
            }
        }

        if (insights.length === 0) {
            insights.push({
                type: 'observation',
                text: t('clinicalTrends.insights.noDataAvailable')
            });
        }

        return insights.slice(0, 5);
    }, [availableScales, scaleDataMap, t]);

    const getInsightIcon = (type: string) => {
        switch (type) {
            case 'improvement': return { name: 'trending-up', color: '#22c55e' };
            case 'warning': return { name: 'alert-circle', color: '#f59e0b' };
            default: return { name: 'brain', color: '#3B82F6' };
        }
    };

    const getInsightBg = (type: string) => {
        switch (type) {
            case 'improvement': return isDark ? 'rgba(34, 197, 94, 0.1)' : '#f0fdf4';
            case 'warning': return isDark ? 'rgba(245, 158, 11, 0.1)' : '#fffbeb';
            default: return isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff';
        }
    };

    const isLoading = loading || loadingVisits;

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
                                <Text style={ds.title}>{t('clinicalTrends.header.title')}</Text>
                                <Text style={ds.subtitle}>{t('clinicalTrends.header.subtitle')}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} style={ds.closeBtn}>
                            <View style={ds.closeIconWrapper}>
                                <Feather name="x" size={20} color={tc.textSecondary} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={ds.body} showsVerticalScrollIndicator={false}>
                        {isLoading ? (
                            <View style={ds.loadingContainer}>
                                <ActivityIndicator size="large" color="#58A7B3" />
                            </View>
                        ) : (
                            <>
                                {/* Scale Charts */}
                                {availableScales.length > 0 ? (
                                    availableScales.map(scale => {
                                        const data = scaleDataMap[scale.key];
                                        const chartData = data.map(d => ({
                                            value: d.score,
                                            label: d.date,
                                            dataPointText: String(d.score),
                                        }));

                                        return (
                                            <View key={scale.key} style={ds.chartCard}>
                                                <Text style={ds.chartTitle}>
                                                    {scale.name} {t('clinicalTrends.scaleLabel')}
                                                </Text>
                                                <View style={ds.chartContainer}>
                                                    <LineChart
                                                        data={chartData}
                                                        width={wp(78)}
                                                        height={160}
                                                        color={scale.color}
                                                        dataPointsColor={scale.color}
                                                        dataPointsRadius={4}
                                                        thickness={2}
                                                        startFillColor={scale.color + '30'}
                                                        endFillColor={scale.color + '05'}
                                                        areaChart
                                                        curved
                                                        yAxisColor={tc.borderColor}
                                                        xAxisColor={tc.borderColor}
                                                        yAxisTextStyle={{ color: tc.textMuted, fontSize: 10 }}
                                                        xAxisLabelTextStyle={{ color: tc.textMuted, fontSize: 9, width: 40 }}
                                                        maxValue={scale.maxScore}
                                                        noOfSections={4}
                                                        textColor={tc.textPrimary}
                                                        textFontSize={10}
                                                        rulesColor={tc.borderColor}
                                                        spacing={data.length > 5 ? 50 : 60}
                                                        isAnimated
                                                    />
                                                </View>
                                            </View>
                                        );
                                    })
                                ) : (
                                    <View style={ds.emptyChartContainer}>
                                        <View style={ds.largeIconBackground}>
                                            <MaterialCommunityIcons name="brain" size={50} color={isDark ? '#475569' : '#CBD5E1'} />
                                        </View>
                                        <Text style={ds.emptyChartTitle}>{t('clinicalTrends.charts.noData')}</Text>
                                        <Text style={ds.emptyChartSubtitle}>{t('clinicalTrends.insights.noDataAvailable')}</Text>
                                    </View>
                                )}

                                {/* AI Insights */}
                                <View style={ds.insightsArea}>
                                    <Text style={ds.sectionLabel}>{t('clinicalTrends.insights.title')}</Text>
                                    {clinicalInsights.map((insight, index) => {
                                        const icon = getInsightIcon(insight.type);
                                        const bgColor = getInsightBg(insight.type);
                                        return (
                                            <View key={index} style={[ds.insightBox, { backgroundColor: bgColor }]}>
                                                {insight.type === 'observation' ? (
                                                    <MaterialCommunityIcons name="brain" size={18} color={icon.color} style={{ marginTop: 2 }} />
                                                ) : (
                                                    <Feather name={icon.name as any} size={18} color={icon.color} style={{ marginTop: 2 }} />
                                                )}
                                                <Text style={[ds.insightText, { color: isDark ? icon.color : '#1e293b' }]}>
                                                    {insight.text}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>

                                {/* Stats Row */}
                                <View style={ds.statsRow}>
                                    <View style={ds.statItem}>
                                        <Text style={ds.statLabel}>{t('clinicalTrends.metrics.totalVisits.title')}</Text>
                                        <Text style={ds.statValue}>{computedTotalVisits}</Text>
                                        <Text style={ds.statSubText}>{t('clinicalTrends.metrics.totalVisits.description')}</Text>
                                    </View>
                                    <View style={ds.statItem}>
                                        <Text style={ds.statLabel}>{t('clinicalTrends.metrics.scalesCompleted.title')}</Text>
                                        <Text style={ds.statValue}>{computedScalesCompleted}</Text>
                                        <Text style={ds.statSubTextGreen}>{t('clinicalTrends.metrics.scalesCompleted.description')}</Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </ScrollView>
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
            maxHeight: hp(85),
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
            paddingHorizontal: 24,
            paddingBottom: 32,
            backgroundColor: tc.cardBackground,
        },
        loadingContainer: {
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
        },
        chartCard: {
            backgroundColor: tc.cardBackgroundAlt,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
        },
        chartTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.textPrimary,
            marginBottom: 12,
        },
        chartContainer: {
            alignItems: 'center',
            overflow: 'hidden',
        },
        emptyChartContainer: {
            width: '100%',
            minHeight: 200,
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
            marginTop: 8,
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
            padding: 14,
            borderRadius: 12,
            alignItems: 'flex-start',
            marginBottom: 10,
        },
        insightText: {
            flex: 1,
            fontSize: 13,
            marginLeft: 10,
            lineHeight: 19,
            fontWeight: '500',
        },
        statsRow: {
            flexDirection: 'row',
            marginTop: 24,
            marginBottom: 8,
            justifyContent: 'space-between',
        },
        statItem: {
            flex: 1,
            backgroundColor: tc.cardBackgroundAlt,
            padding: 16,
            borderRadius: 12,
            marginHorizontal: 4,
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
        },
        statSubTextGreen: {
            fontSize: 12,
            color: '#10B981',
            fontWeight: '700',
            lineHeight: 16,
        },
    });

export default TrendAnalysisModal;
