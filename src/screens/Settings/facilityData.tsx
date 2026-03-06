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
import { GetFacilitySettings, UpdateFacilitySettings } from '../../Services/Facility.Service';
import { uploadFileOnServer } from '../../Services/Upload.Service';
import CustomAlert from '../../component/customAlert';
import DocumentPicker from 'react-native-document-picker';
import { Image } from 'react-native';

const FacilityData = ({ onAlert }: { onAlert?: (config: any) => void }) => {
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
        { label: 'Individual practice', value: 'praktyka_ind' },
        { label: 'Group practice', value: 'praktyka_zesp' },
        { label: 'Hospital', value: 'szpital' },
        { label: 'Clinic', value: 'przychodnia' },
    ];

    const visitTypeOptions = [
        { label: 'Private', value: 'private' },
        { label: 'NFZ', value: 'nfz' },
        { label: 'Mixed', value: 'mixed' },
    ];

    const receptionModeOptions = [
        { label: 'In Person', value: 'inPerson' },
        { label: 'Online', value: 'online' },
        { label: 'Telephone', value: 'telephone' },
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
            showAlert('error', 'Failed to load facility data');
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
                showAlert('error', 'Failed to pick file');
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
                    message: 'Facility Settings updated successfully!'
                });
            } else {
                showAlert('success', 'Facility settings updated successfully');
            }
            
            // Refresh to see new changes
            fetchFacilityData();
            
        } catch (error) {
            console.error("Error updating facility settings:", error);
            if (onAlert) {
                onAlert({
                    visible: true,
                    type: 'error',
                    message: 'Failed to update facility settings'
                });
            } else {
                showAlert('error', 'Failed to update facility settings');
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
                    <Text style={styles.topHeaderTitle}>Facility Data</Text>
                </View>

                {/* Content */}
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                    <View style={[styles.formCard, { padding: 20 }]}>
                        {/* Basic Information Section */}
                        <View style={styles.formSection}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="information-circle-outline" size={20} color="#4A90B9" />
                                <Text style={styles.sectionTitle}>Basic Information</Text>
                            </View>

                            <View style={styles.rowContainer}>
                                <View style={{ flex: 2, marginRight: 12 }}>
                                    <Text style={styles.label}>Name <Text style={styles.required}>*</Text></Text>
                                    <CustomTextInput
                                        placeholder="Facility Name"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>REGON <Text style={styles.required}>*</Text></Text>
                                    <CustomTextInput
                                        placeholder="REGON"
                                        value={regon}
                                        onChangeText={setRegon}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View style={[styles.rowContainer, { marginTop: 10 }]}>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <Text style={styles.label}>NIP <Text style={styles.required}>*</Text></Text>
                                    <CustomTextInput
                                        placeholder="NIP"
                                        value={nip}
                                        onChangeText={setNip}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <Text style={styles.label}>BDO Number</Text>
                                    <CustomTextInput
                                        placeholder="BDO"
                                        value={bdo}
                                        onChangeText={setBdo}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Registry No.</Text>
                                    <CustomTextInput
                                        placeholder="Registry"
                                        value={registryNumber}
                                        onChangeText={setRegistryNumber}
                                    />
                                </View>
                            </View>

                            <View style={[styles.rowContainer, { marginTop: 10 }]}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Facility Type <Text style={styles.required}>*</Text></Text>
                                    <CustomDropdown
                                        placeholder="Select type"
                                        options={facilityTypeOptions}
                                        value={facilityType}
                                        onChange={(val) => setFacilityType(val.toString())}
                                    />
                                </View>
                            </View>

                            <View style={[styles.rowContainer, { marginTop: 10 }]}>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <Text style={styles.label}>Phone <Text style={styles.required}>*</Text></Text>
                                    <CustomTextInput
                                        placeholder="Phone"
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
                                    <CustomTextInput
                                        placeholder="Email"
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
                                <Text style={styles.sectionTitle}>Contact & Address</Text>
                            </View>

                            <View style={styles.rowContainer}>
                                <View style={{ flex: 1, marginRight: 15 }}>
                                    <Text style={styles.label}>Website</Text>
                                    <CustomTextInput
                                        placeholder="Enter website URL"
                                        value={website}
                                        onChangeText={setWebsite}
                                        keyboardType="url"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Account Number</Text>
                                    <CustomTextInput
                                        placeholder="Account number"
                                        value={accountNumber}
                                        onChangeText={setAccountNumber}
                                    />
                                </View>
                            </View>

                            <View style={[styles.rowContainer, { marginTop: 15 }]}>
                                <View style={{ flex: 2, marginRight: 15 }}>
                                    <Text style={styles.label}>Street <Text style={styles.required}>*</Text></Text>
                                    <CustomTextInput
                                        placeholder="Street name"
                                        value={street}
                                        onChangeText={setStreet}
                                    />
                                </View>
                                <View style={{ flex: 1, marginRight: 15 }}>
                                    <Text style={styles.label}>House <Text style={styles.required}>*</Text></Text>
                                    <CustomTextInput
                                        placeholder="No."
                                        value={houseNo}
                                        onChangeText={setHouseNo}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Apt No.</Text>
                                    <CustomTextInput
                                        placeholder="Apt."
                                        value={apartmentNo}
                                        onChangeText={setApartmentNo}
                                    />
                                </View>
                            </View>

                            <View style={[styles.rowContainer, { marginTop: 15 }]}>
                                <View style={{ flex: 1, marginRight: 15 }}>
                                    <Text style={styles.label}>Postal Code <Text style={styles.required}>*</Text></Text>
                                    <CustomTextInput
                                        placeholder="XX-XXX"
                                        value={postalCode}
                                        onChangeText={setPostalCode}
                                    />
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text style={styles.label}>City <Text style={styles.required}>*</Text></Text>
                                    <CustomTextInput
                                        placeholder="City name"
                                        value={city}
                                        onChangeText={setCity}
                                    />
                                </View>
                            </View>

                            <View style={[styles.rowContainer, { marginTop: 15 }]}>
                                <View style={{ flex: 1, marginRight: 15 }}>
                                    <Text style={styles.label}>TERYT Code <Text style={styles.required}>*</Text></Text>
                                    <CustomTextInput
                                        placeholder="Search TERYT..."
                                        value={terytCode}
                                        onChangeText={setTerytCode}
                                        icon={<FontAwesome name="search" size={14} color="#64748B" />}
                                    />
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text style={styles.label}>NFZ Code <Text style={styles.required}>*</Text></Text>
                                    <CustomDropdown
                                        placeholder="Select NFZ branch"
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
                                <Text style={styles.sectionTitle}>Workflow Settings</Text>
                            </View>

                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Working hours from <Text style={styles.required}>*</Text></Text>
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
                                    <Text style={styles.label}>Working hours to <Text style={styles.required}>*</Text></Text>
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

                                        // For iOS spinner, we might want a different way to close it
                                        // but usually it's handled by some "Done" button if wrapped in a modal.
                                        // Here, since the user wants it to "show when clicked", we'll keep it simple
                                        // and maybe just close it if they click the input again or we can add a close button.
                                        // For now, let's just make it show the selector.
                                    }}
                                />
                            )}
                            {Platform.OS === 'ios' && activePicker && (
                                <TouchableOpacity 
                                    style={styles.closePickerBtn}
                                    onPress={() => setActivePicker(null)}
                                >
                                    <Text style={styles.closePickerText}>Done</Text>
                                </TouchableOpacity>
                            )}

                            <View style={[styles.rowContainer, { marginTop: 10 }]}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Visit Duration (min) <Text style={styles.required}>*</Text></Text>
                                    <CustomTextInput
                                        placeholder="30"
                                        value={visitDuration}
                                        onChangeText={setVisitDuration}
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View style={styles.halfField}>
                                    <Text style={styles.label}>Visit Type</Text>
                                    <CustomDropdown
                                        placeholder="Select type"
                                        options={visitTypeOptions}
                                        value={visitType}
                                        onChange={(val) => setVisitType(val.toString())}
                                    />
                                </View>
                            </View>

                            <View style={[styles.formField, { marginTop: 10 }]}>
                                <Text style={styles.label}>Default Reception Mode</Text>
                                <CustomDropdown
                                    placeholder="Select mode"
                                    options={receptionModeOptions}
                                    value={defaultReceptionMode}
                                    onChange={(val) => setDefaultReceptionMode(val.toString())}
                                />
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.formSection}>
                            <Text style={styles.label}>Facility logo / Document</Text>
                            <View style={styles.logoUploadContainer}>
                                <TouchableOpacity 
                                    style={styles.chooseFileBtn}
                                    onPress={pickLogo}
                                >
                                    <View style={styles.chooseFileInner}>
                                        <Ionicons name="cloud-upload-outline" size={18} color="#4A90B9" />
                                        <Text style={styles.chooseFileText}>
                                            {logo ? 'CHANGE FILE' : 'CHOOSE FILE'}
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
                        </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Personal data processing consent text (change default)</Text>
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
                                <Text style={styles.requiredNote}>* Required field</Text>
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <PrimaryButton
                                label="Save Changes"
                                filled={true}
                                icon={<FontAwesome name="save" size={16} color="white" />}
                                onPress={handleSave}
                                style={{ width: "100%" }}
                                loading={loading}
                                disabled={loading}
                            />
                        </View>
                        <View style={{ height: 20 }} />
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