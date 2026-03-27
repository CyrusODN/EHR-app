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
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

interface Permission {
    key: string;
    labelKey: string;
    requires?: string;
}

const PERMISSIONS_LIST: Permission[] = [
    { key: 'add_patient', labelKey: 'add_patient' },
    { key: 'view_all_patients', labelKey: 'view_all_patients' },
    { key: 'view_own_patients', labelKey: 'view_own_patients' },
    { key: 'view_all_visits', labelKey: 'view_all_visits' },
    { key: 'view_own_visits', labelKey: 'view_own_visits' },
    { key: 'add_visits', labelKey: 'add_visits', requires: 'view_all_visits|view_own_visits' },
    { key: 'cancel_visit', labelKey: 'cancel_visit', requires: 'view_all_visits|view_own_visits' },
    { key: 'view_employees', labelKey: 'view_employees' },
    { key: 'add_employees', labelKey: 'add_employees', requires: 'view_employees' },
    { key: 'delete_employees', labelKey: 'delete_employees', requires: 'view_employees' },
    { key: 'view_permissions', labelKey: 'view_permissions' },
    { key: 'edit_permissions', labelKey: 'edit_permissions', requires: 'view_permissions' },
    { key: 'update_facility', labelKey: 'update_facility' },
    { key: 'refer_patients', labelKey: 'refer_patients' },
    { key: 'view_audit_logs', labelKey: 'view_audit_logs' },
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
    title,
    onSavePermissions,
}) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
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
                message: error.message || t('employee_modals.permissions.alerts.error'),
            });
        } finally {
            setSaving(false);
        }
    };

    const getRequiresLabel = (requires?: string) => {
        if (!requires) return null;
        const requiredKeys = requires.split('|');
        const labels = requiredKeys.map(k => {
            const p = PERMISSIONS_LIST.find(pl => pl.key === k);
            return p ? t(`employee_modals.permissions.labels.${p.labelKey}`) : k;
        });
        return t('employee_modals.permissions.requires', { label: labels.join(` ${t('common.or') || 'or'} `) });
    };

    const modalTitle = title || t('employee_modals.permissions.title');

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={ds.modalOverlay}>
                <View style={ds.modalContent}>
                    {/* Header */}
                    <View style={ds.header}>
                        <Text style={ds.headerTitle}>{modalTitle}</Text>
                        <TouchableOpacity onPress={onClose} style={ds.closeButton}>
                            <Feather name="x" size={24} color={tc.textMuted} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={ds.permissionsList}
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={ds.scrollContent}
                    >
                        {PERMISSIONS_LIST.map((perm) => {
                            const requirementMet = isRequirementMet(perm);
                            const isEnabled = permissions[perm.key] ?? false;
                            const requiresLabel = getRequiresLabel(perm.requires);

                            return (
                                <View key={perm.key} style={ds.permissionRow}>
                                    <View style={ds.permissionLabelContainer}>
                                        <Text style={[
                                            ds.permissionLabel,
                                            !requirementMet && ds.permissionLabelDisabled
                                        ]}>
                                            {t(`employee_modals.permissions.labels.${perm.labelKey}`)}
                                        </Text>
                                        {requiresLabel && (
                                            <Text style={ds.requiresText}>
                                                ({requiresLabel})
                                            </Text>
                                        )}
                                    </View>
                                    <Switch
                                        trackColor={{ false: tc.borderSubtle, true: tc.accent }}
                                        thumbColor="#FFFFFF"
                                        ios_backgroundColor={tc.borderSubtle}
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
                    <View style={ds.footer}>
                        <PrimaryButton
                            label={t('employee_modals.permissions.buttons.cancel')}
                            filled={false}
                            onPress={onClose}
                            style={ds.cancelButton}
                        />
                        <PrimaryButton
                            label={t('employee_modals.permissions.buttons.save')}
                            filled={true}
                            onPress={handleSave}
                            style={ds.saveButton}
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

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: wp(92),
        backgroundColor: tc.modalBg,
        borderRadius: 24,
        paddingTop: 20,
        maxHeight: hp(85),
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: tc.textPrimary,
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
        paddingHorizontal: 24,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    permissionLabelContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        marginRight: 12,
    },
    permissionLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    permissionLabelDisabled: {
        color: tc.textMuted,
    },
    requiresText: {
        fontSize: 13,
        color: tc.textMuted,
        fontWeight: '400',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 18,
        borderTopWidth: 1,
        borderTopColor: tc.borderSubtle,
        gap: 12,
        backgroundColor: isDark ? 'rgba(0,0,0,0.1)' : tc.cardBackground,
    },
    cancelButton: {
        width: wp(28),
        height: 48,
        marginBottom: 0,
        borderRadius: 12,
    },
    saveButton: {
        width: wp(40),
        height: 48,
        marginBottom: 0,
        borderRadius: 12,
    },
});

export default ManagePermissionsModal;
