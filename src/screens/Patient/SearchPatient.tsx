import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Platform,
    Modal,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

import DateTimePicker from '@react-native-community/datetimepicker';

import CustomDropdown from '../../component/customDropDown';
import PrimaryButton from '../../component/button';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { GetPatients } from '../../Services/Patient.Service';

const getPatientName = (patient: any) =>
    patient?.name || `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim();

const parsePatientDate = (value: any): Date | null => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

const SearchPatientScreen = () => {
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const { t } = useTranslation();
    const navigation = useNavigation<any>();

    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showFilters, setShowFilters] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [dobStartDate, setDobStartDate] = useState<Date | null>(null);
    const [dobEndDate, setDobEndDate] = useState<Date | null>(null);
    const [lastVisitStartDate, setLastVisitStartDate] = useState<Date | null>(null);
    const [lastVisitEndDate, setLastVisitEndDate] = useState<Date | null>(null);
    const [nextVisitStartDate, setNextVisitStartDate] = useState<Date | null>(null);
    const [nextVisitEndDate, setNextVisitEndDate] = useState<Date | null>(null);
    const [gender, setGender] = useState<string | number>('All');
    const [activePicker, setActivePicker] = useState<string | null>(null);
    const [hasPesel, setHasPesel] = useState(false);
    const [hasDeclaration, setHasDeclaration] = useState(false);
    const [isDeceased, setIsDeceased] = useState(false);
    const [hasDebt, setHasDebt] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isLongAbsent, setIsLongAbsent] = useState(false);

    const genderOptions = [
        { label: t('patientSearch.filters.gender.all'), value: 'All' },
        { label: t('patientSearch.filters.gender.male'), value: 'male' },
        { label: t('patientSearch.filters.gender.female'), value: 'female' },
        { label: t('patientSearch.filters.gender.other'), value: 'other' },
    ];

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            try {
                const response = await GetPatients({ page: 1, limit: 500, skip: 0 }) as any;
                const patientData = Array.isArray(response)
                    ? response
                    : (response?.data || response?.patients || []);
                setPatients(Array.isArray(patientData) ? patientData : []);
            } catch (error) {
                console.error('SearchPatient: failed to fetch patients', error);
                setPatients([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const formatDate = (date: any) => {
        if (!date) return t('patientSearch.filters.placeholders.dob') || 'dd/mm/yyyy';
        const parsed = parsePatientDate(date);
        if (!parsed) return t('patientSearch.filters.placeholders.dob') || 'dd/mm/yyyy';
        const day = parsed.getDate().toString().padStart(2, '0');
        const month = (parsed.getMonth() + 1).toString().padStart(2, '0');
        const year = parsed.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatDisplayDate = (date: any) => {
        const parsed = parsePatientDate(date);
        if (!parsed) return t('common.na');
        return formatDate(parsed);
    };

    const isWithinRange = (value: any, start: Date | null, end: Date | null) => {
        if (!start && !end) return true;
        const date = parsePatientDate(value);
        if (!date) return false;
        if (start && date < start) return false;
        if (end) {
            const endOfDay = new Date(end);
            endOfDay.setHours(23, 59, 59, 999);
            if (date > endOfDay) return false;
        }
        return true;
    };

    const filteredPatients = useMemo(() => {
        const query = searchText.trim().toLowerCase();

        return patients.filter((patient) => {
            if (query) {
                const name = getPatientName(patient).toLowerCase();
                const pesel = (patient.pesel || '').toLowerCase();
                const cardNumber = String(patient.cardNumber || patient.slug || patient.id || patient._id || '').toLowerCase();
                if (!name.includes(query) && !pesel.includes(query) && !cardNumber.includes(query)) {
                    return false;
                }
            }

            if (gender !== 'All' && (patient.gender || '').toLowerCase() !== String(gender).toLowerCase()) {
                return false;
            }

            if (!isWithinRange(patient.dateOfBirth || patient.dob, dobStartDate, dobEndDate)) {
                return false;
            }

            if (!isWithinRange(patient.lastVisit, lastVisitStartDate, lastVisitEndDate)) {
                return false;
            }

            if (!isWithinRange(patient.nextVisit, nextVisitStartDate, nextVisitEndDate)) {
                return false;
            }

            if (hasPesel && !patient.pesel) return false;
            if (hasDeclaration && !patient.hasDeclaration) return false;
            if (isDeceased && (patient.status || '').toLowerCase() !== 'deceased') return false;
            if (hasDebt && !patient.hasDebt) return false;
            if (isActive && (patient.status || '').toLowerCase() !== 'active') return false;
            if (isLongAbsent && !patient.longAbsent) return false;

            return true;
        });
    }, [
        patients,
        searchText,
        gender,
        dobStartDate,
        dobEndDate,
        lastVisitStartDate,
        lastVisitEndDate,
        nextVisitStartDate,
        nextVisitEndDate,
        hasPesel,
        hasDeclaration,
        isDeceased,
        hasDebt,
        isActive,
        isLongAbsent,
    ]);

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

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

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
        setIsActive(false);
        setIsLongAbsent(false);
    };

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

    const renderPatientItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={ds.patientItem}
            onPress={() => navigation.navigate('PatientProfile', { patientData: item })}
        >
            <View style={ds.patientItemContent}>
                <Text style={ds.patientName} numberOfLines={1}>{getPatientName(item)}</Text>
                <Text style={ds.patientMeta}>
                    {t('patientList.pesel')}: {item.pesel || t('common.na')}
                </Text>
                <Text style={ds.patientMeta}>
                    {t('patientList.dob')}: {formatDisplayDate(item.dateOfBirth || item.dob)}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={tc.textMuted} />
        </TouchableOpacity>
    );

    const renderSearchHeader = () => (
        <View style={ds.searchContainer}>
            <View style={ds.searchInputContainer}>
                <Ionicons name="search" size={20} color={tc.textMuted} style={ds.searchIcon} />
                <TextInput
                    style={ds.searchInput}
                    placeholder={t('patientSearch.placeholders.search')}
                    placeholderTextColor={tc.textMuted}
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            <TouchableOpacity
                style={ds.filtersButton}
                onPress={toggleFilters}
            >
                <Ionicons name="options-outline" size={20} color={tc.accent} />
                <Text style={ds.filtersButtonText}>{t('patientSearch.filtersLabel')}</Text>
                <Ionicons
                    name={showFilters ? "close" : "chevron-down"}
                    size={16}
                    color={tc.accent}
                />
            </TouchableOpacity>

            {showFilters && (
                <View style={ds.filtersContainer}>
                    <Text style={ds.filterSectionTitle}>{t('patientSearch.filters.dob')}</Text>
                    <View style={ds.dateRangeContainer}>
                        <TouchableOpacity
                            style={ds.dateInput}
                            onPress={() => setActivePicker('dobStart')}
                        >
                            <Text style={ds.dateText}>{formatDate(dobStartDate)}</Text>
                            <MaterialCommunityIcons name="calendar-blank" size={18} color={tc.accent} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={ds.dateInput}
                            onPress={() => setActivePicker('dobEnd')}
                        >
                            <Text style={ds.dateText}>{formatDate(dobEndDate)}</Text>
                            <MaterialCommunityIcons name="calendar-blank" size={18} color={tc.accent} />
                        </TouchableOpacity>
                    </View>

                    <Text style={ds.filterSectionTitle}>{t('patientSearch.filters.gender.label')}</Text>
                    <CustomDropdown
                        placeholder={t('patientSearch.filters.placeholders.gender')}
                        options={genderOptions}
                        value={gender}
                        onChange={setGender}
                        icon={undefined}
                    />

                    <Text style={ds.filterSectionTitle}>{t('patientSearch.filters.lastVisit')}</Text>
                    <View style={ds.dateRangeContainer}>
                        <TouchableOpacity
                            style={ds.dateInput}
                            onPress={() => setActivePicker('lastVisitStart')}
                        >
                            <Text style={ds.dateText}>{formatDate(lastVisitStartDate)}</Text>
                            <MaterialCommunityIcons name="calendar-blank" size={18} color={tc.accent} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={ds.dateInput}
                            onPress={() => setActivePicker('lastVisitEnd')}
                        >
                            <Text style={ds.dateText}>{formatDate(lastVisitEndDate)}</Text>
                            <MaterialCommunityIcons name="calendar-blank" size={18} color={tc.accent} />
                        </TouchableOpacity>
                    </View>

                    <Text style={ds.filterSectionTitle}>{t('patientSearch.filters.nextVisit')}</Text>
                    <View style={ds.dateRangeContainer}>
                        <TouchableOpacity
                            style={ds.dateInput}
                            onPress={() => setActivePicker('nextVisitStart')}
                        >
                            <Text style={ds.dateText}>{formatDate(nextVisitStartDate)}</Text>
                            <MaterialCommunityIcons name="calendar-blank" size={18} color={tc.accent} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={ds.dateInput}
                            onPress={() => setActivePicker('nextVisitEnd')}
                        >
                            <Text style={ds.dateText}>{formatDate(nextVisitEndDate)}</Text>
                            <MaterialCommunityIcons name="calendar-blank" size={18} color={tc.accent} />
                        </TouchableOpacity>
                    </View>

                    <View style={ds.checkboxesContainer}>
                        <View style={ds.checkboxRow}>
                            {renderCheckbox(hasPesel, setHasPesel, t('patientSearch.filters.hasPesel'))}
                            {renderCheckbox(hasDeclaration, setHasDeclaration, t('patientSearch.filters.hasDeclaration'))}
                        </View>

                        <View style={ds.checkboxRow}>
                            {renderCheckbox(isDeceased, setIsDeceased, t('patientSearch.filters.isDeceased'))}
                            {renderCheckbox(hasDebt, setHasDebt, t('patientSearch.filters.hasDebt'))}
                        </View>

                        <View style={ds.checkboxRow}>
                            {renderCheckbox(isActive, setIsActive, t('patientSearch.filters.isActive'))}
                            {renderCheckbox(isLongAbsent, setIsLongAbsent, t('patientSearch.filters.isLongAbsent'))}
                        </View>
                    </View>

                    <View style={ds.filterButtonsContainer}>
                        <PrimaryButton
                            label={t('patientSearch.buttons.clearFilters')}
                            onPress={clearFilters}
                            filled={false}
                            icon={<Ionicons name="close" size={16} color={tc.accent} />}
                            style={{ width: '48%' }}
                            loading={false}
                            disabled={false}
                        />
                        <PrimaryButton
                            onPress={() => setShowFilters(false)}
                            label={t('patientSearch.buttons.applyFilters')}
                            filled={true}
                            icon={<Ionicons name="funnel-outline" size={16} color="white" />}
                            style={{ width: '48%' }}
                            loading={false}
                            disabled={false}
                        />
                    </View>
                </View>
            )}
        </View>
    );

    const renderEmptyState = () => {
        if (loading) {
            return (
                <View style={ds.resultsMessageContainer}>
                    <ActivityIndicator size="large" color={tc.accent} />
                    <Text style={ds.resultsMessage}>{t('patientSearch.loading')}</Text>
                </View>
            );
        }

        return (
            <View style={ds.resultsMessageContainer}>
                <Text style={ds.resultsMessage}>{t('patientSearch.noResults')}</Text>
            </View>
        );
    };

    return (
        <View style={ds.safeArea}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={tc.statusBarBg} />
            <View style={ds.container}>
                <View style={{
                    width: "100%", backgroundColor: tc.headerBg,
                    flexDirection: "row", justifyContent: "space-around", paddingTop: hp(7)
                }}>
                    <View style={ds.header}>
                        <Text style={ds.headerTitle}>{t('patientSearch.title')}</Text>
                        <Text style={ds.headerSubtitle}>{t('patientSearch.subtitle')}</Text>
                    </View>

                    <TouchableOpacity
                        style={ds.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={20} color={tc.accent} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={loading ? [] : filteredPatients}
                    keyExtractor={(item, index) => item.id || item._id || index.toString()}
                    renderItem={renderPatientItem}
                    ListHeaderComponent={renderSearchHeader}
                    ListEmptyComponent={renderEmptyState}
                    contentContainerStyle={ds.listContent}
                    showsVerticalScrollIndicator={false}
                />

                <TouchableOpacity style={ds.helpButtonFloat}>
                    <Text style={ds.helpText}>?</Text>
                </TouchableOpacity>

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
                                            <Text style={ds.calendarCancelText}>{t('common.cancel')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setActivePicker(null)}>
                                            <Text style={ds.calendarConfirmText}>{t('common.done')}</Text>
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
                                        style={ds.iosPicker}
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

export default SearchPatientScreen;

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
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
    listContent: {
        paddingBottom: 90,
    },
    searchContainer: {
        backgroundColor: tc.cardBackground,
        borderRadius: 10,
        margin: 15,
        padding: 15,
        shadowColor: tc.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: tc.shadowOpacity ?? 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderLight,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: tc.inputBackground,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 45,
        fontSize: 16,
        color: tc.textPrimary,
    },
    filtersButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: tc.accent,
        borderRadius: 5,
        padding: 12,
        marginBottom: 15,
        backgroundColor: tc.cardBackgroundAlt,
    },
    filtersButtonText: {
        color: tc.accent,
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
        color: tc.textPrimary,
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
        borderColor: tc.borderColor,
        borderRadius: 5,
        padding: 12,
        backgroundColor: tc.inputBackground,
        width: '48%',
    },
    dateText: {
        color: tc.textSecondary,
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
        borderColor: tc.borderColor,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: tc.accent,
        borderColor: tc.accent,
    },
    checkboxLabel: {
        fontSize: 14,
        color: tc.textSecondary,
    },
    filterButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    patientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tc.cardBackground,
        borderRadius: 10,
        marginHorizontal: 15,
        marginBottom: 10,
        padding: 15,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderLight,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: tc.shadowOpacity ?? 0.08,
        shadowRadius: 2,
        elevation: 2,
    },
    patientItemContent: {
        flex: 1,
        marginRight: 10,
    },
    patientName: {
        fontSize: 16,
        fontWeight: '600',
        color: tc.textPrimary,
        marginBottom: 4,
    },
    patientMeta: {
        fontSize: 13,
        color: tc.textSecondary,
        marginTop: 2,
    },
    resultsMessageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    resultsMessage: {
        color: tc.textSecondary,
        fontSize: 16,
        marginTop: 12,
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
        shadowColor: tc.shadow,
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarModalContent: {
        backgroundColor: tc.modalBg,
        borderRadius: 20,
        padding: 10,
        width: '90%',
        maxWidth: 400,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderLight,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
        marginBottom: 10,
    },
    calendarCancelText: {
        fontSize: 16,
        color: tc.textSecondary,
        fontWeight: '500',
    },
    calendarConfirmText: {
        fontSize: 16,
        color: tc.accent,
        fontWeight: '600',
    },
    iosPicker: {
        height: 350,
        width: '100%',
    },
});
