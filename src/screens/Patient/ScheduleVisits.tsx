import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    Platform,
    Dimensions,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import PrimaryButton from '../../component/button';
import CustomTextInput from '../../component/customTextInput';
import Gap from '../../component/gap';
import CustomDropdown from '../../component/customDropDown';
import { useThemeColors } from '../../hooks/useThemeColors';
import { GetMyPermissions } from '../../Services/settingServices';
import { GetVisits } from '../../Services/Visit.Service';
import CreateVisitModal from '../Home/modals/createVisit';
import ScheduledVisitsModal from '../Home/modals/ScheduledVisitsModal';
import CustomAlert from '../../component/customAlert';

const { width } = Dimensions.get('window');

export const ScheduleVisitsScreen = () => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const navigation = useNavigation<any>();

    const [viewMode, setViewMode] = useState('Week');
    const [currentBaseDate, setCurrentBaseDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date().getDate().toString());
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);

    // Filter States
    const [visitStartDate, setVisitStartDate] = useState<Date | null>(null);
    const [visitEndDate, setVisitEndDate] = useState<Date | null>(null);
    const [visitStartTime, setVisitStartTime] = useState<Date | null>(null);
    const [visitEndTime, setVisitEndTime] = useState<Date | null>(null);
    const [visitType, setVisitType] = useState<string | number>('All');
    const [status, setStatus] = useState<string | number>('All');
    const [hasReferral, setHasReferral] = useState(false);
    const [appointmentType, setAppointmentType] = useState<string | number>('All');
    const [doctorSearch, setDoctorSearch] = useState('');
    const [patientSearch, setPatientSearch] = useState('');
    const [activePicker, setActivePicker] = useState<{ type: 'date' | 'time', field: string } | null>(null);
    const [isCreateVisitModalVisible, setIsCreateVisitModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedDayVisits, setSelectedDayVisits] = useState<any[]>([]);
    const [selectedSingleVisit, setSelectedSingleVisit] = useState<any>(null);
    const [alertConfig, setAlertConfig] = useState<any>({
        visible: false,
        type: 'success',
        message: '',
    });

    const showAlert = (type: 'success' | 'error' | 'warning', message: string) => {
        setAlertConfig({
            visible: true,
            type,
            message,
        });
    };

    const visitTypeOptions = [
        { label: t('appointments.filters.visitType.all'), value: 'All' },
        { label: t('appointments.filters.visitType.nfz'), value: 'NFZ' },
        { label: t('appointments.filters.visitType.private'), value: 'Private' },
    ];

    const statusOptions = [
        { label: t('appointments.filters.status.all'), value: 'All' },
        { label: t('appointments.filters.status.scheduled'), value: 'scheduled' },
        { label: t('appointments.filters.status.confirmed'), value: 'confirmed' },
        { label: t('appointments.filters.status.inProgress'), value: 'in_progress' },
        { label: t('appointments.filters.status.completed'), value: 'completed' },
        { label: t('appointments.filters.status.cancelled'), value: 'cancelled' },
    ];

    const formatDisplayHeader = (date: Date, mode: string) => {
        if (mode === 'Day') {
            return date.toLocaleDateString(t('common.dateLocale') || 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        } else if (mode === 'Week') {
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1);
            const start = new Date(date.getTime());
            start.setDate(diff);
            const end = new Date(start.getTime());
            end.setDate(start.getDate() + 6);
            return `${start.getDate()} - ${end.getDate()} ${end.toLocaleDateString(t('common.dateLocale') || 'en-GB', { month: 'long', year: 'numeric' })}`;
        } else {
            return date.toLocaleDateString(t('common.dateLocale') || 'en-GB', { month: 'long', year: 'numeric' });
        }
    };

    const [currentHeaderText, setCurrentHeaderText] = useState(formatDisplayHeader(currentBaseDate, viewMode));

    useEffect(() => {
        setCurrentHeaderText(formatDisplayHeader(currentBaseDate, viewMode));
    }, [currentBaseDate, viewMode, t]);

    // Generate days logic
    const getDaysForCurrentView = () => {
        if (viewMode === 'Day') {
            return [{
                name: currentBaseDate.toLocaleDateString(t('common.dateLocale') || 'en-GB', { weekday: 'short' }),
                date: currentBaseDate.getDate().toString(),
                fullDate: currentBaseDate
            }];
        } else if (viewMode === 'Week') {
            const days = [];
            const dayNames = [
                t('appointments.calendar.mon') || 'Mon',
                t('appointments.calendar.tue') || 'Tue',
                t('appointments.calendar.wed') || 'Wed',
                t('appointments.calendar.thu') || 'Thu',
                t('appointments.calendar.fri') || 'Fri',
                t('appointments.calendar.sat') || 'Sat',
                t('appointments.calendar.sun') || 'Sun'
            ];
            const day = currentBaseDate.getDay();
            const diff = currentBaseDate.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(currentBaseDate.getTime());
            monday.setDate(diff);

            for (let i = 0; i < 7; i++) {
                const d = new Date(monday.getTime());
                d.setDate(monday.getDate() + i);
                days.push({
                    name: dayNames[i],
                    date: d.getDate().toString(),
                    fullDate: d
                });
            }
            return days;
        } else {
            // Month view: all days of current month
            const days = [];
            const year = currentBaseDate.getFullYear();
            const month = currentBaseDate.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);

            // Padding from previous month to start on Monday
            let startPadding = firstDay.getDay();
            startPadding = startPadding === 0 ? 6 : startPadding - 1;

            for (let i = -startPadding; i < lastDay.getDate() + (7 - lastDay.getDay() || 7); i++) {
                const d = new Date(year, month, i + 1);
                days.push({
                    name: d.toLocaleDateString(t('common.dateLocale') || 'en-GB', { weekday: 'short' }),
                    date: d.getDate().toString(),
                    fullDate: d,
                    isCurrentMonth: d.getMonth() === month
                });
            }
            return days;
        }
    };

    const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    const [appointments, setAppointments] = useState<any[]>([]);

    useEffect(() => {
        const init = async () => {
            await GetMyPermissions();
            fetchVisits();
        };
        init();
    }, []);

    const fetchVisits = async () => {
        setLoading(true);
        try {
            const params = {
                dateFrom: visitStartDate ? visitStartDate.toISOString().split('T')[0] : '',
                dateTo: visitEndDate ? visitEndDate.toISOString().split('T')[0] : '',
                timeFrom: visitStartTime ? visitStartTime.toTimeString().split(' ')[0].substring(0, 5) : '',
                timeTo: visitEndTime ? visitEndTime.toTimeString().split(' ')[0].substring(0, 5) : '',
                visitType: visitType === 'All' ? '' : visitType,
                status: status === 'All' ? '' : status,
                hasReferral: hasReferral ? 'true' : '',
                appointmentType: appointmentType === 'All' ? '' : appointmentType,
                doctorSearch: doctorSearch,
                patientSearch: patientSearch
            };

            const res: any = await GetVisits(params);
            const data = res?.data || res;
            const visitsData = data?.visits || data?.scheduleVisits || [];
            
            const mappedAppointments = visitsData.map((v: any) => {
                const startTime = v.startTime || "00:00";
                const endTime = v.endTime || "00:30";
                
                const startParts = startTime.split(':').map(Number);
                const endParts = endTime.split(':').map(Number);
                const durationMinutes = (endParts[0] * 60 + endParts[1]) - (startParts[0] * 60 + startParts[1]);

                return {
                    id: v.id || v._id,
                    fullDate: v.date,
                    time: startTime,
                    endTime: endTime,
                    patient: v.patient?.name || t('patientDetailsModal.empty.na'),
                    patientObj: v.patient || null,
                    doctor: v.doctor?.name || t('common.na'),
                    doctorObj: v.doctor || null,
                    duration: durationMinutes > 0 ? durationMinutes : 30,
                    status: v.status,
                    specialization: v.specialization || '',
                    visitType: v.visitType || '',
                    notes: v.notes || '',
                    office: v.office || '',
                    appointmentType: v.appointmentType || '',
                };
            });
            setAppointments(mappedAppointments);
        } catch (error) {
            console.error("ScheduleVisits.tsx: Error fetching visits", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevious = () => {
        const newDate = new Date(currentBaseDate.getTime());
        if (viewMode === 'Day') newDate.setDate(newDate.getDate() - 1);
        else if (viewMode === 'Week') newDate.setDate(newDate.getDate() - 7);
        else newDate.setMonth(newDate.getMonth() - 1);
        setCurrentBaseDate(newDate);
        setSelectedDay(newDate.getDate().toString());
    };

    const handleNext = () => {
        const newDate = new Date(currentBaseDate.getTime());
        if (viewMode === 'Day') newDate.setDate(newDate.getDate() + 1);
        else if (viewMode === 'Week') newDate.setDate(newDate.getDate() + 7);
        else newDate.setMonth(newDate.getMonth() + 1);
        setCurrentBaseDate(newDate);
        setSelectedDay(newDate.getDate().toString());
    };

    const handleDaySelect = (date: string) => {
        setSelectedDay(date);
    };

    const formatDate = (date: any) => {
        if (!date) return t('patientSearch.filters.placeholders.dob') || 'dd/mm/yyyy';
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    const formatTime = (date: any) => {
        if (!date) return '--:-- --';
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        if (selectedDate && activePicker) {
            const { field } = activePicker;
            if (field === 'visitStart') setVisitStartDate(selectedDate);
            else if (field === 'visitEnd') setVisitEndDate(selectedDate);
            else if (field === 'timeStart') setVisitStartTime(selectedDate);
            else if (field === 'timeEnd') setVisitEndTime(selectedDate);
            setActivePicker(null);
        } else if (event.type === 'dismissed') {
            setActivePicker(null);
        }
    };

    const clearFilters = () => {
        setVisitStartDate(null);
        setVisitEndDate(null);
        setVisitStartTime(null);
        setVisitEndTime(null);
        setVisitType('All');
        setStatus('All');
        setHasReferral(false);
    };

    const renderCheckbox = (isChecked: boolean, onToggle: any, label: string) => (
        <TouchableOpacity
            style={ds.checkboxContainer}
            onPress={() => onToggle(!isChecked)}
        >
            <View style={[ds.checkbox, isChecked && ds.checkboxChecked]}>
                {isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={ds.checkboxLabel}>{label}</Text>
        </TouchableOpacity>
    );

    const getVisitsForDate = (dayFullDate: Date) => {
        const year = dayFullDate.getFullYear();
        const month = (dayFullDate.getMonth() + 1).toString().padStart(2, '0');
        const day = dayFullDate.getDate().toString().padStart(2, '0');
        const formattedDay = `${year}-${month}-${day}`;

        return appointments.filter(app => {
            if (!app.fullDate) return false;
            const appDate = new Date(app.fullDate);
            const appYear = appDate.getFullYear();
            const appMonth = (appDate.getMonth() + 1).toString().padStart(2, '0');
            const appDay = appDate.getDate().toString().padStart(2, '0');
            return `${appYear}-${appMonth}-${appDay}` === formattedDay;
        });
    };

    const mapAppToVisit = (app: any) => ({
        id: app.id,
        patient: app.patientObj || { name: app.patient },
        startTime: app.time,
        endTime: app.endTime || '',
        date: app.fullDate,
        status: app.status,
        visitType: app.visitType || '',
        specialization: app.specialization || '',
        doctor: app.doctorObj || { name: app.doctor },
        notes: app.notes || '',
        office: app.office || '',
        appointmentType: app.appointmentType || '',
    });

    const showDayDetailModal = (dayFullDate: Date) => {
        const dayVisits = getVisitsForDate(dayFullDate);
        if (dayVisits.length > 0) {
            const mapped = dayVisits.map(mapAppToVisit);
            setSelectedDayVisits(mapped);
            setSelectedSingleVisit(null);
            setIsDetailModalVisible(true);
        }
    };

    const showVisitDetail = (app: any) => {
        setSelectedSingleVisit(mapAppToVisit(app));
        setSelectedDayVisits([]);
        setIsDetailModalVisible(true);
    };

    const renderAppointment = (dayFullDate: Date, time: string) => {
        const year = dayFullDate.getFullYear();
        const month = (dayFullDate.getMonth() + 1).toString().padStart(2, '0');
        const day = dayFullDate.getDate().toString().padStart(2, '0');
        const formattedDay = `${year}-${month}-${day}`;

        const appointment = appointments.find(app => {
            if (!app.fullDate) return false;
            
            const appDate = new Date(app.fullDate);
            const appYear = appDate.getFullYear();
            const appMonth = (appDate.getMonth() + 1).toString().padStart(2, '0');
            const appDay = appDate.getDate().toString().padStart(2, '0');
            const appDateStr = `${appYear}-${appMonth}-${appDay}`;

            const appHour = app.time ? app.time.split(':')[0] + ':00' : '00:00';
            
            const isMatch = appDateStr === formattedDay && appHour === time;
            return isMatch;
        });

        if (appointment) {
            const statusColors: any = {
                scheduled: isDark ? 'rgba(70, 183, 198, 0.15)' : '#E0F2FE',
                completed: isDark ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7',
                cancelled: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
                in_progress: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF9C3'
            };
            const borderColors: any = {
                scheduled: tc.accent,
                completed: tc.success,
                cancelled: tc.error,
                in_progress: tc.warning
            };
            
            return (
                <TouchableOpacity
                style={[
                        ds.appointmentContainer, 
                        { 
                            backgroundColor: statusColors[appointment.status] || (isDark ? 'rgba(70, 183, 198, 0.1)' : '#E0F2FE'),
                            borderLeftColor: borderColors[appointment.status] || tc.accent
                        }
                    ]}
                    activeOpacity={0.7}
                    onPress={() => showVisitDetail(appointment)}
                >
                    <View>
                        <Text style={ds.appointmentPatient} numberOfLines={1}>{appointment.patient}</Text>
                        <Text style={ds.appointmentDoctor} numberOfLines={1}>{appointment.doctor}</Text>
                        <Text style={ds.appointmentDuration}>{appointment.duration} min</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        return null;
    };

    return (
        <SafeAreaView style={ds.safeArea}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.statusBarBg} />
            <View style={ds.container}>
                {/* Header */}
                <View style={ds.header}>
                    <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: 'center' }}>
                        <View>
                            <Text style={ds.headerTitle}>{t('appointments.title')}</Text>
                            <Text style={ds.headerSubtitle}>
                                {t('appointments.description')}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={ds.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={20} color={tc.accent} />
                        </TouchableOpacity>
                    </View>
                    <View style={ds.headerButtons}>
                        <PrimaryButton
                            label={t('appointments.actions.filters')}
                            filled={false}
                            onPress={() => setShowFilters(!showFilters)}
                            style={{ width: wp(30), marginEnd: 10 }}
                            icon={<Feather name={showFilters ? "x" : "filter"} size={17} color={tc.accent} />}
                            loading={false}
                            disabled={false}
                        />
                        <PrimaryButton
                            label={t('appointments.actions.newVisit')}
                            filled={true}
                            onPress={() => setIsCreateVisitModalVisible(true)}
                            style={{ width: wp(49) }}
                            icon={<Feather name="plus" size={20} color="white" />}
                            loading={false}
                            disabled={false}
                        />
                    </View>
                </View>

                {/* Filter Panel */}
                {showFilters && (
                    <View style={ds.filterSection}>
                        <View style={ds.filterGrid}>
                            <View style={[ds.filterItem, { minWidth: '100%' }]}>
                                <Text style={ds.filterLabel}>{t('appointments.filters.visitDate')}</Text>
                                <View style={ds.rowInputs}>
                                    <TouchableOpacity style={ds.dateSelector} onPress={() => setActivePicker({ type: 'date', field: 'visitStart' })}>
                                        <Text style={ds.selectorText} numberOfLines={1} ellipsizeMode="tail">{formatDate(visitStartDate)}</Text>
                                        <MaterialCommunityIcons name="calendar" size={16} color={tc.textSecondary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={ds.dateSelector} onPress={() => setActivePicker({ type: 'date', field: 'visitEnd' })}>
                                        <Text style={ds.selectorText} numberOfLines={1} ellipsizeMode="tail">{formatDate(visitEndDate)}</Text>
                                        <MaterialCommunityIcons name="calendar" size={16} color={tc.textSecondary} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={[ds.filterItem, { minWidth: '100%' }]}>
                                <Text style={ds.filterLabel}>{t('appointments.filters.visitTime')}</Text>
                                <View style={ds.rowInputs}>
                                    <TouchableOpacity style={ds.dateSelector} onPress={() => setActivePicker({ type: 'time', field: 'timeStart' })}>
                                        <Text style={ds.selectorText} numberOfLines={1} ellipsizeMode="tail">{formatTime(visitStartTime)}</Text>
                                        <Feather name="clock" size={16} color={tc.textSecondary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={ds.dateSelector} onPress={() => setActivePicker({ type: 'time', field: 'timeEnd' })}>
                                        <Text style={ds.selectorText} numberOfLines={1} ellipsizeMode="tail">{formatTime(visitEndTime)}</Text>
                                        <Feather name="clock" size={16} color={tc.textSecondary} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={[ds.filterItem, { minWidth: '45%' }]}>
                                <Text style={ds.filterLabel}>{t('appointments.filters.visitType.label')}</Text>
                                <CustomDropdown
                                    placeholder={t('appointments.filters.visitType.all')}
                                    options={visitTypeOptions}
                                    value={visitType}
                                    onChange={setVisitType}
                                />
                            </View>

                            <View style={[ds.filterItem, { minWidth: '45%' }]}>
                                <Text style={ds.filterLabel}>{t('appointments.filters.status.label')}</Text>
                                <CustomDropdown
                                    placeholder={t('appointments.filters.status.all')}
                                    options={statusOptions}
                                    value={status}
                                    onChange={setStatus}
                                />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                            <View style={{ flex: 1 }}>
                                {renderCheckbox(hasReferral, setHasReferral, t('appointments.filters.hasReferral'))}
                            </View>
                            <View style={ds.filterActionButtons}>
                                <TouchableOpacity style={ds.clearBtn} onPress={clearFilters}>
                                    <Text style={ds.clearBtnText}>{t('appointments.actions.clearFilters')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={ds.applyBtn} onPress={() => setShowFilters(false)}>
                                    <Text style={ds.applyBtnText}>{t('appointments.actions.applyFilters')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Calendar Navigation */}
                <View style={ds.calendarNav}>
                    <TouchableOpacity onPress={handlePrevious} style={ds.navButton}>
                        <Ionicons name="chevron-back" size={24} color={tc.textPrimary} />
                    </TouchableOpacity>
                    <Text style={ds.currentDateText}>{currentHeaderText}</Text>
                    <TouchableOpacity onPress={handleNext} style={ds.navButton}>
                        <Ionicons name="chevron-forward" size={24} color={tc.textPrimary} />
                    </TouchableOpacity>
                </View>

                <View style={ds.viewToggleContainer}>
                    <PrimaryButton
                        label={t('appointments.calendar.day')}
                        filled={viewMode === 'Day'}
                        style={[ds.viewToggleButton]}
                        onPress={() => setViewMode('Day')}
                        loading={false}
                        disabled={false}
                    />
                    <PrimaryButton
                        label={t('appointments.calendar.week')}
                        filled={viewMode === 'Week'}
                        style={[ds.viewToggleButton]}
                        onPress={() => setViewMode('Week')}
                        loading={false}
                        disabled={false}
                    />
                    <PrimaryButton
                        label={t('appointments.calendar.month')}
                        filled={viewMode === 'Month'}
                        style={[ds.viewToggleButton]}
                        onPress={() => setViewMode('Month')}
                        loading={false}
                        disabled={false}
                    />
                </View>

                <View style={ds.calendarContainer}>
                    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                        <View style={{ flexDirection: 'row' }}>
                            {viewMode !== 'Month' && (
                                <View style={ds.timeLabelsColumn}>
                                    <View style={ds.headerSpacer} />
                                    {timeSlots.map((time) => (
                                        <View key={time} style={ds.timeLabelCell}>
                                            <Text style={ds.timeLabelText}>{time}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            <ScrollView horizontal={viewMode !== 'Month'} showsHorizontalScrollIndicator={false} bounces={false} contentContainerStyle={{ flex: viewMode === 'Month' ? 1 : undefined }}>
                                <View style={{ flex: 1 }}>
                                    <View style={ds.calendarDayHeader}>
                                        {(viewMode === 'Month' ? [
                                            t('appointments.calendar.mon') || 'Mon',
                                            t('appointments.calendar.tue') || 'Tue',
                                            t('appointments.calendar.wed') || 'Wed',
                                            t('appointments.calendar.thu') || 'Thu',
                                            t('appointments.calendar.fri') || 'Fri',
                                            t('appointments.calendar.sat') || 'Sat',
                                            t('appointments.calendar.sun') || 'Sun'
                                        ] : getDaysForCurrentView().map(d => d.name)).map((name, idx) => (
                                            <View key={idx} style={[ds.dayColumnHeader, { width: viewMode === 'Month' ? wp(100) / 7 : 70 }]}>
                                                <Text style={ds.dayNameText}>{name}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    {viewMode === 'Month' ? (
                                        <View style={ds.monthGrid}>
                                            {getDaysForCurrentView().map((dayInfo: any, idx) => {
                                                const year = dayInfo.fullDate.getFullYear();
                                                const month = (dayInfo.fullDate.getMonth() + 1).toString().padStart(2, '0');
                                                const day = dayInfo.fullDate.getDate().toString().padStart(2, '0');
                                                const formattedDay = `${year}-${month}-${day}`;
                                                
                                                const dayVisits = appointments.filter(app => {
                                                    if (!app.fullDate) return false;
                                                    const appDate = new Date(app.fullDate);
                                                    const appYear = appDate.getFullYear();
                                                    const appMonth = (appDate.getMonth() + 1).toString().padStart(2, '0');
                                                    const appDay = appDate.getDate().toString().padStart(2, '0');
                                                    return `${appYear}-${appMonth}-${appDay}` === formattedDay;
                                                });

                                                return (
                                                    <TouchableOpacity 
                                                        key={idx} 
                                                        style={[
                                                            ds.monthDayCell, 
                                                            !dayInfo.isCurrentMonth && { opacity: 0.3 },
                                                            formattedDay === new Date().toISOString().split('T')[0] && { backgroundColor: isDark ? 'rgba(70, 183, 198, 0.1)' : '#F1F5F9' }
                                                        ]}
                                                        onPress={() => {
                                                            if (dayVisits.length > 0) {
                                                                showDayDetailModal(dayInfo.fullDate);
                                                            } else {
                                                                setCurrentBaseDate(dayInfo.fullDate);
                                                                setViewMode('Day');
                                                            }
                                                        }}
                                                    >
                                                        <Text style={[
                                                            ds.monthDayText,
                                                            formattedDay === new Date().toISOString().split('T')[0] && { color: tc.accent }
                                                        ]}>
                                                            {dayInfo.date}
                                                        </Text>
                                                        <View style={ds.monthVisitsContainer}>
                                                            {dayVisits.slice(0, 3).map((visit, vIdx) => (
                                                                <View key={visit.id || vIdx} style={ds.monthVisitCard}>
                                                                    <Text style={ds.monthVisitContent} numberOfLines={1}>
                                                                        <Text style={ds.monthVisitTime}>{visit.time} </Text>
                                                                        <Text style={ds.monthVisitPatient}>{visit.patient}</Text>
                                                                    </Text>
                                                                </View>
                                                            ))}
                                                            {dayVisits.length > 3 && (
                                                                <Text style={ds.moreVisitsText}>{t('appointments.more', { count: dayVisits.length - 3 })}</Text>
                                                            )}
                                                        </View>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    ) : (
                                        <View style={ds.slotsGrid}>
                                            {timeSlots.map((time) => (
                                                <View key={time} style={ds.calendarRow}>
                                                    {getDaysForCurrentView().map((dayInfo) => (
                                                        <View key={`${dayInfo.date}-${time}`} style={[ds.calendarSlot, { width: viewMode === 'Day' ? wp(85) : 70 }]}>
                                                            {renderAppointment(dayInfo.fullDate, time)}
                                                        </View>
                                                    ))}
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </ScrollView>
                        </View>
                    </ScrollView>
                </View>

                {/* Date Picker Modal */}
                {activePicker && (
                    Platform.OS === 'ios' ? (
                        <Modal
                            transparent={true}
                            animationType="fade"
                            visible={!!activePicker}
                            onRequestClose={() => setActivePicker(null)}
                        >
                            <TouchableOpacity
                                style={ds.modalOverlay}
                                activeOpacity={1}
                                onPress={() => setActivePicker(null)}
                            >
                                <View style={ds.calendarModalContent}>
                                    <View style={ds.calendarHeaderModal}>
                                        <TouchableOpacity onPress={() => setActivePicker(null)}>
                                            <Text style={ds.calendarCancelText}>{t('common.cancel')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setActivePicker(null)}>
                                            <Text style={ds.calendarConfirmText}>{t('common.done')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <DateTimePicker
                                        value={
                                            activePicker.field === 'visitStart' ? visitStartDate || new Date() :
                                            activePicker.field === 'visitEnd' ? visitEndDate || new Date() :
                                            activePicker.field === 'timeStart' ? visitStartTime || new Date() :
                                            visitEndTime || new Date()
                                        }
                                        mode={activePicker.type}
                                        display={activePicker.type === 'date' ? 'inline' : 'spinner'}
                                        is24Hour={true}
                                        onChange={onDateChange}
                                        style={ds.iosPicker}
                                        textColor={tc.textPrimary}
                                    />
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    ) : (
                        <DateTimePicker
                            value={
                                activePicker.field === 'visitStart' ? visitStartDate || new Date() :
                                activePicker.field === 'visitEnd' ? visitEndDate || new Date() :
                                activePicker.field === 'timeStart' ? visitStartTime || new Date() :
                                visitEndTime || new Date()
                            }
                            mode={activePicker.type}
                            display="default"
                            is24Hour={true}
                            onChange={onDateChange}
                        />
                    )
                )}
                <CreateVisitModal 
                    visible={isCreateVisitModalVisible} 
                    onClose={() => setIsCreateVisitModalVisible(false)} 
                    onSaveSuccess={() => {
                        fetchVisits();
                        showAlert('success', t('appointments.visitCreated'));
                    }}
                />
                <CustomAlert
                    visible={alertConfig.visible}
                    type={alertConfig.type}
                    message={alertConfig.message}
                    onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
                />
                <ScheduledVisitsModal
                    visible={isDetailModalVisible}
                    onClose={() => {
                        setIsDetailModalVisible(false);
                        setSelectedSingleVisit(null);
                    }}
                    visits={selectedDayVisits}
                    initialVisit={selectedSingleVisit}
                    onVisitPress={(visit) => {
                        setIsDetailModalVisible(false);
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: tc.statusBarBg,
    },
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    header: {
        width: "100%",
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: tc.headerBg,
        marginBottom: hp(1)
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    headerSubtitle: {
        fontSize: 16,
        color: tc.textSecondary,
        marginTop: 5,
    },
    headerButtons: {
        marginTop: hp(2),
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: tc.accentLight,
    },
    calendarNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: tc.cardBackground,
        marginBottom: 1,
    },
    navButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: tc.buttonMutedBg,
    },
    currentDateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tc.textPrimary,
        textAlign: 'center',
        flex: 1,
    },
    viewToggleContainer: {
        flexDirection: 'row',
        backgroundColor: tc.cardBackground,
        padding: 10,
    },
    viewToggleButton: {
        width: wp(30),
        marginEnd: wp(2),
    },
    calendarContainer: {
        flex: 1,
        backgroundColor: tc.cardBackground,
    },
    timeLabelsColumn: {
        width: 60,
        backgroundColor: tc.cardBackgroundAlt,
        borderRightWidth: 1,
        borderRightColor: tc.borderColor,
    },
    headerSpacer: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
    },
    timeLabelCell: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: tc.borderLight,
    },
    timeLabelText: {
        fontSize: 11,
        color: tc.textSecondary,
        fontWeight: '600',
    },
    calendarDayHeader: {
        flexDirection: 'row',
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
        backgroundColor: tc.cardBackgroundAlt,
    },
    dayColumnHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: tc.borderColor,
    },
    dayNameText: {
        fontSize: 12,
        fontWeight: '700',
        color: tc.textSecondary,
    },
    slotsGrid: {
        flex: 1,
    },
    calendarRow: {
        flexDirection: 'row',
        height: 60,
    },
    calendarSlot: {
        borderRightWidth: 1,
        borderRightColor: tc.borderLight,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderLight,
        padding: 2,
    },
    appointmentContainer: {
        flex: 1,
        borderRadius: 4,
        padding: 4,
        borderLeftWidth: 3,
    },
    appointmentPatient: {
        fontSize: 11,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    appointmentDoctor: {
        fontSize: 9,
        color: tc.textSecondary,
    },
    appointmentDuration: {
        fontSize: 9,
        color: tc.textSecondary,
        marginTop: 2,
    },
    monthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
    },
    monthDayCell: {
        width: wp(100) / 7,
        height: hp(15),
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: tc.borderColor,
        padding: 4,
    },
    monthDayText: {
        fontSize: 12,
        fontWeight: '600',
        color: tc.textSecondary,
        textAlign: 'right',
    },
    monthVisitsContainer: {
        flex: 1,
        marginTop: 2,
    },
    monthVisitCard: {
        backgroundColor: tc.accentLight,
        borderRadius: 4,
        padding: 2,
        marginBottom: 2,
    },
    monthVisitContent: {
        fontSize: 8,
        color: tc.textPrimary,
    },
    monthVisitTime: {
        fontWeight: '700',
    },
    monthVisitPatient: {
        fontWeight: '400',
    },
    moreVisitsText: {
        fontSize: 8,
        color: tc.accent,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 2,
    },
    filterSection: {
        backgroundColor: tc.cardBackground,
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
    },
    filterGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    filterItem: {
        marginBottom: 15,
    },
    filterLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: tc.textSecondary,
        marginBottom: 6,
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '48%',
        height: 44,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: tc.borderColor,
        backgroundColor: tc.inputBackground,
    },
    selectorText: {
        fontSize: 13,
        color: tc.textPrimary,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: tc.borderColor,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: tc.accent,
        borderColor: tc.accent,
    },
    checkboxLabel: {
        fontSize: 13,
        color: tc.textSecondary,
    },
    filterActionButtons: {
        flexDirection: 'row',
    },
    clearBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    clearBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textSecondary,
    },
    applyBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: tc.accent,
        borderRadius: 8,
    },
    applyBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    calendarModalContent: {
        backgroundColor: tc.modalBg,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    calendarHeaderModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
    },
    calendarCancelText: {
        fontSize: 16,
        color: tc.textSecondary,
    },
    calendarConfirmText: {
        fontSize: 16,
        color: tc.accent,
        fontWeight: '700',
    },
    iosPicker: {
        height: 200,
    }
});

export default ScheduleVisitsScreen;