import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Switch,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

interface Referral {
    id: number;
    specialization: string;
    urgency: string;
    reason: string;
    notes: string;
}

interface VisitDocumentsProps {
    onNext: () => void;
    onBack: () => void;
    visitData?: any;
}

const VisitDocuments = ({ onNext, onBack, visitData }: VisitDocumentsProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const [expandedSections, setExpandedSections] = useState({
        prescriptions: true,
        sickLeave: true,
        referrals: true,
    });
    const [showSickLeaveForm, setShowSickLeaveForm] = useState(false);
    const [showPayerSearch, setShowPayerSearch] = useState(false);
    const [isHospitalStay, setIsHospitalStay] = useState(false);
    const [referrals, setReferrals] = useState<Referral[]>(visitData?.patient?.referrals || []);

    useEffect(() => {
        if (visitData?.patient?.referrals) {
            setReferrals(visitData.patient.referrals);
        }
    }, [visitData]);

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const addReferral = () => {
        const newReferral: Referral = {
            id: Date.now(),
            specialization: '',
            urgency: 'Normal',
            reason: '',
            notes: '',
        };
        setReferrals([...referrals, newReferral]);
    };

    const removeReferral = (id: number) => {
        setReferrals(referrals.filter(ref => ref.id !== id));
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
                        <View style={ds.infoBox}>
                            <Feather name="info" size={18} color="#3B82F6" style={ds.infoIcon} />
                            <View>
                                <Text style={ds.infoTitle}>{t('visit.documents.prescriptions.ezla') || 'e-Prescription'}</Text>
                                <Text style={ds.infoText}>
                                    {t('visit.documents.prescriptions.description')}
                                </Text>
                            </View>
                        </View>
                        
                        <TouchableOpacity style={ds.addButtonContainer}>
                            <LinearGradient
                                colors={['#58A7B3', '#8ED1CC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={ds.smallAddButton}
                            >
                                <Feather name="plus" size={18} color="#fff" />
                                <Text style={ds.smallAddButtonText}>{t('visit.documents.prescriptions.add_med')}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
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
                                    <TouchableOpacity onPress={() => setShowSickLeaveForm(false)}>
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

                                <View style={ds.formGroup}>
                                    <Text style={ds.sectionHeading}>{t('visit.documents.sickLeave.period')}</Text>
                                    <View style={ds.dateRow}>
                                        <View style={ds.dateInputWrapper}>
                                            <Text style={ds.inputLabel}>{t('visit.documents.sickLeave.from')}</Text>
                                            <View style={ds.dateInputContainer}>
                                                <Feather name="calendar" size={18} color={tc.textMuted} />
                                                <TextInput style={ds.dateInput} value="10/03/2026" editable={false} />
                                                <Feather name="calendar" size={18} color={tc.textPrimary} />
                                            </View>
                                        </View>
                                        <View style={ds.dateInputWrapper}>
                                            <Text style={ds.inputLabel}>{t('visit.documents.sickLeave.to')}</Text>
                                            <View style={ds.dateInputContainer}>
                                                <Feather name="calendar" size={18} color={tc.textMuted} />
                                                <TextInput style={ds.dateInput} value="10/03/2026" editable={false} />
                                                <Feather name="calendar" size={18} color={tc.textPrimary} />
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity 
                                    style={ds.checkboxRow} 
                                    onPress={() => setIsHospitalStay(!isHospitalStay)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[ds.checkbox, isHospitalStay && ds.checkboxChecked]}>
                                        {isHospitalStay && <Feather name="check" size={14} color="#fff" />}
                                    </View>
                                    <Text style={ds.checkboxLabel}>{t('visit.documents.sickLeave.hospital')}</Text>
                                </TouchableOpacity>

                                <View style={ds.formGroup}>
                                    <Text style={ds.sectionHeading}>{t('visit.documents.sickLeave.medical_data')}</Text>
                                    <Text style={ds.inputLabel}>{t('visit.documents.sickLeave.icd10_label')}</Text>
                                    <View style={ds.searchInputWrapper}>
                                        <Feather name="search" size={18} color={tc.textMuted} style={ds.searchIcon} />
                                        <TextInput 
                                            style={ds.searchField} 
                                            placeholder={t('visit.documents.sickLeave.icd10_search')} 
                                            placeholderTextColor={tc.textMuted}
                                        />
                                    </View>
                                </View>

                                <View style={ds.formGroup}>
                                    <Text style={ds.inputLabel}>{t('visit.documents.sickLeave.literal_codes')}</Text>
                                    <View style={ds.literalCodesRow}>
                                        {[1, 2, 3, 4].map((_, i) => (
                                            <View key={i} style={ds.literalDropdown}>
                                                <Text style={ds.dropdownValue}>--</Text>
                                                <Feather name="chevron-down" size={16} color={tc.textSecondary} />
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                <View style={ds.formGroup}>
                                    <Text style={ds.inputLabel}>{t('visit.documents.sickLeave.recommendations')}</Text>
                                    <TextInput
                                        style={ds.formTextArea}
                                        placeholder={t('visit.documents.sickLeave.recommendations_placeholder')}
                                        placeholderTextColor={tc.textMuted}
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                    />
                                </View>

                                <View style={ds.payerHeader}>
                                    <Text style={ds.sectionHeading}>{t('visit.documents.sickLeave.payers')}</Text>
                                    <TouchableOpacity 
                                        style={ds.addPayerButton}
                                        onPress={() => setShowPayerSearch(true)}
                                    >
                                        <Feather name="plus" size={18} color="#58A7B3" />
                                        <Text style={ds.addPayerButtonText}>{t('visit.documents.sickLeave.add_payer')}</Text>
                                    </TouchableOpacity>
                                </View>

                                {showPayerSearch ? (
                                    <View style={ds.payerSearchContainer}>
                                        <View style={ds.payerSearchWrapper}>
                                            <Feather name="search" size={18} color={tc.textPrimary} style={ds.searchIcon} />
                                            <TextInput 
                                                style={ds.payerSearchInput}
                                                placeholder={t('visit.documents.sickLeave.payer_search')}
                                                placeholderTextColor={tc.textMuted}
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    <View style={ds.emptyPayers}>
                                        <Text style={ds.emptyPayersText}>{t('visit.documents.sickLeave.no_payers')}</Text>
                                    </View>
                                )}

                                <View style={ds.formActions}>
                                    <TouchableOpacity 
                                        style={ds.cancelButton}
                                        onPress={() => setShowSickLeaveForm(false)}
                                    >
                                        <Text style={ds.cancelButtonText}>{t('common.cancel')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={ds.issueButtonContainer}>
                                        <LinearGradient
                                            colors={['#58A7B3', '#8ED1CC']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={ds.issueSubmitButton}
                                        >
                                            <MaterialCommunityIcons name="file-document-outline" size={18} color="#fff" />
                                            <Text style={ds.issueButtonText}>{t('visit.documents.sickLeave.new')}</Text>
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
            height: hp(5),
            justifyContent: 'center',
            borderRadius: 8,
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
            alignItems: 'center',
            paddingHorizontal: 20,
            height: 44,
            borderRadius: 8,
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
            paddingBottom: hp(5),
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
