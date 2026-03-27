import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView,
    TextInput,
    Modal,
    LayoutAnimation, 
    Platform,
    UIManager,
    Switch,
    ActivityIndicator
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { GetPatientMedicalData, UpdateMedicalData, MEDICATION_FORMS, SEVERITY_LEVELS, ALLERGY_TYPES, CONDITION_STATUSES, RELATIONSHIP_OPTIONS, RISK_CATEGORIES, RISK_LEVELS } from '../../../Services/MedicalData.Service';





import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FormInput = ({ label, placeholder, required = false, isDropdown = false, isDate = false, unit = '', hasInfo = false, multiline = false, value, onChangeText, onPress }: any) => (
    <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
            {required && <Text style={styles.requiredStar}>* </Text>}
            <Text style={styles.inputLabel}>{label}</Text>
            {hasInfo && <Feather name="help-circle" size={14} color="#94a3b8" style={{ marginLeft: 4 }} />}
        </View>
        <TouchableOpacity 
            activeOpacity={isDropdown || isDate ? 0.7 : 1}
            onPress={(isDropdown || isDate) ? onPress : undefined}
            style={[styles.inputWrapper, multiline && styles.textAreaWrapper]}
        >
            <TextInput 
                style={[styles.textInput, multiline && styles.textArea]}
                placeholder={placeholder}
                placeholderTextColor="#cbd5e1"
                editable={!isDropdown && !isDate}
                multiline={multiline}
                value={value}
                onChangeText={onChangeText}
                pointerEvents={(isDropdown || isDate) ? 'none' : 'auto'}
            />
            {unit ? <Text style={styles.unitText}>{unit}</Text> : null}
            {isDropdown && <Feather name="chevron-down" size={16} color="#cbd5e1" />}
            {isDate && <Feather name="calendar" size={16} color="#4A90B9" />}
        </TouchableOpacity>
    </View>
);


const SubmitButton = ({ title, icon, color = ['#68BFB4', '#4DA1C0'], onPress }: any) => (
    <TouchableOpacity style={styles.submitButtonContainer} onPress={onPress}>
        <LinearGradient
            colors={color}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
        >
            <View style={styles.buttonContent}>
                {icon && <Feather name={icon} size={16} color="#ffffff" style={{ marginRight: 8 }} />}
                <Text style={styles.submitButtonText}>{title}</Text>
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

const ActionOutlineButton = ({ title, icon, onPress }: any) => (
    <TouchableOpacity style={styles.outlineButton} onPress={onPress}>
        <Feather name={icon} size={16} color="#58a6b8" />
        <Text style={styles.outlineButtonText}>{title}</Text>
    </TouchableOpacity>
);

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
                <View style={[styles.accordionContent, { backgroundColor: '#ffffff' }]}>
                    {children}
                </View>
            )}
        </View>
    );
};

