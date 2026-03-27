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
import { useThemeColors } from '../../../hooks/useThemeColors';

interface VisitHistoryModalProps {
    visible: boolean;
    onClose: () => void;
    visits?: any[];
    total?: number;
    loading?: boolean;
}

const VisitHistoryModal = ({ visible, onClose, visits = [], total = 0, loading = false }: VisitHistoryModalProps) => {
    const { t, i18n } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
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
            <View style={ds.overlay}>
                <View style={ds.modalContainer}>
                    {/* Header */}
                    <View style={ds.header}>
                        <Text style={ds.headerTitle}>{t('visit.profile.history')}</Text>
                        <TouchableOpacity onPress={onClose} style={ds.closeBtn}>
                            <Feather name="x" size={24} color={tc.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Sub Header */}
                    <View style={ds.subHeader}>
                        <Text style={ds.activeLabel}>{t('visit.profile.history')}</Text>
                        <View style={ds.totalContainer}>
                            <Text style={ds.totalText}>{t('visit.profile.history_total', { total })}</Text>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={ds.contentContainer}>
                        {loading ? (
                            <View style={ds.loadingContainer}>
                                <ActivityIndicator size="large" color="#58A7B3" />
                            </View>
                        ) : visits.length > 0 ? (
                            <ScrollView style={ds.scrollView} showsVerticalScrollIndicator={false}>
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
                                            ds.visitCard,
                                            isExpanded && ds.visitCardExpanded,
                                        ]}>
                                            {/* Visit Header - always visible */}
                                            <TouchableOpacity
                                                style={[
                                                    ds.visitCardHeader,
                                                    isExpanded && ds.visitCardHeaderExpanded,
                                                ]}
                                                onPress={() => toggleExpand(index)}
                                                activeOpacity={0.7}
                                            >
                                                <View style={ds.visitCardLeft}>
                                                    <View style={ds.calendarIconWrap}>
                                                        <Feather name="calendar" size={18} color="#58A7B3" />
                                                    </View>
                                                    <View style={ds.visitCardInfo}>
                                                        <Text style={ds.visitCardDate}>
                                                            {formatVisitDate(visit.date)}
                                                        </Text>
                                                        <Text style={ds.visitCardType}>
                                                            {visit.visitType ? t(`visit.type.${visit.visitType}`) : t('visit.type.followUp')}
                                                        </Text>
                                                        {timeRange ? (
                                                            <Text style={ds.visitCardTime}>
                                                                {timeRange}
                                                            </Text>
                                                        ) : null}
                                                    </View>
                                                </View>
                                                <View style={ds.visitCardRight}>
                                                    <View style={ds.statusBadge}>
                                                        <Text style={ds.statusBadgeText}>
                                                            {visit.status ? t(`status.${visit.status}`) : t('status.scheduled')}
                                                        </Text>
                                                    </View>
                                                    <Feather
                                                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                                        size={20}
                                                        color={tc.textSecondary}
                                                        style={{ marginLeft: 8 }}
                                                    />
                                                </View>
                                            </TouchableOpacity>

                                            {/* Expanded Details */}
                                            {isExpanded && (
                                                <View style={ds.visitExpandedContent}>
                                                    {/* Doctor */}
                                                    <View style={ds.expandedSection}>
                                                        <View style={ds.expandedSectionHeader}>
                                                            <Feather name="user" size={16} color={tc.textSecondary} />
                                                            <Text style={ds.expandedSectionTitle}>{t('visit.history_labels.doctor')}</Text>
                                                        </View>
                                                        <Text style={ds.expandedSectionValue}>
                                                            {visit.doctor?.name || visit.doctorName || visit.doctor || t('visit.history_labels.noData')}
                                                        </Text>
                                                    </View>

                                                    {/* Notes */}
                                                    <View style={ds.expandedSection}>
                                                        <View style={ds.expandedSectionHeader}>
                                                            <Feather name="file-text" size={16} color={tc.textSecondary} />
                                                            <Text style={ds.expandedSectionTitle}>{t('visit.history_labels.notes')}</Text>
                                                        </View>
                                                        <Text style={ds.expandedSectionValue}>
                                                            {visit.notes || t('visit.history_labels.defaultNote')}
                                                        </Text>
                                                    </View>

                                                    {/* Medical Interview */}
                                                    <View style={ds.expandedSection}>
                                                        <View style={ds.expandedSectionHeader}>
                                                            <Feather name="file-text" size={16} color={tc.textSecondary} />
                                                            <Text style={ds.expandedSectionTitle}>{t('visit.history_labels.interview')}</Text>
                                                        </View>

                                                        <Text style={ds.expandedSubLabel}>{t('visit.history_labels.mainSymptoms')}</Text>
                                                        <Text style={ds.expandedSubValue}>
                                                            {visit.mainSymptoms || visit.recommendations?.mainSymptoms || t('visit.history_labels.noData')}
                                                        </Text>

                                                        <View style={[ds.expandedSectionHeader, { marginTop: 12 }]}>
                                                            <MaterialCommunityIcons name="brain" size={16} color={tc.textSecondary} />
                                                            <Text style={ds.expandedSectionTitle}>{t('visit.history_labels.scales')}</Text>
                                                        </View>
                                                    </View>

                                                    {/* Examination */}
                                                    <View style={ds.expandedSection}>
                                                        <View style={ds.expandedSectionHeader}>
                                                            <MaterialCommunityIcons name="stethoscope" size={16} color={tc.textSecondary} />
                                                            <Text style={ds.expandedSectionTitle}>{t('visit.history_labels.examination')}</Text>
                                                        </View>

                                                        <View style={ds.examGrid}>
                                                            <View style={ds.examGridItem}>
                                                                <Text style={ds.examLabel}>{t('visit.history_labels.bloodPressure')}:</Text>
                                                                <Text style={ds.examValue}>
                                                                    {visit.examination?.bloodPressure || t('visit.history_labels.noData')}
                                                                </Text>
                                                            </View>
                                                            <View style={ds.examGridItem}>
                                                                <Text style={ds.examLabel}>{t('visit.history_labels.generalCondition')}:</Text>
                                                                <Text style={ds.examValue}>
                                                                    {visit.examination?.generalCondition || t('visit.history_labels.noData')}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View style={ds.examGrid}>
                                                            <View style={ds.examGridItem}>
                                                                <Text style={ds.examLabel}>{t('visit.history_labels.heartRate')}:</Text>
                                                                <Text style={ds.examValue}>
                                                                    {visit.examination?.heartRate || t('visit.history_labels.noData')}
                                                                </Text>
                                                            </View>
                                                            <View style={ds.examGridItem}>
                                                                <Text style={ds.examLabel}>{t('visit.history_labels.temperature')}:</Text>
                                                                <Text style={ds.examValue}>
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
                            <View style={ds.emptyContainer}>
                                <Feather name="calendar" size={48} color={tc.borderColor} />
                                <Text style={ds.noDataText}>{t('visit.profile.noVisits')}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: wp(3),
        },
        modalContainer: {
            backgroundColor: tc.cardBackground,
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
            borderBottomColor: tc.borderColor,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: tc.textPrimary,
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
            borderBottomColor: tc.borderColor,
            backgroundColor: tc.cardBackgroundAlt,
        },
        activeLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textPrimary,
        },
        totalContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        totalText: {
            fontSize: 13,
            color: tc.textSecondary,
        },
        contentContainer: {
            padding: 16,
            flex: 1,
            backgroundColor: tc.cardBackground,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        scrollView: {
            flex: 1,
        },
        visitCard: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 10,
            marginBottom: 12,
            backgroundColor: tc.cardBackgroundAlt,
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
            borderBottomColor: tc.borderColor,
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
            backgroundColor: isDark ? 'rgba(88, 167, 179, 0.15)' : '#E2F2F4',
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
            color: tc.textPrimary,
        },
        visitCardType: {
            fontSize: 13,
            color: tc.textSecondary,
            marginTop: 1,
        },
        visitCardTime: {
            fontSize: 12,
            color: tc.textMuted,
            marginTop: 1,
        },
        visitCardRight: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        statusBadge: {
            backgroundColor: isDark ? 'rgba(88, 167, 179, 0.2)' : '#E2F2F4',
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
            backgroundColor: tc.cardBackground,
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
            color: tc.textSecondary,
            marginLeft: 8,
        },
        expandedSectionValue: {
            fontSize: 15,
            fontWeight: '600',
            color: tc.textPrimary,
            paddingLeft: 24,
        },
        expandedSubLabel: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.textPrimary,
            marginTop: 8,
            paddingLeft: 24,
        },
        expandedSubValue: {
            fontSize: 13,
            color: tc.textSecondary,
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
            color: tc.textPrimary,
        },
        examValue: {
            fontSize: 13,
            color: tc.textSecondary,
            marginTop: 2,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        noDataText: {
            fontSize: 15,
            color: tc.textMuted,
            fontWeight: '500',
            marginTop: 12,
        },
    });

export default VisitHistoryModal;
