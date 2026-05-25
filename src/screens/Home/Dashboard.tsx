import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    View, ScrollView,
    StyleSheet,
    TouchableOpacity,
    BackHandler,
    Platform,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { Text, Card, Searchbar, IconButton, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Gap from '../../component/gap';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../component/header';
import PrimaryButton from '../../component/button';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import SlidingDrawerModal from '../Drawer';
import { DashboardStatsCard } from './Stats';
import ActionModal from './modals/ActionModal';
import { useTranslation } from 'react-i18next';
import CreateVisitModal from './modals/createVisit';
import ScheduledVisitsModal from './modals/ScheduledVisitsModal';
import userStore from '../../store/user';
import { GetDashboardVisits } from '../../Services/DashboardServices';
import { Modal } from 'react-native';
import CustomAlert from '../../component/customAlert';
import { useRoute } from '@react-navigation/native';
import { useThemeColors } from '../../hooks/useThemeColors';

const Dashboard = () => {
    const { t } = useTranslation();
    const { loggedInUser } = userStore();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { colors: tc, isDark } = useThemeColors();

    useEffect(() => {
        console.log("loggedInUser", loggedInUser);
    }, [loggedInUser])

    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [calendarModalVisible, setCalendarModalVisible] = useState(false);

    const [alertConfig, setAlertConfig] = useState<{
        visible: boolean;
        type: 'success' | 'warning' | 'error';
        message: string;
    }>({
        visible: false,
        type: 'success',
        message: '',
    });

    const showAlert = (type: 'success' | 'warning' | 'error', message: string) => {
        setAlertConfig({ visible: true, type, message });
    };

    const hideAlert = () => {
        setAlertConfig({ ...alertConfig, visible: false });
    };
    const currentMonth = 'April 2025';
    const { colors } = useTheme();
    const [selectedDate, setSelectedDate] = useState(new Date()); // The Date for which we are showing visits
    const [viewDate, setViewDate] = useState(new Date()); // The month being viewed in the calendar modal
    const [createVisitModalVisible, setCreateVisitModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [showScheduledVisitsModal, setShowScheduledVisitsModal] = useState(false);

    // Visit data from API
    const [visits, setVisits] = useState<any[]>([]);
    const [scheduleVisits, setScheduleVisits] = useState<any[]>([]);
    const [completedVisits, setCompletedVisits] = useState<any[]>([]);
    const [todaysPatients, setTodaysPatients] = useState<any[]>([]);
    const [visitsLoading, setVisitsLoading] = useState(false);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
        });
        return () => backHandler.remove();
    }, []);

    // Generate calendar days
    const getDaysInMonth = () => {
        const days = [];
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        
        // Days in current month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // First day of original month (0-6, 0 is Sunday)
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        // Adjust for Monday start (0=Mon, 6=Sun)
        const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        // Previous month days for padding
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startOffset - 1; i >= 0; i--) {
            days.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
        }

        // Current month days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                isSelected: i === selectedDate.getDate() && 
                            month === selectedDate.getMonth() && 
                            year === selectedDate.getFullYear(),
                isToday: i === today.getDate() && 
                         month === today.getMonth() && 
                         year === today.getFullYear(),
            });
        }

        // Next month days for padding
        const remainingCells = 42 - days.length;
        for (let i = 1; i <= remainingCells; i++) {
            days.push({ day: i, isCurrentMonth: false });
        }
        return days;
    };

    const handleDateSelect = (day: any) => {
        if (day.isCurrentMonth) {
            const newSelectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day.day);
            setSelectedDate(newSelectedDate);
        }
    };

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const formatHeaderDate = (date: Date) => {
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Format the currently selected full date as YYYY-MM-DD for the API
    const getFormattedSelectedDate = useCallback(() => {
        const yyyy = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const dd = String(selectedDate.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }, [selectedDate]);

    // Fetch visits from API
    const fetchVisits = useCallback(async () => {
        try {
            setVisitsLoading(true);
            const dateStr = getFormattedSelectedDate();
            const response: any = await GetDashboardVisits(dateStr);
            console.log('Dashboard visits response:', response);

            if (response) {
                setScheduleVisits(response.scheduleVisits || []);
                setCompletedVisits(response.completedVisits || []);
                setTodaysPatients(response.todaysPatients || []);
                setVisits(response.visits || []);
            }
        } catch (err) {
            console.log('Error fetching dashboard visits:', err);
        } finally {
            setVisitsLoading(false);
        }
    }, [getFormattedSelectedDate]);

    // Re-fetch visits when screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchVisits();

            if (route.params?.successMessage) {
                showAlert('success', route.params.successMessage);
                // Clear params to avoid re-showing alert
                navigation.setParams({ successMessage: undefined });
            }
        }, [fetchVisits, route.params])
    );

    // Also re-fetch when date selection changes
    useEffect(() => {
        fetchVisits();
    }, [selectedDate]);

    const currentMonthDisplay = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const days = getDaysInMonth();
    const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    // Display only visits from the 'visits' array as it is filtered by date
    const appointments = visits.map((v: any) => ({
        id: v.id || v._id,
        time: v.time || v.startTime || '--:--',
        patient: v.patient?.name
            ? v.patient.name
            : v.patientId?.firstName
                ? `${v.patientId.firstName} ${v.patientId.lastName || ''}`
                : v.patientName || 'Unknown Patient',
        patientId: v.patient?.id || v.patient?._id || v.patientId?._id || v.patientId || '',
        patientSlug: v.patient?.slug || '',
        patientData: v.patient,
        status: v.status || (v.startTime ? 'Scheduled' : 'Completed'), // Default based on fields if missing
        type: v.type || v.visitType || 'Visit',
    }));

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Scheduled':
                return {
                    bg: isDark ? 'rgba(37,99,235,0.15)' : '#EFF6FF',
                    text: isDark ? '#60A5FA' : '#2563EB',
                    icon: 'clock',
                };
            case 'In Progress':
                return {
                    bg: isDark ? 'rgba(217,119,6,0.15)' : '#FEF3C7',
                    text: isDark ? '#FBBF24' : '#D97706',
                    icon: 'play-circle',
                };
            case 'Completed':
                return {
                    bg: isDark ? 'rgba(5,150,105,0.15)' : '#ECFDF5',
                    text: isDark ? '#34D399' : '#059669',
                    icon: 'check-circle',
                };
            default:
                return {
                    bg: isDark ? 'rgba(107,114,128,0.15)' : '#F3F4F6',
                    text: isDark ? '#9CA3AF' : '#6B7280',
                    icon: 'circle',
                };
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    // Build theme-aware dynamic styles
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    return (
        <View style={ds.container}>
            <StatusBar
                barStyle={tc.statusBarStyle}
                backgroundColor={tc.headerBg}
            />
            <Header onMenuPress={() => { setDrawerVisible(true) }} />

            <ScrollView
                style={ds.scrollView}
                contentContainerStyle={ds.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Welcome Section */}
                <View style={ds.welcomeSection}>
                    <View style={{ flex: 1 }}>
                        <Text style={ds.greeting}>
                            {t('dashboard.title')}
                        </Text>
                        <Text style={ds.subtitle}>{t('dashboard.overview')}</Text>
                    </View>
                    <TouchableOpacity 
                        style={ds.calendarTriggerBtn}
                        onPress={() => setCalendarModalVisible(true)}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#4A90B9', '#68BFB3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={ds.calendarTriggerGradient}
                        >
                            <Icon name="calendar-month-outline" size={26} color="white" />
                        </LinearGradient>
                        <View style={ds.dateBadge}>
                            <Text style={ds.dateBadgeText}>{selectedDate.getDate()}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Action Buttons */}
                <View style={ds.actionButtonsRow}>
                    <TouchableOpacity
                        style={ds.newVisitBtn}
                        onPress={() => setCreateVisitModalVisible(true)}
                        activeOpacity={0.85}
                    >
                        <LinearGradient
                            colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={ds.gradientBtn}
                        >
                            <View style={ds.btnIconCircle}>
                                <FontAwesome6 name="plus" size={12} color="#4A90B9" />
                            </View>
                            <Text style={ds.newVisitBtnText}>{t('dashboard.quickActions.newVisit')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={ds.newPatientBtn}
                        onPress={() => navigation.navigate('New-Patient')}
                        activeOpacity={0.85}
                    >
                        <View style={ds.patientBtnIcon}>
                            <Feather name="user-plus" size={14} color="#4A90B9" />
                        </View>
                        <Text style={ds.newPatientBtnText}>{t('dashboard.quickActions.newPatient')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={ds.searchContainer}>
                    <Feather name="search" size={18} color={tc.textMuted} style={{ marginLeft: 2 }} />
                    <Searchbar
                        placeholder={t('nav.patients.search') + '...'}
                        placeholderTextColor={tc.textMuted}
                        style={ds.searchBar}
                        inputStyle={[ds.searchInput, { color: tc.textPrimary }]}
                        icon={() => null}
                        value={''}
                    />
                </View>

                {/* Dashboard Stats */}
                <DashboardStatsCard
                    todaysPatients={todaysPatients.length}
                    scheduledVisits={scheduleVisits.length}
                    completedVisits={completedVisits.length}
                    onScheduledVisitsPress={() => {
                        if (scheduleVisits.length > 0) {
                            setShowScheduledVisitsModal(true);
                        }
                    }}
                />

                <Gap height={6} />

                 <Gap height={6} />
                
                {/* Calendar Modal */}
                <Modal
                    visible={calendarModalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setCalendarModalVisible(false)}
                >
                    <TouchableOpacity 
                        style={ds.modalOverlay} 
                        activeOpacity={1} 
                        onPress={() => setCalendarModalVisible(false)}
                    >
                        <View style={ds.calendarModalContent}>
                            <View style={ds.calendarCardModal}>
                                <View style={ds.calendarHeader}>
                                    <View style={ds.calendarHeaderLeft}>
                                        <View style={ds.calendarIconBg}>
                                            <Icon name="calendar-month" size={18} color="#4A90B9" />
                                        </View>
                                        <Text style={ds.calendarTitle}>{currentMonthDisplay}</Text>
                                    </View>
                                    <View style={ds.calendarNavigation}>
                                        <TouchableOpacity style={ds.calendarNavBtn} onPress={handlePrevMonth}>
                                            <Feather name="chevron-left" size={18} color={tc.textSecondary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={ds.calendarNavBtn} onPress={handleNextMonth}>
                                            <Feather name="chevron-right" size={18} color={tc.textSecondary} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Weekday Headers */}
                                <View style={ds.weekdayRow}>
                                    {weekdays.map((day, index) => (
                                        <Text key={index} style={ds.weekdayText}>
                                            {day}
                                        </Text>
                                    ))}
                                </View>

                                {/* Calendar Days Grid */}
                                <View style={ds.calendarGrid}>
                                    {days.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={ds.calendarDay}
                                            onPress={() => {
                                                handleDateSelect(item);
                                                setCalendarModalVisible(false);
                                            }}
                                        >
                                            {item.isSelected && item.isCurrentMonth ? (
                                                <LinearGradient
                                                    colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    style={ds.selectedDateGradient}
                                                >
                                                    <Text style={ds.selectedDateText}>
                                                        {item.day}
                                                    </Text>
                                                </LinearGradient>
                                            ) : (
                                                <View style={[
                                                    ds.dayContainer,
                                                    item.isToday && !item.isSelected ? ds.todayContainer : null,
                                                ]}>
                                                    <Text
                                                        style={[
                                                            ds.calendarDayText,
                                                            !item.isCurrentMonth ? ds.otherMonthText : null,
                                                            item.isToday && !item.isSelected ? ds.todayText : null,
                                                        ]}
                                                    >
                                        {item.day}
                                                    </Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TouchableOpacity 
                                    style={ds.closeCalendarBtn}
                                    onPress={() => setCalendarModalVisible(false)}
                                >
                                    <Text style={ds.closeCalendarText}>{t('dashboard.calendar.close')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Appointments Section */}
                <View style={ds.appointmentsHeader}>
                    <View>
                        <Text style={ds.appointmentsTitle}>
                            {isToday(selectedDate) ? t('dashboard.todaysVisits') : `${t('dashboard.calendar.title')} ${formatHeaderDate(selectedDate)}`}
                        </Text>
                        <Text style={ds.appointmentsSubtitle}>
                            {getFormattedSelectedDate()} · {appointments.length} {t('dashboard.calendar.visitsCount')}
                        </Text>
                    </View>
                </View>

                {/* Loading State */}
                {visitsLoading && (
                    <View style={ds.visitsLoadingContainer}>
                        <ActivityIndicator size="small" color="#4A90B9" />
                        <Text style={ds.visitsLoadingText}>{t('dashboard.loadingVisits')}</Text>
                    </View>
                )}

                {/* Empty State */}
                {!visitsLoading && appointments.length === 0 && (
                    <View style={ds.emptyVisitsContainer}>
                        <Icon name="calendar-blank-outline" size={48} color={tc.emptyIcon} />
                        <Text style={ds.emptyVisitsTitle}>{t('dashboard.calendar.noVisitsFound')}</Text>
                        <Text style={ds.emptyVisitsSubtitle}>{t('dashboard.calendar.noVisits')}</Text>
                    </View>
                )}

                {/* Appointment Cards */}
                {!visitsLoading && appointments.map((appointment, index) => {
                    const statusStyle = getStatusStyle(appointment.status);
                    return (
                        <TouchableOpacity
                            key={index}
                            style={ds.appointmentCard}
                            activeOpacity={0.7}
                            onPress={() => {
                                setSelectedAppointment(appointment);
                                setShowActionModal(true);
                            }}
                        >
                            {/* Time Indicator */}
                            <View style={ds.timeIndicator}>
                                <View style={[ds.timeDot, { backgroundColor: statusStyle.text }]} />
                                <Text style={ds.appointmentTime}>{appointment.time}</Text>
                            </View>

                            {/* Card Content */}
                            <View style={ds.appointmentContent}>
                                <View style={ds.appointmentTopRow}>
                                    <View style={ds.patientInfo}>
                                        <View style={ds.avatarContainer}>
                                            <LinearGradient
                                                colors={['#4A90B9', '#68BFB3']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                style={ds.avatar}
                                            >
                                                <Text style={ds.avatarText}>
                                                    {getInitials(appointment.patient)}
                                                </Text>
                                            </LinearGradient>
                                        </View>
                                        <View style={ds.patientDetails}>
                                            <Text style={ds.patientName} numberOfLines={1}>
                                                {appointment.patient}
                                            </Text>
                                             <Text style={ds.patientId} numberOfLines={1}>
                                                 ID: {appointment.patientSlug || appointment.patientId}
                                             </Text>
                                        </View>
                                    </View>

                                    <View style={ds.moreButton}>
                                        <Icon name="dots-vertical" size={20} color={tc.textMuted} />
                                    </View>
                                </View>

                                <View style={ds.appointmentBottomRow}>
                                    <View style={[ds.statusChip, { backgroundColor: statusStyle.bg }]}>
                                        <Feather name={statusStyle.icon} size={12} color={statusStyle.text} />
                                        <Text style={[ds.statusText, { color: statusStyle.text }]}>
                                            {appointment.status}
                                        </Text>
                                    </View>
                                    <View style={ds.typeChip}>
                                        <Icon name="stethoscope" size={13} color="#4A90B9" />
                                        <Text style={ds.typeText}>{appointment.type}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}

                <Gap height={hp(12)} />

            </ScrollView>

            <CreateVisitModal
                visible={createVisitModalVisible}
                onClose={() => { setCreateVisitModalVisible(false) }}
                onSaveSuccess={fetchVisits}
            />

            <SlidingDrawerModal
                visible={drawerVisible}
                onClose={() => { setDrawerVisible(false) }}
            />

            <ActionModal
                visible={showActionModal}
                onClose={() => { setShowActionModal(false) }}
                onView={() => {
                    setShowActionModal(false);
                    if (selectedAppointment) {
                        navigation.navigate('PatientProfile', {
                            patientId: selectedAppointment.patientId,
                            patientData: selectedAppointment.patientData // passing patient details if already available
                        });
                    }
                }}
                onStart={() => { 
                    setShowActionModal(false);
                    if (selectedAppointment) {
                        navigation.navigate('Visit', {
                            visitId: selectedAppointment.id
                        });
                    }
                }}
                onAddNote={() => { 
                    setShowActionModal(false);
                }}
            />

            <ScheduledVisitsModal
                visible={showScheduledVisitsModal}
                onClose={() => setShowScheduledVisitsModal(false)}
                visits={scheduleVisits}
                onVisitPress={(visit) => {
                    setShowScheduledVisitsModal(false);
                    const patientId = visit.patient?.id || visit.patient?._id || visit.patientId;
                    if (patientId) {
                        navigation.navigate('PatientProfile', {
                            patientId,
                            patientData: visit.patient,
                        });
                    }
                }}
            />

            {/* FAB */}
            <TouchableOpacity style={ds.fab} activeOpacity={0.9}>
                <LinearGradient
                    colors={['#4A90B9', '#68BFB3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={ds.fabGradient}
                >
                    <Icon name="help-circle-outline" size={24} color="#ffffff" />
                </LinearGradient>
            </TouchableOpacity>

            <CustomAlert
                visible={alertConfig.visible}
                type={alertConfig.type}
                message={alertConfig.message}
                onClose={hideAlert}
            />
        </View>
    );
};

/** Creates theme-aware styles based on the current color palette */
const createDynamicStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: tc.screenBackground,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingHorizontal: wp(4),
        },
        // Welcome
        welcomeSection: {
            paddingTop: 20,
            paddingBottom: 6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        greeting: {
            fontSize: 26,
            fontWeight: '700',
            color: tc.textPrimary,
            letterSpacing: -0.3,
        },
        subtitle: {
            fontSize: 14,
            color: tc.textMuted,
            marginTop: 3,
        },
        calendarTriggerBtn: {
            width: 52,
            height: 52,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: tc.modalBg,
            borderWidth: 1.5,
            borderColor: tc.borderColor,
            ...Platform.select({
                ios: {
                    shadowColor: tc.shadow,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isDark ? 0 : 0.1,
                    shadowRadius: 8,
                },
                android: { elevation: isDark ? 0 : 3 },
            }),
        },
        calendarTriggerGradient: {
            width: '100%',
            height: '100%',
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
        },
        dateBadge: {
            position: 'absolute',
            top: -5,
            right: -5,
            backgroundColor: '#FF6B6B',
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            paddingHorizontal: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: tc.screenBackground,
        },
        dateBadgeText: {
            color: 'white',
            fontSize: 10,
            fontWeight: '800',
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        calendarModalContent: {
            width: '100%',
            maxWidth: 400,
        },
        calendarCardModal: {
            backgroundColor: tc.modalBg,
            borderRadius: 24,
            padding: 20,
            borderWidth: isDark ? 1 : 0,
            borderColor: tc.borderColor,
            ...Platform.select({
                ios: {
                    shadowColor: tc.shadow,
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: isDark ? 0 : 0.2,
                    shadowRadius: 20,
                },
                android: { elevation: isDark ? 0 : 10 },
            }),
        },
        closeCalendarBtn: {
            marginTop: 20,
            backgroundColor: tc.buttonMutedBg,
            paddingVertical: 12,
            borderRadius: 14,
            alignItems: 'center',
        },
        closeCalendarText: {
            color: tc.textSecondary,
            fontWeight: '700',
            fontSize: 15,
        },
        // Action Buttons
        actionButtonsRow: {
            flexDirection: 'row',
            marginTop: 16,
            marginBottom: 14,
            gap: 10,
        },
        newVisitBtn: {
            flex: 1,
            height: 50,
            borderRadius: 14,
            overflow: 'hidden',
            ...Platform.select({
                ios: {
                    shadowColor: '#4A90B9',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isDark ? 0.15 : 0.25,
                    shadowRadius: 8,
                },
                android: { elevation: 4 },
            }),
        },
        gradientBtn: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        btnIconCircle: {
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: 'rgba(255,255,255,0.9)',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 8,
        },
        newVisitBtnText: {
            color: 'white',
            fontSize: 15,
            fontWeight: '700',
        },
        newPatientBtn: {
            flex: 1,
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 14,
            backgroundColor: tc.buttonOutlineBg,
            borderWidth: 1.5,
            borderColor: tc.buttonOutlineBorder,
        },
        patientBtnIcon: {
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: tc.accentLight,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 8,
        },
        newPatientBtnText: {
            color: '#4A90B9',
            fontSize: 15,
            fontWeight: '600',
        },
        // Search
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: tc.searchBarBg,
            borderRadius: 14,
            marginBottom: 14,
            paddingHorizontal: wp(2.5),
            borderWidth: 1,
            borderColor: tc.searchBarBorder,
            height: 50,
        },
        searchBar: {
            flex: 1,
            backgroundColor: 'transparent',
            elevation: 0,
            height: '100%',
            justifyContent: 'center',
        },
        searchInput: {
            fontSize: 14,
            paddingLeft: 0,
            marginLeft: -29,
            minHeight: 0,
        },
        // Calendar
        calendarCard: {
            backgroundColor: tc.modalBg,
            borderRadius: 16,
            padding: 16,
            marginTop: 6,
            marginBottom: 8,
            ...Platform.select({
                ios: {
                    shadowColor: tc.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0 : 0.06,
                    shadowRadius: 10,
                },
                android: { elevation: isDark ? 0 : 2 },
            }),
        },
        calendarHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        calendarHeaderLeft: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        calendarIconBg: {
            width: 32,
            height: 32,
            borderRadius: 9,
            backgroundColor: tc.accentLight,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
        },
        calendarTitle: {
            fontSize: 17,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        calendarNavigation: {
            flexDirection: 'row',
            gap: 4,
        },
        calendarNavBtn: {
            width: 32,
            height: 32,
            borderRadius: 9,
            backgroundColor: tc.buttonMutedBg,
            justifyContent: 'center',
            alignItems: 'center',
        },
        weekdayRow: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: tc.borderLight,
            marginBottom: 4,
        },
        weekdayText: {
            width: 30,
            textAlign: 'center',
            color: tc.textMuted,
            fontSize: 12,
            fontWeight: '600',
        },
        calendarGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        calendarDay: {
            width: '14.28%',
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
        },
        dayContainer: {
            width: 34,
            height: 34,
            borderRadius: 17,
            justifyContent: 'center',
            alignItems: 'center',
        },
        calendarDayText: {
            textAlign: 'center',
            fontSize: 13,
            fontWeight: '500',
            color: tc.calendarDayText,
        },
        otherMonthText: {
            color: tc.calendarOtherMonth,
        },
        todayContainer: {
            backgroundColor: tc.todayBg,
            borderWidth: 1.5,
            borderColor: '#4A90B9',
        },
        todayText: {
            color: '#4A90B9',
            fontWeight: '700',
        },
        selectedDateGradient: {
            width: 34,
            height: 34,
            borderRadius: 17,
            justifyContent: 'center',
            alignItems: 'center',
        },
        selectedDateText: {
            color: 'white',
            fontWeight: '700',
            fontSize: 13,
        },
        // Appointments
        appointmentsHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
            marginBottom: 12,
        },
        appointmentsTitle: {
            fontSize: 19,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        appointmentsSubtitle: {
            fontSize: 13,
            color: tc.textMuted,
            marginTop: 2,
        },
        appointmentCard: {
            flexDirection: 'row',
            backgroundColor: tc.cardBackground,
            borderRadius: 14,
            marginBottom: 10,
            overflow: 'hidden',
            borderWidth: isDark ? 1 : 0,
            borderColor: tc.borderColor,
            ...Platform.select({
                ios: {
                    shadowColor: tc.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0 : 0.05,
                    shadowRadius: 8,
                },
                android: { elevation: isDark ? 0 : 1 },
            }),
        },
        timeIndicator: {
            width: 56,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
            borderRightWidth: 1,
            borderRightColor: tc.borderLight,
        },
        timeDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            marginBottom: 6,
        },
        appointmentTime: {
            fontSize: 13,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        appointmentContent: {
            flex: 1,
            padding: 14,
        },
        appointmentTopRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        patientInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        avatarContainer: {
            marginRight: 10,
        },
        avatar: {
            width: 38,
            height: 38,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatarText: {
            color: 'white',
            fontWeight: '700',
            fontSize: 13,
        },
        patientDetails: {
            flex: 1,
        },
        patientName: {
            fontWeight: '600',
            fontSize: 15,
            color: tc.textPrimary,
        },
        patientId: {
            color: tc.textMuted,
            fontSize: 12,
            marginTop: 2,
        },
        moreButton: {
            padding: 4,
        },
        appointmentBottomRow: {
            flexDirection: 'row',
            marginTop: 10,
            gap: 8,
        },
        statusChip: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 20,
            gap: 5,
        },
        statusText: {
            fontSize: 12,
            fontWeight: '600',
        },
        typeChip: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 20,
            backgroundColor: tc.chipBg,
            gap: 5,
        },
        typeText: {
            fontSize: 12,
            color: tc.chipText,
            fontWeight: '500',
        },
        // FAB
        fab: {
            position: 'absolute',
            right: 16,
            bottom: hp(5),
            borderRadius: 28,
            ...Platform.select({
                ios: {
                    shadowColor: '#4A90B9',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                },
                android: { elevation: 6 },
            }),
        },
        fabGradient: {
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
        },
        // Visits loading / empty states
        visitsLoadingContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 30,
            gap: 10,
        },
        visitsLoadingText: {
            fontSize: 14,
            color: tc.textMuted,
        },
        emptyVisitsContainer: {
            alignItems: 'center',
            paddingVertical: 40,
            backgroundColor: tc.emptyBg,
            borderRadius: 14,
            marginBottom: 10,
            borderWidth: isDark ? 1 : 0,
            borderColor: tc.borderColor,
        },
        emptyVisitsTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: tc.textSecondary,
            marginTop: 12,
        },
        emptyVisitsSubtitle: {
            fontSize: 13,
            color: tc.textMuted,
            marginTop: 4,
        },
    });

export default Dashboard;