const MedicalData = ({ patientData, onAlert }: { patientData: any, onAlert?: (type: 'success' | 'error' | 'warning', message: string) => void }) => {
    const { t } = useTranslation();
    const [medicalData, setMedicalData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showMedModal, setShowMedModal] = useState(false);
    const [showDiagModal, setShowDiagModal] = useState(false);
    const [showAllergyModal, setShowAllergyModal] = useState(false);
    const [showChronicModal, setShowChronicModal] = useState(false);
    const [showFamilyModal, setShowFamilyModal] = useState(false);
    const [showRiskModal, setShowRiskModal] = useState(false);
    
    const [isRegularMed, setIsRegularMed] = useState(true);
    const [diagType, setDiagType] = useState('primary');

    const [newMedication, setNewMedication] = useState({
        name: '',
        genericName: '',
        form: 'Tablet',
        dose: '',
        instructions: '',
        startDate: new Date(),
        notes: ''
    });
    const [showFormDropdown, setShowFormDropdown] = useState(false);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);

    const [newAllergy, setNewAllergy] = useState({
        type: 'Drug',
        allergen: '',
        reaction: '',
        severity: 'Moderate',
        notes: ''
    });
    const [showAllergyTypeDropdown, setShowAllergyTypeDropdown] = useState(false);
    const [showAllergySeverityDropdown, setShowAllergySeverityDropdown] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Tracking which item status dropdown Is open: { type: 'diag' | 'chronic', index: number } | null

    const [openStatusMenu, setOpenStatusMenu] = useState<{type: string, index: number} | null>(null);

    const [newCondition, setNewCondition] = useState({

        name: '',
        status: 'Active',
        severity: 'Moderate',
        treatment: '',
        notes: ''
    });
    const [showConditionStatusDropdown, setShowConditionStatusDropdown] = useState(false);
    const [showConditionSeverityDropdown, setShowConditionSeverityDropdown] = useState(false);

    const [newFamilyHistory, setNewFamilyHistory] = useState({
        diseaseName: '',
        relationship: 'Mother',
        ageOfOnset: '',
        notes: ''
    });
    const [showRelationshipDropdown, setShowRelationshipDropdown] = useState(false);

    const handleAllergyChange = (field: string, value: any) => {

        setNewAllergy(prev => ({ ...prev, [field]: value }));
    };

    const handleConditionChange = (field: string, value: any) => {
        setNewCondition(prev => ({ ...prev, [field]: value }));
    };

    const handleFamilyHistoryChange = (field: string, value: any) => {
        setNewFamilyHistory(prev => ({ ...prev, [field]: value }));
    };

    const [newRiskFactor, setNewRiskFactor] = useState({
        category: 'Lifestyle',
        factor: '',
        level: 'Moderate',
        notes: ''
    });
    const [showRiskCategoryDropdown, setShowRiskCategoryDropdown] = useState(false);
    const [showRiskLevelDropdown, setShowRiskLevelDropdown] = useState(false);

    const handleRiskFactorChange = (field: string, value: any) => {
        setNewRiskFactor(prev => ({ ...prev, [field]: value }));
    };





    const formatDate = (dateVal: any) => {
        if (!dateVal) return '';
        try {
            const date = new Date(dateVal);
            if (isNaN(date.getTime())) return dateVal;
            
            const d = date.getDate().toString().padStart(2, '0');
            const m = (date.getMonth() + 1).toString().padStart(2, '0');
            const y = date.getFullYear();
            return `${d}/${m}/${y}`;
        } catch (e) {
            return dateVal;
        }
    };

    const handleMedicationChange = (field: string, value: any) => {

        setNewMedication(prev => ({ ...prev, [field]: value }));
    };

    const onMedicationDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') setShowStartDatePicker(false);
        if (selectedDate) {
            handleMedicationChange('startDate', selectedDate);
        }
    };

    const deleteMedication = (index: number, isHistory: boolean = false) => {
        setMedicalData((prev: any) => {
            const field = isHistory ? 'medicationHistory' : 'medications';
            const updatedList = [...(prev[field] || [])];
            updatedList.splice(index, 1);
            return { ...prev, [field]: updatedList };
        });
    };

    const endMedication = (index: number) => {
        setMedicalData((prev: any) => {
            const currentMeds = [...(prev.medications || [])];
            const medicationToEnd = currentMeds.splice(index, 1)[0];
            const history = [...(prev.medicationHistory || []), medicationToEnd];
            return {
                ...prev,
                medications: currentMeds,
                medicationHistory: history
            };
        });
    };

    const deleteDiagnosis = (index: number, isHistory: boolean = false) => {
        setMedicalData((prev: any) => {
            const field = isHistory ? 'diagnosisHistory' : 'diagnoses';
            const updatedList = [...(prev[field] || [])];
            updatedList.splice(index, 1);
            return { ...prev, [field]: updatedList };
        });
        if (!isHistory && openStatusMenu?.type === 'diag' && openStatusMenu.index === index) setOpenStatusMenu(null);
    };

    const deleteAllergy = (index: number, isHistory: boolean = false) => {
        setMedicalData((prev: any) => {
            const field = isHistory ? 'allergyHistory' : 'allergies';
            const updatedList = [...(prev[field] || [])];
            updatedList.splice(index, 1);
            return { ...prev, [field]: updatedList };
        });
    };

    const deleteChronic = (index: number, isHistory: boolean = false) => {
        setMedicalData((prev: any) => {
            const field = isHistory ? 'chronicHistory' : 'chronicConditions';
            const updatedList = [...(prev[field] || [])];
            updatedList.splice(index, 1);
            return { ...prev, [field]: updatedList };
        });
    };

    const deleteFamily = (index: number, isHistory: boolean = false) => {
        setMedicalData((prev: any) => {
            const field = isHistory ? 'familyHistoryPast' : 'familyHistory';
            const updatedList = [...(prev[field] || [])];
            updatedList.splice(index, 1);
            return { ...prev, [field]: updatedList };
        });
    };

    const deleteRisk = (index: number, isHistory: boolean = false) => {
        setMedicalData((prev: any) => {
            const field = isHistory ? 'riskHistory' : 'riskFactors';
            const updatedList = [...(prev[field] || [])];
            updatedList.splice(index, 1);
            return { ...prev, [field]: updatedList };
        });
    };
    const updateDiagnosisStatus = (index: number, newStatus: string) => {
        setMedicalData((prev: any) => {
            const updatedDiagnoses = [...(prev.diagnoses || [])];
            updatedDiagnoses[index] = { ...updatedDiagnoses[index], status: newStatus };
            return { ...prev, diagnoses: updatedDiagnoses };
        });
        setOpenStatusMenu(null);
    };

    const updateChronicStatus = (index: number, newStatus: string) => {
        setMedicalData((prev: any) => {
            const updatedConditions = [...(prev.chronicConditions || [])];
            updatedConditions[index] = { ...updatedConditions[index], status: newStatus };
            return { ...prev, chronicConditions: updatedConditions };
        });
        setOpenStatusMenu(null);
    };

    const handleSave = async (section: string) => {
        const patientId = patientData?.id || patientData?._id;
        if (!patientId) return;

        let payload: any = { patientId };

        switch (section) {
            case 'medications':
                payload.medications = [
                    ...(medicalData.medications || []).map((m: any) => ({ ...m, prescribedBy: m.prescribedBy || 'Hamad Alvi', isActive: true })),
                    ...(medicalData.medicationHistory || []).map((m: any) => ({ ...m, prescribedBy: m.prescribedBy || 'Hamad Alvi', isActive: false }))
                ];
                break;
            case 'diagnoses':
                payload.diagnoses = [
                    ...(medicalData.diagnoses || []).map((d: any) => ({ ...d, diagnosedBy: d.diagnosedBy || 'Hamad Alvi', isActive: true })),
                    ...(medicalData.diagnosisHistory || []).map((d: any) => ({ ...d, diagnosedBy: d.diagnosedBy || 'Hamad Alvi', isActive: false }))
                ];
                break;
            case 'allergies':
                payload.allergies = [
                    ...(medicalData.allergies || []).map((a: any) => ({ ...a, diagnosedBy: a.diagnosedBy || 'Hamad Alvi', isActive: true })),
                    ...(medicalData.allergyHistory || []).map((a: any) => ({ ...a, diagnosedBy: a.diagnosedBy || 'Hamad Alvi', isActive: false }))
                ];
                break;
            case 'chronic':
                payload.chronicConditions = [
                    ...(medicalData.chronicConditions || []).map((c: any) => ({ ...c, diagnosedBy: c.diagnosedBy || 'Hamad Alvi', isActive: true })),
                    ...(medicalData.chronicHistory || []).map((c: any) => ({ ...c, diagnosedBy: c.diagnosedBy || 'Hamad Alvi', isActive: false }))
                ];
                break;
            case 'family':
                payload.familyHistory = [
                    ...(medicalData.familyHistory || []).map((f: any) => ({ ...f, name: f.name || f.diseaseName, isActive: true })),
                    ...(medicalData.familyHistoryPast || []).map((f: any) => ({ ...f, name: f.name || f.diseaseName, isActive: false }))
                ];
                break;
            case 'risk':
                payload.riskFactors = [
                    ...(medicalData.riskFactors || []).map((r: any) => ({ ...r, isActive: true })),
                    ...(medicalData.riskHistory || []).map((r: any) => ({ ...r, isActive: false }))
                ];
                break;
        }

        console.log(`Saving ${section} information:`, payload);
        setIsSaving(true);
        try {
            const res = await UpdateMedicalData(payload);
            console.log(`${section} update response:`, res);
            if (res && (res.status === 200 || res.status === 201 || res.data)) {
                if (onAlert) onAlert('success', t('medicalData.saveSuccess', { section: section.charAt(0).toUpperCase() + section.slice(1) }));
                
                // Refresh data to ensure UI sync
                const response: any = await GetPatientMedicalData(patientId);
                if (response) {
                    const processed = {
                        ...response,
                        medications: (response.medications || []).filter((i: any) => i.isActive !== false),
                        medicationHistory: (response.medications || []).filter((i: any) => i.isActive === false),
                        diagnoses: (response.diagnoses || []).filter((i: any) => i.isActive !== false),
                        diagnosisHistory: (response.diagnoses || []).filter((i: any) => i.isActive === false),
                        allergies: (response.allergies || []).filter((i: any) => i.isActive !== false),
                        allergyHistory: (response.allergies || []).filter((i: any) => i.isActive === false),
                        chronicConditions: (response.chronicConditions || []).filter((i: any) => i.isActive !== false),
                        chronicHistory: (response.chronicConditions || []).filter((i: any) => i.isActive === false),
                        familyHistory: (response.familyHistory || []).filter((i: any) => i.isActive !== false),
                        familyHistoryPast: (response.familyHistory || []).filter((i: any) => i.isActive === false),
                        riskFactors: (response.riskFactors || []).filter((i: any) => i.isActive !== false),
                        riskHistory: (response.riskFactors || []).filter((i: any) => i.isActive === false),
                    };
                    setMedicalData(processed);
                }
            }
        } catch (error) {
            console.error(`Error saving ${section}:`, error);
            if (onAlert) onAlert('error', t('medicalData.saveError', { section: section.charAt(0).toUpperCase() + section.slice(1) }));
        } finally {
            setIsSaving(false);
        }
    };


    React.useEffect(() => {
        const fetchMedicalData = async () => {
            try {
                const patientId = patientData?.id || patientData?._id;
                if (!patientId) {
                    setLoading(false);
                    return;
                }
                const response: any = await GetPatientMedicalData(patientId);
                if (response) {
                    const processed = {
                        ...response,
                        medications: (response.medications || []).filter((i: any) => i.isActive !== false),
                        medicationHistory: (response.medications || []).filter((i: any) => i.isActive === false),
                        
                        diagnoses: (response.diagnoses || []).filter((i: any) => i.isActive !== false),
                        diagnosisHistory: (response.diagnoses || []).filter((i: any) => i.isActive === false),
                        
                        allergies: (response.allergies || []).filter((i: any) => i.isActive !== false),
                        allergyHistory: (response.allergies || []).filter((i: any) => i.isActive === false),
                        
                        chronicConditions: (response.chronicConditions || []).filter((i: any) => i.isActive !== false),
                        chronicHistory: (response.chronicConditions || []).filter((i: any) => i.isActive === false),
                        
                        familyHistory: (response.familyHistory || []).filter((i: any) => i.isActive !== false),
                        familyHistoryPast: (response.familyHistory || []).filter((i: any) => i.isActive === false),
                        
                        riskFactors: (response.riskFactors || []).filter((i: any) => i.isActive !== false),
                        riskHistory: (response.riskFactors || []).filter((i: any) => i.isActive === false),
                    };
                    setMedicalData(processed);
                }
            } catch (error) {
                console.log("Fetch medical data error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMedicalData();
    }, [patientData]);

    if (loading) {
        return (
            <View style={{ flex: 1, paddingVertical: 40, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#4A90B9" />
                <Text style={{ marginTop: 15, color: '#64748b' }}>{t('medicalData.fetchingHistory')}</Text>
            </View>
        );
    }

    const renderAddMedicationModal = () => (
        <Modal visible={showMedModal} transparent animationType="fade" onRequestClose={() => setShowMedModal(false)}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{t('medicalData.addMedication')}</Text>
                        <TouchableOpacity onPress={() => setShowMedModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        <FormInput 
                            label={t('medicalData.medicationName')} required placeholder={t('medicalData.placeholderMedName')} 
                            value={newMedication.name}
                            onChangeText={(val: string) => handleMedicationChange('name', val)}
                        />
                        <FormInput 
                            label={t('medicalData.commonName')} placeholder={t('medicalData.placeholderGenericName')} 
                            value={newMedication.genericName}
                            onChangeText={(val: string) => handleMedicationChange('genericName', val)}
                        />
                        <View style={[styles.row, { zIndex: 10 }]}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput 
                                    label={t('medicalData.form')} placeholder={t('medicalData.placeholderForm')} isDropdown 
                                    value={newMedication.form}
                                    onPress={() => setShowFormDropdown(!showFormDropdown)}
                                />
                                {showFormDropdown && (
                                    <View style={styles.inlineDropdown}>
                                        {MEDICATION_FORMS.map((option) => (
                                            <TouchableOpacity 
                                                key={option} 
                                                style={[styles.dropdownItem, newMedication.form === option && styles.dropdownItemActive]}
                                                onPress={() => {
                                                    handleMedicationChange('form', option);
                                                    setShowFormDropdown(false);
                                                }}
                                            >
                                                <Text style={[styles.dropdownItemText, newMedication.form === option && styles.dropdownItemTextActive]}>
                                                    {t(`medicalData.options.medicationForms.${option}`, { defaultValue: option })}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput 
                                    label={t('medicalData.dose')} placeholder={t('medicalData.placeholderDose')} unit="mg" 
                                    value={newMedication.dose}
                                    onChangeText={(val: string) => handleMedicationChange('dose', val)}
                                />
                            </View>
                        </View>
                        <FormInput 
                            label={t('medicalData.dosageInstructions')} required placeholder={t('medicalData.placeholderInstructions')} 
                            value={newMedication.instructions}
                            onChangeText={(val: string) => handleMedicationChange('instructions', val)}
                        />
                        <FormInput 
                            label={t('medicalData.startDate')} placeholder={t('medicalData.placeholderSelectDate')} isDate 
                            value={newMedication.startDate.toISOString().split('T')[0].replace(/-/g, '/')}
                            onPress={() => setShowStartDatePicker(!showStartDatePicker)}
                        />
                        
                        {showStartDatePicker && (
                            <View style={styles.datePickerContainer}>
                                {Platform.OS === 'ios' && (
                                    <View style={styles.datePickerHeader}>
                                        <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                                            <Text style={styles.datePickerDone}>{t('medicalData.done')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                <DateTimePicker
                                    value={newMedication.startDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onMedicationDateChange}
                                />
                            </View>
                        )}

                        <FormInput 
                            label={t('medicalData.notes')} multiline placeholder={t('medicalData.notesPlaceholder')} 
                            value={newMedication.notes}
                            onChangeText={(val: string) => handleMedicationChange('notes', val)}
                        />
                        
                        <View style={styles.checkboxRow}>
                            <Switch 
                                value={isRegularMed} 
                                onValueChange={setIsRegularMed}
                                trackColor={{ false: '#e2e8f0', true: '#58a6b8' }}
                            />
                            <Text style={styles.checkboxLabel}>{t('medicalData.regularMedication')}</Text>
                        </View>
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelOutlineButton} onPress={() => setShowMedModal(false)}>
                            <Text style={styles.cancelOutlineText}>{t('medicalData.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton title={t('medicalData.addEntry')} onPress={() => {
                            // Add logic here if needed, or just close for now
                            console.log("Adding medication:", newMedication);
                            setShowMedModal(false);
                        }} />
                    </View>
                </View>
            </View>
        </Modal>
    );


    const renderAddDiagnosisModal = () => (
        <Modal visible={showDiagModal} transparent animationType="fade" onRequestClose={() => setShowDiagModal(false)}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{t('medicalData.addDiagnosis')}</Text>
                        <TouchableOpacity onPress={() => setShowDiagModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll}>
                        <FormInput label={t('medicalData.description')} hasInfo placeholder="" />
                        <FormInput label={t('medicalData.code')} required hasInfo placeholder={t('medicalData.placeholderDiagnosisCode')} />
                        
                        <View style={styles.radioGroup}>
                            <View style={styles.labelRow}>
                                <Text style={styles.requiredStar}>* </Text>
                                <Text style={styles.inputLabel}>{t('medicalData.diagnosisType')}</Text>
                                <Feather name="help-circle" size={14} color="#94a3b8" style={{ marginLeft: 4 }} />
                            </View>
                            <View style={styles.radioRow}>
                                <TouchableOpacity 
                                    style={styles.radioItem} 
                                    onPress={() => setDiagType('primary')}
                                >
                                    <View style={[styles.radioOuter, diagType === 'primary' && styles.radioOuterActive]}>
                                        {diagType === 'primary' && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={styles.radioLabel}>{t('medicalData.options.diagnosisTypes.Primary')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.radioItem} 
                                    onPress={() => setDiagType('secondary')}
                                >
                                    <View style={[styles.radioOuter, diagType === 'secondary' && styles.radioOuterActive]}>
                                        {diagType === 'secondary' && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={styles.radioLabel}>{t('medicalData.options.diagnosisTypes.Secondary')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <FormInput label={t('medicalData.notes')} hasInfo multiline placeholder={t('medicalData.diagnosisNotesPlaceholder')} />
                        <Text style={styles.charCount}>0 / 500</Text>
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelOutlineButton} onPress={() => setShowDiagModal(false)}>
                            <Text style={styles.cancelOutlineText}>{t('medicalData.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton title={t('medicalData.addEntry')} />
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderAddAllergyModal = () => (
        <Modal visible={showAllergyModal} transparent animationType="fade" onRequestClose={() => setShowAllergyModal(false)}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{t('medicalData.addAllergy')}</Text>
                        <TouchableOpacity onPress={() => setShowAllergyModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        <View style={{ zIndex: 20 }}>
                            <FormInput 
                                label={t('medicalData.allergyType')} required placeholder={t('medicalData.placeholderSelectType')} isDropdown 
                                value={newAllergy.type}
                                onPress={() => setShowAllergyTypeDropdown(!showAllergyTypeDropdown)}
                            />
                            {showAllergyTypeDropdown && (
                                <View style={styles.inlineDropdown}>
                                    {ALLERGY_TYPES.map((option) => (
                                        <TouchableOpacity 
                                            key={option} 
                                            style={[styles.dropdownItem, newAllergy.type === option && styles.dropdownItemActive]}
                                            onPress={() => {
                                                handleAllergyChange('type', option);
                                                setShowAllergyTypeDropdown(false);
                                            }}
                                        >
                                            <Text style={[styles.dropdownItemText, newAllergy.type === option && styles.dropdownItemTextActive]}>
                                                {t(`medicalData.options.allergyTypes.${option}`, { defaultValue: option })}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <FormInput 
                            label={t('medicalData.allergenName')} placeholder={t('medicalData.placeholderAllergenName')} 
                            value={newAllergy.allergen}
                            onChangeText={(val: string) => handleAllergyChange('allergen', val)}
                        />
                        <FormInput 
                            label={t('medicalData.allergicReaction')} multiline placeholder={t('medicalData.placeholderAllergicReaction')} 
                            value={newAllergy.reaction}
                            onChangeText={(val: string) => handleAllergyChange('reaction', val)}
                        />

                        <View style={{ zIndex: 10 }}>
                            <FormInput 
                                label={t('medicalData.severity')} required placeholder={t('medicalData.placeholderSelectSeverity')} isDropdown 
                                value={newAllergy.severity}
                                onPress={() => setShowAllergySeverityDropdown(!showAllergySeverityDropdown)}
                            />
                            {showAllergySeverityDropdown && (
                                <View style={styles.inlineDropdown}>
                                    {SEVERITY_LEVELS.map((option) => (
                                        <TouchableOpacity 
                                            key={option} 
                                            style={[styles.dropdownItem, newAllergy.severity === option && styles.dropdownItemActive]}
                                            onPress={() => {
                                                handleAllergyChange('severity', option);
                                                setShowAllergySeverityDropdown(false);
                                            }}
                                        >
                                            <Text style={[styles.dropdownItemText, newAllergy.severity === option && styles.dropdownItemTextActive]}>
                                                {t(`medicalData.options.severityLevels.${option}`, { defaultValue: option })}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                            )}
                        </View>

                        <FormInput 
                            label={t('medicalData.notes')} multiline placeholder={t('medicalData.notesPlaceholder')} 
                            value={newAllergy.notes}
                            onChangeText={(val: string) => handleAllergyChange('notes', val)}
                        />
                        <Text style={styles.charCount}>{newAllergy.notes.length} / 500</Text>
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelOutlineButton} onPress={() => setShowAllergyModal(false)}>
                            <Text style={styles.cancelOutlineText}>{t('medicalData.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton title={t('medicalData.addAllergy')} onPress={() => {
                            console.log("Adding allergy:", newAllergy);
                            setShowAllergyModal(false);
                        }} />
                    </View>
                </View>
            </View>
        </Modal>
    );


    const renderAddChronicModal = () => (
        <Modal visible={showChronicModal} transparent animationType="fade" onRequestClose={() => setShowChronicModal(false)}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{t('medicalData.addCondition')}</Text>
                        <TouchableOpacity onPress={() => setShowChronicModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        <FormInput 
                            label={t('medicalData.conditionName')} placeholder={t('medicalData.placeholderConditionName')} 
                            value={newCondition.name}
                            onChangeText={(val: string) => handleConditionChange('name', val)}
                        />
                        
                        <View style={{ zIndex: 20 }}>
                            <FormInput 
                                label={t('medicalData.status')} required placeholder={t('medicalData.placeholderSelectStatus')} isDropdown 
                                value={newCondition.status}
                                onPress={() => setShowConditionStatusDropdown(!showConditionStatusDropdown)}
                            />
                            {showConditionStatusDropdown && (
                                <View style={styles.inlineDropdown}>
                                    {CONDITION_STATUSES.map((option) => (
                                        <TouchableOpacity 
                                            key={option} 
                                            style={[styles.dropdownItem, newCondition.status === option && styles.dropdownItemActive]}
                                            onPress={() => {
                                                handleConditionChange('status', option);
                                                setShowConditionStatusDropdown(false);
                                            }}
                                        >
                                            <Text style={[styles.dropdownItemText, newCondition.status === option && styles.dropdownItemTextActive]}>
                                                {t(`medicalData.options.conditionStatuses.${option}`, { defaultValue: option })}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View style={{ zIndex: 10 }}>
                            <FormInput 
                                label={t('medicalData.severity')} required placeholder={t('medicalData.placeholderSelectSeverity')} isDropdown 
                                value={newCondition.severity}
                                onPress={() => setShowConditionSeverityDropdown(!showConditionSeverityDropdown)}
                            />
                            {showConditionSeverityDropdown && (
                                <View style={styles.inlineDropdown}>
                                    {SEVERITY_LEVELS.map((option) => (
                                        <TouchableOpacity 
                                            key={option} 
                                            style={[styles.dropdownItem, newCondition.severity === option && styles.dropdownItemActive]}
                                            onPress={() => {
                                                handleConditionChange('severity', option);
                                                setShowConditionSeverityDropdown(false);
                                            }}
                                        >
                                            <Text style={[styles.dropdownItemText, newCondition.severity === option && styles.dropdownItemTextActive]}>
                                                {t(`medicalData.options.severityLevels.${option}`, { defaultValue: option })}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <FormInput 
                            label={t('medicalData.currentTreatment')} multiline placeholder={t('medicalData.placeholderTreatmentPlan')} 
                            value={newCondition.treatment}
                            onChangeText={(val: string) => handleConditionChange('treatment', val)}
                        />
                        <FormInput 
                            label={t('medicalData.notes')} multiline placeholder={t('medicalData.notesPlaceholder')} 
                            value={newCondition.notes}
                            onChangeText={(val: string) => handleConditionChange('notes', val)}
                        />
                        <Text style={styles.charCount}>{newCondition.notes.length} / 500</Text>
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelOutlineButton} onPress={() => setShowChronicModal(false)}>
                            <Text style={styles.cancelOutlineText}>{t('medicalData.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton title={t('medicalData.addEntry')} onPress={() => {
                            console.log("Adding condition:", newCondition);
                            setShowChronicModal(false);
                        }} />
                    </View>
                </View>
            </View>
        </Modal>
    );


    const renderAddFamilyModal = () => (
        <Modal visible={showFamilyModal} transparent animationType="fade" onRequestClose={() => setShowFamilyModal(false)}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{t('medicalData.addEntry')}</Text>
                        <TouchableOpacity onPress={() => setShowFamilyModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        <FormInput 
                            label={t('medicalData.diseaseName')} required placeholder={t('medicalData.placeholderDiseaseName')} 
                            value={newFamilyHistory.diseaseName}
                            onChangeText={(val: string) => handleFamilyHistoryChange('diseaseName', val)}
                        />
                        
                        <View style={{ zIndex: 10 }}>
                            <FormInput 
                                label={t('medicalData.relationship')} required placeholder={t('medicalData.placeholderSelectRelationship')} isDropdown 
                                value={newFamilyHistory.relationship}
                                onPress={() => setShowRelationshipDropdown(!showRelationshipDropdown)}
                            />
                            {showRelationshipDropdown && (
                                <View style={styles.inlineDropdown}>
                                    <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
                                        {RELATIONSHIP_OPTIONS.map((option) => (
                                            <TouchableOpacity 
                                                key={option} 
                                                style={[styles.dropdownItem, newFamilyHistory.relationship === option && styles.dropdownItemActive]}
                                                onPress={() => {
                                                    handleFamilyHistoryChange('relationship', option);
                                                    setShowRelationshipDropdown(false);
                                                }}
                                            >
                                                <Text style={[styles.dropdownItemText, newFamilyHistory.relationship === option && styles.dropdownItemTextActive]}>
                                                    {t(`medicalData.options.relationships.${option}`, { defaultValue: option })}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
 
                        <FormInput 
                            label={t('medicalData.ageOfOnset')} placeholder={t('medicalData.placeholderAgeOfOnset')} 
                            value={newFamilyHistory.ageOfOnset}
                            onChangeText={(val: string) => handleFamilyHistoryChange('ageOfOnset', val)}
                        />
                        <FormInput 
                            label={t('medicalData.notes')} multiline placeholder={t('medicalData.notesPlaceholder')} 
                            value={newFamilyHistory.notes}
                            onChangeText={(val: string) => handleFamilyHistoryChange('notes', val)}
                        />
                        <Text style={styles.charCount}>{newFamilyHistory.notes.length} / 500</Text>
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelOutlineButton} onPress={() => setShowFamilyModal(false)}>
                            <Text style={styles.cancelOutlineText}>{t('medicalData.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton title={t('medicalData.addEntry')} onPress={() => {
                            console.log("Adding family history:", newFamilyHistory);
                            setShowFamilyModal(false);
                        }} />
                    </View>
                </View>
            </View>
        </Modal>
    );


    const renderAddRiskModal = () => (
        <Modal visible={showRiskModal} transparent animationType="fade" onRequestClose={() => setShowRiskModal(false)}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{t('medicalData.addRiskFactor')}</Text>
                        <TouchableOpacity onPress={() => setShowRiskModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        <View style={{ zIndex: 20 }}>
                            <FormInput 
                                label={t('medicalData.riskCategory')} required placeholder={t('medicalData.placeholderSelectCategory')} isDropdown 
                                value={newRiskFactor.category}
                                onPress={() => setShowRiskCategoryDropdown(!showRiskCategoryDropdown)}
                            />
                            {showRiskCategoryDropdown && (
                                <View style={styles.inlineDropdown}>
                                    {RISK_CATEGORIES.map((option) => (
                                        <TouchableOpacity 
                                            key={option} 
                                            style={[styles.dropdownItem, newRiskFactor.category === option && styles.dropdownItemActive]}
                                            onPress={() => {
                                                handleRiskFactorChange('category', option);
                                                setShowRiskCategoryDropdown(false);
                                            }}
                                        >
                                            <Text style={[styles.dropdownItemText, newRiskFactor.category === option && styles.dropdownItemTextActive]}>
                                                {t(`medicalData.options.riskCategories.${option}`, { defaultValue: option })}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
 
                        <FormInput 
                            label={t('medicalData.riskFactor')} required placeholder={t('medicalData.placeholderEnterRiskFactor')} 
                            value={newRiskFactor.factor}
                            onChangeText={(val: string) => handleRiskFactorChange('factor', val)}
                        />
 
                        <View style={{ zIndex: 10 }}>
                            <FormInput 
                                label={t('medicalData.riskLevel')} required placeholder={t('medicalData.placeholderSelectSeverity')} isDropdown 
                                value={newRiskFactor.level}
                                onPress={() => setShowRiskLevelDropdown(!showRiskLevelDropdown)}
                            />
                            {showRiskLevelDropdown && (
                                <View style={styles.inlineDropdown}>
                                    {RISK_LEVELS.map((option) => (
                                        <TouchableOpacity 
                                            key={option} 
                                            style={[styles.dropdownItem, newRiskFactor.level === option && styles.dropdownItemActive]}
                                            onPress={() => {
                                                handleRiskFactorChange('level', option);
                                                setShowRiskLevelDropdown(false);
                                            }}
                                        >
                                            <Text style={[styles.dropdownItemText, newRiskFactor.level === option && styles.dropdownItemTextActive]}>
                                                {t(`medicalData.options.severityLevels.${option}`, { defaultValue: option })}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
 
                        <FormInput 
                            label={t('medicalData.notes')} multiline placeholder={t('medicalData.notesPlaceholder')} 
                            value={newRiskFactor.notes}
                            onChangeText={(val: string) => handleRiskFactorChange('notes', val)}
                        />
                        <Text style={styles.charCount}>{newRiskFactor.notes.length} / 500</Text>
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelOutlineButton} onPress={() => setShowRiskModal(false)}>
                            <Text style={styles.cancelOutlineText}>{t('medicalData.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton title={t('medicalData.add')} onPress={() => {
                            console.log("Adding risk factor:", newRiskFactor);
                            setShowRiskModal(false);
                        }} />
                    </View>
                </View>
            </View>
        </Modal>
    );


    const renderEmptyBox = (text: string) => (
        <View style={styles.emptyBox}>
            <Text style={styles.emptyBoxText}>{text}</Text>
        </View>
    );

    const renderListItem = (title: string, subtitle: string, subInfo: string = '', status: string = '', key?: any) => (
        <View style={styles.listItem} key={key}>
            <View style={{ flex: 1 }}>
                <Text style={styles.listItemTitle}>{title}</Text>
                <Text style={styles.listItemSubtitle}>{subtitle}</Text>
                {subInfo ? <Text style={styles.listItemSubInfo}>{subInfo}</Text> : null}
            </View>
            {status ? (
                <View style={[styles.statusTag, status === 'Active' ? styles.statusTagActive : styles.statusTagHistory]}>
                    <Text style={[styles.statusTagText, status === 'Active' ? styles.statusTagTextActive : styles.statusTagTextHistory]}>{status}</Text>
                </View>
            ) : null}
        </View>
    );

    const renderMedicationItem = (med: any, key: any, index: number, isHistory: boolean = false) => (
        <View style={styles.medicationCard} key={key}>
            <View style={styles.medicationHeader}>
                <View style={styles.medicationTitleRow}>
                    <Feather name="link" size={16} color="#4DA1C0" style={{ marginRight: 6, transform: [{ rotate: '45deg' }] }} />
                    <Text style={styles.medicationName}>{med.name}</Text>
                </View>
                <Text style={styles.doctorName}>{med.doctor || 'Hamad Alvi'}</Text>
            </View>
            
            <View style={styles.medicationBody}>
                <View style={styles.medicationInfoColumn}>
                    <Text style={styles.medicationDetail}>{t('medicalData.dosage')}: {med.dosage || '1 tablet daily'}</Text>
                    <View style={styles.dateRow}>
                        <Feather name="clock" size={12} color="#94a3b8" style={{ marginRight: 4 }} />
                        <Text style={styles.medicationDetail}>{t('medicalData.from')} {formatDate(med.startDate) || '04/03/2026'}</Text>
                    </View>
                    <Text style={styles.medicationDetail}>{t('medicalData.notes')}: {med.instructions || med.notes || 'It is for headache'}</Text>
                </View>

                <View style={styles.medicationActions}>
                    {!isHistory && (
                        <TouchableOpacity style={styles.endButton} onPress={() => endMedication(index)}>
                            <Text style={styles.endButtonText}>{t('medicalData.end')}</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMedication(index, isHistory)}>
                        <Feather name="x" size={16} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderDiagnosisItem = (diag: any, key: any, index: number, isHistory: boolean = false) => (
        <View style={styles.medicationCard} key={key}>
            <View style={styles.medicationHeader}>
                <View style={styles.medicationTitleRow}>
                    <Feather name="activity" size={16} color="#4DA1C0" style={{ marginRight: 6 }} />
                    <Text style={styles.medicationName}>{diag.description || diag.code} - </Text>
                    <View style={[styles.statusBadge, { backgroundColor: '#E0F2FE' }]}>
                        <Text style={[styles.statusBadgeText, { color: '#0EA5E9' }]}>{t(`medicalData.options.diagnosisTypes.${diag.type || 'Primary'}`, { defaultValue: diag.type || 'Primary' })}</Text>
                    </View>
                </View>
                <Text style={styles.doctorName}>{diag.doctor || 'Hamad Alvi'}</Text>
            </View>
            
            <View style={styles.medicationBody}>
                <View style={styles.medicationInfoColumn}>
                    <View style={styles.dateRow}>
                        <Feather name="calendar" size={12} color="#94a3b8" style={{ marginRight: 4 }} />
                        <Text style={styles.medicationDetail}>{t('medicalData.from')} {formatDate(diag.date || diag.onsetDate) || '04/03/2026'}</Text>
                    </View>
                    <Text style={styles.medicationDetail}>{t('medicalData.notes')}: {diag.notes || 'Health is fine'}</Text>
                </View>
                
                <View style={styles.medicationActions}>
                    {!isHistory && (
                        <View style={{ position: 'relative', zIndex: 50 }}>
                            <TouchableOpacity 
                                style={[styles.statusDropdownBtn, openStatusMenu?.type === 'diag' && openStatusMenu.index === index && { borderColor: '#4DA1C0' }]}
                                onPress={() => setOpenStatusMenu(openStatusMenu?.type === 'diag' && openStatusMenu.index === index ? null : { type: 'diag', index })}
                            >
                                <Text style={styles.statusDropdownBtnText}>{t(`medicalData.options.conditionStatuses.${diag.status || 'Active'}`, { defaultValue: diag.status || 'Active' })}</Text>
                                <Feather name="chevron-down" size={12} color="#94a3b8" />
                            </TouchableOpacity>
                            
                            {openStatusMenu?.type === 'diag' && openStatusMenu.index === index && (
                                <View style={styles.statusMenuPopup}>
                                    {CONDITION_STATUSES.map((status) => (
                                        <TouchableOpacity 
                                            key={status} 
                                            style={[styles.statusOption, diag.status === status && styles.statusOptionActive]}
                                            onPress={() => updateDiagnosisStatus(index, status)}
                                        >
                                            <Text style={[styles.statusOptionText, diag.status === status && styles.statusOptionTextActive]}>
                                                {t(`medicalData.options.conditionStatuses.${status}`, { defaultValue: status })}
                                            </Text>
                                        </TouchableOpacity>

                                    ))}
                                </View>
                            )}
                        </View>
                    )}
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteDiagnosis(index, isHistory)}>
                        <Feather name="x" size={16} color="#ef4444" />
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );

    const renderAllergyItem = (allergy: any, key: any, index: number, isHistory: boolean = false) => (
        <View style={[styles.medicationCard, isHistory && { opacity: 0.7 }]} key={key}>
            <View style={styles.medicationHeader}>
                <View style={styles.medicationTitleRow}>
                    <Feather name="alert-circle" size={16} color={isHistory ? "#94a3b8" : "#4DA1C0"} style={{ marginRight: 6 }} />
                    <Text style={[styles.medicationName, isHistory && { color: '#64748b' }]}>{allergy.name || allergy.allergen}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: isHistory ? '#f1f5f9' : '#FEF3C7' }]}>
                        <Text style={[styles.statusBadgeText, { color: isHistory ? '#94a3b8' : '#D97706' }]}>{t(`medicalData.options.severityLevels.${allergy.severity || 'Moderate'}`, { defaultValue: allergy.severity || 'Moderate' })}</Text>
                    </View>
                </View>
                <Text style={styles.doctorName}>{allergy.doctor || 'Hamad Alvi'}</Text>
            </View>
            
            <View style={styles.medicationBody}>
                <View style={styles.medicationInfoColumn}>
                    <Text style={styles.medicationDetail}>{t('medicalData.reaction')}: {allergy.reaction || 'Allergic to skin'}</Text>
                    <View style={styles.dateRow}>
                        <Feather name="calendar" size={12} color="#94a3b8" style={{ marginRight: 4 }} />
                        <Text style={styles.medicationDetail}>{t('medicalData.diagnosed')}: {formatDate(allergy.date || allergy.diagnosedDate) || '04/03/2026'}</Text>
                    </View>
                    <Text style={styles.medicationDetail}>{t('medicalData.notes')}: {allergy.notes || 'Not too risky'}</Text>
                </View>
                
                <View style={styles.medicationActions}>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAllergy(index, isHistory)}>
                        <Feather name="x" size={16} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderChronicItem = (item: any, key: any, index: number, isHistory: boolean = false) => (
        <View style={[styles.medicationCard, isHistory && { opacity: 0.7 }]} key={key}>
            <View style={styles.medicationHeader}>
                <View style={styles.medicationTitleRow}>
                    <Feather name="heart" size={16} color={isHistory ? "#94a3b8" : "#4DA1C0"} style={{ marginRight: 6 }} />
                    <Text style={[styles.medicationName, isHistory && { color: '#64748b' }]}>{item.name || item.condition}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: isHistory ? '#f1f5f9' : '#E0F2FE' }]}>
                        <Text style={[styles.statusBadgeText, { color: isHistory ? '#94a3b8' : '#0EA5E9' }]}>{t(`medicalData.options.conditionStatuses.${item.status || 'Active'}`, { defaultValue: item.status || 'Active' })}</Text>
                    </View>
                </View>
                <Text style={styles.doctorName}>{item.doctor || 'Hamad Alvi'}</Text>
            </View>
            
            <View style={styles.medicationBody}>
                <View style={styles.medicationInfoColumn}>
                    <Text style={styles.medicationDetail}>{t('medicalData.treatment')}: {item.treatment || 'Needs some rest'}</Text>
                    <View style={styles.dateRow}>
                        <Feather name="calendar" size={12} color="#94a3b8" style={{ marginRight: 4 }} />
                        <Text style={styles.medicationDetail}>{t('medicalData.diagnosed')}: {formatDate(item.date || item.diagnosedDate) || '04/03/2026'}</Text>
                    </View>
                    <Text style={styles.medicationDetail}>{t('medicalData.notes')}: {item.notes || 'Eat Fruits regularly'}</Text>
                </View>
                
                <View style={styles.medicationActions}>
                    {!isHistory && (
                        <View style={{ position: 'relative', zIndex: 50 }}>
                            <TouchableOpacity 
                                style={[styles.statusDropdownBtn, openStatusMenu?.type === 'chronic' && openStatusMenu.index === index && { borderColor: '#4DA1C0' }]}
                                onPress={() => setOpenStatusMenu(openStatusMenu?.type === 'chronic' && openStatusMenu.index === index ? null : { type: 'chronic', index })}
                            >
                                <Text style={styles.statusDropdownBtnText}>{t(`medicalData.options.conditionStatuses.${item.status || 'Active'}`, { defaultValue: item.status || 'Active' })}</Text>
                                <Feather name="chevron-down" size={12} color="#94a3b8" />
                            </TouchableOpacity>

                            {openStatusMenu?.type === 'chronic' && openStatusMenu.index === index && (
                                <View style={styles.statusMenuPopup}>
                                    {CONDITION_STATUSES.map((status) => (
                                        <TouchableOpacity 
                                            key={status} 
                                            style={[styles.statusOption, item.status === status && styles.statusOptionActive]}
                                            onPress={() => updateChronicStatus(index, status)}
                                        >
                                            <Text style={[styles.statusOptionText, item.status === status && styles.statusOptionTextActive]}>
                                                {t(`medicalData.options.conditionStatuses.${status}`, { defaultValue: status })}
                                            </Text>
                                        </TouchableOpacity>

                                    ))}
                                </View>
                            )}
                        </View>
                    )}
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteChronic(index, isHistory)}>
                        <Feather name="x" size={16} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderFamilyItem = (item: any, key: any, index: number, isHistory: boolean = false) => (
        <View style={[styles.medicationCard, isHistory && { opacity: 0.7 }]} key={key}>
            <View style={styles.medicationHeader}>
                <View style={styles.medicationTitleRow}>
                    <Feather name="users" size={16} color="#4DA1C0" style={{ marginRight: 6 }} />
                    <Text style={[styles.medicationName, isHistory && { color: '#64748b' }]}>{item.diseaseName || item.disease || item.name}</Text>
                </View>
            </View>
            
            <View style={styles.medicationBody}>
                <View style={styles.medicationInfoColumn}>
                    <Text style={styles.medicationDetail}>{t('medicalData.relationship')}: {item.relationship}</Text>
                    <Text style={styles.medicationDetail}>{t('medicalData.ageOfOnsetLower')}: {item.ageOfOnset || item.onsetAge || '70'}</Text>
                    <Text style={styles.medicationDetail}>{t('medicalData.notes')}: {item.notes || 'There is Sugar in the genetics'}</Text>
                </View>
                
                <View style={styles.medicationActions}>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteFamily(index, isHistory)}>
                        <Feather name="x" size={16} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderRiskItem = (item: any, key: any, index: number, isHistory: boolean = false) => (
        <View style={[styles.medicationCard, isHistory && { opacity: 0.7 }]} key={key}>
            <View style={styles.medicationHeader}>
                <View style={styles.medicationTitleRow}>
                    <Feather name="alert-triangle" size={16} color="#4DA1C0" style={{ marginRight: 6 }} />
                    <Text style={[styles.medicationName, isHistory && { color: '#64748b' }]}>{item.factor}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: isHistory ? '#f1f5f9' : '#FEF3C7' }]}>
                        <Text style={[styles.statusBadgeText, { color: isHistory ? '#94a3b8' : '#D97706' }]}>{t(`medicalData.options.severityLevels.${item.level || 'Moderate'}`, { defaultValue: item.level || 'Moderate' })}</Text>
                    </View>
                </View>
            </View>
            
            <View style={styles.medicationBody}>
                <View style={styles.medicationInfoColumn}>
                    <Text style={styles.medicationDetail}>{t('medicalData.category')}: {item.category || 'Genetic'}</Text>
                    <Text style={styles.medicationDetail}>{t('medicalData.notes')}: {item.notes || 'A little factor'}</Text>
                </View>
                
                <View style={styles.medicationActions}>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRisk(index, isHistory)}>
                        <Feather name="x" size={16} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );


    return (

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {renderAddMedicationModal()}
            {renderAddDiagnosisModal()}
            {renderAddAllergyModal()}
            {renderAddChronicModal()}
            {renderAddFamilyModal()}
            {renderAddRiskModal()}

            <AccordionItem title={t('medicalData.medicines')} icon="link">
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.subHeader}>{t('medicalData.regularMedications')}</Text>
                    <ActionOutlineButton title={t('medicalData.addMedication')} icon="plus" onPress={() => setShowMedModal(true)} />
                </View>
                {medicalData?.medications?.length > 0 ? (
                    medicalData.medications.map((m: any, idx: number) => renderMedicationItem(m, `med-${idx}`, idx))
                ) : (

                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyBoxText}>{t('medicalData.noRegularMedications')}</Text>
                    </View>
                )}
                
                <Text style={[styles.subHeader, { marginTop: 15 }]}>{t('medicalData.asNeededMedications')}</Text>
                {renderEmptyBox(t('medicalData.noAsNeededMedications'))}
                
                <Text style={[styles.subHeader, { marginTop: 15 }]}>{t('medicalData.medicationHistory')}</Text>
                {medicalData?.medicationHistory?.length > 0 ? (
                    medicalData.medicationHistory.map((m: any, idx: number) => renderMedicationItem(m, `med-hist-${idx}`, idx, true))
                ) : renderEmptyBox(t('medicalData.noMedicationHistory'))}
 
                
                <View style={styles.saveContainer}>
                    <SubmitButton 
                        title={isSaving ? t('medicalData.saving') : t('medicalData.save')} 
                        onPress={() => handleSave('medications')} 
                    />
                </View>
            </AccordionItem>

            <AccordionItem title={t('medicalData.diagnosis')} icon="activity">
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.subHeader}>{t('medicalData.activeDiagnoses')}</Text>
                    <ActionOutlineButton title={t('medicalData.addDiagnosis')} icon="plus" onPress={() => setShowDiagModal(true)} />
                </View>
                {medicalData?.diagnoses?.length > 0 ? (
                    medicalData.diagnoses.map((d: any, idx: number) => renderDiagnosisItem(d, `diag-${idx}`, idx))
                ) : (
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyBoxText}>{t('medicalData.noActiveDiagnoses')}</Text>
                    </View>
                )}
                
                <Text style={[styles.subHeader, { marginTop: 15 }]}>{t('medicalData.diagnosisHistory')}</Text>
                {medicalData?.diagnosisHistory?.length > 0 ? (
                    medicalData.diagnosisHistory.map((d: any, idx: number) => renderDiagnosisItem(d, `diag-hist-${idx}`, idx, true))
                ) : renderEmptyBox(t('medicalData.noDiagnosisHistory'))}
                
                <View style={styles.saveContainer}>
                    <SubmitButton 
                        title={isSaving ? t('medicalData.saving') : t('medicalData.save')} 
                        onPress={() => handleSave('diagnoses')} 
                    />
                </View>
            </AccordionItem>

            <AccordionItem title={t('medicalData.allergiesAndIntolerances')} icon="alert-circle">
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.subHeader}>{t('medicalData.allergiesAndIntolerances')}</Text>
                    <ActionOutlineButton title={t('medicalData.addAllergy')} icon="plus" onPress={() => setShowAllergyModal(true)} />
                </View>
                {medicalData?.allergies?.length > 0 ? (
                    medicalData.allergies.map((a: any, idx: number) => renderAllergyItem(a, `all-${idx}`, idx))
                ) : renderEmptyBox(t('medicalData.noRegisteredAllergies'))}
 
                <Text style={[styles.subHeader, { marginTop: 15 }]}>{t('medicalData.pastAllergies')}</Text>
                {medicalData?.allergyHistory?.length > 0 ? (
                    medicalData.allergyHistory.map((a: any, idx: number) => renderAllergyItem(a, `all-hist-${idx}`, idx, true))
                ) : renderEmptyBox(t('medicalData.noAllergyHistory'))}
 
                <View style={styles.saveContainer}>
                    <SubmitButton 
                        title={isSaving ? t('medicalData.saving') : t('medicalData.save')} 
                        onPress={() => handleSave('allergies')} 
                    />
                </View>
            </AccordionItem>

            <AccordionItem title={t('medicalData.chronicDiseases')} icon="heart">
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.subHeader}>{t('medicalData.chronicConditions')}</Text>
                    <ActionOutlineButton title={t('medicalData.addCondition')} icon="plus" onPress={() => setShowChronicModal(true)} />
                </View>
                {medicalData?.chronicConditions?.length > 0 ? (
                    medicalData.chronicConditions.map((c: any, idx: number) => renderChronicItem(c, `chronic-${idx}`, idx))
                ) : renderEmptyBox(t('medicalData.noChronicConditions'))}
 
                <Text style={[styles.subHeader, { marginTop: 15 }]}>{t('medicalData.chronicDiseaseHistory')}</Text>
                {medicalData?.chronicHistory?.length > 0 ? (
                    medicalData.chronicHistory.map((c: any, idx: number) => renderChronicItem(c, `chronic-hist-${idx}`, idx, true))
                ) : renderEmptyBox(t('medicalData.noChronicConditionHistory'))}
 
                <View style={styles.saveContainer}>
                    <SubmitButton 
                        title={isSaving ? t('medicalData.saving') : t('medicalData.save')} 
                        onPress={() => handleSave('chronic')} 
                    />
                </View>
            </AccordionItem>
            
            <AccordionItem title={t('medicalData.familyInterview')} icon="users">
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.subHeader}>{t('medicalData.familyHistory')}</Text>
                    <ActionOutlineButton title={t('medicalData.addEntry')} icon="plus" onPress={() => setShowFamilyModal(true)} />
                </View>
                {medicalData?.familyHistory?.length > 0 ? (
                    medicalData.familyHistory.map((f: any, idx: number) => renderFamilyItem(f, `family-${idx}`, idx))
                ) : renderEmptyBox(t('medicalData.noFamilyHistoryEntries'))}
 
                <Text style={[styles.subHeader, { marginTop: 15 }]}>{t('medicalData.pastFamilyHistory')}</Text>
                {medicalData?.familyHistoryPast?.length > 0 ? (
                    medicalData.familyHistoryPast.map((f: any, idx: number) => renderFamilyItem(f, `family-past-${idx}`, idx, true))
                ) : renderEmptyBox(t('medicalData.noHistoricalEntries'))}
 
                <View style={styles.saveContainer}>
                    <SubmitButton 
                        title={isSaving ? t('medicalData.saving') : t('medicalData.save')} 
                        onPress={() => handleSave('family')} 
                    />
                </View>
            </AccordionItem>

            <AccordionItem title={t('medicalData.riskFactors')} icon="alert-triangle">
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.subHeader}>{t('medicalData.riskFactors')}</Text>
                    <ActionOutlineButton title={t('medicalData.addRiskFactor')} icon="plus" onPress={() => setShowRiskModal(true)} />
                </View>
                {medicalData?.riskFactors?.length > 0 ? (
                    medicalData.riskFactors.map((r: any, idx: number) => renderRiskItem(r, `risk-${idx}`, idx))
                ) : renderEmptyBox(t('medicalData.noRiskFactorsRecorded'))}
 
                <Text style={[styles.subHeader, { marginTop: 15 }]}>{t('medicalData.riskFactorHistory')}</Text>
                {medicalData?.riskHistory?.length > 0 ? (
                    medicalData.riskHistory.map((r: any, idx: number) => renderRiskItem(r, `risk-hist-${idx}`, idx, true))
                ) : renderEmptyBox(t('medicalData.noRiskHistory'))}
 
                <View style={styles.saveContainer}>
                    <SubmitButton 
                        title={isSaving ? t('medicalData.saving') : t('medicalData.save')} 
                        onPress={() => handleSave('risk')} 
                    />
                </View>
            </AccordionItem>



        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { paddingHorizontal: 16 },
    accordionContainer: { backgroundColor: '#ffffff', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9', overflow: 'hidden' },
    accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    expandedHeader: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconContainer: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#f0f9f8', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    accordionTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
    accordionContent: { padding: 16 },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    subHeader: { fontSize: 13, fontWeight: '600', color: '#64748b', marginBottom: 10 },
    emptyBox: { backgroundColor: '#F8FAFC', borderRadius: 8, padding: 16, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
    emptyBoxText: { color: '#94A3B8', fontSize: 13 },
    saveContainer: { alignItems: 'flex-end', marginTop: 10 },
    outlineButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#58a6b8', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
    outlineButtonText: { fontSize: 12, fontWeight: '600', color: '#58a6b8', marginLeft: 6 },
    submitButtonContainer: { height: 36, width: 120, borderRadius: 8, overflow: 'hidden' },
    gradientButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    submitButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { backgroundColor: '#ffffff', borderRadius: 12, width: '100%', maxHeight: '80%', padding: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
    modalScroll: { marginBottom: 20 },
    inputGroup: { marginBottom: 15 },
    labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    requiredStar: { color: '#ef4444', fontSize: 14 },
    inputLabel: { fontSize: 13, color: '#475569', fontWeight: '500' },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12, height: 44 },
    textInput: { flex: 1, fontSize: 14, color: '#1e293b', padding: 0 },
    textAreaWrapper: { height: 100, alignItems: 'flex-start', paddingTop: 12 },
    textArea: { textAlignVertical: 'top' },
    unitText: { marginLeft: 8, color: '#94a3b8', fontSize: 14 },
    row: { flexDirection: 'row' },
    modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 15 },
    cancelOutlineButton: { height: 36, paddingHorizontal: 15, borderRadius: 8, borderWidth: 1, borderColor: '#58a6b8', justifyContent: 'center', alignItems: 'center' },
    cancelOutlineText: { color: '#58a6b8', fontSize: 13, fontWeight: '600' },
    checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    checkboxLabel: { marginLeft: 10, fontSize: 13, color: '#475569' },
    radioGroup: { marginBottom: 15 },
    radioRow: { flexDirection: 'row', marginTop: 10 },
    radioItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
    radioOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center' },
    radioOuterActive: { borderColor: '#3b82f6' },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3b82f6' },
    radioLabel: { marginLeft: 10, fontSize: 13, color: '#475569' },
    charCount: { alignSelf: 'flex-end', fontSize: 11, color: '#94a3b8', marginTop: -10, marginBottom: 10 },
    listItem: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingVertical: 12, flexDirection: 'row', alignItems: 'center' },
    listItemTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
    listItemSubtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
    listItemSubInfo: { fontSize: 12, color: '#94a3b8', marginTop: 2, fontStyle: 'italic' },
    statusTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
    statusTagActive: { backgroundColor: '#f0fdf4' },
    statusTagHistory: { backgroundColor: '#f1f5f9' },
    statusTagText: { fontSize: 11, fontWeight: '600' },
    statusTagTextActive: { color: '#16a34a' },
    statusTagTextHistory: { color: '#64748b' },
    inlineDropdown: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginTop: 4,
        marginBottom: 8,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    dropdownItemActive: {
        backgroundColor: '#f0f9f8',
    },
    dropdownItemText: {
        fontSize: 13,
        color: '#334155',
        fontWeight: '500',
    },
    dropdownItemTextActive: {
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        backgroundColor: '#ffffff',
    },
    datePickerDone: {
        fontSize: 14,
        fontWeight: '700',
        color: '#58a6b8',
    },
    medicationCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    medicationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    medicationTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    medicationName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
    },
    doctorName: {
        fontSize: 12,
        color: '#94a3b8',
    },
    medicationBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    medicationInfoColumn: {
        flex: 1,
    },
    medicationDetail: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 20,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    medicationActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    endButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#58a6b8',
    },
    endButtonText: {
        fontSize: 13,
        color: '#58a6b8',
        fontWeight: '600',
    },
    deleteButton: {
        width: 32,
        height: 32,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    statusDropdownBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        marginRight: 4,
    },
    statusDropdownBtnText: {
        fontSize: 13,
        color: '#94a3b8',
        marginRight: 6,
        fontWeight: '500',
    },
    statusMenuPopup: {
        position: 'absolute',
        top: 40,
        right: 0,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        width: 120,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        zIndex: 100,
        overflow: 'hidden'
    },

    statusOption: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    statusOptionActive: {
        backgroundColor: '#f0f9ff',
    },
    statusOptionText: {
        fontSize: 13,
        color: '#1e293b',
        fontWeight: '600',
    },
    statusOptionTextActive: {
        color: '#0369a1',
    },
});





export default MedicalData;
