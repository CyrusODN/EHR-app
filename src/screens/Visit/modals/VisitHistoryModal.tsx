import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { useTranslation } from 'react-i18next';

interface VisitHistoryModalProps {
    visible: boolean;
    onClose: () => void;
    visits?: any[];
    total?: number;
    loading?: boolean;
}

const VisitHistoryModal = ({ visible, onClose, visits = [], total = 0, loading = false }: VisitHistoryModalProps) => {
    const { t, i18n } = useTranslation();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleExpand = useCallback((index: number) => {
        setExpandedIndex(prev => prev === index ? null : index);
    }, []);

    const formatVisitDate = useCallback((dateStr: string) => {
        if (!dateStr) return t('visit.history_labels.noData');
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString(i18n.language || 'en', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }, [t, i18n.language]);

    const formatTime = useCallback((timeStr: string) => {
        if (!timeStr) return '';
        // If it's already a plain time string like "13:00", return as-is
        if (/^\d{1,2}:\d{2}$/.test(timeStr)) return timeStr;
        // Otherwise try to parse as a date
        const date = new Date(timeStr);
        if (isNaN(date.getTime())) return timeStr;
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }, []);

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{t('visit.profile.history')}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Feather name="x" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    {/* Sub Header */}
                    <View style={styles.subHeader}>
                        <Text style={styles.activeLabel}>{t('visit.profile.history')}</Text>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalText}>{t('visit.profile.history_total', { total })}</Text>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={styles.contentContainer}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#58A7B3" />
                            </View>
                        ) : visits.length > 0 ? (
                            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                                {visits.map((visit, index) => {
                                    const isExpanded = expandedIndex === index;
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
                                                onPress={() => toggleExpand(index)}
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
                                                            {visit.visitType ? t(`visit.type.${visit.visitType}`) : t('visit.type.followUp')}
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
                                                            {visit.status ? t(`status.${visit.status}`) : t('status.scheduled')}
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
                                <Feather name="calendar" size={48} color="#E2E8F0" />
                                <Text style={styles.noDataText}>{t('visit.profile.noVisits')}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(3),
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: '100%',
        maxHeight: hp(90),
        minHeight: hp(60),
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    closeBtn: {
        padding: 4,
    },
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    activeLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalText: {
        fontSize: 13,
        color: '#64748B',
    },
    contentContainer: {
        padding: 16,
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    // Visit Card Styles (matching VisitProfile)
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
    // Expanded Content Styles
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
    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        fontSize: 15,
        color: '#94A3B8',
        fontWeight: '500',
        marginTop: 12,
    },
});

export default VisitHistoryModal;
