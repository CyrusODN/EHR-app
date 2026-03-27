// components/PatientListScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    FlatList,
    ActivityIndicator,
    ScrollView,
    Platform,
    Modal
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { GetPatients, DeletePatient } from '../../Services/Patient.Service';
import { Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomDropdown from '../../component/customDropDown';
import PrimaryButton from '../../component/button';
import ActionModal from './modals/ActionModal';
import PatientDetailsModal from './modals/PatientDetails';
import CustomAlert from '../../component/customAlert';
import { useThemeColors } from '../../hooks/useThemeColors';

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    headerWrap: {
        width: "100%", 
        backgroundColor: tc.headerBg,
        flexDirection: "row", 
        justifyContent: "space-around", 
        paddingTop: hp(2),
        borderBottomWidth: 1,
        borderBottomColor: tc.borderLight,
    },
    header: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: "75%",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    headerSubtitle: {
        fontSize: 16,
        color: tc.textSecondary,
        marginTop: 5,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "flex-end",
        alignSelf: "center",
        marginVertical: hp(1), 
        width: "95%",
    },
    backButton: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: tc.accent,
        borderRadius: 50,
        marginRight: 10,
        height: 50,
        width: 50,
        alignItems: "center", 
        justifyContent: 'center',
        backgroundColor: tc.cardBackgroundAlt,
    },
    buttonText: {
        color: tc.accent,
        marginLeft: 8,
        fontSize: 15,
    },
    filtersButtonText: {
        color: '#FFFFFF',
        marginLeft: 8,
        fontSize: 15,
    },
    secondaryButton: {
        marginLeft: 10, 
        borderRadius: 8, 
        flexDirection: "row", 
        height: hp(5),
        alignItems: "center",
        paddingHorizontal: 12,
        justifyContent: "center", 
        minWidth: wp(20), 
        borderWidth: 1, 
        borderColor: tc.accent, 
        backgroundColor: tc.cardBackgroundAlt
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: tc.screenBackground,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: tc.textSecondary,
    },
    listContent: {
        paddingBottom: 20,
    },
    listHeader: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderLight,
        backgroundColor: tc.cardBackgroundAlt,
        marginTop: hp(1)
    },
    headerCell: {
        width: 120, 
        marginEnd: 5,
    },
    headerText: {
        fontWeight: '700',
        color: tc.textSecondary,
        fontSize: 12,
        textAlign: "left"
    },
    patientCard: {
        backgroundColor: tc.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderLight,
    },
    patientRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
    },
    patientInfo: {
        width: 150,
        marginEnd: 5,
    },
    patientName: {
        fontSize: 14,
        fontWeight: '500',
        color: tc.textPrimary,
    },
    patientId: {
        fontSize: 12,
        color: tc.textMuted,
        marginTop: 4,
    },
    patientDetail: {
        width: 120, 
        marginEnd: 5
    },
    detailValue: {
        fontSize: 12,
        color: tc.textSecondary,
    },
    statusBadge: {
        width: 90,
        paddingVertical: 6,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '500',
    },
    actionButtons: {
        width: 60,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    actionButton: {
        paddingVertical: 10, 
        borderWidth: 1, 
        borderColor: tc.accent, 
        borderRadius: 10, 
        paddingHorizontal: 5,
        backgroundColor: tc.cardBackgroundAlt,
    },
    // Filter Styles
    filtersContainer: {
        backgroundColor: tc.cardBackground,
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: tc.borderLight,
    },
    filtersInner: {
        padding: 15,
    },
    filterRow: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    filterGroup: {
        flex: 1,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textPrimary,
        marginBottom: 8,
    },
    dateRangeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 42,
        backgroundColor: tc.inputBackground,
        marginHorizontal: 2,
    },
    dateText: {
        fontSize: 13,
        color: tc.textSecondary,
    },
    checkboxesSection: {
        marginBottom: 15,
    },
    checkboxRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 8,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: tc.accent,
        borderColor: tc.accent,
    },
    checkboxLabel: {
        fontSize: 13,
        color: tc.textSecondary,
    },
    filterActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 5,
    },
    clearFiltersBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: tc.accent,
        backgroundColor: tc.cardBackgroundAlt,
    },
    clearFiltersBtnText: {
        color: tc.accent,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 5,
    },
    applyFiltersBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 40,
        borderRadius: 8,
        backgroundColor: tc.accent,
    },
    applyFiltersBtnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 5,
    },
    // Calendar Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarModalContent: {
        width: '90%',
        backgroundColor: tc.modalBg,
        borderRadius: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: tc.borderColor,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    calendarCancelText: {
        fontSize: 16,
        color: tc.textSecondary,
    },
    calendarConfirmText: {
        fontSize: 16,
        color: tc.accent,
        fontWeight: '600',
    },
    iosPicker: {
        height: 350,
    },
    paginationWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: tc.cardBackgroundAlt,
        borderTopWidth: 1,
        borderTopColor: tc.borderLight,
        minWidth: wp(100)
    },
    paginationText: {
        fontSize: 14,
        color: tc.textSecondary,
        marginRight: 15,
    },
    paginationArrow: {
        padding: 5,
        marginHorizontal: 5,
    },
    pageNumberBox: {
        width: 32,
        height: 32,
        borderWidth: 1,
        borderColor: tc.accent,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: tc.hoverLayer,
    },
    pageNumberText: {
        color: tc.accent,
        fontSize: 14,
        fontWeight: '500',
    },
    pageSizeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginLeft: 15,
        backgroundColor: tc.cardBackground,
    },
    pageSizeText: {
        fontSize: 14,
        color: tc.textSecondary,
        marginRight: 10,
    },
});

