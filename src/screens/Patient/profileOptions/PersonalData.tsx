import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView,
    TextInput,
    Switch,
    LayoutAnimation,
    Platform,
    UIManager,
    Modal,
    ActivityIndicator,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GetPatientPersonalData, UpdatePersonalData } from '../../../Services/PersonalData.Service';
import PrimaryButton from '../../../component/button';
import DocumentPicker from 'react-native-document-picker';
import { uploadFileOnServer } from '../../../Services/Upload.Service';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useMemo } from 'react';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AccordionItem = ({ title, icon, children, ds, tc }: { title: string, icon: string, children: React.ReactNode, ds: any, tc: any }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View style={ds.accordionContainer}>
            <TouchableOpacity 
                style={[ds.accordionHeader, expanded && ds.expandedHeader]} 
                onPress={toggleExpand}
                activeOpacity={0.7}
            >
                <View style={ds.headerLeft}>
                    <View style={ds.iconContainer}>
                        <Feather name={icon} size={18} color={tc.accent} />
                    </View>
                    <Text style={ds.accordionTitle}>{title}</Text>
                </View>
                <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color={tc.textMuted} />
            </TouchableOpacity>
            {expanded && (
                <View style={ds.accordionContent}>
                    {children}
                </View>
            )}
        </View>
    );
};

const FormInput = ({ label, placeholder, required = false, isDropdown = false, value, onChangeText, onPress, autoCapitalize, keyboardType, ds, tc }: any) => {
    const isDark = tc.isDark; // Simplified check
    return (
        <View style={ds.inputGroup}>
            <View style={ds.labelRow}>
                {required && <Text style={ds.requiredStar}>* </Text>}
                <Text style={ds.inputLabel}>{label}:</Text>
            </View>
            <TouchableOpacity 
                style={ds.inputWrapper} 
                activeOpacity={isDropdown ? 0.7 : 1}
                onPress={isDropdown ? onPress : undefined}
            >
                <View style={{ flex: 1 }}>
                    <TextInput 
                        style={ds.textInput}
                        placeholder={placeholder}
                        placeholderTextColor={tc.textMuted}
                        editable={!isDropdown}
                        value={value}
                        onChangeText={onChangeText}
                        pointerEvents={isDropdown ? 'none' : 'auto'}
                        autoCapitalize={autoCapitalize}
                        keyboardType={keyboardType}
                    />
                </View>
                {isDropdown && <Feather name="chevron-down" size={16} color={tc.textMuted} />}
            </TouchableOpacity>
        </View>
    );
};

const SectionHeader = ({ title, ds }: { title: string, ds: any }) => (
    <Text style={ds.sectionSubHeader}>{title}</Text>
);

const SubmitButton = ({ title, onPress, color, loading = false, ds, tc }: any) => (
    <TouchableOpacity 
        style={[ds.submitButtonContainer, loading && { opacity: 0.7 }]} 
        onPress={loading ? undefined : onPress}
    >
        <LinearGradient
            colors={color || [tc.accentGradientStart, tc.accentGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{flex: 1, width: 100, height: '100%', justifyContent: 'center', alignItems: 'center' }}
        >
            <View style={{ }}>
                {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <Text style={ds.submitButtonText}>{title}</Text>
                )}
            </View>
        </LinearGradient>
    </TouchableOpacity>
);


