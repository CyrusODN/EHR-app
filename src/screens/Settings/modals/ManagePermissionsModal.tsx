import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Switch,
    ActivityIndicator
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import PrimaryButton from '../../../component/button';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { UpdateEmployeePermissions, UpdateGroupPermissions } from '../../../Services/settingServices';
import CustomAlert from '../../../component/customAlert';

interface Permission {
    key: string;
    label: string;
    requires?: string;
    requiresLabel?: string;
}

const PERMISSIONS_LIST: Permission[] = [
    { key: 'add_patient', label: 'Add Patients' },
    { key: 'view_all_patients', label: 'View All Patients' },
    { key: 'view_own_patients', label: 'View Own Patients' },
    { key: 'view_all_visits', label: 'View All Visits' },
    { key: 'view_own_visits', label: 'View Own Visits' },
    { key: 'add_visits', label: 'Add Visits', requires: 'view_all_visits|view_own_visits', requiresLabel: 'Requires: View All Visits or View Own Visits' },
    { key: 'cancel_visit', label: 'Cancel Visit', requires: 'view_all_visits|view_own_visits', requiresLabel: 'Requires: View All Visits or View Own Visits' },
    { key: 'view_employees', label: 'View Employees' },
    { key: 'add_employees', label: 'Add Employees', requires: 'view_employees', requiresLabel: 'Requires: View Employees' },
    { key: 'delete_employees', label: 'Delete Employees', requires: 'view_employees', requiresLabel: 'Requires: View Employees' },
    { key: 'view_permissions', label: 'View Permissions' },
    { key: 'edit_permissions', label: 'Edit Permissions', requires: 'view_permissions', requiresLabel: 'Requires: View Permissions' },
    { key: 'update_facility', label: 'Update Facility' },
    { key: 'refer_patients', label: 'Refer Patients' },
    { key: 'view_audit_logs', label: 'View Audit Logs' },
];

interface ManagePermissionsModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    employeeId: string | null;
    employeeName?: string;
    initialPermissions: string[];
    title?: string;
    onSavePermissions?: (permissions: string[]) => Promise<any>;
}

const ManagePermissionsModal: React.FC<ManagePermissionsModalProps> = ({
    visible,
    onClose,
    onSave,
    employeeId,
    employeeName,
    initialPermissions,
    title = 'Manage User Permissions',
    onSavePermissions,
}) => {
    const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({});
    const [saving, setSaving] = useState(false);
    const [alertConfig, setAlertConfig] = useState<any>({
        visible: false,
        type: 'success',
        message: '',
    });

    // Initialize permissions from the initialPermissions prop (string array from API)
    useEffect(() => {
        if (visible) {
            const mapped: { [key: string]: boolean } = {};
            PERMISSIONS_LIST.forEach((perm) => {
                mapped[perm.key] = initialPermissions.includes(perm.key);
            });
            setPermissions(mapped);
        }
    }, [visible, initialPermissions]);

    const isRequirementMet = (perm: Permission): boolean => {
        if (!perm.requires) return true;
        const requiredKeys = perm.requires.split('|');
        return requiredKeys.some((key) => permissions[key]);
    };

    const handleToggle = (key: string) => {
        const newValue = !permissions[key];
        const updated = { ...permissions, [key]: newValue };

        // If turning off a parent permission, also turn off dependents
        if (!newValue) {
            PERMISSIONS_LIST.forEach((perm) => {
                if (perm.requires) {
                    const requiredKeys = perm.requires.split('|');
                    if (requiredKeys.includes(key)) {
                        const otherRequiredOn = requiredKeys.some(
                            (rk) => rk !== key && updated[rk]
                        );
                        if (!otherRequiredOn) {
                            updated[perm.key] = false;
                        }
                    }
                }
            });
        }

        setPermissions(updated);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const enabledPermissions = Object.entries(permissions)
                .filter(([_, enabled]) => enabled)
                .map(([key]) => key);

            let response;
            if (onSavePermissions) {
                response = await onSavePermissions(enabledPermissions);
            } else {
                const payload = {
                    id: employeeId,
                    permissions: enabledPermissions,
                };
                response = await UpdateEmployeePermissions(payload);
            }
            if (response) {
                onSave();
                onClose();
            }
        } catch (error: any) {
            console.error('Update Permissions Error:', error);
            setAlertConfig({
                visible: true,
                type: 'error',
                message: error.message || 'Failed to update permissions.',
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Feather name="x" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.permissionsList}
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {PERMISSIONS_LIST.map((perm) => {
                            const requirementMet = isRequirementMet(perm);
                            const isEnabled = permissions[perm.key] ?? false;

                            return (
                                <View key={perm.key} style={styles.permissionRow}>
                                    <View style={styles.permissionLabelContainer}>
                                        <Text style={[
                                            styles.permissionLabel,
                                            !requirementMet && styles.permissionLabelDisabled
                                        ]}>
                                            {perm.label}
                                        </Text>
                                        {perm.requiresLabel && (
                                            <Text style={styles.requiresText}>
                                                ({perm.requiresLabel})
                                            </Text>
                                        )}
                                    </View>
                                    <Switch
                                        trackColor={{ false: '#E2E8F0', true: '#4A90B9' }}
                                        thumbColor="#FFFFFF"
                                        ios_backgroundColor="#E2E8F0"
                                        value={isEnabled}
                                        onValueChange={() => handleToggle(perm.key)}
                                        disabled={!requirementMet}
                                        style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                                    />
                                </View>
                            );
                        })}
                    </ScrollView>

                    {/* Footer Buttons */}
                    <View style={styles.footer}>
                        <PrimaryButton
                            label="Cancel"
                            filled={false}
                            onPress={onClose}
                            style={styles.cancelButton}
                        />
                        <PrimaryButton
                            label="Save Permissions"
                            filled={true}
                            onPress={handleSave}
                            style={styles.saveButton}
                            loading={saving}
                            disabled={saving}
                        />
                    </View>
                </View>
            </View>
            <CustomAlert
                visible={alertConfig.visible}
                type={alertConfig.type}
                message={alertConfig.message}
                onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: wp(90),
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingTop: 20,
        maxHeight: hp(85),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
    },
    closeButton: {
        padding: 4,
    },
    permissionsList: {
        maxHeight: hp(60),
    },
    scrollContent: {
        paddingBottom: 10,
    },
    permissionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    permissionLabelContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
        marginRight: 12,
    },
    permissionLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
    },
    permissionLabelDisabled: {
        color: '#94A3B8',
    },
    requiresText: {
        fontSize: 13,
        color: '#94A3B8',
        fontWeight: '400',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        gap: 12,
    },
    cancelButton: {
        width: wp(25),
        height: 45,
        marginBottom: 0,
        borderRadius: 10,
    },
    saveButton: {
        width: wp(38),
        height: 45,
        marginBottom: 0,
        borderRadius: 10,
    },
});

export default ManagePermissionsModal;
