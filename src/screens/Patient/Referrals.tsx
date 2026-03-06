import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    Platform,
    Modal,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../component/button';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomTextInput from '../../component/customTextInput';
import CustomDropdown from '../../component/customDropDown';
import CustomAlert from '../../component/customAlert';
import Gap from '../../component/gap';
import { GetIncomingReferrals, GetOutgoingReferrals, CreateReferral, GetReferralPatientOptions, GetReferralDoctorOptions, GetReferralNurseOptions } from '../../Services/ReferralsService';

const ReferralsScreen = () => {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'outgoing'
    const [showNewReferralModal, setShowNewReferralModal] = useState(false);
    const [referralType, setReferralType] = useState('Doctor'); // 'Doctor' or 'Nurse'
    const [selectedPatient, setSelectedPatient] = useState('');
    const [referredTo, setReferredTo] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [referrals, setReferrals] = useState<any[]>([]);
    const [patientOptions, setPatientOptions] = useState<{ label: string; value: string }[]>([]);
    const [employeesOptions, setEmployeesOptions] = useState<{ label: string; value: string }[]>([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedReferral, setSelectedReferral] = useState<any>(null);
    const [alertConfig, setAlertConfig] = useState<any>({
        visible: false,
        type: 'success',
        message: '',
    });

    const showAlert = (type: 'success' | 'error' | 'warning', message: string) => {
        setAlertConfig({ visible: true, type, message });
    };

    React.useEffect(() => {
        fetchReferrals();
    }, [activeTab]);

    React.useEffect(() => {
        fetchRequirements();
    }, [referralType]);

    const fetchReferrals = async () => {
        setLoading(true);
        try {
            let res: any;
            if (activeTab === 'incoming') {
                res = await GetIncomingReferrals({});
            } else {
                res = await GetOutgoingReferrals({});
            }
            
            // Handle nested data structure: res.data.data or res.data
            const data = res?.data?.data || res?.data || res;
            setReferrals(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching referrals:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequirements = async () => {
        try {
            const patientsRes: any = await GetReferralPatientOptions();
            const pData = patientsRes?.data || patientsRes || [];
            if (Array.isArray(pData)) {
                setPatientOptions(pData.map((p: any) => ({
                    label: p.lastName ? `${p.name} ${p.lastName}` : (p.name || 'Unknown'),
                    value: p.id || p._id
                })));
            }

            let employeesRes: any;
            if (referralType === 'Doctor') {
                employeesRes = await GetReferralDoctorOptions();
            } else {
                employeesRes = await GetReferralNurseOptions();
            }
            
            const eData = employeesRes?.data || employeesRes || [];
            if (Array.isArray(eData)) {
                setEmployeesOptions(eData.map((e: any) => ({
                    label: e.lastName ? `${e.name} ${e.lastName}` : (e.name || 'Unknown'),
                    value: e.id || e._id
                })));
            }
        } catch (error) {
            console.error("Error fetching requirements:", error);
        }
    };

    const handleSave = async () => {
        if (!selectedPatient || !referredTo || !specialization || !reason) {
            showAlert('warning', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                type: referralType.toLowerCase(),
                patientId: selectedPatient,
                referredToId: referredTo,
                specialization,
                reason,
                notes,
            };
            const res: any = await CreateReferral(payload);
            if (res) {
                showAlert('success', 'Referral created successfully');
                setShowNewReferralModal(false);
                fetchReferrals();
                // Reset form
                setSelectedPatient('');
                setReferredTo('');
                setSpecialization('');
                setReason('');
                setNotes('');
            }
        } catch (error) {
            console.error("Error creating referral:", error);
            showAlert('error', 'Failed to create referral');
        } finally {
            setLoading(false);
        }
    };

    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <MaterialCommunityIcons name="inbox-outline" size={60} color="#94A3B8" />
            <Text style={styles.emptyStateText}>No {activeTab} referrals</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View style={styles.headerTitleContainer}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                            >
                                <Ionicons name="arrow-back" size={20} color="#4A90B9" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Referrals</Text>
                        </View>
                        <PrimaryButton
                            label={'New Referral'}
                            filled={true}
                            onPress={() => setShowNewReferralModal(true)}
                            style={styles.newReferralBtn}
                            icon={<Feather name="plus" size={18} color="white" />}
                            loading={false}
                            disabled={false}
                        />
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'incoming' && styles.activeTab]}
                        onPress={() => setActiveTab('incoming')}
                    >
                        <Text style={[styles.tabText, activeTab === 'incoming' && styles.activeTabText]}>
                            Incoming Referrals
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'outgoing' && styles.activeTab]}
                        onPress={() => setActiveTab('outgoing')}
                    >
                        <Text style={[styles.tabText, activeTab === 'outgoing' && styles.activeTabText]}>
                            Outgoing Referrals
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={styles.cardContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.horizontalTableContainer}>
                                {/* Column Headers */}
                                <View style={styles.tableHead}>
                                    <View style={styles.columnPatient}><Text style={styles.tableHeadText}>PATIENT</Text></View>
                                    <View style={styles.columnReferred}>
                                        <Text style={styles.tableHeadText}>
                                            {activeTab === 'incoming' ? 'REFERRED BY' : 'REFERRED TO'}
                                        </Text>
                                    </View>
                                    <View style={styles.columnReason}><Text style={styles.tableHeadText}>REASON FOR REFERRAL</Text></View>
                                    <View style={styles.columnStatus}><Text style={styles.tableHeadText}>STATUS</Text></View>
                                    <View style={styles.columnDate}><Text style={styles.tableHeadText}>DATE</Text></View>
                                    <View style={styles.columnActions}><Text style={[styles.tableHeadText, { textAlign: 'right' }]}>ACTIONS</Text></View>
                                </View>
                                
                                {/* Empty state or List */}
                                <View style={styles.tableBody}>
                                    {referrals.length === 0 ? renderEmptyState() : referrals.map((item, index) => (
                                        <View key={item.id || index} style={styles.tableRow}>
                                            <View style={[styles.columnPatient, { paddingRight: 8 }]}>
                                                <Text style={[styles.tableCellText, { fontWeight: '700' }]} numberOfLines={1} ellipsizeMode="tail">{item.patient?.name || 'Unknown'}</Text>
                                            </View>
                                            <View style={[styles.columnReferred, { paddingRight: 8 }]}>
                                                {activeTab === 'incoming' ? (
                                                    <Text style={styles.tableCellText} numberOfLines={1} ellipsizeMode="tail">
                                                        {item.referredBy?.name || 'N/A'} <Text style={{ color: '#94A3B8' }}>({item.referredBy?.role || 'provider'})</Text>
                                                    </Text>
                                                ) : (
                                                    <Text style={styles.tableCellText} numberOfLines={1} ellipsizeMode="tail">
                                                        {item.referredTo?.name || 'N/A'} <Text style={{ color: '#94A3B8' }}>({item.referredTo?.role || 'provider'})</Text>
                                                    </Text>
                                                )}
                                            </View>
                                            <View style={styles.columnReason}>
                                                <Text style={[styles.tableCellText, { fontWeight: '700' }]} numberOfLines={1}>{item.reason || 'N/A'}</Text>
                                            </View>
                                            <View style={styles.columnStatus}>
                                                <View style={[styles.statusBadge, { backgroundColor: '#FEF9C3' }]}>
                                                    <Text style={[styles.statusText, { color: '#854D0E' }]}>
                                                        {item.status ? (item.status.charAt(0).toUpperCase() + item.status.slice(1)) : 'Pending'}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.columnDate}>
                                                <Text style={styles.tableCellText}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : 'N/A'}</Text>
                                            </View>
                                            <View style={styles.columnActions}>
                                                <TouchableOpacity 
                                                    style={styles.actionSquareBtn}
                                                    onPress={() => {
                                                        setSelectedReferral(item);
                                                        setShowDetailsModal(true);
                                                    }}
                                                >
                                                    <Feather name="eye" size={18} color="#06B6D4" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>

                {/* New Referral Modal */}
                <Modal
                    visible={showNewReferralModal}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>New Referral</Text>
                                <TouchableOpacity onPress={() => setShowNewReferralModal(false)}>
                                    <Feather name="x" size={24} color="#64748B" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                                {/* Toggle Doctor/Nurse */}
                                <View style={styles.toggleContainer}>
                                    <TouchableOpacity
                                        style={[styles.toggleBtn, referralType === 'Doctor' && styles.toggleBtnActive]}
                                        onPress={() => setReferralType('Doctor')}
                                    >
                                        <Text style={[styles.toggleText, referralType === 'Doctor' && styles.toggleTextActive]}>Doctor</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.toggleBtn, referralType === 'Nurse' && styles.toggleBtnActive]}
                                        onPress={() => setReferralType('Nurse')}
                                    >
                                        <Text style={[styles.toggleText, referralType === 'Nurse' && styles.toggleTextActive]}>Nurse</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.inputLabel}>Patient</Text>
                                <CustomDropdown
                                    placeholder="Select patient"
                                    options={patientOptions}
                                    value={selectedPatient}
                                    onChange={(val: any) => setSelectedPatient(val)}
                                />
                                <Gap height={15} />

                                <Text style={styles.inputLabel}>Referred To</Text>
                                <CustomDropdown
                                    placeholder="Select provider"
                                    options={employeesOptions}
                                    value={referredTo}
                                    onChange={(val: any) => setReferredTo(val)}
                                />
                                <Gap height={15} />

                                <Text style={styles.inputLabel}>Specialization</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter specialization"
                                    value={specialization}
                                    onChangeText={setSpecialization}
                                />
                                <Gap height={15} />

                                <Text style={styles.inputLabel}>Reason for Referral</Text>
                                <TextInput
                                    style={[styles.textInput, styles.textArea]}
                                    placeholder="Enter reason"
                                    value={reason}
                                    onChangeText={setReason}
                                    multiline={true}
                                    numberOfLines={4}
                                />
                                <Gap height={15} />

                                <Text style={styles.inputLabel}>Notes</Text>
                                <TextInput
                                    style={[styles.textInput, styles.textArea]}
                                    placeholder="Enter additional notes"
                                    value={notes}
                                    onChangeText={setNotes}
                                    multiline={true}
                                    numberOfLines={4}
                                />
                                
                                <Gap height={30} />
                                
                                <View style={styles.modalFooter}>
                                    <PrimaryButton
                                        label={'Cancel'}
                                        filled={false}
                                        onPress={() => setShowNewReferralModal(false)}
                                        style={{ flex: 1 }}
                                        loading={false}
                                        disabled={loading}
                                    />
                                    <PrimaryButton
                                        label={'Submit'}
                                        filled={true}
                                        onPress={handleSave}
                                        style={{ flex: 1 }}
                                        loading={loading}
                                        disabled={loading}
                                    />
                                </View>
                                <Gap height={20} />
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
                
                {/* Referral Details Modal */}
                <Modal
                    visible={showDetailsModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowDetailsModal(false)}
                >
                    <View style={[styles.modalOverlay, { justifyContent: 'center' }]}>
                        <View style={styles.detailsModalContent}>
                            <View style={styles.modalHeader}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={styles.headerIconContainer}>
                                        <MaterialCommunityIcons name="clipboard-text-outline" size={20} color="#06B6D4" />
                                    </View>
                                    <Text style={styles.modalTitle}>Referral Details</Text>
                                </View>
                                <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                                    <Feather name="x" size={24} color="#64748B" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={styles.detailsModalBody} showsVerticalScrollIndicator={false}>
                                <View style={styles.detailsRow}>
                                    <View style={{ flex: 1, paddingRight: 10 }}>
                                        <Text style={styles.detailsLabel}>Patient</Text>
                                        <View style={styles.infoWithIcon}>
                                            <Feather name="user" size={16} color="#94A3B8" />
                                            <Text style={[styles.detailsValue, { flex: 1 }]}>{selectedReferral?.patient?.name || 'N/A'}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Text style={[styles.detailsLabel, { textAlign: 'right', marginRight: 10 }]}>Status</Text>
                                        <View style={[styles.statusBadgePill, { backgroundColor: '#FEF9C3' }]}>
                                            <Feather name="clock" size={12} color="#854D0E" style={{ marginRight: 4 }} />
                                            <Text style={[styles.statusText, { color: '#854D0E' }]}>
                                                {selectedReferral?.status ? (selectedReferral.status.charAt(0).toUpperCase() + selectedReferral.status.slice(1)) : 'Pending'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.detailsRow}>
                                    <View style={{ flex: 1, paddingRight: 10 }}>
                                        <Text style={styles.detailsLabel}>Referred To</Text>
                                        <View style={styles.infoWithIcon}>
                                            <Feather name="user" size={16} color="#94A3B8" />
                                            <Text style={[styles.detailsValue, { flex: 1 }]}>
                                                {selectedReferral?.referredTo?.name || 'N/A'} 
                                                <Text style={{ color: '#94A3B8', fontWeight: '400' }}> ({selectedReferral?.referredTo?.role || 'provider'})</Text>
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.detailsLabel}>Referred By</Text>
                                        <View style={styles.infoWithIcon}>
                                            <Feather name="user" size={16} color="#94A3B8" />
                                            <Text style={[styles.detailsValue, { flex: 1 }]}>
                                                {selectedReferral?.referredBy?.name || 'N/A'} 
                                                <Text style={{ color: '#94A3B8', fontWeight: '400' }}> ({selectedReferral?.referredBy?.role || 'provider'})</Text>
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.detailsSection}>
                                    <Text style={styles.detailsLabel}>Date</Text>
                                    <View style={styles.infoWithIcon}>
                                        <Feather name="calendar" size={16} color="#94A3B8" />
                                        <Text style={styles.detailsValue}>
                                            {selectedReferral?.createdAt ? new Date(selectedReferral.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.detailsSection}>
                                    <Text style={styles.detailsLabel}>Specialization</Text>
                                    <View style={styles.infoWithIcon}>
                                        <MaterialCommunityIcons name="stethoscope" size={18} color="#94A3B8" />
                                        <Text style={styles.detailsValue}>{selectedReferral?.specialization || 'N/A'}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailsSection}>
                                    <Text style={styles.detailsLabel}>Reason for Referral</Text>
                                    <View style={styles.infoWithIcon}>
                                        <MaterialCommunityIcons name="file-document-outline" size={18} color="#94A3B8" />
                                        <Text style={styles.detailsValue}>{selectedReferral?.reason || 'N/A'}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailsSection}>
                                    <Text style={styles.detailsLabel}>Notes</Text>
                                    <View style={styles.infoWithIcon}>
                                        <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#94A3B8" />
                                        <Text style={[styles.detailsValue, { flex: 1 }]}>{selectedReferral?.notes || 'keep in touch with me'}</Text>
                                    </View>
                                </View>

                                <View style={styles.footerDivider} />
                                
                                <View style={styles.timestampContainer}>
                                    <Text style={styles.timestampText}>
                                        Created: {selectedReferral?.createdAt ? new Date(selectedReferral.createdAt).toLocaleString('en-GB').replace(',', '') : 'N/A'}
                                    </Text>
                                    <Text style={styles.timestampText}>
                                        Last Updated: {selectedReferral?.updatedAt ? new Date(selectedReferral.updatedAt).toLocaleString('en-GB').replace(',', '') : 'N/A'}
                                    </Text>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                <CustomAlert
                    visible={alertConfig.visible}
                    type={alertConfig.type}
                    message={alertConfig.message}
                    onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
                />
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
        backgroundColor: '#F8FAFC',
    },
    header: {
        padding: 15,
        backgroundColor: '#FFFFFF',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        borderWidth: 1,
        borderColor: '#4A90B9',
        borderRadius: 25,
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: 'center',
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    newReferralBtn: {
        width: wp(38),
        height: 44,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    tab: {
        paddingVertical: 12,
        marginRight: 20,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#4A90B9',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748B',
    },
    activeTabText: {
        color: '#4A90B9',
    },
    contentContainer: {
        padding: 15,
    },
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        minHeight: hp(60),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'visible', // Changed from 'hidden' to help with shadow calculations if needed
    },
    tableHead: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    tableHeadText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748B',
    },
    horizontalTableContainer: {
        minWidth: wp(200), // Ensures horizontal scroll is effective
    },
    tableBody: {
        flex: 1,
    },
    columnPatient: { width: wp(35) },
    columnReferred: { width: wp(45) },
    columnReason: { width: wp(55) },
    columnStatus: { width: wp(25) },
    columnDate: { width: wp(25) },
    columnActions: { width: wp(15), alignItems: 'flex-end' },
    tableRow: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        alignItems: 'center',
    },
    tableCellText: {
        fontSize: 13,
        color: '#1E293B',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusBadgePill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    actionSquareBtn: {
        width: 34,
        height: 34,
        borderWidth: 1.5,
        borderColor: '#06B6D4',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
        width: wp(100), // Center icon relative to screen width
    },
    emptyStateText: {
        marginTop: 10,
        fontSize: 16,
        color: '#64748B',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: hp(85),
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    modalBody: {
        flex: 1,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    toggleBtnActive: {
        backgroundColor: '#4A90B9',
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    toggleTextActive: {
        color: '#FFFFFF',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 14,
        color: '#1E293B',
        backgroundColor: '#FFFFFF',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 12,
    },
    // Details Modal Styles
    detailsModalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        width: '90%',
        alignSelf: 'center',
        maxHeight: hp(85),
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    detailsModalBody: {
        paddingTop: 10,
    },
    headerIconContainer: {
        width: 32,
        height: 32,
        backgroundColor: '#ECFEFF',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    detailsSection: {
        marginBottom: 20,
    },
    detailsLabel: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 8,
        fontWeight: '500',
    },
    infoWithIcon: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    detailsValue: {
        fontSize: 15,
        color: '#1E293B',
        fontWeight: '600',
    },
    footerDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 15,
    },
    timestampContainer: {
        gap: 4,
    },
    timestampText: {
        fontSize: 12,
        color: '#94A3B8',
    },
});

export default ReferralsScreen;
