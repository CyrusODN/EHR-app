// components/NewPatientScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    SafeAreaView,
    StatusBar
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomTextInput from '../../component/customTextInput';
import CustomDropdown from '../../component/customDropDown';
import PrimaryButton from '../../component/button';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Gap from '../../component/gap';
import { useNavigation } from '@react-navigation/native';

const NewPatientScreen = ({ }) => {
    const navigation = useNavigation();
    // State variables for form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [pesel, setPesel] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [gender, setGender] = useState<string | number | null>(null);
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [apartmentNo, setApartmentNo] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [insuranceType, setInsuranceType] = useState<string | number>('NFZ');
    const [insuranceNo, setInsuranceNo] = useState('');

    // Options for dropdowns
    const genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ];

    const insuranceOptions = [
        { label: 'NFZ', value: 'NFZ' },
        { label: 'Private', value: 'Private' },
        { label: 'International', value: 'International' },
    ];

    // Handle date change
    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(Platform.OS === 'ios');
        setDateOfBirth(currentDate);
    };

    // Format date for display
    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Handle save patient
    const handleSavePatient = () => {
        // Save patient logic
        console.log({
            firstName,
            lastName,
            pesel,
            dateOfBirth,
            gender,
            phone,
            street,
            houseNo,
            apartmentNo,
            postalCode,
            city,
            insuranceType,
            insuranceNo
        });
        // Navigate back or to another screen
        if (navigation && navigation.goBack) {
            navigation.goBack();
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>New Patient</Text>
                        <Text style={styles.headerSubtitle}>Enter new patient data</Text>
                    </View>
                    <View style={styles.headerRightContainer}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation && navigation.goBack ? navigation.goBack() : null}
                        >
                            <Ionicons name="arrow-back" size={20} color="#4A90B9" />
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.helpButtonHeader}>
                            <Text style={styles.helpText}>?</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>

                {/* Content */}
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.formCard}>
                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>Personal Data</Text>

                            <View style={styles.formField}>
                                <Text style={styles.label}>First Name</Text>
                                <CustomTextInput
                                    placeholder="Enter first name"
                                    value={firstName}
                                    onChangeText={setFirstName} icon={undefined} right={undefined} onRightPress={undefined} keyboardType={undefined} />
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Last Name</Text>
                                <CustomTextInput
                                    placeholder="Enter last name"
                                    value={lastName}
                                    onChangeText={setLastName} icon={undefined} right={undefined} onRightPress={undefined} keyboardType={undefined} />
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>PESEL</Text>
                                <CustomTextInput
                                    placeholder="Enter PESEL number"
                                    value={pesel}
                                    onChangeText={setPesel}
                                    keyboardType="numeric" icon={undefined} right={undefined} onRightPress={undefined} />
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Date of Birth</Text>
                                <TouchableOpacity
                                    style={styles.datePickerButton}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text>{formatDate(dateOfBirth)}</Text>
                                    <MaterialCommunityIcons name="calendar-blank" size={18} color="grey" />
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={dateOfBirth}
                                        mode="date"
                                        display="default"
                                        onChange={handleDateChange}
                                    />
                                )}
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Gender</Text>
                                <CustomDropdown
                                    placeholder="Select gender"
                                    options={genderOptions}
                                    value={gender}
                                    onChange={setGender} icon={undefined} />
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Phone</Text>
                                <CustomTextInput
                                    placeholder="Enter phone number"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad" icon={undefined} right={undefined} onRightPress={undefined} />
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>Address</Text>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Street</Text>
                                <CustomTextInput
                                    placeholder="Enter street name"
                                    value={street}
                                    onChangeText={setStreet} icon={undefined} right={undefined} onRightPress={undefined} keyboardType={undefined} />
                            </View>

                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>House No.</Text>
                                    <CustomTextInput
                                        placeholder="Enter house number"
                                        value={houseNo}
                                        onChangeText={setHouseNo} icon={undefined} right={undefined} onRightPress={undefined} keyboardType={undefined} />
                                </View>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Apartment No.</Text>
                                    <CustomTextInput
                                        placeholder="Enter apartment number"
                                        value={apartmentNo}
                                        onChangeText={setApartmentNo} icon={undefined} right={undefined} onRightPress={undefined} keyboardType={undefined} />
                                </View>
                            </View>
                            <Gap height={hp(1)} />
                            <View style={styles.formField}>
                                <Text style={styles.label}>Postal Code</Text>
                                <CustomTextInput
                                    placeholder="Enter postal code"
                                    value={postalCode}
                                    onChangeText={setPostalCode} icon={undefined} right={undefined} onRightPress={undefined} keyboardType={undefined} />
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>City</Text>
                                <CustomTextInput
                                    placeholder="Enter city name"
                                    value={city}
                                    onChangeText={setCity} icon={undefined} right={undefined} onRightPress={undefined} keyboardType={undefined} />
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>Insurance</Text>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Insurance Type</Text>
                                <CustomDropdown
                                    placeholder="Select insurance type"
                                    options={insuranceOptions}
                                    value={insuranceType}
                                    onChange={setInsuranceType} icon={undefined} />
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Insurance No.</Text>
                                <CustomTextInput
                                    placeholder="Enter insurance number"
                                    value={insuranceNo}
                                    onChangeText={setInsuranceNo} icon={undefined} right={undefined} onRightPress={undefined} keyboardType={undefined} />
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <PrimaryButton
                                label="Save patient"
                                filled={true}
                                icon={<FontAwesome name="save" size={16} color="white" />}
                                onPress={handleSavePatient}
                                style={{ width: "100%" }} 
                                loading={false} 
                                disabled={false}
                                image={undefined}
                                iconStyle={undefined}
                                imageStyle={undefined}
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Help button */}
                <TouchableOpacity style={styles.helpButtonFloat}>
                    <Text style={styles.helpText}>?</Text>
                </TouchableOpacity>
            </View>
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
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
    },
    headerTime: {
        fontSize: 14,
        color: '#333333',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666666',
        marginTop: 5,
    },
    headerRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#4A90B9',
        borderRadius: 50,
        marginRight: 10,
        height: 50, width: 50,
        alignItems: "center", justifyContent: 'center',
    },
    helpButtonHeader: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4A90B9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 30,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        margin: 15,
        marginTop: 20,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    formSection: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333333',
    },
    formField: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333333',
    },
    datePickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        padding: 12,
        backgroundColor: 'white',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfField: {
        width: '48%',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    buttonContainer: {
        marginHorizontal: 15,
        marginTop: 20,
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
});

export default NewPatientScreen;