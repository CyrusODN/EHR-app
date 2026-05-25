import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { UpdateVisit, GetVisitDetails } from '../../Services/Visit.Service';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';
import PrescriptionSection from './prescriptions/PrescriptionSection';
import { useICD10Search } from '../../hooks/useICD10Search';
import type { ICD10SearchResult } from '../../hooks/useICD10Search';
import type { Prescription, SickLeave, SickLeaveEmployer } from '../../types/visit';

interface Referral {
    id: number;
    specialization: string;
    urgency: string;
    reason: string;
    notes: string;
}

const LITERAL_CODE_OPTIONS = ['', 'A', 'B', 'C', 'D'];

const MOCK_EMPLOYERS: SickLeaveEmployer[] = [
    { id: '1', name: 'Sp Zoz Msw W Gdańsku', nip: '5832580921', hasPue: true },
    { id: '2', name: 'Jbs Klinika Sp. Z O.O.', nip: '9571154646', hasPue: true },
];

const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

const toISODateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const createEmptySickLeave = (): SickLeave => ({
    startDate: toISODateString(new Date()),
    endDate: toISODateString(new Date()),
    reason: '',
    recommendations: '',
    icdCode: '',
    statisticalNumber: '',
    literalCodes: ['', '', '', ''],
    isHospitalization: false,
    hospitalizationStart: '',
    hospitalizationEnd: '',
    employers: [],
});

interface VisitDocumentsProps {
    onNext: () => void;
    onBack: () => void;
    visitId?: string;
    visitData?: any;
    onUpdate?: (data: any) => void;
}

