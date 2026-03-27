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
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';



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
    tc: any;
    ds: any;
}

interface CertificateUploadSectionProps {
    title: string;
    placeholder: string;
    onUpload: () => void;
    onRemove: () => void;
    fileUrl?: string;
    loading?: boolean;
    tc: any;
    ds: any;
}

// Office Card Component
const OfficeCard = ({ office, onEdit, onDelete, t, tc, ds }: OfficeCardProps & { t: any }) => (
    <View style={ds.officeCard}>
        <View style={ds.officeInfo}>
            <Text style={ds.officeTitle}>{office.title}</Text>
            <Text style={ds.officeDetail}>{t('settings.office_certs.offices.details.floor')}: {office.floor}, {t('settings.office_certs.offices.details.number')}: {office.number}</Text>
            <Text style={ds.officeDetail}>{t('settings.office_certs.offices.details.type')}: {office.type}</Text>
            <Text style={ds.officeDetail}>{t('settings.office_certs.offices.details.equipment')}: {office.equipment}</Text>
        </View>
        <View style={ds.officeActions}>
            <TouchableOpacity onPress={() => onEdit(office.id)} style={ds.iconButton}>
                <Feather name="edit-2" size={20} color={tc.accent} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(office.id)} style={ds.iconButton}>
                <Feather name="trash-2" size={20} color={tc.accentRed || '#FF6B6B'} />
            </TouchableOpacity>
        </View>
    </View>
);

// Certificate Upload Section Component
const CertificateUploadSection = ({ title, placeholder, onUpload, onRemove, fileUrl, loading, t, tc, ds }: CertificateUploadSectionProps & { t: any }) => (
    <View style={ds.certificateSection}>
        <Text style={ds.certificateLabel}>{title}</Text>
        {loading ? (
            <View style={[ds.uploadButton, { borderStyle: 'solid' }]}>
                <ActivityIndicator size="small" color={tc.accent} />
                <Text style={[ds.uploadText, { marginLeft: 10 }]}>{t('settings.office_certs.certificates.uploading')}</Text>
            </View>
        ) : fileUrl ? (
            <View style={ds.filePreviewContainer}>
                <TouchableOpacity 
                    style={ds.fileInfo} 
                    onPress={() => Linking.openURL(fileUrl)}
                >
                    <MaterialCommunityIcons name="paperclip" size={20} color={tc.textMuted} />
                    <Text style={ds.fileUrlText} numberOfLines={1}>
                        {fileUrl.split('/').pop()}
                    </Text>
                </TouchableOpacity>
                <View style={ds.actionIconsSide}>
                    <TouchableOpacity onPress={onRemove} style={ds.deleteFileIconSide}>
                        <Feather name="trash-2" size={16} color={tc.accentRed || '#FF6B6B'} />
                    </TouchableOpacity>
                </View>
            </View>
        ) : (
            <TouchableOpacity style={ds.uploadButton} onPress={onUpload}>
                <Feather name="upload" size={20} color={tc.accent} />
                <Text style={ds.uploadText}>{placeholder}</Text>
            </TouchableOpacity>
        )}
    </View>
);

