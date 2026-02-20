// components/Security.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
    Switch
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../component/button';

interface ActivityLog {
    id: string;
    loginDate: string;
    logoutDate: string;
    user: string;
    ipAddress: string;
    deviceCode: string;
}

interface Patient {
    id: string;
    name: string;
    address: string;
    group: string;
    pesel: string;
    phone: string;
}

interface ActivityLogRowProps {
    log: ActivityLog;
}

interface PatientRowProps {
    patient: Patient;
    onExport: (id: string) => void;
}

// Activity Log Row Component
const ActivityLogRow = ({ log }: ActivityLogRowProps) => (
    <View style={styles.logRow}>
        <Text style={styles.logCell}>{log.loginDate}</Text>
        <Text style={styles.logCell}>{log.logoutDate || '-'}</Text>
        <Text style={styles.logCell}>{log.user}</Text>
        <Text style={styles.logCell}>{log.ipAddress}</Text>
        <Text style={styles.logCell}>{log.deviceCode}</Text>
    </View>
);

// Patient Row Component
const PatientRow = ({ patient, onExport }: PatientRowProps) => (
    <View style={styles.patientRow}>
        <Text style={styles.patientCell}>{patient.name}</Text>
        <Text style={styles.patientCell}>{patient.address}</Text>
        <Text style={styles.patientCell}>{patient.group || '-'}</Text>
        <Text style={styles.patientCell}>{patient.pesel}</Text>
        <Text style={styles.patientCell}>{patient.phone}</Text>
        <View style={styles.actionCell}>
            <TouchableOpacity
                style={styles.exportButton}
                onPress={() => onExport(patient.id)}
            >
                <Text style={styles.exportButtonText}>Export to XML</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const Security = () => {
    const navigation = useNavigation<any>();

    // State variables
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [searchFirstName, setSearchFirstName] = useState('');
    const [searchPesel, setSearchPesel] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [searchCard, setSearchCard] = useState('');
    const [searchEmployee, setSearchEmployee] = useState('');

    // Sample data for patients
    const patients = [
        {
            id: '1',
            name: 'Jan Kowalski',
            address: 'ul. Przykładowa 1, 00-001 Warszawa',
            group: '',
            pesel: '80010112345',
            phone: '123456789'
        }
    ];

    // Sample data for activity logs
    const activityLogs = [
        {
            id: '1',
            loginDate: 'January 24, 2025 21:54',
            logoutDate: '',
            user: 'CYRUS TAHERY',
            ipAddress: '89.64.27.2',
            deviceCode: '69f9e'
        },
        {
            id: '2',
            loginDate: 'January 24, 2025 14:27',
            logoutDate: '',
            user: 'LESZEK STYRNA',
            ipAddress: '37.47.254.206',
            deviceCode: ''
        },
        {
            id: '3',
            loginDate: 'January 23, 2025 19:36',
            logoutDate: 'January 23, 2025 22:19',
            user: 'CYRUS TAHERY',
            ipAddress: '89.64.27.2',
            deviceCode: '69f9e'
        }
    ];

    // Handle export patient data
    const handleExportPatient = (patientId: string) => {
        console.log('Exporting patient data for ID:', patientId);
    };

    // Handle logout all sessions
    const handleLogoutAllSessions = () => {
        console.log('Logging out all sessions');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.headerIconContainer}>
                        <Feather name="shield" size={24} color="#4A90B9" />
                    </View>
                    <Text style={styles.headerTitle}>Security Settings</Text>
                </View>

                {/* Two-Factor Authentication Section */}
                <View style={styles.section}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingIconContainer}>
                            <Feather name="lock" size={20} color="#4A90B9" />
                        </View>
                        <Text style={styles.settingText}>Two-Factor Authentication</Text>
                        <Switch
                            value={twoFactorEnabled}
                            onValueChange={setTwoFactorEnabled}
                            trackColor={{ false: '#D1D1D6', true: '#4A90B9' }}
                            thumbColor={'#FFFFFF'}
                        />
                    </View>
                </View>

                {/* Data Export Section */}
                <View style={styles.section}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingIconContainer}>
                            <Feather name="file-text" size={20} color="#4A90B9" />
                        </View>
                        <Text style={styles.settingText}>Export Data to XML</Text>
                    </View>

                    {/* Information Box */}
                    <View style={styles.infoBox}>
                        <Feather name="info" size={20} color="rgb(30 64 175)" />
                        <Text style={styles.infoText}>
                            For complete export of facility data, please contact Technical Support.
                        </Text>
                    </View>

                    {/* Patient Export Section */}
                    <View style={styles.exportSection}>
                        <Text style={styles.exportTitle}>Export patients to XML</Text>

                        {/* Search Filters */}
                        <View style={styles.searchFiltersContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Last name"
                                value={searchName}
                                onChangeText={setSearchName}
                            />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="First name"
                                value={searchFirstName}
                                onChangeText={setSearchFirstName}
                            />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="PESEL"
                                value={searchPesel}
                                onChangeText={setSearchPesel}
                            />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Phone"
                                value={searchPhone}
                                onChangeText={setSearchPhone}
                            />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="External card no."
                                value={searchCard}
                                onChangeText={setSearchCard}
                            />
                        </View>

                        {/* Patients Table */}
                        <View style={styles.tableContainer}>
                            {/* Table Header */}
                            <View style={styles.tableHeader}>
                                <Text style={styles.headerCell}>NAME & SURNAME</Text>
                                <Text style={styles.headerCell}>ADDRESS</Text>
                                <Text style={styles.headerCell}>PATIENT GROUPS</Text>
                                <Text style={styles.headerCell}>PESEL</Text>
                                <Text style={styles.headerCell}>PHONE</Text>
                                <Text style={styles.headerCell}>ACTIONS</Text>
                            </View>

                            {/* Table Content */}
                            {patients.map(patient => (
                                <PatientRow
                                    key={patient.id}
                                    patient={patient}
                                    onExport={handleExportPatient}
                                />
                            ))}
                        </View>
                    </View>
                </View>

                {/* Activity Log Section */}
                <View style={styles.section}>
                    <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingIconContainer}>
                                <Feather name="clock" size={20} color="#4A90B9" />
                            </View>
                            <Text style={styles.settingText}>Activity Log</Text>
                        </View>

                        {/* Employee Search */} {/* Save Button */}
                        <PrimaryButton label={"Logout all sessions"}
                            filled={false} onPress={handleLogoutAllSessions}
                            style={{ width: wp(45) }}
                            icon={<Feather name="log-out" size={16} color="#4A90B9" />}
                            image={undefined}
                            iconStyle={undefined} imageStyle={undefined}
                            loading={false} disabled={false} />
                    </View>


                    <TextInput
                        style={styles.employeeSearchInput}
                        placeholder="Employee"
                        value={searchEmployee}
                        onChangeText={setSearchEmployee}
                    />

                    {/* Activity Log Table */}
                    <View style={styles.tableContainer}>
                        {/* Table Header */}
                        <View style={styles.tableHeader}>
                            <Text style={styles.headerCell}>LOGIN DATE</Text>
                            <Text style={styles.headerCell}>LOGOUT DATE</Text>
                            <Text style={styles.headerCell}>USER</Text>
                            <Text style={styles.headerCell}>IP ADDRESS</Text>
                            <Text style={styles.headerCell}>DEVICE CODE</Text>
                        </View>

                        {/* Table Content */}
                        {activityLogs.map(log => (
                            <ActivityLogRow key={log.id} log={log} />
                        ))}
                    </View>


                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#E8F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    section: {
        backgroundColor: '#FFFFFF',
        marginTop: 12,
        borderRadius: 8,
        padding: 16,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp(40),
        // paddingVertical: 8,
    },
    settingIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E8F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingText: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F4F8',
        padding: 12,
        borderRadius: 6,
        marginVertical: 12,
    },
    infoText: {
        flex: 1,
        marginLeft: 8,
        color: 'rgb(30 64 175)',

    },
    exportSection: {
        marginTop: 16,
    },
    exportTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333333',
    },
    searchFiltersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    searchInput: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 6,
        padding: 10,
        marginBottom: 8,
    },
    employeeSearchInput: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 6,
        padding: 10,
        marginBottom: 16,
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
    },
    headerCell: {
        flex: 1,
        fontSize: 10,
        fontWeight: 'bold',
        color: 'black',
    },
    patientRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    patientCell: {
        flex: 1,
        fontSize: 10,
        color: '#333333',
    },
    actionCell: {
        flex: 1,
        alignItems: 'center',
    },
    exportButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#4A90B9',
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    exportButtonText: {
        color: '#4A90B9',
        fontSize: 12,
    },
    logRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    logCell: {
        flex: 1,
        fontSize: 10,
        color: '#333333',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#4A90B9',
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    logoutButtonText: {
        color: '#4A90B9',
        fontSize: 12,
        marginLeft: 6,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    paginationLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paginationCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paginationText: {
        fontSize: 14,
        color: '#666666',
    },
    recordsSelect: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    recordsSelectText: {
        marginRight: 6,
    },
    pageInput: {
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        width: 40,
        textAlign: 'center',
    },
});

export default Security;