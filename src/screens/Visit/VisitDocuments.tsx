import React, { useState } from 'react';
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
}

const VisitDocuments = ({ onNext, onBack }: VisitDocumentsProps) => {
    const [expandedSections, setExpandedSections] = useState({
        prescriptions: true,
        sickLeave: true,
        referrals: true,
    });
    const [showSickLeaveForm, setShowSickLeaveForm] = useState(false);
    const [showPayerSearch, setShowPayerSearch] = useState(false);
    const [isHospitalStay, setIsHospitalStay] = useState(false);
    const [referrals, setReferrals] = useState<Referral[]>([]);

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
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Prescriptions Section */}
            <View style={styles.card}>
                <TouchableOpacity 
                    style={styles.cardHeader} 
                    onPress={() => toggleSection('prescriptions')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.cardTitle}>Prescriptions</Text>
                    <Feather 
                        name={expandedSections.prescriptions ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="#1E293B" 
                    />
                </TouchableOpacity>
                
                {expandedSections.prescriptions && (
                    <View style={styles.cardContent}>
                        <View style={styles.infoBox}>
                            <Feather name="info" size={18} color="#3B82F6" style={styles.infoIcon} />
                            <View>
                                <Text style={styles.infoTitle}>e-Prescription</Text>
                                <Text style={styles.infoText}>
                                    Issue electronic prescriptions compatible with the P1 system. You can save the prescription as a draft and sign it later.
                                </Text>
                            </View>
                        </View>
                        
                        <TouchableOpacity style={styles.addButtonContainer}>
                            <LinearGradient
                                colors={['#58A7B3', '#8ED1CC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.smallAddButton}
                            >
                                <Feather name="plus" size={18} color="#fff" />
                                <Text style={styles.smallAddButtonText}>Add medication</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Sick Leave Section */}
            <View style={styles.card}>
                <TouchableOpacity 
                    style={styles.cardHeader} 
                    onPress={() => toggleSection('sickLeave')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.cardTitle}>Sick Leave</Text>
                    <Feather 
                        name={expandedSections.sickLeave ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="#1E293B" 
                    />
                </TouchableOpacity>
                
                {expandedSections.sickLeave && (
                    <View style={showSickLeaveForm ? styles.cardContent : styles.cardContentRow}>
                        {!showSickLeaveForm ? (
                            <>
                                <Text style={styles.rowLabelText}>e-ZLA</Text>
                                <TouchableOpacity onPress={() => setShowSickLeaveForm(true)}>
                                    <LinearGradient
                                        colors={['#58A7B3', '#8ED1CC']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.smallAddButton}
                                    >
                                        <Feather name="plus" size={18} color="#fff" />
                                        <Text style={styles.smallAddButtonText}>Issue sick leave</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={styles.sickLeaveForm}>
                                <View style={styles.formSectionHeader}>
                                    <Text style={styles.formMainTitle}>e-ZLA</Text>
                                    <TouchableOpacity onPress={() => setShowSickLeaveForm(false)}>
                                        <LinearGradient
                                            colors={['#58A7B3', '#8ED1CC']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.smallAddButton}
                                        >
                                            <Feather name="plus" size={18} color="#fff" />
                                            <Text style={styles.smallAddButtonText}>Issue sick leave</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.patientInfoBox}>
                                    <Feather name="info" size={18} color="#2563EB" style={styles.infoIcon} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.patientInfoTitle}>Patient Information</Text>
                                        <Text style={styles.patientInfoText}>
                                            Patient data will be automatically retrieved from the ZUS system after entering the PESEL number.
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.sectionHeading}>Sick Leave Period</Text>
                                    <View style={styles.dateRow}>
                                        <View style={styles.dateInputWrapper}>
                                            <Text style={styles.inputLabel}>Date from</Text>
                                            <View style={styles.dateInputContainer}>
                                                <Feather name="calendar" size={18} color="#94A3B8" />
                                                <TextInput style={styles.dateInput} value="10/03/2026" editable={false} />
                                                <Feather name="calendar" size={18} color="#1E293B" />
                                            </View>
                                        </View>
                                        <View style={styles.dateInputWrapper}>
                                            <Text style={styles.inputLabel}>Date to</Text>
                                            <View style={styles.dateInputContainer}>
                                                <Feather name="calendar" size={18} color="#94A3B8" />
                                                <TextInput style={styles.dateInput} value="10/03/2026" editable={false} />
                                                <Feather name="calendar" size={18} color="#1E293B" />
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity 
                                    style={styles.checkboxRow} 
                                    onPress={() => setIsHospitalStay(!isHospitalStay)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.checkbox, isHospitalStay && styles.checkboxChecked]}>
                                        {isHospitalStay && <Feather name="check" size={14} color="#fff" />}
                                    </View>
                                    <Text style={styles.checkboxLabel}>Hospital stay</Text>
                                </TouchableOpacity>

                                <View style={styles.formGroup}>
                                    <Text style={styles.sectionHeading}>Medical Data</Text>
                                    <Text style={styles.inputLabel}>Statistical disease number (ICD-10) (ICD-10)</Text>
                                    <View style={styles.searchInputWrapper}>
                                        <Feather name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
                                        <TextInput 
                                            style={styles.searchField} 
                                            placeholder="Search ICD-10 code" 
                                            placeholderTextColor="#94A3B8"
                                        />
                                    </View>
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.inputLabel}>Literal Codes</Text>
                                    <View style={styles.literalCodesRow}>
                                        {[1, 2, 3, 4].map((_, i) => (
                                            <View key={i} style={styles.literalDropdown}>
                                                <Text style={styles.dropdownValue}>--</Text>
                                                <Feather name="chevron-down" size={16} color="#64748B" />
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.inputLabel}>Doctor's recommendations and instructions</Text>
                                    <TextInput
                                        style={styles.formTextArea}
                                        placeholder="E.g. bed rest, medication, rehabilitation..."
                                        placeholderTextColor="#94A3B8"
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                    />
                                </View>

                                <View style={styles.payerHeader}>
                                    <Text style={styles.sectionHeading}>Payers</Text>
                                    <TouchableOpacity 
                                        style={styles.addPayerButton}
                                        onPress={() => setShowPayerSearch(true)}
                                    >
                                        <Feather name="plus" size={18} color="#58A7B3" />
                                        <Text style={styles.addPayerButtonText}>Add payer</Text>
                                    </TouchableOpacity>
                                </View>

                                {showPayerSearch ? (
                                    <View style={styles.payerSearchContainer}>
                                        <View style={styles.payerSearchWrapper}>
                                            <Feather name="search" size={18} color="#1E293B" style={styles.searchIcon} />
                                            <TextInput 
                                                style={styles.payerSearchInput}
                                                placeholder="Wyszukaj płatnika po nazwie lub NIP..."
                                                placeholderTextColor="#94A3B8"
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.emptyPayers}>
                                        <Text style={styles.emptyPayersText}>No payers added</Text>
                                    </View>
                                )}

                                <View style={styles.formActions}>
                                    <TouchableOpacity 
                                        style={styles.cancelButton}
                                        onPress={() => setShowSickLeaveForm(false)}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.issueButtonContainer}>
                                        <LinearGradient
                                            colors={['#58A7B3', '#8ED1CC']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.issueSubmitButton}
                                        >
                                            <MaterialCommunityIcons name="file-document-outline" size={18} color="#fff" />
                                            <Text style={styles.issueButtonText}>Issue e-ZLA</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Referrals Section */}
            <View style={styles.card}>
                <TouchableOpacity 
                    style={styles.cardHeader} 
                    onPress={() => toggleSection('referrals')}
                    activeOpacity={0.7}
                >
                    <View style={styles.cardTitleRow}>
                        <Text style={styles.cardTitle}>Referrals</Text>
                        {referrals.length > 0 && (
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{referrals.length}</Text>
                            </View>
                        )}
                    </View>
                    <Feather 
                        name={expandedSections.referrals ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="#1E293B" 
                    />
                </TouchableOpacity>
                
                {expandedSections.referrals && (
                     <View style={styles.innerContentCard}>
                        <View style={styles.referralsHeader}>
                            <Text style={styles.rowLabelText}>Referrals</Text>
                            <TouchableOpacity onPress={addReferral}>
                                <LinearGradient
                                    colors={['#58A7B3', '#8ED1CC']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.smallAddButton}
                                >
                                    <Feather name="plus" size={18} color="#fff" />
                                    <Text style={styles.smallAddButtonText}>New Referral</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {referrals.map((referral, index) => (
                            <View key={referral.id} style={styles.referralItemCard}>
                                <View style={styles.referralItemHeader}>
                                    <Text style={styles.referralIndex}>#{index + 1}</Text>
                                    <TouchableOpacity onPress={() => removeReferral(referral.id)}>
                                        <Feather name="trash-2" size={18} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.referralFieldRow}>
                                    <View style={styles.referralFieldHalf}>
                                        <Text style={styles.inputLabel}>Specialization</Text>
                                        <TextInput 
                                            style={styles.referralInput} 
                                            placeholder="np. Kardiologia" 
                                            placeholderTextColor="#94A3B8"
                                        />
                                    </View>
                                    <View style={styles.referralFieldHalf}>
                                        <Text style={styles.inputLabel}>Urgency</Text>
                                        <View style={styles.referralDropdown}>
                                            <Text style={styles.dropdownValue}>Normal</Text>
                                            <Feather name="chevron-down" size={18} color="#64748B" />
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.referralField}>
                                    <Text style={styles.inputLabel}>Reason for Referral</Text>
                                    <TextInput 
                                        style={styles.referralTextArea} 
                                        multiline 
                                        numberOfLines={3}
                                        textAlignVertical="top"
                                    />
                                </View>

                                <View style={styles.referralField}>
                                    <Text style={styles.inputLabel}>Additional Notes</Text>
                                    <TextInput 
                                        style={styles.referralTextArea} 
                                        multiline 
                                        numberOfLines={3}
                                        textAlignVertical="top"
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Feather name="arrow-left" size={18} color="#58A7B3" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onNext}>
                    <LinearGradient
                        colors={['#58A7B3', '#8ED1CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextButtonText}>Next</Text>
                        <Feather name="arrow-right" size={18} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
    },
    cardContent: {
        padding: 16,
        paddingTop: 0,
        borderTopWidth: 1,
        borderTopColor: '#F8FAFC',
    },
    cardContentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F8FAFC',
    },
    innerContentCard: {
        padding: 16,
        paddingTop: 0,
    },
    infoBox: {
        backgroundColor: '#EFF6FF',
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
        color: '#2563EB',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
        color: '#3B82F6',
        lineHeight: 18,
    },
    addButtonContainer: {
        flexDirection: 'row',
    },
    smallAddButton: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingVertical: 10,
        // paddingHorizontal: 16,
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
        color: '#1E293B',
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
        color: '#1E293B',
    },
    patientInfoBox: {
        backgroundColor: '#EFF6FF',
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        marginBottom: 24,
    },
    patientInfoTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1D4ED8',
        marginBottom: 4,
    },
    patientInfoText: {
        fontSize: 13,
        color: '#2563EB',
        lineHeight: 18,
    },
    formGroup: {
        marginBottom: 20,
    },
    sectionHeading: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
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
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
    },
    dateInput: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
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
        borderColor: '#CBD5E1',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#58A7B3',
        borderColor: '#58A7B3',
    },
    checkboxLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
    },
    searchField: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
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
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 40,
    },
    dropdownValue: {
        fontSize: 14,
        color: '#1E293B',
    },
    formTextArea: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#1E293B',
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
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
    },
    payerSearchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
    },
    payerSearchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
        marginLeft: 8,
    },
    emptyPayers: {
        paddingVertical: 30,
        alignItems: 'center',
    },
    emptyPayersText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
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
        // width: wp(35),
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
        backgroundColor: '#E2F2F4',
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
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
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
        color: '#1E293B',
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
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#1E293B',
        height: 48,
    },
    referralDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
    },
    referralTextArea: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#1E293B',
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
