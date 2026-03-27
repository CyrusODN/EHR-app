import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import TrendAnalysisModal from './modals/TrendAnalysisModal';
import { GetPatientVisits } from '../../Services/Visit.Service';
import { useTranslation } from 'react-i18next';

interface VisitProfileProps {
    onNext: () => void;
    onBack: () => void;
    patientData?: any;
    medicalData?: any;
    previousVisits?: any[];
    totalPreviousVisits?: number;
    loading?: boolean;
}

const VisitProfile = ({ 
    onNext, 
    onBack, 
    patientData, 
    medicalData, 
    previousVisits = [], 
    totalPreviousVisits = 0,
    loading 
}: VisitProfileProps) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('Basic Information');
    const [showTrendModal, setShowTrendModal] = useState(false);
    const [trendData, setTrendData] = useState<any>(null);
    const [loadingTrends, setLoadingTrends] = useState(false);
    const [expandedVisitIndex, setExpandedVisitIndex] = useState<number | null>(null);

    const formatVisitDate = useCallback((dateStr: string) => {
        if (!dateStr) return t('visit.history_labels.noData');
        const date = new Date(dateStr);
        const day = date.getDate();
        const months = t('common.months', { returnObjects: true }) as string[];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }, [t]);

    const formatTime = useCallback((timeStr: string) => {
        if (!timeStr) return '';
        // If it's already a plain time string like "13:00", return as-is
        if (/^\d{1,2}:\d{2}$/.test(timeStr)) return timeStr;
        // Otherwise try to parse as a date
        const date = new Date(timeStr);
        if (isNaN(date.getTime())) return timeStr;
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }, []);

    const handleTrendPress = async () => {
        setShowTrendModal(true);
        const patientId = patientData?.id || patientData?._id;
        if (!patientId) return;

        setLoadingTrends(true);
        try {
            const result = await GetPatientVisits(patientId);
            const data = result?.data || result;
            if (data) {
                // Calculate scales completed
                let scalesCount = 0;
                if (data.visits) {
                    data.visits.forEach((v: any) => {
                        if (v.recommendations?.scales && Array.isArray(v.recommendations.scales)) {
                            scalesCount += v.recommendations.scales.length;
                        }
                    });
                }
                setTrendData({
                    total: data.total || data.visits?.length || 0,
                    scalesCount: scalesCount
                });
            }
        } catch (error) {
            console.error("Error fetching trend data:", error);
        } finally {
            setLoadingTrends(false);
        }
    };

    const renderBasicInfo = () => (
        <View style={styles.cardContent}>
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.label}>{t('common.patient')}</Text>
                    <Text style={styles.value}>{patientData?.name || patientData?.firstName || t('visit.history_labels.noData')}</Text>

                    <Text style={[styles.label, { marginTop: 20 }]}>{t('visit.profile.pesel')}</Text>
                    <Text style={styles.value}>{patientData?.pesel || t('visit.history_labels.noData')}</Text>

                    <Text style={[styles.label, { marginTop: 20 }]}>{t('visit.profile.dateOfBirth')}</Text>
                    <Text style={styles.value}>{patientData?.dob ? new Date(patientData.dob).toLocaleDateString() : t('visit.history_labels.noData')}</Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.label}>{t('visit.profile.allergies')}</Text>
                    <View style={styles.allergyContainer}>
                        {medicalData?.allergies && medicalData.allergies.length > 0 ? (
                            medicalData.allergies.map((allergy: any, index: number) => (
                                <View key={index} style={styles.allergyBadge}>
                                    <Text style={styles.allergyText}>{allergy.name || allergy}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.subtitle}>{t('visit.profile.noAllergies')}</Text>
                        )}
                    </View>

                    <Text style={[styles.label, { marginTop: 20 }]}>{t('visit.profile.chronicDiseases')}</Text>
                    <View>
                        {medicalData?.chronicConditions && medicalData.chronicConditions.length > 0 ? (
                            medicalData.chronicConditions.map((condition: any, index: number) => (
                                <Text key={index} style={styles.value}>{condition.name || condition}</Text>
                            ))
                        ) : (
                            <Text style={styles.subtitle}>{t('visit.profile.noDiseases')}</Text>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );

    const toggleVisitExpand = useCallback((index: number) => {
        setExpandedVisitIndex(prev => prev === index ? null : index);
    }, []);

    const renderVisitHistory = () => (
        <View style={styles.cardContent}>
            <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>{t('visit.profile.history')}</Text>
                <Text style={styles.historyCount}>{t('visit.profile.history_total', { total: totalPreviousVisits })}</Text>
            </View>
            {previousVisits && previousVisits.length > 0 ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {previousVisits.map((visit, index) => {
                        const isExpanded = expandedVisitIndex === index;
                        const startTime = visit.startTime;
                        const endTime = visit.endTime;
                        const timeRange = startTime && endTime
                            ? `${formatTime(startTime)} - ${formatTime(endTime)}`
                            : startTime
                                ? formatTime(startTime)
                                : '';

                        return (
                            <View key={index} style={[
                                styles.visitCard,
                                isExpanded && styles.visitCardExpanded,
                            ]}>
                                {/* Visit Header - always visible */}
                                <TouchableOpacity
                                    style={[
                                        styles.visitCardHeader,
                                        isExpanded && styles.visitCardHeaderExpanded,
                                    ]}
                                    onPress={() => toggleVisitExpand(index)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.visitCardLeft}>
                                        <View style={styles.calendarIconWrap}>
                                            <Feather name="calendar" size={18} color="#58A7B3" />
                                        </View>
                                        <View style={styles.visitCardInfo}>
                                            <Text style={styles.visitCardDate}>
                                                {formatVisitDate(visit.date)}
                                            </Text>
                                            <Text style={styles.visitCardType}>
                                                {visit.visitType || 'public'}
                                            </Text>
                                            {timeRange ? (
                                                <Text style={styles.visitCardTime}>
                                                    {timeRange}
                                                </Text>
                                            ) : null}
                                        </View>
                                    </View>
                                    <View style={styles.visitCardRight}>
                                        <View style={styles.statusBadge}>
                                            <Text style={styles.statusBadgeText}>
                                                {visit.status || 'scheduled'}
                                            </Text>
                                        </View>
                                        <Feather
                                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                            size={20}
                                            color="#64748B"
                                            style={{ marginLeft: 8 }}
                                        />
                                    </View>
                                </TouchableOpacity>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <View style={styles.visitExpandedContent}>
                                        {/* Doctor */}
                                        <View style={styles.expandedSection}>
                                            <View style={styles.expandedSectionHeader}>
                                                <Feather name="user" size={16} color="#64748B" />
                                                <Text style={styles.expandedSectionTitle}>{t('visit.history_labels.doctor')}</Text>
                                            </View>
                                            <Text style={styles.expandedSectionValue}>
                                                {visit.doctor?.name || visit.doctorName || visit.doctor || t('visit.history_labels.noData')}
                                            </Text>
                                        </View>

                                        {/* Notes */}
                                        <View style={styles.expandedSection}>
                                            <View style={styles.expandedSectionHeader}>
                                                <Feather name="file-text" size={16} color="#64748B" />
                                                <Text style={styles.expandedSectionTitle}>{t('visit.history_labels.notes')}</Text>
                                            </View>
                                            <Text style={styles.expandedSectionValue}>
                                                {visit.notes || t('visit.history_labels.defaultNote')}
                                            </Text>
                                        </View>

                                        {/* Medical Interview */}
                                        <View style={styles.expandedSection}>
                                            <View style={styles.expandedSectionHeader}>
                                                <Feather name="file-text" size={16} color="#64748B" />
                                                <Text style={styles.expandedSectionTitle}>{t('visit.history_labels.interview')}</Text>
                                            </View>

                                            <Text style={styles.expandedSubLabel}>{t('visit.history_labels.mainSymptoms')}</Text>
                                            <Text style={styles.expandedSubValue}>
                                                {visit.mainSymptoms || visit.recommendations?.mainSymptoms || t('visit.history_labels.noData')}
                                            </Text>

                                            <View style={[styles.expandedSectionHeader, { marginTop: 12 }]}>
                                                <MaterialCommunityIcons name="brain" size={16} color="#64748B" />
                                                <Text style={styles.expandedSectionTitle}>{t('visit.history_labels.scales')}</Text>
                                            </View>
                                        </View>

                                        {/* Examination */}
                                        <View style={styles.expandedSection}>
                                            <View style={styles.expandedSectionHeader}>
                                                <MaterialCommunityIcons name="stethoscope" size={16} color="#64748B" />
                                                <Text style={styles.expandedSectionTitle}>{t('visit.history_labels.examination')}</Text>
                                            </View>

                                            <View style={styles.examGrid}>
                                                <View style={styles.examGridItem}>
                                                    <Text style={styles.examLabel}>{t('visit.history_labels.bloodPressure')}:</Text>
                                                    <Text style={styles.examValue}>
                                                        {visit.examination?.bloodPressure || t('visit.history_labels.noData')}
                                                    </Text>
                                                </View>
                                                <View style={styles.examGridItem}>
                                                    <Text style={styles.examLabel}>{t('visit.history_labels.generalCondition')}:</Text>
                                                    <Text style={styles.examValue}>
                                                        {visit.examination?.generalCondition || t('visit.history_labels.noData')}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.examGrid}>
                                                <View style={styles.examGridItem}>
                                                    <Text style={styles.examLabel}>{t('visit.history_labels.heartRate')}:</Text>
                                                    <Text style={styles.examValue}>
                                                        {visit.examination?.heartRate || t('visit.history_labels.noData')}
                                                    </Text>
                                                </View>
                                                <View style={styles.examGridItem}>
                                                    <Text style={styles.examLabel}>{t('visit.history_labels.temperature')}:</Text>
                                                    <Text style={styles.examValue}>
                                                        {visit.examination?.temperature || t('visit.history_labels.noData')}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </ScrollView>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>{t('visit.profile.noVisits')}</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity 
                            style={[styles.tab, activeTab === 'Basic Information' && styles.tabActive]}
                            onPress={() => setActiveTab('Basic Information')}
                        >
                            <Text style={[styles.tabText, activeTab === 'Basic Information' && styles.tabTextActive]}>
                                {t('visit.profile.tabs.basic')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.tab, activeTab === 'Visit History' && styles.tabActive]}
                            onPress={() => setActiveTab('Visit History')}
                        >
                            <Text style={[styles.tabText, activeTab === 'Visit History' && styles.tabTextActive]}>
                                {t('visit.profile.tabs.history')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {activeTab === 'Basic Information' ? renderBasicInfo() : renderVisitHistory()}

                <View style={styles.trendSection}>
                    <TouchableOpacity 
                        style={styles.trendButton}
                        onPress={handleTrendPress}
                    >
                        <MaterialCommunityIcons name="trending-up" size={18} color="#58A7B3" />
                        <Text style={styles.trendButtonText}>{t('visit.profile.trends')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.backButton} onPress={onBack}>
                        <Feather name="arrow-left" size={18} color="#58A7B3" />
                        <Text style={styles.backButtonText}>{t('visit.navigation.previous')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onNext}>
                        <LinearGradient
                            colors={['#58A7B3', '#8ED1CC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.nextButton}
                        >
                            <Text style={styles.nextButtonText}>{t('visit.navigation.next')}</Text>
                            <Feather name="arrow-right" size={18} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
            <TrendAnalysisModal 
                visible={showTrendModal} 
                onClose={() => setShowTrendModal(false)}
                totalVisits={trendData?.total}
                scalesCompleted={trendData?.scalesCount}
                loading={loadingTrends}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        minHeight: hp(40),
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        padding: 4,
        borderRadius: 8,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    tabActive: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#58A7B3',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    tabText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#58A7B3',
    },
    trendSection: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: hp(2),
        marginBottom: hp(1),
    },
    trendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#58A7B3',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    trendButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#58A7B3',
        marginLeft: 6,
    },
    cardContent: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    allergyBadge: {
        backgroundColor: '#FEE2E2',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 4,
    },
    allergyText: {
        color: '#EF4444',
        fontSize: 12,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 15,
        color: '#64748B',
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    historyCount: {
        fontSize: 14,
        color: '#64748B',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    allergyContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    visitCard: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    visitCardExpanded: {
        borderLeftWidth: 3,
        borderLeftColor: '#58A7B3',
    },
    visitCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    visitCardHeaderExpanded: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    visitCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    calendarIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#E2F2F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    visitCardInfo: {
        flex: 1,
    },
    visitCardDate: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
    },
    visitCardType: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 1,
    },
    visitCardTime: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 1,
    },
    visitCardRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        backgroundColor: '#E2F2F4',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 6,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#58A7B3',
    },
    visitExpandedContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 16,
    },
    expandedSection: {
        marginBottom: 16,
    },
    expandedSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    expandedSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginLeft: 8,
    },
    expandedSectionValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
        paddingLeft: 24,
    },
    expandedSubLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
        marginTop: 8,
        paddingLeft: 24,
    },
    expandedSubValue: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
        paddingLeft: 24,
    },
    examGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingLeft: 24,
    },
    examGridItem: {
        flex: 1,
    },
    examLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1E293B',
    },
    examValue: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    emptyText: {
        fontSize: 16,
        color: '#94A3B8',
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        paddingTop: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#58A7B3',
        borderRadius: 8,
        width: wp(43),
        height: 50,
        justifyContent: 'center',
    },
    backButtonText: {
        fontSize: 16,
        color: '#58A7B3',
        fontWeight: '700',
        marginLeft: 8,
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        width: wp(43),
        height: 50,
        justifyContent: 'center',
    },
    nextButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '700',
        marginRight: 8,
    },
});

export default VisitProfile;