const VisitDocuments = ({ onNext, onBack, visitId, visitData, onUpdate }: VisitDocumentsProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const { searchQuery: icdSearchQuery, setSearchQuery: setIcdSearchQuery, clearSearch: clearIcdSearch, searchResults: icdResults, isSearching: isIcdSearching } = useICD10Search();

    const [expandedSections, setExpandedSections] = useState({
        prescriptions: true,
        sickLeave: true,
        referrals: true,
    });
    const [showSickLeaveForm, setShowSickLeaveForm] = useState(false);
    const [showPayerSearch, setShowPayerSearch] = useState(false);
    const [sickLeaveData, setSickLeaveData] = useState<SickLeave>(createEmptySickLeave());
    const [showIcdResults, setShowIcdResults] = useState(false);
    const [employerSearchQuery, setEmployerSearchQuery] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const [activeDatePicker, setActiveDatePicker] = useState<string | null>(null);
    const [activeCodeDropdown, setActiveCodeDropdown] = useState<number | null>(null);

    const [referrals, setReferrals] = useState<Referral[]>(visitData?.patient?.referrals || []);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>(visitData?.prescriptions || []);

    const debounceTimeoutRef = useRef<any>(null);
    const pendingUpdatesRef = useRef<any>({});

    const handleSync = useCallback(async () => {
        if (!visitId) return;

        const updates = { ...pendingUpdatesRef.current };
        pendingUpdatesRef.current = {};

        const payload = {
            ...visitData,
            ...updates,
            visitId, id: visitId, _id: visitId
        };

        // Handle nested merges if needed (e.g. for patient.referrals)
        if (updates.patient && updates.patient.referrals) {
            payload.patient = {
                ...(visitData?.patient || {}),
                ...updates.patient
            };
        }

        try {
            await UpdateVisit(payload);
            const detailsResult = await GetVisitDetails(visitId);
            const fullData = detailsResult?.data || detailsResult;
            if (fullData && onUpdate) {
                onUpdate(fullData);
            }
        } catch (error) {
            console.error("Sync error:", error);
        }
    }, [visitId, visitData, onUpdate]);

    const debouncedSync = (updatedFields: any) => {
        const accumulate = (target: any, source: any) => {
            Object.keys(source).forEach(key => {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    target[key] = target[key] || {};
                    accumulate(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            });
        };
        accumulate(pendingUpdatesRef.current, updatedFields);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            handleSync();
        }, 700);
    };

    useEffect(() => {
        if (visitData?.sickLeave) {
            setSickLeaveData(visitData.sickLeave);
            setShowSickLeaveForm(true);
        }
        if (visitData?.patient?.referrals) {
            setReferrals(visitData.patient.referrals);
        }
        if (visitData?.prescriptions) {
            setPrescriptions(visitData.prescriptions);
        }
    }, [visitData]);

    const handlePrescriptionsUpdate = (updated: Prescription[]) => {
        setPrescriptions(updated);
        debouncedSync({ prescriptions: updated });
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const updateSickLeaveField = <K extends keyof SickLeave>(field: K, value: SickLeave[K]) => {
        setSickLeaveData(prev => ({ ...prev, [field]: value }));
        if (validationErrors[field]) {
            setValidationErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
        }
    };

    const handleDateChange = (field: 'startDate' | 'endDate' | 'hospitalizationStart' | 'hospitalizationEnd', event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setActiveDatePicker(null);
        }
        if (event.type === 'dismissed') return;
        if (selectedDate) {
            updateSickLeaveField(field, toISODateString(selectedDate));
        }
    };

    const handleIcdSearch = (query: string) => {
        setIcdSearchQuery(query);
        setShowIcdResults(query.length >= 2);
    };

    const handleSelectIcd = (result: ICD10SearchResult) => {
        const code = (result.ICD10Code || result.ICD11CODE || '') as string;
        const title = (result.ICD10Title || result.ICD11Title || '') as string;
        setSickLeaveData(prev => ({
            ...prev,
            icdCode: code,
            statisticalNumber: `${code} - ${title}`,
        }));
        clearIcdSearch();
        setShowIcdResults(false);
        if (validationErrors.icdCode) {
            setValidationErrors(prev => { const n = { ...prev }; delete n.icdCode; return n; });
        }
    };

    const handleLiteralCodeChange = (index: number, value: string) => {
        const newCodes = [...sickLeaveData.literalCodes];
        newCodes[index] = value;
        updateSickLeaveField('literalCodes', newCodes);
        setActiveCodeDropdown(null);
    };

    const handleAddEmployer = (employer: SickLeaveEmployer) => {
        if (sickLeaveData.employers?.some(e => e.id === employer.id)) return;
        const updated = [...(sickLeaveData.employers || []), employer];
        updateSickLeaveField('employers', updated);
        setShowPayerSearch(false);
        setEmployerSearchQuery('');
    };

    const handleRemoveEmployer = (employerId: string) => {
        const updated = (sickLeaveData.employers || []).filter(e => e.id !== employerId);
        updateSickLeaveField('employers', updated);
    };

    const filteredEmployers = MOCK_EMPLOYERS.filter(emp => {
        if (!employerSearchQuery) return false;
        const q = employerSearchQuery.toLowerCase();
        return emp.name.toLowerCase().includes(q) || emp.nip.includes(employerSearchQuery);
    });

    const validateSickLeave = (): boolean => {
        const errors: Record<string, string> = {};
        if (!sickLeaveData.startDate) errors.startDate = t('visit.documents.sickLeave.validation.start_date_required');
        if (!sickLeaveData.endDate) errors.endDate = t('visit.documents.sickLeave.validation.end_date_required');
        if (sickLeaveData.startDate && sickLeaveData.endDate && sickLeaveData.endDate < sickLeaveData.startDate) {
            errors.endDate = t('visit.documents.sickLeave.validation.end_before_start');
        }
        if (!sickLeaveData.icdCode) errors.icdCode = t('visit.documents.sickLeave.validation.icd_required');
        if (!sickLeaveData.employers || sickLeaveData.employers.length === 0) {
            errors.employers = t('visit.documents.sickLeave.validation.employer_required');
        }
        if (sickLeaveData.isHospitalization) {
            if (!sickLeaveData.hospitalizationStart || !sickLeaveData.hospitalizationEnd) {
                errors.hospitalization = t('visit.documents.sickLeave.validation.hospital_dates_required');
            } else if (sickLeaveData.hospitalizationEnd < sickLeaveData.hospitalizationStart) {
                errors.hospitalization = t('visit.documents.sickLeave.validation.hospital_end_before_start');
            }
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitSickLeave = () => {
        if (!validateSickLeave()) return;
        const submittedData: SickLeave = { ...sickLeaveData, status: 'draft' };
        debouncedSync({ sickLeave: submittedData });
        setShowSickLeaveForm(false);
    };

    const handleRemoveSickLeave = () => {
        setSickLeaveData(createEmptySickLeave());
        clearIcdSearch();
        setShowIcdResults(false);
        setEmployerSearchQuery('');
        setShowPayerSearch(false);
        setValidationErrors({});
        setShowSickLeaveForm(false);
        debouncedSync({ sickLeave: null });
    };

    const addReferral = () => {
        const newReferral: Referral = {
            id: Date.now(),
            specialization: '',
            urgency: 'Normal',
            reason: '',
            notes: '',
        };
        const newRefs = [...referrals, newReferral];
        setReferrals(newRefs);
        debouncedSync({ patient: { referrals: newRefs } });
    };

    const removeReferral = (id: number) => {
        const newRefs = referrals.filter(ref => ref.id !== id);
        setReferrals(newRefs);
        debouncedSync({ patient: { referrals: newRefs } });
    };

    return (
        <ScrollView style={ds.container} showsVerticalScrollIndicator={false}>
            {/* Prescriptions Section */}
            <View style={ds.card}>
                <TouchableOpacity 
                    style={ds.cardHeader} 
                    onPress={() => toggleSection('prescriptions')}
                    activeOpacity={0.7}
                >
                    <Text style={ds.cardTitle}>{t('visit.documents.prescriptions.title')}</Text>
                    <Feather 
                        name={expandedSections.prescriptions ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color={tc.textPrimary} 
                    />
                </TouchableOpacity>
                
                {expandedSections.prescriptions && (
                    <View style={ds.cardContent}>
                        <PrescriptionSection
                            prescriptions={prescriptions}
                            onUpdate={handlePrescriptionsUpdate}
                        />
                    </View>
                )}
            </View>

            {/* Sick Leave Section */}
            <View style={ds.card}>
                <TouchableOpacity 
                    style={ds.cardHeader} 
                    onPress={() => toggleSection('sickLeave')}
                    activeOpacity={0.7}
                >
                    <Text style={ds.cardTitle}>{t('visit.documents.sickLeave.title')}</Text>
                    <Feather 
                        name={expandedSections.sickLeave ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color={tc.textPrimary} 
                    />
                </TouchableOpacity>
                
                {expandedSections.sickLeave && (
                    <View style={showSickLeaveForm ? ds.cardContent : ds.cardContentRow}>
                        {!showSickLeaveForm ? (
                            <>
                                <Text style={ds.rowLabelText}>{t('visit.documents.sickLeave.ezla')}</Text>
                                <TouchableOpacity onPress={() => setShowSickLeaveForm(true)}>
                                    <LinearGradient
                                        colors={['#58A7B3', '#8ED1CC']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={ds.smallAddButton}
                                    >
                                        <Feather name="plus" size={18} color="#fff" />
                                        <Text style={ds.smallAddButtonText}>{t('visit.documents.sickLeave.new')}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={ds.sickLeaveForm}>
                                <View style={ds.formSectionHeader}>
                                    <Text style={ds.formMainTitle}>{t('visit.documents.sickLeave.ezla')}</Text>
                                    <TouchableOpacity onPress={handleRemoveSickLeave}>
                                        <View style={ds.removeButton}>
                                            <Feather name="x" size={18} color="#EF4444" />
                                            <Text style={ds.removeButtonText}>{t('visit.documents.sickLeave.remove')}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <View style={ds.patientInfoBox}>
                                    <Feather name="info" size={18} color="#3B82F6" style={ds.infoIcon} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={ds.patientInfoTitle}>{t('visit.documents.sickLeave.patient_info')}</Text>
                                        <Text style={ds.patientInfoText}>
                                            {t('visit.documents.sickLeave.patient_info_desc')}
                                        </Text>
                                    </View>
                                </View>

                                {/* Sick Leave Period with Date Pickers */}
                                <View style={ds.formGroup}>
                                    <Text style={ds.sectionHeading}>{t('visit.documents.sickLeave.period')}</Text>
                                    <View style={ds.dateRow}>
                                        <View style={ds.dateInputWrapper}>
                                            <Text style={ds.inputLabel}>{t('visit.documents.sickLeave.from')}</Text>
                                            <TouchableOpacity
                                                style={[ds.dateInputContainer, validationErrors.startDate && ds.inputError]}
                                                onPress={() => setActiveDatePicker('startDate')}
                                                activeOpacity={0.7}
                                            >
                                                <Feather name="calendar" size={18} color={tc.textMuted} />
                                                <Text style={ds.dateInputText}>
                                                    {formatDisplayDate(sickLeaveData.startDate)}
                                                </Text>
                                                <Feather name="chevron-down" size={16} color={tc.textPrimary} />
                                            </TouchableOpacity>
                                            {validationErrors.startDate && (
                                                <Text style={ds.errorText}>{validationErrors.startDate}</Text>
                                            )}
                                        </View>
                                        <View style={ds.dateInputWrapper}>
                                            <Text style={ds.inputLabel}>{t('visit.documents.sickLeave.to')}</Text>
                                            <TouchableOpacity
                                                style={[ds.dateInputContainer, validationErrors.endDate && ds.inputError]}
                                                onPress={() => setActiveDatePicker('endDate')}
                                                activeOpacity={0.7}
                                            >
                                                <Feather name="calendar" size={18} color={tc.textMuted} />
                                                <Text style={ds.dateInputText}>
                                                    {formatDisplayDate(sickLeaveData.endDate)}
                                                </Text>
                                                <Feather name="chevron-down" size={16} color={tc.textPrimary} />
                                            </TouchableOpacity>
                                            {validationErrors.endDate && (
                                                <Text style={ds.errorText}>{validationErrors.endDate}</Text>
                                            )}
                                        </View>
                                    </View>
                                    {(activeDatePicker === 'startDate' || activeDatePicker === 'endDate') && (
                                        <View style={ds.datePickerContainer}>
                                            <DateTimePicker
                                                value={new Date(activeDatePicker === 'startDate' ? sickLeaveData.startDate : sickLeaveData.endDate)}
                                                mode="date"
                                                display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                                                onChange={(event, date) => handleDateChange(activeDatePicker as 'startDate' | 'endDate', event, date)}
                                                themeVariant={isDark ? 'dark' : 'light'}
                                            />
                                            {Platform.OS === 'ios' && (
                                                <TouchableOpacity
                                                    style={ds.datePickerDoneButton}
                                                    onPress={() => setActiveDatePicker(null)}
                                                >
                                                    <Text style={ds.datePickerDoneText}>{t('common.done', 'Done')}</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )}
                                </View>

                                {/* Hospitalization Toggle */}
                                <TouchableOpacity 
                                    style={ds.checkboxRow} 
                                    onPress={() => updateSickLeaveField('isHospitalization', !sickLeaveData.isHospitalization)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[ds.checkbox, sickLeaveData.isHospitalization && ds.checkboxChecked]}>
                                        {sickLeaveData.isHospitalization && <Feather name="check" size={14} color="#fff" />}
                                    </View>
                                    <Text style={ds.checkboxLabel}>{t('visit.documents.sickLeave.hospital')}</Text>
                                </TouchableOpacity>

                                {/* Hospitalization Dates */}
                                {sickLeaveData.isHospitalization && (
                                    <View style={[ds.formGroup, ds.hospitalizationDates]}>
                                        <View style={ds.dateRow}>
                                            <View style={ds.dateInputWrapper}>
                                                <Text style={ds.inputLabel}>{t('visit.documents.sickLeave.hospital_from')}</Text>
                                                <TouchableOpacity
                                                    style={[ds.dateInputContainer, validationErrors.hospitalization && ds.inputError]}
                                                    onPress={() => setActiveDatePicker('hospitalizationStart')}
                                                    activeOpacity={0.7}
                                                >
                                                    <Feather name="calendar" size={18} color={tc.textMuted} />
                                                    <Text style={ds.dateInputText}>
                                                        {sickLeaveData.hospitalizationStart ? formatDisplayDate(sickLeaveData.hospitalizationStart) : '--/--/----'}
                                                    </Text>
                                                    <Feather name="chevron-down" size={16} color={tc.textPrimary} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={ds.dateInputWrapper}>
                                                <Text style={ds.inputLabel}>{t('visit.documents.sickLeave.hospital_to')}</Text>
                                                <TouchableOpacity
                                                    style={[ds.dateInputContainer, validationErrors.hospitalization && ds.inputError]}
                                                    onPress={() => setActiveDatePicker('hospitalizationEnd')}
                                                    activeOpacity={0.7}
                                                >
                                                    <Feather name="calendar" size={18} color={tc.textMuted} />
                                                    <Text style={ds.dateInputText}>
                                                        {sickLeaveData.hospitalizationEnd ? formatDisplayDate(sickLeaveData.hospitalizationEnd) : '--/--/----'}
                                                    </Text>
                                                    <Feather name="chevron-down" size={16} color={tc.textPrimary} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        {validationErrors.hospitalization && (
                                            <Text style={ds.errorText}>{validationErrors.hospitalization}</Text>
                                        )}
                                        {(activeDatePicker === 'hospitalizationStart' || activeDatePicker === 'hospitalizationEnd') && (
                                            <View style={ds.datePickerContainer}>
                                                <DateTimePicker
                                                    value={new Date(
                                                        activeDatePicker === 'hospitalizationStart'
                                                            ? (sickLeaveData.hospitalizationStart || sickLeaveData.startDate)
                                                            : (sickLeaveData.hospitalizationEnd || sickLeaveData.endDate)
                                                    )}
                                                    mode="date"
                                                    display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                                                    onChange={(event, date) => handleDateChange(activeDatePicker as 'hospitalizationStart' | 'hospitalizationEnd', event, date)}
                                                    themeVariant={isDark ? 'dark' : 'light'}
                                                />
                                                {Platform.OS === 'ios' && (
                                                    <TouchableOpacity
                                                        style={ds.datePickerDoneButton}
                                                        onPress={() => setActiveDatePicker(null)}
                                                    >
                                                        <Text style={ds.datePickerDoneText}>{t('common.done', 'Done')}</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                )}

                                {/* Medical Data - ICD-10 Search */}
                                <View style={ds.formGroup}>
                                    <Text style={ds.sectionHeading}>{t('visit.documents.sickLeave.medical_data')}</Text>
                                    <Text style={ds.inputLabel}>{t('visit.documents.sickLeave.icd10_label')}</Text>
                                    <View style={[ds.searchInputWrapper, validationErrors.icdCode && ds.inputError]}>
                                        <Feather name="search" size={18} color={tc.textMuted} style={ds.searchIcon} />
                                        <TextInput 
                                            style={ds.searchField} 
                                            placeholder={t('visit.documents.sickLeave.icd10_search')} 
                                            placeholderTextColor={tc.textMuted}
                                            value={sickLeaveData.icdCode ? sickLeaveData.statisticalNumber : icdSearchQuery}
                                            onChangeText={(text) => {
                                                if (sickLeaveData.icdCode) {
                                                    setSickLeaveData(prev => ({ ...prev, icdCode: '', statisticalNumber: '' }));
                                                }
                                                handleIcdSearch(text);
                                            }}
                                            onFocus={() => {
                                                if (icdSearchQuery.length >= 2) setShowIcdResults(true);
                                            }}
                                        />
                                        {sickLeaveData.icdCode ? (
                                            <TouchableOpacity onPress={() => {
                                                setSickLeaveData(prev => ({ ...prev, icdCode: '', statisticalNumber: '' }));
                                                clearIcdSearch();
                                            }}>
                                                <Feather name="x" size={18} color={tc.textMuted} />
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                    {validationErrors.icdCode && (
                                        <Text style={ds.errorText}>{validationErrors.icdCode}</Text>
                                    )}
                                    {showIcdResults && icdResults.length > 0 && (
                                        <View style={ds.icdResultsContainer}>
                                            {icdResults.slice(0, 8).map((result, index) => (
                                                <TouchableOpacity
                                                    key={`${result.ICD10Code || result.ICD11CODE}-${index}`}
                                                    style={ds.icdResultItem}
                                                    onPress={() => handleSelectIcd(result)}
                                                    activeOpacity={0.7}
                                                >
                                                    <View style={ds.icdCodeBadge}>
                                                        <Text style={ds.icdCodeText}>
                                                            {result.ICD10Code || result.ICD11CODE}
                                                        </Text>
                                                    </View>
                                                    <Text style={ds.icdTitleText} numberOfLines={2}>
                                                        {result.ICD10Title || result.ICD11Title}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>

                                {/* Statistical Number (read-only, populated from ICD selection) */}
                                {sickLeaveData.statisticalNumber ? (
                                    <View style={ds.formGroup}>
                                        <Text style={ds.inputLabel}>{t('visit.documents.sickLeave.statistical_number')}</Text>
                                        <View style={ds.readOnlyField}>
                                            <Text style={ds.readOnlyFieldText}>{sickLeaveData.statisticalNumber}</Text>
                                        </View>
                                    </View>
                                ) : null}

                                {/* Literal Codes Dropdowns */}
                                <View style={ds.formGroup}>
                                    <Text style={ds.inputLabel}>{t('visit.documents.sickLeave.literal_codes')}</Text>
                                    <View style={ds.literalCodesRow}>
                                        {sickLeaveData.literalCodes.map((code, i) => (
                                            <View key={i} style={{ width: '23%' }}>
                                                <TouchableOpacity
                                                    style={ds.literalDropdown}
                                                    onPress={() => setActiveCodeDropdown(activeCodeDropdown === i ? null : i)}
                                                    activeOpacity={0.7}
                                                >
                                                    <Text style={ds.dropdownValue}>{code || '--'}</Text>
                                                    <Feather name="chevron-down" size={16} color={tc.textSecondary} />
                                                </TouchableOpacity>
                                                {activeCodeDropdown === i && (
                                                    <View style={ds.codeDropdownList}>
                                                        {LITERAL_CODE_OPTIONS.map((option) => (
                                                            <TouchableOpacity
                                                                key={option || 'empty'}
                                                                style={[
                                                                    ds.codeDropdownItem,
                                                                    code === option && ds.codeDropdownItemActive,
                                                                ]}
                                                                onPress={() => handleLiteralCodeChange(i, option)}
                                                            >
                                                                <Text style={[
                                                                    ds.codeDropdownItemText,
                                                                    code === option && ds.codeDropdownItemTextActive,
                                                                ]}>
                                                                    {option || '--'}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </View>
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                {/* Recommendations */}
                                <View style={ds.formGroup}>
                                    <Text style={ds.inputLabel}>{t('visit.documents.sickLeave.recommendations')}</Text>
                                    <TextInput
                                        style={ds.formTextArea}
                                        placeholder={t('visit.documents.sickLeave.recommendations_placeholder')}
                                        placeholderTextColor={tc.textMuted}
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        value={sickLeaveData.recommendations}
                                        onChangeText={(text) => updateSickLeaveField('recommendations', text)}
                                    />
                                </View>

                                {/* Payers / Employers Section */}
                                <View style={ds.payerHeader}>
                                    <Text style={ds.sectionHeading}>{t('visit.documents.sickLeave.payers')}</Text>
                                    <TouchableOpacity 
                                        style={ds.addPayerButton}
                                        onPress={() => setShowPayerSearch(!showPayerSearch)}
                                    >
                                        <Feather name="plus" size={18} color="#58A7B3" />
                                        <Text style={ds.addPayerButtonText}>{t('visit.documents.sickLeave.add_payer')}</Text>
                                    </TouchableOpacity>
                                </View>
                                {validationErrors.employers && (
                                    <Text style={[ds.errorText, { marginBottom: 12 }]}>{validationErrors.employers}</Text>
                                )}

                                {showPayerSearch && (
                                    <View style={ds.payerSearchContainer}>
                                        <View style={ds.payerSearchWrapper}>
                                            <Feather name="search" size={18} color={tc.textPrimary} style={ds.searchIcon} />
                                            <TextInput 
                                                style={ds.payerSearchInput}
                                                placeholder={t('visit.documents.sickLeave.payer_search')}
                                                placeholderTextColor={tc.textMuted}
                                                value={employerSearchQuery}
                                                onChangeText={setEmployerSearchQuery}
                                                autoFocus
                                            />
                                            {employerSearchQuery ? (
                                                <TouchableOpacity onPress={() => setEmployerSearchQuery('')}>
                                                    <Feather name="x" size={18} color={tc.textMuted} />
                                                </TouchableOpacity>
                                            ) : null}
                                        </View>
                                        {filteredEmployers.length > 0 && (
                                            <View style={ds.employerResultsList}>
                                                {filteredEmployers.map(employer => (
                                                    <TouchableOpacity
                                                        key={employer.id}
                                                        style={ds.employerResultItem}
                                                        onPress={() => handleAddEmployer(employer)}
                                                        activeOpacity={0.7}
                                                    >
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={ds.employerName}>{employer.name}</Text>
                                                            <Text style={ds.employerNip}>NIP: {employer.nip}</Text>
                                                        </View>
                                                        {employer.hasPue && (
                                                            <View style={ds.pueBadge}>
                                                                <Text style={ds.pueBadgeText}>{t('visit.documents.sickLeave.pue_badge')}</Text>
                                                            </View>
                                                        )}
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                )}

                                {/* Selected Employers List */}
                                {(sickLeaveData.employers && sickLeaveData.employers.length > 0) ? (
                                    <View style={ds.selectedEmployersList}>
                                        {sickLeaveData.employers.map(employer => (
                                            <View key={employer.id} style={ds.selectedEmployerItem}>
                                                <View style={ds.employerItemLeft}>
                                                    <MaterialCommunityIcons name="office-building-outline" size={20} color={tc.textMuted} />
                                                    <View style={ds.employerItemInfo}>
                                                        <Text style={ds.employerName}>{employer.name}</Text>
                                                        <Text style={ds.employerNip}>NIP: {employer.nip}</Text>
                                                    </View>
                                                </View>
                                                <View style={ds.employerItemRight}>
                                                    {employer.hasPue && (
                                                        <View style={ds.pueBadge}>
                                                            <Text style={ds.pueBadgeText}>{t('visit.documents.sickLeave.pue_badge')}</Text>
                                                        </View>
                                                    )}
                                                    <TouchableOpacity
                                                        onPress={() => handleRemoveEmployer(employer.id)}
                                                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                                    >
                                                        <Feather name="x" size={18} color="#EF4444" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    !showPayerSearch && (
                                        <View style={ds.emptyPayers}>
                                            <Text style={ds.emptyPayersText}>{t('visit.documents.sickLeave.no_payers')}</Text>
                                        </View>
                                    )
                                )}

                                {/* Action Buttons */}
                                <View style={ds.formActions}>
                                    <TouchableOpacity 
                                        style={ds.cancelButton}
                                        onPress={() => setShowSickLeaveForm(false)}
                                    >
                                        <Text style={ds.cancelButtonText}>{t('common.cancel')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleSubmitSickLeave}>
                                        <LinearGradient
                                            colors={['#58A7B3', '#8ED1CC']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={ds.issueSubmitButton}
                                        >
                                            <MaterialCommunityIcons name="file-document-outline" size={18} color="#fff" />
                                            <Text style={ds.issueButtonText}>{t('visit.documents.sickLeave.issue_ezla')}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Referrals Section */}
            <View style={ds.card}>
                <TouchableOpacity 
                    style={ds.cardHeader} 
                    onPress={() => toggleSection('referrals')}
                    activeOpacity={0.7}
                >
                    <View style={ds.cardTitleRow}>
                        <Text style={ds.cardTitle}>{t('visit.documents.referrals.title')}</Text>
                        {referrals.length > 0 && (
                            <View style={ds.countBadge}>
                                <Text style={ds.countText}>{referrals.length}</Text>
                            </View>
                        )}
                    </View>
                    <Feather 
                        name={expandedSections.referrals ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color={tc.textPrimary} 
                    />
                </TouchableOpacity>
                
                {expandedSections.referrals && (
                     <View style={ds.innerContentCard}>
                        <View style={ds.referralsHeader}>
                            <Text style={ds.rowLabelText}>{t('visit.documents.referrals.title')}</Text>
                            <TouchableOpacity onPress={addReferral}>
                                <LinearGradient
                                    colors={['#58A7B3', '#8ED1CC']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={ds.smallAddButton}
                                >
                                    <Feather name="plus" size={18} color="#fff" />
                                    <Text style={ds.smallAddButtonText}>{t('visit.documents.referrals.new')}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {referrals.map((referral, index) => (
                            <View key={referral.id} style={ds.referralItemCard}>
                                <View style={ds.referralItemHeader}>
                                    <Text style={ds.referralIndex}>#{index + 1}</Text>
                                    <TouchableOpacity onPress={() => removeReferral(referral.id)}>
                                        <Feather name="trash-2" size={18} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>

                                <View style={ds.referralFieldRow}>
                                    <View style={ds.referralFieldHalf}>
                                        <Text style={ds.inputLabel}>{t('visit.documents.referrals.specialization')}</Text>
                                        <TextInput 
                                            style={ds.referralInput} 
                                            placeholder={t('visit.documents.referrals.specialization_placeholder')} 
                                            placeholderTextColor={tc.textMuted}
                                            value={referral.specialization}
                                            onChangeText={(text) => {
                                                const newRefs = [...referrals];
                                                newRefs[index].specialization = text;
                                                setReferrals(newRefs);
                                                debouncedSync({ patient: { referrals: newRefs } });
                                            }}
                                        />
                                    </View>
                                    <View style={ds.referralFieldHalf}>
                                        <Text style={ds.inputLabel}>{t('visit.documents.referrals.urgency.label')}</Text>
                                        <View style={ds.referralDropdown}>
                                            <Text style={ds.dropdownValue}>{t('visit.documents.referrals.urgency.normal')}</Text>
                                            <Feather name="chevron-down" size={18} color={tc.textSecondary} />
                                        </View>
                                    </View>
                                </View>

                                <View style={ds.referralField}>
                                    <Text style={ds.inputLabel}>{t('visit.documents.referrals.reason')}</Text>
                                    <TextInput 
                                        style={ds.referralTextArea} 
                                        multiline 
                                        numberOfLines={3}
                                        textAlignVertical="top"
                                        placeholderTextColor={tc.textMuted}
                                        value={referral.reason}
                                        onChangeText={(text) => {
                                            const newRefs = [...referrals];
                                            newRefs[index].reason = text;
                                            setReferrals(newRefs);
                                            debouncedSync({ patient: { referrals: newRefs } });
                                        }}
                                    />
                                </View>

                                <View style={ds.referralField}>
                                    <Text style={ds.inputLabel}>{t('visit.documents.referrals.additionalNotes')}</Text>
                                    <TextInput 
                                        style={ds.referralTextArea} 
                                        multiline 
                                        numberOfLines={3}
                                        textAlignVertical="top"
                                        placeholderTextColor={tc.textMuted}
                                        value={referral.notes}
                                        onChangeText={(text) => {
                                            const newRefs = [...referrals];
                                            newRefs[index].notes = text;
                                            setReferrals(newRefs);
                                            debouncedSync({ patient: { referrals: newRefs } });
                                        }}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Footer */}
            <View style={ds.footer}>
                <TouchableOpacity style={ds.backButton} onPress={onBack}>
                    <Feather name="arrow-left" size={18} color="#58A7B3" />
                    <Text style={ds.backButtonText}>{t('visit.navigation.previous')}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onNext}>
                    <LinearGradient
                        colors={['#58A7B3', '#8ED1CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={ds.nextButton}
                    >
                        <Text style={ds.nextButtonText}>{t('visit.navigation.next')}</Text>
                        <Feather name="arrow-right" size={18} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 12,
        },
        card: {
            backgroundColor: tc.cardBackground,
            borderRadius: 8,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: tc.borderColor,
            overflow: 'hidden',
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            backgroundColor: tc.cardBackground,
        },
        cardTitle: {
            fontSize: 15,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        cardContent: {
            padding: 16,
            paddingTop: 0,
            borderTopWidth: 1,
            borderTopColor: tc.borderColor,
        },
        cardContentRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 24,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: tc.borderColor,
        },
        innerContentCard: {
            padding: 16,
            paddingTop: 0,
        },
        infoBox: {
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF',
            borderRadius: 8,
            padding: 16,
            flexDirection: 'row',
            marginBottom: 16,
            marginTop: 16,
        },
        infoIcon: {
            marginRight: 12,
            marginTop: 2,
        },
        infoTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: isDark ? '#60A5FA' : '#2563EB',
            marginBottom: 4,
        },
        infoText: {
            fontSize: 13,
            color: isDark ? '#93C5FD' : '#3B82F6',
            lineHeight: 18,
        },
        addButtonContainer: {
            flexDirection: 'row',
        },
        smallAddButton: {
            flexDirection: 'row',
            alignItems: 'center',
            width: wp(45),
            height: 48,
            justifyContent: 'center',
            borderRadius: 8,
            overflow: 'hidden',
        },
        smallAddButtonText: {
            color: '#fff',
            fontSize: 14,
            fontWeight: '600',
            marginLeft: 6,
        },
        rowLabelText: {
            fontSize: 16,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        sickLeaveForm: {
            paddingTop: 16,
        },
        formSectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        formMainTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        patientInfoBox: {
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF',
            borderRadius: 8,
            padding: 16,
            flexDirection: 'row',
            marginBottom: 24,
        },
        patientInfoTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: isDark ? '#60A5FA' : '#1D4ED8',
            marginBottom: 4,
        },
        patientInfoText: {
            fontSize: 13,
            color: isDark ? '#93C5FD' : '#2563EB',
            lineHeight: 18,
        },
        formGroup: {
            marginBottom: 20,
        },
        sectionHeading: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.textPrimary,
            marginBottom: 16,
        },
        inputLabel: {
            fontSize: 13,
            fontWeight: '600',
            color: tc.textSecondary,
            marginBottom: 8,
        },
        dateRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        dateInputWrapper: {
            width: '48%',
        },
        dateInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 48,
            backgroundColor: tc.cardBackgroundAlt,
        },
        dateInput: {
            flex: 1,
            fontSize: 14,
            color: tc.textPrimary,
            marginHorizontal: 8,
        },
        dateInputText: {
            flex: 1,
            fontSize: 14,
            color: tc.textPrimary,
            marginHorizontal: 8,
        },
        datePickerContainer: {
            marginTop: 12,
            backgroundColor: tc.cardBackgroundAlt,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: tc.borderColor,
            padding: 8,
            alignItems: 'center',
        },
        datePickerDoneButton: {
            alignSelf: 'flex-end',
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginTop: 8,
        },
        datePickerDoneText: {
            fontSize: 15,
            fontWeight: '700',
            color: '#58A7B3',
        },
        inputError: {
            borderColor: '#EF4444',
        },
        errorText: {
            fontSize: 12,
            color: '#EF4444',
            marginTop: 4,
        },
        hospitalizationDates: {
            paddingLeft: 28,
        },
        removeButton: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: '#EF4444',
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 8,
        },
        removeButtonText: {
            color: '#EF4444',
            fontSize: 14,
            fontWeight: '700',
            marginLeft: 6,
        },
        icdResultsContainer: {
            marginTop: 8,
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            backgroundColor: tc.cardBackground,
            maxHeight: 250,
            overflow: 'hidden',
        },
        icdResultItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: tc.borderColor,
        },
        icdCodeBadge: {
            backgroundColor: isDark ? 'rgba(88, 167, 179, 0.2)' : '#E2F2F4',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            marginRight: 10,
        },
        icdCodeText: {
            fontSize: 13,
            fontWeight: '700',
            color: '#58A7B3',
        },
        icdTitleText: {
            flex: 1,
            fontSize: 13,
            color: tc.textPrimary,
        },
        readOnlyField: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 12,
            backgroundColor: isDark ? 'rgba(88, 167, 179, 0.05)' : '#F9FAFB',
        },
        readOnlyFieldText: {
            fontSize: 14,
            color: tc.textSecondary,
        },
        codeDropdownList: {
            position: 'absolute',
            top: 44,
            left: 0,
            right: 0,
            backgroundColor: tc.cardBackground,
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            zIndex: 100,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
        },
        codeDropdownItem: {
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: tc.borderColor,
        },
        codeDropdownItemActive: {
            backgroundColor: isDark ? 'rgba(88, 167, 179, 0.2)' : '#E2F2F4',
        },
        codeDropdownItemText: {
            fontSize: 14,
            color: tc.textPrimary,
            textAlign: 'center',
        },
        codeDropdownItemTextActive: {
            color: '#58A7B3',
            fontWeight: '700',
        },
        employerResultsList: {
            marginTop: 12,
        },
        employerResultItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            paddingVertical: 12,
            backgroundColor: isDark ? tc.cardBackground : '#F9FAFB',
            borderRadius: 8,
            marginBottom: 8,
        },
        employerName: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textPrimary,
        },
        employerNip: {
            fontSize: 13,
            color: tc.textSecondary,
            marginTop: 2,
        },
        pueBadge: {
            backgroundColor: isDark ? 'rgba(34, 197, 94, 0.15)' : '#DCFCE7',
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 12,
        },
        pueBadgeText: {
            fontSize: 11,
            fontWeight: '700',
            color: isDark ? '#4ADE80' : '#166534',
        },
        selectedEmployersList: {
            marginBottom: 16,
        },
        selectedEmployerItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            paddingVertical: 12,
            backgroundColor: isDark ? tc.cardBackgroundAlt : '#F9FAFB',
            borderRadius: 8,
            marginBottom: 8,
        },
        employerItemLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        employerItemInfo: {
            marginLeft: 12,
            flex: 1,
        },
        employerItemRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        checkboxRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
        },
        checkbox: {
            width: 18,
            height: 18,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: tc.borderColor,
            marginRight: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tc.cardBackgroundAlt,
        },
        checkboxChecked: {
            backgroundColor: '#58A7B3',
            borderColor: '#58A7B3',
        },
        checkboxLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textPrimary,
        },
        searchInputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 48,
            backgroundColor: tc.cardBackgroundAlt,
        },
        searchField: {
            flex: 1,
            fontSize: 14,
            color: tc.textPrimary,
            marginLeft: 8,
        },
        searchIcon: {
            marginRight: 4,
        },
        literalCodesRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        literalDropdown: {
            width: '23%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 40,
            backgroundColor: tc.cardBackgroundAlt,
        },
        dropdownValue: {
            fontSize: 14,
            color: tc.textPrimary,
        },
        formTextArea: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            padding: 12,
            fontSize: 14,
            color: tc.textPrimary,
            backgroundColor: tc.cardBackgroundAlt,
            minHeight: 80,
        },
        payerHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
            marginBottom: 16,
        },
        addPayerButton: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: '#58A7B3',
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 8,
        },
        addPayerButtonText: {
            color: '#58A7B3',
            fontSize: 14,
            fontWeight: '700',
            marginLeft: 6,
        },
        payerSearchContainer: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
            backgroundColor: tc.cardBackgroundAlt,
        },
        payerSearchWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 48,
            backgroundColor: tc.cardBackground,
        },
        payerSearchInput: {
            flex: 1,
            fontSize: 14,
            color: tc.textPrimary,
            marginLeft: 8,
        },
        emptyPayers: {
            paddingVertical: 30,
            alignItems: 'center',
        },
        emptyPayersText: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textSecondary,
        },
        formActions: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 10,
        },
        cancelButton: {
            borderWidth: 1.5,
            borderColor: '#58A7B3',
            borderRadius: 8,
            paddingHorizontal: 24,
            height: 44,
            justifyContent: 'center',
            marginRight: 12,
        },
        cancelButtonText: {
            color: '#58A7B3',
            fontSize: 15,
            fontWeight: '700',
        },
        issueButtonContainer: {
        },
        issueSubmitButton: {
            flexDirection: 'row',
            alignItems: 'center',            height: 48,
            overflow: 'hidden',
            borderRadius: 8,
            flex: 1,
        },
        issueButtonText: {
            color: '#fff',
            fontSize: 15,
            fontWeight: '700',
            marginLeft: 8,
        },
        cardTitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        countBadge: {
            backgroundColor: isDark ? 'rgba(88, 167, 179, 0.2)' : '#E2F2F4',
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 2,
            marginLeft: 8,
            minWidth: 24,
            alignItems: 'center',
            justifyContent: 'center',
        },
        countText: {
            fontSize: 12,
            fontWeight: '700',
            color: '#58A7B3',
        },
        referralsHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 8,
        },
        referralItemCard: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            backgroundColor: tc.cardBackgroundAlt,
        },
        referralItemHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        referralIndex: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        referralFieldRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
        },
        referralFieldHalf: {
            width: '48%',
        },
        referralField: {
            marginBottom: 16,
        },
        referralInput: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            padding: 12,
            fontSize: 14,
            color: tc.textPrimary,
            backgroundColor: tc.cardBackground,
            height: 48,
        },
        referralDropdown: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 48,
            backgroundColor: tc.cardBackground,
        },
        referralTextArea: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            padding: 12,
            fontSize: 14,
            color: tc.textPrimary,
            backgroundColor: tc.cardBackground,
            minHeight: 80,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            width:wp(80),
            alignItems:'center',
            gap:wp(2)
        },
        backButton: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: '#58A7B3',
            borderRadius: 8,
            width: wp(43),
            height: 50,
            justifyContent: 'center',
        },
        backButtonText: {
            fontSize: 16,
            color: '#58A7B3',
            fontWeight: '700',
            marginLeft: 8,
        },
        nextButton: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 8,
            width: wp(43),
            height: 50,
            justifyContent: 'center',
        },
        nextButtonText: {
            fontSize: 16,
            color: '#fff',
            fontWeight: '700',
            marginRight: 8,
        },
    });

export default VisitDocuments;
