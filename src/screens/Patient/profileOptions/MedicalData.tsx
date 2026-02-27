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
    Switch
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FormInput = ({ label, placeholder, required = false, isDropdown = false, unit = '', hasInfo = false, multiline = false }: any) => (
    <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
            {required && <Text style={styles.requiredStar}>* </Text>}
            <Text style={styles.inputLabel}>{label}</Text>
            {hasInfo && <Feather name="help-circle" size={14} color="#94a3b8" style={{ marginLeft: 4 }} />}
        </View>
        <View style={[styles.inputWrapper, multiline && styles.textAreaWrapper]}>
            <TextInput 
                style={[styles.textInput, multiline && styles.textArea]}
                placeholder={placeholder}
                placeholderTextColor="#cbd5e1"
                editable={!isDropdown}
                multiline={multiline}
            />
            {unit ? <Text style={styles.unitText}>{unit}</Text> : null}
            {isDropdown && <Feather name="chevron-down" size={16} color="#cbd5e1" />}
            {isDropdown && <Feather name="calendar" size={16} color="#cbd5e1" style={{ position: 'absolute', right: 12 }} />}
        </View>
    </View>
);

const SubmitButton = ({ title, color = ['#68BFB4', '#4DA1C0'], onPress }: any) => (
    <TouchableOpacity style={styles.submitButtonContainer} onPress={onPress}>
        <LinearGradient
            colors={color}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
        >
            <Text style={styles.submitButtonText}>{title}</Text>
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

const MedicalData = ({ patientData }: { patientData: any }) => {
    const [showMedModal, setShowMedModal] = useState(false);
    const [showDiagModal, setShowDiagModal] = useState(false);
    const [showAllergyModal, setShowAllergyModal] = useState(false);
    const [showChronicModal, setShowChronicModal] = useState(false);
    const [showFamilyModal, setShowFamilyModal] = useState(false);
    const [showRiskModal, setShowRiskModal] = useState(false);
    
    const [isRegularMed, setIsRegularMed] = useState(true);
    const [diagType, setDiagType] = useState('primary');

    const renderAddMedicationModal = () => (
        <Modal visible={showMedModal} transparent animationType="fade" onRequestClose={() => setShowMedModal(false)}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add Medication</Text>
                        <TouchableOpacity onPress={() => setShowMedModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll}>
                        <FormInput label="Medication Name" required placeholder="" />
                        <FormInput label="Common Name (Generic)" placeholder="" />
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}><FormInput label="Form" placeholder="Tablet" isDropdown /></View>
                            <View style={{ flex: 1 }}><FormInput label="Dose" placeholder="" unit="mg" /></View>
                        </View>
                        <FormInput label="Dosage Instructions" required placeholder="e.g. 1 tablet twice daily" />
                        <FormInput label="Start Date" placeholder="2026/02/26" isDropdown />
                        <FormInput label="Notes" multiline placeholder="Add any additional notes about this medication..." />
                        
                        <View style={styles.checkboxRow}>
                            <Switch 
                                value={isRegularMed} 
                                onValueChange={setIsRegularMed}
                                trackColor={{ false: '#e2e8f0', true: '#58a6b8' }}
                            />
                            <Text style={styles.checkboxLabel}>Regular medication (taken on schedule)</Text>
                        </View>
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelOutlineButton} onPress={() => setShowMedModal(false)}>
                            <Text style={styles.cancelOutlineText}>Cancel</Text>
                        </TouchableOpacity>
                        <SubmitButton title="Add" />
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
                        <Text style={styles.modalTitle}>Add Diagnosis</Text>
                        <TouchableOpacity onPress={() => setShowDiagModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll}>
                        <FormInput label="Description" hasInfo placeholder="" />
                        <FormInput label="Code" required hasInfo placeholder="e.g. F32.1" />
                        
                        <View style={styles.radioGroup}>
                            <View style={styles.labelRow}>
                                <Text style={styles.requiredStar}>* </Text>
                                <Text style={styles.inputLabel}>Diagnosis Type</Text>
                                <Feather name="help-circle" size={14} color="#94a3b8" style={{ marginLeft: 4 }} />
                            </View>
                            <View style={styles.radioRow}>
                                <TouchableOpacity style={styles.radioItem} onPress={() => setDiagType('primary')}>
                                    <View style={[styles.radioOuter, diagType === 'primary' && styles.radioOuterActive]}>
                                        {diagType === 'primary' && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={styles.radioLabel}>Primary diagnosis</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.radioItem} onPress={() => setDiagType('secondary')}>
                                    <View style={[styles.radioOuter, diagType === 'secondary' && styles.radioOuterActive]}>
                                        {diagType === 'secondary' && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={styles.radioLabel}>Secondary diagnosis</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <FormInput label="Notes" hasInfo multiline placeholder="Add any additional notes about this diagnosis..." />
                        <Text style={styles.charCount}>0 / 500</Text>
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelOutlineButton} onPress={() => setShowDiagModal(false)}>
                            <Text style={styles.cancelOutlineText}>Cancel</Text>
                        </TouchableOpacity>
                        <SubmitButton title="Add" />
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
                        <Text style={styles.modalTitle}>Add Allergy</Text>
                        <TouchableOpacity onPress={() => setShowAllergyModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll}>
                        <FormInput label="Allergy Type" required placeholder="Drug" isDropdown />
                        <FormInput label="Allergen Name" placeholder="Enter allergen name..." />
                        <FormInput label="Allergic Reaction" multiline placeholder="Describe allergic reaction..." />
                        <FormInput label="Severity" required placeholder="Moderate" isDropdown />
                        <FormInput label="Notes" multiline placeholder="Additional notes..." />
                        <Text style={styles.charCount}>0 / 500</Text>
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelOutlineButton} onPress={() => setShowAllergyModal(false)}>
                            <Text style={styles.cancelOutlineText}>Cancel</Text>
                        </TouchableOpacity>
                        <SubmitButton title="Add Allergy" />
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
                        <Text style={styles.modalTitle}>Add Chronic Condition</Text>
                        <TouchableOpacity onPress={() => setShowChronicModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll}>
                        <FormInput label="Condition Name" placeholder="Enter the name of the condition..." />
                        <FormInput label="Status" required placeholder="Active" isDropdown />
                        <FormInput label="Severity" required placeholder="Moderate" isDropdown />
                        <FormInput label="Current Treatment" multiline placeholder="Describe the current treatment plan..." />
                        <FormInput label="Notes" multiline placeholder="Add any additional notes about this condition..." />
                        <Text style={styles.charCount}>0 / 500</Text>
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelOutlineButton} onPress={() => setShowChronicModal(false)}>
                            <Text style={styles.cancelOutlineText}>Cancel</Text>
                        </TouchableOpacity>
                        <SubmitButton title="Add Condition" />
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
                        <Text style={styles.modalTitle}>Add Family History</Text>
                        <TouchableOpacity onPress={() => setShowFamilyModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll}>
                        <FormInput label="Disease Name" required placeholder="e.g. Depression" />
                        <FormInput label="Relationship" required placeholder="Select relationship" isDropdown />
                        <FormInput label="Age of onset" placeholder="e.g. 45 years" />
                        <FormInput label="Notes" multiline placeholder="Additional notes..." />
                        <Text style={styles.charCount}>0 / 500</Text>
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelOutlineButton} onPress={() => setShowFamilyModal(false)}>
                            <Text style={styles.cancelOutlineText}>Cancel</Text>
                        </TouchableOpacity>
                        <SubmitButton title="Add Entry" />
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
                        <Text style={styles.modalTitle}>Add Risk Factor</Text>
                        <TouchableOpacity onPress={() => setShowRiskModal(false)}><Feather name="x" size={20} color="#94a3b8" /></TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScroll}>
                        <FormInput label="Risk Category" required placeholder="" isDropdown />
                        <FormInput label="Risk Factor" required placeholder="Enter or select risk factor..." />
                        <FormInput label="Risk Level" required placeholder="Moderate" isDropdown />
                        <FormInput label="Notes" multiline placeholder="Add any additional notes about this risk factor..." />
                        <Text style={styles.charCount}>0 / 500</Text>
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelOutlineButton} onPress={() => setShowRiskModal(false)}>
                            <Text style={styles.cancelOutlineText}>Cancel</Text>
                        </TouchableOpacity>
                        <SubmitButton title="Add" />
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

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {renderAddMedicationModal()}
            {renderAddDiagnosisModal()}
            {renderAddAllergyModal()}
            {renderAddChronicModal()}
            {renderAddFamilyModal()}
            {renderAddRiskModal()}

            <AccordionItem title="Medicines" icon="activity">
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.subHeader}>Regular Medications</Text>
                    <ActionOutlineButton title="Add Medication" icon="plus" onPress={() => setShowMedModal(true)} />
                </View>
                {renderEmptyBox("No regular medications")}
                
                <Text style={styles.subHeader}>As Needed (PRN) Medications</Text>
                {renderEmptyBox("No as-needed medications")}
                
                <Text style={styles.subHeader}>Medication History</Text>
                {renderEmptyBox("No medication history")}
                
                <View style={styles.saveContainer}><SubmitButton title="Save" /></View>
            </AccordionItem>

            <AccordionItem title="Diagnosis" icon="zap">
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.subHeader}>Active Diagnoses</Text>
                    <ActionOutlineButton title="Add Diagnosis" icon="plus" onPress={() => setShowDiagModal(true)} />
                </View>
                {renderEmptyBox("No active diagnoses")}
                
                <Text style={styles.subHeader}>Diagnosis History</Text>
                {renderEmptyBox("No diagnosis history")}
                
                <View style={styles.saveContainer}><SubmitButton title="Save" /></View>
            </AccordionItem>

            <AccordionItem title="Allergies and intolerances" icon="alert-circle">
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.subHeader}>Allergies and Intolerances</Text>
                    <ActionOutlineButton title="Add Allergy" icon="plus" onPress={() => setShowAllergyModal(true)} />
                </View>
                {renderEmptyBox("No registered allergies")}
                
                <View style={styles.saveContainer}><SubmitButton title="Save" /></View>
            </AccordionItem>

            <AccordionItem title="Chronic diseases" icon="heart">
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.subHeader}>Chronic Conditions</Text>
                    <ActionOutlineButton title="Add Condition" icon="plus" onPress={() => setShowChronicModal(true)} />
                </View>
                {renderEmptyBox("No chronic conditions")}
                
                <View style={styles.saveContainer}><SubmitButton title="Save" /></View>
            </AccordionItem>
            <AccordionItem title="Family interview" icon="users">
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.subHeader}>Family History</Text>
                    <ActionOutlineButton title="Add Entry" icon="plus" onPress={() => setShowFamilyModal(true)} />
                </View>
                {renderEmptyBox("No family history entries")}
                
                <View style={styles.saveContainer}><SubmitButton title="Save" /></View>
            </AccordionItem>
            <AccordionItem title="Risk factors" icon="alert-triangle">
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.subHeader}>Risk Factors</Text>
                    <ActionOutlineButton title="Add Risk Factor" icon="plus" onPress={() => setShowRiskModal(true)} />
                </View>
                {renderEmptyBox("No risk factors recorded")}
                
                <View style={styles.saveContainer}><SubmitButton title="Save" /></View>
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
    submitButtonContainer: { height: 36, width: 80, borderRadius: 8, overflow: 'hidden' },
    gradientButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
    charCount: { alignSelf: 'flex-end', fontSize: 11, color: '#94a3b8', marginTop: -10, marginBottom: 10 }
});

export default MedicalData;
