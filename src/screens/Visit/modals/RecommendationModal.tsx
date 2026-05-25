import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Platform,
    Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { SearchMedicines } from '../../../Services/Visit.Service';

interface MedicationEntry {
    medication: { id: string; name: string; commonDosage?: string };
    instructions: string;
    duration?: string;
    reminders?: { enabled: boolean; times: string[] };
}

interface ScaleEntry {
    scale: string;
    frequencyDays: number;
    startDate: string;
    reminderEnabled: boolean;
}

interface RecommendationModalProps {
    visible: boolean;
    onClose: () => void;
    onSave?: (recommendations: any) => void;
    visitData?: any;
    initialRecommendations?: any;
}

const PSYCH_SCALES = {
    depression: [
        { id: 'PHQ-9', name: 'PHQ-9', description: 'Patient Health Questionnaire for depression screening' },
        { id: 'BDI-II', name: 'BDI-II', description: 'Beck Depression Inventory' },
        { id: 'CES-D', name: 'CES-D', description: 'Center for Epidemiological Studies Depression Scale' },
    ],
    anxiety: [
        { id: 'GAD-7', name: 'GAD-7', description: 'Generalized Anxiety Disorder scale' },
        { id: 'BAI', name: 'BAI', description: 'Beck Anxiety Inventory' },
        { id: 'HADS', name: 'HADS', description: 'Hospital Anxiety and Depression Scale' },
    ],
    mentalHealth: [
        { id: 'WHO-5', name: 'WHO-5', description: 'WHO Well-Being Index' },
        { id: 'SF-12', name: 'SF-12', description: 'Health-related quality of life' },
        { id: 'CORE-OM', name: 'CORE-OM', description: 'Clinical Outcomes in Routine Evaluation' },
    ],
    ptsd: [
        { id: 'PCL-5', name: 'PCL-5', description: 'PTSD Checklist' },
        { id: 'IES-R', name: 'IES-R', description: 'Impact of Event Scale-Revised' },
    ],
    addictions: [
        { id: 'AUDIT', name: 'AUDIT', description: 'Alcohol Use Disorders Identification Test' },
        { id: 'DUDIT', name: 'DUDIT', description: 'Drug Use Disorders Identification Test' },
        { id: 'SCOFF', name: 'SCOFF', description: 'Eating Disorder Screening' },
    ],
    sleep: [
        { id: 'PSQI', name: 'PSQI', description: 'Pittsburgh Sleep Quality Index' },
        { id: 'ISI', name: 'ISI', description: 'Insomnia Severity Index' },
    ],
};

