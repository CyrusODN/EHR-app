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
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

const ReferralsScreen = () => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
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
            showAlert('warning', t('referrals.messages.requiredFields'));
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
                showAlert('success', t('referrals.messages.success'));
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
            showAlert('error', t('referrals.messages.error'));
        } finally {
            setLoading(false);
        }
    };

    const renderEmptyState = () => (
        <View style={ds.emptyStateContainer}>
            <MaterialCommunityIcons name="inbox-outline" size={60} color={tc.textMuted} />
            <Text style={ds.emptyStateText}>
                {activeTab === 'incoming' ? t('referrals.emptyIncoming') : t('referrals.emptyOutgoing')}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={ds.safeArea}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.statusBarBg} />
            <View style={ds.container}>
                {/* Header */}
                <View style={ds.header}>
                    <View style={ds.headerTop}>
                        <View style={ds.headerTitleContainer}>
                            <TouchableOpacity
                                style={ds.backButton}
                                onPress={() => navigation.goBack()}
                            >
                                <Ionicons name="arrow-back" size={20} color={tc.accent} />
                            </TouchableOpacity>
                            <Text style={ds.headerTitle}>{t('referrals.title')}</Text>
                        </View>
                        <PrimaryButton
                            label={t('referrals.newReferral')}
                            filled={true}
                            onPress={() => setShowNewReferralModal(true)}
                            style={ds.newReferralBtn}
                            icon={<Feather name="plus" size={18} color="white" />}
                            loading={false}
                            disabled={false}
                        />
                    </View>
                </View>

                {/* Tabs */}
                <View style={ds.tabContainer}>
                    <TouchableOpacity
                        style={[ds.tab, activeTab === 'incoming' && ds.activeTab]}
                        onPress={() => setActiveTab('incoming')}
                    >
                        <Text style={[ds.tabText, activeTab === 'incoming' && ds.activeTabText]}>
                            {t('referrals.incoming')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[ds.tab, activeTab === 'outgoing' && ds.activeTab]}
                        onPress={() => setActiveTab('outgoing')}
                    >
                        <Text style={[ds.tabText, activeTab === 'outgoing' && ds.activeTabText]}>
                            {t('referrals.outgoing')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView contentContainerStyle={ds.contentContainer}>
                    <View style={ds.cardContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={ds.horizontalTableContainer}>
                                {/* Column Headers */}
                                <View style={ds.tableHead}>
                                    <View style={ds.columnPatient}><Text style={ds.tableHeadText}>{t('referrals.table.patient')}</Text></View>
                                    <View style={ds.columnReferred}>
                                        <Text style={ds.tableHeadText}>
                                            {activeTab === 'incoming' ? t('referrals.table.referredBy') : t('referrals.table.referredTo')}
                                        </Text>
                                    </View>
                                    <View style={ds.columnReason}><Text style={ds.tableHeadText}>{t('referrals.table.reason')}</Text></View>
                                    <View style={ds.columnStatus}><Text style={ds.tableHeadText}>{t('referrals.table.status')}</Text></View>
                                    <View style={ds.columnDate}><Text style={ds.tableHeadText}>{t('referrals.table.date')}</Text></View>
                                    <View style={ds.columnActions}><Text style={[ds.tableHeadText, { textAlign: 'right' }]}>{t('referrals.table.actions')}</Text></View>
                                </View>
                                
                                {/* Empty state or List */}
                                <View style={ds.tableBody}>
                                    {referrals.length === 0 ? renderEmptyState() : referrals.map((item, index) => (
                                        <View key={item.id || index} style={ds.tableRow}>
                                            <View style={[ds.columnPatient, { paddingRight: 8 }]}>
                                                <Text style={[ds.tableCellText, { fontWeight: '700' }]} numberOfLines={1} ellipsizeMode="tail">{item.patient?.name || t('patientDetailsModal.empty.na')}</Text>
                                            </View>
                                            <View style={[ds.columnReferred, { paddingRight: 8 }]}>
                                                {activeTab === 'incoming' ? (
                                                    <Text style={ds.tableCellText} numberOfLines={1} ellipsizeMode="tail">
                                                        {item.referredBy?.name || t('common.na')} <Text style={{ color: tc.textMuted }}>({item.referredBy?.role || t('referrals.details.provider')})</Text>
                                                    </Text>
                                                ) : (
                                                    <Text style={ds.tableCellText} numberOfLines={1} ellipsizeMode="tail">
                                                        {item.referredTo?.name || t('common.na')} <Text style={{ color: tc.textMuted }}>({item.referredTo?.role || t('referrals.details.provider')})</Text>
                                                    </Text>
                                                )}
                                            </View>
                                            <View style={ds.columnReason}>
                                                <Text style={[ds.tableCellText, { fontWeight: '700' }]} numberOfLines={1}>{item.reason || t('common.na')}</Text>
                                            </View>
                                            <View style={ds.columnStatus}>
                                                <View style={[ds.statusBadge, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF9C3' }]}>
                                                    <Text style={[ds.statusText, { color: isDark ? '#F59E0B' : '#854D0E' }]}>
                                                        {item.status ? (item.status.charAt(0).toUpperCase() + item.status.slice(1)) : t('appointments.filters.status.scheduled')}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={ds.columnDate}>
                                                <Text style={ds.tableCellText}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString(t('common.dateLocale') || 'en-GB') : t('common.na')}</Text>
                                            </View>
                                            <View style={ds.columnActions}>
                                                <TouchableOpacity 
                                                    style={ds.actionSquareBtn}
                                                    onPress={() => {
                                                        setSelectedReferral(item);
                                                        setShowDetailsModal(true);
                                                    }}
                                                >
                                                    <Feather name="eye" size={18} color={tc.accent} />
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
                    <View style={ds.modalOverlay}>
                        <View style={ds.modalContent}>
                            <View style={ds.modalHeader}>
                                <Text style={ds.modalTitle}>{t('referrals.modal.title')}</Text>
                                <TouchableOpacity onPress={() => setShowNewReferralModal(false)}>
                                    <Feather name="x" size={24} color={tc.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={ds.modalBody} showsVerticalScrollIndicator={false}>
                                {/* Toggle Doctor/Nurse */}
                                <View style={ds.toggleContainer}>
                                    <TouchableOpacity
                                        style={[ds.toggleBtn, referralType === 'Doctor' && ds.toggleBtnActive]}
                                        onPress={() => setReferralType('Doctor')}
                                    >
                                        <Text style={[ds.toggleText, referralType === 'Doctor' && ds.toggleTextActive]}>{t('referrals.modal.doctor')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[ds.toggleBtn, referralType === 'Nurse' && ds.toggleBtnActive]}
                                        onPress={() => setReferralType('Nurse')}
                                    >
                                        <Text style={[ds.toggleText, referralType === 'Nurse' && ds.toggleTextActive]}>{t('referrals.modal.nurse')}</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={ds.inputLabel}>{t('referrals.modal.patient')}</Text>
                                <CustomDropdown
                                    placeholder={t('referrals.modal.placeholders.patient')}
                                    options={patientOptions}
                                    value={selectedPatient}
                                    onChange={(val: any) => setSelectedPatient(val)}
                                />
                                <Gap height={15} />

                                <Text style={ds.inputLabel}>{t('referrals.modal.referredTo')}</Text>
                                <CustomDropdown
                                    placeholder={t('referrals.modal.placeholders.provider')}
                                    options={employeesOptions}
                                    value={referredTo}
                                    onChange={(val: any) => setReferredTo(val)}
                                />
                                <Gap height={15} />

                                <Text style={ds.inputLabel}>{t('referrals.modal.specialization')}</Text>
                                <TextInput
                                    style={ds.textInput}
                                    placeholder={t('referrals.modal.placeholders.specialization')}
                                    placeholderTextColor={tc.textMuted}
                                    value={specialization}
                                    onChangeText={setSpecialization}
                                />
                                <Gap height={15} />

                                <Text style={ds.inputLabel}>{t('referrals.modal.reason')}</Text>
                                <TextInput
                                    style={[ds.textInput, ds.textArea]}
                                    placeholder={t('referrals.modal.placeholders.reason')}
                                    placeholderTextColor={tc.textMuted}
                                    value={reason}
                                    onChangeText={setReason}
                                    multiline={true}
                                    numberOfLines={4}
                                />
                                <Gap height={15} />

                                <Text style={ds.inputLabel}>{t('referrals.modal.notes')}</Text>
                                <TextInput
                                    style={[ds.textInput, ds.textArea]}
                                    placeholder={t('referrals.modal.placeholders.notes')}
                                    placeholderTextColor={tc.textMuted}
                                    value={notes}
                                    onChangeText={setNotes}
                                    multiline={true}
                                    numberOfLines={4}
                                />
                                
                                <Gap height={30} />
                                
                                <View style={ds.modalFooter}>
                                    <PrimaryButton
                                        label={t('common.cancel')}
                                        filled={false}
                                        onPress={() => setShowNewReferralModal(false)}
                                        style={{ flex: 1 }}
                                        loading={false}
                                        disabled={loading}
                                    />
                                    <PrimaryButton
                                        label={t('common.save')}
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
                    <View style={[ds.modalOverlay, { justifyContent: 'center' }]}>
                        <View style={ds.detailsModalContent}>
                            <View style={ds.modalHeader}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={ds.headerIconContainer}>
                                        <MaterialCommunityIcons name="clipboard-text-outline" size={20} color={tc.accent} />
                                    </View>
                                    <Text style={ds.modalTitle}>{t('referrals.details.title')}</Text>
                                </View>
                                <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                                    <Feather name="x" size={24} color={tc.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={ds.detailsModalBody} showsVerticalScrollIndicator={false}>
                                <View style={ds.detailsRow}>
                                    <View style={{ flex: 1, paddingRight: 10 }}>
                                        <Text style={ds.detailsLabel}>{t('referrals.details.patient')}</Text>
                                        <View style={ds.infoWithIcon}>
                                            <Feather name="user" size={16} color={tc.textMuted} />
                                            <Text style={[ds.detailsValue, { flex: 1 }]}>{selectedReferral?.patient?.name || t('common.na')}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Text style={[ds.detailsLabel, { textAlign: 'right', marginRight: 10 }]}>{t('referrals.details.status')}</Text>
                                        <View style={[ds.statusBadgePill, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF9C3' }]}>
                                            <Feather name="clock" size={12} color={isDark ? '#F59E0B' : '#854D0E'} style={{ marginRight: 4 }} />
                                            <Text style={[ds.statusText, { color: isDark ? '#F59E0B' : '#854D0E' }]}>
                                                {selectedReferral?.status ? (selectedReferral.status.charAt(0).toUpperCase() + selectedReferral.status.slice(1)) : t('appointments.filters.status.scheduled')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={ds.detailsRow}>
                                    <View style={{ flex: 1, paddingRight: 10 }}>
                                        <Text style={ds.detailsLabel}>{t('referrals.details.referredTo')}</Text>
                                        <View style={ds.infoWithIcon}>
                                            <Feather name="user" size={16} color={tc.textMuted} />
                                            <Text style={[ds.detailsValue, { flex: 1 }]}>
                                                {selectedReferral?.referredTo?.name || t('common.na')} 
                                                <Text style={{ color: tc.textMuted, fontWeight: '400' }}> ({selectedReferral?.referredTo?.role || t('referrals.details.provider')})</Text>
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={ds.detailsLabel}>{t('referrals.details.referredBy')}</Text>
                                        <View style={ds.infoWithIcon}>
                                            <Feather name="user" size={16} color={tc.textMuted} />
                                            <Text style={[ds.detailsValue, { flex: 1 }]}>
                                                {selectedReferral?.referredBy?.name || t('common.na')} 
                                                <Text style={{ color: tc.textMuted, fontWeight: '400' }}> ({selectedReferral?.referredBy?.role || t('referrals.details.provider')})</Text>
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={ds.detailsSection}>
                                    <Text style={ds.detailsLabel}>{t('referrals.details.date')}</Text>
                                    <View style={ds.infoWithIcon}>
                                        <Feather name="calendar" size={16} color={tc.textMuted} />
                                        <Text style={ds.detailsValue}>
                                            {selectedReferral?.createdAt ? new Date(selectedReferral.createdAt).toLocaleDateString(t('common.dateLocale') || 'en-GB') : t('common.na')}
                                        </Text>
                                    </View>
                                </View>

                                <View style={ds.detailsSection}>
                                    <Text style={ds.detailsLabel}>{t('referrals.details.specialization')}</Text>
                                    <View style={ds.infoWithIcon}>
                                        <MaterialCommunityIcons name="stethoscope" size={18} color={tc.textMuted} />
                                        <Text style={ds.detailsValue}>{selectedReferral?.specialization || t('common.na')}</Text>
                                    </View>
                                </View>

                                <View style={ds.detailsSection}>
                                    <Text style={ds.detailsLabel}>{t('referrals.details.reason')}</Text>
                                    <View style={ds.infoWithIcon}>
                                        <MaterialCommunityIcons name="file-document-outline" size={18} color={tc.textMuted} />
                                        <Text style={ds.detailsValue}>{selectedReferral?.reason || t('common.na')}</Text>
                                    </View>
                                </View>

                                <View style={ds.detailsSection}>
                                    <Text style={ds.detailsLabel}>{t('referrals.details.notes')}</Text>
                                    <View style={ds.infoWithIcon}>
                                        <MaterialCommunityIcons name="alert-circle-outline" size={18} color={tc.textMuted} />
                                        <Text style={[ds.detailsValue, { flex: 1 }]}>{selectedReferral?.notes || t('referrals.details.noNotes')}</Text>
                                    </View>
                                </View>

                                <View style={ds.footerDivider} />
                                
                                <View style={ds.timestampContainer}>
                                    <Text style={ds.timestampText}>
                                        {t('referrals.details.created')}: {selectedReferral?.createdAt ? new Date(selectedReferral.createdAt).toLocaleString(t('common.dateTimeLocale') || 'en-GB').replace(',', '') : t('common.na')}
                                    </Text>
                                    <Text style={ds.timestampText}>
                                        {t('referrals.details.lastUpdated')}: {selectedReferral?.updatedAt ? new Date(selectedReferral.updatedAt).toLocaleString(t('common.dateTimeLocale') || 'en-GB').replace(',', '') : t('common.na')}
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

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: tc.statusBarBg,
    },
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    header: {
        padding: 15,
        backgroundColor: tc.headerBg,
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
        borderColor: tc.accent,
        borderRadius: 25,
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: 'center',
        marginRight: 10,
        backgroundColor: tc.accentLight,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    newReferralBtn: {
        width: wp(38),
        height: 44,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: tc.headerBg,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
    },
    tab: {
        paddingVertical: 12,
        marginRight: 20,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: tc.accent,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: tc.textSecondary,
    },
    activeTabText: {
        color: tc.accent,
    },
    contentContainer: {
        padding: 15,
    },
    cardContainer: {
        backgroundColor: tc.cardBackground,
        borderRadius: 12,
        minHeight: hp(60),
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'visible',
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    tableHead: {
        flexDirection: 'row',
        backgroundColor: tc.cardBackgroundAlt,
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
    },
    tableHeadText: {
        fontSize: 13,
        fontWeight: '700',
        color: tc.textSecondary,
    },
    horizontalTableContainer: {
        minWidth: wp(200),
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
        borderBottomColor: tc.borderLight,
        alignItems: 'center',
    },
    tableCellText: {
        fontSize: 13,
        color: tc.textPrimary,
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
        borderColor: tc.accent,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
        width: wp(100),
    },
    emptyStateText: {
        marginTop: 10,
        fontSize: 16,
        color: tc.textSecondary,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: tc.modalBg,
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
        borderBottomColor: tc.borderColor,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    modalBody: {
        flex: 1,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: tc.buttonMutedBg,
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
        backgroundColor: tc.accent,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textSecondary,
    },
    toggleTextActive: {
        color: '#FFFFFF',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textSecondary,
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 14,
        color: tc.textPrimary,
        backgroundColor: tc.inputBackground,
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
        backgroundColor: tc.modalBg,
        borderRadius: 16,
        width: '90%',
        alignSelf: 'center',
        maxHeight: hp(85),
        padding: 20,
        elevation: 5,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    detailsModalBody: {
        paddingTop: 10,
    },
    headerIconContainer: {
        width: 32,
        height: 32,
        backgroundColor: tc.accentLight,
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
        color: tc.textSecondary,
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
        color: tc.textPrimary,
        fontWeight: '600',
    },
    footerDivider: {
        height: 1,
        backgroundColor: tc.divider,
        marginVertical: 15,
    },
    timestampContainer: {
        gap: 4,
    },
    timestampText: {
        fontSize: 12,
        color: tc.textMuted,
    },
});

export default ReferralsScreen;
