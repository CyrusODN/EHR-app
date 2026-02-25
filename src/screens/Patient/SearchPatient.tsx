// components/SearchPatientScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    TextInput,
    Platform,
    Modal
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DateTimePicker from '@react-native-community/datetimepicker';

import CustomDropdown from '../../component/customDropDown';
import PrimaryButton from '../../component/button';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const SearchPatientScreen = () => {
    const navigation = useNavigation();

    // State for filters visibility
    const [showFilters, setShowFilters] = useState(false);

    // State for filter inputs
    const [searchText, setSearchText] = useState('');
    const [dobStartDate, setDobStartDate] = useState<Date | null>(null);
    const [dobEndDate, setDobEndDate] = useState<Date | null>(null);
    const [lastVisitStartDate, setLastVisitStartDate] = useState<Date | null>(null);
    const [lastVisitEndDate, setLastVisitEndDate] = useState<Date | null>(null);
    const [nextVisitStartDate, setNextVisitStartDate] = useState<Date | null>(null);
    const [nextVisitEndDate, setNextVisitEndDate] = useState<Date | null>(null);
    const [gender, setGender] = useState<string | number>('All');

    // State for date pickers
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

    // Function to format date for display
    const formatDate = (date: any) => {
        if (!date) return 'dd/mm/yyyy';
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
                case 'lastVisitStart': setLastVisitStartDate(selectedDate); break;
                case 'lastVisitEnd': setLastVisitEndDate(selectedDate); break;
                case 'nextVisitStart': setNextVisitStartDate(selectedDate); break;
                case 'nextVisitEnd': setNextVisitEndDate(selectedDate); break;
            }
            setActivePicker(null);
        } else if (event.type === 'dismissed') {
            setActivePicker(null);
        }
    };

    // Toggle filters visibility
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    // Clear all filters
    const clearFilters = () => {
        setDobStartDate(null);
        setDobEndDate(null);
        setLastVisitStartDate(null);
        setLastVisitEndDate(null);
        setNextVisitStartDate(null);
        setNextVisitEndDate(null);
        setGender('All');
        setHasPesel(false);
        setHasDeclaration(false);
        setIsDeceased(false);
        setHasDebt(false);
        setIsActive(true);
        setIsLongAbsent(false);
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

    return (
        <View style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
            <View style={styles.container}>
                {/* Header */}
                <View style={{
                    width: "100%", backgroundColor: "white",
                    flexDirection: "row", justifyContent: "space-around", paddingTop: hp(7)
                }}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Search Patients</Text>
                        <Text style={styles.headerSubtitle}>Search patients by name, PESEL number or card number</Text>
                    </View>

                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={20} color="#4A90B9" />
                    </TouchableOpacity>
                </View>


                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.searchContainer}>
                        {/* Search Input */}
                        <View style={styles.searchInputContainer}>
                            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Name, PESEL or card number..."
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                        </View>

                        {/* Filters Button */}
                        <TouchableOpacity
                            style={styles.filtersButton}
                            onPress={toggleFilters}
                        >
                            <Ionicons name="options-outline" size={20} color="#4A90B9" />
                            <Text style={styles.filtersButtonText}>Filters</Text>
                            <Ionicons
                                name={showFilters ? "close" : "chevron-down"}
                                size={16}
                                color="#4A90B9"
                            />
                        </TouchableOpacity>

                        {/* Filters Section */}
                        {showFilters && (
                            <View style={styles.filtersContainer}>
                                {/* Date of Birth Filter */}
                                <Text style={styles.filterSectionTitle}>Date of Birth</Text>
                                <View style={styles.dateRangeContainer}>
                                    <TouchableOpacity
                                        style={styles.dateInput}
                                        onPress={() => setActivePicker('dobStart')}
                                    >
                                        <Text style={styles.dateText}>
                                            {formatDate(dobStartDate)}
                                        </Text>
                                        <MaterialCommunityIcons name="calendar-blank" size={18} color="grey" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.dateInput}
                                        onPress={() => setActivePicker('dobEnd')}
                                    >
                                        <Text style={styles.dateText}>
                                            {formatDate(dobEndDate)}
                                        </Text>
                                        <MaterialCommunityIcons name="calendar-blank" size={18} color="grey" />
                                    </TouchableOpacity>
                                </View>

                                {/* Gender Filter */}
                                <Text style={styles.filterSectionTitle}>Gender</Text>
                                <CustomDropdown
                                    placeholder="Select gender"
                                    options={genderOptions}
                                    value={gender}
                                    onChange={setGender}
                                    icon={undefined}
                                />

                                {/* Last Visit Filter */}
                                <Text style={styles.filterSectionTitle}>Last Visit</Text>
                                <View style={styles.dateRangeContainer}>
                                    <TouchableOpacity
                                        style={styles.dateInput}
                                        onPress={() => setActivePicker('lastVisitStart')}
                                    >
                                        <Text style={styles.dateText}>
                                            {formatDate(lastVisitStartDate)}
                                        </Text>
                                        <MaterialCommunityIcons name="calendar-blank" size={18} color="grey" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.dateInput}
                                        onPress={() => setActivePicker('lastVisitEnd')}
                                    >
                                        <Text style={styles.dateText}>
                                            {formatDate(lastVisitEndDate)}
                                        </Text>
                                        <MaterialCommunityIcons name="calendar-blank" size={18} color="grey" />
                                    </TouchableOpacity>
                                </View>

                                {/* Next Visit Filter */}
                                <Text style={styles.filterSectionTitle}>Next Visit</Text>
                                <View style={styles.dateRangeContainer}>
                                    <TouchableOpacity
                                        style={styles.dateInput}
                                        onPress={() => setActivePicker('nextVisitStart')}
                                    >
                                        <Text style={styles.dateText}>
                                            {formatDate(nextVisitStartDate)}
                                        </Text>
                                        <MaterialCommunityIcons name="calendar-blank" size={18} color="grey" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.dateInput}
                                        onPress={() => setActivePicker('nextVisitEnd')}
                                    >
                                        <Text style={styles.dateText}>
                                            {formatDate(nextVisitEndDate)}
                                        </Text>
                                        <MaterialCommunityIcons name="calendar-blank" size={18} color="grey" />
                                    </TouchableOpacity>
                                </View>

                                {/* Checkboxes */}
                                <View style={styles.checkboxesContainer}>
                                    <View style={styles.checkboxRow}>
                                        {renderCheckbox(hasPesel, setHasPesel, "Has PESEL")}
                                        {renderCheckbox(hasDeclaration, setHasDeclaration, "Has Declaration")}
                                    </View>

                                    <View style={styles.checkboxRow}>
                                        {renderCheckbox(isDeceased, setIsDeceased, "Deceased")}
                                        {renderCheckbox(hasDebt, setHasDebt, "Has Debt")}
                                    </View>

                                    <View style={styles.checkboxRow}>
                                        {renderCheckbox(isActive, setIsActive, "Active")}
                                        {renderCheckbox(isLongAbsent, setIsLongAbsent, "Long Absent")}
                                    </View>
                                </View>

                                {/* Filter Buttons */}
                                <View style={styles.filterButtonsContainer}>


                                    <PrimaryButton
                                        label={"Clear filters"}
                                        onPress={clearFilters}
                                        filled={false}
                                        icon={<Ionicons name="close" size={16} color="#4A90B9" />}
                                        style={{ width: '48%', }}
                                        loading={false}
                                        disabled={false}
                                        image={undefined}
                                        iconStyle={undefined}
                                        imageStyle={undefined}
                                    />
                                    <PrimaryButton
                                        onPress={() => { setShowFilters(false) }}
                                        label={"Apply filters"}
                                        filled={true}
                                        icon={<Ionicons name="funnel-outline" size={16} color="white" />}
                                        style={{ width: '48%', }}
                                        loading={false}
                                        disabled={false}
                                        image={undefined}
                                        iconStyle={undefined}
                                        imageStyle={undefined}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Results Message */}
                        <View style={styles.resultsMessageContainer}>
                            <Text style={styles.resultsMessage}>Enter search criteria to see results</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Help Button */}
                <TouchableOpacity style={styles.helpButtonFloat}>
                    <Text style={styles.helpText}>?</Text>
                </TouchableOpacity>

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
                                            activePicker === 'dobEnd' ? dobEndDate || new Date() :
                                            activePicker === 'lastVisitStart' ? lastVisitStartDate || new Date() :
                                            activePicker === 'lastVisitEnd' ? lastVisitEndDate || new Date() :
                                            activePicker === 'nextVisitStart' ? nextVisitStartDate || new Date() :
                                            nextVisitEndDate || new Date()
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
                                activePicker === 'dobEnd' ? dobEndDate || new Date() :
                                activePicker === 'lastVisitStart' ? lastVisitStartDate || new Date() :
                                activePicker === 'lastVisitEnd' ? lastVisitEndDate || new Date() :
                                activePicker === 'nextVisitStart' ? nextVisitStartDate || new Date() :
                                nextVisitEndDate || new Date()
                            }
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )
                )}
            </View>
        </View>
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
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 30,
    },
    searchContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        margin: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 45,
        fontSize: 16,
    },
    filtersButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#4A90B9',
        borderRadius: 5,
        padding: 12,
        marginBottom: 15,
    },
    filtersButtonText: {
        color: '#4A90B9',
        fontWeight: '500',
        flex: 1,
        marginLeft: 10,
    },
    filtersContainer: {
        marginTop: 5,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
    },
    dateRangeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    dateInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        padding: 12,
        backgroundColor: 'white',
        width: '48%',
    },
    dateText: {
        color: '#333',
    },
    checkboxesContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    checkboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: '#4A90B9',
        borderColor: '#4A90B9',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#333',
    },
    filterButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    clearFiltersButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#4A90B9',
        borderRadius: 5,
        padding: 12,
        width: '48%',
    },
    clearFiltersText: {
        color: '#4A90B9',
        marginLeft: 5,
    },
    applyFiltersButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4A90B9',
        borderRadius: 5,
        padding: 12,
        width: '48%',
    },
    applyFiltersText: {
        color: 'white',
        marginLeft: 5,
    },
    resultsMessageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    resultsMessage: {
        color: '#666',
        fontSize: 16,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarModalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        width: '90%',
        maxWidth: 400,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginBottom: 10,
    },
    calendarCancelText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    calendarConfirmText: {
        fontSize: 16,
        color: '#4A90B9',
        fontWeight: '600',
    },
    iosPicker: {
        height: 350,
        width: '100%',
    },
});

export default SearchPatientScreen;