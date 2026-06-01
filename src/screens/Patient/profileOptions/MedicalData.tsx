import React, { useState, useMemo } from 'react';
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
import { useThemeColors } from '../../../hooks/useThemeColors';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FormInput = ({ label, placeholder, required = false, isDropdown = false, isDate = false, unit = '', hasInfo = false, multiline = false, value, onChangeText, onPress, ds, tc }: any) => (
    <View style={ds.inputGroup}>
        <View style={ds.labelRow}>
            {required && <Text style={ds.requiredStar}>* </Text>}
            <Text style={ds.inputLabel}>{label}</Text>
            {hasInfo && <Feather name="help-circle" size={14} color={tc.textMuted} style={{ marginLeft: 4 }} />}
        </View>
        <TouchableOpacity 
            activeOpacity={isDropdown || isDate ? 0.7 : 1}
            onPress={(isDropdown || isDate) ? onPress : undefined}
            style={[ds.inputWrapper, multiline && ds.textAreaWrapper]}
        >
            <TextInput 
                style={[ds.textInput, multiline && ds.textArea]}
                placeholder={placeholder}
                placeholderTextColor={tc.textMuted}
                editable={!isDropdown && !isDate}
                multiline={multiline}
                value={value}
                onChangeText={onChangeText}
                pointerEvents={(isDropdown || isDate) ? 'none' : 'auto'}
            />
            {unit ? <Text style={ds.unitText}>{unit}</Text> : null}
            {isDropdown && <Feather name="chevron-down" size={16} color={tc.textMuted} />}
            {isDate && <Feather name="calendar" size={16} color={tc.accent} />}
        </TouchableOpacity>
    </View>
);


