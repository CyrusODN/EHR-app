import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomTextInput from '../../../component/customTextInput';
import CustomDropdown from '../../../component/customDropDown';
import PrimaryButton from '../../../component/button';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Gap from '../../../component/gap';
import { AddEmployee, GetDirectorSetting } from '../../../Services/settingServices';
import userStore from '../../../store/user';
import { Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

interface AddDoctorModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (doctorData: any) => void;
    onAlert?: (config: { visible: boolean; type: string; message: string }) => void;
    activeTab?: string;
}

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ visible, onClose, onAdd, onAlert, activeTab }) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const { loggedInUser } = userStore();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        confirmEmail: '',
        pwzNumber: '',
        peselNumber: '',
        office: null as string | number | null
    });

    const [offices, setOffices] = useState<any[]>([]);
    const [directorSettingId, setDirectorSettingId] = useState<string | null>(null);

    // Fetch offices from director-setting API when modal opens
    useEffect(() => {
        if (visible) {
            const fetchOffices = async () => {
                try {
                    const result: any = await GetDirectorSetting();
                    if (result) {
                        setOffices(result.offices || []);
                        setDirectorSettingId(result.id || null);
                    }
                } catch (error) {
                    console.error('Fetch Director Setting Error:', error);
                }
            };
            fetchOffices();
        }
    }, [visible]);

    const officeOptions = offices.map((off: any) => ({
        label: off.name,
        value: off._id
    }));

    const getRoleTranslationKey = () => {
        if (activeTab === 'Nurses and Midwives') return 'nurse';
        if (activeTab === 'Receptionists') return 'receptionist';
        return 'doctor';
    };

    const handleAdd = async () => {
        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.office) {
            onAlert?.({
                visible: true,
                type: 'error',
                message: t('employee_modals.add_employee.alerts.required_fields'),
            });
            return;
        }

        if (formData.email !== formData.confirmEmail) {
            onAlert?.({
                visible: true,
                type: 'error',
                message: t('employee_modals.add_employee.alerts.email_mismatch'),
            });
            return;
        }

        setLoading(true);
        const roleKey = getRoleTranslationKey();
        try {
            const selectedOffice = offices.find((off: any) => off._id === formData.office);
            
            const payload = {
                name: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                pesel: formData.peselNumber,
                pwz: formData.pwzNumber,
                role: activeTab === 'Nurses and Midwives' ? 'nurse' : activeTab === 'Receptionists' ? 'receptionist' : 'doctor',
                assignedOffices: selectedOffice ? [
                    {
                        name: selectedOffice.name,
                        officeId: selectedOffice._id,
                        directorSettingId: directorSettingId
                    }
                ] : []
            };

            const response = await AddEmployee(payload);
            
            // Assuming response handling based on success pattern
            if (response) {
                onAlert?.({
                    visible: true,
                    type: 'success',
                    message: t('employee_modals.add_employee.alerts.success', { 
                        role: t(`employee_modals.add_employee.title_${roleKey}`)
                    }),
                });
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    confirmEmail: '',
                    pwzNumber: '',
                    peselNumber: '',
                    office: null
                });
                onAdd(response);
                onClose();
            }
        } catch (error: any) {
            console.error('Add Doctor Error:', error);
            onAlert?.({
                visible: true,
                type: 'error',
                message: error.message || t('employee_modals.add_employee.alerts.error', { 
                    role: t(`employee_modals.add_employee.title_${roleKey}`).toLowerCase() 
                }),
            });
        } finally {
            setLoading(false);
        }
    };

    const renderLabel = (label: string) => (
        <View style={ds.labelContainer}>
            <Text style={ds.asterisk}>* </Text>
            <Text style={ds.labelText}>{label}</Text>
        </View>
    );

    const getTitle = () => {
        const roleKey = getRoleTranslationKey();
        return t(`employee_modals.add_employee.title_${roleKey}`);
    };

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
                            <Text style={ds.headerTitle}>{getTitle()}</Text>
                            <TouchableOpacity onPress={onClose} style={ds.closeButton}>
                                <Feather name="x" size={24} color={tc.textMuted} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView 
                            style={ds.formContainer} 
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={ds.scrollContent}
                        >
                            {/* First Name */}
                            {renderLabel(t('employee_modals.add_employee.labels.firstName'))}
                            <CustomTextInput
                                placeholder=""
                                value={formData.firstName}
                                onChangeText={(val) => setFormData({ ...formData, firstName: val })}
                            />
                            <Gap height={hp(1.5)} />

                            {/* Last Name */}
                            {renderLabel(t('employee_modals.add_employee.labels.lastName'))}
                            <CustomTextInput
                                placeholder=""
                                value={formData.lastName}
                                onChangeText={(val) => setFormData({ ...formData, lastName: val })}
                            />
                            <Gap height={hp(1.5)} />

                            {/* Email */}
                            {renderLabel(t('employee_modals.add_employee.labels.email'))}
                            <CustomTextInput
                                placeholder=""
                                value={formData.email}
                                onChangeText={(val) => setFormData({ ...formData, email: val })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <Gap height={hp(1.5)} />

                            {/* Confirm Email */}
                            {renderLabel(t('employee_modals.add_employee.labels.confirmEmail'))}
                            <CustomTextInput
                                placeholder=""
                                value={formData.confirmEmail}
                                onChangeText={(val) => setFormData({ ...formData, confirmEmail: val })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <Gap height={hp(1.5)} />

                            {/* PWZ Number */}
                            {(!activeTab || activeTab === 'Doctors, Dentists, and Paramedics') && (
                                <>
                                    {renderLabel(t('employee_modals.add_employee.labels.pwzNumber'))}
                                    <CustomTextInput
                                        placeholder=""
                                        value={formData.pwzNumber}
                                        onChangeText={(val) => setFormData({ ...formData, pwzNumber: val })}
                                        keyboardType="numeric"
                                    />
                                    <Gap height={hp(1.5)} />
                                </>
                            )}

                            {/* PESEL Number */}
                            {renderLabel(t('employee_modals.add_employee.labels.peselNumber'))}
                            <CustomTextInput
                                placeholder=""
                                value={formData.peselNumber}
                                onChangeText={(val) => setFormData({ ...formData, peselNumber: val })}
                                keyboardType="numeric"
                            />
                            <Gap height={hp(1.5)} />

                            {/* Offices */}
                            {renderLabel(t('employee_modals.add_employee.labels.offices'))}
                            <CustomDropdown
                                placeholder={t('employee_modals.add_employee.placeholders.offices')}
                                options={officeOptions}
                                value={formData.office}
                                onChange={(val) => setFormData({ ...formData, office: val })}
                            />
                            <Gap height={hp(2.5)} />

                            {/* Warning Box */}
                            <View style={ds.warningBox}>
                                <MaterialCommunityIcons name="alert-triangle-outline" size={24} color={tc.error} />
                                <Text style={ds.warningText}>
                                    {t('employee_modals.add_employee.warning')}
                                </Text>
                            </View>

                            <Gap height={hp(3)} />

                            {/* Action Buttons */}
                            <View style={ds.footerButtons}>
                                <PrimaryButton
                                    label={t('employee_modals.add_employee.buttons.cancel')}
                                    filled={false}
                                    onPress={onClose}
                                    style={ds.cancelButton}
                                />
                                <PrimaryButton
                                    label={t(`employee_modals.add_employee.buttons.add_${getRoleTranslationKey()}`)}
                                    filled={true}
                                    onPress={handleAdd}
                                    style={ds.addButton}
                                    loading={loading}
                                    disabled={loading}
                                />
                            </View>
                            <Gap height={hp(2)} />
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
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
    warningBox: {
        flexDirection: 'row',
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.05)' : '#FEF2F2',
        padding: 16,
        borderRadius: 12,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2',
    },
    warningText: {
        flex: 1,
        fontSize: 13,
        color: isDark ? '#FCA5A5' : '#991B1B',
        marginLeft: 12,
        lineHeight: 18,
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
    addButton: {
        width: wp(28),
        height: 48,
        marginBottom: 0,
        borderRadius: 12,
    },
});

export default AddDoctorModal;
