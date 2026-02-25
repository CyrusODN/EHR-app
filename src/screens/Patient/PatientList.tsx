// components/PatientListScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    FlatList,
    ActivityIndicator,
    ScrollView,
    Platform,
    Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomDropdown from '../../component/customDropDown';
import PrimaryButton from '../../component/button';
import ActionModal from './modals/ActionModal';
import PatientDetailsModal from './modals/PatientDetails';

const PatientListScreen = () => {
    const navigation = useNavigation<any>();
    const [patients, setPatients] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);

    // State for filter inputs
    const [dobStartDate, setDobStartDate] = useState<Date | null>(null);
    const [dobEndDate, setDobEndDate] = useState<Date | null>(null);
    const [gender, setGender] = useState<string | number>('All');
    const [activePicker, setActivePicker] = useState<string | null>(null);

    // State for checkboxes
    const [hasPesel, setHasPesel] = useState(false);
    const [hasDeclaration, setHasDeclaration] = useState(false);
    const [isDeceased, setIsDeceased] = useState(false);
    const [hasDebt, setHasDebt] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [isLongAbsent, setIsLongAbsent] = useState(false);

    const genderOptions = [
        { label: 'All', value: 'All' },
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ];

    // Fetch patients (mock data for now)
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const mockPatients = [
                {
                    id: 'P001',
                    name: 'Jan Kowalski',
                    pesel: '80010112345',
                    dateOfBirth: '1980-01-01',
                    lastVisit: '2024-03-01',
                    status: 'Active'
                },
                {
                    id: 'P002',
                    name: 'Maria Nowak',
                    pesel: '75020223456',
                    dateOfBirth: '1975-02-02',
                    lastVisit: '2024-02-15',
                    status: 'Active'
                },
                {
                    id: 'P003',
                    name: 'Adam Wiśniewski',
                    pesel: '90030334567',
                    dateOfBirth: '1990-03-03',
                    lastVisit: '2024-01-20',
                    status: 'Inactive'
                },
                {
                    id: 'P004',
                    name: 'Ewa Kamińska',
                    pesel: '85040445678',
                    dateOfBirth: '1985-04-04',
                    lastVisit: '2023-12-10',
                    status: 'Active'
                },
                {
                    id: 'P005',
                    name: 'Piotr Lewandowski',
                    pesel: '70050556789',
                    dateOfBirth: '1970-05-05',
                    lastVisit: '2023-11-25',
                    status: 'Deceased'
                }
            ];
            setPatients(mockPatients);
            setLoading(false);
        }, 1000);
    }, []);

    // Format date for display (YYYY-MM-DD to more readable format)
    const formatDate = (date: any) => {
        if (!date) return 'dd/mm/yyyy';
        if (typeof date === 'string') {
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(date).toLocaleDateString('en-GB', options).replace(/\//g, '-');
        }
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Handle date change
    const onDateChange = (event: any, selectedDate?: Date) => {
        if (selectedDate && activePicker) {
            switch (activePicker) {
                case 'dobStart': setDobStartDate(selectedDate); break;
                case 'dobEnd': setDobEndDate(selectedDate); break;
            }
            setActivePicker(null);
        } else if (event.type === 'dismissed') {
            setActivePicker(null);
        }
    };

    // Handle patient actions
    const handleViewPatient = (patientId: string) => {
        console.log(`View patient ${patientId}`);
        // Navigate to patient details
        // navigation.navigate('PatientDetails', { patientId });
    };

    const handleEditPatient = (patientId: string) => {
        console.log(`Edit patient ${patientId}`);
        // Navigate to edit patient
        // navigation.navigate('EditPatient', { patientId });
    };

    const handleScheduleVisit = (patientId: string) => {
        console.log(`Schedule visit for patient ${patientId}`);
        // Navigate to schedule visit
        // navigation.navigate('ScheduleVisit', { patientId });
    };

    const handleMoreOptions = (patientId: string) => {
        console.log(`More options for patient ${patientId}`);
        // Show more options (possibly with an ActionSheet or Modal)
    };

    // Clear all filters
    const clearFilters = () => {
        setDobStartDate(null);
        setDobEndDate(null);
        setGender('All');
        setHasPesel(false);
        setHasDeclaration(false);
        setIsDeceased(false);
        setHasDebt(false);
        setIsActive(true);
        setIsLongAbsent(false);
    };

    // Export patient list
    const handleExport = () => {
        console.log('Export patient list');
        // Export functionality
    };

    // Print patient list
    const handlePrint = () => {
        console.log('Print patient list');
        // Print functionality
    };

    // Toggle filters
    const handleFilterToggle = () => {
        setShowFilters(!showFilters);
        // If implementing filters, you would show a modal or expand a section here
    };

    // Render checkbox
    const renderCheckbox = (isChecked: boolean, onToggle: any, label: string) => (
        <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => onToggle(!isChecked)}
        >
            <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                {isChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>{label}</Text>
        </TouchableOpacity>
    );

    // Render status badge with appropriate color
    const renderStatusBadge = (status: string) => {
        let backgroundColor;
        let textColor = '#FFFFFF';

        switch (status) {
            case 'Active':
                backgroundColor = '#dcfce7';
                textColor = '#166534';
                break;
            case 'Inactive':
                backgroundColor = '#fef9c3';
                textColor = '#854d0e';
                break;
            case 'Deceased':
                backgroundColor = '#eeeeee';
                textColor = 'grey';
                break;
            default:
                backgroundColor = '#E0E0E0';
                textColor = '#000000';
        }

        return (
            <View style={[styles.statusBadge, { backgroundColor }]}>
                <Text style={[styles.statusText, { color: textColor }]}>{status}</Text>
            </View>
        );
    };

    // Render patient item
    const renderPatientItem = ({ item }: { item: any }) => (
        <View style={styles.patientCard}>
            <View style={styles.patientRow}>
                <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{item.name}</Text>
                    <Text style={styles.patientId}>ID: {item.id}</Text>
                </View>
                <View style={styles.patientDetail}>
                    <Text style={styles.detailValue}>{item.pesel}</Text>
                </View>
                <View style={styles.patientDetail}>
                    <Text style={styles.detailValue}>{formatDate(item.dateOfBirth)}</Text>
                </View>
                <View style={styles.patientDetail}>
                    <Text style={styles.detailValue}>{formatDate(item.lastVisit)}</Text>
                </View>
                <View style={[styles.patientDetail, { width: wp(20) }]}>
                    {renderStatusBadge(item.status)}
                </View>
                <View style={styles.actionButtons}>
                    {/* <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleViewPatient(item.id)}
                    >
                        <Ionicons name="eye-outline" size={22} color="#4A90B9" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEditPatient(item.id)}
                    >
                        <Feather name="file-text" size={22} color="#4A90B9" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleScheduleVisit(item.id)}
                    >
                        <Ionicons name="calendar-outline" size={22} color="#4A90B9" />
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => { 
                            setSelectedPatient(item);
                            setShowActionModal(true); 
                        }}
                    >
                        <Ionicons name="ellipsis-vertical" size={18} color="#4A90B9" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    // Render header for FlatList
    const renderListHeader = () => (
        <View style={styles.listHeader}>
            <View style={styles.headerCell}>
                <Text style={styles.headerText}>PATIENT</Text>
            </View>
            <View style={styles.headerCell}>
                <Text style={styles.headerText}>PESEL</Text>
            </View>
            <View style={styles.headerCell}>
                <Text style={styles.headerText}>DATE OF BIRTH</Text>
            </View>
            <View style={styles.headerCell}>
                <Text style={styles.headerText}>LAST VISIT</Text>
            </View>
            <View style={[styles.headerCell, {}]}>
                <Text style={[styles.headerText, {}]}>STATUS</Text>
            </View>
            <View style={styles.headerCell}>
                <Text style={styles.headerText}>ACTIONS</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
            <View style={{
                width: "100%", backgroundColor: "white",
                flexDirection: "row", justifyContent: "space-around", paddingTop: hp(2)
            }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Patient List</Text>
                    <Text style={styles.headerSubtitle}>Manage patient records</Text>
                </View>

                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={20} color="#4A90B9" />
                </TouchableOpacity>
            </View>
            <View style={styles.headerButtons}>
                <TouchableOpacity
                    style={{
                        marginLeft: 10, borderRadius: 8, flexDirection: "row", height: hp(5),
                        alignItems: "center",
                        justifyContent: "center", width: wp(25), borderWidth: 1, borderColor: "#4A90B9", backgroundColor: "white"
                    }}
                    onPress={handleExport}
                >
                    <Feather name="download" size={20} color="#4A90B9" />
                    <Text style={styles.buttonText}>Export</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        marginLeft: 10, borderRadius: 8, flexDirection: "row", height: hp(5),
                        alignItems: "center",
                        justifyContent: "center", width: wp(25), borderWidth: 1, borderColor: "#4A90B9", backgroundColor: "white"
                    }}
                    onPress={handlePrint}
                >
                    <Feather name="printer" size={20} color="#4A90B9" />
                    <Text style={styles.buttonText}>Print</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleFilterToggle}
                >
                    <LinearGradient
                        colors={['#4A90B9', '#5BA6B6', '#68BFB3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            marginLeft: 10, borderRadius: 8, flexDirection: "row", height: hp(5),
                            alignItems: "center",
                            paddingHorizontal: 15,
                            justifyContent: "center", minWidth: wp(25)
                        }}>
                        <Feather name="filter" size={20} color="white" />
                        <Text style={styles.filtersButtonText}>Filters</Text>
                        <Ionicons 
                            name={showFilters ? "chevron-up" : "chevron-down"} 
                            size={16} 
                            color="white" 
                            style={{marginLeft: 5}} 
                        />
                    </LinearGradient>

                </TouchableOpacity>
            </View>

            {/* Filter Section */}
            {showFilters && (
                <View style={styles.filtersContainer}>
                    <View style={styles.filtersInner}>
                        <View style={styles.filterRow}>
                            <View style={[styles.filterGroup, { flex: 1.5 }]}>
                                <Text style={styles.filterLabel}>Date of Birth</Text>
                                <View style={styles.dateRangeContainer}>
                                    <TouchableOpacity
                                        style={styles.dateInput}
                                        onPress={() => setActivePicker('dobStart')}
                                    >
                                        <Text style={styles.dateText}>{formatDate(dobStartDate)}</Text>
                                        <MaterialCommunityIcons name="calendar-blank" size={18} color="#6B7280" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.dateInput}
                                        onPress={() => setActivePicker('dobEnd')}
                                    >
                                        <Text style={styles.dateText}>{formatDate(dobEndDate)}</Text>
                                        <MaterialCommunityIcons name="calendar-blank" size={18} color="#6B7280" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={[styles.filterGroup, { flex: 1, marginLeft: 15 }]}>
                                <Text style={styles.filterLabel}>Gender</Text>
                                <CustomDropdown
                                    placeholder="Select gender"
                                    options={genderOptions}
                                    value={gender}
                                    onChange={setGender}
                                />
                            </View>
                        </View>

                        <View style={styles.checkboxesSection}>
                            <View style={styles.checkboxRow}>
                                {renderCheckbox(hasPesel, setHasPesel, "Has PESEL")}
                                {renderCheckbox(hasDeclaration, setHasDeclaration, "Has Declaration")}
                                {renderCheckbox(isDeceased, setIsDeceased, "Deceased")}
                                {renderCheckbox(hasDebt, setHasDebt, "Has Debt")}
                                {renderCheckbox(isActive, setIsActive, "Active")}
                                {renderCheckbox(isLongAbsent, setIsLongAbsent, "Long Absent")}
                            </View>
                        </View>

                        <View style={styles.filterActions}>
                            <TouchableOpacity style={styles.clearFiltersBtn} onPress={clearFilters}>
                                <Ionicons name="close-outline" size={20} color="#4A90B9" />
                                <Text style={styles.clearFiltersBtnText}>Clear filters</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.applyFiltersBtn} onPress={() => setShowFilters(false)}>
                                <Ionicons name="funnel-outline" size={18} color="white" />
                                <Text style={styles.applyFiltersBtnText}>Apply filters</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Patient List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4A90B9" />
                    <Text style={styles.loadingText}>Loading patients...</Text>
                </View>
            ) : (
                <ScrollView horizontal>
                    <FlatList
                        data={patients}
                        keyExtractor={(item) => item.id}
                        renderItem={renderPatientItem}
                        ListHeaderComponent={renderListHeader}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </ScrollView>

            )}
            <ActionModal
                visible={showActionModal}
                onClose={() => {
                    setShowActionModal(false);
                }}
                onView={() => {
                    setShowActionModal(false);
                    setShowPatientDetailsModal(true);
                }}
                onStart={() => {
                    setShowActionModal(false);
                    navigation.navigate('Schedule-Visits');
                }}
                onAddNote={() => { }}
            />
            <PatientDetailsModal
                visible={showPatientDetailsModal}
                onClose={() => { setShowPatientDetailsModal(false) }}
                patientData={selectedPatient || {
                    id: 'P001',
                    name: 'Jan Kowalski',
                    pesel: '80010112345',
                    dateOfBirth: '1980-01-01',
                    lastVisit: '2024-03-01',
                    status: 'Active'
                }}
            />
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
                                <View style={styles.calendarHeader}>
                                    <TouchableOpacity onPress={() => setActivePicker(null)}>
                                        <Text style={styles.calendarCancelText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setActivePicker(null)}>
                                        <Text style={styles.calendarConfirmText}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    value={
                                        activePicker === 'dobStart' ? dobStartDate || new Date() :
                                        dobEndDate || new Date()
                                    }
                                    mode="date"
                                    display="inline"
                                    onChange={onDateChange}
                                    style={styles.iosPicker}
                                />
                            </View>
                        </TouchableOpacity>
                    </Modal>
                ) : (
                    <DateTimePicker
                        value={
                            activePicker === 'dobStart' ? dobStartDate || new Date() :
                            dobEndDate || new Date()
                        }
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )
            )}

            {/* Help Button */}
            <TouchableOpacity style={styles.helpButtonFloat}>
                <Text style={styles.helpText}>?</Text>
            </TouchableOpacity>

        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: "75%",
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "flex-end",
        alignSelf: "center",
        marginVertical: hp(1), width: "95%",
    },
    backButton: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#4A90B9',
        borderRadius: 50,
        marginRight: 10,
        height: 50,
        width: 50,
        alignItems: "center", justifyContent: 'center',
    },
    backButtonText: {
        color: '#4A90B9',
        marginLeft: 5,
        fontSize: 16,
    },
    filtersButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginLeft: 10,
    },
    buttonText: {
        color: '#4A90B9',
        marginLeft: 8,
        fontSize: 15,
    },
    filtersButtonText: {
        color: 'white',
        marginLeft: 8,
        fontSize: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666666',
    },
    listContent: {
        paddingBottom: 20,
    },
    listHeader: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: "white",
        marginTop: hp(1)
    },
    headerCell: {
        width: 70, marginEnd: 5,
    },
    headerText: {
        fontWeight: '600',
        color: 'black',
        fontSize: 13,
        textAlign: "left"
    },
    patientCard: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    patientRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
    },
    patientInfo: {
        width: 70,
        marginEnd: 5,
    },
    patientName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
    },
    patientId: {
        fontSize: 12,
        color: '#666666',
        marginTop: 4,
    },
    patientDetail: {
        width: 70, marginEnd: 5
    },
    detailValue: {
        fontSize: 12,
        color: '#333333',
    },
    statusBadge: {
        width: 70,
        paddingVertical: 7,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '500',
    },
    actionButtons: {
        flex: 1,
        flexDirection: 'row',
        width: 70
    },
    actionButton: {
        paddingVertical: 10, borderWidth: 1, borderColor: "#4A90B9", borderRadius: 10, paddingHorizontal: 5
    },
    helpButtonFloat: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#4A90B9',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    helpText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    // Filter Styles
    filtersContainer: {
        backgroundColor: 'white',
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    filtersInner: {
        padding: 15,
    },
    filterRow: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    filterGroup: {
        flex: 1,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#344155',
        marginBottom: 8,
    },
    dateRangeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 42,
        backgroundColor: '#F8FAFC',
        marginHorizontal: 2,
    },
    dateText: {
        fontSize: 13,
        color: '#64748B',
    },
    checkboxesSection: {
        marginBottom: 15,
    },
    checkboxRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 8,
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
    filterActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 5,
    },
    clearFiltersBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4A90B9',
    },
    clearFiltersBtnText: {
        color: '#4A90B9',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 5,
    },
    applyFiltersBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#4A90B9',
    },
    applyFiltersBtnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 5,
    },
    // Calendar Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarModalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    calendarCancelText: {
        fontSize: 16,
        color: '#6B7280',
    },
    calendarConfirmText: {
        fontSize: 16,
        color: '#4A90B9',
        fontWeight: '600',
    },
    iosPicker: {
        height: 350,
    }
});

export default PatientListScreen;