const RecommendationModal = ({ visible, onClose, onSave, visitData, initialRecommendations }: RecommendationModalProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const insets = useSafeAreaInsets();

    // Medication state
    const [medications, setMedications] = useState<MedicationEntry[]>(
        initialRecommendations?.medications || []
    );
    const [medSearchQuery, setMedSearchQuery] = useState('');
    const [medSearchResults, setMedSearchResults] = useState<any[]>([]);
    const [showMedResults, setShowMedResults] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState<any>(null);

    // Scales state
    const [scales, setScales] = useState<ScaleEntry[]>(
        initialRecommendations?.scales || []
    );
    const [scaleFrequencyPicker, setScaleFrequencyPicker] = useState<string | null>(null);
    const [scaleDatePicker, setScaleDatePicker] = useState<string | null>(null);

    // AI features state
    const [aiEnabled, setAiEnabled] = useState(
        initialRecommendations?.aiAssistance?.enabled ?? true
    );
    const [selectedAiTools, setSelectedAiTools] = useState<string[]>(() => {
        const features = initialRecommendations?.aiAssistance?.features || {};
        const selected: string[] = [];
        if (features.moodTracking) selected.push('mood');
        if (features.medicationReminders) selected.push('meds');
        if (features.crisisIntervention) selected.push('crisis');
        if (features.copingStrategies) selected.push('coping');
        if (selected.length === 0) return ['mood', 'meds', 'crisis', 'coping'];
        return selected;
    });

    const [shareEmergency, setShareEmergency] = useState(
        initialRecommendations?.emergencyContacts ?? true
    );

    useEffect(() => {
        if (initialRecommendations) {
            setMedications(initialRecommendations.medications || []);
            setScales(initialRecommendations.scales || []);
            setAiEnabled(initialRecommendations.aiAssistance?.enabled ?? true);
            setShareEmergency(initialRecommendations.emergencyContacts ?? true);
            const features = initialRecommendations.aiAssistance?.features || {};
            const selected: string[] = [];
            if (features.moodTracking) selected.push('mood');
            if (features.medicationReminders) selected.push('meds');
            if (features.crisisIntervention) selected.push('crisis');
            if (features.copingStrategies) selected.push('coping');
            if (selected.length > 0) setSelectedAiTools(selected);
        }
    }, [initialRecommendations]);

    const handleMedSearch = (query: string) => {
        setMedSearchQuery(query);
        if (searchTimeout) clearTimeout(searchTimeout);
        
        if (query.length < 2) {
            setMedSearchResults([]);
            setShowMedResults(false);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const result = await SearchMedicines(query, 10);
                const medicines = result?.data || result || [];
                setMedSearchResults(Array.isArray(medicines) ? medicines : []);
                setShowMedResults(true);
            } catch (error) {
                console.error('Medicine search error:', error);
                setMedSearchResults([]);
            }
        }, 400);
        setSearchTimeout(timeout);
    };

    const addMedication = (med: any) => {
        setMedications(prev => [
            ...prev,
            {
                medication: {
                    id: med.id || med._id || Date.now().toString(),
                    name: med.name || med.productName,
                    commonDosage: med.commonDosage || med.dosage || '',
                },
                instructions: '',
                reminders: { enabled: true, times: ['09:00'] },
            }
        ]);
        setMedSearchQuery('');
        setShowMedResults(false);
    };

    const removeMedication = (index: number) => {
        setMedications(prev => prev.filter((_, i) => i !== index));
    };

    const updateMedicationInstructions = (index: number, instructions: string) => {
        setMedications(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], instructions };
            return updated;
        });
    };

    const toggleMedicationReminder = (index: number) => {
        setMedications(prev => {
            const updated = [...prev];
            const current = updated[index];
            updated[index] = {
                ...current,
                reminders: {
                    enabled: !current.reminders?.enabled,
                    times: current.reminders?.times || ['09:00'],
                }
            };
            return updated;
        });
    };

    const addScale = (scaleId: string) => {
        if (scales.find(s => s.scale === scaleId)) return;
        setScales(prev => [
            ...prev,
            {
                scale: scaleId,
                frequencyDays: 7,
                startDate: new Date().toISOString().split('T')[0],
                reminderEnabled: true,
            }
        ]);
    };

    const removeScale = (scaleId: string) => {
        setScales(prev => prev.filter(s => s.scale !== scaleId));
    };

    const updateScaleFrequency = (scaleId: string, days: number) => {
        setScales(prev => prev.map(s => 
            s.scale === scaleId ? { ...s, frequencyDays: days } : s
        ));
    };

    const updateScaleDate = (scaleId: string, date: Date) => {
        setScales(prev => prev.map(s =>
            s.scale === scaleId ? { ...s, startDate: date.toISOString().split('T')[0] } : s
        ));
    };

    const toggleAiTool = (id: string) => {
        setSelectedAiTools(prev => 
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        const recommendations = {
            medications,
            scales,
            aiAssistance: {
                enabled: aiEnabled,
                features: {
                    moodTracking: selectedAiTools.includes('mood'),
                    medicationReminders: selectedAiTools.includes('meds'),
                    crisisIntervention: selectedAiTools.includes('crisis'),
                    copingStrategies: selectedAiTools.includes('coping'),
                },
            },
            emergencyContacts: shareEmergency,
        };

        if (onSave) {
            onSave(recommendations);
        }
        onClose();
    };

    const renderScaleCategory = (categoryKey: string, categoryLabel: string, scalesList: typeof PSYCH_SCALES.depression) => (
        <View key={categoryKey}>
            <Text style={ds.subHeading}>{categoryLabel}</Text>
            <View style={ds.assessmentGrid}>
                {scalesList.map(scale => {
                    const existing = scales.find(s => s.scale === scale.id);
                    return (
                        <View key={scale.id} style={[ds.assessmentCard, existing && ds.assessmentCardActive]}>
                            <View style={ds.assessmentHeader}>
                                <Text style={ds.assessmentTitle}>{scale.name}</Text>
                                <Feather name="info" size={14} color={tc.textMuted} />
                            </View>
                            {existing ? (
                                <View>
                                    <View style={ds.scaleConfigRow}>
                                        <Text style={ds.scaleConfigLabel}>
                                            {t('visit.recommendations.every')}
                                        </Text>
                                        <TextInput
                                            style={ds.scaleFrequencyInput}
                                            value={String(existing.frequencyDays)}
                                            onChangeText={(text) => {
                                                const num = parseInt(text) || 1;
                                                updateScaleFrequency(scale.id, num);
                                            }}
                                            keyboardType="number-pad"
                                        />
                                        <Text style={ds.scaleConfigLabel}>
                                            {t('visit.recommendations.days')}
                                        </Text>
                                    </View>
                                    <TouchableOpacity 
                                        style={ds.removeMonitoringBtn}
                                        onPress={() => removeScale(scale.id)}
                                    >
                                        <Feather name="x" size={12} color="#EF4444" />
                                        <Text style={ds.removeMonitoringText}>{t('visit.recommendations.remove')}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity 
                                    style={ds.addMonitoringBtn}
                                    onPress={() => addScale(scale.id)}
                                >
                                    <Feather name="plus" size={14} color="#58A7B3" />
                                    <Text style={ds.addMonitoringText}>{t('visit.recommendations.add_to_monitoring')}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );

    const AiAssistantTool = ({ id, title, description }: any) => {
        const isSelected = selectedAiTools.includes(id);
        return (
            <TouchableOpacity 
                style={ds.aiToolCard}
                onPress={() => toggleAiTool(id)}
                activeOpacity={0.7}
            >
                <View style={ds.aiToolContent}>
                    <View style={ds.aiToolIconContainer}>
                        {id === 'mood' ? (
                            <MaterialCommunityIcons name="brain" size={20} color="#58A7B3" />
                        ) : id === 'meds' ? (
                            <Feather name="bell" size={20} color="#58A7B3" />
                        ) : id === 'crisis' ? (
                            <Feather name="shield" size={20} color="#58A7B3" />
                        ) : (
                            <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#58A7B3" />
                        )}
                    </View>
                    <View style={ds.aiToolTextContainer}>
                        <Text style={ds.aiToolTitle}>{title}</Text>
                        <Text style={ds.aiToolDescription}>{description}</Text>
                    </View>
                </View>
                <View style={[ds.customCheckbox, isSelected && ds.customCheckboxChecked]}>
                    {isSelected && <Feather name="check" size={12} color="#fff" />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={ds.modalOverlay}>
                <View style={[ds.modalContent, { marginTop: insets.top + 20, marginBottom: insets.bottom + 20 }]}>
                    {/* Header */}
                    <View style={ds.header}>
                        <Text style={ds.headerTitle}>{t('visit.recommendations.modal_title')}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color={tc.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={ds.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={ds.innerHeader}>
                            <MaterialCommunityIcons name="brain" size={24} color="#58A7B3" />
                            <Text style={ds.innerHeaderTitle}>{t('visit.recommendations.modal_title')}</Text>
                        </View>

                        {/* Medication Schedule */}
                        <View style={ds.section}>
                            <View style={ds.sectionHeaderRow}>
                                <Text style={ds.sectionLabel}>{t('visit.recommendations.medication_schedule')}</Text>
                            </View>
                            <View style={ds.medSearchContainer}>
                                <Feather name="search" size={16} color={tc.textMuted} />
                                <TextInput 
                                    style={ds.medSearchInput}
                                    placeholder={t('visit.recommendations.search_medication')}
                                    placeholderTextColor={tc.textMuted}
                                    value={medSearchQuery}
                                    onChangeText={handleMedSearch}
                                />
                            </View>

                            {showMedResults && medSearchResults.length > 0 && (
                                <View style={ds.medSearchResultsContainer}>
                                    {medSearchResults.map((med: any, index: number) => (
                                        <TouchableOpacity
                                            key={med.id || med._id || index}
                                            style={ds.medSearchResult}
                                            onPress={() => addMedication(med)}
                                        >
                                            <Text style={ds.medSearchResultName}>
                                                {med.name || med.productName}
                                            </Text>
                                            {(med.commonDosage || med.dosage) && (
                                                <Text style={ds.medSearchResultDosage}>
                                                    {med.commonDosage || med.dosage}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {medications.length > 0 && (
                                <View style={ds.medicationsList}>
                                    {medications.map((med, index) => (
                                        <View key={`${med.medication.id}-${index}`} style={ds.medEntryCard}>
                                            <View style={ds.medEntryHeader}>
                                                <View style={ds.medEntryInfo}>
                                                    <MaterialCommunityIcons name="pill" size={18} color="#58A7B3" />
                                                    <View style={ds.medEntryTexts}>
                                                        <Text style={ds.medEntryName}>{med.medication.name}</Text>
                                                        {med.medication.commonDosage && (
                                                            <Text style={ds.medEntryDosage}>{med.medication.commonDosage}</Text>
                                                        )}
                                                    </View>
                                                </View>
                                                <TouchableOpacity onPress={() => removeMedication(index)}>
                                                    <Feather name="trash-2" size={16} color="#EF4444" />
                                                </TouchableOpacity>
                                            </View>
                                            <TextInput
                                                style={ds.medInstructionsInput}
                                                placeholder={t('visit.recommendations.instructions_placeholder')}
                                                placeholderTextColor={tc.textMuted}
                                                value={med.instructions}
                                                onChangeText={(text) => updateMedicationInstructions(index, text)}
                                            />
                                            <TouchableOpacity
                                                style={ds.reminderToggleRow}
                                                onPress={() => toggleMedicationReminder(index)}
                                            >
                                                <View style={[ds.miniCheckbox, med.reminders?.enabled && ds.miniCheckboxChecked]}>
                                                    {med.reminders?.enabled && <Feather name="check" size={10} color="#fff" />}
                                                </View>
                                                <Feather name="bell" size={14} color={med.reminders?.enabled ? '#58A7B3' : tc.textMuted} />
                                                <Text style={[ds.reminderToggleText, med.reminders?.enabled && ds.reminderToggleTextActive]}>
                                                    {t('visit.recommendations.enable_reminders')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Scale Monitoring */}
                        <View style={ds.section}>
                            <Text style={ds.sectionLabel}>{t('visit.recommendations.scale_monitoring')}</Text>
                            
                            {renderScaleCategory('depression', t('visit.recommendations.assessments.depression'), PSYCH_SCALES.depression)}
                            {renderScaleCategory('anxiety', t('visit.recommendations.assessments.anxiety'), PSYCH_SCALES.anxiety)}
                            {renderScaleCategory('mentalHealth', t('visit.recommendations.assessments.mental_health'), PSYCH_SCALES.mentalHealth)}
                            {renderScaleCategory('ptsd', t('visit.recommendations.assessments.ptsd_trauma'), PSYCH_SCALES.ptsd)}
                            {renderScaleCategory('addictions', t('visit.recommendations.assessments.addiction'), PSYCH_SCALES.addictions)}
                            {renderScaleCategory('sleep', t('visit.recommendations.assessments.sleep'), PSYCH_SCALES.sleep)}
                        </View>

                        {/* AI Assistant */}
                        <View style={ds.section}>
                            <View style={ds.aiHeader}>
                                <Text style={ds.sectionLabelBold}>{t('visit.recommendations.ai_assistant.title')}</Text>
                                <TouchableOpacity 
                                    style={ds.checkboxRow}
                                    onPress={() => setAiEnabled(!aiEnabled)}
                                >
                                    <View style={[ds.mainCheckbox, aiEnabled && ds.mainCheckboxChecked]}>
                                        {aiEnabled && <Feather name="check" size={14} color="#fff" />}
                                    </View>
                                    <Text style={ds.checkboxText}>{t('visit.recommendations.ai_assistant.enable')}</Text>
                                </TouchableOpacity>
                            </View>

                            {aiEnabled && (
                                <View style={ds.aiToolList}>
                                    <AiAssistantTool 
                                        id="mood"
                                        title={t('visit.recommendations.ai_assistant.tools.mood.title')}
                                        description={t('visit.recommendations.ai_assistant.tools.mood.description')}
                                    />
                                    <AiAssistantTool 
                                        id="meds"
                                        title={t('visit.recommendations.ai_assistant.tools.meds.title')}
                                        description={t('visit.recommendations.ai_assistant.tools.meds.description')}
                                    />
                                    <AiAssistantTool 
                                        id="crisis"
                                        title={t('visit.recommendations.ai_assistant.tools.crisis.title')}
                                        description={t('visit.recommendations.ai_assistant.tools.crisis.description')}
                                    />
                                    <AiAssistantTool 
                                        id="coping"
                                        title={t('visit.recommendations.ai_assistant.tools.coping.title')}
                                        description={t('visit.recommendations.ai_assistant.tools.coping.description')}
                                    />
                                </View>
                            )}
                        </View>

                        <TouchableOpacity 
                            style={ds.emergencyRow}
                            onPress={() => setShareEmergency(!shareEmergency)}
                        >
                            <View style={[ds.mainCheckbox, shareEmergency && ds.mainCheckboxChecked]}>
                                {shareEmergency && <Feather name="check" size={14} color="#fff" />}
                            </View>
                            <Text style={ds.checkboxText}>{t('visit.recommendations.share_emergency')}</Text>
                        </TouchableOpacity>

                        <View style={ds.divider} />

                        {/* Actions */}
                        <View style={ds.actions}>
                            <TouchableOpacity style={ds.cancelBtn} onPress={onClose}>
                                <Text style={ds.cancelText}>{t('common.cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave}>
                                <LinearGradient
                                    colors={['#58A7B3', '#8ED1CC']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={ds.saveBtn}
                                >
                                    <Text style={ds.saveText}>{t('visit.recommendations.save')}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            paddingHorizontal: 20,
        },
        modalContent: {
            backgroundColor: tc.modalBg,
            borderRadius: 16,
            overflow: 'hidden',
            maxHeight: hp(90),
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: tc.borderColor,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        scrollView: {
            padding: 20,
        },
        innerHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
        },
        innerHeaderTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: '#58A7B3',
            marginLeft: 10,
        },
        section: {
            marginBottom: 24,
        },
        sectionHeaderRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        sectionLabel: {
            fontSize: 15,
            fontWeight: '600',
            color: tc.textPrimary,
        },
        sectionLabelBold: {
            fontSize: 16,
            fontWeight: '700',
            color: tc.textPrimary,
        },

        // Medication search
        medSearchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 44,
            marginTop: 12,
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : tc.cardBackgroundAlt,
        },
        medSearchInput: {
            flex: 1,
            fontSize: 14,
            color: tc.textPrimary,
            marginLeft: 8,
            padding: 0,
        },
        medSearchResultsContainer: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            marginTop: 4,
            backgroundColor: tc.cardBackground,
            maxHeight: 200,
            overflow: 'hidden',
        },
        medSearchResult: {
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderBottomWidth: 1,
            borderBottomColor: tc.borderColor,
        },
        medSearchResultName: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textPrimary,
        },
        medSearchResultDosage: {
            fontSize: 12,
            color: tc.textMuted,
            marginTop: 2,
        },

        // Medication entries
        medicationsList: {
            marginTop: 12,
        },
        medEntryCard: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : tc.cardBackgroundAlt,
            borderRadius: 10,
            padding: 14,
            marginBottom: 10,
        },
        medEntryHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        medEntryInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        medEntryTexts: {
            marginLeft: 10,
            flex: 1,
        },
        medEntryName: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        medEntryDosage: {
            fontSize: 12,
            color: tc.textMuted,
            marginTop: 2,
        },
        medInstructionsInput: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical: 8,
            fontSize: 13,
            color: tc.textPrimary,
            marginTop: 10,
        },
        reminderToggleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
        },
        miniCheckbox: {
            width: 16,
            height: 16,
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 3,
            marginRight: 6,
            alignItems: 'center',
            justifyContent: 'center',
        },
        miniCheckboxChecked: {
            backgroundColor: '#58A7B3',
            borderColor: '#58A7B3',
        },
        reminderToggleText: {
            fontSize: 12,
            color: tc.textMuted,
            marginLeft: 4,
        },
        reminderToggleTextActive: {
            color: '#58A7B3',
            fontWeight: '600',
        },

        // Scales
        subHeading: {
            fontSize: 13,
            fontWeight: '600',
            color: tc.textSecondary,
            marginTop: 16,
            marginBottom: 12,
        },
        assessmentGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        assessmentCard: {
            width: '48.5%',
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : tc.cardBackgroundAlt,
            borderRadius: 8,
            padding: 12,
            marginBottom: 10,
        },
        assessmentCardActive: {
            borderWidth: 1.5,
            borderColor: '#58A7B3',
            backgroundColor: isDark ? 'rgba(88, 167, 179, 0.08)' : '#F0F9FA',
        },
        assessmentHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        assessmentTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.textPrimary,
        },
        addMonitoringBtn: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        addMonitoringText: {
            fontSize: 12,
            fontWeight: '600',
            color: '#58A7B3',
            marginLeft: 4,
        },
        removeMonitoringBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
        },
        removeMonitoringText: {
            fontSize: 11,
            fontWeight: '600',
            color: '#EF4444',
            marginLeft: 4,
        },
        scaleConfigRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6,
        },
        scaleConfigLabel: {
            fontSize: 11,
            color: tc.textMuted,
        },
        scaleFrequencyInput: {
            width: 36,
            height: 28,
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 4,
            textAlign: 'center',
            fontSize: 12,
            color: tc.textPrimary,
            marginHorizontal: 4,
            padding: 0,
        },

        // AI assistant
        aiHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        checkboxRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        mainCheckbox: {
            width: 18,
            height: 18,
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 4,
            marginRight: 8,
            alignItems: 'center',
            justifyContent: 'center',
        },
        mainCheckboxChecked: {
            backgroundColor: '#58A7B3',
            borderColor: '#58A7B3',
        },
        checkboxText: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textPrimary,
        },
        aiToolList: {
            marginTop: 8,
        },
        aiToolCard: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : tc.cardBackgroundAlt,
            borderRadius: 10,
            padding: 16,
            marginBottom: 12,
        },
        aiToolContent: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        aiToolIconContainer: {
            width: 40,
            height: 40,
            borderRadius: 8,
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
            borderWidth: 1,
            borderColor: tc.borderColor,
        },
        aiToolTextContainer: {
            flex: 1,
        },
        aiToolTitle: {
            fontSize: 15,
            fontWeight: '700',
            color: tc.textPrimary,
            marginBottom: 2,
        },
        aiToolDescription: {
            fontSize: 12,
            color: tc.textSecondary,
        },
        customCheckbox: {
            width: 16,
            height: 16,
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 12,
        },
        customCheckboxChecked: {
            backgroundColor: '#58A7B3',
            borderColor: '#58A7B3',
        },
        emergencyRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
        },
        divider: {
            height: 1,
            backgroundColor: tc.borderColor,
            marginBottom: 20,
        },
        actions: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: 40,
        },
        cancelBtn: {
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: '#58A7B3',
            marginRight: 12,
        },
        cancelText: {
            fontSize: 15,
            fontWeight: '700',
            color: '#58A7B3',
        },
        saveBtn: {
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 8,
        },
        saveText: {
            fontSize: 15,
            fontWeight: '700',
            color: '#fff',
        },
    });

export default RecommendationModal;
