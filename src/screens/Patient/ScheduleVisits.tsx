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
import DateTimePicker from '@react-native-community/datetimepicker';
import PrimaryButton from '../../component/button';
import CustomTextInput from '../../component/customTextInput';
import Gap from '../../component/gap';
import CustomDropdown from '../../component/customDropDown';
import { LightTheme } from '../../constants/colors/lightTheme';

const { width } = Dimensions.get('window');

export const ScheduleVisitsScreen = () => {
    const [viewMode, setViewMode] = useState('Week');
    const [currentBaseDate, setCurrentBaseDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date().getDate().toString());
    const [showFilters, setShowFilters] = useState(false);

    // Filter States
    const [visitStartDate, setVisitStartDate] = useState<Date | null>(null);
    const [visitEndDate, setVisitEndDate] = useState<Date | null>(null);
    const [visitStartTime, setVisitStartTime] = useState<Date | null>(null);
    const [visitEndTime, setVisitEndTime] = useState<Date | null>(null);
    const [visitType, setVisitType] = useState<string | number>('All');
    const [status, setStatus] = useState<string | number>('All');
    const [hasReferral, setHasReferral] = useState(false);
    const [activePicker, setActivePicker] = useState<{ type: 'date' | 'time', field: string } | null>(null);

    const visitTypeOptions = [
        { label: 'All', value: 'All' },
        { label: 'NFZ', value: 'NFZ' },
        { label: 'Private', value: 'Private' },
    ];

    const statusOptions = [
        { label: 'All', value: 'All' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
    ];

    const navigation = useNavigation<any>();

    const formatDisplayHeader = (date: Date, mode: string) => {
        if (mode === 'Day') {
            return date.toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' });
        } else if (mode === 'Week') {
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1);
            const start = new Date(date.getTime());
            start.setDate(diff);
            const end = new Date(start.getTime());
            end.setDate(start.getDate() + 6);
            return `${start.getDate()} - ${end.getDate()} ${end.toLocaleDateString('default', { month: 'long', year: 'numeric' })}`;
        } else {
            return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
        }
    };

    const [currentHeaderText, setCurrentHeaderText] = useState(formatDisplayHeader(currentBaseDate, viewMode));

    useEffect(() => {
        setCurrentHeaderText(formatDisplayHeader(currentBaseDate, viewMode));
    }, [currentBaseDate, viewMode]);

    // Generate days logic
    const getDaysForCurrentView = () => {
        if (viewMode === 'Day') {
            return [{
                name: currentBaseDate.toLocaleDateString('default', { weekday: 'short' }),
                date: currentBaseDate.getDate().toString(),
                fullDate: currentBaseDate
            }];
        } else if (viewMode === 'Week') {
            const days = [];
            const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
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
                    name: d.toLocaleDateString('default', { weekday: 'short' }),
                    date: d.getDate().toString(),
                    fullDate: d,
                    isCurrentMonth: d.getMonth() === month
                });
            }
            return days;
        }
    };

    const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    const [appointments, setAppointments] = useState([
        { date: '5', time: '04:00', patient: 'John Doe', doctor: 'Dr. Smith', duration: 30 },
        { date: '4', time: '07:00', patient: 'Jane Smith', doctor: 'Dr. Johnson', duration: 45 },
        { date: '12', time: '08:00', patient: 'Mike Johnson', doctor: 'Dr. Smith', duration: 30 },
        { date: '7', time: '02:00', patient: 'John Doe', doctor: 'Dr. Smith', duration: 30 },
        { date: '12', time: '05:00', patient: 'Jane Smith', doctor: 'Dr. Johnson', duration: 45 },
        { date: '10', time: '01:00', patient: 'Mike Johnson', doctor: 'Dr. Smith', duration: 30 }
    ]);

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
        if (!date) return 'dd/mm/yyyy';
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
            style={styles.checkboxContainer}
            onPress={() => onToggle(!isChecked)}
        >
            <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                {isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>{label}</Text>
        </TouchableOpacity>
    );

    const renderAppointment = (date: string, time: string) => {
        const appointment = appointments.find(app => (app.date === date && app.time === time));
        if (appointment) {
            return (
                <View style={styles.appointmentContainer}>
                    <Text style={styles.appointmentPatient} numberOfLines={1}>{appointment.patient}</Text>
                    <Text style={styles.appointmentDoctor} numberOfLines={1}>{appointment.doctor}</Text>
                    <Text style={styles.appointmentDuration}>{appointment.duration} min</Text>
                </View>
            );
        }
        return null;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: 'center' }}>
                        <View>
                            <Text style={styles.headerTitle}>Scheduled Visits</Text>
                            <Text style={styles.headerSubtitle}>
                                Manage visit schedule
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={20} color="#4A90B9" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerButtons}>
                        <PrimaryButton
                            label={'Filters'}
                            filled={false}
                            onPress={() => setShowFilters(!showFilters)}
                            style={{ width: wp(30), marginEnd: 10 }}
                            icon={<Feather name={showFilters ? "x" : "filter"} size={17} color="#4A90B9" />}
                            loading={false}
                            disabled={false}
                        />
                        <PrimaryButton
                            label={'New Visit'}
                            filled={true}
                            onPress={() => { }}
                            style={{ width: wp(49) }}
                            icon={<Feather name="plus" size={20} color="white" />}
                            loading={false}
                            disabled={false}
                        />
                    </View>
                </View>

                {/* Filter Panel */}
                {showFilters && (
                    <View style={styles.filterSection}>
                        <View style={styles.filterGrid}>
                            <View style={[styles.filterItem, { minWidth: '45%' }]}>
                                <Text style={styles.filterLabel}>Visit date</Text>
                                <View style={styles.rowInputs}>
                                    <TouchableOpacity style={styles.dateSelector} onPress={() => setActivePicker({ type: 'date', field: 'visitStart' })}>
                                        <Text style={styles.selectorText}>{formatDate(visitStartDate)}</Text>
                                        <MaterialCommunityIcons name="calendar" size={16} color="#4B5563" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.dateSelector} onPress={() => setActivePicker({ type: 'date', field: 'visitEnd' })}>
                                        <Text style={styles.selectorText}>{formatDate(visitEndDate)}</Text>
                                        <MaterialCommunityIcons name="calendar" size={16} color="#4B5563" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={[styles.filterItem, { minWidth: '45%' }]}>
                                <Text style={styles.filterLabel}>Visit time</Text>
                                <View style={styles.rowInputs}>
                                    <TouchableOpacity style={styles.dateSelector} onPress={() => setActivePicker({ type: 'time', field: 'timeStart' })}>
                                        <Text style={styles.selectorText}>{formatTime(visitStartTime)}</Text>
                                        <Feather name="clock" size={16} color="#4B5563" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.dateSelector} onPress={() => setActivePicker({ type: 'time', field: 'timeEnd' })}>
                                        <Text style={styles.selectorText}>{formatTime(visitEndTime)}</Text>
                                        <Feather name="clock" size={16} color="#4B5563" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={[styles.filterItem, { minWidth: '45%' }]}>
                                <Text style={styles.filterLabel}>Visit type</Text>
                                <CustomDropdown
                                    placeholder="Select type"
                                    options={visitTypeOptions}
                                    value={visitType}
                                    onChange={setVisitType}
                                />
                            </View>

                            <View style={[styles.filterItem, { minWidth: '45%' }]}>
                                <Text style={styles.filterLabel}>Status</Text>
                                <CustomDropdown
                                    placeholder="Select status"
                                    options={statusOptions}
                                    value={status}
                                    onChange={setStatus}
                                />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                            <View style={{ flex: 1 }}>
                                {renderCheckbox(hasReferral, setHasReferral, "Has referral")}
                            </View>
                            <View style={styles.filterActionButtons}>
                                <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
                                    <Text style={styles.clearBtnText}>Clear</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilters(false)}>
                                    <Text style={styles.applyBtnText}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Search Inputs
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <CustomTextInput
                            placeholder={"Search doctor..."}
                            value={""}
                            onChangeText={() => { }}
                            icon={<Feather name="user" color="#ccc" size={18} />}
                            right={undefined}
                            onRightPress={undefined}
                            keyboardType={undefined}
                        />
                    </View>
                    <Gap height={hp(1)} />
                    <View style={styles.searchInputContainer}>
                        <CustomTextInput
                            placeholder={"Search patient..."}
                            value={""}
                            onChangeText={() => { }}
                            icon={<Feather name="user" color="#ccc" size={18} />}
                            right={undefined}
                            onRightPress={undefined}
                            keyboardType={undefined}
                        />
                    </View>
                </View> */}

                {/* Calendar Navigation */}
                <View style={styles.calendarNav}>
                    <TouchableOpacity onPress={handlePrevious} style={styles.navButton}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.currentDateText}>{currentHeaderText}</Text>
                    <TouchableOpacity onPress={handleNext} style={styles.navButton}>
                        <Ionicons name="chevron-forward" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.viewToggleContainer}>
                    <PrimaryButton
                        label={'Day'}
                        filled={viewMode === 'Day'}
                        style={[styles.viewToggleButton]}
                        onPress={() => setViewMode('Day')}
                        loading={false}
                        disabled={false}
                    />
                    <PrimaryButton
                        label={'Week'}
                        filled={viewMode === 'Week'}
                        style={[styles.viewToggleButton]}
                        onPress={() => setViewMode('Week')}
                        loading={false}
                        disabled={false}
                    />
                    <PrimaryButton
                        label={'Month'}
                        filled={viewMode === 'Month'}
                        style={[styles.viewToggleButton]}
                        onPress={() => setViewMode('Month')}
                        loading={false}
                        disabled={false}
                    />
                </View>

                <View style={styles.calendarContainer}>
                    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                        <View style={{ flexDirection: 'row' }}>
                            {viewMode !== 'Month' && (
                                <View style={styles.timeLabelsColumn}>
                                    <View style={styles.headerSpacer} />
                                    {timeSlots.map((time) => (
                                        <View key={time} style={styles.timeLabelCell}>
                                            <Text style={styles.timeLabelText}>{time}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            <ScrollView horizontal={viewMode !== 'Month'} showsHorizontalScrollIndicator={false} bounces={false} contentContainerStyle={{ flex: viewMode === 'Month' ? 1 : undefined }}>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.calendarDayHeader}>
                                        {(viewMode === 'Month' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : getDaysForCurrentView().map(d => d.name)).map((name, idx) => (
                                            <View key={idx} style={[styles.dayColumnHeader, { width: viewMode === 'Month' ? wp(100) / 7 : 70 }]}>
                                                <Text style={styles.dayNameText}>{name}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    {viewMode === 'Month' ? (
                                        <View style={styles.monthGrid}>
                                            {getDaysForCurrentView().map((dayInfo: any, idx) => (
                                                <TouchableOpacity 
                                                    key={idx} 
                                                    style={[styles.monthDayCell, !dayInfo.isCurrentMonth && { opacity: 0.3 }]}
                                                    onPress={() => {
                                                        setCurrentBaseDate(dayInfo.fullDate);
                                                        setViewMode('Day');
                                                    }}
                                                >
                                                    <Text style={styles.monthDayText}>{dayInfo.date}</Text>
                                                    {appointments.filter(a => a.date === dayInfo.date).length > 0 && (
                                                        <View style={styles.monthAppointmentDot} />
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    ) : (
                                        <View style={styles.slotsGrid}>
                                            {timeSlots.map((time) => (
                                                <View key={time} style={styles.calendarRow}>
                                                    {getDaysForCurrentView().map((dayInfo) => (
                                                        <View key={`${dayInfo.date}-${time}`} style={[styles.calendarSlot, { width: viewMode === 'Day' ? wp(85) : 70 }]}>
                                                            {renderAppointment(dayInfo.date, time)}
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
                                style={styles.modalOverlay}
                                activeOpacity={1}
                                onPress={() => setActivePicker(null)}
                            >
                                <View style={styles.calendarModalContent}>
                                    <View style={styles.calendarHeaderModal}>
                                        <TouchableOpacity onPress={() => setActivePicker(null)}>
                                            <Text style={styles.calendarCancelText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setActivePicker(null)}>
                                            <Text style={styles.calendarConfirmText}>Done</Text>
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
                                        style={styles.iosPicker}
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
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        paddingTop: Platform.OS === 'ios' ? hp(5) : hp(0),
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        width: "100%",
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#FFFFFF',
        marginBottom: hp(1)
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666666',
        marginTop: 5,
    },
    headerButtons: {
        marginTop: hp(2),
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginBottom: hp(1),
    },
    searchInputContainer: {
        flex: 1,
    },
    searchInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
    },
    calendarNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        marginBottom: 1,
    },
    navButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
    },
    currentDateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        flex: 1,
    },
    viewToggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
    viewToggleButton: {
        width: wp(30),
        marginEnd: wp(2),
    },
    dayHeaderColumn: {
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: '#E0E0E0',
        justifyContent: "center",
        height: hp(6),
        width: 55
    },
    dayName: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
    },
    dayNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 5,
        textAlign: 'center',
    },
    selectedDayNumber: {
        color: '#4A90B9',
    },
    calendarGrid: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    timeRow: {
        width: '100%',
        height: hp(7),
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        borderRightWidth: 1,
        borderRightColor: '#E0E0E0'
    },
    timeLabel: {
        width: wp(10),
        textAlign: 'center',
        color: '#666666',
        fontSize: 10,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
    },
    timeSlot: {
        width: 55,
        height: hp(7),
        borderLeftWidth: 1,
        borderLeftColor: '#E0E0E0',
        padding: 2,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1
    },
    backButton: {
        borderWidth: 1,
        borderColor: '#4A90B9',
        borderRadius: 25,
        height: 44,
        width: 44,
        alignItems: "center",
        justifyContent: 'center',
    },
    // Filter Styles
    filterSection: {
        backgroundColor: 'white',
        padding: 15,
        marginHorizontal: 15,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    filterGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    filterItem: {
        marginBottom: 10,
    },
    filterLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 6,
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 8,
    },
    dateSelector: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 6,
        paddingHorizontal: 8,
        height: 38,
        backgroundColor: '#F8FAFC',
    },
    selectorText: {
        fontSize: 12,
        color: '#64748B',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#4A90B9',
        borderColor: '#4A90B9',
    },
    checkboxLabel: {
        fontSize: 13,
        color: '#475569',
    },
    filterActionButtons: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        gap: 8,
    },
    clearBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#4A90B9',
        borderRadius: 6,
        paddingHorizontal: 10,
        height: 36,
    },
    clearBtnText: {
        fontSize: 12,
        color: '#4A90B9',
        fontWeight: '600',
        marginLeft: 4,
    },
    applyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4A90B9',
        borderRadius: 6,
        paddingHorizontal: 10,
        height: 36,
    },
    applyBtnText: {
        fontSize: 12,
        color: 'white',
        fontWeight: '600',
        marginLeft: 4,
    },
    // Calendar UI Improvements
    calendarContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    timeLabelsColumn: {
        width: wp(12),
        backgroundColor: '#F8FAFC',
        borderRightWidth: 1,
        borderRightColor: '#E2E8F0',
    },
    headerSpacer: {
        height: 60,
    },
    timeLabelCell: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    timeLabelText: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '500',
    },
    calendarDayHeader: {
        flexDirection: 'row',
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    dayColumnHeader: {
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    selectedDayHeader: {
        backgroundColor: '#F0F9FF',
    },
    dayNameText: {
        fontSize: 11,
        color: '#64748B',
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    dayBadge: {
        marginTop: 4,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedDayBadge: {
        backgroundColor: '#4A90B9',
    },
    dayNumberText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
    },
    selectedDayNumberText: {
        color: 'white',
    },
    slotsGrid: {
        backgroundColor: '#FFFFFF',
    },
    calendarRow: {
        flexDirection: 'row',
    },
    calendarSlot: {
        width: 70,
        height: 60,
        borderRightWidth: 1,
        borderRightColor: '#F1F5F9',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        padding: 2,
    },
    selectedTabText: {
        color: '#4A90B9',
    },
    // Appointment Box
    appointmentContainer: {
        flex: 1,
        backgroundColor: '#E0F2FE',
        borderRadius: 4,
        borderLeftWidth: 3,
        borderLeftColor: '#4A90B9',
        padding: 4,
        justifyContent: 'space-between',
    },
    appointmentPatient: {
        fontSize: 9,
        fontWeight: '700',
        color: '#0369A1',
    },
    appointmentDoctor: {
        fontSize: 8,
        color: '#64748B',
    },
    appointmentDuration: {
        fontSize: 8,
        color: '#4A90B9',
        fontWeight: '600',
    },
    // Modal & Picker
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarModalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 10,
    },
    calendarHeaderModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    calendarCancelText: {
        color: '#64748B',
        fontSize: 16,
    },
    calendarConfirmText: {
        color: '#4A90B9',
        fontSize: 16,
        fontWeight: '600',
    },
    iosPicker: {
        height: 300,
    },
    // Month View Styles
    monthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#F1F5F9',
        gap: 1,
    },
    monthDayCell: {
        width: wp(100) / 7 - 1,
        height: 80,
        backgroundColor: 'white',
        padding: 4,
        alignItems: 'center',
    },
    monthDayText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
    },
    monthAppointmentDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4A90B9',
        marginTop: 4,
    }
});

export default ScheduleVisitsScreen;