const SubmitButton = ({ title, onPress, color, loading = false, ds, tc }: any) => (
    <TouchableOpacity 
        style={[ds.submitButtonContainer, loading && { opacity: 0.7 }]} 
        onPress={loading ? undefined : onPress}
        activeOpacity={0.7}
    >
        <LinearGradient
            colors={color || [tc.accentGradientStart || '#68BFB4', tc.accentGradientEnd || '#4DA1C0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: 100, height: '100%', justifyContent: 'center', alignItems: 'center' }}
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

const ActionOutlineButton = ({ title, icon, onPress, ds, tc }: any) => (
    <TouchableOpacity style={ds.outlineButton} onPress={onPress}>
        <Feather name={icon} size={16} color={tc.accent} />
        <Text style={ds.outlineButtonText}>{title}</Text>
    </TouchableOpacity>
);

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

const MedicalData = ({ patientData, onAlert }: { patientData: any, onAlert?: (type: 'success' | 'error' | 'warning', message: string) => void }) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = useMemo(() => createDynamicStyles(tc, isDark), [tc, isDark]);
    const commonProps = { ds, tc };

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
            <View style={{ flex: 1, paddingVertical: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: tc.cardBackground }}>
                <ActivityIndicator size="large" color={tc.accent} />
                <Text style={{ marginTop: 15, color: tc.textSecondary }}>{t('medicalData.fetchingHistory')}</Text>
            </View>
        );
    }

    const renderAddMedicationModal = () => (
        <Modal visible={showMedModal} transparent animationType="fade" onRequestClose={() => setShowMedModal(false)}>
            <View style={ds.modalOverlay}>
                <View style={ds.modalContent}>
                    <View style={ds.modalHeader}>
                        <Text style={ds.modalTitle}>{t('medicalData.addMedication')}</Text>
                        <TouchableOpacity onPress={() => setShowMedModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={ds.modalScroll} showsVerticalScrollIndicator={false}>
                        <FormInput {...commonProps} 
                            label={t('medicalData.medicationName')} required placeholder={t('medicalData.placeholderMedName')} 
                            value={newMedication.name}
                            onChangeText={(val: string) => handleMedicationChange('name', val)}
                        />
                        <FormInput {...commonProps} 
                            label={t('medicalData.commonName')} placeholder={t('medicalData.placeholderGenericName')} 
                            value={newMedication.genericName}
                            onChangeText={(val: string) => handleMedicationChange('genericName', val)}
                        />
                        <View style={[ds.row, { zIndex: 10 }]}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <FormInput {...commonProps} 
                                    label={t('medicalData.form')} placeholder={t('medicalData.placeholderForm')} isDropdown 
                                    value={newMedication.form}
                                    onPress={() => setShowFormDropdown(!showFormDropdown)}
                                />
                                {showFormDropdown && (
                                    <View style={ds.inlineDropdown}>
                                        {MEDICATION_FORMS.map((option) => (
                                            <TouchableOpacity 
                                                key={option} 
                                                style={[ds.dropdownItem, newMedication.form === option && ds.dropdownItemActive]}
                                                onPress={() => {
                                                    handleMedicationChange('form', option);
                                                    setShowFormDropdown(false);
                                                }}
                                            >
                                                <Text style={[ds.dropdownItemText, newMedication.form === option && ds.dropdownItemTextActive]}>
                                                    {t(`medicalData.options.medicationForms.${option}`, { defaultValue: option })}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormInput {...commonProps} 
                                    label={t('medicalData.dose')} placeholder={t('medicalData.placeholderDose')} unit="mg" 
                                    value={newMedication.dose}
                                    onChangeText={(val: string) => handleMedicationChange('dose', val)}
                                />
                            </View>
                        </View>
                        <FormInput {...commonProps} 
                            label={t('medicalData.dosageInstructions')} required placeholder={t('medicalData.placeholderInstructions')} 
                            value={newMedication.instructions}
                            onChangeText={(val: string) => handleMedicationChange('instructions', val)}
                        />
                        <FormInput {...commonProps} 
                            label={t('medicalData.startDate')} placeholder={t('medicalData.placeholderSelectDate')} isDate 
                            value={newMedication.startDate.toISOString().split('T')[0].replace(/-/g, '/')}
                            onPress={() => setShowStartDatePicker(!showStartDatePicker)}
                        />
                        
                        {showStartDatePicker && (
                            <View style={ds.datePickerContainer}>
                                {Platform.OS === 'ios' && (
                                    <View style={ds.datePickerHeader}>
                                        <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                                            <Text style={ds.datePickerDone}>{t('medicalData.done')}</Text>
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

                        <FormInput {...commonProps} 
                            label={t('medicalData.notes')} multiline placeholder={t('medicalData.notesPlaceholder')} 
                            value={newMedication.notes}
                            onChangeText={(val: string) => handleMedicationChange('notes', val)}
                        />
                        
                        <View style={ds.checkboxRow}>
                            <Switch 
                                value={isRegularMed} 
                                onValueChange={setIsRegularMed}
                                trackColor={{ false: tc.borderColor || '#e2e8f0', true: tc.accent || '#58a6b8' }}
                            />
                            <Text style={ds.checkboxLabel}>{t('medicalData.regularMedication')}</Text>
                        </View>
                    </ScrollView>
                    <View style={ds.modalFooter}>
                        <TouchableOpacity style={ds.cancelOutlineButton} onPress={() => setShowMedModal(false)}>
                            <Text style={ds.cancelOutlineText}>{t('medicalData.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton {...commonProps} tc={tc} ds={ds} title={t('medicalData.addEntry')} onPress={() => {
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
            <View style={ds.modalOverlay}>
                <View style={ds.modalContent}>
                    <View style={ds.modalHeader}>
                        <Text style={ds.modalTitle}>{t('medicalData.addDiagnosis')}</Text>
                        <TouchableOpacity onPress={() => setShowDiagModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={ds.modalScroll}>
                        <FormInput {...commonProps} label={t('medicalData.description')} hasInfo placeholder="" />
                        <FormInput {...commonProps} label={t('medicalData.code')} required hasInfo placeholder={t('medicalData.placeholderDiagnosisCode')} />
                        
                        <View style={ds.radioGroup}>
                            <View style={ds.labelRow}>
                                <Text style={ds.requiredStar}>* </Text>
                                <Text style={ds.inputLabel}>{t('medicalData.diagnosisType')}</Text>
                                <Feather name="help-circle" size={14} color="#94a3b8" style={{ marginLeft: 4 }} />
                            </View>
                            <View style={ds.radioRow}>
                                <TouchableOpacity 
                                    style={ds.radioItem} 
                                    onPress={() => setDiagType('primary')}
                                >
                                    <View style={[ds.radioOuter, diagType === 'primary' && ds.radioOuterActive]}>
                                        {diagType === 'primary' && <View style={ds.radioInner} />}
                                    </View>
                                    <Text style={ds.radioLabel}>{t('medicalData.options.diagnosisTypes.Primary')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={ds.radioItem} 
                                    onPress={() => setDiagType('secondary')}
                                >
                                    <View style={[ds.radioOuter, diagType === 'secondary' && ds.radioOuterActive]}>
                                        {diagType === 'secondary' && <View style={ds.radioInner} />}
                                    </View>
                                    <Text style={ds.radioLabel}>{t('medicalData.options.diagnosisTypes.Secondary')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <FormInput {...commonProps} label={t('medicalData.notes')} hasInfo multiline placeholder={t('medicalData.diagnosisNotesPlaceholder')} />
                        <Text style={ds.charCount}>0 / 500</Text>
                    </ScrollView>
                    <View style={ds.modalFooter}>
                        <TouchableOpacity style={ds.cancelOutlineButton} onPress={() => setShowDiagModal(false)}>
                            <Text style={ds.cancelOutlineText}>{t('medicalData.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton {...commonProps} tc={tc} ds={ds} title={t('medicalData.addEntry')} />
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderAddAllergyModal = () => (
        <Modal visible={showAllergyModal} transparent animationType="fade" onRequestClose={() => setShowAllergyModal(false)}>
            <View style={ds.modalOverlay}>
                <View style={ds.modalContent}>
                    <View style={ds.modalHeader}>
                        <Text style={ds.modalTitle}>{t('medicalData.addAllergy')}</Text>
                        <TouchableOpacity onPress={() => setShowAllergyModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={ds.modalScroll} showsVerticalScrollIndicator={false}>
                        <View style={{ zIndex: 20 }}>
                            <FormInput {...commonProps} 
                                label={t('medicalData.allergyType')} required placeholder={t('medicalData.placeholderSelectType')} isDropdown 
                                value={newAllergy.type}
                                onPress={() => setShowAllergyTypeDropdown(!showAllergyTypeDropdown)}
                            />
                            {showAllergyTypeDropdown && (
                                <View style={ds.inlineDropdown}>
                                    {ALLERGY_TYPES.map((option) => (
                                        <TouchableOpacity 
                                            key={option} 
                                            style={[ds.dropdownItem, newAllergy.type === option && ds.dropdownItemActive]}
                                            onPress={() => {
                                                handleAllergyChange('type', option);
                                                setShowAllergyTypeDropdown(false);
                                            }}
                                        >
                                            <Text style={[ds.dropdownItemText, newAllergy.type === option && ds.dropdownItemTextActive]}>
                                                {t(`medicalData.options.allergyTypes.${option}`, { defaultValue: option })}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <FormInput {...commonProps} 
                            label={t('medicalData.allergenName')} placeholder={t('medicalData.placeholderAllergenName')} 
                            value={newAllergy.allergen}
                            onChangeText={(val: string) => handleAllergyChange('allergen', val)}
                        />
                        <FormInput {...commonProps} 
                            label={t('medicalData.allergicReaction')} multiline placeholder={t('medicalData.placeholderAllergicReaction')} 
                            value={newAllergy.reaction}
                            onChangeText={(val: string) => handleAllergyChange('reaction', val)}
                        />

                        <View style={{ zIndex: 10 }}>
                            <FormInput {...commonProps} 
                                label={t('medicalData.severity')} required placeholder={t('medicalData.placeholderSelectSeverity')} isDropdown 
                                value={newAllergy.severity}
                                onPress={() => setShowAllergySeverityDropdown(!showAllergySeverityDropdown)}
                            />
                            {showAllergySeverityDropdown && (
                                <View style={ds.inlineDropdown}>
                                    {SEVERITY_LEVELS.map((option) => (
                                        <TouchableOpacity 
                                            key={option} 
                                            style={[ds.dropdownItem, newAllergy.severity === option && ds.dropdownItemActive]}
                                            onPress={() => {
                                                handleAllergyChange('severity', option);
                                                setShowAllergySeverityDropdown(false);
                                            }}
                                        >
                                            <Text style={[ds.dropdownItemText, newAllergy.severity === option && ds.dropdownItemTextActive]}>
                                                {t(`medicalData.options.severityLevels.${option}`, { defaultValue: option })}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                            )}
                        </View>

                        <FormInput {...commonProps} 
                            label={t('medicalData.notes')} multiline placeholder={t('medicalData.notesPlaceholder')} 
                            value={newAllergy.notes}
                            onChangeText={(val: string) => handleAllergyChange('notes', val)}
                        />
                        <Text style={ds.charCount}>{newAllergy.notes.length} / 500</Text>
                    </ScrollView>
                    <View style={ds.modalFooter}>
                        <TouchableOpacity style={ds.cancelOutlineButton} onPress={() => setShowAllergyModal(false)}>
                            <Text style={ds.cancelOutlineText}>{t('medicalData.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton {...commonProps} tc={tc} ds={ds} title={t('medicalData.addAllergy')} onPress={() => {
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
            <View style={ds.modalOverlay}>
                <View style={ds.modalContent}>
                    <View style={ds.modalHeader}>
                        <Text style={ds.modalTitle}>{t('medicalData.addCondition')}</Text>
                        <TouchableOpacity onPress={() => setShowChronicModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={ds.modalScroll} showsVerticalScrollIndicator={false}>
                        <FormInput {...commonProps} 
                            label={t('medicalData.conditionName')} placeholder={t('medicalData.placeholderConditionName')} 
                            value={newCondition.name}
                            onChangeText={(val: string) => handleConditionChange('name', val)}
                        />
                        
                        <View style={{ zIndex: 20 }}>
                            <FormInput {...commonProps} 
                                label={t('medicalData.status')} required placeholder={t('medicalData.placeholderSelectStatus')} isDropdown 
                                value={newCondition.status}
                                onPress={() => setShowConditionStatusDropdown(!showConditionStatusDropdown)}
                            />
                            {showConditionStatusDropdown && (
                                <View style={ds.inlineDropdown}>
                                    {CONDITION_STATUSES.map((option) => (
                                        <TouchableOpacity 
                                            key={option} 
                                            style={[ds.dropdownItem, newCondition.status === option && ds.dropdownItemActive]}
                                            onPress={() => {
                                                handleConditionChange('status', option);
                                                setShowConditionStatusDropdown(false);
                                            }}
                                        >
                                            <Text style={[ds.dropdownItemText, newCondition.status === option && ds.dropdownItemTextActive]}>
                                                {t(`medicalData.options.conditionStatuses.${option}`, { defaultValue: option })}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View style={{ zIndex: 10 }}>
                            <FormInput {...commonProps} 
                                label={t('medicalData.severity')} required placeholder={t('medicalData.placeholderSelectSeverity')} isDropdown 
                                value={newCondition.severity}
                                onPress={() => setShowConditionSeverityDropdown(!showConditionSeverityDropdown)}
                            />
                            {showConditionSeverityDropdown && (
                                <View style={ds.inlineDropdown}>
                                    {SEVERITY_LEVELS.map((option) => (
                                        <TouchableOpacity 
                                            key={option} 
                                            style={[ds.dropdownItem, newCondition.severity === option && ds.dropdownItemActive]}
                                            onPress={() => {
                                                handleConditionChange('severity', option);
                                                setShowConditionSeverityDropdown(false);
                                            }}
                                        >
                                            <Text style={[ds.dropdownItemText, newCondition.severity === option && ds.dropdownItemTextActive]}>
                                                {t(`medicalData.options.severityLevels.${option}`, { defaultValue: option })}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <FormInput {...commonProps} 
                            label={t('medicalData.currentTreatment')} multiline placeholder={t('medicalData.placeholderTreatmentPlan')} 
                            value={newCondition.treatment}
                            onChangeText={(val: string) => handleConditionChange('treatment', val)}
                        />
                        <FormInput {...commonProps} 
                            label={t('medicalData.notes')} multiline placeholder={t('medicalData.notesPlaceholder')} 
                            value={newCondition.notes}
                            onChangeText={(val: string) => handleConditionChange('notes', val)}
                        />
                        <Text style={ds.charCount}>{newCondition.notes.length} / 500</Text>
                    </ScrollView>
                    <View style={ds.modalFooter}>
                        <TouchableOpacity style={ds.cancelOutlineButton} onPress={() => setShowChronicModal(false)}>
                            <Text style={ds.cancelOutlineText}>{t('medicalData.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton {...commonProps} tc={tc} ds={ds} title={t('medicalData.addEntry')} onPress={() => {
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
            <View style={ds.modalOverlay}>
                <View style={ds.modalContent}>
                    <View style={ds.modalHeader}>
                        <Text style={ds.modalTitle}>{t('medicalData.addEntry')}</Text>
                        <TouchableOpacity onPress={() => setShowFamilyModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={ds.modalScroll} showsVerticalScrollIndicator={false}>
                        <FormInput {...commonProps} 
                            label={t('medicalData.diseaseName')} required placeholder={t('medicalData.placeholderDiseaseName')} 
                            value={newFamilyHistory.diseaseName}
                            onChangeText={(val: string) => handleFamilyHistoryChange('diseaseName', val)}
                        />
                        
                        <View style={{ zIndex: 10 }}>
                            <FormInput {...commonProps} 
                                label={t('medicalData.relationship')} required placeholder={t('medicalData.placeholderSelectRelationship')} isDropdown 
                                value={newFamilyHistory.relationship}
                                onPress={() => setShowRelationshipDropdown(!showRelationshipDropdown)}
                            />
                            {showRelationshipDropdown && (
                                <View style={ds.inlineDropdown}>
                                    <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
                                        {RELATIONSHIP_OPTIONS.map((option) => (
                                            <TouchableOpacity 
                                                key={option} 
                                                style={[ds.dropdownItem, newFamilyHistory.relationship === option && ds.dropdownItemActive]}
                                                onPress={() => {
                                                    handleFamilyHistoryChange('relationship', option);
                                                    setShowRelationshipDropdown(false);
                                                }}
                                            >
                                                <Text style={[ds.dropdownItemText, newFamilyHistory.relationship === option && ds.dropdownItemTextActive]}>
                                                    {t(`medicalData.options.relationships.${option}`, { defaultValue: option })}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
 
                        <FormInput {...commonProps} 
                            label={t('medicalData.ageOfOnset')} placeholder={t('medicalData.placeholderAgeOfOnset')} 
                            value={newFamilyHistory.ageOfOnset}
                            onChangeText={(val: string) => handleFamilyHistoryChange('ageOfOnset', val)}
                        />
                        <FormInput {...commonProps} 
                            label={t('medicalData.notes')} multiline placeholder={t('medicalData.notesPlaceholder')} 
                            value={newFamilyHistory.notes}
                            onChangeText={(val: string) => handleFamilyHistoryChange('notes', val)}
                        />
                        <Text style={ds.charCount}>{newFamilyHistory.notes.length} / 500</Text>
                    </ScrollView>
                    <View style={ds.modalFooter}>
                        <TouchableOpacity style={ds.cancelOutlineButton} onPress={() => setShowFamilyModal(false)}>
                            <Text style={ds.cancelOutlineText}>{t('medicalData.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton {...commonProps} tc={tc} ds={ds} title={t('medicalData.addEntry')} onPress={() => {
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
            <View style={ds.modalOverlay}>
                <View style={ds.modalContent}>
                    <View style={ds.modalHeader}>
                        <Text style={ds.modalTitle}>{t('medicalData.addRiskFactor')}</Text>
                        <TouchableOpacity onPress={() => setShowRiskModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={ds.modalScroll} showsVerticalScrollIndicator={false}>
                        <View style={{ zIndex: 20 }}>
                            <FormInput {...commonProps} 
                                label={t('medicalData.riskCategory')} required placeholder={t('medicalData.placeholderSelectCategory')} isDropdown 
                                value={newRiskFactor.category}
                                onPress={() => setShowRiskCategoryDropdown(!showRiskCategoryDropdown)}
                            />
                            {showRiskCategoryDropdown && (
                                <View style={ds.inlineDropdown}>
                                    {RISK_CATEGORIES.map((option) => (
                                        <TouchableOpacity 
                                            key={option} 
                                            style={[ds.dropdownItem, newRiskFactor.category === option && ds.dropdownItemActive]}
                                            onPress={() => {
                                                handleRiskFactorChange('category', option);
                                                setShowRiskCategoryDropdown(false);
                                            }}
                                        >
                                            <Text style={[ds.dropdownItemText, newRiskFactor.category === option && ds.dropdownItemTextActive]}>
                                                {t(`medicalData.options.riskCategories.${option}`, { defaultValue: option })}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
 
                        <FormInput {...commonProps} 
                            label={t('medicalData.riskFactor')} required placeholder={t('medicalData.placeholderEnterRiskFactor')} 
                            value={newRiskFactor.factor}
                            onChangeText={(val: string) => handleRiskFactorChange('factor', val)}
                        />
 
                        <View style={{ zIndex: 10 }}>
                            <FormInput {...commonProps} 
                                label={t('medicalData.riskLevel')} required placeholder={t('medicalData.placeholderSelectSeverity')} isDropdown 
                                value={newRiskFactor.level}
                                onPress={() => setShowRiskLevelDropdown(!showRiskLevelDropdown)}
                            />
                            {showRiskLevelDropdown && (
                                <View style={ds.inlineDropdown}>
                                    {RISK_LEVELS.map((option) => (
                                        <TouchableOpacity 
                                            key={option} 
                                            style={[ds.dropdownItem, newRiskFactor.level === option && ds.dropdownItemActive]}
                                            onPress={() => {
                                                handleRiskFactorChange('level', option);
                                                setShowRiskLevelDropdown(false);
                                            }}
                                        >
                                            <Text style={[ds.dropdownItemText, newRiskFactor.level === option && ds.dropdownItemTextActive]}>
                                                {t(`medicalData.options.severityLevels.${option}`, { defaultValue: option })}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
 
                        <FormInput {...commonProps} 
                            label={t('medicalData.notes')} multiline placeholder={t('medicalData.notesPlaceholder')} 
                            value={newRiskFactor.notes}
                            onChangeText={(val: string) => handleRiskFactorChange('notes', val)}
                        />
                        <Text style={ds.charCount}>{newRiskFactor.notes.length} / 500</Text>
                    </ScrollView>
                    <View style={ds.modalFooter}>
                        <TouchableOpacity style={ds.cancelOutlineButton} onPress={() => setShowRiskModal(false)}>
                            <Text style={ds.cancelOutlineText}>{t('medicalData.cancel')}</Text>
                        </TouchableOpacity>
                        <SubmitButton {...commonProps} tc={tc} ds={ds} title={t('medicalData.add')} onPress={() => {
                            console.log("Adding risk factor:", newRiskFactor);
                            setShowRiskModal(false);
                        }} />
                    </View>
                </View>
            </View>
        </Modal>
    );


    const renderEmptyBox = (text: string) => (
        <View style={ds.emptyBox}>
            <Text style={ds.emptyBoxText}>{text}</Text>
        </View>
    );

    const renderListItem = (title: string, subtitle: string, subInfo: string = '', status: string = '', key?: any) => (
        <View style={ds.listItem} key={key}>
            <View style={{ flex: 1 }}>
                <Text style={ds.listItemTitle}>{title}</Text>
                <Text style={ds.listItemSubtitle}>{subtitle}</Text>
                {subInfo ? <Text style={ds.listItemSubInfo}>{subInfo}</Text> : null}
            </View>
            {status ? (
                <View style={[ds.statusTag, status === 'Active' ? ds.statusTagActive : ds.statusTagHistory]}>
                    <Text style={[ds.statusTagText, status === 'Active' ? ds.statusTagTextActive : ds.statusTagTextHistory]}>{status}</Text>
                </View>
            ) : null}
        </View>
    );

    const renderMedicationItem = (med: any, key: any, index: number, isHistory: boolean = false) => (
        <View style={ds.medicationCard} key={key}>
            <View style={ds.medicationHeader}>
                <View style={ds.medicationTitleRow}>
                    <Feather name="link" size={16} color={tc.accent} style={{ marginRight: 6, transform: [{ rotate: '45deg' }] }} />
                    <Text style={ds.medicationName}>{med.name}</Text>
                </View>
                <Text style={ds.doctorName}>{med.doctor || 'Hamad Alvi'}</Text>
            </View>
            
            <View style={ds.medicationBody}>
                <View style={ds.medicationInfoColumn}>
                    <Text style={ds.medicationDetail}>{t('medicalData.dosage')}: {med.dosage || '1 tablet daily'}</Text>
                    <View style={ds.dateRow}>
                        <Feather name="clock" size={12} color={tc.textMuted} style={{ marginRight: 4 }} />
                        <Text style={ds.medicationDetail}>{t('medicalData.from')} {formatDate(med.startDate) || '04/03/2026'}</Text>
                    </View>
                    <Text style={ds.medicationDetail}>{t('medicalData.notes')}: {med.instructions || med.notes || 'It is for headache'}</Text>
                </View>

                <View style={ds.medicationActions}>
                    {!isHistory && (
                        <TouchableOpacity style={ds.endButton} onPress={() => endMedication(index)}>
                            <Text style={ds.endButtonText}>{t('medicalData.end')}</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={ds.deleteButton} onPress={() => deleteMedication(index, isHistory)}>
                        <Feather name="x" size={16} color={tc.accentRed || (isDark ? '#ff6b6b' : '#ef4444')} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderDiagnosisItem = (diag: any, key: any, index: number, isHistory: boolean = false) => (
        <View style={ds.medicationCard} key={key}>
            <View style={ds.medicationHeader}>
                <View style={ds.medicationTitleRow}>
                    <Feather name="activity" size={16} color={tc.accent} style={{ marginRight: 6 }} />
                    <Text style={ds.medicationName}>{diag.description || diag.code} - </Text>
                    <View style={[ds.statusBadge, { backgroundColor: isDark ? (tc.accent + '25') : '#E0F2FE' }]}>
                        <Text style={[ds.statusBadgeText, { color: isDark ? tc.accent : '#0EA5E9' }]}>{t(`medicalData.options.diagnosisTypes.${diag.type || 'Primary'}`, { defaultValue: diag.type || 'Primary' })}</Text>
                    </View>
                </View>
                <Text style={ds.doctorName}>{diag.doctor || 'Hamad Alvi'}</Text>
            </View>
            
            <View style={ds.medicationBody}>
                <View style={ds.medicationInfoColumn}>
                    <View style={ds.dateRow}>
                        <Feather name="calendar" size={12} color={tc.textMuted} style={{ marginRight: 4 }} />
                        <Text style={ds.medicationDetail}>{t('medicalData.from')} {formatDate(diag.date || diag.onsetDate) || '04/03/2026'}</Text>
                    </View>
                    <Text style={ds.medicationDetail}>{t('medicalData.notes')}: {diag.notes || 'Health is fine'}</Text>
                </View>
                
                <View style={ds.medicationActions}>
                    {!isHistory && (
                        <View style={{ position: 'relative', zIndex: 50 }}>
                            <TouchableOpacity 
                                style={[ds.statusDropdownBtn, openStatusMenu?.type === 'diag' && openStatusMenu.index === index && { borderColor: tc.accent }]}
                                onPress={() => setOpenStatusMenu(openStatusMenu?.type === 'diag' && openStatusMenu.index === index ? null : { type: 'diag', index })}
                            >
                                <Text style={ds.statusDropdownBtnText}>{t(`medicalData.options.conditionStatuses.${diag.status || 'Active'}`, { defaultValue: diag.status || 'Active' })}</Text>
                                <Feather name="chevron-down" size={12} color={tc.textMuted} />
                            </TouchableOpacity>
                            
                            {openStatusMenu?.type === 'diag' && openStatusMenu.index === index && (
                                <View style={ds.statusMenuPopup}>
                                    {CONDITION_STATUSES.map((status) => (
                                        <TouchableOpacity 
                                            key={status} 
                                            style={[ds.statusOption, diag.status === status && ds.statusOptionActive]}
                                            onPress={() => updateDiagnosisStatus(index, status)}
                                        >
                                            <Text style={[ds.statusOptionText, diag.status === status && ds.statusOptionTextActive]}>
                                                {t(`medicalData.options.conditionStatuses.${status}`, { defaultValue: status })}
                                            </Text>
                                        </TouchableOpacity>

                                    ))}
                                </View>
                            )}
                        </View>
                    )}
                    <TouchableOpacity style={ds.deleteButton} onPress={() => deleteDiagnosis(index, isHistory)}>
                        <Feather name="x" size={16} color={isDark ? '#ff6b6b' : '#ef4444'} />
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );

    const renderAllergyItem = (allergy: any, key: any, index: number, isHistory: boolean = false) => (
        <View style={[ds.medicationCard, isHistory && { opacity: 0.7 }]} key={key}>
            <View style={ds.medicationHeader}>
                <View style={ds.medicationTitleRow}>
                    <Feather name="alert-circle" size={16} color={isHistory ? tc.textMuted : tc.accent} style={{ marginRight: 6 }} />
                    <Text style={[ds.medicationName, isHistory && { color: tc.textMuted }]}>{allergy.name || allergy.allergen}</Text>
                    <View style={[ds.statusBadge, { backgroundColor: isHistory ? (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9') : (isDark ? 'rgba(217, 119, 6, 0.2)' : '#FEF3C7') }]}>
                        <Text style={[ds.statusBadgeText, { color: isHistory ? tc.textMuted : (isDark ? '#fbbf24' : '#D97706') }]}>{t(`medicalData.options.severityLevels.${allergy.severity || 'Moderate'}`, { defaultValue: allergy.severity || 'Moderate' })}</Text>
                    </View>
                </View>
                <Text style={ds.doctorName}>{allergy.doctor || 'Hamad Alvi'}</Text>
            </View>
            
            <View style={ds.medicationBody}>
                <View style={ds.medicationInfoColumn}>
                    <Text style={ds.medicationDetail}>{t('medicalData.reaction')}: {allergy.reaction || 'Allergic to skin'}</Text>
                    <View style={ds.dateRow}>
                        <Feather name="calendar" size={12} color={tc.textMuted} style={{ marginRight: 4 }} />
                        <Text style={ds.medicationDetail}>{t('medicalData.diagnosed')}: {formatDate(allergy.date || allergy.diagnosedDate) || '04/03/2026'}</Text>
                    </View>
                    <Text style={ds.medicationDetail}>{t('medicalData.notes')}: {allergy.notes || 'Not too risky'}</Text>
                </View>
                
                <View style={ds.medicationActions}>
                    <TouchableOpacity style={ds.deleteButton} onPress={() => deleteAllergy(index, isHistory)}>
                        <Feather name="x" size={16} color={isDark ? '#ff6b6b' : '#ef4444'} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderChronicItem = (item: any, key: any, index: number, isHistory: boolean = false) => (
        <View style={[ds.medicationCard, isHistory && { opacity: 0.7 }]} key={key}>
            <View style={ds.medicationHeader}>
                <View style={ds.medicationTitleRow}>
                    <Feather name="heart" size={16} color={isHistory ? tc.textMuted : tc.accent} style={{ marginRight: 6 }} />
                    <Text style={[ds.medicationName, isHistory && { color: tc.textMuted }]}>{item.name || item.condition}</Text>
                    <View style={[ds.statusBadge, { backgroundColor: isHistory ? (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9') : (isDark ? (tc.accent + '25') : '#E0F2FE') }]}>
                        <Text style={[ds.statusBadgeText, { color: isHistory ? tc.textMuted : (isDark ? tc.accent : '#0EA5E9') }]}>{t(`medicalData.options.conditionStatuses.${item.status || 'Active'}`, { defaultValue: item.status || 'Active' })}</Text>
                    </View>
                </View>
                <Text style={ds.doctorName}>{item.doctor || 'Hamad Alvi'}</Text>
            </View>
            
            <View style={ds.medicationBody}>
                <View style={ds.medicationInfoColumn}>
                    <Text style={ds.medicationDetail}>{t('medicalData.treatment')}: {item.treatment || 'Needs some rest'}</Text>
                    <View style={ds.dateRow}>
                        <Feather name="calendar" size={12} color={tc.textMuted} style={{ marginRight: 4 }} />
                        <Text style={ds.medicationDetail}>{t('medicalData.diagnosed')}: {formatDate(item.date || item.diagnosedDate) || '04/03/2026'}</Text>
                    </View>
                    <Text style={ds.medicationDetail}>{t('medicalData.notes')}: {item.notes || 'Eat Fruits regularly'}</Text>
                </View>
                
                <View style={ds.medicationActions}>
                    {!isHistory && (
                        <View style={{ position: 'relative', zIndex: 50 }}>
                            <TouchableOpacity 
                                style={[ds.statusDropdownBtn, openStatusMenu?.type === 'chronic' && openStatusMenu.index === index && { borderColor: tc.accent }]}
                                onPress={() => setOpenStatusMenu(openStatusMenu?.type === 'chronic' && openStatusMenu.index === index ? null : { type: 'chronic', index })}
                            >
                                <Text style={ds.statusDropdownBtnText}>{t(`medicalData.options.conditionStatuses.${item.status || 'Active'}`, { defaultValue: item.status || 'Active' })}</Text>
                                <Feather name="chevron-down" size={12} color={tc.textMuted} />
                            </TouchableOpacity>

                            {openStatusMenu?.type === 'chronic' && openStatusMenu.index === index && (
                                <View style={ds.statusMenuPopup}>
                                    {CONDITION_STATUSES.map((status) => (
                                        <TouchableOpacity 
                                            key={status} 
                                            style={[ds.statusOption, item.status === status && ds.statusOptionActive]}
                                            onPress={() => updateChronicStatus(index, status)}
                                        >
                                            <Text style={[ds.statusOptionText, item.status === status && ds.statusOptionTextActive]}>
                                                {t(`medicalData.options.conditionStatuses.${status}`, { defaultValue: status })}
                                            </Text>
                                        </TouchableOpacity>

                                    ))}
                                </View>
                            )}
                        </View>
                    )}
                    <TouchableOpacity style={ds.deleteButton} onPress={() => deleteChronic(index, isHistory)}>
                        <Feather name="x" size={16} color={isDark ? '#ff6b6b' : '#ef4444'} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderFamilyItem = (item: any, key: any, index: number, isHistory: boolean = false) => (
        <View style={[ds.medicationCard, isHistory && { opacity: 0.7 }]} key={key}>
            <View style={ds.medicationHeader}>
                <View style={ds.medicationTitleRow}>
                    <Feather name="users" size={16} color={tc.accent} style={{ marginRight: 6 }} />
                    <Text style={[ds.medicationName, isHistory && { color: tc.textMuted }]}>{item.diseaseName || item.disease || item.name}</Text>
                </View>
            </View>
            
            <View style={ds.medicationBody}>
                <View style={ds.medicationInfoColumn}>
                    <Text style={ds.medicationDetail}>{t('medicalData.relationship')}: {item.relationship}</Text>
                    <Text style={ds.medicationDetail}>{t('medicalData.ageOfOnsetLower')}: {item.ageOfOnset || item.onsetAge || '70'}</Text>
                    <Text style={ds.medicationDetail}>{t('medicalData.notes')}: {item.notes || 'There is Sugar in the genetics'}</Text>
                </View>
                
                <View style={ds.medicationActions}>
                    <TouchableOpacity style={ds.deleteButton} onPress={() => deleteFamily(index, isHistory)}>
                        <Feather name="x" size={16} color={isDark ? '#ff6b6b' : '#ef4444'} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderRiskItem = (item: any, key: any, index: number, isHistory: boolean = false) => (
        <View style={[ds.medicationCard, isHistory && { opacity: 0.7 }]} key={key}>
            <View style={ds.medicationHeader}>
                <View style={ds.medicationTitleRow}>
                    <Feather name="alert-triangle" size={16} color={tc.accent} style={{ marginRight: 6 }} />
                    <Text style={[ds.medicationName, isHistory && { color: tc.textMuted }]}>{item.factor}</Text>
                    <View style={[ds.statusBadge, { backgroundColor: isHistory ? (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9') : (isDark ? 'rgba(217, 119, 6, 0.2)' : '#FEF3C7') }]}>
                        <Text style={[ds.statusBadgeText, { color: isHistory ? tc.textMuted : (isDark ? '#fbbf24' : '#D97706') }]}>{t(`medicalData.options.severityLevels.${item.level || 'Moderate'}`, { defaultValue: item.level || 'Moderate' })}</Text>
                    </View>
                </View>
            </View>
            
            <View style={ds.medicationBody}>
                <View style={ds.medicationInfoColumn}>
                    <Text style={ds.medicationDetail}>{t('medicalData.category')}: {item.category || 'Genetic'}</Text>
                    <Text style={ds.medicationDetail}>{t('medicalData.notes')}: {item.notes || 'A little factor'}</Text>
                </View>
                
                <View style={ds.medicationActions}>
                    <TouchableOpacity style={ds.deleteButton} onPress={() => deleteRisk(index, isHistory)}>
                        <Feather name="x" size={16} color={isDark ? '#ff6b6b' : '#ef4444'} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );


    return (

        <ScrollView style={ds.container} showsVerticalScrollIndicator={false}>
            {renderAddMedicationModal()}
            {renderAddDiagnosisModal()}
            {renderAddAllergyModal()}
            {renderAddChronicModal()}
            {renderAddFamilyModal()}
            {renderAddRiskModal()}

            <AccordionItem {...commonProps} title={t('medicalData.medicines')} icon="link">
                <View style={ds.sectionHeaderRow}>
                    <Text style={ds.subHeader}>{t('medicalData.regularMedications')}</Text>
                    <ActionOutlineButton {...commonProps} title={t('medicalData.addMedication')} icon="plus" onPress={() => setShowMedModal(true)} />
                </View>
                {medicalData?.medications?.length > 0 ? (
                    medicalData.medications.map((m: any, idx: number) => renderMedicationItem(m, `med-${idx}`, idx))
                ) : (

                    <View style={ds.emptyBox}>
                        <Text style={ds.emptyBoxText}>{t('medicalData.noRegularMedications')}</Text>
                    </View>
                )}
                
                <Text style={[ds.subHeader, { marginTop: 15 }]}>{t('medicalData.asNeededMedications')}</Text>
                {renderEmptyBox(t('medicalData.noAsNeededMedications'))}
                
                <Text style={[ds.subHeader, { marginTop: 15 }]}>{t('medicalData.medicationHistory')}</Text>
                {medicalData?.medicationHistory?.length > 0 ? (
                    medicalData.medicationHistory.map((m: any, idx: number) => renderMedicationItem(m, `med-hist-${idx}`, idx, true))
                ) : renderEmptyBox(t('medicalData.noMedicationHistory'))}
 
                
                <View style={ds.saveContainer}>
                    <SubmitButton {...commonProps} tc={tc} ds={ds} 
                        title={isSaving ? t('medicalData.saving') : t('medicalData.save')} 
                        onPress={() => handleSave('medications')} 
                    />
                </View>
            </AccordionItem>

            <AccordionItem {...commonProps} title={t('medicalData.diagnosis')} icon="activity">
                <View style={ds.sectionHeaderRow}>
                    <Text style={ds.subHeader}>{t('medicalData.activeDiagnoses')}</Text>
                    <ActionOutlineButton {...commonProps} title={t('medicalData.addDiagnosis')} icon="plus" onPress={() => setShowDiagModal(true)} />
                </View>
                {medicalData?.diagnoses?.length > 0 ? (
                    medicalData.diagnoses.map((d: any, idx: number) => renderDiagnosisItem(d, `diag-${idx}`, idx))
                ) : (
                    <View style={ds.emptyBox}>
                        <Text style={ds.emptyBoxText}>{t('medicalData.noActiveDiagnoses')}</Text>
                    </View>
                )}
                
                <Text style={[ds.subHeader, { marginTop: 15 }]}>{t('medicalData.diagnosisHistory')}</Text>
                {medicalData?.diagnosisHistory?.length > 0 ? (
                    medicalData.diagnosisHistory.map((d: any, idx: number) => renderDiagnosisItem(d, `diag-hist-${idx}`, idx, true))
                ) : renderEmptyBox(t('medicalData.noDiagnosisHistory'))}
                
                <View style={ds.saveContainer}>
                    <SubmitButton {...commonProps} tc={tc} ds={ds} 
                        title={isSaving ? t('medicalData.saving') : t('medicalData.save')} 
                        onPress={() => handleSave('diagnoses')} 
                    />
                </View>
            </AccordionItem>

            <AccordionItem {...commonProps} title={t('medicalData.allergiesAndIntolerances')} icon="alert-circle">
                <View style={ds.sectionHeaderRow}>
                    <Text style={ds.subHeader}>{t('medicalData.allergiesAndIntolerances')}</Text>
                    <ActionOutlineButton {...commonProps} title={t('medicalData.addAllergy')} icon="plus" onPress={() => setShowAllergyModal(true)} />
                </View>
                {medicalData?.allergies?.length > 0 ? (
                    medicalData.allergies.map((a: any, idx: number) => renderAllergyItem(a, `all-${idx}`, idx))
                ) : renderEmptyBox(t('medicalData.noRegisteredAllergies'))}
 
                <Text style={[ds.subHeader, { marginTop: 15 }]}>{t('medicalData.pastAllergies')}</Text>
                {medicalData?.allergyHistory?.length > 0 ? (
                    medicalData.allergyHistory.map((a: any, idx: number) => renderAllergyItem(a, `all-hist-${idx}`, idx, true))
                ) : renderEmptyBox(t('medicalData.noAllergyHistory'))}
 
                <View style={ds.saveContainer}>
                    <SubmitButton {...commonProps} tc={tc} ds={ds} 
                        title={isSaving ? t('medicalData.saving') : t('medicalData.save')} 
                        onPress={() => handleSave('allergies')} 
                    />
                </View>
            </AccordionItem>

            <AccordionItem {...commonProps} title={t('medicalData.chronicDiseases')} icon="heart">
                <View style={ds.sectionHeaderRow}>
                    <Text style={ds.subHeader}>{t('medicalData.chronicConditions')}</Text>
                    <ActionOutlineButton {...commonProps} title={t('medicalData.addCondition')} icon="plus" onPress={() => setShowChronicModal(true)} />
                </View>
                {medicalData?.chronicConditions?.length > 0 ? (
                    medicalData.chronicConditions.map((c: any, idx: number) => renderChronicItem(c, `chronic-${idx}`, idx))
                ) : renderEmptyBox(t('medicalData.noChronicConditions'))}
 
                <Text style={[ds.subHeader, { marginTop: 15 }]}>{t('medicalData.chronicDiseaseHistory')}</Text>
                {medicalData?.chronicHistory?.length > 0 ? (
                    medicalData.chronicHistory.map((c: any, idx: number) => renderChronicItem(c, `chronic-hist-${idx}`, idx, true))
                ) : renderEmptyBox(t('medicalData.noChronicConditionHistory'))}
 
                <View style={ds.saveContainer}>
                    <SubmitButton {...commonProps} tc={tc} ds={ds} 
                        title={isSaving ? t('medicalData.saving') : t('medicalData.save')} 
                        onPress={() => handleSave('chronic')} 
                    />
                </View>
            </AccordionItem>
            
            <AccordionItem {...commonProps} title={t('medicalData.familyInterview')} icon="users">
                <View style={ds.sectionHeaderRow}>
                    <Text style={ds.subHeader}>{t('medicalData.familyHistory')}</Text>
                    <ActionOutlineButton {...commonProps} title={t('medicalData.addEntry')} icon="plus" onPress={() => setShowFamilyModal(true)} />
                </View>
                {medicalData?.familyHistory?.length > 0 ? (
                    medicalData.familyHistory.map((f: any, idx: number) => renderFamilyItem(f, `family-${idx}`, idx))
                ) : renderEmptyBox(t('medicalData.noFamilyHistoryEntries'))}
 
                <Text style={[ds.subHeader, { marginTop: 15 }]}>{t('medicalData.pastFamilyHistory')}</Text>
                {medicalData?.familyHistoryPast?.length > 0 ? (
                    medicalData.familyHistoryPast.map((f: any, idx: number) => renderFamilyItem(f, `family-past-${idx}`, idx, true))
                ) : renderEmptyBox(t('medicalData.noHistoricalEntries'))}
 
                <View style={ds.saveContainer}>
                    <SubmitButton {...commonProps} tc={tc} ds={ds} 
                        title={isSaving ? t('medicalData.saving') : t('medicalData.save')} 
                        onPress={() => handleSave('family')} 
                    />
                </View>
            </AccordionItem>

            <AccordionItem {...commonProps} title={t('medicalData.riskFactors')} icon="alert-triangle">
                <View style={ds.sectionHeaderRow}>
                    <Text style={ds.subHeader}>{t('medicalData.riskFactors')}</Text>
                    <ActionOutlineButton {...commonProps} title={t('medicalData.addRiskFactor')} icon="plus" onPress={() => setShowRiskModal(true)} />
                </View>
                {medicalData?.riskFactors?.length > 0 ? (
                    medicalData.riskFactors.map((r: any, idx: number) => renderRiskItem(r, `risk-${idx}`, idx))
                ) : renderEmptyBox(t('medicalData.noRiskFactorsRecorded'))}
 
                <Text style={[ds.subHeader, { marginTop: 15 }]}>{t('medicalData.riskFactorHistory')}</Text>
                {medicalData?.riskHistory?.length > 0 ? (
                    medicalData.riskHistory.map((r: any, idx: number) => renderRiskItem(r, `risk-hist-${idx}`, idx, true))
                ) : renderEmptyBox(t('medicalData.noRiskHistory'))}
 
                <View style={ds.saveContainer}>
                    <SubmitButton {...commonProps} tc={tc} ds={ds} 
                        title={isSaving ? t('medicalData.saving') : t('medicalData.save')} 
                        onPress={() => handleSave('risk')} 
                    />
                </View>
            </AccordionItem>



        </ScrollView>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: { paddingHorizontal: 16 },
    accordionContainer: { 
        backgroundColor: tc.cardBackground, 
        borderRadius: 12, 
        marginBottom: 12, 
        borderWidth: 1, 
        borderColor: tc.borderColor, 
        overflow: 'hidden',
        // Elevation/Shadow for premium feel
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    expandedHeader: { borderBottomWidth: 1, borderBottomColor: tc.borderColor },
    headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconContainer: { 
        width: 32, 
        height: 32, 
        borderRadius: 8, 
        backgroundColor:  tc.accentLight, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: 12 
    },
    accordionTitle: { fontSize: 16, fontWeight: '700', color: tc.textPrimary },
    accordionContent: { padding: 16, backgroundColor: tc.cardBackground },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    subHeader: { fontSize: 13, fontWeight: '600', color: tc.textSecondary, marginBottom: 10 },
    emptyBox: { 
        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : tc.cardBackgroundAlt || '#F8FAFC', 
        borderRadius: 10, 
        padding: 16, 
        alignItems: 'center', 
        borderStyle: 'dashed', 
        borderWidth: 1, 
        borderColor: tc.borderColor, 
        marginBottom: 16 
    },
    emptyBoxText: { color: tc.textMuted, fontSize: 13 },
    saveContainer: { alignItems: 'flex-end', marginTop: 10 },
    outlineButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: tc.accent, 
        borderRadius: 8, 
        paddingVertical: 6, 
        paddingHorizontal: 12 
    },
    outlineButtonText: { fontSize: 12, fontWeight: '600', color: tc.accent, marginLeft: 6 },
    submitButtonContainer: { 
        height: 44, 
        width: 130, 
        borderRadius: 10, 
        overflow: 'hidden' 
    },
    gradientButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    submitButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { 
        backgroundColor: tc.modalBg, 
        borderRadius: 12, 
        width: '100%', 
        maxHeight: '80%', 
        padding: 20,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderColor,
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: '700', color: tc.textPrimary },
    modalScroll: { marginBottom: 20 },
    inputGroup: { marginBottom: 15 },
    labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    requiredStar: { color: tc.accentRed || '#ef4444', fontSize: 14 },
    inputLabel: { fontSize: 13, color: tc.textSecondary, fontWeight: '500' },
    inputWrapper: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: tc.borderColor, 
        borderRadius: 8, 
        paddingHorizontal: 12, 
        height: 44,
        backgroundColor: tc.inputBackground,
    },
    textInput: { flex: 1, fontSize: 14, color: tc.textPrimary, padding: 0 },
    textAreaWrapper: { height: 100, alignItems: 'flex-start', paddingTop: 12 },
    textArea: { textAlignVertical: 'top' },
    unitText: { marginLeft: 8, color: tc.textMuted, fontSize: 14 },
    row: { flexDirection: 'row' },
    modalFooter: { 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        gap: 12, 
        borderTopWidth: 1, 
        borderTopColor: tc.borderColor, 
        paddingTop: 15 
    },
    cancelOutlineButton: { 
        height: 40, 
        paddingHorizontal: 20, 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: tc.borderColor, 
        backgroundColor: isDark ? tc.buttonMutedBg : tc.canvas,
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    cancelOutlineText: { color: tc.textSecondary, fontSize: 14, fontWeight: '600' },
    checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    checkboxLabel: { marginLeft: 10, fontSize: 13, color: tc.textSecondary },
    radioGroup: { marginBottom: 15 },
    radioRow: { flexDirection: 'row', marginTop: 10 },
    radioItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
    radioOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: tc.borderColor, justifyContent: 'center', alignItems: 'center' },
    radioOuterActive: { borderColor: tc.accent },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: tc.accent },
    radioLabel: { marginLeft: 10, fontSize: 13, color: tc.textSecondary },
    charCount: { alignSelf: 'flex-end', fontSize: 11, color: tc.textMuted, marginTop: -10, marginBottom: 10 },
    listItem: { 
        backgroundColor: tc.cardBackground, 
        borderBottomWidth: 1, 
        borderBottomColor: tc.borderColor, 
        paddingVertical: 12, 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    listItemTitle: { fontSize: 14, fontWeight: '700', color: tc.textPrimary },
    listItemSubtitle: { fontSize: 13, color: tc.textSecondary, marginTop: 2 },
    listItemSubInfo: { fontSize: 12, color: tc.textMuted, marginTop: 2, fontStyle: 'italic' },
    statusTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
    statusTagActive: { backgroundColor: tc.success + '20' || 'rgba(34, 197, 94, 0.2)' },
    statusTagHistory: { backgroundColor: isDark ? 'rgba(100, 116, 139, 0.2)' : '#f1f5f9' },
    statusTagText: { fontSize: 11, fontWeight: '600' },
    statusTagTextActive: { color: tc.success || '#22c55e' },
    statusTagTextHistory: { color: tc.textSecondary },
    inlineDropdown: {
        backgroundColor: tc.cardBackgroundAlt || (isDark ? tc.modalBg : '#ffffff'),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: tc.borderColor,
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
        borderBottomColor: tc.borderColor,
    },
    dropdownItemActive: {
        backgroundColor: tc.accentLight || (isDark ? 'rgba(255,255,255,0.05)' : '#f0f9f8'),
    },
    dropdownItemText: {
        fontSize: 13,
        color: tc.textPrimary,
        fontWeight: '500',
    },
    dropdownItemTextActive: {
        color: tc.accent,
        fontWeight: '700',
    },
    datePickerContainer: {
        backgroundColor: tc.cardBackgroundAlt || (isDark ? tc.inputBackground : '#f8fafc'),
        borderRadius: 12,
        borderWidth: 1,
        borderColor: tc.borderColor,
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
        borderBottomColor: tc.borderColor,
        backgroundColor: tc.cardBackground,
    },
    datePickerDone: {
        fontSize: 14,
        fontWeight: '700',
        color: tc.accent,
    },
    medicationCard: {
        backgroundColor: tc.cardBackgroundAlt || tc.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: tc.borderColor,
        // Elevation for depth
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.2 : 0.03,
        shadowRadius: 2,
        elevation: 2,
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
        color: tc.textPrimary,
    },
    doctorName: {
        fontSize: 12,
        color: tc.textMuted,
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
        color: tc.textSecondary,
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
        borderColor: tc.accent,
    },
    endButtonText: {
        fontSize: 13,
        color: tc.accent,
        fontWeight: '600',
    },
    deleteButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: tc.accentRed || '#ef4444',
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
        flexDirection: 'row',
        alignItems: 'center',
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
        borderRadius: 8,
        borderWidth: 1,
        borderColor: tc.borderColor,
        marginRight: 4,
        backgroundColor: tc.inputBackground,
    },
    statusDropdownBtnText: {
        fontSize: 13,
        color: tc.textSecondary,
        marginRight: 6,
        fontWeight: '500',
    },
    statusMenuPopup: {
        position: 'absolute',
        top: 40,
        right: 0,
        backgroundColor: tc.cardBackgroundAlt || tc.modalBg,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: tc.borderColor,
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
        borderBottomColor: tc.borderColor,
    },
    statusOptionActive: {
        backgroundColor: tc.accentLight || 'rgba(255,255,255,0.05)',
    },
    statusOptionText: {
        fontSize: 13,
        color: tc.textPrimary,
        fontWeight: '600',
    },
    statusOptionTextActive: {
        color: tc.accent,
    },
});





export default MedicalData;
