import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Switch,
    ScrollView,
    Modal,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import CustomCheckbox from '../../component/customCheckBox';
import PrimaryButton from '../../component/button';
import AddDoctorModal from './modals/AddDoctorModal';
import EditEmployeeModal from './modals/EditEmployeeModal';
import ManagePermissionsModal from './modals/ManagePermissionsModal';
import { ActivityIndicator } from 'react-native';
import { GetEmployees, SetEmployeeStatus, GetMyPermissions, GiveDirectorPrivilege, GetGroupPermissions, UpdateGroupPermissions, DeleteEmployee } from '../../Services/settingServices';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

interface Employee {
    id: string;
    name: string;
    lastName: string;
    email: string;
    pesel: string;
    pwz: string;
    status: string;
    role: string;
    individualPermissions?: string[];
    assignedOffices?: any[];
    isElevated?: boolean;
}

interface EmployeesProps {
    onAlert?: (config: { visible: boolean; type: string; message: string }) => void;
}

const Employees: React.FC<EmployeesProps> = ({ onAlert }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);

    const showAlert = (type: string, message: string) => {
        if (onAlert) {
            onAlert({ visible: true, type, message });
        }
    };

    const [activeTab, setActiveTab] = useState('doctors');
    const [searchLastName, setSearchLastName] = useState('');
    const [searchFirstName, setSearchFirstName] = useState('');
    const [searchPWZ, setSearchPWZ] = useState('');
    const [onlyActive, setOnlyActive] = useState(false);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [showRecordsPicker, setShowRecordsPicker] = useState(false);
    const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [permissionsEmployee, setPermissionsEmployee] = useState<Employee | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [myPermissions, setMyPermissions] = useState<string[]>([]);
    const [groupPermissions, setGroupPermissions] = useState<string[]>([]);
    const [showGroupPermissionsModal, setShowGroupPermissionsModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteEmployee, setDeleteEmployeeTarget] = useState<Employee | null>(null);
    const [deleting, setDeleting] = useState(false);
    const recordsOptions = [10, 25, 50];

    const employeeTabs = [
        'doctors',
        'nurses',
        'receptionists',
    ];

    const roleMapping: { [key: string]: string } = {
        'doctors': 'doctor',
        'nurses': 'nurse',
        'receptionists': 'receptionist',
    };

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: recordsPerPage,
                role: roleMapping[activeTab] || 'doctor'
            };
            const result = await GetEmployees(params);
            if (result?.data) {
                setEmployees(result.data.users || []);
                setTotalRecords(result.data.totalCount || 0);
            }
        } catch (error: any) {
            console.error('Fetch Employees Error:', error);
            showAlert('error', t('settings.employees.alerts.fetch_error'));
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (employeeId: string, currentStatus: string) => {
        try {
            const response = await SetEmployeeStatus(employeeId);
            if (response) {
                showAlert('success', t('settings.employees.alerts.status_success'));
                fetchEmployees();
            }
        } catch (error: any) {
            console.error('Toggle Status Error:', error);
            showAlert('error', error.message || t('settings.employees.alerts.status_error'));
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [activeTab, currentPage, recordsPerPage]);

    const handleToggleDirectorPrivilege = async (employeeId: string, currentIsElevated: boolean) => {
        try {
            const newElevated = !currentIsElevated;
            const response = await GiveDirectorPrivilege(employeeId, newElevated);
            if (response) {
                showAlert('success', newElevated ? t('settings.employees.alerts.director_granted') : t('settings.employees.alerts.director_revoked'));
                fetchEmployees();
            }
        } catch (error: any) {
            console.error('Toggle Director Privilege Error:', error);
            showAlert('error', error.message || t('settings.employees.alerts.director_error'));
        }
    };

    const handleDeleteEmployee = async () => {
        if (!deleteEmployee) return;
        setDeleting(true);
        try {
            const response = await DeleteEmployee(deleteEmployee.id);
            if (response) {
                setShowDeleteConfirm(false);
                setDeleteEmployeeTarget(null);
                showAlert('success', 'Employee deleted successfully.');
                fetchEmployees();
            }
        } catch (error: any) {
            console.error('Delete Employee Error:', error);
            showAlert('error', error.message || 'Failed to delete employee.');
        } finally {
            setDeleting(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetchMyPermissions = async () => {
                try {
                    const result = await GetMyPermissions();
                    if (result?.data) {
                        setMyPermissions(result.data.permissions || []);
                    }
                } catch (error: any) {
                    console.error('Fetch My Permissions Error:', error);
                }
            };
            fetchMyPermissions();
        }, [])
    );

    const fetchGroupPermissions = async (role: string) => {
        try {
            const result = await GetGroupPermissions(role);
            if (result?.data) {
                setGroupPermissions(result.data.permissions || result.data || []);
            }
        } catch (error: any) {
            console.error('Fetch Group Permissions Error:', error);
        }
    };

    useEffect(() => {
        const role = roleMapping[activeTab] || 'doctor';
        fetchGroupPermissions(role);
    }, [activeTab]);

    const handleDoctorModalSubmit = (doctorData: any) => {
        console.log('New Doctor Data:', doctorData);
        setShowAddDoctorModal(false);
        fetchEmployees(); // Refresh list after adding
    };

    return (
        <SafeAreaView style={ds.safeArea} edges={['bottom']}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.cardBackground} />
            <KeyboardAvoidingView
                style={ds.keyboardAvoidingContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
            <ScrollView
                style={ds.container}
                contentContainerStyle={{ paddingBottom: 30 }}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            >

                {/* Header */}
                <View style={ds.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                        <Ionicons name="chevron-back" size={24} color={tc.textPrimary} />
                    </TouchableOpacity>
                    <View style={ds.headerIconBox}>
                        <Feather name="users" size={22} color={tc.accent} />
                    </View>
                    <Text style={ds.headerTitle}>{t('settings.employees.title')}</Text>
                </View>

                {/* Main Card */}
                <View style={ds.card}>

                    {/* Category Tabs */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={ds.tabScrollView}
                        contentContainerStyle={ds.tabScrollContent}
                    >
                        {employeeTabs.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    ds.tabChip,
                                    activeTab === tab && ds.tabChipActive
                                ]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[
                                    ds.tabChipText,
                                    activeTab === tab && ds.tabChipTextActive
                                ]}>
                                    {t(`settings.employees.tabs.${tab}`)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Action Buttons Row */}
                    <View style={ds.actionsRow}>
                        <View style={ds.actionsLeft}>
                            <PrimaryButton
                                label={t('settings.employees.buttons.group_permissions')}
                                filled={false}
                                onPress={() => setShowGroupPermissionsModal(true)}
                                style={ds.outlineBtn}
                                image={undefined} iconStyle={undefined} imageStyle={undefined} loading={false} disabled={false}
                            />
                            <PrimaryButton
                                label={t('settings.employees.buttons.ratings')}
                                filled={false}
                                onPress={() => { }}
                                style={ds.outlineBtnSmall}
                                image={undefined} iconStyle={undefined} imageStyle={undefined} loading={false} disabled={false}
                            />
                        </View>
                        <PrimaryButton
                            label={t('settings.employees.buttons.add_employee', { role: t(`settings.employees.roles.${roleMapping[activeTab]}`) })}
                            filled={true}
                            onPress={() => setShowAddDoctorModal(true)}
                            style={ds.addBtn}
                            image={undefined} iconStyle={undefined} imageStyle={undefined} loading={false} disabled={false}
                        />
                    </View>

                    {/* Info Banner */}
                    <View style={ds.infoBanner}>
                        <Feather name="users" size={18} color={isDark ? '#60A5FA' : "#2563EB"} />
                        <Text style={ds.infoBannerText}>
                            {t('settings.employees.info_banner', { 
                                current: 3, 
                                max: 7, 
                                extra: "0" 
                            })}
                        </Text>
                    </View>

                    {/* Search Filters */}
                    <View style={ds.searchRow}>
                        <View style={ds.searchField}>
                            <Ionicons name="search-outline" size={16} color={tc.textMuted} style={ds.searchFieldIcon} />
                            <TextInput
                                style={ds.searchFieldInput}
                                placeholder={t('settings.employees.filters.lastName')}
                                placeholderTextColor={tc.textMuted}
                                value={searchLastName}
                                onChangeText={setSearchLastName}
                            />
                        </View>
                        <View style={ds.searchField}>
                            <Ionicons name="search-outline" size={16} color={tc.textMuted} style={ds.searchFieldIcon} />
                            <TextInput
                                style={ds.searchFieldInput}
                                placeholder={t('settings.employees.filters.firstName')}
                                placeholderTextColor={tc.textMuted}
                                value={searchFirstName}
                                onChangeText={setSearchFirstName}
                            />
                        </View>
                        {activeTab === 'doctors' && (
                            <View style={ds.searchField}>
                                <Ionicons name="search-outline" size={16} color={tc.textMuted} style={ds.searchFieldIcon} />
                                <TextInput
                                    style={ds.searchFieldInput}
                                    placeholder={t('settings.employees.filters.pwz')}
                                    placeholderTextColor={tc.textMuted}
                                    value={searchPWZ}
                                    onChangeText={setSearchPWZ}
                                />
                            </View>
                        )}
                    </View>

                    <View style={ds.filterExtrasRow}>
                        <CustomCheckbox label={t('settings.employees.filters.onlyActive')} checked={onlyActive} onChange={setOnlyActive} />
                        <TouchableOpacity style={ds.searchIconBtn}>
                            <Ionicons name="search" size={18} color={tc.accent} />
                        </TouchableOpacity>
                    </View>

                    {/* Horizontally Scrollable Table */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={true} style={ds.tableScrollView}>
                        <View style={ds.tableInner}>
                            {/* Table Header */}
                            <View style={ds.tableHeader}>
                                <Text style={[ds.tableHeaderCell, { width: 180 }]}>{t('settings.employees.table.name')}</Text>
                                <Text style={[ds.tableHeaderCell, { width: 140 }]}>{t('settings.employees.table.login')}</Text>
                                <Text style={[ds.tableHeaderCell, { width: 120 }]}>{t('settings.employees.table.pwz_pesel')}</Text>
                                <Text style={[ds.tableHeaderCell, { width: 140 }]}>{t('settings.employees.table.status')}</Text>
                                <Text style={[ds.tableHeaderCell, { width: 220, textAlign: 'right' }]}>{t('settings.employees.table.actions')}</Text>
                            </View>

                            {/* Employee Rows */}
                            {loading ? (
                                <View style={ds.loadingWrapper}>
                                    <ActivityIndicator size="large" color={tc.accent} />
                                    <Text style={ds.loadingText}>{t('settings.employees.table.loading')}</Text>
                                </View>
                            ) : employees.length > 0 ? (
                                employees.map((item) => (
                                    <View key={item.id} style={ds.tableRow}>
                                        <Text style={[ds.tableCell, ds.tableCellName, { width: 180 }]}>
                                            {`${item.lastName} ${item.name}`}
                                        </Text>
                                        <View style={{ width: 140 }}>
                                            <Text style={ds.tableCell}>NA</Text>
                                            <Text style={[ds.statusSubText, item.status === 'active' ? ds.statusActiveTextRow : ds.statusInactiveTextRow]}>
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </Text>
                                        </View>
                                        <Text style={[ds.tableCell, { width: 120 }]}>{item.pwz || item.pesel}</Text>
                                        <View style={{ width: 140, alignItems: 'center', justifyContent: 'center' }}>
                                            <Switch
                                                trackColor={{ false: tc.borderSubtle, true: tc.accent }}
                                                thumbColor={'#f4f3f4'}
                                                ios_backgroundColor={tc.borderSubtle}
                                                onValueChange={() => handleToggleStatus(item.id, item.status)}
                                                value={item.status === 'active'}
                                                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                            />
                                        </View>
                                        <View style={{ width: 220, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                                            <TouchableOpacity style={ds.rowActionBtnBlue} onPress={() => {
                                                setPermissionsEmployee(item);
                                                setShowPermissionsModal(true);
                                            }}>
                                                <Feather name="user-check" size={18} color={tc.accent} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={ds.rowActionBtnBlue} onPress={() => {
                                                setSelectedEmployee(item);
                                                setShowEditModal(true);
                                            }}>
                                                <Feather name="edit-3" size={18} color={tc.accent} />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={item.isElevated ? ds.rowActionBtnElevated : ds.rowActionBtnBlue}
                                                onPress={() => handleToggleDirectorPrivilege(item.id, !!item.isElevated)}
                                            >
                                                <Feather name="shield" size={18} color={item.isElevated ? '#FFFFFF' : tc.accent} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={ds.rowActionBtnRed} onPress={() => {
                                                setDeleteEmployeeTarget(item);
                                                setShowDeleteConfirm(true);
                                            }}>
                                                <Feather name="trash-2" size={18} color="#FF6B6B" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={ds.emptyState}>
                                    <Text style={ds.emptyStateText}>{t('settings.employees.table.empty')}</Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>

                    {/* Pagination */}
                    <View style={ds.paginationRow}>
                        <View>
                            <TouchableOpacity
                                style={ds.recordsDropdown}
                                onPress={() => setShowRecordsPicker(!showRecordsPicker)}
                            >
                                <Text style={ds.recordsDropdownText}>{recordsPerPage}</Text>
                                <Ionicons name={showRecordsPicker ? "chevron-up" : "chevron-down"} size={16} color={tc.textPrimary} />
                            </TouchableOpacity>
                            {showRecordsPicker && (
                                <View style={ds.recordsPickerOverlay}>
                                    {recordsOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                ds.recordsPickerItem,
                                                recordsPerPage === option && ds.recordsPickerItemActive
                                            ]}
                                            onPress={() => {
                                                setRecordsPerPage(option);
                                                setShowRecordsPicker(false);
                                            }}
                                        >
                                            <Text style={[
                                                ds.recordsPickerItemText,
                                                recordsPerPage === option && ds.recordsPickerItemTextActive
                                            ]}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                        <Text style={ds.paginationInfo}>{t('settings.employees.pagination.records_per_page')}</Text>
                        <View style={ds.paginationControls}>
                            <TouchableOpacity 
                                style={[ds.paginationBtn, currentPage === 1 && { opacity: 0.5 }]}
                                disabled={currentPage === 1}
                                onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            >
                                <Text style={ds.paginationBtnText}>{t('settings.employees.pagination.prev')}</Text>
                            </TouchableOpacity>
                            <View style={ds.pageNumber}>
                                <Text style={ds.pageNumberText}>{currentPage}</Text>
                            </View>
                            <TouchableOpacity 
                                style={[ds.paginationBtn, (currentPage * recordsPerPage) >= totalRecords && { opacity: 0.5 }]}
                                disabled={(currentPage * recordsPerPage) >= totalRecords}
                                onPress={() => setCurrentPage(prev => prev + 1)}
                            >
                                <Text style={ds.paginationBtnText}>{t('settings.employees.pagination.next')}</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={ds.paginationTotal}>{t('settings.employees.pagination.total', { total: totalRecords })}</Text>
                    </View>
                </View>

            </ScrollView>
            </KeyboardAvoidingView>

            <AddDoctorModal
                visible={showAddDoctorModal}
                onClose={() => setShowAddDoctorModal(false)}
                onAdd={handleDoctorModalSubmit}
                onAlert={onAlert}
                activeTab={activeTab}
            />
            <EditEmployeeModal
                visible={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedEmployee(null);
                }}
                onSave={() => {
                    setShowEditModal(false);
                    setSelectedEmployee(null);
                    fetchEmployees();
                    showAlert('success', t('settings.employees.alerts.update_success'));
                }}
                employee={selectedEmployee}
            />
            <ManagePermissionsModal
                visible={showPermissionsModal}
                onClose={() => {
                    setShowPermissionsModal(false);
                    setPermissionsEmployee(null);
                }}
                onSave={() => {
                    setShowPermissionsModal(false);
                    setPermissionsEmployee(null);
                    fetchEmployees();
                    showAlert('success', t('settings.employees.alerts.permissions_success'));
                }}
                employeeId={permissionsEmployee?.id || null}
                employeeName={permissionsEmployee ? `${permissionsEmployee.name} ${permissionsEmployee.lastName}` : ''}
                initialPermissions={permissionsEmployee?.individualPermissions || []}
            />
            <ManagePermissionsModal
                visible={showGroupPermissionsModal}
                onClose={() => setShowGroupPermissionsModal(false)}
                onSave={() => {
                    setShowGroupPermissionsModal(false);
                    const role = roleMapping[activeTab] || 'doctor';
                    fetchGroupPermissions(role);
                    fetchEmployees();
                    showAlert('success', t('settings.employees.alerts.group_permissions_success'));
                }}
                employeeId={null}
                initialPermissions={groupPermissions}
                title={t('settings.employees.buttons.group_permissions')}
                onSavePermissions={async (permissions) => {
                    const role = roleMapping[activeTab] || 'doctor';
                    return await UpdateGroupPermissions({ role, permissions });
                }}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                visible={showDeleteConfirm}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {
                    setShowDeleteConfirm(false);
                    setDeleteEmployeeTarget(null);
                }}
            >
                <View style={ds.deleteModalOverlay}>
                    <View style={ds.deleteModalContent}>
                        <View style={ds.deleteIconContainer}>
                            <Feather name="alert-triangle" size={32} color="#FF6B6B" />
                        </View>
                        <Text style={ds.deleteModalTitle}>{t('settings.employees.delete_modal.title')}</Text>
                        <Text style={ds.deleteModalMessage}>
                            {t('settings.employees.delete_modal.message', { name: `${deleteEmployee?.name} ${deleteEmployee?.lastName}` })}
                        </Text>
                        <View style={ds.deleteModalButtons}>
                            <TouchableOpacity
                                style={ds.deleteModalCancelBtn}
                                onPress={() => {
                                    setShowDeleteConfirm(false);
                                    setDeleteEmployeeTarget(null);
                                }}
                            >
                                <Text style={ds.deleteModalCancelText}>{t('settings.employees.delete_modal.cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[ds.deleteModalDeleteBtn, deleting && { opacity: 0.6 }]}
                                onPress={handleDeleteEmployee}
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={ds.deleteModalDeleteText}>{t('settings.employees.delete_modal.delete')}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: tc.cardBackground,
    },
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: tc.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    headerIconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.15)' : '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    loadingWrapper: {
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 660,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: tc.textSecondary,
    },
    card: {
        backgroundColor: tc.cardBackground,
        marginHorizontal: 1,
        marginTop: 12,
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: tc.borderSubtle,
    },
    tabScrollView: {
        marginBottom: 16,
    },
    tabScrollContent: {
        gap: 10,
    },
    tabChip: {
        paddingVertical: 9,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: tc.screenBackground,
        borderWidth: 1,
        borderColor: tc.borderSubtle,
    },
    tabChipActive: {
        backgroundColor: tc.accent,
        borderColor: tc.accent,
    },
    tabChipText: {
        fontSize: 15,
        fontWeight: '500',
        color: tc.textSecondary,
    },
    tabChipTextActive: {
        color: '#FFFFFF',
    },
    actionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        gap: 10,
    },
    actionsLeft: {
        flexDirection: 'row',
        gap: 10,
    },
    outlineBtn: {
        width: 'auto',
        paddingHorizontal: 14,
        height: hp(4.5),
        marginBottom: 0,
        borderRadius: 8,
    },
    outlineBtnSmall: {
        width: 'auto',
        paddingHorizontal: 14,
        height: hp(4.5),
        marginBottom: 0,
        borderRadius: 8,
    },
    addBtn: {
        width: '100%',
        height: hp(5),
        marginBottom: 0,
        borderRadius: 8,
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF',
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
        gap: 10,
        borderWidth: isDark ? 1 : 0,
        borderColor: 'rgba(59, 130, 246, 0.2)',
    },
    infoBannerText: {
        flex: 1,
        fontSize: 14,
        color: isDark ? '#60A5FA' : '#2563EB',
        lineHeight: 21,
    },
    searchRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 12,
    },
    searchField: {
        flex: 1,
        minWidth: wp(28),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tc.screenBackground,
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 42,
    },
    searchFieldIcon: {
        marginRight: 6,
    },
    searchFieldInput: {
        flex: 1,
        fontSize: 15,
        color: tc.textPrimary,
        padding: 0,
    },
    filterExtrasRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
        marginBottom: 16,
    },
    searchIconBtn: {
        width: 38,
        height: 38,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: tc.borderColor,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: tc.screenBackground,
    },
    tableScrollView: {
        marginBottom: 8,
    },
    tableInner: {
        minWidth: 660,
    },
    tableHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
        backgroundColor: tc.screenBackground,
    },
    tableHeaderCell: {
        fontSize: 12,
        fontWeight: '700',
        color: tc.textMuted,
        letterSpacing: 0.5,
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    tableCell: {
        fontSize: 14,
        color: tc.textSecondary,
    },
    tableCellName: {
        fontWeight: '600',
        color: tc.textPrimary,
    },
    statusSubText: {
        fontSize: 12,
        marginTop: 2,
    },
    statusActiveTextRow: {
        color: '#10B981',
    },
    statusInactiveTextRow: {
        color: tc.textMuted,
    },
    rowActionBtnBlue: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: tc.accent,
        backgroundColor: tc.cardBackground,
    },
    rowActionBtnElevated: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: tc.accent,
        backgroundColor: tc.accent,
    },
    rowActionBtnRed: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#FF6B6B',
        backgroundColor: tc.cardBackground,
    },
    emptyState: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 16,
        color: tc.textMuted,
    },
    paginationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: tc.borderSubtle,
        marginTop: 4,
    },
    paginationInfo: {
        fontSize: 14,
        color: tc.textSecondary,
    },
    paginationControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    paginationBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: tc.screenBackground,
        borderWidth: 1,
        borderColor: tc.borderColor,
    },
    paginationBtnText: {
        fontSize: 14,
        color: tc.textPrimary,
        fontWeight: '500',
    },
    pageNumber: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: tc.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageNumberText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    paginationTotal: {
        fontSize: 14,
        color: tc.textSecondary,
    },
    recordsDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 6,
        backgroundColor: tc.screenBackground,
    },
    recordsDropdownText: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textPrimary,
    },
    recordsPickerOverlay: {
        position: 'absolute',
        bottom: 44,
        left: 0,
        backgroundColor: tc.cardBackground,
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 10,
        minWidth: 70,
    },
    recordsPickerItem: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    recordsPickerItemActive: {
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.2)' : '#EBF5FF',
    },
    recordsPickerItemText: {
        fontSize: 14,
        color: tc.textPrimary,
        textAlign: 'center',
    },
    recordsPickerItemTextActive: {
        color: tc.accent,
        fontWeight: '700',
    },
    deleteModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteModalContent: {
        width: wp(85),
        backgroundColor: tc.cardBackground,
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    deleteIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    deleteModalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: tc.textPrimary,
        marginBottom: 8,
    },
    deleteModalMessage: {
        fontSize: 15,
        color: tc.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    deleteModalButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    deleteModalCancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: tc.borderColor,
        backgroundColor: tc.screenBackground,
        alignItems: 'center',
    },
    deleteModalCancelText: {
        fontSize: 15,
        fontWeight: '600',
        color: tc.textSecondary,
    },
    deleteModalDeleteBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#FF6B6B',
        alignItems: 'center',
    },
    deleteModalDeleteText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default Employees;