const OfficeCertificates = ({ onAlert }: { onAlert?: (config: any) => void }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);

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
                if (onAlert) onAlert({ visible: true, type: 'error', message: t('settings.office_certs.alerts.upload_error') });
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
        { label: t('settings.office_certs.offices.types.medical'), value: 'Medical office' },
        { label: t('settings.office_certs.offices.types.therapy'), value: 'Therapy office' },
        { label: t('settings.office_certs.offices.types.diagnostic'), value: 'Diagnostic office' },
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
                    message: t('settings.office_certs.alerts.save_success')
                });
            }
            fetchSettings();
        } catch (error) {
            console.error('Error saving director settings:', error);
            if (onAlert) onAlert({ visible: true, type: 'error', message: t('settings.office_certs.alerts.save_error') });
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
        <View style={ds.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.cardBackground} />

            <View style={ds.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                    <Ionicons name="chevron-back" size={24} color={tc.textPrimary} />
                </TouchableOpacity>
                <View style={ds.headerIconContainer}>
                    <MaterialCommunityIcons name="office-building" size={24} color={tc.accent} />
                </View>
                <Text style={ds.headerTitle}>{t('settings.office_certs.title')}</Text>
            </View>

            <ScrollView style={ds.container}>
                {/* Offices Section */}
                <View style={ds.section}>
                    <View style={ds.sectionHeader}>
                        <View style={ds.sectionTitleContainer}>
                            <View style={ds.iconContainer}>
                                <MaterialIcons name="meeting-room" size={24} color={tc.accent} />
                            </View>
                            <Text style={ds.sectionTitle}>{t('settings.office_certs.offices.title')}</Text>
                        </View>

                        <PrimaryButton
                            label={showAddForm ? t('settings.office_certs.offices.buttons.hide_form') : t('settings.office_certs.offices.buttons.add_office')}
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
                        <View style={ds.addOfficeForm}>
                            <View style={ds.rowContainer}>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}>
                                        <Text style={ds.required}>* </Text>{t('settings.office_certs.offices.form.name')}
                                    </Text>
                                    <CustomTextInput
                                        placeholder={t('settings.office_certs.offices.form.name')}
                                        value={officeName}
                                        onChangeText={setOfficeName}
                                    />
                                </View>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}>
                                        <Text style={ds.required}>* </Text>{t('settings.office_certs.offices.form.floor')}
                                    </Text>
                                    <CustomTextInput
                                        placeholder={t('settings.office_certs.offices.form.floor')}
                                        value={floor}
                                        onChangeText={setFloor}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View style={ds.rowContainer}>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}>
                                        <Text style={ds.required}>* </Text>{t('settings.office_certs.offices.form.number')}
                                    </Text>
                                    <CustomTextInput
                                        placeholder={t('settings.office_certs.offices.form.number_placeholder')}
                                        value={number}
                                        onChangeText={setNumber}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={ds.halfField}>
                                    <Text style={ds.label}>
                                        <Text style={ds.required}>* </Text>{t('settings.office_certs.offices.form.type')}
                                    </Text>
                                    <CustomDropdown
                                        placeholder={t('settings.office_certs.offices.form.type_placeholder')}
                                        options={officeTypeOptions}
                                        value={type}
                                        onChange={setType}
                                    />
                                </View>
                            </View>

                            <View style={ds.formField}>
                                <Text style={ds.label}>{t('settings.office_certs.offices.form.equipment')}</Text>
                                <CustomTextInput
                                    placeholder={t('settings.office_certs.offices.form.equipment_placeholder')}
                                    value={equipment}
                                    onChangeText={setEquipment}
                                    multiline={true}
                                    numberOfLines={4}
                                />
                            </View>
                            
                            <View style={ds.formFooter}>
                                <PrimaryButton
                                    label={t('settings.office_certs.offices.buttons.cancel')}
                                    filled={false}
                                    onPress={resetForm}
                                    style={{ width: "30%", height: hp(5.5), marginBottom: 0 }}
                                />
                                <PrimaryButton
                                    label={t('settings.office_certs.offices.buttons.save')}
                                    filled={true}
                                    onPress={handleAddOffice}
                                    style={{ width: "30%", height: hp(5.5), marginBottom: 0 }}
                                    icon={<FontAwesome name="save" size={16} color="white" />}
                                />
                            </View>
                        </View>
                    )}

                    {/* Office List */}
                    <View style={ds.officeList}>
                        {offices.map(office => (
                            <OfficeCard
                                key={office.id}
                                office={office}
                                onEdit={handleEditOffice}
                                onDelete={handleDeleteOffice}
                                t={t}
                                tc={tc}
                                ds={ds}
                            />
                        ))}
                    </View>
                </View>

                {/* Certificates Section */}
                <View style={ds.section}>
                    <View style={ds.sectionHeader}>
                        <View style={ds.sectionTitleContainer}>
                            <View style={ds.iconContainer}>
                                <MaterialCommunityIcons name="certificate" size={24} color={tc.accent} />
                            </View>
                            <Text style={ds.sectionTitle}>{t('settings.office_certs.certificates.title')}</Text>
                        </View>
                    </View>

                    {/* Certificate Upload Sections */}
                        <View style={ds.certificatesContainer}>
                        <View style={ds.certificateSection}>
                            <Text style={ds.certificateLabel}>{t('settings.office_certs.certificates.p1_id')}</Text>
                            <TextInput
                                style={[ds.certificateInput, { color: tc.textPrimary, backgroundColor: tc.inputBackground, borderColor: tc.borderColor }]}
                                placeholder={t('settings.office_certs.certificates.p1_placeholder')}
                                placeholderTextColor={tc.textMuted}
                                value={p1Id}
                                onChangeText={setP1Id}
                            />
                        </View>

                        <CertificateUploadSection
                            title={t('settings.office_certs.certificates.tls_label')}
                            placeholder={t('settings.office_certs.certificates.tls_placeholder')}
                            onUpload={() => handleUploadCertificate('TLS')}
                            onRemove={() => setTlsCert('')}
                            fileUrl={tlsCert}
                            loading={isUploadingTls}
                            t={t}
                            tc={tc}
                            ds={ds}
                        />

                        <CertificateUploadSection
                            title={t('settings.office_certs.certificates.wls_label')}
                            placeholder={t('settings.office_certs.certificates.wls_placeholder')}
                            onUpload={() => handleUploadCertificate('WLS')}
                            onRemove={() => setWlsCert('')}
                            fileUrl={wlsCert}
                            loading={isUploadingWls}
                            t={t}
                            tc={tc}
                            ds={ds}
                        />
                    </View>

                    <View style={ds.buttonContainer}>
                        <PrimaryButton
                            label={t('settings.office_certs.buttons.save_changes')}
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

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: tc.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.1)' : '#E8F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    section: {
        marginBottom: 20,
        backgroundColor: tc.cardBackground,
        overflow: 'hidden',
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.1)' : '#E8F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    officeList: {
        padding: 16,
    },
    officeCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : tc.cardBackground,
    },
    officeInfo: {
        flex: 1,
    },
    officeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: tc.textPrimary,
        marginBottom: 4,
    },
    officeDetail: {
        fontSize: 14,
        color: tc.textSecondary,
        marginBottom: 2,
    },
    officeActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 8,
        marginLeft: 8,
    },
    certificatesContainer: {
        padding: 16,
    },
    certificateSection: {
        marginBottom: 20,
    },
    certificateLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: tc.textPrimary,
    },
    certificateInput: {
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        color: tc.textPrimary,
    },
    uploadButton: {
        borderWidth: 1.5,
        borderColor: tc.borderColor,
        borderRadius: 10,
        padding: 16,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
    },
    uploadText: {
        color: tc.accent,
        marginLeft: 10,
        fontSize: 15,
        fontWeight: '500',
    },
    addOfficeForm: {
        padding: 20,
        margin: 16,
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 12,
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
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
        color: tc.textSecondary,
        marginBottom: 8,
    },
    required: {
        color: tc.accentRed || '#FF6B6B',
    },
    formFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10,
        gap: 15,
    },
    filePreviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
        borderRadius: 8,
    },
    fileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    fileUrlText: {
        marginLeft: 10,
        fontSize: 14,
        color: tc.textPrimary,
        fontWeight: '500',
    },
    actionIconsSide: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteFileIconSide: {
        padding: 8,
    },
    buttonContainer: {
        marginHorizontal: 0,
        marginTop: 10,
        paddingBottom: 20,
    },
});

export default OfficeCertificates;