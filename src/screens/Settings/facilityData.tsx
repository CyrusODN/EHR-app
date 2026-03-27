// components/FacilityData.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomTextInput from '../../component/customTextInput';
import CustomDropdown from '../../component/customDropDown';
import PrimaryButton from '../../component/button';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { GetFacilitySettings, UpdateFacilitySettings } from '../../Services/Facility.Service';
import { uploadFileOnServer } from '../../Services/Upload.Service';
import CustomAlert from '../../component/customAlert';
import DocumentPicker from 'react-native-document-picker';
import { Image } from 'react-native';

const FacilityData = ({ onAlert }: { onAlert?: (config: any) => void }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();

    // State variables for form fields
    const [name, setName] = useState('');
    const [regon, setRegon] = useState('');
    const [nip, setNip] = useState('');
    const [bdo, setBdo] = useState('');
    const [registryNumber, setRegistryNumber] = useState('');
    const [facilityType, setFacilityType] = useState<string | number>('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [street, setStreet] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [apartmentNo, setApartmentNo] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [terytCode, setTerytCode] = useState('');
    const [nfzCode, setNfzCode] = useState('');
    const [workHoursFromDate, setWorkHoursFromDate] = useState(new Date());
    const [workHoursToDate, setWorkHoursToDate] = useState(new Date());
    const [activePicker, setActivePicker] = useState<'from' | 'to' | null>(null);
    const [visitDuration, setVisitDuration] = useState('');
    const [visitType, setVisitType] = useState<string | number>('');
    const [defaultReceptionMode, setDefaultReceptionMode] = useState<string | number>('');
    const [consentText, setConsentText] = useState('');
    const [loading, setLoading] = useState(false);
    const [logo, setLogo] = useState<any>(null);
    const [alertConfig, setAlertConfig] = useState<any>({
        visible: false,
        type: 'success',
        message: '',
    });

    // Options for dropdowns
    const facilityTypeOptions = [
        { label: t('settings.facility_data.options.facility_types.individual'), value: 'praktyka_ind' },
        { label: t('settings.facility_data.options.facility_types.group'), value: 'praktyka_zesp' },
        { label: t('settings.facility_data.options.facility_types.hospital'), value: 'szpital' },
        { label: t('settings.facility_data.options.facility_types.clinic'), value: 'przychodnia' },
    ];

    const visitTypeOptions = [
        { label: t('settings.facility_data.options.visit_types.private'), value: 'private' },
        { label: t('settings.facility_data.options.visit_types.nfz'), value: 'nfz' },
        { label: t('settings.facility_data.options.visit_types.mixed'), value: 'mixed' },
    ];

    const receptionModeOptions = [
        { label: t('settings.facility_data.options.reception_modes.in_person'), value: 'inPerson' },
        { label: t('settings.facility_data.options.reception_modes.online'), value: 'online' },
        { label: t('settings.facility_data.options.reception_modes.telephone'), value: 'telephone' },
    ];

    const nfzOptions = [
        { label: '01 NFZ Dolnośląski', value: '01 NFZ Dolnośląski' },
        { label: '02 NFZ Kujawsko-Pomorski', value: '02 NFZ Kujawsko-Pomorski' },
        { label: '03 NFZ Lubelski', value: '03 NFZ Lubelski' },
        { label: '04 NFZ Lubuski', value: '04 NFZ Lubuski' },
        { label: '05 NFZ Łódzki', value: '05 NFZ Łódzki' },
        { label: '06 NFZ Małopolski', value: '06 NFZ Małopolski' },
        { label: '07 NFZ Mazowiecki', value: '07 NFZ Mazowiecki' },
        { label: '08 NFZ Opolski', value: '08 NFZ Opolski' },
        { label: '09 NFZ Podkarpacki', value: '09 NFZ Podkarpacki' },
        { label: '10 NFZ Podlaski', value: '10 NFZ Podlaski' },
        { label: '11 NFZ Gdańsk', value: '11 NFZ Gdańsk' },
        { label: '12 NFZ Śląski', value: '12 NFZ Śląski' },
        { label: '13 NFZ Świętokrzyski', value: '13 NFZ Świętokrzyski' },
        { label: '14 NFZ Warmińsko-Mazurski', value: '14 NFZ Warmińsko-Mazurski' },
        { label: '15 NFZ Wielkopolski', value: '15 NFZ Wielkopolski' },
        { label: '16 NFZ Zachodniopomorski', value: '16 NFZ Zachodniopomorski' },
    ];

    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const showAlert = (type: 'success' | 'error' | 'warning', message: string) => {
        setAlertConfig({ visible: true, type, message });
    };

    React.useEffect(() => {
        fetchFacilityData();
    }, []);

    const fetchFacilityData = async () => {
        setLoading(true);
        try {
            const res: any = await GetFacilitySettings();
            console.log("Facility API Response (Full):", res);
            const data = res?.data || res;
            console.log("Facility Data extracted:", data);
            if (data) {
                setName(data.name || '');
                setRegon(data.regon?.toString() || '');
                setNip(data.nip?.toString() || '');
                setBdo(data.bdoNumber || '');
                setRegistryNumber(data.registryNumber || '');
                setFacilityType(data.facilityType || '');
                setPhone(data.phone || '');
                setEmail(data.email || '');
                setWebsite(data.website || '');
                setAccountNumber(data.accountNumber || '');
                setStreet(data.street || '');
                setHouseNo(data.building || '');
                setApartmentNo(data.apartment || '');
                setPostalCode(data.postalCode || '');
                setCity(data.city || '');
                setTerytCode(data.tertyCode || '');
                setNfzCode(data.nfzCode || '');
                
                if (data.startingHours) {
                    const [h, m] = data.startingHours.split(':');
                    const fromDate = new Date();
                    fromDate.setHours(parseInt(h) || 0);
                    fromDate.setMinutes(parseInt(m) || 0);
                    setWorkHoursFromDate(fromDate);
                }
                if (data.endingHourse) { // Typo "endingHourse" matches API response
                    const [h, m] = data.endingHourse.split(':');
                    const toDate = new Date();
                    toDate.setHours(parseInt(h) || 0);
                    toDate.setMinutes(parseInt(m) || 0);
                    setWorkHoursToDate(toDate);
                }
                setVisitDuration(data.duration?.toString() || '');
                setVisitType(data.visitType || '');
                setDefaultReceptionMode(data.receptionMode || '');
                setConsentText(data.consent || '');
                if (data.facilityLogo) {
                    setLogo({ name: 'Current Logo', uri: data.facilityLogo });
                }
            }
        } catch (error) {
            console.error("Error fetching facility data:", error);
            showAlert('error', t('settings.facility_data.alerts.fetch_error'));
        } finally {
            setLoading(false);
        }
    };

    // Handle picking logo/document
    const pickLogo = async () => {
        try {
            const res = await DocumentPicker.pickSingle({
                type: [
                    DocumentPicker.types.images,
                    DocumentPicker.types.pdf,
                    DocumentPicker.types.doc,
                    DocumentPicker.types.docx,
                ],
            });
            setLogo(res);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker
            } else {
                console.error("Error picking document:", err);
                showAlert('error', t('settings.facility_data.alerts.pick_error'));
            }
        }
    };

    // Handle save facility data
    const handleSave = async () => {
        setLoading(true);
        try {
            let uploadedLogoUrl = logo?.uri;

            // If it's a new local file (uri starts with 'file://' or content:// etc and not 'http')
            if (logo && logo.uri && !logo.uri.startsWith('http')) {
                const uploadRes: any = await uploadFileOnServer(logo);
                if (uploadRes?.data) {
                    uploadedLogoUrl = uploadRes.data;
                } else if (typeof uploadRes === 'string') {
                    uploadedLogoUrl = uploadRes;
                }
            }

            const payload = {
                name,
                regon,
                nip,
                bdoNumber: bdo,
                registryNumber,
                facilityType,
                phone,
                email,
                website,
                accountNumber,
                street,
                building: houseNo,
                apartment: apartmentNo,
                postalCode,
                city,
                tertyCode: terytCode,
                nfzCode,
                startingHours: `${workHoursFromDate.getHours().toString().padStart(2, '0')}:${workHoursFromDate.getMinutes().toString().padStart(2, '0')}`,
                endingHourse: `${workHoursToDate.getHours().toString().padStart(2, '0')}:${workHoursToDate.getMinutes().toString().padStart(2, '0')}`,
                duration: visitDuration,
                visitType,
                receptionMode: defaultReceptionMode,
                consent: consentText,
                facilityLogo: uploadedLogoUrl
            };
            
            console.log("Saving Facility Data Payload:", payload);
            await UpdateFacilitySettings(payload);
            
            if (onAlert) {
                onAlert({
                    visible: true,
                    type: 'success',
                    message: t('settings.facility_data.alerts.save_success')
                });
            } else {
                showAlert('success', t('settings.facility_data.alerts.save_success'));
            }
            
            // Refresh to see new changes
            fetchFacilityData();
            
        } catch (error) {
            console.error("Error updating facility settings:", error);
            if (onAlert) {
                onAlert({
                    visible: true,
                    type: 'error',
                    message: t('settings.facility_data.alerts.save_error')
                });
            } else {
                showAlert('error', t('settings.facility_data.alerts.save_error'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            
            {/* Header with Logo */}
            <View style={styles.topHeader}>
                <View style={styles.logoContainer}>
                    <MaterialCommunityIcons name="office-building-cog-outline" size={24} color="#4A90B9" />
                </View>
                <Text style={styles.topHeaderTitle}>{t('settings.facility_data.title')}</Text>
            </View>

            {/* Content */}
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                <View style={[styles.formCard, { padding: 20 }]}>
                    {/* Basic Information Section */}
                    <View style={styles.formSection}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="information-circle-outline" size={20} color="#4A90B9" />
                            <Text style={styles.sectionTitle}>{t('settings.facility_data.sections.general')}</Text>
                        </View>

                        <View style={styles.rowContainer}>
                            <View style={{ flex: 2, marginRight: 12 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.name')} <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder={t('settings.facility_data.placeholders.enter_name')}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.regon')} <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder={t('settings.facility_data.labels.regon')}
                                    value={regon}
                                    onChangeText={setRegon}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={[styles.rowContainer, { marginTop: 10 }]}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.nip')} <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder={t('settings.facility_data.labels.nip')}
                                    value={nip}
                                    onChangeText={setNip}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.bdo')}</Text>
                                <CustomTextInput
                                    placeholder={t('settings.facility_data.labels.bdo')}
                                    value={bdo}
                                    onChangeText={setBdo}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.registry_number')}</Text>
                                <CustomTextInput
                                    placeholder={t('settings.facility_data.placeholders.registry')}
                                    value={registryNumber}
                                    onChangeText={setRegistryNumber}
                                />
                            </View>
                        </View>

                        <View style={[styles.rowContainer, { marginTop: 10 }]}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.facility_type')} <Text style={styles.required}>*</Text></Text>
                                <CustomDropdown
                                    placeholder={t('settings.facility_data.placeholders.select_type')}
                                    options={facilityTypeOptions}
                                    value={facilityType}
                                    onChange={(val) => setFacilityType(val.toString())}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.phone')} <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder={t('settings.facility_data.labels.phone')}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        <View style={[styles.rowContainer, { marginTop: 10 }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.email')} <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder={t('settings.facility_data.labels.email')}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>
                    </View>

                        <View style={styles.divider} />

                    {/* Contact & Address Section */}
                    <View style={styles.formSection}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="location-outline" size={20} color="#4A90B9" />
                            <Text style={styles.sectionTitle}>{t('settings.facility_data.sections.address')}</Text>
                        </View>

                        <View style={styles.rowContainer}>
                            <View style={{ flex: 1, marginRight: 15 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.website')}</Text>
                                <CustomTextInput
                                    placeholder={t('settings.facility_data.placeholders.enter_website')}
                                    value={website}
                                    onChangeText={setWebsite}
                                    keyboardType="url"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.account_number')}</Text>
                                <CustomTextInput
                                    placeholder={t('settings.facility_data.labels.account_number')}
                                    value={accountNumber}
                                    onChangeText={setAccountNumber}
                                />
                            </View>
                        </View>

                        <View style={[styles.rowContainer, { marginTop: 15 }]}>
                            <View style={{ flex: 2, marginRight: 15 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.street')} <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder={t('settings.facility_data.placeholders.street')}
                                    value={street}
                                    onChangeText={setStreet}
                                />
                            </View>
                            <View style={{ flex: 1, marginRight: 15 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.house_no')} <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder={t('settings.facility_data.placeholders.no')}
                                    value={houseNo}
                                    onChangeText={setHouseNo}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.apartment_no')}</Text>
                                <CustomTextInput
                                    placeholder={t('settings.facility_data.placeholders.apt')}
                                    value={apartmentNo}
                                    onChangeText={setApartmentNo}
                                />
                            </View>
                        </View>

                        <View style={[styles.rowContainer, { marginTop: 15 }]}>
                            <View style={{ flex: 1, marginRight: 15 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.postal_code')} <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder="XX-XXX"
                                    value={postalCode}
                                    onChangeText={setPostalCode}
                                />
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.city')} <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder={t('settings.facility_data.placeholders.city')}
                                    value={city}
                                    onChangeText={setCity}
                                />
                            </View>
                        </View>

                        <View style={[styles.rowContainer, { marginTop: 15 }]}>
                            <View style={{ flex: 1, marginRight: 15 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.teryt_code')} <Text style={styles.required}>*</Text></Text>
                                <CustomTextInput
                                    placeholder={t('settings.facility_data.placeholders.search_teryt')}
                                    value={terytCode}
                                    onChangeText={setTerytCode}
                                    icon={<FontAwesome name="search" size={14} color="#64748B" />}
                                />
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.nfz_branch')} <Text style={styles.required}>*</Text></Text>
                                <CustomDropdown
                                    placeholder={t('settings.facility_data.placeholders.select_nfz_branch')}
                                    options={nfzOptions}
                                    value={nfzCode}
                                    onChange={(val) => setNfzCode(val.toString())}
                                />
                            </View>
                        </View>
                    </View>

                        <View style={styles.divider} />

                        {/* Workflow Section */}
                        <View style={styles.formSection}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="time-outline" size={20} color="#4A90B9" />
                                <Text style={styles.sectionTitle}>{t('settings.facility_data.sections.other')}</Text>
                            </View>

                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>{t('settings.facility_data.labels.work_hours')} <Text style={styles.required}>*</Text></Text>
                                    <TouchableOpacity 
                                        activeOpacity={0.7}
                                        onPress={() => setActivePicker('from')}
                                    >
                                        <View pointerEvents="none">
                                            <CustomTextInput 
                                                placeholder="00:00"
                                                value={formatTime(workHoursFromDate)}
                                                editable={false}
                                                right={<FontAwesome name="clock-o" size={18} color="#64748B" />}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.halfField}>
                                    <Text style={styles.label}>{t('settings.facility_data.labels.work_hours')} <Text style={styles.required}>*</Text></Text>
                                    <TouchableOpacity 
                                        activeOpacity={0.7}
                                        onPress={() => setActivePicker('to')}
                                    >
                                        <View pointerEvents="none">
                                            <CustomTextInput 
                                                placeholder="00:00"
                                                value={formatTime(workHoursToDate)}
                                                editable={false}
                                                right={<FontAwesome name="clock-o" size={18} color="#64748B" />}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {activePicker && (
                                <DateTimePicker
                                    value={activePicker === 'from' ? workHoursFromDate : workHoursToDate}
                                    mode="time"
                                    is24Hour={true}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, selectedDate) => {
                                        if (Platform.OS === 'android') {
                                            setActivePicker(null);
                                        }
                                        
                                        if (selectedDate) {
                                            if (activePicker === 'from') {
                                                setWorkHoursFromDate(selectedDate);
                                            } else {
                                                setWorkHoursToDate(selectedDate);
                                            }
                                        }
                                    }}
                                />
                            )}
                            {Platform.OS === 'ios' && activePicker && (
                                <TouchableOpacity 
                                    style={styles.closePickerBtn}
                                    onPress={() => setActivePicker(null)}
                                >
                                    <Text style={styles.closePickerText}>{t('settings.facility_data.buttons.done')}</Text>
                                </TouchableOpacity>
                            )}

                            <View style={[styles.rowContainer, { marginTop: 10 }]}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>{t('settings.facility_data.labels.visit_duration')} <Text style={styles.required}>*</Text></Text>
                                    <CustomTextInput
                                        placeholder="30"
                                        value={visitDuration}
                                        onChangeText={setVisitDuration}
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View style={styles.halfField}>
                                    <Text style={styles.label}>{t('settings.facility_data.labels.visit_type')}</Text>
                                    <CustomDropdown
                                        placeholder={t('settings.facility_data.placeholders.select_visit_type')}
                                        options={visitTypeOptions}
                                        value={visitType}
                                        onChange={(val) => setVisitType(val.toString())}
                                    />
                                </View>
                            </View>

                            <View style={[styles.formField, { marginTop: 10 }]}>
                                <Text style={styles.label}>{t('settings.facility_data.labels.reception_mode')}</Text>
                                <CustomDropdown
                                    placeholder={t('settings.facility_data.placeholders.select_reception_mode')}
                                    options={receptionModeOptions}
                                    value={defaultReceptionMode}
                                    onChange={(val) => setDefaultReceptionMode(val.toString())}
                                />
                            </View>
                        </View>

                        <View style={styles.divider} />

                    <View style={styles.formSection}>
                        <Text style={styles.label}>{t('settings.facility_data.labels.logo')}</Text>
                        <View style={styles.logoUploadContainer}>
                            <TouchableOpacity 
                                style={styles.chooseFileBtn}
                                onPress={pickLogo}
                            >
                                <View style={styles.chooseFileInner}>
                                    <Ionicons name="cloud-upload-outline" size={18} color="#4A90B9" />
                                    <Text style={styles.chooseFileText}>
                                        {logo ? t('settings.facility_data.buttons.choose_file') : t('settings.facility_data.buttons.choose_file')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            {logo && (
                                <View style={styles.selectedFileContainer}>
                                    <View style={styles.logoPreviewWrapper}>
                                        {logo.type?.startsWith('image/') ? (
                                            <Image source={{ uri: logo.uri }} style={styles.logoPreview} />
                                        ) : (
                                            <Ionicons name="document-text-outline" size={24} color="#4A90B9" />
                                        )}
                                    </View>
                                    <Text style={styles.fileName} numberOfLines={1}>{logo.name}</Text>
                                    <TouchableOpacity onPress={() => setLogo(null)}>
                                        <Ionicons name="close-circle" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <View style={[styles.formField, { marginTop: 20 }]}>
                            <Text style={styles.label}>{t('settings.facility_data.labels.consent')}</Text>
                            <CustomTextInput
                                placeholder=""
                                value={consentText}
                                onChangeText={setConsentText}
                                multiline={true}
                                numberOfLines={6}
                                icon={undefined}
                                right={undefined}
                                onRightPress={undefined}
                                keyboardType={undefined}
                            />
                        </View>

                        <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                            <Text style={styles.requiredNote}>* {t('settings.facility_data.labels.required_field')}</Text>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                            label={t('settings.facility_data.buttons.save')}
                            filled={true}
                            icon={<FontAwesome name="save" size={16} color="white" />}
                            onPress={handleSave}
                            style={{ width: "100%" }}
                            loading={loading}
                            disabled={loading}
                        />
                    </View>
                    <View style={{ height: 20 }} />
                </View>
            </ScrollView>
            <CustomAlert
                visible={alertConfig.visible}
                type={alertConfig.type}
                message={alertConfig.message}
                onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
            />
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
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 30,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
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
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        paddingBottom: 10,
    },
    formField: {
        marginBottom: 5,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
        color: '#64748B',
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
        height: 8,
        backgroundColor: '#F8FAFC',
    },
    buttonContainer: {
        marginHorizontal: 15,
        marginTop: 10,
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
    chooseFileBtn: {
        borderWidth: 1.5,
        borderColor: '#4A90B9',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    chooseFileInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    chooseFileText: {
        color: '#4A90B9',
        fontWeight: '600',
        fontSize: 14,
    },
    requiredNote: {
        color: '#777777',
        fontSize: 12,
        fontStyle: 'italic',
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    logoContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#E0F2FE',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    topHeaderTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    timePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        height: 48,
    },
    timeValueText: {
        fontSize: 15,
        color: '#1E293B',
    },
    logoUploadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 15,
    },
    selectedFileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        flex: 1,
        minWidth: 200,
    },
    logoPreviewWrapper: {
        width: 40,
        height: 40,
        borderRadius: 4,
        overflow: 'hidden',
        marginRight: 10,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoPreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    fileName: {
        fontSize: 13,
        color: '#475569',
        flex: 1,
        marginRight: 10,
    },
    closePickerBtn: {
        alignSelf: 'flex-end',
        padding: 10,
        marginTop: -10,
        marginBottom: 10,
    },
    closePickerText: {
        color: '#4A90B9',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default FacilityData;