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
import Gap from '../../component/gap';

const ReferralsScreen = () => {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'outgoing'
    const [showNewReferralModal, setShowNewReferralModal] = useState(false);
    
    // Form States
    const [referralType, setReferralType] = useState('Doctor'); // 'Doctor' or 'Nurse'
    const [selectedPatient, setSelectedPatient] = useState('');
    const [referredTo, setReferredTo] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');

    const patientOptions = [
        { label: 'John Doe', value: 'john_doe' },
        { label: 'Jane Smith', value: 'jane_smith' },
    ];

    const referredToOptions = [
        { label: 'Dr. House', value: 'dr_house' },
        { label: 'Dr. Strange', value: 'dr_strange' },
    ];

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
                                    <View style={styles.columnStatus}><Text style={styles.tableHeadText}>STATUS</Text></View>
                                    <View style={styles.columnDate}><Text style={styles.tableHeadText}>DATE</Text></View>
                                    <View style={styles.columnActions}><Text style={[styles.tableHeadText, { textAlign: 'right' }]}>ACTIONS</Text></View>
                                </View>
                                
                                {/* Empty state or List */}
                                <View style={styles.tableBody}>
                                    {renderEmptyState()}
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
                                    options={referredToOptions}
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
                                    <TouchableOpacity 
                                        style={styles.cancelBtn} 
                                        onPress={() => setShowNewReferralModal(false)}
                                    >
                                        <Text style={styles.cancelBtnText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.submitBtn}
                                        onPress={() => setShowNewReferralModal(false)}
                                    >
                                        <Text style={styles.submitBtnText}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                                <Gap height={20} />
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
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
        minWidth: wp(150), // Ensures horizontal scroll is effective
    },
    tableBody: {
        flex: 1,
    },
    columnPatient: { width: wp(40) },
    columnReferred: { width: wp(40) },
    columnStatus: { width: wp(25) },
    columnDate: { width: wp(25) },
    columnActions: { width: wp(20) },
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
    cancelBtn: {
        flex: 1,
        height: 48,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#4A90B9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelBtnText: {
        color: '#4A90B9',
        fontWeight: '600',
        fontSize: 15,
    },
    submitBtn: {
        flex: 1,
        height: 48,
        borderRadius: 10,
        backgroundColor: '#4A90B9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 15,
    },
});

export default ReferralsScreen;
