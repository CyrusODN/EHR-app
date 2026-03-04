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
    ActivityIndicator
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GetPatientPersonalData, UpdatePersonalData } from '../../../Services/PersonalData.Service';
import PrimaryButton from '../../../component/button';
import DocumentPicker from 'react-native-document-picker';
import { uploadFileOnServer } from '../../../Services/Upload.Service';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AccordionItem = ({ title, icon, children }: { title: string, icon: string, children: React.ReactNode }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View style={styles.accordionContainer}>
            <TouchableOpacity 
                style={[styles.accordionHeader, expanded && styles.expandedHeader]} 
                onPress={toggleExpand}
                activeOpacity={0.7}
            >
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        <Feather name={icon} size={18} color="#58a6b8" />
                    </View>
                    <Text style={styles.accordionTitle}>{title}</Text>
                </View>
                <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#94a3b8" />
            </TouchableOpacity>
            {expanded && (
                <View style={styles.accordionContent}>
                    {children}
                </View>
            )}
        </View>
    );
};

const FormInput = ({ label, placeholder, required = false, isDropdown = false, value, onChangeText, onPress, autoCapitalize, keyboardType }: any) => (
    <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
            {required && <Text style={styles.requiredStar}>* </Text>}
            <Text style={styles.inputLabel}>{label}:</Text>
        </View>
        <TouchableOpacity 
            style={styles.inputWrapper} 
            activeOpacity={isDropdown ? 0.7 : 1}
            onPress={isDropdown ? onPress : undefined}
        >
            <View style={{ flex: 1 }}>
                <TextInput 
                    style={styles.textInput}
                    placeholder={placeholder}
                    placeholderTextColor="#cbd5e1"
                    editable={!isDropdown}
                    value={value}
                    onChangeText={onChangeText}
                    pointerEvents={isDropdown ? 'none' : 'auto'}
                    autoCapitalize={autoCapitalize}
                    keyboardType={keyboardType}
                />
            </View>
            {isDropdown && <Feather name="chevron-down" size={16} color="#cbd5e1" />}
        </TouchableOpacity>
    </View>
);

const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionSubHeader}>{title}</Text>
);

const SubmitButton = ({ title, onPress, color = ['#68BFB4', '#4DA1C0'], loading = false }: any) => (
    <TouchableOpacity 
        style={[styles.submitButtonContainer, loading && { opacity: 0.7 }]} 
        onPress={loading ? undefined : onPress}
    >
        <LinearGradient
            colors={color}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <Text style={styles.submitButtonText}>{title}</Text>
                )}
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

