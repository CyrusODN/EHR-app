import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LineChart, BarChart, PieChart } from "react-native-gifted-charts";
import PrimaryButton from '../../../component/button';
import Gap from '../../../component/gap';
import { Dropdown } from 'react-native-element-dropdown';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

import { getVisitStatistics, getClinicalStatistics, getDemographicsStatistics, getSummaryStatistics, getReferralStatistics } from '../../../Services/Statistics.Service';

const { width } = Dimensions.get('window');

const StatisticalAnalysis = () => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const [activeTab, setActiveTab] = useState('Overview');
    const [timeframe, setTimeframe] = useState('Last Month');
    const [loading, setLoading] = useState(false);
    
    const [visitData, setVisitData] = useState<any>(null);
    const [clinicalData, setClinicalData] = useState<any>(null);
    const [demographicsData, setDemographicsData] = useState<any>(null);
    const [summaryData, setSummaryData] = useState<any>(null);
    const [referralData, setReferralData] = useState<any>(null);

    const timeframeOptions = [
        { label: t('aiAssistant.statisticalAnalysis.lastMonth'), value: 'Last Month' },
        { label: t('aiAssistant.statisticalAnalysis.lastQuarter'), value: 'Last Quarter' },
        { label: t('aiAssistant.statisticalAnalysis.lastYear'), value: 'Last Year' },
    ];

    const tabs = ['Overview', 'Clinical', 'Demographics', 'Referrals'];

    React.useEffect(() => {
        fetchStatistics();
    }, [timeframe]);

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const endDate = new Date().toISOString();
            let startDate = new Date();
            
            if (timeframe === 'Last Month') {
                startDate.setMonth(startDate.getMonth() - 1);
            } else if (timeframe === 'Last Quarter') {
                startDate.setMonth(startDate.getMonth() - 3);
            } else if (timeframe === 'Last Year') {
                startDate.setFullYear(startDate.getFullYear() - 1);
            }
            
            const startIso = startDate.toISOString();

            const [visitsRes, clinicalRes, demographicsRes, summaryRes, referralRes]: [any, any, any, any, any] = await Promise.all([
                getVisitStatistics(startIso, endDate),
                getClinicalStatistics(startIso, endDate),
                getDemographicsStatistics(),
                getSummaryStatistics(),
                getReferralStatistics(startIso, endDate)
            ]);

            if (visitsRes) setVisitData(visitsRes);
            if (clinicalRes) setClinicalData(clinicalRes);
            if (demographicsRes) setDemographicsData(demographicsRes);
            if (summaryRes) setSummaryData(summaryRes);
            if (referralRes) setReferralData(referralRes);

        } catch (error) {
            console.error("[StatisticalAnalysis] Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // ─── Mapping API Data to Charts ───
    
    const visitsLineData = React.useMemo(() => {
        if (!visitData?.dailyTrend?.length) return [{ value: 0, label: '' }];
        return visitData.dailyTrend.map((item: any) => ({
            value: item.count,
            label: item._id.split('-').slice(1).join('/') // simplify date MM/DD
        }));
    }, [visitData]);

    const visitStatusData = React.useMemo(() => {
        if (!visitData?.statusDistribution?.length) return [{ value: 0, color: '#E5E7EB', text: 'no data' }];
        const colors = ['#3B82F6', '#10B981', '#FBBF24', '#EF4444'];
        return visitData.statusDistribution.map((item: any, idx: number) => ({
            value: item.count,
            color: colors[idx % colors.length],
            text: item._id,
            label: item._id,
        }));
    }, [visitData]);

    const visitTypeData = React.useMemo(() => {
        if (!visitData?.visitTypeDistribution?.length) return [{ value: 0, label: '', frontColor: '#E5E7EB' }];
        const colors = ['#67B7B1', '#4A90B9', '#A855F7'];
        return visitData.visitTypeDistribution.map((item: any, idx: number) => ({
            value: item.count,
            label: item._id,
            frontColor: colors[idx % colors.length]
        }));
    }, [visitData]);

    const modalityData = React.useMemo(() => {
        if (!visitData?.modalityDistribution?.length) return [{ value: 0, color: '#E5E7EB', text: 'no data' }];
        return visitData.modalityDistribution.map((item: any) => ({
            value: item.count,
            color: item._id ? '#10B981' : '#3B82F6',
            text: item._id ? 'Online' : 'In-person'
        }));
    }, [visitData]);

    const genderData = React.useMemo(() => {
        if (!demographicsData?.genderDistribution?.length) return [{ value: 0, color: '#E5E7EB', text: 'no data' }];
        return demographicsData.genderDistribution.map((item: any) => ({
            value: item.count,
            color: item._id === 'male' ? '#10B981' : '#3B82F6',
            text: item._id
        }));
    }, [demographicsData]);

    const ageGroupData = React.useMemo(() => {
        if (!demographicsData?.ageDistribution?.length) return [{ value: 0, label: '', frontColor: '#E5E7EB' }];
        
        const ageLabels: { [key: number]: string } = {
            0: '0-18',
            1: '19-35',
            2: '36-50',
            3: '51-65',
            4: '65+'
        };

        return demographicsData.ageDistribution.map((item: any) => ({
            value: item.count,
            label: ageLabels[item._id] || `Group ${item._id}`,
            frontColor: '#F97316'
        }));
    }, [demographicsData]);

    const cityData = React.useMemo(() => {
        if (!demographicsData?.cityDistribution?.length) return [{ value: 0, label: '', frontColor: '#E5E7EB' }];
        const colors = ['#67B7B1', '#4A90B9', '#A855F7', '#FBBF24'];
        return demographicsData.cityDistribution.map((item: any, idx: number) => ({
            value: item.count,
            label: item._id,
            frontColor: colors[idx % colors.length]
        }));
    }, [demographicsData]);

    const referralStatusData = React.useMemo(() => {
        if (!referralData?.statusDistribution?.length) return [{ value: 0, color: '#E5E7EB', text: 'no data' }];
        const colors = ['#3B82F6', '#10B981', '#FBBF24', '#EF4444'];
        return referralData.statusDistribution.map((item: any, idx: number) => ({
            value: item.count,
            color: colors[idx % colors.length],
            text: item._id
        }));
    }, [referralData]);

    const topSpecializationsData = React.useMemo(() => {
        if (!referralData?.specializationDistribution?.length) return [{ value: 0, label: '', frontColor: '#CCFBF1' }];
        return referralData.specializationDistribution.map((item: any) => ({
            value: item.count,
            label: item._id,
            frontColor: '#FBBF24'
        }));
    }, [referralData]);

    // ─── Render Functions ───

    const renderHeader = () => (
        <View style={ds.header}>
            <View>
                <Text style={ds.headerTitle}>{t('aiAssistant.statisticalAnalysis.title')}</Text>
                <Text style={ds.headerSubtitle}>{t('aiAssistant.statisticalAnalysis.subtitle')}</Text>
            </View>
            <Gap height={15} />
            <View style={ds.headerActions}>
                <Dropdown
                    style={ds.timeframeDropdown}
                    placeholderStyle={ds.dropdownPlaceholder}
                    selectedTextStyle={ds.dropdownSelectedText}
                    containerStyle={ds.dropdownContainer}
                    itemTextStyle={ds.dropdownItemText}
                    activeColor={isDark ? 'rgba(74, 144, 185, 0.2)' : '#EBF5FF'}
                    data={timeframeOptions}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={t('aiAssistant.statisticalAnalysis.select')}
                    value={timeframe}
                    onChange={item => setTimeframe(item.value)}
                />
                <TouchableOpacity style={ds.exportBtn}>
                    <Feather name="download" size={16} color={tc.accent} />
                    <Text style={ds.exportBtnText}>{t('aiAssistant.statisticalAnalysis.exportReport')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderKpiCards = () => (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={ds.kpiContainer}
            contentContainerStyle={{ paddingRight: 30 }}
        >
            <View style={ds.kpiCard}>
                <View style={[ds.kpiIconBox, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#DBEAFE' }]}>
                    <MaterialCommunityIcons name="pulse" size={20} color="#3B82F6" />
                </View>
                <MaterialCommunityIcons name="pulse" size={80} color="#3B82F6" style={ds.kpiBgIcon} />
                <Text style={ds.kpiLabel}>{t('aiAssistant.statisticalAnalysis.totalVisits')}</Text>
                <Text style={ds.kpiValue}>{summaryData?.totalVisits || 0}</Text>
                <Text style={ds.kpiComparison}>{t('aiAssistant.statisticalAnalysis.overallTotal')}</Text>
            </View>

            <View style={ds.kpiCard}>
                <View style={[ds.kpiIconBox, { backgroundColor: isDark ? 'rgba(168, 85, 247, 0.15)' : '#F3E8FF' }]}>
                    <Ionicons name="people-outline" size={20} color="#A855F7" />
                </View>
                <Ionicons name="people-outline" size={80} color="#A855F7" style={ds.kpiBgIcon} />
                <Text style={ds.kpiLabel}>{t('aiAssistant.statisticalAnalysis.totalPatients')}</Text>
                <Text style={ds.kpiValue}>{summaryData?.totalPatients || 0}</Text>
                <Text style={ds.kpiComparison}>{t('aiAssistant.statisticalAnalysis.uniquePatients')}</Text>
            </View>

            <View style={ds.kpiCard}>
                <View style={[ds.kpiIconBox, { backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#FFF7ED' }]}>
                    <Feather name="file-text" size={20} color="#EA580C" />
                </View>
                <Feather name="file-text" size={80} color="#EA580C" style={ds.kpiBgIcon} />
                <Text style={ds.kpiLabel}>{t('aiAssistant.statisticalAnalysis.referrals')}</Text>
                <Text style={ds.kpiValue}>{summaryData?.totalReferrals || 0}</Text>
                <Text style={ds.kpiComparison}>{t('aiAssistant.statisticalAnalysis.totalReferrals')}</Text>
            </View>

            <View style={ds.kpiCard}>
                <View style={[ds.kpiIconBox, { backgroundColor: isDark ? 'rgba(22, 163, 74, 0.15)' : '#F0FDF4' }]}>
                    <Feather name="calendar" size={20} color="#16A34A" />
                </View>
                <Feather name="calendar" size={80} color="#16A34A" style={ds.kpiBgIcon} />
                <Text style={ds.kpiLabel}>{t('aiAssistant.statisticalAnalysis.todaysVisits')}</Text>
                <Text style={ds.kpiValue}>{summaryData?.todayVisits || 0}</Text>
                <Text style={ds.kpiComparison}>{t('aiAssistant.statisticalAnalysis.scheduledForToday')}</Text>
            </View>
        </ScrollView>
    );

    const renderTabs = () => (
        <View style={ds.tabBarContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ds.tabBar}>
                {tabs.map(tab => (
                    <TouchableOpacity 
                        key={tab} 
                        style={[ds.tabItem, activeTab === tab && ds.activeTabItem]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <View style={ds.tabContent}>
                            {tab === 'Overview' && <MaterialCommunityIcons name="pulse" size={18} color={activeTab === tab ? tc.accent : tc.textMuted} />}
                            {tab === 'Clinical' && <Feather name="file-text" size={18} color={activeTab === tab ? tc.accent : tc.textMuted} />}
                            {tab === 'Demographics' && <Ionicons name="people-outline" size={18} color={activeTab === tab ? tc.accent : tc.textMuted} />}
                            {tab === 'Referrals' && <Feather name="calendar" size={18} color={activeTab === tab ? tc.accent : tc.textMuted} />}
                            <Gap width={8} />
                            <Text style={[ds.tabText, activeTab === tab && ds.activeTabText]}>
                                {tab === 'Overview' ? t('aiAssistant.statisticalAnalysis.tabs.overview') :
                                 tab === 'Clinical' ? t('aiAssistant.statisticalAnalysis.tabs.clinical') :
                                 tab === 'Demographics' ? t('aiAssistant.statisticalAnalysis.tabs.demographics') :
                                 t('aiAssistant.statisticalAnalysis.tabs.referrals')}
                            </Text>
                        </View>
                        {activeTab === tab && <View style={ds.tabIndicator} />}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderOverview = () => (
        <View>
            <View style={ds.chartCard}>
                <Text style={ds.chartTitle}>{t('aiAssistant.statisticalAnalysis.charts.visitsOverTime')}</Text>
                <Gap height={20} />
                <LineChart
                    areaChart
                    data={visitsLineData}
                    height={200}
                    width={wp(75)}
                    spacing={wp(10)}
                    initialSpacing={10}
                    color="#3B82F6"
                    thickness={3}
                    startFillColor="rgba(59, 130, 246, 0.4)"
                    endFillColor="rgba(59, 130, 246, 0.01)"
                    startOpacity={0.9}
                    endOpacity={0.2}
                    noOfSections={4}
                    yAxisColor={tc.borderSubtle}
                    yAxisThickness={1}
                    rulesType="dashed"
                    rulesColor={tc.borderSubtle}
                    yAxisTextStyle={{ color: tc.textMuted, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: tc.textMuted, fontSize: 10 }}
                />
            </View>

            <View style={ds.chartCard}>
                <Text style={ds.chartTitle}>{t('aiAssistant.statisticalAnalysis.charts.visitStatus')}</Text>
                <Gap height={40} />
                <View style={ds.donutContainer}>
                    <PieChart
                        donut
                        innerRadius={65}
                        radius={90}
                        data={visitStatusData}
                        backgroundColor={tc.cardBackground}
                    />
                </View>
                <Gap height={40} />
                <View style={ds.legendContainerRow}>
                    {visitStatusData.map((item: any, idx: number) => (
                        <View key={idx} style={ds.legendItem}>
                            <View style={[ds.legendSquare, { backgroundColor: item.color }]} />
                            <Text style={[ds.legendText, { color: item.color }]}>{item.text}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={ds.chartCard}>
                <Text style={ds.chartTitle}>{t('aiAssistant.statisticalAnalysis.charts.visitTypes')}</Text>
                <Gap height={20} />
                <BarChart
                    data={visitTypeData}
                    barWidth={wp(20)}
                    noOfSections={4}
                    barBorderRadius={6}
                    yAxisThickness={1}
                    xAxisThickness={1}
                    width={wp(75)}
                    yAxisColor={tc.borderSubtle}
                    xAxisColor={tc.borderSubtle}
                    rulesColor={tc.borderSubtle}
                    yAxisTextStyle={{ color: tc.textMuted, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: tc.textMuted, fontSize: 11, textAlign: 'center' }}
                />
            </View>

            <View style={ds.chartCard}>
                <Text style={ds.chartTitle}>{t('aiAssistant.statisticalAnalysis.charts.modalityDistribution')}</Text>
                <Gap height={20} />
                <PieChart
                    radius={80}
                    data={modalityData}
                    showValuesAsLabels
                    showText
                    textColor="white"
                    textSize={12}
                    backgroundColor={tc.cardBackground}
                />
                <View style={ds.legendContainerRow}>
                    {modalityData.map((item: any, idx: number) => (
                        <View key={idx} style={ds.legendItem}>
                            <View style={[ds.legendSquare, { backgroundColor: item.color }]} />
                            <Text style={ds.legendText}>{item.text}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const renderClinical = () => (
        <View style={ds.chartCard}>
            <Text style={ds.chartTitle}>{t('aiAssistant.statisticalAnalysis.charts.topDiagnoses')}</Text>
            {clinicalData?.topDiagnoses?.length > 0 ? (
                <View style={{ width: '100%', marginTop: 20 }}>
                     {/* Map handles clinical labels later */}
                </View>
            ) : (
                <View style={ds.emptyChartState}>
                    <Text style={{ color: tc.textMuted }}>{t('aiAssistant.statisticalAnalysis.charts.noDiagnosisData')}</Text>
                    <View style={ds.emptyPlaceholderLine} />
                </View>
            )}
        </View>
    );

    const renderDemographics = () => (
        <View>
            <View style={ds.chartGrid}>
                <View style={ds.smallChartCard}>
                    <Text style={ds.chartTitle}>{t('aiAssistant.statisticalAnalysis.charts.genderDistribution')}</Text>
                    <Gap height={20} />
                    <PieChart
                        radius={70}
                        data={genderData}
                        showValuesAsLabels
                        showText
                        textColor="white"
                        textSize={12}
                        backgroundColor={tc.cardBackground}
                    />
                    <View style={ds.legendContainerRow}>
                        {genderData.map((item: any, idx: number) => (
                            <View key={idx} style={ds.legendItem}>
                                <View style={[ds.legendSquare, { backgroundColor: item.color }]} />
                                <Text style={ds.legendText}>{item.text}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={ds.smallChartCard}>
                    <Text style={ds.chartTitle}>{t('aiAssistant.statisticalAnalysis.charts.ageGroups')}</Text>
                    <Gap height={20} />
                    <BarChart
                        data={ageGroupData}
                        barWidth={wp(18)}
                        noOfSections={4}
                        barBorderRadius={4}
                        yAxisThickness={1}
                        xAxisThickness={1}
                        yAxisColor={tc.borderSubtle}
                        xAxisColor={tc.borderSubtle}
                        rulesColor={tc.borderSubtle}
                        yAxisTextStyle={{ color: tc.textMuted, fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: tc.textMuted, fontSize: 10, textAlign: 'center' }}
                    />
                </View>
            </View>

            <View style={ds.chartCard}>
                <Text style={ds.chartTitle}>{t('aiAssistant.statisticalAnalysis.charts.patientsByCity')}</Text>
                <Gap height={20} />
                <BarChart
                    data={cityData}
                    barWidth={wp(12)}
                    noOfSections={4}
                    barBorderRadius={4}
                    yAxisThickness={1}
                    xAxisThickness={1}
                    width={wp(70)}
                    yAxisColor={tc.borderSubtle}
                    xAxisColor={tc.borderSubtle}
                    rulesColor={tc.borderSubtle}
                    yAxisTextStyle={{ color: tc.textMuted, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: tc.textMuted, fontSize: 9, textAlign: 'center' }}
                />
            </View>
        </View>
    );

    const renderReferralsTab = () => (
        <View style={ds.chartGrid}>
            <View style={ds.smallChartCard}>
                <Text style={ds.chartTitle}>{t('aiAssistant.statisticalAnalysis.charts.referralStatus')}</Text>
                <Gap height={20} />
                <View style={ds.donutContainer}>
                    <PieChart
                        donut
                        innerRadius={40}
                        radius={60}
                        data={referralStatusData}
                        backgroundColor={tc.cardBackground}
                        centerLabelComponent={() => (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name="stats-chart" size={20} color={tc.accent} />
                            </View>
                        )}
                    />
                </View>
                <View style={ds.legendContainer}>
                    <View style={ds.legendItem}>
                        <View style={[ds.legendSquare, { backgroundColor: '#3B82F6' }]} />
                        <Text style={ds.legendText}>{t('aiAssistant.statisticalAnalysis.charts.pending')}</Text>
                    </View>
                </View>
            </View>

            <View style={ds.smallChartCard}>
                <Text style={ds.chartTitle}>{t('aiAssistant.statisticalAnalysis.charts.topSpecializations')}</Text>
                <Gap height={20} />
                <View style={{ marginLeft: -20 }}>
                    <BarChart
                        horizontal
                        data={topSpecializationsData}
                        barWidth={30}
                        noOfSections={3}
                        barBorderRadius={4}
                        yAxisThickness={1}
                        xAxisThickness={1}
                        width={wp(20)}
                        yAxisLabelWidth={wp(15)}
                        yAxisColor={tc.borderSubtle}
                        xAxisColor={tc.borderSubtle}
                        rulesColor={tc.borderSubtle}
                        yAxisTextStyle={{ color: tc.textMuted, fontSize: 9 }}
                        xAxisLabelTextStyle={{ color: tc.textMuted, fontSize: 9 }}
                    />
                </View>
            </View>
        </View>
    );

    return (
        <ScrollView style={ds.container} showsVerticalScrollIndicator={false}>
            <View style={ds.content}>
                {renderHeader()}
                <Gap height={20} />
                {renderKpiCards()}
                <Gap height={30} />
                {renderTabs()}
                <Gap height={20} />
                {loading && (
                    <View style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 10 }}>
                        <Animated.View style={{ transform: [{ translateX: -20 }, { translateY: -20 }] }}>
                            <MaterialCommunityIcons name="loading" size={40} color={tc.accent} />
                        </Animated.View>
                    </View>
                )}
                {activeTab === 'Overview' && renderOverview()}
                {activeTab === 'Clinical' && renderClinical()}
                {activeTab === 'Demographics' && renderDemographics()}
                {activeTab === 'Referrals' && renderReferralsTab()}
                <Gap height={hp(10)} />
            </View>
        </ScrollView>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    content: {
        padding: 20,
    },
    header: {
        flexDirection: 'column',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    headerSubtitle: {
        fontSize: 14,
        color: tc.textSecondary,
        marginTop: 4,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    timeframeDropdown: {
        width: '48%',
        height: 40,
        backgroundColor: tc.cardBackground,
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: tc.borderSubtle,
    },
    dropdownPlaceholder: {
        fontSize: 14,
        color: tc.textMuted,
    },
    dropdownSelectedText: {
        fontSize: 14,
        color: tc.textPrimary,
    },
    dropdownContainer: {
        backgroundColor: tc.cardBackground,
        borderWidth: 1,
        borderColor: tc.borderSubtle,
        borderRadius: 8,
    },
    dropdownItemText: {
        fontSize: 14,
        color: tc.textPrimary,
    },
    exportBtn: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tc.cardBackground,
        borderWidth: 1,
        borderColor: tc.accent,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 40,
    },
    exportBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.accent,
        marginLeft: 6,
    },
    kpiContainer: {
        marginTop: 10,
    },
    kpiCard: {
        width: 180,
        backgroundColor: tc.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginRight: 15,
        borderWidth: 1,
        borderColor: tc.borderSubtle,
        elevation: 2,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 10,
        overflow: 'hidden',
    },
    kpiIconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    kpiBgIcon: {
        position: 'absolute',
        top: 20,
        right: -10,
        opacity: isDark ? 0.08 : 0.05,
    },
    kpiLabel: {
        fontSize: 14,
        color: tc.textSecondary,
        fontWeight: '600',
    },
    kpiValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: tc.textPrimary,
        marginVertical: 4,
    },
    kpiComparison: {
        fontSize: 12,
        color: tc.textMuted,
    },
    tabBarContainer: {
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
        marginBottom: 20,
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: 5,
    },
    tabItem: {
        marginRight: 30,
        paddingBottom: 10,
    },
    activeTabItem: {
        // Additional styling for active tab item container if needed
    },
    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textMuted,
    },
    activeTabText: {
        color: tc.accent,
    },
    tabIndicator: {
        position: 'absolute',
        bottom: -1,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: tc.accent,
    },
    chartCard: {
        backgroundColor: tc.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: tc.borderSubtle,
        alignItems: 'center',
    },
    chartGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smallChartCard: {
        width: '48%',
        backgroundColor: tc.cardBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: tc.borderSubtle,
        alignItems: 'center',
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: tc.textPrimary,
        width: '100%',
        textAlign: 'left',
    },
    donutContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    legendContainer: {
        marginTop: 15,
    },
    legendContainerRow: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    legendSquare: {
        width: 14,
        height: 14,
        borderRadius: 2,
        marginRight: 8,
    },
    legendText: {
        fontSize: 16,
        color: tc.textSecondary,
        fontWeight: '500',
    },
    emptyChartState: {
        height: 200,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyPlaceholderLine: {
        width: '90%',
        height: 1,
        backgroundColor: tc.borderSubtle,
        borderStyle: 'dashed',
        borderWidth: 1,
    }
});

export default StatisticalAnalysis;
