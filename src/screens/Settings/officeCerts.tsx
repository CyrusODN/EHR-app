// components/Office&Certificates.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../component/button';
import CustomTextInput from '../../component/customTextInput';
import CustomDropdown from '../../component/customDropDown';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Linking } from 'react-native';
import { GetDirectorSetting, UpdateDirectorSetting } from '../../Services/settingServices';
import { uploadFileOnServer } from '../../Services/Upload.Service';
import DocumentPicker from 'react-native-document-picker';



interface Office {
    id: string;
    title: string;
    floor: string;
    number: string;
    type: string;
    equipment: string;
}

interface OfficeCardProps {
    office: Office;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

interface CertificateUploadSectionProps {
    title: string;
    placeholder: string;
    onUpload: () => void;
    onRemove: () => void;
    fileUrl?: string;
    loading?: boolean;
}

// Office Card Component
const OfficeCard = ({ office, onEdit, onDelete }: OfficeCardProps) => (
    <View style={styles.officeCard}>
        <View style={styles.officeInfo}>
            <Text style={styles.officeTitle}>{office.title}</Text>
            <Text style={styles.officeDetail}>Floor: {office.floor}, No: {office.number}</Text>
            <Text style={styles.officeDetail}>Type: {office.type}</Text>
            <Text style={styles.officeDetail}>Equipment: {office.equipment}</Text>
        </View>
        <View style={styles.officeActions}>
            <TouchableOpacity onPress={() => onEdit(office.id)} style={styles.iconButton}>
                <Feather name="edit-2" size={20} color="#4A90B9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(office.id)} style={styles.iconButton}>
                <Feather name="trash-2" size={20} color="#FF6B6B" />
            </TouchableOpacity>
        </View>
    </View>
);

// Certificate Upload Section Component
const CertificateUploadSection = ({ title, placeholder, onUpload, onRemove, fileUrl, loading }: CertificateUploadSectionProps) => (
    <View style={styles.certificateSection}>
        <Text style={styles.certificateLabel}>{title}</Text>
        {loading ? (
            <View style={[styles.uploadButton, { borderStyle: 'solid' }]}>
                <ActivityIndicator size="small" color="#4A90B9" />
                <Text style={[styles.uploadText, { marginLeft: 10 }]}>Uploading...</Text>
            </View>
        ) : fileUrl ? (
            <View style={styles.filePreviewContainer}>
                <TouchableOpacity 
                    style={styles.fileInfo} 
                    onPress={() => Linking.openURL(fileUrl)}
                >
                    <MaterialCommunityIcons name="paperclip" size={20} color="#64748B" />
                    <Text style={styles.fileUrlText} numberOfLines={1}>
                        {fileUrl.split('/').pop()}
                    </Text>
                </TouchableOpacity>
                <View style={styles.actionIconsSide}>
                    <TouchableOpacity onPress={onRemove} style={styles.deleteFileIconSide}>
                        <Feather name="trash-2" size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                </View>
            </View>
        ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={onUpload}>
                <Feather name="upload" size={20} color="#4A90B9" />
                <Text style={styles.uploadText}>{placeholder}</Text>
            </TouchableOpacity>
        )}
    </View>
);

const OfficeCertificates = ({ onAlert }: { onAlert?: (config: any) => void }) => {
    const navigation = useNavigation<any>();

    const [id, setId] = useState('');
    const [directorId, setDirectorId] = useState('');
    const [p1Id, setP1Id] = useState('');
    const [tlsCert, setTlsCert] = useState('');
    const [wlsCert, setWlsCert] = useState('');
    const [isUploadingTls, setIsUploadingTls] = useState(false);
    const [isUploadingWls, setIsUploadingWls] = useState(false);
    const [loading, setLoading] = useState(false);

    // Sample office data
    const [offices, setOffices] = useState([
        {
            id: '1',
            title: 'Office 1',
            floor: '1',
            number: '101',
            type: 'Medical office',
            equipment: 'Couch, Desk, Computer'
        }
    ]);

    // Handle edit office
    const handleEditOffice = (id: string) => {
        console.log('Edit office with id:', id);
        // Navigate to edit screen or show modal
    };

    // Handle delete office
    const handleDeleteOffice = (id: string) => {
        console.log('Delete office with id:', id);
        // Show confirmation dialog and then delete
        setOffices(offices.filter(office => office.id !== id));
    };

    // Handle upload certificate - immediate upload
    const handleUploadCertificate = async (type: string) => {
        try {
            const res: any = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
            });

            if (type === 'TLS') setIsUploadingTls(true);
            else setIsUploadingWls(true);

            const uploadRes: any = await uploadFileOnServer(res);
            console.log("Upload Response:", uploadRes);

            const url = uploadRes?.data?.url || uploadRes?.data || uploadRes;
            
            if (type === 'TLS') setTlsCert(url);
            else setWlsCert(url);

        } catch (err) {
            if (!DocumentPicker.isCancel(err)) {
                console.error('Upload error:', err);
                if (onAlert) onAlert({ visible: true, type: 'error', message: 'Failed to upload certificate' });
            }
        } finally {
            setIsUploadingTls(false);
            setIsUploadingWls(false);
        }
    };

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res: any = await GetDirectorSetting();
            const data = res?.data || res;
            if (data) {
                setId(data.id || '');
                setDirectorId(data.director || '');
                setP1Id(data.p1Id || '');
                setTlsCert(data.tlsCertificate || '');
                setWlsCert(data.wlsCertificate || '');
                
                if (data.offices) {
                    const mappedOffices = data.offices.map((off: any) => ({
                        id: off._id,
                        title: off.name,
                        floor: off.floor,
                        number: off.officeNumber,
                        type: off.type,
                        equipment: Array.isArray(off.equipment) ? off.equipment.join(', ') : off.equipment
                    }));
                    setOffices(mappedOffices);
                }
            }
        } catch (error) {
            console.error('Error fetching director settings:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchSettings();
    }, []);

    const [showAddForm, setShowAddForm] = useState(false);
    const [officeName, setOfficeName] = useState('');
    const [floor, setFloor] = useState('');
    const [number, setNumber] = useState('');
    const [type, setType] = useState<string | number>('');
    const [equipment, setEquipment] = useState('');

    const officeTypeOptions = [
        { label: 'Medical office', value: 'Medical office' },
        { label: 'Therapy office', value: 'Therapy office' },
        { label: 'Diagnostic office', value: 'Diagnostic office' },
    ];

    const handleAddOffice = () => {
        const newOffice = {
            id: Math.random().toString(),
            title: officeName,
            floor: floor,
            number: number,
            type: String(type),
            equipment: equipment
        };
        setOffices([...offices, newOffice]);
        resetForm();
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            const payload = {
                director: directorId,
                id: id,
                offices: offices.map(off => ({
                    _id: off.id.includes('.') ? undefined : off.id, // New offices might have decimal IDs from Math.random
                    name: off.title,
                    floor: off.floor,
                    officeNumber: off.number,
                    type: off.type.toLowerCase().includes('medical') ? 'medical' : 
                          off.type.toLowerCase().includes('therapy') ? 'therapy' : 'diagnostic',
                    equipment: off.equipment.split(',').map(item => item.trim()).filter(item => item !== '')
                })),
                p1Id: p1Id,
                tlsCert: tlsCert,
                wlsCert: wlsCert
            };

            console.log("Saving Director Settings Payload:", payload);
            await UpdateDirectorSetting(payload);
            
            if (onAlert) {
                onAlert({
                    visible: true,
                    type: 'success',
                    message: 'Director Settings updated successfully!'
                });
            }
            fetchSettings();
        } catch (error) {
            console.error('Error saving director settings:', error);
            if (onAlert) onAlert({ visible: true, type: 'error', message: 'Failed to update settings' });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setOfficeName('');
        setFloor('');
        setNumber('');
        setType('');
        setEquipment('');
        setShowAddForm(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerIconContainer}>
                    <MaterialCommunityIcons name="office-building" size={24} color="#4A90B9" />
                </View>
                <Text style={styles.headerTitle}>Offices & Certificates</Text>
            </View>

            <ScrollView style={styles.container}>
                {/* Offices Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.iconContainer}>
                                <MaterialIcons name="meeting-room" size={24} color="#4A90B9" />
                            </View>
                            <Text style={styles.sectionTitle}>Offices</Text>
                        </View>

                        <PrimaryButton
                            label={showAddForm ? "Hide Form" : "Add office"}
                            filled={true}
                            onPress={() => setShowAddForm(!showAddForm)}
                            style={{ width: "40%" }}
                            icon={<Ionicons name={showAddForm ? "remove" : "add"} size={18} color="white" />}
                            image={undefined}
                            iconStyle={undefined}
                            imageStyle={undefined}
                            loading={false}
                            disabled={false}
                        />
                    </View>

                    {showAddForm && (
                        <View style={styles.addOfficeForm}>
                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>
                                        <Text style={styles.required}>* </Text>Office Name
                                    </Text>
                                    <CustomTextInput
                                        placeholder="Office Name"
                                        value={officeName}
                                        onChangeText={setOfficeName}
                                    />
                                </View>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>
                                        <Text style={styles.required}>* </Text>Floor
                                    </Text>
                                    <CustomTextInput
                                        placeholder="Floor"
                                        value={floor}
                                        onChangeText={setFloor}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View style={styles.rowContainer}>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>
                                        <Text style={styles.required}>* </Text>Number
                                    </Text>
                                    <CustomTextInput
                                        placeholder="Office Number"
                                        value={number}
                                        onChangeText={setNumber}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={styles.halfField}>
                                    <Text style={styles.label}>
                                        <Text style={styles.required}>* </Text>Office Type
                                    </Text>
                                    <CustomDropdown
                                        placeholder="Select Type"
                                        options={officeTypeOptions}
                                        value={type}
                                        onChange={setType}
                                    />
                                </View>
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Equipment</Text>
                                <CustomTextInput
                                    placeholder="Equipment list (one per line)"
                                    value={equipment}
                                    onChangeText={setEquipment}
                                    multiline={true}
                                    numberOfLines={4}
                                />
                            </View>

                            <View style={styles.formFooter}>
                                <PrimaryButton
                                    label="Cancel"
                                    filled={false}
                                    onPress={resetForm}
                                    style={{ width: "30%", height: hp(5.5), marginBottom: 0 }}
                                />
                                <PrimaryButton
                                    label="Save"
                                    filled={true}
                                    onPress={handleAddOffice}
                                    style={{ width: "30%", height: hp(5.5), marginBottom: 0 }}
                                    icon={<FontAwesome name="save" size={16} color="white" />}
                                />
                            </View>
                        </View>
                    )}

                    {/* Office List */}
                    <View style={styles.officeList}>
                        {offices.map(office => (
                            <OfficeCard
                                key={office.id}
                                office={office}
                                onEdit={handleEditOffice}
                                onDelete={handleDeleteOffice}
                            />
                        ))}
                    </View>
                </View>

                {/* Certificates Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="certificate" size={24} color="#4A90B9" />
                            </View>
                            <Text style={styles.sectionTitle}>Certificates P1</Text>
                        </View>
                    </View>

                    {/* Certificate Upload Sections */}
                    <View style={styles.certificatesContainer}>
                        <View style={styles.certificateSection}>
                            <Text style={styles.certificateLabel}>P1 Identifier</Text>
                            <TextInput
                                style={styles.certificateInput}
                                placeholder="Enter P1 identifier"
                                placeholderTextColor="#999"
                                value={p1Id}
                                onChangeText={setP1Id}
                            />
                        </View>

                        <CertificateUploadSection
                            title="TLS Certificate"
                            placeholder="Choose TLS certificate file"
                            onUpload={() => handleUploadCertificate('TLS')}
                            onRemove={() => setTlsCert('')}
                            fileUrl={tlsCert}
                            loading={isUploadingTls}
                        />

                        <CertificateUploadSection
                            title="WLS Certificate"
                            placeholder="Choose WLS certificate file"
                            onUpload={() => handleUploadCertificate('WLS')}
                            onRemove={() => setWlsCert('')}
                            fileUrl={wlsCert}
                            loading={isUploadingWls}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                            label="Save Changes"
                            filled={true}
                            icon={<FontAwesome name="save" size={16} color="white" />}
                            onPress={handleSaveChanges}
                            style={{ width: "100%" }}
                            loading={loading}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        marginHorizontal: 15,
        marginTop: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#E8F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    section: {
        marginBottom: 20,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#E8F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4A90B9',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    addButtonText: {
        color: 'white',
        marginLeft: 8,
        fontWeight: '500',
    },
    officeList: {
        padding: 16,
    },
    officeCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    officeInfo: {
        flex: 1,
    },
    officeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },
    officeDetail: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 2,
    },
    officeActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    certificatesContainer: {
        padding: 16,
    },
    certificateSection: {
        marginBottom: 20,
    },
    certificateLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333333',
    },
    certificateInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    uploadButton: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 16,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    uploadText: {
        color: '#4A90B9',
        marginLeft: 10,
        fontSize: 16,
    },
    iconButton: {
        padding: 8,
        marginLeft: 8,
    },
    addOfficeForm: {
        padding: 20,
        margin: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    halfField: {
        width: '48%',
    },
    formField: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    required: {
        color: '#FF6B6B',
    },
    formFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10,
        gap: 15,
    },
    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#4A90B9',
    },
    cancelBtnText: {
        color: '#4A90B9',
        fontWeight: '700',
        fontSize: 14,
    },
    filePreviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    fileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    fileUrlText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#1E293B',
    },
    actionIconsSide: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteFileIconSide: {
        padding: 5,
    },
});

export default OfficeCertificates;