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
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
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
                message: 'Please fill in all required fields.',
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
                message: error.message || 'An error occurred while updating the employee.',
            });
        } finally {
            setLoading(false);
        }
    };

    const renderLabel = (label: string, required: boolean = true) => (
        <View style={styles.labelContainer}>
            {required && <Text style={styles.asterisk}>* </Text>}
            <Text style={styles.labelText}>{label}</Text>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Edit Employee</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Feather name="x" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.formContainer}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {/* First Name & Last Name Row */}
                            <View style={styles.row}>
                                <View style={styles.halfField}>
                                    {renderLabel('First Name')}
                                    <CustomTextInput
                                        placeholder=""
                                        value={formData.firstName}
                                        onChangeText={(val: string) => setFormData({ ...formData, firstName: val })}
                                    />
                                </View>
                                <View style={styles.halfField}>
                                    {renderLabel('Last Name')}
                                    <CustomTextInput
                                        placeholder=""
                                        value={formData.lastName}
                                        onChangeText={(val: string) => setFormData({ ...formData, lastName: val })}
                                    />
                                </View>
                            </View>
                            <Gap height={hp(1.5)} />

                            {/* Email */}
                            {renderLabel('Email')}
                            <CustomTextInput
                                placeholder=""
                                value={formData.email}
                                onChangeText={(val: string) => setFormData({ ...formData, email: val })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <Gap height={hp(1.5)} />

                            {/* PESEL */}
                            {renderLabel('PESEL', false)}
                            <View style={styles.disabledInput}>
                                <TextInput
                                    style={styles.disabledInputText}
                                    value={formData.peselNumber}
                                    editable={false}
                                    placeholder=""
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                            <Gap height={hp(1.5)} />

                            {/* Status */}
                            {renderLabel('Status')}
                            <CustomDropdown
                                placeholder="Select Status"
                                options={statusOptions}
                                value={formData.status}
                                onChange={(val) => setFormData({ ...formData, status: val as string })}
                            />
                            <Gap height={hp(1.5)} />

                            {/* Assigned Offices */}
                            <Text style={styles.sectionTitle}>Assigned Offices</Text>
                            <View style={styles.officeChipsContainer}>
                                {selectedOffices.map((office: any) => (
                                    <View key={office.officeId} style={styles.officeChip}>
                                        <Text style={styles.officeChipText}>{office.name}</Text>
                                        <TouchableOpacity onPress={() => handleRemoveOffice(office.officeId)}>
                                            <Feather name="x" size={14} color="#64748B" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                            {officeOptions.length > 0 && (
                                <>
                                    <Gap height={hp(1)} />
                                    <CustomDropdown
                                        placeholder="Add Office"
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
                            <View style={styles.footerButtons}>
                                <PrimaryButton
                                    label="Cancel"
                                    filled={false}
                                    onPress={onClose}
                                    style={styles.cancelButton}
                                />
                                <PrimaryButton
                                    label="Save"
                                    filled={true}
                                    onPress={handleSave}
                                    style={styles.saveButton}
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

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyboardView: {
        width: '100%',
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
    formContainer: {
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingTop: 15,
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
        color: '#334155',
    },
    asterisk: {
        color: '#EF4444',
        fontSize: 14,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 10,
    },
    officeChipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    officeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    officeChipText: {
        fontSize: 13,
        color: '#334155',
        fontWeight: '500',
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 12,
    },
    cancelButton: {
        width: wp(30),
        height: 45,
        marginBottom: 0,
        borderRadius: 10,
    },
    saveButton: {
        width: wp(25),
        height: 45,
        marginBottom: 0,
        borderRadius: 10,
    },
    disabledInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 5,
        backgroundColor: '#F3F4F6',
        minHeight: 50,
        justifyContent: 'center',
    },
    disabledInputText: {
        padding: 12,
        fontSize: 14,
        color: '#9CA3AF',
    },
});

export default EditEmployeeModal;