const PatientListScreen = () => {
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);

    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const [patients, setPatients] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const [alertConfig, setAlertConfig] = useState<any>({
        visible: false,
        type: 'success',
        message: '',
    });

    const showAlert = (type: 'success' | 'error' | 'warning', message: string) => {
        setAlertConfig({
            visible: true,
            type,
            message,
        });
    };

    // State for filter inputs
    const [dobStartDate, setDobStartDate] = useState<Date | null>(null);
    const [dobEndDate, setDobEndDate] = useState<Date | null>(null);
    const [gender, setGender] = useState<string | number>('All');
    const [activePicker, setActivePicker] = useState<string | null>(null);

    // State for checkboxes
    const [hasPesel, setHasPesel] = useState(false);
    const [hasDeclaration, setHasDeclaration] = useState(false);
    const [isDeceased, setIsDeceased] = useState(false);
    const [hasDebt, setHasDebt] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [isLongAbsent, setIsLongAbsent] = useState(false);

    const genderOptions = [
        { label: t('patientList.all'), value: 'All' },
        { label: t('patientList.male'), value: 'male' },
        { label: t('patientList.female'), value: 'female' },
        { label: t('patientList.other'), value: 'other' },
    ];

    // Fetch patients from API
    const fetchPatients = async () => {
        setLoading(true);
        const queryParams = {
            page: page,
            limit: limit,
            skip: (page - 1) * limit
        };

        console.log('Initiating GetPatients request with params:', JSON.stringify(queryParams, null, 2));

        try {
            const response = await GetPatients(queryParams) as any;
            console.log('GetPatients Response:', JSON.stringify(response, null, 2));

            if (response) {
                // Determine the correct data source based on common API patterns
                const patientData = Array.isArray(response) 
                    ? response 
                    : (response.data || response.patients || []);
                
                const count = response.total !== undefined 
                    ? response.total 
                    : (Array.isArray(response) ? response.length : (patientData.length));
                
                setPatients(patientData);
                setTotalItems(count);
            } else {
                console.error('Failed to fetch patients: Response was empty');
            }
        } catch (error: any) {
            console.error('Error in fetchPatients:', error);
            // Optionally show error to user via alert
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [page, limit]);

    // Format date for display (YYYY-MM-DD to more readable format)
    const formatDate = (date: any) => {
        if (!date) return t('common.datePlaceholder');
        if (typeof date === 'string') {
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(date).toLocaleDateString('en-GB', options).replace(/\//g, '-');
        }
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
            }
            setActivePicker(null);
        } else if (event.type === 'dismissed') {
            setActivePicker(null);
        }
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

    const handleDeletePatient = async (patient: any) => {
        setShowActionModal(false);
        const patientId = patient._id;
        
        Alert.alert(
            t('patientList.deletePatientTitle'),
            t('patientList.deletePatientConfirm', { name: patient.name || (patient.firstName ? `${patient.firstName} ${patient.lastName}` : t('patientList.patient')) }),
            [
                { text: t('patientList.cancel'), style: "cancel" },
                { 
                    text: t('patientList.delete'), 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            console.log(`Initiating DeletePatient request for ID: ${patientId}`);
                            
                            const response = (await DeletePatient(patientId)) as any;
                            console.log('DeletePatient Response:', JSON.stringify(response, null, 2));
                            
                            if (response) {
                                showAlert('success', response.data?.message || t('patientList.deleteSuccess'));
                                fetchPatients();
                            } else {
                                showAlert('error', t('patientList.deleteError'));
                            }
                        } catch (error: any) {
                            console.error('Error deleting patient:', error);
                            showAlert('error', error.message || t('patientList.deleteErrorGeneral'));
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleMoreOptions = (patientId: string) => {
        console.log(`More options for patient ${patientId}`);
        // Show more options (possibly with an ActionSheet or Modal)
    };

    // Clear all filters
    const clearFilters = () => {
        setDobStartDate(null);
        setDobEndDate(null);
        setGender('All');
        setHasPesel(false);
        setHasDeclaration(false);
        setIsDeceased(false);
        setHasDebt(false);
        setIsActive(true);
        setIsLongAbsent(false);
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

    // Render checkbox
    const renderCheckbox = (isChecked: boolean, onToggle: any, label: string) => (
        <TouchableOpacity
            style={ds.checkboxContainer}
            onPress={() => onToggle(!isChecked)}
        >
            <View style={[ds.checkbox, isChecked && ds.checkboxChecked]}>
                {isChecked && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={ds.checkboxLabel}>{label}</Text>
        </TouchableOpacity>
    );

    // Render status badge with appropriate color
    const renderStatusBadge = (status: string) => {
        let backgroundColor;
        let textColor;

        const normalizedStatus = status?.toLowerCase() || '';

        if (isDark) {
            switch (normalizedStatus) {
                case 'active':
                    backgroundColor = 'rgba(16, 185, 129, 0.15)'; // Deep green transparent
                    textColor = '#10B981';
                    break;
                case 'inactive':
                    backgroundColor = 'rgba(245, 158, 11, 0.15)'; // Darker yellow/orange
                    textColor = '#F59E0B';
                    break;
                case 'deceased':
                    backgroundColor = 'rgba(166, 166, 166, 0.15)'; // Muted gray
                    textColor = '#A6A6A6';
                    break;
                default:
                    backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    textColor = tc.textSecondary;
            }
        } else {
            switch (normalizedStatus) {
                case 'active':
                    backgroundColor = '#DCFCE7';
                    textColor = '#166534';
                    break;
                case 'inactive':
                    backgroundColor = '#FEF9C3';
                    textColor = '#854D0E';
                    break;
                case 'deceased':
                    backgroundColor = '#F1F5F9';
                    textColor = '#475569';
                    break;
                default:
                    backgroundColor = '#F3F4F6';
                    textColor = '#374151';
            }
        }

        return (
            <View style={[ds.statusBadge, { backgroundColor }]}>
                <Text style={[ds.statusText, { color: textColor }]}>
                    {normalizedStatus === 'active' ? t('patientList.active') : 
                     normalizedStatus === 'inactive' ? t('patientList.inactive') : 
                     normalizedStatus === 'deceased' ? t('patientList.deceased') : 
                     status}
                </Text>
            </View>
        );
    };

    // Render patient item
    const renderPatientItem = ({ item }: { item: any }) => (
        <View style={ds.patientCard}>
            <View style={ds.patientRow}>
                <View style={ds.patientInfo}>
                    <Text style={ds.patientName} numberOfLines={1}>
                        {item.name || `${item.firstName} ${item.lastName}`}
                    </Text>
                    <Text style={ds.patientId}>{t('patientList.idLabel')} {item.id || item._id?.substring(0, 8)}</Text>
                </View>
                <View style={ds.patientDetail}>
                    <Text style={ds.detailValue}>{item.pesel || t('common.na')}</Text>
                </View>
                <View style={ds.patientDetail}>
                    <Text style={ds.detailValue}>{formatDate(item.dateOfBirth || item.dob)}</Text>
                </View>
                <View style={ds.patientDetail}>
                    <Text style={ds.detailValue}>{item.referral || t('common.na')}</Text>
                </View>
                <View style={[ds.patientDetail, { width: 100 }]}>
                    {renderStatusBadge(item.status)}
                </View>
                <View style={ds.actionButtons}>
                    <TouchableOpacity
                        style={ds.actionButton}
                        onPress={() => { 
                            setSelectedPatient(item);
                            setShowActionModal(true); 
                        }}
                    >
                        <Ionicons name="ellipsis-vertical" size={18} color={tc.accent} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    // Render header for FlatList
    const renderListHeader = () => (
        <View style={ds.listHeader}>
            <View style={ds.headerCell}>
                <Text style={ds.headerText}>{t('patientList.patient')}</Text>
            </View>
            <View style={ds.headerCell}>
                <Text style={ds.headerText}>{t('patientList.pesel')}</Text>
            </View>
            <View style={ds.headerCell}>
                <Text style={ds.headerText}>{t('patientList.dob')}</Text>
            </View>
            <View style={ds.headerCell}>
                <Text style={ds.headerText}>{t('patientList.referral')}</Text>
            </View>
            <View style={[ds.headerCell, {}]}>
                <Text style={[ds.headerText, {}]}>{t('patientList.status')}</Text>
            </View>
            <View style={ds.headerCell}>
                <Text style={ds.headerText}>{t('patientList.actions')}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={ds.safeArea}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.statusBarBg} />
            <View style={ds.headerWrap}>
                <View style={ds.header}>
                    <Text style={ds.headerTitle}>{t('patientList.patientList')}</Text>
                    <Text style={ds.headerSubtitle}>{t('patientList.manageRecords')}</Text>
                </View>

                {/* Back Button */}
                <TouchableOpacity
                    style={ds.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={20} color={tc.accent} />
                </TouchableOpacity>
            </View>
            <View style={ds.headerButtons}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ 
                        flexDirection: 'row', 
                        alignItems: 'center',
                        justifyContent: "flex-end",
                        paddingRight: 15
                    }}
                >
                    <TouchableOpacity
                        style={ds.secondaryButton}
                        onPress={handleExport}
                    >
                        <Feather name="download" size={18} color={tc.accent} />
                        <Text style={ds.buttonText}>{t('patientList.export')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={ds.secondaryButton}
                        onPress={handlePrint}
                    >
                        <Feather name="printer" size={18} color={tc.accent} />
                        <Text style={ds.buttonText}>{t('patientList.print')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleFilterToggle}
                    >
                        <LinearGradient
                            colors={[tc.accentGradientStart, tc.accentGradientEnd]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                marginLeft: 10, borderRadius: 8, flexDirection: "row", height: hp(5),
                                alignItems: "center",
                                paddingHorizontal: 15,
                                justifyContent: "center", minWidth: wp(25)
                            }}>
                            <Feather name="filter" size={20} color="white" />
                            <Text style={ds.filtersButtonText}>{t('patientList.filters')}</Text>
                            <Ionicons 
                                name={showFilters ? "chevron-up" : "chevron-down"} 
                                size={16} 
                                color="white" 
                                style={{marginLeft: 5}} 
                            />
                        </LinearGradient>

                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Filter Section */}
            {showFilters && (
                <View style={ds.filtersContainer}>
                    <View style={ds.filtersInner}>
                        <View style={ds.filterRow}>
                            <View style={[ds.filterGroup, { flex: 1.5 }]}>
                                <Text style={ds.filterLabel}>{t('patientList.dateOfBirth')}</Text>
                                <View style={ds.dateRangeContainer}>
                                    <TouchableOpacity
                                        style={ds.dateInput}
                                        onPress={() => setActivePicker('dobStart')}
                                    >
                                        <Text style={ds.dateText}>{formatDate(dobStartDate)}</Text>
                                        <MaterialCommunityIcons name="calendar-blank" size={18} color={tc.textMuted} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={ds.dateInput}
                                        onPress={() => setActivePicker('dobEnd')}
                                    >
                                        <Text style={ds.dateText}>{formatDate(dobEndDate)}</Text>
                                        <MaterialCommunityIcons name="calendar-blank" size={18} color={tc.textMuted} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={[ds.filterGroup, { flex: 1, marginLeft: 15 }]}>
                                <Text style={ds.filterLabel}>{t('patientList.gender')}</Text>
                                <CustomDropdown
                                    placeholder={t('patientList.gender')}
                                    options={genderOptions}
                                    value={gender}
                                    onChange={setGender}
                                />
                            </View>
                        </View>

                        <View style={ds.checkboxesSection}>
                            <View style={ds.checkboxRow}>
                                {renderCheckbox(hasPesel, setHasPesel, t('patientList.hasPesel'))}
                                {renderCheckbox(hasDeclaration, setHasDeclaration, t('patientList.hasDeclaration'))}
                                {renderCheckbox(isDeceased, setIsDeceased, t('patientList.deceased'))}
                                {renderCheckbox(hasDebt, setHasDebt, t('patientList.hasDebt'))}
                                {renderCheckbox(isActive, setIsActive, t('patientList.active'))}
                                {renderCheckbox(isLongAbsent, setIsLongAbsent, t('patientList.longAbsent'))}
                            </View>
                        </View>

                        <View style={ds.filterActions}>
                            <TouchableOpacity style={ds.clearFiltersBtn} onPress={clearFilters}>
                                <Ionicons name="close-outline" size={20} color={tc.accent} />
                                <Text style={ds.clearFiltersBtnText}>{t('patientList.clearFilters')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={ds.applyFiltersBtn} onPress={() => setShowFilters(false)}>
                                <Ionicons name="funnel-outline" size={18} color="white" />
                                <Text style={ds.applyFiltersBtnText}>{t('patientList.applyFilters')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Patient List */}
            {loading ? (
                <View style={ds.loadingContainer}>
                    <ActivityIndicator size="large" color={tc.accent} />
                    <Text style={ds.loadingText}>{t('patientList.loadingPatients')}</Text>
                </View>
            ) : (
                <ScrollView horizontal>
                    <View>
                        <FlatList
                            data={patients}
                            keyExtractor={(item, index) => item.id || item._id || index.toString()}
                            renderItem={renderPatientItem}
                            ListHeaderComponent={renderListHeader}
                            contentContainerStyle={ds.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                        {/* Pagination component */}
                        <View style={ds.paginationWrapper}>
                            <Text style={ds.paginationText}>
                                {t('patientList.itemsRange', {
                                    start: totalItems > 0 ? ((page - 1) * limit) + 1 : 0,
                                    end: Math.min(page * limit, totalItems),
                                    total: totalItems
                                })}
                            </Text>

                            <TouchableOpacity
                                style={ds.paginationArrow}
                                onPress={() => page > 1 && setPage(page - 1)}
                                disabled={page === 1}
                            >
                                <Feather name="chevron-left" size={20} color={page === 1 ? tc.textMuted : tc.accent} />
                            </TouchableOpacity>

                            <View style={ds.pageNumberBox}>
                                <Text style={ds.pageNumberText}>{page}</Text>
                            </View>

                            <TouchableOpacity
                                style={ds.paginationArrow}
                                onPress={() => (page * limit) < totalItems && setPage(page + 1)}
                                disabled={(page * limit) >= totalItems}
                            >
                                <Feather name="chevron-right" size={20} color={(page * limit) >= totalItems ? tc.textMuted : tc.accent} />
                            </TouchableOpacity>

                            <TouchableOpacity style={ds.pageSizeSelector}>
                                <Text style={ds.pageSizeText}>{t('patientList.itemsPerPage', { count: limit })}</Text>
                                <Feather name="chevron-down" size={16} color={tc.textMuted} />
                            </TouchableOpacity>
                        </View>
                    </View>
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
                onDelete={() => {
                    if (selectedPatient) handleDeletePatient(selectedPatient);
                }}
                onPatientProfile={() => {
                    setShowActionModal(false);
                    navigation.navigate('PatientProfile', { patientData: selectedPatient });
                }}
                onAddNote={() => { }}
            />
            <PatientDetailsModal
                visible={showPatientDetailsModal}
                onClose={() => { setShowPatientDetailsModal(false) }}
                patientData={selectedPatient || {
                    id: 'P001',
                    name: 'Jan Kowalski',
                    pesel: '80010112345',
                    dateOfBirth: '1980-01-01',
                    lastVisit: '2024-03-01',
                    status: 'Active'
                }}
            />
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
                            style={ds.modalOverlay} 
                            activeOpacity={1} 
                            onPress={() => setActivePicker(null)}
                        >
                            <View style={ds.calendarModalContent}>
                                <View style={ds.calendarHeader}>
                                    <TouchableOpacity onPress={() => setActivePicker(null)}>
                                        <Text style={ds.calendarCancelText}>{t('patientList.cancel')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setActivePicker(null)}>
                                        <Text style={ds.calendarConfirmText}>{t('patientList.done')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    value={
                                        activePicker === 'dobStart' ? dobStartDate || new Date() :
                                        dobEndDate || new Date()
                                    }
                                    mode="date"
                                    display="inline"
                                    onChange={onDateChange}
                                    style={ds.iosPicker}
                                    textColor={tc.textPrimary}
                                />
                            </View>
                        </TouchableOpacity>
                    </Modal>
                ) : (
                    <DateTimePicker
                        value={
                            activePicker === 'dobStart' ? dobStartDate || new Date() :
                            dobEndDate || new Date()
                        }
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )
            )}

            <CustomAlert
                visible={alertConfig.visible}
                type={alertConfig.type}
                message={alertConfig.message}
                onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
            />
        </SafeAreaView >
    );
};


export default PatientListScreen;