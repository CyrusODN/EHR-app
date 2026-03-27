import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import CustomTextInput from '../../../component/customTextInput';
import CustomDropdown from '../../../component/customDropDown';
import PrimaryButton from '../../../component/button';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Gap from '../../../component/gap';
import { UpdateEmployee } from '../../../Services/settingServices';
import userStore from '../../../store/user';
import CustomAlert from '../../../component/customAlert';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

interface Employee {
    id: string;
    name: string;
    lastName: string;
    email: string;
    pesel: string;
    pwz: string;
    status: string;
    role: string;
    assignedOffices?: any[];
}

interface EditEmployeeModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (updatedData: any) => void;
    employee: Employee | null;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ visible, onClose, onSave, employee }) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const { loggedInUser } = userStore();
    const [loading, setLoading] = useState(false);
    const [alertConfig, setAlertConfig] = useState<any>({
        visible: false,
        type: 'success',
        message: '',
    });

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        peselNumber: '',
        status: null as string | number | null,
    });

    const statusOptions = [
        { label: t('employee_modals.edit_employee.status.active'), value: 'active' },
        { label: t('employee_modals.edit_employee.status.inactive'), value: 'inactive' },
    ];

    const [selectedOffices, setSelectedOffices] = useState<any[]>([]);

    const officeOptions = loggedInUser?.assignedOffices?.map((off: any) => ({
        label: off.name,
        value: off.officeId
    })) || [];

    // Populate form when employee changes
    useEffect(() => {
        if (employee) {
            setFormData({
                firstName: employee.name || '',
                lastName: employee.lastName || '',
                email: employee.email || '',
                peselNumber: employee.pesel || '',
                status: employee.status || 'inactive',
            });
            setSelectedOffices(employee.assignedOffices || []);
        }
    }, [employee]);

    const handleAddOffice = (officeId: string | number) => {
        const office = loggedInUser?.assignedOffices?.find((off: any) => off.officeId === officeId);
        if (office && !selectedOffices.find((o: any) => o.officeId === officeId)) {
            setSelectedOffices([...selectedOffices, office]);
        }
    };

    const handleRemoveOffice = (officeId: string) => {
        setSelectedOffices(selectedOffices.filter((o: any) => o.officeId !== officeId));
    };

    const handleSave = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email) {
            setAlertConfig({
                visible: true,
                type: 'error',
                message: t('employee_modals.edit_employee.alerts.required_fields'),
            });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                id: employee?.id,
                name: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                status: formData.status,
            };

            const response = await UpdateEmployee(payload);

            if (response) {
                onSave(response);
                onClose();
            }
        } catch (error: any) {
            console.error('Update Employee Error:', error);
            setAlertConfig({
                visible: true,
                type: 'error',
                message: error.message || t('employee_modals.edit_employee.alerts.error'),
            });
        } finally {
            setLoading(false);
        }
    };

    const renderLabel = (label: string, required: boolean = true) => (
        <View style={ds.labelContainer}>
            {required && <Text style={ds.asterisk}>* </Text>}
            <Text style={ds.labelText}>{label}</Text>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={ds.modalOverlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={ds.keyboardView}
                >
                    <View style={ds.modalContent}>
                        {/* Header */}
                        <View style={ds.header}>
                            <Text style={ds.headerTitle}>{t('employee_modals.edit_employee.title')}</Text>
                            <TouchableOpacity onPress={onClose} style={ds.closeButton}>
                                <Feather name="x" size={24} color={tc.textMuted} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={ds.formContainer}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={ds.scrollContent}
                        >
                            {/* First Name & Last Name Row */}
                            <View style={ds.row}>
                                <View style={ds.halfField}>
                                    {renderLabel(t('employee_modals.edit_employee.labels.firstName'))}
                                    <CustomTextInput
                                        placeholder=""
                                        value={formData.firstName}
                                        onChangeText={(val: string) => setFormData({ ...formData, firstName: val })}
                                    />
                                </View>
                                <View style={ds.halfField}>
                                    {renderLabel(t('employee_modals.edit_employee.labels.lastName'))}
                                    <CustomTextInput
                                        placeholder=""
                                        value={formData.lastName}
                                        onChangeText={(val: string) => setFormData({ ...formData, lastName: val })}
                                    />
                                </View>
                            </View>
                            <Gap height={hp(1.5)} />

                            {/* Email */}
                            {renderLabel(t('employee_modals.edit_employee.labels.email'))}
                            <CustomTextInput
                                placeholder=""
                                value={formData.email}
                                onChangeText={(val: string) => setFormData({ ...formData, email: val })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <Gap height={hp(1.5)} />

                            {/* PESEL */}
                            {renderLabel(t('employee_modals.edit_employee.labels.pesel'), false)}
                            <View style={ds.disabledInput}>
                                <TextInput
                                    style={ds.disabledInputText}
                                    value={formData.peselNumber}
                                    editable={false}
                                    placeholder=""
                                    placeholderTextColor={tc.textMuted}
                                />
                            </View>
                            <Gap height={hp(1.5)} />

                            {/* Status */}
                            {renderLabel(t('employee_modals.edit_employee.labels.status'))}
                            <CustomDropdown
                                placeholder={t('employee_modals.edit_employee.placeholders.status')}
                                options={statusOptions}
                                value={formData.status}
                                onChange={(val) => setFormData({ ...formData, status: val as string })}
                            />
                            <Gap height={hp(1.5)} />

                            {/* Assigned Offices */}
                            <Text style={ds.sectionTitle}>{t('employee_modals.edit_employee.labels.assignedOffices')}</Text>
                            <View style={ds.officeChipsContainer}>
                                {selectedOffices.map((office: any) => (
                                    <View key={office.officeId} style={ds.officeChip}>
                                        <Text style={ds.officeChipText}>{office.name}</Text>
                                        <TouchableOpacity onPress={() => handleRemoveOffice(office.officeId)}>
                                            <Feather name="x" size={14} color={tc.textMuted} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                            {officeOptions.length > 0 && (
                                <>
                                    <Gap height={hp(1)} />
                                    <CustomDropdown
                                        placeholder={t('employee_modals.edit_employee.placeholders.addOffice')}
                                        options={officeOptions.filter(
                                            (opt: any) => !selectedOffices.find((o: any) => o.officeId === opt.value)
                                        )}
                                        value={null}
                                        onChange={(val) => handleAddOffice(val)}
                                    />
                                </>
                            )}

                            <Gap height={hp(3)} />

                            {/* Action Buttons */}
                            <View style={ds.footerButtons}>
                                <PrimaryButton
                                    label={t('employee_modals.edit_employee.buttons.cancel')}
                                    filled={false}
                                    onPress={onClose}
                                    style={ds.cancelButton}
                                />
                                <PrimaryButton
                                    label={t('employee_modals.edit_employee.buttons.save')}
                                    filled={true}
                                    onPress={handleSave}
                                    style={ds.saveButton}
                                    loading={loading}
                                    disabled={loading}
                                />
                            </View>
                            <Gap height={hp(2)} />
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
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
    keyboardView: {
        width: '100%',
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
    formContainer: {
        paddingHorizontal: 24,
    },
    scrollContent: {
        paddingVertical: 20,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfField: {
        flex: 1,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    labelText: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textSecondary,
    },
    asterisk: {
        color: tc.error,
        fontSize: 14,
        fontWeight: 'bold',
    },
    disabledInput: {
        borderWidth: 1.5,
        borderColor: tc.borderSubtle,
        borderRadius: 12,
        backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#F8FAFC',
        minHeight: 52,
        justifyContent: 'center',
    },
    disabledInputText: {
        paddingHorizontal: 14,
        fontSize: 15,
        color: tc.textMuted,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: tc.textPrimary,
        marginTop: 10,
        marginBottom: 12,
    },
    officeChipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    officeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.15)' : '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(74, 144, 185, 0.3)' : '#E2E8F0',
    },
    officeChipText: {
        fontSize: 13,
        color: tc.textPrimary,
        fontWeight: '500',
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 12,
        marginTop: 10,
    },
    cancelButton: {
        width: wp(30),
        height: 48,
        marginBottom: 0,
        borderRadius: 12,
    },
    saveButton: {
        width: wp(28),
        height: 48,
        marginBottom: 0,
        borderRadius: 12,
    },
});

export default EditEmployeeModal;
