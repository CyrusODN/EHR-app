import React, { useEffect, useState, useCallback } from 'react';
import {
    View, ScrollView,
    StyleSheet,
    TouchableOpacity,
    BackHandler,
    Platform,
    ActivityIndicator,
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
import userStore from '../../store/user';
import { GetDashboardVisits } from '../../Services/DashboardServices';
import { Modal } from 'react-native';

const Dashboard = () => {
    const { t } = useTranslation();
    const { loggedInUser } = userStore();

    useEffect(() => {
        console.log("loggedInUser", loggedInUser);
    }, [loggedInUser])

    const navigation = useNavigation<any>();
    const currentMonth = 'April 2025';
    const { colors } = useTheme();
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [viewDate, setViewDate] = useState(new Date()); // Date being viewed in calendar
    const [createVisitModalVisible, setCreateVisitModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [calendarModalVisible, setCalendarModalVisible] = useState(false);

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
                isToday: i === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
                isSelected: i === selectedDate && month === new Date().getMonth() && year === new Date().getFullYear() // simplified selection logic
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
            setSelectedDate(day.day);
        }
    };

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    // Format the currently selected full date as YYYY-MM-DD for the API
    const getFormattedSelectedDate = useCallback(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const d = new Date(year, month, selectedDate);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }, [viewDate, selectedDate]);

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
        }, [fetchVisits])
    );

    // Also re-fetch when date selection changes
    useEffect(() => {
        fetchVisits();
    }, [selectedDate, viewDate]);

    const currentMonthDisplay = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const days = getDaysInMonth();
    const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    // Combine all visits for display (scheduled + completed + visits)
    const appointments = [
        ...scheduleVisits.map((v: any) => ({
            time: v.time || v.startTime || '--:--',
            patient: v.patientId?.firstName
                ? `${v.patientId.firstName} ${v.patientId.lastName || ''}`
                : v.patientName || 'Unknown Patient',
            patientId: v.patientId?._id || v.patientId || '',
            status: 'Scheduled',
            type: v.type || v.visitType || 'Visit',
        })),
        ...completedVisits.map((v: any) => ({
            time: v.time || v.startTime || '--:--',
            patient: v.patientId?.firstName
                ? `${v.patientId.firstName} ${v.patientId.lastName || ''}`
                : v.patientName || 'Unknown Patient',
            patientId: v.patientId?._id || v.patientId || '',
            status: 'Completed',
            type: v.type || v.visitType || 'Visit',
        })),
        ...visits.map((v: any) => ({
            time: v.time || v.startTime || '--:--',
            patient: v.patientId?.firstName
                ? `${v.patientId.firstName} ${v.patientId.lastName || ''}`
                : v.patientName || 'Unknown Patient',
            patientId: v.patientId?._id || v.patientId || '',
            status: v.status || 'Scheduled',
            type: v.type || v.visitType || 'Visit',
        })),
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Scheduled':
                return { bg: '#EFF6FF', text: '#2563EB', icon: 'clock' };
            case 'In Progress':
                return { bg: '#FEF3C7', text: '#D97706', icon: 'play-circle' };
            case 'Completed':
                return { bg: '#ECFDF5', text: '#059669', icon: 'check-circle' };
            default:
                return { bg: '#F3F4F6', text: '#6B7280', icon: 'circle' };
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <View style={styles.container}>
            <Header onMenuPress={() => { setDrawerVisible(true) }} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.greeting}>
                            {t('dashboard.title')}
                        </Text>
                        <Text style={styles.subtitle}>Overview of key information</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.calendarTriggerBtn}
                        onPress={() => setCalendarModalVisible(true)}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#4A90B9', '#68BFB3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.calendarTriggerGradient}
                        >
                            <Icon name="calendar-month-outline" size={26} color="white" />
                        </LinearGradient>
                        <View style={styles.dateBadge}>
                            <Text style={styles.dateBadgeText}>{selectedDate}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtonsRow}>
                    <TouchableOpacity
                        style={styles.newVisitBtn}
                        onPress={() => setCreateVisitModalVisible(true)}
                        activeOpacity={0.85}
                    >
                        <LinearGradient
                            colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientBtn}
                        >
                            <View style={styles.btnIconCircle}>
                                <FontAwesome6 name="plus" size={12} color="#4A90B9" />
                            </View>
                            <Text style={styles.newVisitBtnText}>New Visit</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.newPatientBtn}
                        onPress={() => navigation.navigate('New-Patient')}
                        activeOpacity={0.85}
                    >
                        <View style={styles.patientBtnIcon}>
                            <Feather name="user-plus" size={14} color="#4A90B9" />
                        </View>
                        <Text style={styles.newPatientBtnText}>New Patient</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Feather name="search" size={18} color="#9CA3AF" style={{ marginLeft: 2 }} />
                    <Searchbar
                        placeholder={t('nav.patients.search') + '...'}
                        placeholderTextColor="#9CA3AF"
                        style={styles.searchBar}
                        inputStyle={styles.searchInput}
                        icon={() => null}
                        value={''}
                    />
                </View>

                {/* Dashboard Stats */}
                <DashboardStatsCard
                    todaysPatients={todaysPatients.length}
                    scheduledVisits={scheduleVisits.length}
                    completedVisits={completedVisits.length}
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
                        style={styles.modalOverlay} 
                        activeOpacity={1} 
                        onPress={() => setCalendarModalVisible(false)}
                    >
                        <View style={styles.calendarModalContent}>
                            <View style={styles.calendarCardModal}>
                                <View style={styles.calendarHeader}>
                                    <View style={styles.calendarHeaderLeft}>
                                        <View style={styles.calendarIconBg}>
                                            <Icon name="calendar-month" size={18} color="#4A90B9" />
                                        </View>
                                        <Text style={styles.calendarTitle}>{currentMonthDisplay}</Text>
                                    </View>
                                    <View style={styles.calendarNavigation}>
                                        <TouchableOpacity style={styles.calendarNavBtn} onPress={handlePrevMonth}>
                                            <Feather name="chevron-left" size={18} color="#6B7280" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.calendarNavBtn} onPress={handleNextMonth}>
                                            <Feather name="chevron-right" size={18} color="#6B7280" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Weekday Headers */}
                                <View style={styles.weekdayRow}>
                                    {weekdays.map((day, index) => (
                                        <Text key={index} style={styles.weekdayText}>
                                            {day}
                                        </Text>
                                    ))}
                                </View>

                                {/* Calendar Days Grid */}
                                <View style={styles.calendarGrid}>
                                    {days.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.calendarDay}
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
                                                    style={styles.selectedDateGradient}
                                                >
                                                    <Text style={styles.selectedDateText}>
                                                        {item.day}
                                                    </Text>
                                                </LinearGradient>
                                            ) : (
                                                <View style={[
                                                    styles.dayContainer,
                                                    item.isToday && !item.isSelected ? styles.todayContainer : null,
                                                ]}>
                                                    <Text
                                                        style={[
                                                            styles.calendarDayText,
                                                            !item.isCurrentMonth ? styles.otherMonthText : null,
                                                            item.isToday && !item.isSelected ? styles.todayText : null,
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
                                    style={styles.closeCalendarBtn}
                                    onPress={() => setCalendarModalVisible(false)}
                                >
                                    <Text style={styles.closeCalendarText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Appointments Section */}
                <View style={styles.appointmentsHeader}>
                    <View>
                        <Text style={styles.appointmentsTitle}>
                            Today's Visits
                        </Text>
                        <Text style={styles.appointmentsSubtitle}>
                            {getFormattedSelectedDate()} · {appointments.length} visits
                        </Text>
                    </View>
                </View>

                {/* Loading State */}
                {visitsLoading && (
                    <View style={styles.visitsLoadingContainer}>
                        <ActivityIndicator size="small" color="#4A90B9" />
                        <Text style={styles.visitsLoadingText}>Loading visits...</Text>
                    </View>
                )}

                {/* Empty State */}
                {!visitsLoading && appointments.length === 0 && (
                    <View style={styles.emptyVisitsContainer}>
                        <Icon name="calendar-blank-outline" size={48} color="#D1D5DB" />
                        <Text style={styles.emptyVisitsTitle}>No visits found</Text>
                        <Text style={styles.emptyVisitsSubtitle}>There are no visits scheduled for this date</Text>
                    </View>
                )}

                {/* Appointment Cards */}
                {!visitsLoading && appointments.map((appointment, index) => {
                    const statusStyle = getStatusStyle(appointment.status);
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.appointmentCard}
                            activeOpacity={0.7}
                            onPress={() => setShowActionModal(true)}
                        >
                            {/* Time Indicator */}
                            <View style={styles.timeIndicator}>
                                <View style={[styles.timeDot, { backgroundColor: statusStyle.text }]} />
                                <Text style={styles.appointmentTime}>{appointment.time}</Text>
                            </View>

                            {/* Card Content */}
                            <View style={styles.appointmentContent}>
                                <View style={styles.appointmentTopRow}>
                                    <View style={styles.patientInfo}>
                                        <View style={styles.avatarContainer}>
                                            <LinearGradient
                                                colors={['#4A90B9', '#68BFB3']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                style={styles.avatar}
                                            >
                                                <Text style={styles.avatarText}>
                                                    {getInitials(appointment.patient)}
                                                </Text>
                                            </LinearGradient>
                                        </View>
                                        <View style={styles.patientDetails}>
                                            <Text style={styles.patientName} numberOfLines={1}>
                                                {appointment.patient}
                                            </Text>
                                            <Text style={styles.patientId} numberOfLines={1}>
                                                ID: {appointment.patientId}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.moreButton}>
                                        <Icon name="dots-vertical" size={20} color="#9CA3AF" />
                                    </View>
                                </View>

                                <View style={styles.appointmentBottomRow}>
                                    <View style={[styles.statusChip, { backgroundColor: statusStyle.bg }]}>
                                        <Feather name={statusStyle.icon} size={12} color={statusStyle.text} />
                                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                                            {appointment.status}
                                        </Text>
                                    </View>
                                    <View style={styles.typeChip}>
                                        <Icon name="stethoscope" size={13} color="#4A90B9" />
                                        <Text style={styles.typeText}>{appointment.type}</Text>
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
            />

            <SlidingDrawerModal
                visible={drawerVisible}
                onClose={() => { setDrawerVisible(false) }}
            />

            <ActionModal
                visible={showActionModal}
                onClose={() => { setShowActionModal(false) }}
                onView={() => { }}
                onStart={() => { }}
                onAddNote={() => { }}
            />

            {/* FAB */}
            <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
                <LinearGradient
                    colors={['#4A90B9', '#68BFB3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.fabGradient}
                >
                    <Icon name="help-circle-outline" size={24} color="#ffffff" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F6F8',
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
        fontWeight: '800',
        color: '#1F2937',
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 3,
    },
    calendarTriggerBtn: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#EBF5F7',
        ...Platform.select({
            ios: {
                shadowColor: '#4A90B9',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: { elevation: 3 },
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
        borderColor: '#fff',
    },
    dateBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '800',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    calendarModalContent: {
        width: '100%',
        maxWidth: 400,
    },
    calendarCardModal: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.2,
                shadowRadius: 20,
            },
            android: { elevation: 10 },
        }),
    },
    closeCalendarBtn: {
        marginTop: 20,
        backgroundColor: '#F3F4F6',
        paddingVertical: 12,
        borderRadius: 14,
        alignItems: 'center',
    },
    closeCalendarText: {
        color: '#4B5563',
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
                shadowOpacity: 0.25,
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
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#E0EBF0',
    },
    patientBtnIcon: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#EBF5F7',
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
        backgroundColor: '#fff',
        borderRadius: 14,
        marginBottom: 14,
        paddingHorizontal: wp(2.5),
        borderWidth: 1,
        borderColor: '#E8EDF2',
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
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginTop: 6,
        marginBottom: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 10,
            },
            android: { elevation: 2 },
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
        backgroundColor: '#EBF5FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    calendarTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1F2937',
    },
    calendarNavigation: {
        flexDirection: 'row',
        gap: 4,
    },
    calendarNavBtn: {
        width: 32,
        height: 32,
        borderRadius: 9,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    weekdayRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginBottom: 4,
    },
    weekdayText: {
        width: 30,
        textAlign: 'center',
        color: '#9CA3AF',
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
        color: '#374151',
    },
    otherMonthText: {
        color: '#D1D5DB',
    },
    todayContainer: {
        backgroundColor: '#F0F7FA',
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
        color: '#1F2937',
    },
    appointmentsSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 2,
    },
    appointmentCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 14,
        marginBottom: 10,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: { elevation: 1 },
        }),
    },
    timeIndicator: {
        width: 56,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRightWidth: 1,
        borderRightColor: '#F3F4F6',
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
        color: '#374151',
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
        color: '#1F2937',
    },
    patientId: {
        color: '#9CA3AF',
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
        backgroundColor: '#EBF5FA',
        gap: 5,
    },
    typeText: {
        fontSize: 12,
        color: '#4A90B9',
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
        color: '#9CA3AF',
    },
    emptyVisitsContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#fff',
        borderRadius: 14,
        marginBottom: 10,
    },
    emptyVisitsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
        marginTop: 12,
    },
    emptyVisitsSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 4,
    },
});

export default Dashboard;