const PersonalData = ({ patientData: initialPatientData, onAlert }: { patientData: any, onAlert?: (type: 'success' | 'error' | 'warning', message: string) => void }) => {
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

            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
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

    const handleEmployerAddressChange = (field: string, value: string) => {
        setPatientData((prev: any) => ({
            ...prev,
            employer: {
                ...prev.employer,
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
                onAlert?.('error', 'Failed to select file.');
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
            
            // Format current date as "4 March 2026" for UI
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const now = new Date();
            const grantedDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
            const isoDate = now.toISOString();

            // Update the consent item to granted
            setPatientData((prev: any) => {
                const updatedConsents = (prev?.consents || [
                    { id: 'personal-data', title: 'Processing of Personal Data', description: 'I consent to the processing of my personal data for the purpose of providing medical services in accordance with GDPR.' },
                    { id: 'medical-docs', title: 'Access to Medical Documentation', description: 'I consent to providing access to my medical documentation to authorized persons and other medical facilities for the purpose of continuing treatment.' },
                    { id: 'electronic-comm', title: 'Electronic Communication', description: 'I consent to receiving medical and organizational information via electronic means (email, SMS).' }
                ]).map((c: any) =>
                    c.id === activeConsentId ? { ...c, granted: true, grantedDate, date: isoDate, fileUrl, documentUrl, documentName, withDraw: false } : c
                );
                return { ...prev, consents: updatedConsents };
            });

            setShowConsentModal(false);
            setConsentFileName(null);
            setConsentFile(null);
            setActiveConsentId(null);
            onAlert?.('success', 'Consent document uploaded and consent granted successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            onAlert?.('error', 'Failed to upload consent document. Please try again.');
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
        onAlert?.('success', 'Consent has been withdrawn successfully.');
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
                onAlert?.('success', `${section.charAt(0).toUpperCase() + section.slice(1)} information updated successfully!`);
                await fetchPersonalData();
            }
        } catch (error) {
            console.error(`Error updating ${section}:`, error);
            onAlert?.('error', `Failed to update ${section} information.`);
        } finally {
            setIsSaving(true); // Wait, should be false. Fixing in next chunk or same. 
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, paddingVertical: 40, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#4A90B9" />
                <Text style={{ marginTop: 15, color: '#64748b' }}>Fetching profile details...</Text>
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
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add New Insurer</Text>
                        <TouchableOpacity onPress={() => setShowInsurerModal(false)}>
                            <Feather name="x" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={styles.modalScroll}>
                        <FormInput 
                            label="Insurer Name" required placeholder="Enter insurer name" 
                            value={newInsurerData.name}
                            onChangeText={(val: string) => handleNewInsurerData('name', val)}
                        />
                        <FormInput 
                            label="Policy Number" required placeholder="Enter policy number" 
                            value={newInsurerData.policy}
                            onChangeText={(val: string) => handleNewInsurerData('policy', val)}
                        />
                        <FormInput 
                            label="Start Date" required placeholder="Select date" isDropdown 
                            value={newInsurerData.startDate.toLocaleDateString()}
                            onPress={() => setShowStartPicker(true)}
                        />
                        <FormInput 
                            label="Valid Until" required placeholder="Select date" isDropdown 
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

                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={() => setShowInsurerModal(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.addButton}
                            onPress={addNewInsurer}
                        >
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{editingAuthPersonId ? 'Edit Authorized Person' : 'Add Authorized Person'}</Text>
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
                    
                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput 
                                    label="First Name" required placeholder="Enter first name" 
                                    value={newAuthPerson.firstName}
                                    onChangeText={(val: string) => handleNewAuthPersonChange('firstName', val)}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput 
                                    label="Last Name" required placeholder="Enter last name" 
                                    value={newAuthPerson.lastName}
                                    onChangeText={(val: string) => handleNewAuthPersonChange('lastName', val)}
                                />
                            </View>
                        </View>
                        
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput 
                                    label="Relationship" required placeholder="Select relationship" isDropdown 
                                    value={newAuthPerson.relationship}
                                    onPress={() => setShowAuthRelationPicker(!showAuthRelationPicker)}
                                />
                                {showAuthRelationPicker && (
                                    <View style={styles.inlineDropdown}>
                                        {authorizedRelationships.map((opt, idx) => (
                                            <TouchableOpacity 
                                                key={idx} 
                                                style={[
                                                    styles.inlineDropdownOption,
                                                    newAuthPerson.relationship === opt && styles.inlineDropdownOptionSelected
                                                ]}
                                                onPress={() => {
                                                    handleNewAuthPersonChange('relationship', opt);
                                                    setShowAuthRelationPicker(false);
                                                }}
                                            >
                                                <Text style={[
                                                    styles.inlineDropdownOptionText,
                                                    newAuthPerson.relationship === opt && styles.inlineDropdownOptionTextSelected
                                                ]}>{opt}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput 
                                    label="PESEL" placeholder="Enter PESEL" 
                                    value={newAuthPerson.pesel}
                                    onChangeText={(val: string) => handleNewAuthPersonChange('pesel', val)}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput 
                                    label="Phone Number" required placeholder="Enter phone" 
                                    value={newAuthPerson.phone}
                                    onChangeText={(val: string) => handleNewAuthPersonChange('phone', val)}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput 
                                    label="Email" placeholder="Enter email" 
                                    value={newAuthPerson.email}
                                    onChangeText={(val: string) => handleNewAuthPersonChange('email', val)}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        <FormInput 
                            label="Address" placeholder="Enter full address" 
                            value={newAuthPerson.address}
                            onChangeText={(val: string) => handleNewAuthPersonChange('address', val)}
                        />

                        <FormInput 
                            label="Document Type" required placeholder="Select document type" isDropdown 
                            value={newAuthPerson.docType}
                            onPress={() => setShowAuthDocTypePicker(!showAuthDocTypePicker)}
                        />
                        {showAuthDocTypePicker && (
                            <View style={styles.inlineDropdown}>
                                {authorizedDocumentTypes.map((opt, idx) => (
                                    <TouchableOpacity 
                                        key={idx} 
                                        style={[
                                            styles.inlineDropdownOption,
                                            newAuthPerson.docType === opt && styles.inlineDropdownOptionSelected
                                        ]}
                                        onPress={() => {
                                            handleNewAuthPersonChange('docType', opt);
                                            setShowAuthDocTypePicker(false);
                                        }}
                                    >
                                        <Text style={[
                                            styles.inlineDropdownOptionText,
                                            newAuthPerson.docType === opt && styles.inlineDropdownOptionTextSelected
                                        ]}>{opt}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput 
                                    label="Document Number" required placeholder="Enter number" 
                                    value={newAuthPerson.docNumber}
                                    onChangeText={(val: string) => handleNewAuthPersonChange('docNumber', val)}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput 
                                    label="Valid Until" required placeholder="Select date" isDropdown 
                                    value={newAuthPerson.validUntil.toLocaleDateString()}
                                    onPress={() => setShowAuthValidPicker(!showAuthValidPicker)}
                                />
                            </View>
                        </View>

                        {showAuthValidPicker && (
                            <View style={styles.datePickerContainer}>
                                <View style={styles.datePickerHeader}>
                                    <Text style={styles.datePickerTitle}>Select Date</Text>
                                    <TouchableOpacity onPress={() => setShowAuthValidPicker(false)}>
                                        <Text style={styles.datePickerDone}>Done</Text>
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

                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={styles.cancelButton}
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
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.addButton}
                            onPress={addNewAuthorizedPerson}
                        >
                            <Text style={styles.addButtonText}>{editingAuthPersonId ? 'Save' : 'Add'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Upload Consent Document</Text>
                        <TouchableOpacity onPress={() => setShowConsentModal(false)}>
                            <Feather name="x" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>

                    <View style={{ padding: 20 }}>
                        <Text style={styles.consentModalDesc}>
                            Please upload a scanned copy of the signed consent form before granting consent.
                        </Text>

                        <PrimaryButton
                            label="Select file"
                            filled
                            onPress={handleSelectFile}
                            icon={<Feather name="upload" size={16} color="#ffffff" />}
                            style={{ width: 150, height: 44, alignSelf: 'flex-start', marginBottom: 16, borderRadius: 10 }}
                        />

                        {consentFileName && (
                            <View style={styles.selectedFileRow}>
                                <Feather name="file-text" size={16} color="#58a6b8" />
                                <Text style={styles.selectedFileName}>{consentFileName}</Text>
                                <TouchableOpacity onPress={() => { setConsentFileName(null); setConsentFile(null); }}>
                                    <Feather name="x-circle" size={16} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        )}

                        <Text style={styles.fileTypeHint}>
                            Accepted file types: PDF, JPG, PNG. Maximum size: 5MB.
                        </Text>
                    </View>

                    <View style={styles.modalFooter}>
                        <PrimaryButton
                            label="Cancel"
                            filled={false}
                            onPress={() => {
                                setShowConsentModal(false);
                                setConsentFileName(null);
                                setActiveConsentId(null);
                            }}
                            style={{ flex: 1, marginRight: 10, height: 44, borderRadius: 10 }}
                        />
                        <PrimaryButton
                            label={uploadingConsent ? 'Uploading...' : 'Upload and grant consent'}
                            filled
                            onPress={handleUploadAndGrant}
                            disabled={!consentFile || uploadingConsent}
                            loading={uploadingConsent}
                            style={{ flex: 1.5, height: 44, borderRadius: 10 }}
                        />
                    </View>
                </View>
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
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={[styles.modalContent, { maxHeight: '60%' }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {options.map((opt, idx) => (
                            <TouchableOpacity 
                                key={idx} 
                                style={styles.selectOption}
                                onPress={() => {
                                    onSelect(opt);
                                    onClose();
                                }}
                            >
                                <Text style={styles.selectOptionText}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Pressable>
        </Modal>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {renderAddInsurerModal()}
            {renderAddAuthorizedModal()}
            {renderConsentUploadModal()}
            {renderSelectionModal(showBranchPicker, () => setShowBranchPicker(false), nfzBranches, "Select Branch", (val) => handleInputChange('nfzBranch', val))}
            {renderSelectionModal(showRightsPicker, () => setShowRightsPicker(false), insuranceRights, "Select Additional Rights", (val) => handleInputChange('additionalRights', val))}
            {renderSelectionModal(showVoivodeshipPicker, () => setShowVoivodeshipPicker(false), voivodeships, "Select Voivodeship", (val) => handleInputChange('voivodeship', val))}
            {renderSelectionModal(showCountryPicker, () => setShowCountryPicker(false), countries, "Select Country", (val) => handleInputChange('country', val))}
            {renderSelectionModal(showEmpVoivodeshipPicker, () => setShowEmpVoivodeshipPicker(false), voivodeships, "Select Voivodeship", (val) => handleEmployerAddressChange('voivodeship', val))}
            {renderSelectionModal(showEmpCountryPicker, () => setShowEmpCountryPicker(false), countries, "Select Country", (val) => handleEmployerAddressChange('country', val))}
            
            <AccordionItem title="Basic Information" icon="user">
                <FormInput 
                    label="First Name" required placeholder="Enter first name" 
                    value={patientData?.name} 
                    onChangeText={(text: string) => handleInputChange('name', text)}
                />
                <FormInput 
                    label="Last Name" required placeholder="Enter last name" 
                    value={patientData?.lastName} 
                    onChangeText={(text: string) => handleInputChange('lastName', text)}
                />
                <FormInput 
                    label="PESEL" required placeholder="Enter PESEL" 
                    value={patientData?.pesel} 
                    onChangeText={(text: string) => handleInputChange('pesel', text)}
                />
                <FormInput 
                    label="Date of Birth" required placeholder="Select date" isDropdown 
                    value={patientData?.dob ? new Date(patientData.dob).toLocaleDateString() : ''} 
                />
                <FormInput 
                    label="Gender" required placeholder="Select gender" isDropdown 
                    value={patientData?.gender} 
                />
                <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                    <SubmitButton title="Submit" onPress={() => handleSave('basic')} loading={isSaving} />
                </View>
            </AccordionItem>
            <AccordionItem title="More Information" icon="info">
                <FormInput 
                    label="Middle Name" placeholder="Enter middle name" 
                    value={patientData?.middleName} 
                    onChangeText={(text: string) => handleInputChange('middleName', text)}
                />
                <FormInput 
                    label="Maiden Name" placeholder="Enter maiden name" 
                    value={patientData?.maidenName} 
                    onChangeText={(text: string) => handleInputChange('maidenName', text)}
                />
                <FormInput 
                    label="Birth Place" placeholder="Enter birth place" 
                    value={patientData?.birthPlace} 
                    onChangeText={(text: string) => handleInputChange('birthPlace', text)}
                />
                <FormInput 
                    label="Blood Type" placeholder="A+, O-, etc." 
                    value={patientData?.bloodType} 
                    onChangeText={(text: string) => handleInputChange('bloodType', text)}
                />
                <FormInput 
                    label="Internal Card Number" placeholder="No." 
                    value={patientData?.internalCardNumber} 
                    onChangeText={(text: string) => handleInputChange('internalCardNumber', text)}
                />
                <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                    <SubmitButton title="Submit" onPress={() => handleSave('more')} loading={isSaving} />
                </View>
            </AccordionItem>

            <AccordionItem title="Address" icon="map-pin">
                <FormInput 
                    label="City" required placeholder="Enter city" 
                    value={patientData?.city} 
                    onChangeText={(text: string) => handleInputChange('city', text)}
                />
                <FormInput 
                    label="Street" required placeholder="Enter street" 
                    value={patientData?.street} 
                    onChangeText={(text: string) => handleInputChange('street', text)}
                />
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput 
                            label="House" required placeholder="No." 
                            value={patientData?.houseNumber} 
                            onChangeText={(text: string) => handleInputChange('houseNumber', text)}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput 
                            label="Apartment" placeholder="No." 
                            value={patientData?.apartmentNumber} 
                            onChangeText={(text: string) => handleInputChange('apartmentNumber', text)}
                        />
                    </View>
                </View>
                <FormInput 
                    label="Postal Code" required placeholder="Enter code" 
                    value={patientData?.postalCode} 
                    onChangeText={(text: string) => handleInputChange('postalCode', text)}
                />
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput 
                            label="Voivodeship" required placeholder="Select voivodeship" isDropdown 
                            value={patientData?.voivodeship}
                            onPress={() => setShowVoivodeshipPicker(true)}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput 
                            label="Country" required placeholder="Select country" isDropdown 
                            value={patientData?.country}
                            onPress={() => setShowCountryPicker(true)}
                        />
                    </View>
                </View>
                <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                    <SubmitButton title="Submit" onPress={() => handleSave('address')} loading={isSaving} />
                </View>
            </AccordionItem>

            <AccordionItem title="Insurance" icon="shield">
                <SectionHeader title="Insured in NFZ:" />
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput 
                            label="Branch" required placeholder="Select branch" isDropdown 
                            value={patientData?.nfzBranch}
                            onPress={() => setShowBranchPicker(true)}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput 
                            label="Additional Rights" required placeholder="Select rights" isDropdown 
                            value={patientData?.additionalRights}
                            onPress={() => setShowRightsPicker(true)}
                        />
                    </View>
                </View>

                <View style={[styles.row, { alignItems: 'center', marginTop: 15, justifyContent: 'space-between' }]}>
                    <SectionHeader title="Private Insurers" />
                    <View style={styles.miniSearch}>
                        <Feather name="search" size={14} color="#94a3b8" />
                        <TextInput style={styles.miniSearchInput} placeholder="Search (Insurer)" placeholderTextColor="#cbd5e1" />
                    </View>
                </View>

                {patientData?.privateInsurers && patientData.privateInsurers.length > 0 ? (
                    patientData.privateInsurers.map((insurer: any, index: number) => (
                        <View key={insurer.id || `insurer-${index}`} style={styles.insurerCard}>
                            <View style={styles.insurerCardContent}>
                                <Text style={styles.insurerName}>{insurer.name}</Text>
                                <Text style={styles.insurerDetail}>Policy: {insurer.policy}</Text>
                                <Text style={styles.insurerDetail}>Start Date: {insurer.startDate}</Text>
                                <Text style={styles.insurerDetail}>Valid until: {insurer.validUntil}</Text>
                            </View>
                            <TouchableOpacity onPress={() => removeInsurer(insurer.id)}>
                                <Feather name="trash-2" size={18} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noDataTextMinimal}>No private insurers added</Text>
                )}

                <TouchableOpacity 
                    style={styles.outlineButton}
                    onPress={() => setShowInsurerModal(true)}
                >
                    <Feather name="plus" size={16} color="#58a6b8" />
                    <Text style={styles.outlineButtonText}>Add Insurer</Text>
                </TouchableOpacity>

                <Text style={styles.disclaimerText}>
                    Please remember to click the Submit button after adding or deleting an insurer to save the changes
                </Text>

                <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                    <SubmitButton title="Submit" onPress={() => handleSave('insurance')} loading={isSaving} />
                </View>
            </AccordionItem>

            <AccordionItem title="Employer" icon="briefcase">
                <SectionHeader title="Employer" />
                <FormInput 
                    label="Employer Name" required placeholder="" 
                    value={patientData?.employer?.name || ''} 
                />
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput 
                            label="Employer NIP" required placeholder="" 
                            value={patientData?.employer?.nip || ''} 
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput 
                            label="Occupation" required placeholder="" 
                            value={patientData?.employer?.occupation || ''} 
                        />
                    </View>
                </View>
                <FormInput 
                    label="Production and Service Group Symbol" placeholder="" 
                    value={patientData?.employer?.symbol || ''} 
                />

                <SectionHeader title="Address" />
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput label="Street" required placeholder="" value={patientData?.employer?.address?.street || ''} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput label="House Number" required placeholder="" value={patientData?.employer?.address?.houseNumber || ''} />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput label="Apartment Number" placeholder="" value={patientData?.employer?.address?.apartmentNumber || ''} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput label="Postal Code" required placeholder="" value={patientData?.employer?.address?.postalCode || ''} />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <FormInput label="City" required placeholder="" value={patientData?.employer?.address?.city || ''} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <FormInput 
                            label="Voivodeship" required placeholder="Select voivodeship" isDropdown 
                            value={patientData?.employer?.address?.voivodeship || ''} 
                            onPress={() => setShowEmpVoivodeshipPicker(true)}
                        />
                    </View>
                </View>
                <FormInput 
                    label="Country" required placeholder="Select country" isDropdown 
                    value={patientData?.employer?.address?.country || ''} 
                    onPress={() => setShowEmpCountryPicker(true)}
                />

                <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                    <SubmitButton title="Submit" onPress={() => handleSave('employer')} loading={isSaving} />
                </View>
            </AccordionItem>

            <AccordionItem title="AUTHORIZED PERSONS AND LIST OF SHARED MEDICAL DOCUMENTATION" icon="users">
                <View style={styles.toggleRow}>
                    <Text style={styles.toggleLabel}>Patient does not authorize anyone:</Text>
                    <Switch 
                        value={authorizeAnyone} 
                        onValueChange={setAuthorizeAnyone}
                        trackColor={{ false: '#e2e8f0', true: '#58a6b8' }}
                    />
                </View>
                <View style={styles.toggleRow}>
                    <Text style={styles.toggleLabel}>Patient signed current version of authorization:</Text>
                    <Switch 
                        value={signedAuthorization} 
                        onValueChange={setSignedAuthorization}
                        trackColor={{ false: '#e2e8f0', true: '#58a6b8' }}
                    />
                </View>

                <View style={[styles.row, { marginTop: 15, gap: 10, flexWrap: 'wrap' }]}>
                    <TouchableOpacity style={styles.orangeButton}>
                        <Feather name="file-text" size={16} color="#ffffff" />
                        <Text style={styles.orangeButtonText}>NO AUTHORIZATION - STATEMENT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.outlineButton}
                        onPress={() => setShowAuthorizedModal(true)}
                    >
                        <Feather name="plus" size={16} color="#58a6b8" />
                        <Text style={styles.outlineButtonText}>ADD AUTHORIZED PERSON</Text>
                    </TouchableOpacity>
                </View>

                {patientData?.authorizedPersons && patientData.authorizedPersons.length > 0 ? (
                    patientData.authorizedPersons.map((person: any) => (
                        <View key={person.id} style={styles.authCard}>
                            <View style={styles.authCardContent}>
                                <Text style={styles.authName}>{person.name}</Text>
                                <Text style={styles.authDetail}>{person.relationship.toLowerCase()}</Text>
                                <Text style={styles.authDetail}>{person.phone}</Text>
                            </View>
                            <View style={styles.authActions}>
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
                    <View style={styles.emptyResultsBox}>
                        <Text style={styles.noDataTextMinimal}>No authorized persons added</Text>
                    </View>
                )}

                <View style={{ alignItems: 'flex-end', marginTop: 15 }}>
                    <SubmitButton title="Save" onPress={() => handleSave('authorized')} loading={isSaving} />
                </View>
            </AccordionItem>

            <AccordionItem title="Consent to the processing of personal data" icon="file-text">
                <View style={styles.infoBanner}>
                    <Text style={styles.infoBannerText}>
                        In accordance with Polish law, patient consent requires a physical signed document. Please upload a scanned copy of the signed consent form.
                    </Text>
                </View>

                {(patientData?.consents || [
                    {
                        id: 'personal-data',
                        title: 'Processing of Personal Data',
                        description: 'I consent to the processing of my personal data for the purpose of providing medical services in accordance with GDPR.',
                        granted: true,
                        grantedDate: '04 March 2026',
                        fileUrl: 'dummy_url'
                    },
                    {
                        id: 'medical-docs',
                        title: 'Access to Medical Documentation',
                        description: 'I consent to providing access to my medical documentation to authorized persons and other medical facilities for the purpose of continuing treatment.'
                    },
                    {
                        id: 'electronic-comm',
                        title: 'Electronic Communication',
                        description: 'I consent to receiving medical and organizational information via electronic means (email, SMS).'
                    }
                ]).map((item: any, index: number) => (
                    <View key={index} style={styles.consentRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={styles.consentTitle}>{item.title}</Text>
                            <Text style={styles.consentDesc}>{item.description}</Text>
                        </View>
                        <View style={styles.consentActions}>
                            <View style={styles.statusBadge}>
                                <Feather 
                                    name={item.granted ? "check-circle" : "x-circle"} 
                                    size={14} 
                                    color={item.granted ? "#16a34a" : "#ef4444"} 
                                />
                                <Text style={[styles.statusText, item.granted && { color: '#16a34a' }]}>
                                    {item.granted ? 'Granted' : 'No consent'}
                                </Text>
                            </View>
                            {item.granted ? (
                                <View style={styles.grantedDetailsContainer}>
                                    <Text style={styles.grantedDateText}>
                                        {formatConsentDate(item.grantedDate || item.date) || '(Date not available)'}
                                    </Text>
                                    <View style={styles.grantedActionsRow}>
                                        <TouchableOpacity style={styles.eyeButton}>
                                            <Feather name="eye" size={16} color="#3b82f6" />
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={styles.withdrawButton}
                                            onPress={() => withdrawConsent(item.id)}
                                        >
                                            <Text style={styles.withdrawButtonText}>Withdraw</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <TouchableOpacity style={styles.grantButton} onPress={() => openConsentModal(item.id)}>
                                    <Text style={styles.grantButtonText}>Grant consent</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))}

                <View style={{ alignItems: 'flex-end', marginTop: 20 }}>
                    <SubmitButton title="Save changes" onPress={() => handleSave('consents')} loading={isSaving} />
                </View>
            </AccordionItem>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    accordionContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        overflow: 'hidden',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    expandedHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
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
        backgroundColor: '#f0f9f8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    accordionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        flex: 1,
    },
    accordionContent: {
        padding: 16,
        backgroundColor: '#ffffff',
    },
    inputGroup: {
        marginBottom: 15,
    },
    labelRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    requiredStar: {
        color: '#ef4444',
        fontSize: 14,
    },
    inputLabel: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
        backgroundColor: '#ffffff',
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        color: '#1e293b',
        padding: 0,
    },
    row: {
        flexDirection: 'row',
    },
    sectionSubHeader: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155',
        marginTop: 10,
        marginBottom: 12,
    },
    miniSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 6,
        paddingHorizontal: 10,
        height: 36,
        width: 140,
    },
    miniSearchInput: {
        fontSize: 12,
        marginLeft: 6,
        color: '#1e293b',
        flex: 1,
        padding: 0,
    },
    noDataTextMinimal: {
        fontSize: 13,
        color: '#94a3b8',
        fontStyle: 'italic',
        paddingVertical: 10,
    },
    outlineButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#58a6b8',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignSelf: 'flex-start',
    },
    outlineButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#58a6b8',
        marginLeft: 8,
    },
    disclaimerText: {
        fontSize: 12,
        color: '#94a3b8',
        fontStyle: 'italic',
        marginTop: 15,
        lineHeight: 18,
    },
    submitButtonContainer: {
        height: 38,
        width: 140,
        borderRadius: 8,
        overflow: 'hidden',
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
        color: '#475569',
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
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        padding: 20,
        marginTop: 15,
        alignItems: 'flex-start',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        width: '100%',
        maxHeight: '80%',
        padding: 20,
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
        color: '#1e293b',
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
        borderColor: '#e2e8f0',
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    addButton: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
        backgroundColor: '#3b82f6',
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
    infoBanner: {
        backgroundColor: '#eff6ff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    infoBannerText: {
        fontSize: 12,
        color: '#1e40af',
        lineHeight: 18,
    },
    consentRow: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#f1f5f9',
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
        color: '#1e293b',
        marginBottom: 4,
    },
    consentDesc: {
        fontSize: 12,
        color: '#64748b',
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
        color: '#ef4444',
        marginLeft: 6,
        fontWeight: '500',
    },
    grantButton: {
        backgroundColor: '#f0fdf4',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#dcfce7',
    },
    grantButtonText: {
        fontSize: 12,
        color: '#16a34a',
        fontWeight: '600',
    },
    selectOption: {
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    selectOptionText: {
        fontSize: 14,
        color: '#334155',
        fontWeight: '500',
    },
    insurerCard: {
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    insurerCardContent: {
        flex: 1,
    },
    insurerName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    insurerDetail: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 18,
    },
    authCard: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 16,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    authCardContent: {
        flex: 1,
    },
    authName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 2,
    },
    authDetail: {
        fontSize: 12,
        color: '#64748b',
        lineHeight: 16,
    },
    authActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inlineDropdown: {
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginTop: 4,
        marginBottom: 8,
        overflow: 'hidden',
    },
    inlineDropdownOption: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    inlineDropdownOptionSelected: {
        backgroundColor: '#e0f2f1',
    },
    inlineDropdownOptionText: {
        fontSize: 13,
        color: '#334155',
        fontWeight: '500',
    },
    inlineDropdownOptionTextSelected: {
        color: '#58a6b8',
        fontWeight: '700',
    },
    datePickerContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
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
        borderBottomColor: '#e2e8f0',
        backgroundColor: '#ffffff',
    },
    datePickerTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
    },
    datePickerDone: {
        fontSize: 14,
        fontWeight: '700',
        color: '#58a6b8',
    },
    consentModalDesc: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
        marginBottom: 20,
    },
    selectFileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#58a6b8',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    selectFileButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    selectedFileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f9f8',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#d1e7e4',
    },
    selectedFileName: {
        flex: 1,
        fontSize: 13,
        color: '#334155',
        fontWeight: '500',
        marginLeft: 10,
        marginRight: 10,
    },
    fileTypeHint: {
        fontSize: 12,
        color: '#94a3b8',
        lineHeight: 18,
    },
    grantedDateText: {
        fontSize: 12,
        color: '#64748b',
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
        backgroundColor: '#eff6ff',
    },
    withdrawButton: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fca5a5',
        backgroundColor: '#fef2f2',
    },
    withdrawButtonText: {
        fontSize: 12,
        color: '#ef4444',
        fontWeight: '600',
    },
});

export default PersonalData;
