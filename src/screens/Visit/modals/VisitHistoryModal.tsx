import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

type SortOrder = 'newest' | 'oldest';

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
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

    const toggleExpand = useCallback((index: number) => {
        setExpandedIndex(prev => prev === index ? null : index);
    }, []);

    const formatVisitDate = useCallback((dateStr: string) => {
        if (!dateStr) return t('visit.history_labels.noData');
        const date = new Date(dateStr);
        return date.toLocaleDateString(i18n.language === 'pl' ? 'pl-PL' : 'en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }, [t, i18n.language]);

    const formatTime = useCallback((timeStr: string) => {
        if (!timeStr) return '';
        if (/^\d{1,2}:\d{2}$/.test(timeStr)) return timeStr;
        const date = new Date(timeStr);
        if (isNaN(date.getTime())) return timeStr;
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }, []);

    const filteredAndSortedVisits = useMemo(() => {
        let filtered = [...visits];

        if (searchText.trim()) {
            const query = searchText.toLowerCase();
            filtered = filtered.filter(v => {
                const date = formatVisitDate(v.date).toLowerCase();
                const doctor = (v.doctor?.name || v.doctorName || v.doctor || '').toLowerCase();
                const notes = (v.notes || '').toLowerCase();
                return date.includes(query) || doctor.includes(query) || notes.includes(query);
            });
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    }, [visits, searchText, sortOrder, formatVisitDate]);

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

                    {/* Search & Sort */}
                    <View style={ds.filterBar}>
                        <View style={ds.searchBar}>
                            <Feather name="search" size={16} color={tc.textMuted} />
                            <TextInput
                                style={ds.searchInput}
                                placeholder={t('visitList.searchPlaceholder')}
                                value={searchText}
                                onChangeText={setSearchText}
                                placeholderTextColor={tc.textMuted}
                            />
                            {searchText.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchText('')}>
                                    <Feather name="x" size={14} color={tc.textMuted} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity
                            style={ds.sortButton}
                            onPress={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                        >
                            <Feather
                                name={sortOrder === 'newest' ? 'arrow-down' : 'arrow-up'}
                                size={14}
                                color={tc.accent}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Sub Header */}
                    <View style={ds.subHeader}>
                        <Text style={ds.activeLabel}>{t('visit.profile.history')}</Text>
                        <View style={ds.totalContainer}>
                            <Text style={ds.totalText}>
                                {t('visit.profile.history_total', { total: filteredAndSortedVisits.length })}
                            </Text>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={ds.contentContainer}>
                        {loading ? (
                            <View style={ds.loadingContainer}>
                                <ActivityIndicator size="large" color="#58A7B3" />
                            </View>
                        ) : filteredAndSortedVisits.length > 0 ? (
                            <ScrollView style={ds.scrollView} showsVerticalScrollIndicator={false}>
                                {filteredAndSortedVisits.map((visit, index) => {
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
                                                            <Text style={ds.visitCardTime}>{timeRange}</Text>
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
                                                    {(visit.notes || visit.note) && (
                                                        <View style={ds.expandedSection}>
                                                            <View style={ds.expandedSectionHeader}>
                                                                <Feather name="file-text" size={16} color={tc.textSecondary} />
                                                                <Text style={ds.expandedSectionTitle}>{t('visit.history_labels.notes')}</Text>
                                                            </View>
                                                            <Text style={ds.expandedSectionValue}>
                                                                {visit.notes || visit.note}
                                                            </Text>
                                                        </View>
                                                    )}

                                                    {/* Medical Interview */}
                                                    <View style={ds.expandedSection}>
                                                        <View style={ds.expandedSectionHeader}>
                                                            <Feather name="file-text" size={16} color={tc.textSecondary} />
                                                            <Text style={ds.expandedSectionTitle}>{t('visit.history_labels.interview')}</Text>
                                                        </View>

                                                        <Text style={ds.expandedSubLabel}>{t('visit.history_labels.mainSymptoms')}</Text>
                                                        <Text style={ds.expandedSubValue}>
                                                            {visit.interview?.mainSymptoms || visit.mainSymptoms || visit.recommendations?.mainSymptoms || t('visit.history_labels.noData')}
                                                        </Text>

                                                        {/* Current Medications */}
                                                        {visit.interview?.currentMedications && visit.interview.currentMedications.length > 0 && (
                                                            <>
                                                                <Text style={[ds.expandedSubLabel, { marginTop: 10 }]}>
                                                                    {t('visit.history_labels.currentMedications')}
                                                                </Text>
                                                                {visit.interview.currentMedications.map((med: string, idx: number) => (
                                                                    <View key={idx} style={ds.medicationRow}>
                                                                        <View style={ds.bulletDot} />
                                                                        <Text style={ds.expandedSubValue}>{med}</Text>
                                                                    </View>
                                                                ))}
                                                            </>
                                                        )}

                                                        {/* Additional Notes */}
                                                        {visit.interview?.additionalNotes && (
                                                            <>
                                                                <Text style={[ds.expandedSubLabel, { marginTop: 10 }]}>
                                                                    {t('visit.history_labels.additionalNotes')}
                                                                </Text>
                                                                <Text style={ds.expandedSubValue}>{visit.interview.additionalNotes}</Text>
                                                            </>
                                                        )}

                                                        {/* Psychiatric Scales */}
                                                        {visit.interview?.psychiatricScales && (
                                                            <>
                                                                <View style={[ds.expandedSectionHeader, { marginTop: 12 }]}>
                                                                    <MaterialCommunityIcons name="brain" size={16} color={tc.textSecondary} />
                                                                    <Text style={ds.expandedSectionTitle}>{t('visit.history_labels.scales')}</Text>
                                                                </View>
                                                                <View style={ds.scalesGrid}>
                                                                    {Object.entries(visit.interview.psychiatricScales).map(([scale, value]) =>
                                                                        value !== null && value !== undefined ? (
                                                                            <View key={scale} style={ds.scaleItem}>
                                                                                <Text style={ds.scaleLabel}>{scale.toUpperCase()}</Text>
                                                                                <Text style={ds.scaleValue}>{String(value)}</Text>
                                                                            </View>
                                                                        ) : null
                                                                    )}
                                                                </View>
                                                            </>
                                                        )}
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
                                                        {visit.examination?.additionalFindings && (
                                                            <View style={[ds.examGrid, { marginTop: 4 }]}>
                                                                <View style={[ds.examGridItem, { flex: 1 }]}>
                                                                    <Text style={ds.examLabel}>{t('visit.history_labels.additionalFindings')}:</Text>
                                                                    <Text style={ds.examValue}>{visit.examination.additionalFindings}</Text>
                                                                </View>
                                                            </View>
                                                        )}
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
            backgroundColor: tc.modalBg,
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
        filterBar: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 10,
            gap: 8,
        },
        searchBar: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: tc.inputBackground || (isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'),
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 10,
            height: 36,
        },
        searchInput: {
            flex: 1,
            marginLeft: 6,
            fontSize: 12,
            color: tc.textPrimary,
            padding: 0,
        },
        sortButton: {
            width: 36,
            height: 36,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: tc.borderColor,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: tc.cardBackground,
        },
        subHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: tc.borderColor,
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : tc.cardBackgroundAlt,
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
            backgroundColor: tc.modalBg,
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
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : tc.cardBackgroundAlt,
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
            backgroundColor: tc.modalBg,
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
            lineHeight: 18,
        },
        medicationRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: 4,
            paddingLeft: 28,
        },
        bulletDot: {
            width: 5,
            height: 5,
            borderRadius: 3,
            backgroundColor: tc.textMuted,
            marginTop: 6,
            marginRight: 8,
        },
        scalesGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 8,
            paddingLeft: 24,
            gap: 8,
        },
        scaleItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: tc.borderColor,
        },
        scaleLabel: {
            fontSize: 12,
            fontWeight: '700',
            color: tc.textPrimary,
            marginRight: 6,
        },
        scaleValue: {
            fontSize: 12,
            color: tc.textSecondary,
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
