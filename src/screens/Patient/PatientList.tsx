// components/PatientListScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    FlatList,
    ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import ActionModal from './modals/ActionModal';
import PatientDetailsModal from './modals/PatientDetails';

const PatientListScreen = () => {
    const navigation = useNavigation();
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);

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
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-GB', options).replace(/\//g, '-');
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
                        onPress={() => { setShowActionModal(true) }}
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
        <View style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
            <View style={{
                width: "100%", backgroundColor: "white",
                flexDirection: "row", justifyContent: "space-around", paddingTop: hp(7)
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
                            justifyContent: "center", width: wp(25)
                        }}>
                        <Feather name="filter" size={20} color="white" />
                        <Text style={styles.filtersButtonText}>Filters</Text>
                    </LinearGradient>

                </TouchableOpacity>
            </View>

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
                patientData={{
                    id: 'P001',
                    name: 'Jan Kowalski',
                    pesel: '80010112345',
                    dateOfBirth: '1980-01-01',
                    lastVisit: '2024-03-01',
                    status: 'Active'
                }}
            />
            {/* Help Button */}
            <TouchableOpacity style={styles.helpButtonFloat}>
                <Text style={styles.helpText}>?</Text>
            </TouchableOpacity>

        </View >
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
});

export default PatientListScreen;