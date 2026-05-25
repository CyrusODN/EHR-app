import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    ScrollView,
    Animated,
    Dimensions,
    Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ScheduledVisitsModalProps {
    visible: boolean;
    onClose: () => void;
    visits: any[];
    onVisitPress?: (visit: any) => void;
    /** When provided, the modal opens directly in detail view for this visit */
    initialVisit?: any;
}

const ScheduledVisitsModal = ({ visible, onClose, visits = [], onVisitPress, initialVisit }: ScheduledVisitsModalProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const insets = useSafeAreaInsets();
    const [isMounted, setIsMounted] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState<any>(null);
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    const isDirectDetail = !!initialVisit;

    useEffect(() => {
        if (visible) {
            if (initialVisit) {
                setSelectedVisit(initialVisit);
            }
            setIsMounted(true);
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    damping: 22,
                    stiffness: 120,
                    mass: 0.8,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setIsMounted(false);
                setSelectedVisit(null);
            });
        }
    }, [visible]);

    const handleClose = () => {
        if (selectedVisit && !isDirectDetail) {
            setSelectedVisit(null);
        } else {
            onClose();
        }
    };

    const getInitials = (name: string) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getStatusStyle = (status: string) => {
        const s = (status || '').toLowerCase();
        if (s === 'scheduled' || s === 'confirmed') {
            return { bg: isDark ? 'rgba(37,99,235,0.15)' : '#EFF6FF', text: isDark ? '#60A5FA' : '#2563EB', icon: 'clock' };
        }
        if (s === 'in_progress' || s === 'in progress') {
            return { bg: isDark ? 'rgba(217,119,6,0.15)' : '#FEF3C7', text: isDark ? '#FBBF24' : '#D97706', icon: 'play-circle' };
        }
        if (s === 'completed') {
            return { bg: isDark ? 'rgba(5,150,105,0.15)' : '#ECFDF5', text: isDark ? '#34D399' : '#059669', icon: 'check-circle' };
        }
        if (s === 'cancelled') {
            return { bg: isDark ? 'rgba(239,68,68,0.15)' : '#FEE2E2', text: isDark ? '#F87171' : '#EF4444', icon: 'x-circle' };
        }
        return { bg: isDark ? 'rgba(107,114,128,0.15)' : '#F3F4F6', text: isDark ? '#9CA3AF' : '#6B7280', icon: 'circle' };
    };

    const formatVisitDate = (dateStr: string) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        } catch {
            return dateStr;
        }
    };

    const renderVisitDetail = () => {
        if (!selectedVisit) return null;

        const patientName = selectedVisit.patient?.name || selectedVisit.patientName || t('common.na');
        const visitType = selectedVisit.visitType || selectedVisit.type || '';
        const specialization = selectedVisit.specialization || '';
        const startTime = selectedVisit.startTime || selectedVisit.time || '--:--';
        const endTime = selectedVisit.endTime || '';
        const status = selectedVisit.status || 'scheduled';
        const statusStyle = getStatusStyle(status);
        const doctorName = selectedVisit.doctor?.name || selectedVisit.doctor || '';
        const doctorSpec = selectedVisit.doctor?.specialization || '';
        const notes = selectedVisit.notes || '';
        const visitDate = selectedVisit.date || selectedVisit.fullDate || '';
        const office = selectedVisit.office || '';
        const patientEmail = selectedVisit.patient?.email || '';
        const patientPhone = selectedVisit.patient?.phone || '';

        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
                {/* Date/Time gradient header */}
                <LinearGradient
                    colors={['#4A90B9', '#68BFB3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={ds.detailHeader}
                >
                    <View style={[ds.detailHeaderRow,{marginBottom:0}]}>
                        <Feather name="calendar" size={16} color="white" />
                        <Text style={ds.detailHeaderDate}>{formatVisitDate(visitDate)}</Text>
                    </View>
                    <View style={ds.detailHeaderRow}>
                        <Feather name="clock" size={14} color="rgba(255,255,255,0.85)" />
                        <Text style={ds.detailHeaderTime}>
                            {startTime}{endTime ? ` - ${endTime}` : ''}
                        </Text>
                    </View>
                </LinearGradient>

                {/* Patient section */}
                <View style={ds.detailSection}>
                    <View style={ds.detailSectionHeader}>
                        <Feather name="user" size={16} color={tc.textPrimary} />
                        <Text style={ds.detailSectionTitle}>{t('eventDetail.patient')}</Text>
                    </View>
                    <View style={ds.detailSectionContent}>
                        <Text style={ds.detailValue}>{patientName}</Text>
                        {patientEmail ? <Text style={ds.detailSubValue}>{patientEmail}</Text> : null}
                        {patientPhone ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                <Feather name="phone" size={12} color={tc.textMuted} style={{ marginRight: 4 }} />
                                <Text style={ds.detailSubValue}>{patientPhone}</Text>
                            </View>
                        ) : null}
                    </View>
                </View>

                {/* Visit Details section */}
                <View style={ds.detailSection}>
                    <View style={ds.detailSectionHeader}>
                        <Feather name="file-text" size={16} color={tc.textPrimary} />
                        <Text style={ds.detailSectionTitle}>{t('eventDetail.visitDetails')}</Text>
                    </View>
                    <View style={ds.detailGrid}>
                        {visitType ? (
                            <View style={ds.detailGridItem}>
                                <Text style={ds.detailLabel}>{t('eventDetail.visitType')}</Text>
                                <Text style={ds.detailValue}>{visitType}</Text>
                            </View>
                        ) : null}
                        {specialization ? (
                            <View style={ds.detailGridItem}>
                                <Text style={ds.detailLabel}>{t('eventDetail.specialization')}</Text>
                                <Text style={ds.detailValue}>{specialization}</Text>
                            </View>
                        ) : null}
                        {status ? (
                            <View style={ds.detailGridItem}>
                                <Text style={ds.detailLabel}>{t('eventDetail.status')}</Text>
                                <View style={[ds.detailStatusBadge, { backgroundColor: statusStyle.bg }]}>
                                    <Feather name={statusStyle.icon} size={12} color={statusStyle.text} />
                                    <Text style={[ds.detailStatusText, { color: statusStyle.text }]}>
                                        {t(`eventDetail.statuses.${status}`) || status}
                                    </Text>
                                </View>
                            </View>
                        ) : null}
                    </View>
                </View>

                {/* Office/Location */}
                {office ? (
                    <View style={ds.detailSection}>
                        <View style={ds.detailSectionHeader}>
                            <Feather name="map-pin" size={16} color={tc.textPrimary} />
                            <Text style={ds.detailSectionTitle}>{t('eventDetail.location')}</Text>
                        </View>
                        <View style={ds.detailSectionContent}>
                            <Text style={ds.detailValue}>{office}</Text>
                        </View>
                    </View>
                ) : null}

                {/* Doctor section */}
                {doctorName ? (
                    <View style={ds.detailSection}>
                        <View style={ds.detailSectionHeader}>
                            <Feather name="briefcase" size={16} color={tc.textPrimary} />
                            <Text style={ds.detailSectionTitle}>{t('eventDetail.doctor')}</Text>
                        </View>
                        <View style={ds.detailSectionContent}>
                            <Text style={ds.detailValue}>{doctorName}</Text>
                            {doctorSpec ? <Text style={ds.detailSubValue}>{doctorSpec}</Text> : null}
                        </View>
                    </View>
                ) : null}

                {/* Notes section */}
                {notes ? (
                    <View style={ds.detailSection}>
                        <View style={ds.detailSectionHeader}>
                            <Feather name="tag" size={16} color={tc.textPrimary} />
                            <Text style={ds.detailSectionTitle}>{t('eventDetail.notes')}</Text>
                        </View>
                        <View style={ds.detailNotesBox}>
                            <Text style={ds.detailNotesText}>{notes}</Text>
                        </View>
                    </View>
                ) : null}
            </ScrollView>
        );
    };

    const renderVisitItem = ({ item }: { item: any }) => {
        const patientName = item.patient?.name || item.patientName || t('common.na');
        const visitType = item.visitType || item.type || '';
        const startTime = item.startTime || item.time || '--:--';
        const isOnline = item.isOnline || item.appointmentType === 'online';
        const status = item.status || 'scheduled';
        const statusStyle = getStatusStyle(status);

        return (
            <TouchableOpacity
                style={ds.visitCard}
                activeOpacity={0.7}
                onPress={() => setSelectedVisit(item)}
            >
                <View style={ds.visitCardContent}>
                    <View style={ds.visitTopRow}>
                        <View style={ds.patientSection}>
                            <LinearGradient
                                colors={['#4A90B9', '#68BFB3']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={ds.avatar}
                            >
                                <Text style={ds.avatarText}>{getInitials(patientName)}</Text>
                            </LinearGradient>
                            <View style={ds.patientInfo}>
                                <View style={ds.nameRow}>
                                    <Text style={ds.patientName} numberOfLines={1}>{patientName}</Text>
                                    {isOnline && (
                                        <View style={ds.onlineBadge}>
                                            <Feather name="video" size={12} color="#3B82F6" />
                                        </View>
                                    )}
                                </View>
                                {visitType ? (
                                    <Text style={ds.visitType} numberOfLines={1}>{visitType}</Text>
                                ) : null}
                            </View>
                        </View>
                    </View>

                    <View style={ds.visitBottomRow}>
                        <View style={ds.timeChip}>
                            <Feather name="clock" size={13} color={tc.accent} />
                            <Text style={ds.timeText}>{startTime}</Text>
                        </View>
                        <View style={[ds.statusChip, { backgroundColor: statusStyle.bg }]}>
                            <Feather name={statusStyle.icon} size={12} color={statusStyle.text} />
                            <Text style={[ds.statusText, { color: statusStyle.text }]}>{status}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (!isMounted) return null;

    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: 999, elevation: 999 }]}>
            <Animated.View style={[ds.backdrop, { opacity: backdropOpacity }]}>
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
            </Animated.View>

            <Animated.View
                style={[
                    ds.modalContainer,
                    {
                        paddingBottom: insets.bottom + 10,
                        transform: [{ translateY: slideAnim }],
                        maxHeight: SCREEN_HEIGHT * 0.85,
                    },
                ]}
            >
                <View style={ds.dragHandleContainer}>
                    <View style={ds.dragHandle} />
                </View>

                <View style={ds.header}>
                    <View style={ds.headerLeft}>
                        {selectedVisit && !isDirectDetail ? (
                            <TouchableOpacity onPress={() => setSelectedVisit(null)} style={ds.backBtn}>
                                <Feather name="arrow-left" size={18} color={tc.textPrimary} />
                            </TouchableOpacity>
                        ) : (
                            <View style={ds.headerIconBg}>
                                <Feather name={selectedVisit ? 'file-text' : 'calendar'} size={18} color="#4A90B9" />
                            </View>
                        )}
                        <View>
                            <Text style={ds.headerTitle}>
                                {selectedVisit ? t('eventDetail.title') : t('scheduledVisits.title')}
                            </Text>
                            {!selectedVisit && (
                                <Text style={ds.headerSubtitle}>
                                    {visits.length} {t('dashboard.calendar.visitsCount')}
                                </Text>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleClose} style={ds.closeBtn}>
                        <Feather name="x" size={18} color={tc.textMuted} />
                    </TouchableOpacity>
                </View>

                {selectedVisit ? (
                    renderVisitDetail()
                ) : visits.length === 0 ? (
                    <View style={ds.emptyContainer}>
                        <Icon name="calendar-blank-outline" size={48} color={tc.textMuted} />
                        <Text style={ds.emptyTitle}>{t('dashboard.calendar.noVisitsFound')}</Text>
                        <Text style={ds.emptySubtitle}>{t('dashboard.calendar.noVisits')}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={visits}
                        renderItem={renderVisitItem}
                        keyExtractor={(item, index) => item.id || item._id || String(index)}
                        contentContainerStyle={ds.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </Animated.View>
        </View>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: tc.modalBg,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: isDark ? 0.4 : 0.08,
        shadowRadius: 16,
        elevation: 20,
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 6,
    },
    dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: tc.borderStrong,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: tc.accentLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    headerSubtitle: {
        fontSize: 13,
        color: tc.textMuted,
        marginTop: 1,
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    listContent: {
        padding: 16,
        paddingBottom: 8,
    },
    visitCard: {
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FAFBFC',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: tc.borderSubtle,
        marginBottom: 10,
        overflow: 'hidden',
    },
    visitCardContent: {
        padding: 14,
    },
    visitTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    patientSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },
    patientInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    patientName: {
        fontSize: 15,
        fontWeight: '600',
        color: tc.textPrimary,
        flexShrink: 1,
    },
    onlineBadge: {
        width: 24,
        height: 24,
        borderRadius: 8,
        backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    visitType: {
        fontSize: 13,
        color: tc.textSecondary,
        marginTop: 2,
    },
    visitBottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 8,
    },
    timeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        backgroundColor: tc.accentLight,
        gap: 5,
    },
    timeText: {
        fontSize: 13,
        fontWeight: '600',
        color: tc.accent,
    },
    statusChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        gap: 5,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: tc.textSecondary,
        marginTop: 12,
    },
    emptySubtitle: {
        fontSize: 13,
        color: tc.textMuted,
        marginTop: 4,
        textAlign: 'center',
    },
    // Detail view styles
    detailHeader: {
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        width: "90%", alignSelf: "center",
        // height:50,
        justifyContent: "center",
    },
    detailHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, marginTop: 10,
        marginLeft: 10,
        marginBottom: 10,
    },
    detailHeaderDate: {
        fontSize: 15,
        fontWeight: '600',
        color: 'white',
  
    },
    detailHeaderTime: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
    },
    detailSection: {
        paddingHorizontal: 20,
        paddingTop: 18,
    },
    detailSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    detailSectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: tc.textPrimary,
    },
    detailSectionContent: {
        marginLeft: 24,
    },
    detailGrid: {
        marginLeft: 24,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    detailGridItem: {
        width: '45%' as any,
    },
    detailLabel: {
        fontSize: 12,
        color: tc.textMuted,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '500',
        color: tc.textPrimary,
    },
    detailSubValue: {
        fontSize: 13,
        color: tc.textMuted,
        marginTop: 2,
    },
    detailStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        gap: 5,
        marginTop: 2,
    },
    detailStatusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    detailNotesBox: {
        marginLeft: 24,
        padding: 12,
        borderRadius: 10,
        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB',
        borderWidth: 1,
        borderColor: tc.borderSubtle,
    },
    detailNotesText: {
        fontSize: 14,
        color: tc.textSecondary,
        lineHeight: 20,
    },
});

export default ScheduledVisitsModal;
