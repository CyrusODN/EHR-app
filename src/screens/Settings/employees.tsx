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
    Modal
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
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.headerIconBox}>
                        <Feather name="users" size={22} color="#4A90B9" />
                    </View>
                    <Text style={styles.headerTitle}>{t('settings.employees.title')}</Text>
                </View>

                {/* Main Card */}
                <View style={styles.card}>

                    {/* Category Tabs */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.tabScrollView}
                        contentContainerStyle={styles.tabScrollContent}
                    >
                        {employeeTabs.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    styles.tabChip,
                                    activeTab === tab && styles.tabChipActive
                                ]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[
                                    styles.tabChipText,
                                    activeTab === tab && styles.tabChipTextActive
                                ]}>
                                    {t(`settings.employees.tabs.${tab}`)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Action Buttons Row */}
                    <View style={styles.actionsRow}>
                        <View style={styles.actionsLeft}>
                            <PrimaryButton
                                label={t('settings.employees.buttons.group_permissions')}
                                filled={false}
                                onPress={() => setShowGroupPermissionsModal(true)}
                                style={styles.outlineBtn}
                                image={undefined} iconStyle={undefined} imageStyle={undefined} loading={false} disabled={false}
                            />
                            <PrimaryButton
                                label={t('settings.employees.buttons.ratings')}
                                filled={false}
                                onPress={() => { }}
                                style={styles.outlineBtnSmall}
                                image={undefined} iconStyle={undefined} imageStyle={undefined} loading={false} disabled={false}
                            />
                        </View>
                        <PrimaryButton
                            label={t('settings.employees.buttons.add_employee', { role: t(`settings.employees.roles.${roleMapping[activeTab]}`) })}
                            filled={true}
                            onPress={() => setShowAddDoctorModal(true)}
                            style={styles.addBtn}
                            image={undefined} iconStyle={undefined} imageStyle={undefined} loading={false} disabled={false}
                        />
                    </View>

                    {/* Info Banner */}
                    <View style={styles.infoBanner}>
                        <Feather name="users" size={18} color="#2563EB" />
                        <Text style={styles.infoBannerText}>
                            {t('settings.employees.info_banner', { 
                                current: 3, 
                                max: 7, 
                                extra: "0" 
                            })}
                        </Text>
                    </View>

                    {/* Search Filters */}
                    <View style={styles.searchRow}>
                        <View style={styles.searchField}>
                            <Ionicons name="search-outline" size={16} color="#9CA3AF" style={styles.searchFieldIcon} />
                            <TextInput
                                style={styles.searchFieldInput}
                                placeholder={t('settings.employees.filters.lastName')}
                                placeholderTextColor="#9CA3AF"
                                value={searchLastName}
                                onChangeText={setSearchLastName}
                            />
                        </View>
                        <View style={styles.searchField}>
                            <Ionicons name="search-outline" size={16} color="#9CA3AF" style={styles.searchFieldIcon} />
                            <TextInput
                                style={styles.searchFieldInput}
                                placeholder={t('settings.employees.filters.firstName')}
                                placeholderTextColor="#9CA3AF"
                                value={searchFirstName}
                                onChangeText={setSearchFirstName}
                            />
                        </View>
                        {activeTab === 'doctors' && (
                            <View style={styles.searchField}>
                                <Ionicons name="search-outline" size={16} color="#9CA3AF" style={styles.searchFieldIcon} />
                                <TextInput
                                    style={styles.searchFieldInput}
                                    placeholder={t('settings.employees.filters.pwz')}
                                    placeholderTextColor="#9CA3AF"
                                    value={searchPWZ}
                                    onChangeText={setSearchPWZ}
                                />
                            </View>
                        )}
                    </View>

                    <View style={styles.filterExtrasRow}>
                        <CustomCheckbox label={t('settings.employees.filters.onlyActive')} checked={onlyActive} onChange={setOnlyActive} />
                        <TouchableOpacity style={styles.searchIconBtn}>
                            <Ionicons name="search" size={18} color="#4A90B9" />
                        </TouchableOpacity>
                    </View>

                    {/* Horizontally Scrollable Table */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScrollView}>
                        <View style={styles.tableInner}>
                            {/* Table Header */}
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderCell, { width: 180 }]}>{t('settings.employees.table.name')}</Text>
                                <Text style={[styles.tableHeaderCell, { width: 140 }]}>{t('settings.employees.table.login')}</Text>
                                <Text style={[styles.tableHeaderCell, { width: 120 }]}>{t('settings.employees.table.pwz_pesel')}</Text>
                                <Text style={[styles.tableHeaderCell, { width: 140 }]}>{t('settings.employees.table.status')}</Text>
                                <Text style={[styles.tableHeaderCell, { width: 220, textAlign: 'right' }]}>{t('settings.employees.table.actions')}</Text>
                            </View>

                            {/* Employee Rows */}
                            {loading ? (
                                <View style={styles.loadingWrapper}>
                                    <ActivityIndicator size="large" color="#4A90B9" />
                                    <Text style={styles.loadingText}>{t('settings.employees.table.loading')}</Text>
                                </View>
                            ) : employees.length > 0 ? (
                                employees.map((item) => (
                                    <View key={item.id} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, styles.tableCellName, { width: 180 }]}>
                                            {`${item.lastName} ${item.name}`}
                                        </Text>
                                        <View style={{ width: 140 }}>
                                            <Text style={styles.tableCell}>NA</Text>
                                            <Text style={[styles.statusSubText, item.status === 'active' ? styles.statusActiveTextRow : styles.statusInactiveTextRow]}>
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </Text>
                                        </View>
                                        <Text style={[styles.tableCell, { width: 120 }]}>{item.pwz || item.pesel}</Text>
                                        <View style={{ width: 140, alignItems: 'center', justifyContent: 'center' }}>
                                            <Switch
                                                trackColor={{ false: '#E2E8F0', true: '#4A90B9' }}
                                                thumbColor={'#f4f3f4'}
                                                ios_backgroundColor="#E2E8F0"
                                                onValueChange={() => handleToggleStatus(item.id, item.status)}
                                                value={item.status === 'active'}
                                                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                            />
                                        </View>
                                        <View style={{ width: 220, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                                            <TouchableOpacity style={styles.rowActionBtnBlue} onPress={() => {
                                                setPermissionsEmployee(item);
                                                setShowPermissionsModal(true);
                                            }}>
                                                <Feather name="user-check" size={18} color="#4A90B9" />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.rowActionBtnBlue} onPress={() => {
                                                setSelectedEmployee(item);
                                                setShowEditModal(true);
                                            }}>
                                                <Feather name="edit-3" size={18} color="#4A90B9" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={item.isElevated ? styles.rowActionBtnElevated : styles.rowActionBtnBlue}
                                                onPress={() => handleToggleDirectorPrivilege(item.id, !!item.isElevated)}
                                            >
                                                <Feather name="shield" size={18} color={item.isElevated ? '#FFFFFF' : '#4A90B9'} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.rowActionBtnRed} onPress={() => {
                                                setDeleteEmployeeTarget(item);
                                                setShowDeleteConfirm(true);
                                            }}>
                                                <Feather name="trash-2" size={18} color="#FF6B6B" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyStateText}>{t('settings.employees.table.empty')}</Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>

                    {/* Pagination */}
                    <View style={styles.paginationRow}>
                        <View>
                            <TouchableOpacity
                                style={styles.recordsDropdown}
                                onPress={() => setShowRecordsPicker(!showRecordsPicker)}
                            >
                                <Text style={styles.recordsDropdownText}>{recordsPerPage}</Text>
                                <Ionicons name={showRecordsPicker ? "chevron-up" : "chevron-down"} size={16} color="#374151" />
                            </TouchableOpacity>
                            {showRecordsPicker && (
                                <View style={styles.recordsPickerOverlay}>
                                    {recordsOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                styles.recordsPickerItem,
                                                recordsPerPage === option && styles.recordsPickerItemActive
                                            ]}
                                            onPress={() => {
                                                setRecordsPerPage(option);
                                                setShowRecordsPicker(false);
                                            }}
                                        >
                                            <Text style={[
                                                styles.recordsPickerItemText,
                                                recordsPerPage === option && styles.recordsPickerItemTextActive
                                            ]}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                        <Text style={styles.paginationInfo}>{t('settings.employees.pagination.records_per_page')}</Text>
                        <View style={styles.paginationControls}>
                            <TouchableOpacity 
                                style={[styles.paginationBtn, currentPage === 1 && { opacity: 0.5 }]}
                                disabled={currentPage === 1}
                                onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            >
                                <Text style={styles.paginationBtnText}>{t('settings.employees.pagination.prev')}</Text>
                            </TouchableOpacity>
                            <View style={styles.pageNumber}>
                                <Text style={styles.pageNumberText}>{currentPage}</Text>
                            </View>
                            <TouchableOpacity 
                                style={[styles.paginationBtn, (currentPage * recordsPerPage) >= totalRecords && { opacity: 0.5 }]}
                                disabled={(currentPage * recordsPerPage) >= totalRecords}
                                onPress={() => setCurrentPage(prev => prev + 1)}
                            >
                                <Text style={styles.paginationBtnText}>{t('settings.employees.pagination.next')}</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.paginationTotal}>{t('settings.employees.pagination.total', { total: totalRecords })}</Text>
                    </View>
                </View>

            </ScrollView>

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
                <View style={styles.deleteModalOverlay}>
                    <View style={styles.deleteModalContent}>
                        <View style={styles.deleteIconContainer}>
                            <Feather name="alert-triangle" size={32} color="#FF6B6B" />
                        </View>
                        <Text style={styles.deleteModalTitle}>{t('settings.employees.delete_modal.title')}</Text>
                        <Text style={styles.deleteModalMessage}>
                            {t('settings.employees.delete_modal.message', { name: `${deleteEmployee?.name} ${deleteEmployee?.lastName}` })}
                        </Text>
                        <View style={styles.deleteModalButtons}>
                            <TouchableOpacity
                                style={styles.deleteModalCancelBtn}
                                onPress={() => {
                                    setShowDeleteConfirm(false);
                                    setDeleteEmployeeTarget(null);
                                }}
                            >
                                <Text style={styles.deleteModalCancelText}>{t('settings.employees.delete_modal.cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.deleteModalDeleteBtn, deleting && { opacity: 0.6 }]}
                                onPress={handleDeleteEmployee}
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.deleteModalDeleteText}>{t('settings.employees.delete_modal.delete')}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
        backgroundColor: '#F5F7FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    headerIconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
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
        color: '#6B7280',
    },
    card: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 1,
        marginTop: 12,
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },

    /* Tabs */
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
        backgroundColor: '#F3F4F6',
    },
    tabChipActive: {
        backgroundColor: '#4A90B9',
    },
    tabChipText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#374151',
    },
    tabChipTextActive: {
        color: '#FFFFFF',
    },

    /* Action Buttons */
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

    /* Info Banner */
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#EFF6FF',
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
        gap: 10,
    },
    infoBannerText: {
        flex: 1,
        fontSize: 14,
        color: '#2563EB',
        lineHeight: 21,
    },

    /* Search */
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
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
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
        color: '#111827',
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
        width: 36,
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* Table */
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
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#FAFBFC',
    },
    tableHeaderCell: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
        letterSpacing: 0.5,
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    tableCell: {
        fontSize: 14,
        color: '#374151',
    },
    tableCellName: {
        fontWeight: '600',
        color: '#111827',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
    },
    statusActive: {
        backgroundColor: '#DEF7EC',
    },
    statusInactive: {
        backgroundColor: '#FDE8E8',
    },
    statusBadgeText: {
        fontSize: 13,
        fontWeight: '600',
    },
    statusActiveText: {
        color: '#03543F',
    },
    statusInactiveText: {
        color: '#9B1C1C',
    },
    statusSubText: {
        fontSize: 12,
        marginTop: 2,
    },
    statusActiveTextRow: {
        color: '#10B981',
    },
    statusInactiveTextRow: {
        color: '#6B7280',
    },
    rowActionBtnBlue: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#4A90B9',
        backgroundColor: '#FFFFFF',
    },
    rowActionBtnElevated: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#4A90B9',
        backgroundColor: '#4A90B9',
    },
    rowActionBtnRed: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#FF6B6B',
        backgroundColor: '#FFFFFF',
    },
    emptyState: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 16,
        color: '#9CA3AF',
    },

    /* Pagination */
    paginationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 4,
    },
    paginationInfo: {
        fontSize: 14,
        color: '#6B7280',
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
        backgroundColor: '#F3F4F6',
    },
    paginationBtnText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    pageNumber: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: '#4A90B9',
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
        color: '#6B7280',
    },
    recordsDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 6,
        backgroundColor: '#FFFFFF',
    },
    recordsDropdownText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    recordsPickerOverlay: {
        position: 'absolute',
        bottom: 44,
        left: 0,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
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
        backgroundColor: '#EBF5FF',
    },
    recordsPickerItemText: {
        fontSize: 14,
        color: '#374151',
        textAlign: 'center',
    },
    recordsPickerItemTextActive: {
        color: '#4A90B9',
        fontWeight: '700',
    },
    deleteModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteModalContent: {
        width: wp(85),
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
    },
    deleteIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    deleteModalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 8,
    },
    deleteModalMessage: {
        fontSize: 15,
        color: '#64748B',
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
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    deleteModalCancelText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
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