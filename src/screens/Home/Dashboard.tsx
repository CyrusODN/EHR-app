import React, { useEffect, useState } from 'react';
import {
    View, ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
    BackHandler
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
import { useNavigation } from '@react-navigation/native';
// import SlidingDrawerModal from '../Drawer';
import { DashboardStatsCard } from './Stats';
import ActionModal from './modals/ActionModal';
import { useTranslation } from 'react-i18next';
import CreateVisitModal from './modals/createVisit';
import userStore from '../../store/user';

const Dashboard = () => {
    const { t } = useTranslation();

    const { loggedInUser} = userStore();

    useEffect(()=>{

        console.log("loggedInUser", loggedInUser);

    },[loggedInUser])
    const navigation = useNavigation();
    const currentMonth = 'April 2025';
    const totalPatients = '1393 total';
    const { colors } = useTheme();
    const [selectedDate, setSelectedDate] = useState(new Date().getDate()); // Default to March 21, 2025
    const [createVisitModalVisible, setCreateVisitModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);

    useEffect(() => {
        // Add event listener when component mounts
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Handle back press logic here
            return true; // Return true to prevent default behavior (exit app)
        });

        // Return cleanup function to remove event listener when component unmounts
        return () => backHandler.remove();
    }, []);

    // Generate calendar days
    const getDaysInMonth = () => {
        const days = [];
        const daysInMonth = new Date(2025, 3, 0).getDate();

        // Previous month days (showing last week)
        for (let i = 24; i <= 28; i++) {
            days.push({ day: i, isCurrentMonth: false });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                isToday: i === 21,
                isSelected: i === selectedDate
            });
        }

        // Next month days (showing first week)
        for (let i = 1; i <= 6; i++) {
            days.push({ day: i, isCurrentMonth: false });
        }

        return days;
    };

    const handleDateSelect = (day: any) => {
        if (day.isCurrentMonth) {
            setSelectedDate(day.day);
        }
    };

    const days = getDaysInMonth();

    const appointments = [
        {
            time: '10:00',
            patient: 'Anna Kowalska',
            patientId: '85061512345',
            status: 'Scheduled',
            type: 'Follow-up',
        },
        {
            time: '11:30',
            patient: 'Jan Nowak',
            patientId: '90032212345',
            status: 'In Progress',
            type: 'Follow-up',
        },
        {
            time: '13:00',
            patient: 'Maria Wiśniewska',
            patientId: '78120312345',
            status: 'Completed',
            type: 'Follow-up',
        },
    ];

    // Map weekday headers
    const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
        <View style={styles.container}>
            {/* App Bar */}
            <Header onMenuPress={() => { 
                // setDrawerVisible(true) 
             }} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ alignItems: "center" }}
            >
                {/* Dashboard Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{t('dashboard.title')}</Text>
                    <Text style={styles.subtitle}>Overview of key information</Text>
                </View>

                <PrimaryButton
                    label="New Visit"
                    filled={true}
                    icon={<FontAwesome6 name="plus" size={15} color="white" />}
                    onPress={() => { setCreateVisitModalVisible(true) }}
                    style={undefined} image={undefined} iconStyle={undefined} imageStyle={undefined}
                    loading={false}
                    disabled={false}
                />

                <PrimaryButton
                    label="New Patient"
                    filled={false}
                    icon={<Feather name="user-plus" size={15} color="#4A90B9" />}
                    onPress={() => {
                        // navigation.navigate('New-Patient');
                        console.log('New Patient screen not implemented yet');
                    }}
                    style={undefined}
                    image={undefined}
                    iconStyle={undefined}
                    imageStyle={undefined}
                    loading={false}
                    disabled={false}
                />

                {/* Search Bar */}
                <Searchbar
                    placeholder="Search patient"
                    style={styles.searchBar}
                    icon="magnify" value={''} />

                {/* Dashboard Stats */}
                <DashboardStatsCard />


                {/* Calendar */}
                <Card style={styles.calendarCard}>
                    <Card.Content>
                        <View style={styles.calendarHeader}>
                            <Text style={styles.calendarTitle}>{currentMonth}</Text>
                            <View style={styles.calendarNavigation}>
                                <IconButton
                                    icon="chevron-left"
                                    size={20}
                                    onPress={() => { }}
                                />
                                <IconButton
                                    icon="chevron-right"
                                    size={20}
                                    onPress={() => { }}
                                />
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
                                    style={[
                                        styles.calendarDay,
                                        item.isCurrentMonth ? styles.currentMonth : styles.otherMonth,
                                        item.isToday ? styles.todayHighlight : null,
                                    ]}
                                    onPress={() => handleDateSelect(item)}
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
                                        <Text
                                            style={[
                                                styles.calendarDayText,
                                                !item.isCurrentMonth ? styles.otherMonthText : null,
                                                item.isToday && !item.isSelected ? styles.todayText : null,
                                            ]}
                                        >
                                            {item.day}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

                <Text style={styles.appointmentsTitle}>Visits for {selectedDate} April 2025</Text>

                <View style={styles.tableContainer}>
                    {/* Table scrollable body */}
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={true}
                        contentContainerStyle={styles.tableScrollContainer}
                    >
                        <View>
                            <View style={styles.tableHeader}>
                                <Text style={styles.timeCell}>Time</Text>
                                <Text style={styles.patientCell}>Patient</Text>
                                <Text style={styles.statusCell}>Status</Text>
                                <Text style={styles.typeCell}>Type</Text>
                                <Text style={styles.actionCell}>Actions</Text>
                            </View>
                            <View style={styles.tableBody}>
                                {appointments.map((appointment, index) => (
                                    <View key={index} style={styles.tableRow}>
                                        <View style={[styles.tableCell, styles.timeCell]}>
                                            <Text style={styles.timeText}>{appointment.time}</Text>
                                        </View>

                                        <View style={[styles.tableCell, styles.patientCell]}>
                                            <Text style={styles.patientName} numberOfLines={1} ellipsizeMode="tail">
                                                {appointment.patient}
                                            </Text>
                                            <Gap height={5} />
                                            <Text style={styles.patientId} numberOfLines={1} ellipsizeMode="tail">
                                                {appointment.patientId}
                                            </Text>
                                        </View>

                                        <View style={[styles.tableCell, styles.statusCell]}>
                                            <Text
                                                style={[
                                                    styles.statusText,
                                                    appointment.status === 'Scheduled' ? styles.scheduledChip : null,
                                                    appointment.status === 'In Progress' ? styles.inProgressChip : null,
                                                    appointment.status === 'Completed' ? styles.completedChip : null,
                                                ]}
                                            >
                                                {appointment.status}
                                            </Text>
                                        </View>

                                        <View style={[styles.tableCell, styles.typeCell]}>
                                            <View style={styles.typeContainer}>
                                                <Icon name="stethoscope" size={16} color="#58a6b8" />
                                                <Text style={styles.typeText}>{appointment.type}</Text>
                                            </View>
                                        </View>

                                        <View style={[styles.tableCell, styles.actionCell]}>
                                            {/* <TouchableOpacity style={styles.viewButton}>
                                                <Icon name="eye" size={16} color="#58a6b8" />
                                            </TouchableOpacity>

                                            <TouchableOpacity style={styles.startButton}>
                                                <LinearGradient
                                                    colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    style={styles.gradientBackground}
                                                >
                                                    <Text style={styles.startButtonText}>
                                                        Start Visit
                                                    </Text>
                                                </LinearGradient>
                                            </TouchableOpacity> */}

                                            <TouchableOpacity
                                                onPress={() => { setShowActionModal(true) }}
                                                style={styles.moreButton}>
                                                <Icon name="dots-vertical" size={16} color="#58a6b8" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                </View>

                <Gap height={hp(10)} />

                <CreateVisitModal
                    visible={createVisitModalVisible}
                    onClose={() => { setCreateVisitModalVisible(false) }}
                />

                {/* <SlidingDrawerModal
                    visible={drawerVisible}
                    onClose={() => { setDrawerVisible(false) }}
                /> */}

                <ActionModal
                    visible={showActionModal}
                    onClose={() => { setShowActionModal(false) }}
                    onView={undefined}
                    onStart={undefined}
                    onAddNote={undefined}
                />
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab}>
                <Icon name="help-circle" size={24} color="#ffffff" />
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    titleContainer: {
        paddingVertical: 20,
        width: '95%'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#757575',
        marginTop: 4,
    },
    searchBar: {
        margin: 16,
        borderRadius: 8,
        backgroundColor: 'white',
        elevation: 0,
        width: '95%'
    },
    statsCard: {
        margin: 16,
        borderRadius: 8,
        width: '95%',
        backgroundColor: 'white'
    },
    statsContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dashboardText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    totalText: {
        fontSize: 14,
        color: '#757575',
        marginLeft: 16,
        flex: 1,
    },
    calendarCard: {
        margin: 16,
        borderRadius: 8,
        width: '95%',
        backgroundColor: 'white'
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    calendarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    calendarNavigation: {
        flexDirection: 'row',
    },
    weekdayRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
    },
    weekdayText: {
        width: 30,
        textAlign: 'center',
        color: '#757575',
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
    calendarDayText: {
        textAlign: 'center',
    },
    currentMonth: {
        backgroundColor: 'transparent',
    },
    otherMonth: {
        backgroundColor: 'transparent',
    },
    otherMonthText: {
        color: '#BDBDBD',
    },
    todayHighlight: {
        backgroundColor: 'white',
    },
    todayText: {
        color: 'black',
    },
    selectedDateGradient: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedDateText: {
        color: 'white',
        fontWeight: 'bold',
    },
    appointmentsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 16,
        width: "95%"
    },
    tableContainer: {
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 16,
        // overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    tableScrollContainer: {
        paddingBottom: 10,
    },
    tableBody: {
        minWidth: '100%',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    tableCell: {
        justifyContent: 'center',
    },
    timeCell: {
        width: 45,
        marginRight: 10,
    },
    patientCell: {
        width: 110,
        marginRight: 10,
    },
    statusCell: {
        width: 80,
        marginRight: 10,
    },
    typeCell: {
        width: 60,
        marginRight: 10,
    },
    actionCell: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 14,
    },
    patientName: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    patientId: {
        color: '#757575',
        fontSize: 12,
    },
    statusText: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 12,
        borderRadius: 20,
        textAlign: 'center',
        // overflow: 'hidden',
    },
    scheduledChip: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
    },
    inProgressChip: {
        backgroundColor: '#fef9c3',
        color: '#854d0e',
    },
    completedChip: {
        backgroundColor: '#dcfce7',
        color: '#166534',
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeText: {
        marginLeft: 4,
        fontSize: 12,
    },
    viewButton: {
        borderColor: "#58a6b8",
        borderWidth: 2,
        height: 36,
        width: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginRight: 8,
    },
    startButton: {
        height: 36,
        width: 80,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        // overflow: "hidden",
        marginRight: 8,
    },
    moreButton: {
        borderColor: "#58a6b8",
        borderWidth: 2,
        height: 36,
        width: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    startButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: hp(5),
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#58a6b8',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    gradientBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Dashboard;