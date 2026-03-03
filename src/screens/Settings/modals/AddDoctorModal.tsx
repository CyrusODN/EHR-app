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



interface AddDoctorModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (doctorData: any) => void;
    onAlert?: (config: { visible: boolean; type: string; message: string }) => void;
}

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ visible, onClose, onAdd, onAlert }) => {
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

    const handleAdd = async () => {
        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.office) {
            onAlert?.({
                visible: true,
                type: 'error',
                message: 'Please fill in all required fields.',
            });
            return;
        }

        if (formData.email !== formData.confirmEmail) {
            onAlert?.({
                visible: true,
                type: 'error',
                message: 'Emails do not match.',
            });
            return;
        }

        setLoading(true);
        try {
            const selectedOffice = offices.find((off: any) => off._id === formData.office);
            
            const payload = {
                name: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                pesel: formData.peselNumber,
                pwz: formData.pwzNumber,
                role: 'doctor',
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
                    message: 'Doctor invitation has been sent successfully.',
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
                message: error.message || 'An error occurred while adding the doctor.',
            });
        } finally {
            setLoading(false);
        }
    };

    const renderLabel = (label: string) => (
        <View style={styles.labelContainer}>
            <Text style={styles.asterisk}>* </Text>
            <Text style={styles.labelText}>{label}</Text>
            <Text style={styles.asterisk}> *</Text>
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
                            <Text style={styles.headerTitle}>Add Doctor</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Feather name="x" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView 
                            style={styles.formContainer} 
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {/* First Name */}
                            {renderLabel('First Name')}
                            <CustomTextInput
                                placeholder=""
                                value={formData.firstName}
                                onChangeText={(val) => setFormData({ ...formData, firstName: val })}
                            />
                            <Gap height={hp(1.5)} />

                            {/* Last Name */}
                            {renderLabel('Last Name')}
                            <CustomTextInput
                                placeholder=""
                                value={formData.lastName}
                                onChangeText={(val) => setFormData({ ...formData, lastName: val })}
                            />
                            <Gap height={hp(1.5)} />

                            {/* Email */}
                            {renderLabel('Email')}
                            <CustomTextInput
                                placeholder=""
                                value={formData.email}
                                onChangeText={(val) => setFormData({ ...formData, email: val })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <Gap height={hp(1.5)} />

                            {/* Confirm Email */}
                            {renderLabel('Confirm Email')}
                            <CustomTextInput
                                placeholder=""
                                value={formData.confirmEmail}
                                onChangeText={(val) => setFormData({ ...formData, confirmEmail: val })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <Gap height={hp(1.5)} />

                            {/* PWZ Number */}
                            {renderLabel('PWZ Number')}
                            <CustomTextInput
                                placeholder=""
                                value={formData.pwzNumber}
                                onChangeText={(val) => setFormData({ ...formData, pwzNumber: val })}
                                keyboardType="numeric"
                            />
                            <Gap height={hp(1.5)} />

                            {/* PESEL Number */}
                            {renderLabel('PESEL Number')}
                            <CustomTextInput
                                placeholder=""
                                value={formData.peselNumber}
                                onChangeText={(val) => setFormData({ ...formData, peselNumber: val })}
                                keyboardType="numeric"
                            />
                            <Gap height={hp(1.5)} />

                            {/* Offices */}
                            {renderLabel('Offices')}
                            <CustomDropdown
                                placeholder="Select Offices"
                                options={officeOptions}
                                value={formData.office}
                                onChange={(val) => setFormData({ ...formData, office: val })}
                            />
                            <Gap height={hp(2.5)} />

                            {/* Warning Box */}
                            <View style={styles.warningBox}>
                                <MaterialCommunityIcons name="alert-triangle-outline" size={24} color="#EF4444" />
                                <Text style={styles.warningText}>
                                    By adding a user to your facility's account, you confirm that this user, after accepting the invitation and your confirmation, will have access to your facility's data. Remember to grant such permissions only to authorized persons.
                                </Text>
                            </View>

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
                                    label="Add"
                                    filled={true}
                                    onPress={handleAdd}
                                    style={styles.addButton}
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
    warningBox: {
        flexDirection: 'row',
        backgroundColor: '#FEF2F2',
        padding: 15,
        borderRadius: 12,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    warningText: {
        flex: 1,
        fontSize: 13,
        color: '#991B1B',
        marginLeft: 10,
        lineHeight: 18,
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
    addButton: {
        width: wp(25),
        height: 45,
        marginBottom: 0,
        borderRadius: 10,
    },
});

export default AddDoctorModal;
