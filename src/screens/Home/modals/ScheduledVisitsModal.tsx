import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
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
}

const ScheduledVisitsModal = ({ visible, onClose, visits = [], onVisitPress }: ScheduledVisitsModalProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const insets = useSafeAreaInsets();
    const [isMounted, setIsMounted] = useState(false);
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
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
            });
        }
    }, [visible]);

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
                onPress={() => onVisitPress?.(item)}
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
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
            </Animated.View>

            <Animated.View
                style={[
                    ds.modalContainer,
                    {
                        paddingBottom: insets.bottom + 10,
                        transform: [{ translateY: slideAnim }],
                        maxHeight: SCREEN_HEIGHT * 0.75,
                    },
                ]}
            >
                <View style={ds.dragHandleContainer}>
                    <View style={ds.dragHandle} />
                </View>

                <View style={ds.header}>
                    <View style={ds.headerLeft}>
                        <View style={ds.headerIconBg}>
                            <Feather name="calendar" size={18} color="#4A90B9" />
                        </View>
                        <View>
                            <Text style={ds.headerTitle}>{t('scheduledVisits.title')}</Text>
                            <Text style={ds.headerSubtitle}>
                                {visits.length} {t('dashboard.calendar.visitsCount')}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={onClose} style={ds.closeBtn}>
                        <Feather name="x" size={18} color={tc.textMuted} />
                    </TouchableOpacity>
                </View>

                {visits.length === 0 ? (
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
});

export default ScheduledVisitsModal;
