import React, { useState, useMemo } from 'react';
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
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

const NewPatientScreen = ({ }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { colors: tc, isDark } = useThemeColors();
    
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
        { label: t('newPatient.male'), value: 'male' },
        { label: t('newPatient.female'), value: 'female' },
        { label: t('newPatient.other'), value: 'other' },
    ];

    const insuranceOptions = [
        { label: t('newPatient.nfz'), value: 'NFZ' },
        { label: t('newPatient.private'), value: 'Private' },
        { label: t('newPatient.none'), value: 'None' },
    ];

    const documentTypeOptions = [
        { label: t('newPatient.residenceCard'), value: 'residence_card' },
        { label: t('newPatient.idCard'), value: 'id_card' },
        { label: t('newPatient.ehic'), value: 'ehic' },
        { label: t('newPatient.euEogId'), value: 'eu_eog_id' },
        { label: t('newPatient.foreignLicense'), value: 'foreign_license' },
        { label: t('newPatient.other'), value: 'other' },
        { label: t('newPatient.noneInfant'), value: 'none_infant' },
        { label: t('newPatient.noneNn'), value: 'none_nn' },
        { label: t('newPatient.noneNw'), value: 'none_nw' },
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
        { label: t('newPatient.yes'), value: 'yes' },
        { label: t('newPatient.no'), value: 'no' },
    ];

    const countryOptions = [
        { label: t('newPatient.poland'), value: 'poland' },
        { label: t('newPatient.germany'), value: 'germany' },
        { label: t('newPatient.unitedKingdom'), value: 'uk' },
        { label: t('newPatient.france'), value: 'france' },
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

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') setShowDatePicker(false);
        if (selectedDate) setDateOfBirth(selectedDate);
    };

    const formatDate = (date: Date | null) => {
        if (!date) return t('newPatient.selectDate');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const showAlert = (type: 'success' | 'warning' | 'error', message: string) => {
        setAlertConfig({ visible: true, type, message });
    };

    const hideAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

    const handleSavePatient = async () => {
        if (!firstName.trim() || !lastName.trim() || !dateOfBirth || !gender || !street.trim() || !houseNo.trim() || !city.trim() || !country || !insuranceType || !postalCode.trim()) {
            showAlert('warning', t('newPatient.fillCompulsoryFields'));
            return;
        }

        const phoneDigits = phone.replace(/\D/g, '');
        if (phone && phoneDigits.length !== 9) {
            showAlert('warning', t('newPatient.phoneLengthError'));
            return;
        }

        const peselDigits = pesel.replace(/\D/g, '');
        if (pesel && peselDigits.length !== 11) {
            showAlert('warning', t('newPatient.peselLengthError'));
            return;
        }

        const altPhoneDigits = alternativePhone.replace(/\D/g, '');
        if (alternativePhone && altPhoneDigits.length !== 9) {
            showAlert('warning', t('newPatient.altPhoneLengthError'));
            return;
        }

        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (email && !emailPattern.test(email)) {
            showAlert('warning', t('newPatient.invalidEmail'));
            return;
        }

        const postalPattern = /^\d{2}-\d{3}$/;
        if (postalCode && !postalPattern.test(postalCode)) {
            showAlert('warning', t('newPatient.postalCodeFormatError'));
            return;
        }

        setLoading(true);
        try {
            const rawPayload = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                pesel: pesel.trim(),
                dob: dateOfBirth ? dateOfBirth.toISOString() : null,
                gender: gender || "",
                phone: phone.trim(),
                middleName: middleName.trim(),
                maidenName: maidenName.trim(),
                alternativePhone: alternativePhone.trim(),
                email: email.trim(),
                birthPlace: placeOfBirth.trim(),
                documentType: documentType || "",
                bloodType: bloodType || "",
                internalCardNumber: internalCardNo.trim(),
                isForeigner: foreigner === null ? null : foreigner === 'yes',
                street: street.trim(),
                houseNumber: houseNo.trim(),
                apartmentNumber: apartmentNo.trim(),
                postalCode: postalCode.trim(),
                city: city.trim(),
                country: country || "",
                voivodeship: voivodeship || "",
                municipalityTeryt: municipalityTeryt.trim(),
                insuranceType: insuranceType ? insuranceType.toString().toLowerCase() : "nfz",
                insuranceNumber: insuranceNo.trim()
            };

            const payload = Object.fromEntries(
                Object.entries(rawPayload).filter(([_, v]) => v !== null && v !== undefined && v !== "")
            );

            const response = (await CreatePatient(payload)) as any;
            if (response) {
                const successMessage = typeof response === 'string' ? response : (response.message || t('newPatient.createSuccess'));
                navigation.navigate('Dashboard', { successMessage });
            } else {
                showAlert('error', t('newPatient.createError'));
            }
        } catch (error: any) {
            const errorMessage = error?.message || (typeof error === 'string' ? error : t('newPatient.createError'));
            showAlert('error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);

    return (
        <SafeAreaView style={ds.safeArea}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.headerBg} />
            <View style={ds.container}>
                {/* Header */}
                <View style={ds.header}>
                    <View>
                        <Text style={ds.headerTitle}>{t('newPatient.newPatient')}</Text>
                        <Text style={ds.headerSubtitle}>{t('newPatient.enterNewPatientData')}</Text>
                    </View>
                    <View style={ds.headerRightContainer}>
                        <TouchableOpacity
                            style={ds.backButton}
                            onPress={() => navigation?.goBack?.()}
                        >
                            <Ionicons name="arrow-back" size={20} color={tc.accent} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <ScrollView style={ds.scrollView} contentContainerStyle={ds.scrollViewContent} showsVerticalScrollIndicator={false}>
                    <View style={ds.formCard}>
                        <View style={ds.formSection}>
                            <Text style={ds.sectionTitle}>{t('newPatient.personalData')}</Text>
  
                            <View style={ds.formField}>
                                <Text style={ds.label}><Text style={{ color: tc.accentRed }}>*</Text> {t('newPatient.firstName')}</Text>
                                <CustomTextInput
                                    placeholder={t('newPatient.firstNamePlaceholder')}
                                    value={firstName}
                                    onChangeText={setFirstName} />
                            </View>
  
                            <View style={ds.formField}>
                                <Text style={ds.label}><Text style={{ color: tc.accentRed }}>*</Text> {t('newPatient.lastName')}</Text>
                                <CustomTextInput
                                    placeholder={t('newPatient.lastNamePlaceholder')}
                                    value={lastName}
                                    onChangeText={setLastName} />
                            </View>
  
                            <View style={ds.formField}>
                                <Text style={ds.label}>{t('newPatient.pesel')}</Text>
                                <CustomTextInput
                                    placeholder={t('newPatient.peselPlaceholder')}
                                    value={pesel}
                                    onChangeText={setPesel}
                                    name="pesel"
                                    keyboardType="numeric" />
                            </View>

                             <View style={ds.formField}>
                                <Text style={ds.label}><Text style={{ color: tc.accentRed }}>*</Text> {t('newPatient.dob')}</Text>
                                <TouchableOpacity
                                    style={ds.datePickerButton}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text style={{ color: dateOfBirth ? tc.textPrimary : tc.textMuted }}>
                                        {formatDate(dateOfBirth)}
                                    </Text>
                                    <MaterialCommunityIcons name="calendar-month" size={20} color={tc.accent} />
                                </TouchableOpacity>
  
                                <Modal
                                    visible={showDatePicker}
                                    transparent={true}
                                    animationType="fade"
                                    onRequestClose={() => setShowDatePicker(false)}
                                >
                                    <TouchableOpacity 
                                        style={ds.modalOverlay} 
                                        activeOpacity={1} 
                                        onPress={() => setShowDatePicker(false)}
                                    >
                                        <View style={ds.datePickerContainer}>
                                            <View style={ds.datePickerHeader}>
                                                <Text style={ds.datePickerTitle}>{t('newPatient.selectDate')}</Text>
                                                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                                    <Ionicons name="close" size={24} color={tc.textPrimary} />
                                                </TouchableOpacity>
                                            </View>
                                            <DateTimePicker
                                                value={dateOfBirth || new Date()}
                                                mode="date"
                                                display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                                                onChange={handleDateChange}
                                                maximumDate={new Date()}
                                                themeVariant={isDark ? 'dark' : 'light'}
                                            />
                                            {Platform.OS === 'ios' && (
                                                <TouchableOpacity 
                                                    style={ds.confirmButton}
                                                    onPress={() => setShowDatePicker(false)}
                                                >
                                                    <Text style={ds.confirmButtonText}>{t('newPatient.confirm')}</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                </Modal>
                            </View>
  
                            <View style={ds.formField}>
                                <Text style={ds.label}><Text style={{ color: tc.accentRed }}>*</Text> {t('newPatient.gender')}</Text>
                                <CustomDropdown
                                    placeholder={t('newPatient.selectGender')}
                                    options={genderOptions}
                                    value={gender}
                                    onChange={setGender} />
                            </View>
  
                            <View style={ds.formField}>
                                <Text style={ds.label}>{t('newPatient.phone')}</Text>
                                <CustomTextInput
                                    placeholder={t('newPatient.phonePlaceholder')}
                                    value={phone}
                                    onChangeText={setPhone}
                                    name="phone"
                                    keyboardType="phone-pad" />
                            </View>

                            <View style={ds.rowContainer}>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}>{t('newPatient.middleName')}</Text>
                                    <CustomTextInput
                                        placeholder={t('newPatient.middleNamePlaceholder')}
                                        value={middleName}
                                        onChangeText={setMiddleName} />
                                </View>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}>{t('newPatient.maidenName')}</Text>
                                    <CustomTextInput
                                        placeholder={t('newPatient.maidenNamePlaceholder')}
                                        value={maidenName}
                                        onChangeText={setMaidenName} />
                                </View>
                            </View>

                            <View style={ds.rowContainer}>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}>{t('newPatient.alternativePhone')}</Text>
                                    <CustomTextInput
                                        placeholder={t('newPatient.altPhonePlaceholder')}
                                        value={alternativePhone}
                                        onChangeText={setAlternativePhone}
                                        name="alternativePhone"
                                        keyboardType="phone-pad" />
                                </View>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}>{t('newPatient.email')}</Text>
                                    <CustomTextInput
                                        placeholder={t('newPatient.emailPlaceholder')}
                                        value={email}
                                        onChangeText={setEmail}
                                        name="email"
                                        keyboardType="email-address" />
                                </View>
                            </View>

                            <View style={ds.rowContainer}>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}>{t('newPatient.birthPlace')}</Text>
                                    <CustomTextInput
                                        placeholder={t('newPatient.birthPlacePlaceholder')}
                                        value={placeOfBirth}
                                        onChangeText={setPlaceOfBirth} />
                                </View>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}>{t('newPatient.documentType')}</Text>
                                    <CustomDropdown
                                        placeholder={t('newPatient.selectDocumentType')}
                                        options={documentTypeOptions}
                                        value={documentType}
                                        onChange={setDocumentType} />
                                </View>
                            </View>

                            <View style={ds.rowContainer}>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}>{t('newPatient.bloodType')}</Text>
                                    <CustomDropdown
                                        placeholder={t('newPatient.selectBloodType')}
                                        options={bloodTypeOptions}
                                        value={bloodType}
                                        onChange={setBloodType} />
                                </View>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}>{t('newPatient.internalCardNo')}</Text>
                                    <CustomTextInput
                                        placeholder={t('newPatient.internalCardNoPlaceholder')}
                                        value={internalCardNo}
                                        onChangeText={setInternalCardNo} />
                                </View>
                            </View>

                            <View style={ds.rowContainer}>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}>{t('newPatient.foreigner')}</Text>
                                    <CustomDropdown
                                        placeholder={t('newPatient.select')}
                                        options={foreignerOptions}
                                        value={foreigner}
                                        onChange={setForeigner} />
                                </View>
                            </View>
                        </View>
  
                        <View style={ds.divider} />
  
                        <View style={ds.formSection}>
                            <Text style={ds.sectionTitle}>{t('newPatient.address')}</Text>
  
                            <View style={ds.formField}>
                                <Text style={ds.label}><Text style={{ color: tc.accentRed }}>*</Text> {t('newPatient.street')}</Text>
                                <CustomTextInput
                                    placeholder={t('newPatient.streetPlaceholder')}
                                    value={street}
                                    onChangeText={setStreet} />
                            </View>

                            <View style={ds.rowContainer}>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}><Text style={{ color: tc.accentRed }}>*</Text> {t('newPatient.houseNo')}</Text>
                                    <CustomTextInput
                                        placeholder={t('newPatient.houseNoPlaceholder')}
                                        value={houseNo}
                                        onChangeText={setHouseNo} />
                                </View>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}>{t('newPatient.apartmentNo')}</Text>
                                    <CustomTextInput
                                        placeholder={t('newPatient.apartmentNoPlaceholder')}
                                        value={apartmentNo}
                                        onChangeText={setApartmentNo} />
                                </View>
                            </View>
                            <Gap height={hp(1)} />
                            <View style={ds.formField}>
                                <Text style={ds.label}><Text style={{ color: tc.accentRed }}>*</Text> {t('newPatient.postalCode')}</Text>
                                <CustomTextInput
                                    placeholder={t('newPatient.postalCodePlaceholder')}
                                    value={postalCode}
                                    onChangeText={setPostalCode}
                                    name="postalCode" />
                            </View>
  
                            <View style={ds.formField}>
                                <Text style={ds.label}><Text style={{ color: tc.accentRed }}>*</Text> {t('newPatient.city')}</Text>
                                <CustomTextInput
                                    placeholder={t('newPatient.cityPlaceholder')}
                                    value={city}
                                    onChangeText={setCity} />
                            </View>

                            <View style={ds.rowContainer}>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}>{t('newPatient.voivodeship')}</Text>
                                    <CustomDropdown
                                        placeholder={t('newPatient.select')}
                                        options={voivodeshipOptions}
                                        value={voivodeship}
                                        onChange={setVoivodeship} />
                                </View>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}><Text style={{ color: tc.accentRed }}>*</Text> {t('newPatient.country')}</Text>
                                    <CustomDropdown
                                        placeholder={t('newPatient.select')}
                                        options={countryOptions}
                                        value={country}
                                        onChange={setCountry} />
                                </View>
                            </View>
                            <Gap height={hp(1)} />
                            <View style={ds.formField}>
                                <Text style={ds.label}>{t('newPatient.municipalityTeryt')}</Text>
                                <CustomTextInput
                                    placeholder={t('newPatient.municipalityTerytPlaceholder')}
                                    value={municipalityTeryt}
                                    onChangeText={setMunicipalityTeryt} />
                            </View>
                        </View>

                        <View style={ds.divider} />
  
                        <View style={ds.formSection}>
                            <Text style={ds.sectionTitle}>{t('newPatient.insurance')}</Text>
  
                            <View style={ds.formField}>
                                <Text style={ds.label}><Text style={{ color: tc.accentRed }}>*</Text> {t('newPatient.insuranceType')}</Text>
                                <CustomDropdown
                                    placeholder={t('newPatient.selectInsuranceType')}
                                    options={insuranceOptions}
                                    value={insuranceType}
                                    onChange={setInsuranceType} />
                            </View>

                            <View style={ds.formField}>
                                <Text style={ds.label}>{t('newPatient.insuranceNo')}</Text>
                                <CustomTextInput
                                    placeholder={t('newPatient.insuranceNoPlaceholder')}
                                    value={insuranceNo}
                                    onChangeText={setInsuranceNo} />
                            </View>
                        </View>
  
                        <View style={ds.buttonContainer}>
                            <PrimaryButton
                                label={t('newPatient.savePatient')}
                                filled={true}
                                icon={<FontAwesome name="save" size={16} color="white" />}
                                onPress={handleSavePatient}
                                style={{ width: "95%" }} 
                                loading={loading} 
                                disabled={loading}
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Help button */}
                <TouchableOpacity style={ds.helpButtonFloat}>
                    <Text style={ds.helpText}>?</Text>
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

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: tc.headerBg,
    },
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: tc.headerBg,
        borderBottomWidth: isDark ? 1 : 0,
        borderBottomColor: tc.borderColor,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: tc.textPrimary,
        marginTop: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: tc.textSecondary,
        marginTop: 5,
    },
    headerRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
        borderWidth: 1,
        borderColor: tc.accent,
        borderRadius: 50,
        height: 50, 
        width: 50,
        alignItems: "center", 
        justifyContent: 'center',
        backgroundColor: isDark ? tc.buttonMutedBg : 'transparent',
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
        backgroundColor: tc.cardBackground,
        borderRadius: 12,
        margin: 15,
        marginTop: 15,
        paddingBottom: 20,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderColor,
        ...Platform.select({
            ios: { shadowColor: tc.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: isDark ? 0 : 0.05, shadowRadius: 8 },
            android: { elevation: isDark ? 0 : 3 },
        }),
    },
    formSection: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
        color: tc.textPrimary,
    },
    formField: {
        marginBottom: 15,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
        color: tc.textSecondary,
    },
    datePickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 8,
        padding: 12,
        backgroundColor: tc.cardBackgroundAlt,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    halfField: {
        width: '48%',
    },
    divider: {
        height: 1,
        backgroundColor: tc.borderColor,
        marginHorizontal: 15,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    helpButtonFloat: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: tc.accent,
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    datePickerContainer: {
        backgroundColor: tc.modalBg || tc.drawerBg || '#1A1A1A',
        borderRadius: 20,
        paddingBottom: 20,
        width: '95%',
        overflow: 'hidden',
        maxWidth: 400,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderColor,
    },
    datePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
    },
    datePickerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    confirmButton: {
        backgroundColor: tc.accent,
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