const PersonalData = ({ patientData: initialPatientData, onAlert }: { patientData: any, onAlert?: (type: 'success' | 'error' | 'warning', message: string) => void }) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);
    const commonProps = { ds, tc };
    
    const [patientData, setPatientData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showInsurerModal, setShowInsurerModal] = useState(false);
    const [showAuthorizedModal, setShowAuthorizedModal] = useState(false);
    const [authorizeAnyone, setAuthorizeAnyone] = useState(false);
    const [signedAuthorization, setSignedAuthorization] = useState(false);
    
    // Dropdown pickers
    const [showBranchPicker, setShowBranchPicker] = useState(false);
    const [showRightsPicker, setShowRightsPicker] = useState(false);
    
    // Add New Insurer local state
    const [newInsurerData, setNewInsurerData] = useState({
        name: '',
        policy: '',
        startDate: new Date(),
        validUntil: new Date()
    });
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showValidPicker, setShowValidPicker] = useState(false);
    
    const nfzBranches = [
        "01 NFZ Dolnośląskie", "02 NFZ Kujawsko-Pomorskie", "03 NFZ Lubelskie",
        "04 NFZ Lubuskie", "05 NFZ Łódzkie", "06 NFZ Małopolskie",
        "07 NFZ Warsaw", "08 NFZ Opolskie", "09 NFZ Podkarpackie",
        "10 NFZ Podlaskie", "11 NFZ Pomorskie", "12 NFZ Śląskie",
        "13 NFZ Świętokrzyskie", "14 NFZ Warmińsko-Mazurskie",
        "15 NFZ Wielkopolskie", "16 NFZ Zachodniopomorskie"
    ];
    
    const insuranceRights = [
        "X", "DN - Children and youth under 18", "IB - War invalids",
        "IW - Military invalids", "PO - Forced labor workers",
        "WP - Injured veterans", "ZK - Honorary blood donors"
    ];
    
    const voivodeships = [
        "Dolnośląskie", "Kujawsko-pomorskie", "Lubelskie", "Lubuskie",
        "Łódzkie", "Małopolskie", "Mazowieckie", "Opolskie",
        "Podkarpackie", "Podlaskie", "Pomorskie", "Śląskie",
        "Świętokrzyskie", "Warmińsko-mazurskie", "Wielkopolskie", "Zachodniopomorskie"
    ];
    
    const countries = ["Poland", "Germany", "United Kingdom", "France"];
    
    const [showVoivodeshipPicker, setShowVoivodeshipPicker] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [showEmpVoivodeshipPicker, setShowEmpVoivodeshipPicker] = useState(false);
    const [showEmpCountryPicker, setShowEmpCountryPicker] = useState(false);
    
    const authorizedRelationships = ["Spouse", "Parent", "Child", "Sibling", "Other"];
    const authorizedDocumentTypes = ["ID Card", "Passport", "Residence Card", "Other"];
    
    const [showAuthRelationPicker, setShowAuthRelationPicker] = useState(false);
    const [showAuthDocTypePicker, setShowAuthDocTypePicker] = useState(false);
    const [showAuthValidPicker, setShowAuthValidPicker] = useState(false);
    
    const [newAuthPerson, setNewAuthPerson] = useState({
        firstName: '',
        lastName: '',
        relationship: '',
        pesel: '',
        phone: '',
        email: '',
        address: '',
        docType: '',
        docNumber: '',
        validUntil: new Date()
    });
    const [editingAuthPersonId, setEditingAuthPersonId] = useState<string | null>(null);
    
    const [showConsentModal, setShowConsentModal] = useState(false);
    const [activeConsentId, setActiveConsentId] = useState<string | null>(null);
    const [consentFileName, setConsentFileName] = useState<string | null>(null);
    const [consentFile, setConsentFile] = useState<any>(null);
    const [uploadingConsent, setUploadingConsent] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    React.useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);
    
    const fetchPersonalData = async () => {
        try {
            const patientId = initialPatientData?.patientId || initialPatientData?.id || initialPatientData?._id;
            if (!patientId) {
                setLoading(false);
                return;
            }
            const response: any = await GetPatientPersonalData(patientId);
            if (response) {
                setPatientData(response);
            }
        } catch (error) {
            console.log("Fetch personal data error:", error);
        } finally {
            setLoading(false);
        }
    };
    
    React.useEffect(() => {
        fetchPersonalData();
    }, [initialPatientData]);
    

    const formatConsentDate = (dateVal: any) => {
        if (!dateVal) return null;
        
        // If it's already in "4 March 2026" format, return it
        if (typeof dateVal === 'string' && /^\d+\s\w+\s\d+$/.test(dateVal)) {
            return dateVal;
        }

        try {
            const date = new Date(dateVal);
            if (isNaN(date.getTime())) return null;

            return date.toLocaleDateString(t('common.dateLocale') || 'en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        } catch (e) {
            return null;
        }
    };

    const handleInputChange = (field: string, text: string) => {
        setPatientData((prev: any) => ({
            ...prev,
            [field]: text
        }));
    };

    const handleNewInsurerData = (field: string, value: any) => {
        setNewInsurerData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const onDateChange = (event: any, selectedDate?: Date, field?: string) => {
        if (field === 'start') setShowStartPicker(false);
        if (field === 'valid') setShowValidPicker(false);
        
        if (selectedDate) {
            handleNewInsurerData(field === 'start' ? 'startDate' : 'validUntil', selectedDate);
        }
    };

    const addNewInsurer = () => {
        if (!newInsurerData.name || !newInsurerData.policy) return;

        const newEntry = {
            id: Date.now().toString(),
            name: newInsurerData.name,
            policy: newInsurerData.policy,
            startDate: newInsurerData.startDate.toISOString().split('T')[0],
            validUntil: newInsurerData.validUntil.toISOString().split('T')[0],
        };

        setPatientData((prev: any) => ({
            ...prev,
            privateInsurers: [...(prev?.privateInsurers || []), newEntry]
        }));

        // Reset modal state
        setNewInsurerData({
            name: '',
            policy: '',
            startDate: new Date(),
            validUntil: new Date()
        });
        setShowInsurerModal(false);
    };

    const removeInsurer = (id: string) => {
        setPatientData((prev: any) => ({
            ...prev,
            privateInsurers: prev.privateInsurers.filter((i: any) => i.id !== id)
        }));
    };

    const handleAddressChange = (field: string, text: string) => {
        setPatientData((prev: any) => ({
            ...prev,
            address: {
                ...prev.address,
                [field]: text
            }
        }));
    };

    const handleEmployerChange = (field: string, value: string) => {
        setPatientData((prev: any) => ({
            ...prev,
            employer: {
                ...(prev?.employer || {}),
                [field]: value
            }
        }));
    };

    const handleEmployerAddressChange = (field: string, value: string) => {
        setPatientData((prev: any) => ({
            ...prev,
            employer: {
                ...(prev?.employer || {}),
                address: {
                    ...(prev?.employer?.address || {}),
                    [field]: value
                }
            }
        }));
    };

    const handleNewAuthPersonChange = (field: string, value: any) => {
        setNewAuthPerson(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addNewAuthorizedPerson = () => {
        if (!newAuthPerson.firstName || !newAuthPerson.lastName || !newAuthPerson.relationship) return;

        const entry = {
            id: editingAuthPersonId || Date.now().toString(),
            firstName: newAuthPerson.firstName,
            lastName: newAuthPerson.lastName,
            name: `${newAuthPerson.firstName} ${newAuthPerson.lastName}`,
            relationship: newAuthPerson.relationship,
            pesel: newAuthPerson.pesel,
            phone: newAuthPerson.phone,
            email: newAuthPerson.email,
            address: newAuthPerson.address,
            documentType: newAuthPerson.docType,
            documentNumber: newAuthPerson.docNumber,
            validUntil: newAuthPerson.validUntil.toISOString().split('T')[0]
        };

        if (editingAuthPersonId) {
            // Update existing
            setPatientData((prev: any) => ({
                ...prev,
                authorizedPersons: (prev?.authorizedPersons || []).map((p: any) =>
                    p.id === editingAuthPersonId ? entry : p
                )
            }));
        } else {
            // Add new
            setPatientData((prev: any) => ({
                ...prev,
                authorizedPersons: [...(prev?.authorizedPersons || []), entry]
            }));
        }

        // Reset
        setEditingAuthPersonId(null);
        setNewAuthPerson({
            firstName: '', lastName: '', relationship: '', pesel: '',
            phone: '', email: '', address: '', docType: '',
            docNumber: '', validUntil: new Date()
        });
        setShowAuthorizedModal(false);
    };

    const editAuthorizedPerson = (person: any) => {
        setEditingAuthPersonId(person.id);
        setNewAuthPerson({
            firstName: person.firstName || '',
            lastName: person.lastName || '',
            relationship: person.relationship || '',
            pesel: person.pesel || '',
            phone: person.phone || '',
            email: person.email || '',
            address: person.address || '',
            docType: person.documentType || person.docType || '',
            docNumber: person.documentNumber || person.docNumber || '',
            validUntil: person.validUntil ? new Date(person.validUntil) : new Date()
        });
        setShowAuthorizedModal(true);
    };

    const removeAuthorizedPerson = (id: string) => {
        setPatientData((prev: any) => ({
            ...prev,
            authorizedPersons: prev.authorizedPersons.filter((p: any) => p.id !== id)
        }));
    };

    const openConsentModal = (consentId: string) => {
        setActiveConsentId(consentId);
        setConsentFileName(null);
        setShowConsentModal(true);
    };

    const handleSelectFile = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
            });
            if (result && result[0]) {
                const file = result[0];
                setConsentFileName(file.name || 'selected_file');
                setConsentFile({
                    uri: file.uri,
                    type: file.type,
                    name: file.name,
                });
            }
        } catch (err: any) {
            if (!DocumentPicker.isCancel(err)) {
                onAlert?.('error', t('personalData.fileSelectError'));
            }
        }
    };

    const handleUploadAndGrant = async () => {
        if (!consentFile || !activeConsentId) return;

        setUploadingConsent(true);
        try {
            const response: any = await uploadFileOnServer(consentFile);
            const fileUrl = response?.url || response?.data?.url || '';
            const documentUrl = fileUrl;
            const documentName = consentFileName || 'consent_form.pdf';
            
            const now = new Date();
            const grantedDate = now.toLocaleDateString(t('common.dateLocale') || 'en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
            const isoDate = now.toISOString();

            // Update the consent item to granted
            setPatientData((prev: any) => {
                const updatedConsents = (prev?.consents || [
                    { id: 'personal-data', title: t('personalData.consentPersonalDataTitle'), description: t('personalData.consentPersonalDataDescription') },
                    { id: 'medical-docs', title: t('personalData.consentMedicalDocsTitle'), description: t('personalData.consentMedicalDocsDescription') },
                    { id: 'electronic-comm', title: t('personalData.consentElectronicCommTitle'), description: t('personalData.consentElectronicCommDescription') }
                ]).map((c: any) =>
                    c.id === activeConsentId ? { ...c, granted: true, grantedDate, date: isoDate, fileUrl, documentUrl, documentName, withDraw: false } : c
                );
                return { ...prev, consents: updatedConsents };
            });

            setShowConsentModal(false);
            setConsentFileName(null);
            setConsentFile(null);
            setActiveConsentId(null);
            onAlert?.('success', t('personalData.consentUploadSuccess'));
        } catch (error) {
            console.error('Upload error:', error);
            onAlert?.('error', t('personalData.consentUploadError'));
        } finally {
            setUploadingConsent(false);
        }
    };

    const withdrawConsent = (consentId: string) => {
        setPatientData((prev: any) => {
            const updatedConsents = (prev?.consents || []).map((c: any) =>
                c.id === consentId ? { ...c, granted: false, withDraw: true, grantedDate: undefined, fileUrl: undefined, documentUrl: undefined, documentName: '' } : c
            );
            return { ...prev, consents: updatedConsents };
        });
        onAlert?.('success', t('personalData.consentWithdrawSuccess'));
    };

    const handleSave = async (section: string) => {
        const patientId = initialPatientData?.patientId || initialPatientData?.id || initialPatientData?._id;
        let payload: any = { patientId };

        try {
            if (section === 'basic' || section === 'more') {
                payload = {
                    ...payload,
                    name: patientData?.name,
                    lastName: patientData?.lastName,
                    middleName: patientData?.middleName,
                    maidenName: patientData?.maidenName,
                    pesel: patientData?.pesel,
                    dob: patientData?.dob,
                    gender: patientData?.gender,
                    phone: patientData?.phone,
                    alternativePhone: patientData?.alternativePhone,
                    email: patientData?.email,
                    birthPlace: patientData?.birthPlace,
                    bloodType: patientData?.bloodType,
                    internalCardNumber: patientData?.internalCardNumber,
                    documentType: patientData?.documentType,
                    isForeigner: patientData?.isForeigner
                };
            } else if (section === 'address') {
                payload = {
                    ...payload,
                    city: patientData?.city,
                    street: patientData?.street,
                    houseNumber: patientData?.houseNumber,
                    apartmentNumber: patientData?.address?.apartmentNumber || patientData?.apartmentNumber,
                    postalCode: patientData?.postalCode,
                    voivodeship: patientData?.voivodeship,
                    country: patientData?.country,
                    municipalityTeryt: patientData?.municipalityTeryt,
                    unknownAddress: patientData?.unknownAddress || false
                };
            } else if (section === 'insurance') {
                payload = {
                    ...payload,
                    insuranceBranch: patientData?.nfzBranch || patientData?.insuranceBranch,
                    additionalRights: patientData?.additionalRights,
                    privateInsurers: (patientData?.privateInsurers || []).map((ins: any) => ({
                        name: ins.name,
                        policyNumber: ins.policyNumber || ins.policy,
                        startDate: ins.startDate,
                        validUntil: ins.validUntil
                    }))
                };
            } else if (section === 'employer') {
                payload = {
                    ...payload,
                    name: patientData?.employer?.name,
                    nip: patientData?.employer?.nip,
                    occupation: patientData?.employer?.occupation,
                    productionSymbol: patientData?.employer?.productionSymbol,
                    city: patientData?.employer?.address?.city,
                    street: patientData?.employer?.address?.street,
                    houseNumber: patientData?.employer?.address?.houseNumber,
                    apartmentNumber: patientData?.employer?.address?.apartmentNumber,
                    postalCode: patientData?.employer?.address?.postalCode,
                    voivodeship: patientData?.employer?.address?.voivodeship,
                    country: patientData?.employer?.address?.country
                };
            } else if (section === 'authorized') {
                payload = {
                    ...payload,
                    authorizedPersons: (patientData?.authorizedPersons || []).map((p: any) => ({
                        firstName: p.firstName,
                        lastName: p.lastName,
                        relationship: p.relationship,
                        pesel: p.pesel,
                        address: p.address,
                        documentNumber: p.documentNumber,
                        documentType: p.documentType,
                        email: p.email,
                        id: p.id,
                        phone: p.phone,
                        validUntil: p.validUntil
                    }))
                };
            } else if (section === 'consents') {
                payload = {
                    ...payload,
                    consents: (patientData?.consents || []).map((c: any) => ({
                        id: c.id,
                        title: c.title,
                        description: c.description,
                        type: c.title,
                        granted: !!c.granted,
                        date: c.date || new Date().toISOString(),
                        documentName: c.documentName || '',
                        documentUrl: c.documentUrl || c.fileUrl || '',
                        withDraw: !!c.withDraw
                    }))
                };
            }

            console.log(`Submitting ${section} info:`, payload);
            setIsSaving(true);
            const res: any = await UpdatePersonalData(payload);
            if (res) {
                onAlert?.('success', t('personalData.saveSuccess', { section: section.charAt(0).toUpperCase() + section.slice(1) }));
                await fetchPersonalData();
            }
        } catch (error) {
            console.error(`Error updating ${section}:`, error);
            onAlert?.('error', t('personalData.saveError', { section: section.charAt(0).toUpperCase() + section.slice(1) }));
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, paddingVertical: 40, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#4A90B9" />
                <Text style={{ marginTop: 15, color: '#64748b' }}>{t('personalData.fetchingDetails')}</Text>
            </View>
        );
    }

    const renderAddInsurerModal = () => (
        <Modal
            visible={showInsurerModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowInsurerModal(false)}
        >
            <View style={[ds.modalOverlay, keyboardVisible && ds.modalOverlayKeyboardVisible]}>
                <KeyboardAvoidingView
                    style={ds.modalKeyboardContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
                >
                <View style={ds.modalContent}>
                    <View style={ds.modalHeader}>
                        <Text style={ds.modalTitle}>{t('personalData.addNewInsurer')}</Text>
                        <TouchableOpacity onPress={() => setShowInsurerModal(false)}>
                            <Feather name="x" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView
                        style={ds.modalScroll}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
                    >
                        <FormInput {...commonProps} 
                            label={t('personalData.insurerName')} required placeholder={t('personalData.insurerName')} 
                            value={newInsurerData.name}
                            onChangeText={(val: string) => handleNewInsurerData('name', val)}
                        />
                        <FormInput {...commonProps} 
                            label={t('personalData.policyNumber')} required placeholder={t('personalData.policyNumber')} 
                            value={newInsurerData.policy}
                            onChangeText={(val: string) => handleNewInsurerData('policy', val)}
                        />
                        <FormInput {...commonProps} 
                            label={t('personalData.startDate')} required placeholder={t('personalData.selectDate')} isDropdown 
                            value={newInsurerData.startDate.toLocaleDateString()}
                            onPress={() => setShowStartPicker(true)}
                        />
                        <FormInput {...commonProps} 
                            label={t('personalData.validUntil')} required placeholder={t('personalData.selectDate')} isDropdown 
                            value={newInsurerData.validUntil.toLocaleDateString()}
                            onPress={() => setShowValidPicker(true)}
                        />

                        {showStartPicker && (
                            <DateTimePicker
                                value={newInsurerData.startDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, date) => onDateChange(event, date, 'start')}
                            />
                        )}
                        {showValidPicker && (
                            <DateTimePicker
                                value={newInsurerData.validUntil}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, date) => onDateChange(event, date, 'valid')}
                            />
                        )}
                    </ScrollView>

                    <View style={ds.modalFooter}>
                        <TouchableOpacity 
                            style={ds.cancelButton}
                            onPress={() => setShowInsurerModal(false)}
                        >
                            <Text style={ds.cancelButtonText}>{t('personalData.cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={ds.addButton}
                            onPress={addNewInsurer}
                        >
                            <Text style={ds.addButtonText}>{t('personalData.add')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );

    const renderAddAuthorizedModal = () => (
        <Modal
            visible={showAuthorizedModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowAuthorizedModal(false)}
        >
            <View style={[ds.modalOverlay, keyboardVisible && ds.modalOverlayKeyboardVisible]}>
                <KeyboardAvoidingView
                    style={ds.modalKeyboardContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
                >
                <View style={ds.modalContent}>
                    <View style={ds.modalHeader}>
                        <Text style={ds.modalTitle}>{editingAuthPersonId ? t('personalData.editAuthorizedPerson') : t('personalData.addAuthorizedPerson')}</Text>
                        <TouchableOpacity onPress={() => {
                            setEditingAuthPersonId(null);
                            setNewAuthPerson({
                                firstName: '', lastName: '', relationship: '', pesel: '',
                                phone: '', email: '', address: '', docType: '',
                                docNumber: '', validUntil: new Date()
                            });
                            setShowAuthorizedModal(false);
                        }}>
                            <Feather name="x" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView
                        style={ds.modalScroll}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
                    >
                        <View style={ds.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput {...commonProps} 
                                    label={t('personalData.firstName')} required placeholder={t('personalData.firstName')} 
                                    value={newAuthPerson.firstName}
                                    onChangeText={(val: string) => handleNewAuthPersonChange('firstName', val)}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput {...commonProps} 
                                    label={t('personalData.lastName')} required placeholder={t('personalData.lastName')} 
                                    value={newAuthPerson.lastName}
                                    onChangeText={(val: string) => handleNewAuthPersonChange('lastName', val)}
                                />
                            </View>
                        </View>
                        
                        <View style={ds.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput {...commonProps} 
                                    label={t('personalData.relationship')} required placeholder={t('personalData.relationship')} isDropdown 
                                    value={newAuthPerson.relationship}
                                    onPress={() => setShowAuthRelationPicker(!showAuthRelationPicker)}
                                />
                                {showAuthRelationPicker && (
                                    <View style={ds.inlineDropdown}>
                                        {authorizedRelationships.map((opt, idx) => (
                                            <TouchableOpacity 
                                                key={idx} 
                                                style={[
                                                    ds.inlineDropdownOption,
                                                    newAuthPerson.relationship === opt && ds.inlineDropdownOptionSelected
                                                ]}
                                                onPress={() => {
                                                    handleNewAuthPersonChange('relationship', opt);
                                                    setShowAuthRelationPicker(false);
                                                }}
                                            >
                                                <Text style={[
                                                    ds.inlineDropdownOptionText,
                                                    newAuthPerson.relationship === opt && ds.inlineDropdownOptionTextSelected
                                                ]}>{opt}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput {...commonProps} 
                                    label={t('personalData.pesel')} placeholder={t('personalData.pesel')} 
                                    value={newAuthPerson.pesel}
                                    onChangeText={(val: string) => handleNewAuthPersonChange('pesel', val)}
                                />
                            </View>
                        </View>

                        <View style={ds.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput {...commonProps} 
                                    label={t('personalData.phone')} required placeholder={t('personalData.phone')} 
                                    value={newAuthPerson.phone}
                                    onChangeText={(val: string) => handleNewAuthPersonChange('phone', val)}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput {...commonProps} 
                                    label={t('personalData.email')} placeholder={t('personalData.email')} 
                                    value={newAuthPerson.email}
                                    onChangeText={(val: string) => handleNewAuthPersonChange('email', val)}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        <FormInput {...commonProps} 
                            label={t('personalData.address')} placeholder={t('personalData.address')} 
                            value={newAuthPerson.address}
                            onChangeText={(val: string) => handleNewAuthPersonChange('address', val)}
                        />

                        <FormInput {...commonProps} 
                            label={t('personalData.docType')} required placeholder={t('personalData.docType')} isDropdown 
                            value={newAuthPerson.docType}
                            onPress={() => setShowAuthDocTypePicker(!showAuthDocTypePicker)}
                        />
                        {showAuthDocTypePicker && (
                            <View style={ds.inlineDropdown}>
                                {authorizedDocumentTypes.map((opt, idx) => (
                                    <TouchableOpacity 
                                        key={idx} 
                                        style={[
                                            ds.inlineDropdownOption,
                                            newAuthPerson.docType === opt && ds.inlineDropdownOptionSelected
                                        ]}
                                        onPress={() => {
                                            handleNewAuthPersonChange('docType', opt);
                                            setShowAuthDocTypePicker(false);
                                        }}
                                    >
                                        <Text style={[
                                            ds.inlineDropdownOptionText,
                                            newAuthPerson.docType === opt && ds.inlineDropdownOptionTextSelected
                                        ]}>{opt}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <View style={ds.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput {...commonProps} 
                                    label={t('personalData.docNumber')} required placeholder={t('personalData.docNumber')} 
                                    value={newAuthPerson.docNumber}
                                    onChangeText={(val: string) => handleNewAuthPersonChange('docNumber', val)}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput {...commonProps} 
                                    label={t('personalData.validUntil')} required placeholder={t('personalData.validUntil')} isDropdown 
                                    value={newAuthPerson.validUntil.toLocaleDateString()}
                                    onPress={() => setShowAuthValidPicker(!showAuthValidPicker)}
                                />
                            </View>
                        </View>

                        {showAuthValidPicker && (
                            <View style={ds.datePickerContainer}>
                                <View style={ds.datePickerHeader}>
                                    <Text style={ds.datePickerTitle}>{t('personalData.validUntil')}</Text>
                                    <TouchableOpacity onPress={() => setShowAuthValidPicker(false)}>
                                        <Text style={ds.datePickerDone}>{t('common.save')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    value={newAuthPerson.validUntil}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => {
                                        if (Platform.OS === 'android') setShowAuthValidPicker(false);
                                        if (date) handleNewAuthPersonChange('validUntil', date);
                                    }}
                                    style={{ height: 150 }}
                                    textColor="#1e293b"
                                />
                            </View>
                        )}
                    </ScrollView>

                    <View style={ds.modalFooter}>
                        <TouchableOpacity 
                            style={ds.cancelButton}
                            onPress={() => {
                                setEditingAuthPersonId(null);
                                setNewAuthPerson({
                                    firstName: '', lastName: '', relationship: '', pesel: '',
                                    phone: '', email: '', address: '', docType: '',
                                    docNumber: '', validUntil: new Date()
                                });
                                setShowAuthorizedModal(false);
                            }}
                        >
                            <Text style={ds.cancelButtonText}>{t('personalData.cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={ds.addButton}
                            onPress={addNewAuthorizedPerson}
                        >
                            <Text style={ds.addButtonText}>{editingAuthPersonId ? t('personalData.save') : t('personalData.add')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );

    const renderConsentUploadModal = () => (
        <Modal
            visible={showConsentModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowConsentModal(false)}
        >
            <View style={[ds.modalOverlay, keyboardVisible && ds.modalOverlayKeyboardVisible]}>
                <KeyboardAvoidingView
                    style={ds.modalKeyboardContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
                >
                <View style={ds.modalContent}>
                    <View style={ds.modalHeader}>
                        <Text style={ds.modalTitle}>{t('personalData.uploadConsentTitle')}</Text>
                        <TouchableOpacity onPress={() => setShowConsentModal(false)}>
                            <Feather name="x" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>

                    <View style={{ padding: 20 }}>
                        <Text style={ds.consentModalDesc}>
                            {t('personalData.uploadConsentDesc')}
                        </Text>

                        <PrimaryButton
                            label={t('personalData.selectFile')}
                            filled
                            onPress={handleSelectFile}
                            icon={<Feather name="upload" size={16} color="#ffffff" />}
                            style={{ width: 150, height: 44, alignSelf: 'flex-start', marginBottom: 16, borderRadius: 10 }}
                        />

                        {consentFileName && (
                            <View style={ds.selectedFileRow}>
                                <Feather name="file-text" size={16} color="#58a6b8" />
                                <Text style={ds.selectedFileName}>{consentFileName}</Text>
                                <TouchableOpacity onPress={() => { setConsentFileName(null); setConsentFile(null); }}>
                                    <Feather name="x-circle" size={16} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        )}

                        <Text style={ds.fileTypeHint}>
                            {t('personalData.acceptedFileTypes')}
                        </Text>
                    </View>

                    <View style={ds.modalFooter}>
                        <PrimaryButton
                            label={t('personalData.cancel')}
                            filled={false}
                            onPress={() => {
                                setShowConsentModal(false);
                                setConsentFileName(null);
                                setActiveConsentId(null);
                            }}
                            style={{ flex: 1, marginRight: 10, height: 44, borderRadius: 10 }}
                        />
                        <PrimaryButton
                            label={uploadingConsent ? t('personalData.uploading') : t('personalData.uploadAndGrant')}
                            filled
                            onPress={handleUploadAndGrant}
                            disabled={!consentFile || uploadingConsent}
                            loading={uploadingConsent}
                            style={{ flex: 1.5, height: 44, borderRadius: 10 }}
                        />
                    </View>
                </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );

    const renderSelectionModal = (visible: boolean, onClose: () => void, options: string[], title: string, onSelect: (val: string) => void) => (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={ds.modalOverlay} onPress={onClose}>
                <View style={[ds.modalContent, { maxHeight: '60%' }]}>
                    <View style={ds.modalHeader}>
                        <Text style={ds.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {options.map((opt, idx) => (
                            <TouchableOpacity 
                                key={idx} 
                                style={ds.selectOption}
                                onPress={() => {
                                    onSelect(opt);
                                    onClose();
                                }}
                            >
                                <Text style={ds.selectOptionText}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Pressable>
        </Modal>
    );

    return (
        <ScrollView style={ds.container} showsVerticalScrollIndicator={false}>
            {renderAddInsurerModal()}
            {renderAddAuthorizedModal()}
            {renderConsentUploadModal()}
            {renderSelectionModal(showBranchPicker, () => setShowBranchPicker(false), nfzBranches, t('personalData.nfzBranch'), (val) => handleInputChange('nfzBranch', val))}
            {renderSelectionModal(showRightsPicker, () => setShowRightsPicker(false), insuranceRights, t('personalData.additionalRights'), (val) => handleInputChange('additionalRights', val))}
            {renderSelectionModal(showVoivodeshipPicker, () => setShowVoivodeshipPicker(false), voivodeships, t('personalData.voivodeship'), (val) => handleInputChange('voivodeship', val))}
            {renderSelectionModal(showCountryPicker, () => setShowCountryPicker(false), countries, t('personalData.country'), (val) => handleInputChange('country', val))}
            {renderSelectionModal(showEmpVoivodeshipPicker, () => setShowEmpVoivodeshipPicker(false), voivodeships, t('personalData.voivodeship'), (val) => handleEmployerAddressChange('voivodeship', val))}
            {renderSelectionModal(showEmpCountryPicker, () => setShowEmpCountryPicker(false), countries, t('personalData.country'), (val) => handleEmployerAddressChange('country', val))}
            
            <AccordionItem {...commonProps} title={t('personalData.basicInformation')} icon="user">
                <FormInput {...commonProps} 
                    label={t('personalData.firstName')} required placeholder={t('personalData.placeholderFirstName')}
                    value={patientData?.name} 
                    onChangeText={(text: string) => handleInputChange('name', text)}
                />
                <FormInput {...commonProps} 
                    label={t('personalData.lastName')} required placeholder={t('personalData.placeholderLastName')}
                    value={patientData?.lastName} 
                    onChangeText={(text: string) => handleInputChange('lastName', text)}
                />
                <FormInput {...commonProps} 
                    label={t('personalData.pesel')} required placeholder={t('personalData.placeholderPesel')}
                    value={patientData?.pesel} 
                    onChangeText={(text: string) => handleInputChange('pesel', text)}
                />
                <FormInput {...commonProps} 
                    label={t('personalData.dob')} required placeholder={t('personalData.selectDate')} isDropdown
                    value={patientData?.dob ? new Date(patientData.dob).toLocaleDateString() : ''} 
                />
                <FormInput {...commonProps} 
                    label={t('personalData.gender')} required placeholder={t('personalData.placeholderSelectGender')} isDropdown
                    value={patientData?.gender} 
                />
                <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                    <SubmitButton {...commonProps} title={t('personalData.submit')} onPress={() => handleSave('basic')} loading={isSaving} />
                </View>
            </AccordionItem>
            <AccordionItem {...commonProps} title={t('personalData.moreInformation')} icon="info">
                <FormInput {...commonProps} 
                    label={t('personalData.middleName')} placeholder={t('personalData.placeholderMiddleName')}
                    value={patientData?.middleName} 
                    onChangeText={(text: string) => handleInputChange('middleName', text)}
                />
                <FormInput {...commonProps} 
                    label={t('personalData.maidenName')} placeholder={t('personalData.placeholderMaidenName')}
                    value={patientData?.maidenName} 
                    onChangeText={(text: string) => handleInputChange('maidenName', text)}
                />
                <FormInput {...commonProps} 
                    label={t('personalData.birthPlace')} placeholder={t('personalData.placeholderBirthPlace')}
                    value={patientData?.birthPlace} 
                    onChangeText={(text: string) => handleInputChange('birthPlace', text)}
                />
                <FormInput {...commonProps} 
                    label={t('personalData.bloodType')} placeholder={t('personalData.placeholderBloodType')}
                    value={patientData?.bloodType} 
                    onChangeText={(text: string) => handleInputChange('bloodType', text)}
                />
                <FormInput {...commonProps} 
                    label={t('personalData.internalCardNumber')} placeholder={t('personalData.placeholderNumber')}
                    value={patientData?.internalCardNumber} 
                    onChangeText={(text: string) => handleInputChange('internalCardNumber', text)}
                />
                <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                    <SubmitButton {...commonProps} title={t('personalData.submit')} onPress={() => handleSave('more')} loading={isSaving} />
                </View>
            </AccordionItem>

            <AccordionItem {...commonProps} title={t('personalData.address')} icon="map-pin">
                <FormInput {...commonProps} 
                    label={t('personalData.city')} required placeholder={t('personalData.placeholderCity')}
                    value={patientData?.city} 
                    onChangeText={(text: string) => handleInputChange('city', text)}
                />
                <FormInput {...commonProps} 
                    label={t('personalData.street')} required placeholder={t('personalData.placeholderStreet')}
                    value={patientData?.street} 
                    onChangeText={(text: string) => handleInputChange('street', text)}
                />
                <View style={ds.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput {...commonProps} 
                            label={t('personalData.house')} required placeholder={t('personalData.placeholderNumber')}
                            value={patientData?.houseNumber} 
                            onChangeText={(text: string) => handleInputChange('houseNumber', text)}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput {...commonProps} 
                            label={t('personalData.apartment')} placeholder={t('personalData.placeholderNumber')}
                            value={patientData?.apartmentNumber} 
                            onChangeText={(text: string) => handleInputChange('apartmentNumber', text)}
                        />
                    </View>
                </View>
                <FormInput {...commonProps} 
                    label={t('personalData.postalCode')} required placeholder={t('personalData.placeholderPostalCode')}
                    value={patientData?.postalCode} 
                    onChangeText={(text: string) => handleInputChange('postalCode', text)}
                />
                <View style={ds.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput {...commonProps} 
                            label={t('personalData.voivodeship')} required placeholder={t('personalData.placeholderSelectVoivodeship')} isDropdown
                            value={patientData?.voivodeship}
                            onPress={() => setShowVoivodeshipPicker(true)}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput {...commonProps} 
                            label={t('personalData.country')} required placeholder={t('personalData.placeholderSelectCountry')} isDropdown
                            value={patientData?.country}
                            onPress={() => setShowCountryPicker(true)}
                        />
                    </View>
                </View>
                <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                    <SubmitButton {...commonProps} title={t('personalData.submit')} onPress={() => handleSave('address')} loading={isSaving} />
                </View>
            </AccordionItem>

            <AccordionItem {...commonProps} title={t('personalData.insurance')} icon="shield">
                <SectionHeader {...commonProps} title={t('personalData.insuredInNfz')} />
                <View style={ds.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput {...commonProps} 
                            label={t('personalData.nfzBranch')} required placeholder={t('personalData.placeholderSelectBranch')} isDropdown
                            value={patientData?.nfzBranch}
                            onPress={() => setShowBranchPicker(true)}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput {...commonProps} 
                            label={t('personalData.additionalRights')} required placeholder={t('personalData.placeholderSelectRights')} isDropdown
                            value={patientData?.additionalRights}
                            onPress={() => setShowRightsPicker(true)}
                        />
                    </View>
                </View>

                <View style={[ds.row, { alignItems: 'center', marginTop: 15, justifyContent: 'space-between' }]}>
                    <SectionHeader {...commonProps} title={t('personalData.privateInsurers')} />
                    <View style={ds.miniSearch}>
                        <Feather name="search" size={14} color="#94a3b8" />
                        <TextInput style={ds.miniSearchInput} placeholder={t('personalData.searchInsurer')} placeholderTextColor="#cbd5e1" />
                    </View>
                </View>

                {patientData?.privateInsurers && patientData.privateInsurers.length > 0 ? (
                    patientData.privateInsurers.map((insurer: any, index: number) => (
                        <View key={insurer.id || `insurer-${index}`} style={ds.insurerCard}>
                            <View style={ds.insurerCardContent}>
                                <Text style={ds.insurerName}>{insurer.name}</Text>
                                <Text style={ds.insurerDetail}>{t('personalData.policyNumber')}: {insurer.policy}</Text>
                                <Text style={ds.insurerDetail}>{t('personalData.active')}: {insurer.startDate}</Text>
                                <Text style={ds.insurerDetail}>{t('personalData.validUntil')}: {insurer.validUntil}</Text>
                            </View>
                            <TouchableOpacity onPress={() => removeInsurer(insurer.id)}>
                                <Feather name="trash-2" size={18} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={ds.noDataTextMinimal}>{t('personalData.noInsurers')}</Text>
                )}

                <TouchableOpacity 
                    style={ds.outlineButton}
                    onPress={() => setShowInsurerModal(true)}
                >
                    <Feather name="plus" size={16} color="#58a6b8" />
                    <Text style={ds.outlineButtonText}>{t('personalData.addInsurer')}</Text>
                </TouchableOpacity>
 
                <Text style={ds.disclaimerText}>
                    {t('personalData.disclaimerSave')}
                </Text>
 
                <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                    <SubmitButton {...commonProps} title={t('personalData.submit')} onPress={() => handleSave('insurance')} loading={isSaving} />
                </View>
            </AccordionItem>
 
            <AccordionItem {...commonProps} title={t('personalData.employer')} icon="briefcase">
                <SectionHeader {...commonProps} title={t('personalData.employer')} />
                <FormInput {...commonProps} 
                    label={t('personalData.employerName')} required placeholder="" 
                    value={patientData?.employer?.name || ''}
                    onChangeText={(text: string) => handleEmployerChange('name', text)}
                />
                <View style={ds.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput {...commonProps} 
                            label={t('personalData.employerNip')} required placeholder="" 
                            value={patientData?.employer?.nip || ''}
                            onChangeText={(text: string) => handleEmployerChange('nip', text)}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput {...commonProps} 
                            label={t('personalData.occupation')} required placeholder="" 
                            value={patientData?.employer?.occupation || ''}
                            onChangeText={(text: string) => handleEmployerChange('occupation', text)}
                        />
                    </View>
                </View>
                <FormInput {...commonProps} 
                    label={t('personalData.symbol')} placeholder="" 
                    value={patientData?.employer?.productionSymbol || patientData?.employer?.symbol || ''}
                    onChangeText={(text: string) => handleEmployerChange('productionSymbol', text)}
                />
 
                <SectionHeader {...commonProps} title={t('personalData.address')} />
                <View style={ds.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput {...commonProps} label={t('personalData.street')} required placeholder="" value={patientData?.employer?.address?.street || ''} onChangeText={(text: string) => handleEmployerAddressChange('street', text)} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput {...commonProps} label={t('personalData.house')} required placeholder="" value={patientData?.employer?.address?.houseNumber || ''} onChangeText={(text: string) => handleEmployerAddressChange('houseNumber', text)} />
                    </View>
                </View>
                <View style={ds.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput {...commonProps} label={t('personalData.apartment')} placeholder="" value={patientData?.employer?.address?.apartmentNumber || ''} onChangeText={(text: string) => handleEmployerAddressChange('apartmentNumber', text)} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput {...commonProps} label={t('personalData.postalCode')} required placeholder="" value={patientData?.employer?.address?.postalCode || ''} onChangeText={(text: string) => handleEmployerAddressChange('postalCode', text)} />
                    </View>
                </View>
                <View style={ds.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput {...commonProps} label={t('personalData.city')} required placeholder="" value={patientData?.employer?.address?.city || ''} onChangeText={(text: string) => handleEmployerAddressChange('city', text)} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput {...commonProps} 
                            label={t('personalData.voivodeship')} required placeholder={t('personalData.placeholderSelectVoivodeship')} isDropdown
                            value={patientData?.employer?.address?.voivodeship || ''} 
                            onPress={() => setShowEmpVoivodeshipPicker(true)}
                        />
                    </View>
                </View>
                <FormInput {...commonProps} 
                    label={t('personalData.country')} required placeholder={t('personalData.placeholderSelectCountry')} isDropdown
                    value={patientData?.employer?.address?.country || ''} 
                    onPress={() => setShowEmpCountryPicker(true)}
                />
 
                <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                    <SubmitButton {...commonProps} title={t('personalData.submit')} onPress={() => handleSave('employer')} loading={isSaving} />
                </View>
            </AccordionItem>
 
            <AccordionItem {...commonProps} title={t('personalData.authorizedPersons')} icon="users">
                <View style={ds.toggleRow}>
                    <Text style={ds.toggleLabel}>{t('personalData.notAuthorizeAnyone')}</Text>
                    <Switch 
                        value={authorizeAnyone} 
                        onValueChange={setAuthorizeAnyone}
                        trackColor={{ false: '#e2e8f0', true: '#58a6b8' }}
                    />
                </View>
                <View style={ds.toggleRow}>
                    <Text style={ds.toggleLabel}>{t('personalData.signedCurrentAuthorization')}</Text>
                    <Switch 
                        value={signedAuthorization} 
                        onValueChange={setSignedAuthorization}
                        trackColor={{ false: '#e2e8f0', true: '#58a6b8' }}
                    />
                </View>
 
                <View style={[ds.row, { marginTop: 15, gap: 10, flexWrap: 'wrap' }]}>
                    <TouchableOpacity style={ds.orangeButton}>
                        <Feather name="file-text" size={16} color="#ffffff" />
                        <Text style={ds.orangeButtonText}>{t('personalData.noAuthorizationStatement')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={ds.outlineButton}
                        onPress={() => setShowAuthorizedModal(true)}
                    >
                        <Feather name="plus" size={16} color="#58a6b8" />
                        <Text style={ds.outlineButtonText}>{t('personalData.addAuthorizedPerson')}</Text>
                    </TouchableOpacity>
                </View>

                {patientData?.authorizedPersons && patientData.authorizedPersons.length > 0 ? (
                    patientData.authorizedPersons.map((person: any) => (
                        <View key={person.id} style={ds.authCard}>
                            <View style={ds.authCardContent}>
                                <Text style={ds.authName}>{person.name}</Text>
                                <Text style={ds.authDetail}>{person.relationship.toLowerCase()}</Text>
                                <Text style={ds.authDetail}>{person.phone}</Text>
                            </View>
                            <View style={ds.authActions}>
                                <TouchableOpacity style={{ marginRight: 12 }} onPress={() => editAuthorizedPerson(person)}>
                                    <Feather name="edit" size={16} color="#3b82f6" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => removeAuthorizedPerson(person.id)}>
                                    <Feather name="trash-2" size={16} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={ds.emptyResultsBox}>
                        <Text style={ds.noDataTextMinimal}>{t('personalData.noAuthPersons')}</Text>
                    </View>
                )}

                <View style={{ alignItems: 'flex-end', marginTop: 15 }}>
                    <SubmitButton {...commonProps} title={t('personalData.save')} onPress={() => handleSave('authorized')} loading={isSaving} />
                </View>
            </AccordionItem>
 
            <AccordionItem {...commonProps} title={t('personalData.consentProcessing')} icon="file-text">
                <View style={ds.infoBanner}>
                    <Text style={ds.infoBannerText}>
                        {t('personalData.consentRequirementNotice')}
                    </Text>
                </View>
 
                {(patientData?.consents || [
                    {
                        id: 'personal-data',
                        title: t('personalData.consentPersonalDataTitle'),
                        description: t('personalData.consentPersonalDataDescription'),
                        granted: true,
                        grantedDate: '04-03-2026',
                        fileUrl: 'dummy_url'
                    },
                    {
                        id: 'medical-docs',
                        title: t('personalData.consentMedicalDocsTitle'),
                        description: t('personalData.consentMedicalDocsDescription')
                    },
                    {
                        id: 'electronic-comm',
                        title: t('personalData.consentElectronicCommTitle'),
                        description: t('personalData.consentElectronicCommDescription')
                    }
                ]).map((item: any, index: number) => (
                    <View key={index} style={ds.consentRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={ds.consentTitle}>{item.title}</Text>
                            <Text style={ds.consentDesc}>{item.description}</Text>
                        </View>
                        <View style={ds.consentActions}>
                            <View style={ds.statusBadge}>
                                <Feather 
                                    name={item.granted ? "check-circle" : "x-circle"} 
                                    size={14} 
                                    color={item.granted ? "#16a34a" : "#ef4444"} 
                                />
                                <Text style={[ds.statusText, item.granted && { color: '#16a34a' }]}>
                                    {item.granted ? t('personalData.granted') : t('personalData.noConsent')}
                                </Text>
                            </View>
                            {item.granted ? (
                                <View style={ds.grantedDetailsContainer}>
                                    <Text style={ds.grantedDateText}>
                                        {formatConsentDate(item.grantedDate || item.date) || t('personalData.dateNotAvailable')}
                                    </Text>
                                    <View style={ds.grantedActionsRow}>
                                        <TouchableOpacity style={ds.eyeButton}>
                                            <Feather name="eye" size={16} color="#3b82f6" />
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={ds.withdrawButton}
                                            onPress={() => withdrawConsent(item.id)}
                                        >
                                            <Text style={ds.withdrawButtonText}>{t('personalData.withdraw')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <TouchableOpacity style={ds.grantButton} onPress={() => openConsentModal(item.id)}>
                                    <Text style={ds.grantButtonText}>{t('personalData.grantConsent')}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))}
 
                <View style={{ alignItems: 'flex-end', marginTop: 20 }}>
                    <SubmitButton {...commonProps} title={t('personalData.save')} onPress={() => handleSave('consents')} loading={isSaving} />
                </View>
            </AccordionItem>
        </ScrollView>
    );
};


export default PersonalData;
    const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
        container: {
            paddingHorizontal: 16,
        },
        accordionContainer: {
            backgroundColor: tc.cardBackground,
            borderRadius: 16,
            marginBottom: 16,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: tc.borderColor,
            // Elevation/Shadow for premium feel
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.3 : 0.05,
            shadowRadius: 4,
            elevation: 3,
            
        },
        accordionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
        },
        expandedHeader: {
            borderBottomWidth: 1,
            borderBottomColor: tc.borderColor,
        },
        headerLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        iconContainer: {
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: tc.accentLight,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        accordionTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: tc.textPrimary,
            flex: 1,
        },
        accordionContent: {
            padding: 16,
            backgroundColor: tc.cardBackground,
        },
        inputGroup: {
            marginBottom: 16,
        },
        labelRow: {
            flexDirection: 'row',
            marginBottom: 6,
        },
        requiredStar: {
            color: tc.accentRed,
            fontWeight: 'bold',
        },
        inputLabel: {
            fontSize: 13,
            fontWeight: '600',
            color: tc.textSecondary,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: tc.inputBackground,
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 10,
            paddingHorizontal: 12,
            height: 48,
        },
        textInput: {
            flex: 1,
            fontSize: 14,
            color: tc.textPrimary,
            padding: 0,
        },
        row: {
            flexDirection: 'row',
        },
        sectionSubHeader: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.accent,
            marginTop: 10,
            marginBottom: 15,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        miniSearch: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 6,
            paddingHorizontal: 10,
            height: 36,
            width: 140,
            backgroundColor: tc.inputBackground,
        },
        miniSearchInput: {
            fontSize: 12,
            marginLeft: 6,
            color: tc.textPrimary,
            flex: 1,
            padding: 0,
        },
        noDataTextMinimal: {
            fontSize: 13,
            color: tc.textMuted,
            fontStyle: 'italic',
            paddingVertical: 10,
        },
        outlineButton: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: tc.accent,
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: 15,
            alignSelf: 'flex-start',
            backgroundColor: isDark ? tc.buttonMutedBg : 'transparent',
        },
        outlineButtonText: {
            fontSize: 13,
            fontWeight: '600',
            color: tc.accent,
            marginLeft: 8,
        },
        disclaimerText: {
            fontSize: 12,
            color: tc.textMuted,
            fontStyle: 'italic',
            marginTop: 15,
            lineHeight: 18,
        },
        submitButtonContainer: {
            height: 48,
            borderRadius: 10,
            overflow: 'hidden',
            marginTop: 10,
            marginBottom: 5,
        },
        gradientButton: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        submitButtonText: {
            color: '#ffffff',
            fontSize: 14,
            fontWeight: '600',
        },
        toggleRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        toggleLabel: {
            fontSize: 13,
            color: tc.textSecondary,
            flex: 1,
            paddingRight: 10,
        },
        orangeButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f97316',
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: 15,
        },
        orangeButtonText: {
            fontSize: 12,
            fontWeight: '700',
            color: '#ffffff',
            marginLeft: 8,
        },
        emptyResultsBox: {
            backgroundColor: tc.cardBackgroundAlt,
            borderRadius: 10,
            padding: 20,
            marginTop: 15,
            alignItems: 'flex-start',
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        modalOverlayKeyboardVisible: {
            justifyContent: 'flex-end',
            paddingBottom: 8,
        },
        modalContent: {
            backgroundColor: tc.modalBg,
            borderRadius: 12,
            width: '100%',
            maxHeight: '80%',
            padding: 20,
            borderWidth: isDark ? 1 : 0,
            borderColor: tc.borderColor,
        },
        modalKeyboardContainer: {
            width: '100%',
            maxWidth: '100%',
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        modalScroll: {
            marginBottom: 20,
        },
        modalFooter: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 12,
        },
        cancelButton: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: tc.borderColor,
            backgroundColor: isDark ? tc.buttonMutedBg : tc.canvas,
        },
        cancelButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textSecondary,
        },
        addButton: {
            paddingVertical: 10,
            paddingHorizontal: 25,
            borderRadius: 8,
            backgroundColor: tc.accent,
        },
        addButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#ffffff',
        },
        infoBanner: {
            backgroundColor: tc.accentLight,
            padding: 12,
            borderRadius: 8,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: tc.accent,
        },
        infoBannerText: {
            fontSize: 12,
            color: isDark ? tc.textPrimary : '#1e40af',
            lineHeight: 18,
        },
        consentRow: {
            backgroundColor: tc.cardBackgroundAlt,
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        consentTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.textPrimary,
            marginBottom: 4,
        },
        consentDesc: {
            fontSize: 12,
            color: tc.textSecondary,
            lineHeight: 18,
        },
        consentActions: {
            alignItems: 'flex-end',
            minWidth: 130,
        },
        statusBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        statusText: {
            fontSize: 12,
            color: tc.accentRed,
            marginLeft: 6,
            fontWeight: '500',
        },
        grantButton: {
            backgroundColor: tc.success + '20',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: tc.success,
        },
        grantButtonText: {
            fontSize: 12,
            color: tc.success,
            fontWeight: '600',
        },
        selectOption: {
            paddingVertical: 14,
            paddingHorizontal: 8,
            borderBottomWidth: 1,
            borderBottomColor: tc.borderColor,
        },
        selectOptionText: {
            fontSize: 14,
            color: tc.textPrimary,
            fontWeight: '500',
        },
        insurerCard: {
            backgroundColor: tc.cardBackgroundAlt,
            borderRadius: 10,
            padding: 16,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: tc.borderColor,
        },
        insurerCardContent: {
            flex: 1,
        },
        insurerName: {
            fontSize: 15,
            fontWeight: '700',
            color: tc.textPrimary,
            marginBottom: 4,
        },
        insurerDetail: {
            fontSize: 13,
            color: tc.textSecondary,
            lineHeight: 18,
        },
        authCard: {
            backgroundColor: tc.cardBackgroundAlt,
            borderRadius: 10,
            padding: 16,
            marginTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: tc.borderColor,
        },
        authCardContent: {
            flex: 1,
        },
        authName: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.textPrimary,
            marginBottom: 2,
        },
        authDetail: {
            fontSize: 12,
            color: tc.textSecondary,
            lineHeight: 16,
        },
        authActions: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        inlineDropdown: {
            backgroundColor: tc.cardBackgroundAlt,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: tc.borderColor,
            marginTop: 4,
            marginBottom: 8,
            overflow: 'hidden',
        },
        inlineDropdownOption: {
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderBottomWidth: 1,
            borderBottomColor: tc.borderColor,
        },
        inlineDropdownOptionSelected: {
            backgroundColor: tc.accentLight,
        },
        inlineDropdownOptionText: {
            fontSize: 13,
            color: tc.textPrimary,
            fontWeight: '500',
        },
        inlineDropdownOptionTextSelected: {
            color: tc.accent,
            fontWeight: '700',
        },
        datePickerContainer: {
            backgroundColor: tc.cardBackgroundAlt,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: tc.borderColor,
            marginTop: 4,
            marginBottom: 8,
            overflow: 'hidden',
        },
        datePickerHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: tc.borderColor,
            backgroundColor: tc.cardBackground,
        },
        datePickerTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textPrimary,
        },
        datePickerDone: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.accent,
        },
        consentModalDesc: {
            fontSize: 14,
            color: tc.textSecondary,
            lineHeight: 20,
            marginBottom: 20,
        },
        selectFileButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: tc.accent,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 10,
            alignSelf: 'flex-start',
            marginBottom: 16,
        },
        selectedFileRow: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: tc.accentLight,
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: tc.accent,
        },
        selectedFileName: {
            flex: 1,
            fontSize: 13,
            color: tc.textPrimary,
            fontWeight: '500',
            marginLeft: 10,
            marginRight: 10,
        },
        fileTypeHint: {
            fontSize: 12,
            color: tc.textMuted,
            lineHeight: 18,
        },
        grantedDateText: {
            fontSize: 12,
            color: tc.textMuted,
            fontWeight: '500',
            marginTop: 2,
        },
        grantedDetailsContainer: {
            alignItems: 'flex-end',
            marginTop: 4,
        },
        grantedActionsRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
            gap: 8,
        },
        eyeButton: {
            padding: 4,
            borderRadius: 6,
            backgroundColor: tc.accentLight,
        },
        withdrawButton: {
            paddingVertical: 6,
            paddingHorizontal: 14,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: tc.accentRed,
            backgroundColor: tc.accentRed + '20',
        },
        withdrawButtonText: {
            fontSize: 12,
            color: tc.accentRed,
            fontWeight: '600',
        },
    });