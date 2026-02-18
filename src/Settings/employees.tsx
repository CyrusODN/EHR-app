import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Switch,
    FlatList,
    ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import CustomCheckbox from '../component/customCheckBox';
import PrimaryButton from '../component/button';

const Employees = () => {
    const navigation = useNavigation();

    // State for employee filters and data
    const [activeTab, setActiveTab] = useState('Lekarze, dentyści i felczerzy');
    const [onlyActiveEmployees, setOnlyActiveEmployees] = useState(false);
    const [searchLastName, setSearchLastName] = useState('');
    const [searchFirstName, setSearchFirstName] = useState('');
    const [searchPWZ, setSearchPWZ] = useState('');
    const [checkDummy, setCheckDummy] = useState(false);
    // Sample employee data
    const [employees, setEmployees] = useState([
        {
            id: '1',
            fullName: 'Tahery Cyrus',
            login: 'cyrus_tahery6',
            pwz: '3883164',
            isActive: true
        }
    ]);

    // Tabs for employee categories
    const employeeTabs = [
        'Lekarze, dentyści i felczerzy',
        'Pielęgniarki i położne',
        'Recepcjoniści',
        'Dyrektorzy'
    ];

    // Render employee row
    const renderEmployeeRow = ({ item }) => (
        <View style={styles.employeeRow}>
            <View style={styles.employeeInfoContainer}>
                <Text style={styles.employeeName}>{item.fullName}</Text>
                <Text style={styles.employeeLogin}>{item.login}</Text>
            </View>
            <View style={styles.employeeDetailsContainer}>
                <Text style={styles.employeePWZ}>{item.pwz}</Text>
                <Switch
                    value={item.isActive}
                    trackColor={{ false: '#D1D1D6', true: '#58a6b8' }}
                    thumbColor={'#FFFFFF'}
                // onValueChange would typically update the employee's active status
                />
            </View>
            <View style={styles.employeeActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>UPRAWNIENIA</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="create-outline" size={20} color="#4A90B9" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <View style={{
                        backgroundColor: "rgba(90,167,179,0.1)",
                        height: 40, width: 40, alignItems: "center", justifyContent: 'center',
                        borderRadius: 10, marginEnd: wp(2)
                    }}>
                        <Feather name="users" size={24} color="#58a6b8" />
                    </View>
                    <Text style={styles.headerTitle}>Pracownicy</Text>
                </View>

                {/* Category Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.tabContainer}
                >
                    {employeeTabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tabButton,
                                activeTab === tab && styles.activeTabButton
                            ]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[
                                styles.tabButtonText,
                                activeTab === tab && styles.activeTabButtonText
                            ]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                    {/* <View style={styles.actionButtonsLeft}> */}

                    <PrimaryButton
                        label={'UPRAWNIENIA GRUPY'}
                        filled={false}
                        onPress={() => { }}
                        style={{ width: '58%', marginEnd: wp(2) }}
                        icon={undefined}
                        image={undefined}
                        iconStyle={undefined}
                        imageStyle={undefined}
                        loading={false}
                        disabled={false}
                    />
                    <PrimaryButton
                        label={'OCENY'}
                        filled={false}
                        onPress={() => { }}
                        style={{ width: '40%' }}
                        icon={undefined}
                        image={undefined}
                        iconStyle={undefined}
                        imageStyle={undefined}
                        loading={false}
                        disabled={false}
                    />

                    {/* </View> */}
                    {/* <TouchableOpacity style={styles.addEmployeeButton}>
                        <Text style={styles.addEmployeeButtonText}></Text>
                    </TouchableOpacity> */}
                </View>
                <View style={[styles.actionContainer, { paddingTop: 0 }]}>
                    <PrimaryButton
                        label={'+ Dodaj lekarza/dentystę/felczera'}
                        filled={true}
                        onPress={() => { }}
                        style={{ width: '100%' }}
                        icon={undefined}
                        image={undefined}
                        iconStyle={undefined}
                        imageStyle={undefined}
                        loading={false}
                        disabled={false}
                    />
                </View>


                {/* User Count Info */}
                <View style={styles.userCountContainer}>
                    <Feather name="user-check" color="blue" size={20} />
                    <Text style={styles.userCountText}>
                        Łączna liczba użytkowników kwalifikująca się do pobierania opłat abonamentowych: 3.
                        Maksymalna liczba użytkowników wynikająca z wykupionych pakietów: 7.
                    </Text>
                </View>

                {/* Search Inputs */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Nazwisko"
                            value={searchLastName}
                            onChangeText={setSearchLastName}
                        />
                    </View>
                    <View style={styles.searchInputContainer}>
                        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Imię"
                            value={searchFirstName}
                            onChangeText={setSearchFirstName}
                        />
                    </View>
                    <View style={styles.searchInputContainer}>
                        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="PWZ"
                            value={searchPWZ}
                            onChangeText={setSearchPWZ}
                        />
                    </View>
                    <View style={{ alignSelf: "flex-end" }}>
                        <CustomCheckbox label={`Tylko aktywni`} checked={checkDummy} onChange={setCheckDummy} />
                    </View>

                </View>

                {/* Employees List */}
                <FlatList
                    data={employees}
                    renderItem={renderEmployeeRow}
                    keyExtractor={(item) => item.id}
                    style={styles.employeesList}
                />

                {/* Pagination */}
                <View style={styles.paginationContainer}>
                    <Text style={styles.paginationText}>Łączna liczba wyników: 1</Text>
                    <View style={styles.paginationControls}>
                        <Text style={styles.paginationControlText}>10 rekordów na stronę</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView >
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
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    tabContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    tabButton: {
        marginRight: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: '#F0F0F0',
        height: hp(5), justifyContent: 'center',
    },
    activeTabButton: {
        backgroundColor: '#58a6b8',
    },
    tabButtonText: {
        color: 'black',
        fontSize: 14,
    },
    activeTabButtonText: {
        color: '#FFFFFF',
    },
    actionContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        width: "100%",
        alignSelf: "center",
        paddingVertical: hp(1),
        paddingHorizontal: wp(2)
    },
    actionButtonsLeft: {
        flexDirection: 'row', width: '90%', justifyContent: "space-between"
    },
    groupActionButton: {
        marginRight: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#E8F4F8',
    },
    groupActionButtonText: {
        color: '#4A90B9',
        fontSize: 14,
        fontWeight: '600',
    },
    addEmployeeButton: {
        backgroundColor: '#4A90B9',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    addEmployeeButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    userCountContainer: {
        backgroundColor: '#E8F4F8',
        padding: 16,
        flexDirection: "row",
        marginVertical: hp(1), borderRadius: hp(1)
    },
    userCountText: {
        color: 'blue',
        fontSize: 14,
        marginStart: wp(2)
    },
    searchContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        alignItems: 'center',
    },
    searchInputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        // marginRight: 8,
        paddingHorizontal: 10,
        marginBottom: hp(1)
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
    },
    onlyActiveContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: "flex-end"
    },
    onlyActiveText: {
        marginRight: 8,
        fontSize: 14,
    },
    employeesList: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    employeeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    employeeInfoContainer: {
        flex: 1,
    },
    employeeName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    employeeLogin: {
        fontSize: 14,
        color: '#666666',
    },
    employeeDetailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
    },
    employeePWZ: {
        fontSize: 14,
        color: '#666666',
        marginRight: 16,
    },
    employeeActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        marginHorizontal: 4,
    },
    actionButtonText: {
        color: '#4A90B9',
        fontSize: 12,
        fontWeight: '600',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    paginationText: {
        fontSize: 14,
        color: '#666666',
    },
    paginationControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paginationControlText: {
        fontSize: 14,
        color: '#333333',
    },
});

export default Employees;