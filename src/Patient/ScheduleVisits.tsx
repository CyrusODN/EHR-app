import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    Platform,
    Dimensions,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../component/button';
import Feather from 'react-native-vector-icons/Feather';
import CustomTextInput from '../component/customTextInput';
import Gap from '../component/gap';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export const ScheduleVisitsScreen = () => {
    const navigation = useNavigation();
    const [viewMode, setViewMode] = useState('Week');
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date()); // March 24, 2025
    const [selectedDay, setSelectedDay] = useState('27');

    // Format the week display string (e.g., "24 - 30 March 2025")
    const formatWeekDisplay = (startDate: Date) => {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        const month = endDate.toLocaleString('default', { month: 'long' });
        const year = endDate.getFullYear();

        return `${startDay} - ${endDay} ${month} ${year}`;
    };

    const [currentWeek, setCurrentWeek] = useState(formatWeekDisplay(currentWeekStart));

    // Generate time slots from 00:00 to 23:00
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        return `${hour}:00`;
    });

    // Generate days of the week based on current week start
    const generateDaysOfWeek = (startDate: Date) => {
        const days = [];
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
        const dayNamesPolish = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela'];

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            days.push({
                name: dayNames[i],
                date: currentDate.getDate().toString(),
                day: dayNames[i],
                fullDate: currentDate
            });
        }

        return days;
    };

    const [daysOfWeek, setDaysOfWeek] = useState(generateDaysOfWeek(currentWeekStart));

    // Sample appointments data - we'll keep this static for now
    const [appointments, setAppointments] = useState([
        { date: '5', time: '04:00', patient: 'John Doe', doctor: 'Dr. Smith', duration: 30 },
        { date: '4', time: '07:00', patient: 'Jane Smith', doctor: 'Dr. Johnson', duration: 45 },
        { date: '12', time: '08:00', patient: 'Mike Johnson', doctor: 'Dr. Smith', duration: 30 },
        { date: '7', time: '02:00', patient: 'John Doe', doctor: 'Dr. Smith', duration: 30 },
        { date: '12', time: '05:00', patient: 'Jane Smith', doctor: 'Dr. Johnson', duration: 45 },
        { date: '10', time: '01:00', patient: 'Mike Johnson', doctor: 'Dr. Smith', duration: 30 }
    ]);

    const handlePreviousWeek = () => {
        const prevWeekStart = new Date(currentWeekStart);
        prevWeekStart.setDate(currentWeekStart.getDate() - 7);

        setCurrentWeekStart(prevWeekStart);
        setCurrentWeek(formatWeekDisplay(prevWeekStart));
        setDaysOfWeek(generateDaysOfWeek(prevWeekStart));

        // Select the first day of the week by default
        setSelectedDay(prevWeekStart.getDate().toString());
    };

    const handleNextWeek = () => {
        const nextWeekStart = new Date(currentWeekStart);
        nextWeekStart.setDate(currentWeekStart.getDate() + 7);

        setCurrentWeekStart(nextWeekStart);
        setCurrentWeek(formatWeekDisplay(nextWeekStart));
        setDaysOfWeek(generateDaysOfWeek(nextWeekStart));

        // Select the first day of the week by default
        setSelectedDay(nextWeekStart.getDate().toString());
    };

    const handleDaySelect = (date: string) => {
        setSelectedDay(date);
    };

    const renderAppointment = (date: string, time: string) => {
        const appointment = appointments.find(app => (app.date === date && app.time === time));
        if (appointment) {
            return (
                <View style={styles.appointmentContainer}>
                    <Text style={styles.appointmentPatient}>{appointment.patient}</Text>
                    <Text style={styles.appointmentDoctor}>{appointment.doctor}</Text>
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
                    <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
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
                            onPress={() => { }}
                            style={{ width: 100, marginEnd: 10 }}
                            icon={<Feather name="filter" size={20} color="#4A90B9" />}
                            loading={false}
                            disabled={false}
                            image={undefined}
                            iconStyle={undefined}
                            imageStyle={undefined}
                        />
                        <PrimaryButton
                            label={'New Visit'}
                            filled={true}
                            onPress={() => { }}
                            style={{ width: 120 }}
                            icon={<Feather name="plus" size={20} color="white" />}
                            loading={false}
                            disabled={false}
                            image={undefined}
                            iconStyle={undefined}
                            imageStyle={undefined}
                        />
                    </View>
                </View>

                {/* Search Inputs */}
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
                </View>

                {/* Calendar Navigation */}
                <View style={styles.calendarNav}>
                    <TouchableOpacity onPress={handlePreviousWeek} style={styles.navButton}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.currentDateText}>{currentWeek}</Text>
                    <TouchableOpacity onPress={handleNextWeek} style={styles.navButton}>
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
                        icon={undefined}
                        image={undefined}
                        iconStyle={undefined}
                        imageStyle={undefined}
                    />
                    <PrimaryButton
                        label={'Week'}
                        filled={viewMode === 'Week'}
                        style={[styles.viewToggleButton]}
                        onPress={() => setViewMode('Week')}
                        loading={false}
                        disabled={false}
                        icon={undefined}
                        image={undefined}
                        iconStyle={undefined}
                        imageStyle={undefined}
                    />
                    <PrimaryButton
                        label={'Month'}
                        filled={viewMode === 'Month'}
                        style={[styles.viewToggleButton]}
                        onPress={() => setViewMode('Month')}
                        loading={false}
                        disabled={false}
                        icon={undefined}
                        image={undefined}
                        iconStyle={undefined}
                        imageStyle={undefined}
                    />
                </View>

                {/* Days of Week Header */}
                <View style={{}}>
                    <View style={{
                        width: '100%',
                        flexDirection: "row",
                        paddingLeft: wp(10)
                    }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {daysOfWeek.map((dayInfo) => (
                                <View key={dayInfo.date}
                                    style={styles.dayHeaderColumn}
                                >
                                    <TouchableOpacity

                                        onPress={() => handleDaySelect(dayInfo.date)}
                                    >
                                        <Text style={styles.dayName}>{dayInfo.day}</Text>
                                        <Text
                                            style={[
                                                styles.dayNumber,
                                                selectedDay === dayInfo.date && styles.selectedDayNumber
                                            ]}
                                        >
                                            {dayInfo.date}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))}

                        </ScrollView>
                    </View>
                    <View style={{
                        width: "100%",
                        borderRightWidth: 1,
                        borderRightColor: '#E0E0E0',
                        height: hp(45)
                    }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {timeSlots.map((time) => (
                                <View key={time} style={styles.timeRow}>
                                    <Text style={styles.timeLabel}>{time}</Text>
                                    {viewMode === 'Week' ? (
                                        // Week view - show all days
                                        daysOfWeek.map((dayInfo) => (
                                            <View key={`${dayInfo.date}-${time}`} style={styles.timeSlot}>
                                                {renderAppointment(dayInfo.date, time)}
                                            </View>
                                        ))
                                    ) : viewMode === 'Day' ? (
                                        // Day view - show only selected day
                                        <View style={[styles.timeSlot, { width: wp(80) }]}>
                                            {renderAppointment(selectedDay, time)}
                                        </View>
                                    ) : (
                                        // Month view placeholder (would need more complex implementation)
                                        <View style={[styles.timeSlot, { width: wp(80) }]}>
                                            <Text style={styles.placeholderText}>Month view implementation</Text>
                                        </View>
                                    )}
                                </View>
                            ))}

                        </ScrollView>
                    </View>



                </View>

                {/* Calendar Grid */}
                {/* <ScrollView style={styles.calendarGrid}>
                    {timeSlots.map((time) => (
                        <View key={time} style={styles.timeRow}>
                            <Text style={styles.timeLabel}>{time}</Text>
                            {viewMode === 'Week' ? (
                                // Week view - show all days
                                daysOfWeek.map((dayInfo) => (
                                    <View key={`${dayInfo.date}-${time}`} style={styles.timeSlot}>
                                        {renderAppointment(dayInfo.date, time)}
                                    </View>
                                ))
                            ) : viewMode === 'Day' ? (
                                // Day view - show only selected day
                                <View style={[styles.timeSlot, { width: wp(80) }]}>
                                    {renderAppointment(selectedDay, time)}
                                </View>
                            ) : (
                                // Month view placeholder (would need more complex implementation)
                                <View style={[styles.timeSlot, { width: wp(80) }]}>
                                    <Text style={styles.placeholderText}>Month view implementation</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView> */}
            </View>
        </SafeAreaView >
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
        justifyContent: "flex-end"
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
        justifyContent: "flex-end"
    },
    viewToggleButton: {
        width: wp(20),
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
    appointmentContainer: {
        backgroundColor: '#E6F2F9',
        borderRadius: 4,
        borderLeftWidth: 3,
        borderLeftColor: '#4A90B9',
        padding: 5,
        height: '100%',
    },
    appointmentPatient: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#333333',
    },
    appointmentDoctor: {
        fontSize: 8,
        color: '#666666',
    },
    appointmentDuration: {
        fontSize: 8,
        color: '#4A90B9',
        marginTop: 'auto',
    },
    backButton: {
        borderWidth: 1,
        borderColor: '#4A90B9',
        borderRadius: 50,
        marginRight: 10,
        height: 50,
        width: 50,
        alignItems: "center",
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: 10,
        color: '#999',
        textAlign: 'center',
    }
});

export default ScheduleVisitsScreen;