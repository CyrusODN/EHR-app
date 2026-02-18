// components/FacilityData.js
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomTextInput from '../component/customTextInput';
import CustomDropdown from '../component/customDropDown';
import PrimaryButton from '../component/button';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Gap from '../component/gap';
import { useNavigation } from '@react-navigation/native';

const FacilityData = () => {
    const navigation = useNavigation();

    // State variables for form fields
    const [name, setName] = useState('Individual Practice Dr. Cyrus Tahery');
    const [regon, setRegon] = useState('520289127');
    const [nip, setNip] = useState('6612334698');
    const [bdo, setBdo] = useState('');
    const [registryNumber, setRegistryNumber] = useState('');
    const [facilityType, setFacilityType] = useState('Individual practice');
    const [phone, setPhone] = useState('724733713');
    const [email, setEmail] = useState('DRCYRUSTAHERY@GMAIL.COM');
    const [website, setWebsite] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [street, setStreet] = useState('BEMA');
    const [houseNo, setHouseNo] = useState('15');
    const [apartmentNo, setApartmentNo] = useState('1');
    const [postalCode, setPostalCode] = useState('81-388');
    const [city, setCity] = useState('GDYNIA');
    const [terytCode, setTerytCode] = useState('Gdynia (urban municipality), Pomeranian - 2262011');
    const [nfzCode, setNfzCode] = useState('11 NFZ Gdańsk');
    const [workHoursFrom, setWorkHoursFrom] = useState({ hour: '14', minute: '00' });
    const [workHoursTo, setWorkHoursTo] = useState({ hour: '20', minute: '00' });
    const [visitDuration, setVisitDuration] = useState('15');
    const [visitType, setVisitType] = useState('Private');
    const [defaultReceptionMode, setDefaultReceptionMode] = useState('');

    // Options for dropdowns
    const facilityTypeOptions = [
        { label: 'Individual practice', value: 'Individual practice' },
        { label: 'Group practice', value: 'Group practice' },
        { label: 'Hospital', value: 'Hospital' },
        { label: 'Clinic', value: 'Clinic' },
    ];

    const visitTypeOptions = [
        { label: 'Private', value: 'Private' },
        { label: 'NFZ', value: 'NFZ' },
        { label: 'Mixed', value: 'Mixed' },
    ];

    const receptionModeOptions = [
        { label: 'Select', value: '' },
        { label: 'Appointment only', value: 'Appointment only' },
        { label: 'Walk-in', value: 'Walk-in' },
        { label: 'Both', value: 'Both' },
    ];

    // Handle save facility data
    const handleSave = () => {
        // Save facility data logic
        console.log({
            name,
            regon,
            nip,
            bdo,
            registryNumber,
            facilityType,
            phone,
            email,
            website,
            accountNumber,
            street,
            houseNo,
            apartmentNo,
            postalCode,
            city,
            terytCode,
            nfzCode,
            workHoursFrom,
            workHoursTo,
            visitDuration,
            visitType,
            defaultReceptionMode
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

                {/* Content */}
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.formCard}>
                        {/* Basic Information Section */}
                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>Basic Information</Text>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Name <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder="Enter facility name"
                                    value={name}
                                    onChangeText={setName}
                                    icon={undefined}
                                    right={undefined}
                                    onRightPress={undefined}
                                    keyboardType={undefined}
                                />
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>REGON <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder="Enter REGON number"
                                    value={regon}
                                    onChangeText={setRegon}
                                    keyboardType="numeric"
                                    icon={undefined}
                                    right={undefined}
                                    onRightPress={undefined}
                                />
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>NIP <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder="Enter NIP number"
                                    value={nip}
                                    onChangeText={setNip}
                                    keyboardType="numeric"
                                    icon={undefined}
                                    right={undefined}
                                    onRightPress={undefined}
                                />
                            </View>

                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>BDO Number</Text>
                                    <CustomTextInput
                                        placeholder="Enter BDO number"
                                        value={bdo}
                                        onChangeText={setBdo}
                                        icon={undefined}
                                        right={undefined}
                                        onRightPress={undefined}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Registry No.</Text>
                                    <CustomTextInput
                                        placeholder="Enter registry number"
                                        value={registryNumber}
                                        onChangeText={setRegistryNumber}
                                        icon={undefined}
                                        right={undefined}
                                        onRightPress={undefined}
                                        keyboardType={undefined}
                                    />
                                </View>
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Facility Type <Text style={styles.required}>*</Text></Text>
                                <CustomDropdown
                                    placeholder="Select facility type"
                                    options={facilityTypeOptions}
                                    value={facilityType}
                                    onChange={setFacilityType}
                                    icon={undefined}
                                />
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Contact Information Section */}
                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>Contact Information</Text>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Phone <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder="Enter phone number"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    icon={undefined}
                                    right={undefined}
                                    onRightPress={undefined}
                                />
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder="Enter email address"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    icon={undefined}
                                    right={undefined}
                                    onRightPress={undefined}
                                />
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Website</Text>
                                <CustomTextInput
                                    placeholder="Enter website URL"
                                    value={website}
                                    onChangeText={setWebsite}
                                    keyboardType="url"
                                    icon={undefined}
                                    right={undefined}
                                    onRightPress={undefined}
                                />
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Account Number</Text>
                                <CustomTextInput
                                    placeholder="Enter account number"
                                    value={accountNumber}
                                    onChangeText={setAccountNumber}
                                    icon={undefined}
                                    right={undefined}
                                    onRightPress={undefined}
                                    keyboardType={undefined}
                                />
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Address Section */}
                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>Address</Text>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Street <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder="Enter street name"
                                    value={street}
                                    onChangeText={setStreet}
                                    icon={undefined}
                                    right={undefined}
                                    onRightPress={undefined}
                                    keyboardType={undefined}
                                />
                            </View>

                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>House No. <Text style={styles.required}>*</Text></Text>
                                    <CustomTextInput
                                        placeholder="Enter house number"
                                        value={houseNo}
                                        onChangeText={setHouseNo}
                                        icon={undefined}
                                        right={undefined}
                                        onRightPress={undefined}
                                        keyboardType={undefined}
                                    />
                                </View>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Apartment No.</Text>
                                    <CustomTextInput
                                        placeholder="Enter apartment number"
                                        value={apartmentNo}
                                        onChangeText={setApartmentNo}
                                        icon={undefined}
                                        right={undefined}
                                        onRightPress={undefined}
                                        keyboardType={undefined}
                                    />
                                </View>
                            </View>

                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Postal Code <Text style={styles.required}>*</Text></Text>
                                    <CustomTextInput
                                        placeholder="Enter postal code"
                                        value={postalCode}
                                        onChangeText={setPostalCode}
                                        icon={undefined}
                                        right={undefined}
                                        onRightPress={undefined}
                                        keyboardType={undefined}
                                    />
                                </View>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>City <Text style={styles.required}>*</Text></Text>
                                    <CustomTextInput
                                        placeholder="Enter city name"
                                        value={city}
                                        onChangeText={setCity}
                                        icon={undefined}
                                        right={undefined}
                                        onRightPress={undefined}
                                        keyboardType={undefined}
                                    />
                                </View>
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>TERYT Code <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder="Enter TERYT code"
                                    value={terytCode}
                                    onChangeText={setTerytCode}
                                    icon={<FontAwesome name="search" size={16} color="gray" />}
                                    right={<Ionicons name="close" size={16} color="gray" />}
                                    onRightPress={() => setTerytCode('')}
                                    keyboardType={undefined}
                                />
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>NFZ Code <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder="Enter NFZ code"
                                    value={nfzCode}
                                    onChangeText={setNfzCode}
                                    icon={<FontAwesome name="search" size={16} color="gray" />}
                                    right={<Ionicons name="close" size={16} color="gray" />}
                                    onRightPress={() => setNfzCode('')}
                                    keyboardType={undefined}
                                />
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Working Hours Section */}
                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>Working Hours</Text>

                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Working hours from <Text style={styles.required}>*</Text></Text>
                                    <View style={styles.timeContainer}>
                                        <CustomTextInput
                                            placeholder="HH"
                                            value={workHoursFrom.hour}
                                            onChangeText={(text) => setWorkHoursFrom({ ...workHoursFrom, hour: text })}
                                            keyboardType="numeric"
                                            icon={undefined}
                                            right={undefined}
                                            onRightPress={undefined}
                                        />
                                        <Text style={styles.timeSeparator}>:</Text>
                                        <CustomTextInput
                                            placeholder="MM"
                                            value={workHoursFrom.minute}
                                            onChangeText={(text) => setWorkHoursFrom({ ...workHoursFrom, minute: text })}
                                            keyboardType="numeric"
                                            icon={undefined}
                                            right={undefined}
                                            onRightPress={undefined}
                                        />
                                    </View>
                                </View>

                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Working hours to <Text style={styles.required}>*</Text></Text>
                                    <View style={styles.timeContainer}>
                                        <CustomTextInput
                                            placeholder="HH"
                                            value={workHoursTo.hour}
                                            onChangeText={(text) => setWorkHoursTo({ ...workHoursTo, hour: text })}
                                            keyboardType="numeric"
                                            icon={undefined}
                                            right={undefined}
                                            onRightPress={undefined}
                                        />
                                        <Text style={styles.timeSeparator}>:</Text>
                                        <CustomTextInput
                                            placeholder="MM"
                                            value={workHoursTo.minute}
                                            onChangeText={(text) => setWorkHoursTo({ ...workHoursTo, minute: text })}
                                            keyboardType="numeric"
                                            icon={undefined}
                                            right={undefined}
                                            onRightPress={undefined}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Visit Duration (min) <Text style={styles.required}>*</Text></Text>
                                    <CustomTextInput
                                        placeholder="Duration in minutes"
                                        value={visitDuration}
                                        onChangeText={setVisitDuration}
                                        keyboardType="numeric"
                                        icon={undefined}
                                        right={undefined}
                                        onRightPress={undefined}
                                    />
                                </View>

                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Visit Type</Text>
                                    <CustomDropdown
                                        placeholder="Select visit type"
                                        options={visitTypeOptions}
                                        value={visitType}
                                        onChange={setVisitType}
                                        icon={undefined}
                                    />
                                </View>
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Default Reception Mode</Text>
                                <CustomDropdown
                                    placeholder="Select reception mode"
                                    options={receptionModeOptions}
                                    value={defaultReceptionMode}
                                    onChange={setDefaultReceptionMode}
                                    icon={undefined}
                                />
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <PrimaryButton
                                label="Save Changes"
                                filled={true}
                                icon={<FontAwesome name="save" size={16} color="white" />}
                                onPress={handleSave}
                                style={{ width: "100%" }}
                                image={undefined}
                                iconStyle={undefined}
                                imageStyle={undefined}
                                loading={false}
                                disabled={false}
                            />
                        </View>
                    </View>
                </ScrollView>

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
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 30,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
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
    required: {
        color: 'red',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    halfField: {
        width: '48%',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeSeparator: {
        fontSize: 24,
        marginHorizontal: 5,
        color: '#333',
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
    helpText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default FacilityData;