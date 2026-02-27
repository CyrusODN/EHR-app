// components/NewPatientScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    StatusBar,
    Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { CreatePatient } from '../../Services/Patient.Service';
import CustomAlert from '../../component/customAlert';

const NewPatientScreen = ({ }) => {
    const navigation = useNavigation();
    // State variables for form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [pesel, setPesel] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [gender, setGender] = useState<string | number | null>(null);
    const [phone, setPhone] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [maidenName, setMaidenName] = useState('');
    const [alternativePhone, setAlternativePhone] = useState('');
    const [email, setEmail] = useState('');
    const [placeOfBirth, setPlaceOfBirth] = useState('');
    const [documentType, setDocumentType] = useState<string | number | null>(null);
    const [bloodType, setBloodType] = useState<string | number | null>(null);
    const [internalCardNo, setInternalCardNo] = useState('');
    const [foreigner, setForeigner] = useState<string | number | null>(null);
    const [street, setStreet] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [apartmentNo, setApartmentNo] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState<string | number | null>(null);
    const [voivodeship, setVoivodeship] = useState<string | number | null>(null);
    const [municipalityTeryt, setMunicipalityTeryt] = useState('');
    const [insuranceType, setInsuranceType] = useState<string | number>('nfz');
    const [insuranceNo, setInsuranceNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{
        visible: boolean;
        type: 'success' | 'warning' | 'error';
        message: string;
    }>({
        visible: false,
        type: 'success',
        message: '',
    });

    // Options for dropdowns
    const genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ];

    const insuranceOptions = [
        { label: 'NFZ', value: 'NFZ' },
        { label: 'Private', value: 'Private' },
        { label: 'None', value: 'None' },
    ];

    const documentTypeOptions = [
        { label: 'Residence Card', value: 'residence_card' },
        { label: 'ID Card', value: 'id_card' },
        { label: 'EHIC', value: 'ehic' },
        { label: 'EU/EOG National ID', value: 'eu_eog_id' },
        { label: "Foreign Driver's License", value: 'foreign_license' },
        { label: 'Other', value: 'other' },
        { label: 'None (Infant)', value: 'none_infant' },
        { label: 'None (NN)', value: 'none_nn' },
        { label: 'None (NW - Child under 6 months)', value: 'none_nw' },
    ];

    const bloodTypeOptions = [
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' },
    ];

    const foreignerOptions = [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
    ];

    const countryOptions = [
        { label: 'Poland', value: 'poland' },
        { label: 'Germany', value: 'germany' },
        { label: 'United Kingdom', value: 'uk' },
        { label: 'France', value: 'france' },
    ];

    const voivodeshipOptions = [
        { label: 'Mazowieckie', value: 'mazowieckie' },
        { label: 'Dolnośląskie', value: 'dolnoslaskie' },
        { label: 'Kujawsko-pomorskie', value: 'kujawsko-pomorskie' },
        { label: 'Lubelskie', value: 'lubelskie' },
        { label: 'Lubuskie', value: 'lubuskie' },
        { label: 'Łódzkie', value: 'lodzkie' },
        { label: 'Małopolskie', value: 'malopolskie' },
        { label: 'Opolskie', value: 'opolskie' },
        { label: 'Podkarpackie', value: 'podkarpackie' },
        { label: 'Podlaskie', value: 'podlaskie' },
        { label: 'Pomorskie', value: 'pomorskie' },
        { label: 'Śląskie', value: 'slaskie' },
        { label: 'Świętokrzyskie', value: 'swietokrzyskie' },
        { label: 'Warmińsko-mazurskie', value: 'warminsko-mazurskie' },
        { label: 'Wielkopolskie', value: 'wielkopolskie' },
        { label: 'Zachodniopomorskie', value: 'zachodniopomorskie' },
    ];

    // Handle date change
    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            setDateOfBirth(selectedDate);
        }
    };

    // Format date for display
    const formatDate = (date: Date | null) => {
        if (!date) return 'Select date';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const showAlert = (type: 'success' | 'warning' | 'error', message: string) => {
        setAlertConfig({
            visible: true,
            type,
            message,
        });
    };

    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

    // Handle save patient
    const handleSavePatient = async () => {
        setLoading(true);
        console.log('Initiating Create Patient request...');
        try {
            const payload = {
                firstName,
                lastName,
                pesel,
                dob: dateOfBirth ? dateOfBirth.toISOString() : null,
                gender: gender || "",
                phone,
                middleName,
                maidenName,
                alternativePhone,
                email,
                birthPlace: placeOfBirth,
                documentType: documentType || "",
                bloodType: bloodType || "",
                internalCardNumber: internalCardNo,
                isForeigner: foreigner === 'yes',
                street,
                houseNumber: houseNo,
                apartmentNumber: apartmentNo,
                postalCode,
                city,
                country: country || "",
                voivodeship: voivodeship || "",
                municipalityTeryt,
                insuranceType: insuranceType.toString().toLowerCase(),
                insuranceNumber: insuranceNo
            };

            console.log('Create Patient Payload:', JSON.stringify(payload, null, 2));

            const response = (await CreatePatient(payload)) as any;
            console.log('Create Patient Response:', JSON.stringify(response, null, 2));

            if (response) {
                const successMessage = typeof response === 'string' ? response : (response.data || 'Patient created successfully!');
                showAlert('success', successMessage);
                setTimeout(() => {
                    hideAlert();
                    navigation.goBack();
                }, 2000);
            } else {
                showAlert('error', 'Failed to create patient');
            }
        } catch (error: any) {
            showAlert('error', error.message || 'An error occurred while creating patient');
            console.error(error);
        } finally {
            setLoading(false);
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
                                    <Text style={{ color: dateOfBirth ? '#000' : 'grey' }}>
                                        {formatDate(dateOfBirth)}
                                    </Text>
                                    <MaterialCommunityIcons name="calendar-month" size={20} color="#4A90B9" />
                                </TouchableOpacity>

                                <Modal
                                    visible={showDatePicker}
                                    transparent={true}
                                    animationType="fade"
                                    onRequestClose={() => setShowDatePicker(false)}
                                >
                                    <TouchableOpacity 
                                        style={styles.modalOverlay} 
                                        activeOpacity={1} 
                                        onPress={() => setShowDatePicker(false)}
                                    >
                                        <View style={styles.datePickerContainer}>
                                            <View style={styles.datePickerHeader}>
                                                <Text style={styles.datePickerTitle}>Select Date of Birth</Text>
                                                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                                    <Ionicons name="close" size={24} color="#666" />
                                                </TouchableOpacity>
                                            </View>
                                            <DateTimePicker
                                                value={dateOfBirth || new Date()}
                                                mode="date"
                                                display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                                                onChange={handleDateChange}
                                                maximumDate={new Date()}
                                            />
                                            {Platform.OS === 'ios' && (
                                                <TouchableOpacity 
                                                    style={styles.confirmButton}
                                                    onPress={() => setShowDatePicker(false)}
                                                >
                                                    <Text style={styles.confirmButtonText}>Confirm</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                </Modal>
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

                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Middle Name</Text>
                                    <CustomTextInput
                                        placeholder="Enter middle name"
                                        value={middleName}
                                        onChangeText={setMiddleName} icon={undefined} right={undefined} onRightPress={undefined} keyboardType={undefined} />
                                </View>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Maiden Name</Text>
                                    <CustomTextInput
                                        placeholder="Enter maiden name"
                                        value={maidenName}
                                        onChangeText={setMaidenName} icon={undefined} right={undefined} onRightPress={undefined} keyboardType={undefined} />
                                </View>
                            </View>

                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Alternative Phone</Text>
                                    <CustomTextInput
                                        placeholder="Enter alternative phone"
                                        value={alternativePhone}
                                        onChangeText={setAlternativePhone}
                                        keyboardType="phone-pad" icon={undefined} right={undefined} onRightPress={undefined} />
                                </View>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Email</Text>
                                    <CustomTextInput
                                        placeholder="Enter email address"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address" icon={undefined} right={undefined} onRightPress={undefined} />
                                </View>
                            </View>

                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Place of Birth</Text>
                                    <CustomTextInput
                                        placeholder="Enter place of birth"
                                        value={placeOfBirth}
                                        onChangeText={setPlaceOfBirth} icon={undefined} right={undefined} onRightPress={undefined} keyboardType={undefined} />
                                </View>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Document Type</Text>
                                    <CustomDropdown
                                        placeholder="Select document type"
                                        options={documentTypeOptions}
                                        value={documentType}
                                        onChange={setDocumentType} icon={undefined} />
                                </View>
                            </View>

                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Blood Type</Text>
                                    <CustomDropdown
                                        placeholder="Select blood type"
                                        options={bloodTypeOptions}
                                        value={bloodType}
                                        onChange={setBloodType} icon={undefined} />
                                </View>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Internal Card No.</Text>
                                    <CustomTextInput
                                        placeholder="Enter internal card no."
                                        value={internalCardNo}
                                        onChangeText={setInternalCardNo} icon={undefined} right={undefined} onRightPress={undefined} keyboardType={undefined} />
                                </View>
                            </View>

                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Foreigner</Text>
                                    <CustomDropdown
                                        placeholder="Select"
                                        options={foreignerOptions}
                                        value={foreigner}
                                        onChange={setForeigner} icon={undefined} />
                                </View>
                                <View style={styles.halfField} />
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

                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Voivodeship</Text>
                                    <CustomDropdown
                                        placeholder="Select voivodeship"
                                        options={voivodeshipOptions}
                                        value={voivodeship}
                                        onChange={setVoivodeship} icon={undefined} />
                                </View>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>* Country</Text>
                                    <CustomDropdown
                                        placeholder="Select country"
                                        options={countryOptions}
                                        value={country}
                                        onChange={setCountry} icon={undefined} />
                                </View>
                            </View>
                            <Gap height={hp(1)} />
                            <View style={styles.formField}>
                                <Text style={styles.label}>Municipality TERYT</Text>
                                <CustomTextInput
                                    placeholder="Enter municipality TERYT"
                                    value={municipalityTeryt}
                                    onChangeText={setMunicipalityTeryt} icon={undefined} right={undefined} onRightPress={undefined} keyboardType={undefined} />
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
                                loading={loading} 
                                disabled={loading}
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
            <CustomAlert
                visible={alertConfig.visible}
                type={alertConfig.type}
                message={alertConfig.message}
                onClose={hideAlert}
            />
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    datePickerContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingBottom: 20,
        width: '95%',
        overflow: 'hidden',
        maxWidth: 400,
    },
    datePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    datePickerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    confirmButton: {
        backgroundColor: '#4A90B9',
        marginHorizontal: 16,
        marginTop: 10,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default NewPatientScreen;