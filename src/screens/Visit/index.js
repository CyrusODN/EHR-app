import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Animated,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import SelectDataModal from './modals/SelectDataModal';
import VisitConfirmationModal from './modals/VisitConfirmationModal';
import VisitProfile from './VisitProfile';
import VisitInterview from './VisitInterview';
import VisitExamination from './visitExamination';
import VisitDiagnosis from './VisitDiagnosis';
import VisitDocuments from './VisitDocuments';
import VisitSummary from './VisitSummary';
import ClinicalDecisionSupport from './ai/ClinicalDecisionSupport';
import InterviewCoachTool from './ai/InterviewCoachTool';
import SmartTranscriptionTool from './ai/SmartTranscriptionTool';
import DrugInteractionChecker from './ai/DrugInteractionChecker';
import ICD10AssistantTool from './ai/ICD10AssistantTool';
import VoiceTranscriptionTool from './ai/VoiceTranscriptionTool';
import DiagnosticAssistantTool from './ai/DiagnosticAssistantTool';
import MedicationAssistantTool from './ai/MedicationAssistantTool';
import LaboratoryContainer from './laboratory/LaboratoryContainer';
import ProceduresContainer from './procedures/ProceduresContainer';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GetVisitDetails, GetPreviousVisits, UpdateVisit } from '../../Services/Visit.Service';
import { GetPatientMedicalData } from '../../Services/MedicalData.Service';
import { useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

const VisitScreen = () => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const route = useRoute();
    const navigation = useNavigation();
    const { visitId } = route.params || {};

    const [currentStep, setCurrentStep] = useState(1);
    const [activeAiTool, setActiveAiTool] = useState('Decision Support');
    const [showDataModal, setShowDataModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [finishLoading, setFinishLoading] = useState(false);

    // Step transition animation refs
    const stepFadeAnim = useRef(new Animated.Value(1)).current;
    const stepSlideAnim = useRef(new Animated.Value(0)).current;
    const prevStepRef = useRef(1);

    const [visitData, setVisitData] = useState(null);
    const [previousVisits, setPreviousVisits] = useState([]);
    const [totalPreviousVisits, setTotalPreviousVisits] = useState(0);
    const [medicalData, setMedicalData] = useState(null);
    const [loading, setLoading] = useState(!!visitId);

    useEffect(() => {
        if (visitId) {
            fetchAllData();
        } else {
            console.warn("VisitScreen: visitId is missing");
            setLoading(false);
        }
    }, [visitId]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const result = await GetVisitDetails(visitId);
            // Handle both wrapped (result.data) and unwrapped (result) cases
            const visitResult = result?.data || result;
            
            if (visitResult) {
                setVisitData(visitResult);
                
                // Extract patient info - handle various possible field names
                const patientObj = visitResult.patient || visitResult.patientId;
                const patientId = patientObj?.id || patientObj?._id || (typeof patientObj === 'string' ? patientObj : null);
                
                if (!patientId) {
                    console.warn("VisitScreen: patientId not found in visit data", visitResult);
                }
                
                // Fetch associated data if we have IDs
                const tasks = [];
                tasks.push(GetPreviousVisits(visitId));
                if (patientId) {
                    tasks.push(GetPatientMedicalData(patientId));
                }

                const results = await Promise.allSettled(tasks);
                
                // Handle Previous Visits result
                if (results[0].status === 'fulfilled' && results[0].value) {
                    const prevData = results[0].value?.data || results[0].value;
                    setPreviousVisits(prevData?.previousVisits || []);
                    setTotalPreviousVisits(prevData?.total || 0);
                }

                // Handle Medical Data result
                if (patientId && results[1]?.status === 'fulfilled' && results[1].value) {
                    const medData = results[1].value?.data || results[1].value;
                    setMedicalData(medData);
                }
            }
        } catch (error) {
            console.error("Error fetching visit data:", error);
        } finally {
            setLoading(false);
        }
    };

    const animateStepTransition = useCallback((newStep) => {
        const direction = newStep > prevStepRef.current ? 1 : -1;
        
        Animated.parallel([
            Animated.timing(stepFadeAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(stepSlideAnim, {
                toValue: direction * -30,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => {
            prevStepRef.current = newStep;
            setCurrentStep(newStep);
            stepSlideAnim.setValue(direction * 30);

            Animated.parallel([
                Animated.timing(stepFadeAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.spring(stepSlideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                    stiffness: 200,
                }),
            ]).start();
        });
    }, [stepFadeAnim, stepSlideAnim]);

    const handleFinishVisit = useCallback(async () => {
        setFinishLoading(true);
        try {
            await UpdateVisit({
                ...visitData,
                visitId,
                id: visitId,
                _id: visitId,
                status: 'completed',
            });
            setShowConfirmModal(false);
            navigation.navigate('Dashboard');
        } catch (error) {
            console.error("Error completing visit:", error);
        } finally {
            setFinishLoading(false);
        }
    }, [visitId, visitData, navigation]);

    const debounceTimeoutRef = useRef(null);
    const pendingUpdatesRef = useRef({});

    const handleVisitUpdate = useCallback((updatedFields) => {
        if (!visitId) return;

        const accumulate = (target, source) => {
            Object.keys(source).forEach(key => {
                if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                    target[key] = target[key] || {};
                    accumulate(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            });
        };
        
        accumulate(pendingUpdatesRef.current, updatedFields);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
             setVisitData(prev => {
                  if (!prev) return prev;
                  // Create a deep copy for merging to avoid mutating prev state
                  const newVisitData = { ...prev };
                  const mergeDeep = (t, s) => {
                      Object.keys(s).forEach(k => {
                          if (typeof s[k] === 'object' && s[k] !== null && !Array.isArray(s[k])) {
                              t[k] = { ...(t[k] || {}) };
                              mergeDeep(t[k], s[k]);
                          } else {
                              t[k] = s[k];
                          }
                      });
                  };
                  mergeDeep(newVisitData, pendingUpdatesRef.current);
                  
                  const payload = {
                      ...newVisitData,
                      visitId: newVisitData.visitId || visitId,
                      id: newVisitData.id || visitId,
                      _id: newVisitData._id || visitId
                  };

                  UpdateVisit(payload).catch(error => {
                      console.error("Error updating visit data:", error);
                  });
                  
                  pendingUpdatesRef.current = {};
                  return newVisitData;
             });
        }, 500);
    }, [visitId]);

    const steps = [
        { id: 1, label: t('visit.steps.profile') },
        { id: 2, label: t('visit.steps.interview') },
        { id: 3, label: t('visit.steps.examination') },
        { id: 4, label: t('visit.steps.diagnosis') },
        { id: 5, label: t('visit.steps.laboratory') },
        { id: 6, label: t('visit.steps.procedures') },
        { id: 7, label: t('visit.steps.documents') },
        { id: 8, label: t('visit.steps.summary') },
    ];

    const aiTools = [
        { id: 'Decision Support', label: t('visit.ai.tabs.cds'), icon: 'brain', type: 'material-community' },
        { id: 'Interview Coach', label: t('visit.ai.tabs.interview'), icon: 'message-square', type: 'feather' },
        { id: 'Documentation Assistant', label: t('visit.ai.tabs.transcription'), icon: 'mic', type: 'feather' },
        { id: 'Drug Knowledge', label: t('visit.ai.tabs.interactions'), icon: 'pill', type: 'material-community' },
        { id: 'ICD-10 Assistant', label: t('visit.ai.tabs.icd10'), icon: 'file-text', type: 'feather' },
        { id: 'Voice Transcription', label: t('visit.ai.tabs.voice'), icon: 'microphone', type: 'material-community' },
        { id: 'Diagnostic Assistant', label: t('visit.ai.tabs.diagnostic'), icon: 'cpu', type: 'feather' },
        { id: 'Medication Assistant', label: t('visit.ai.tabs.medication'), icon: 'thermometer', type: 'feather' },
    ];

    const renderStep = (step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        
        return (
            <View key={step.id} style={ds.stepItem}>
                <View style={ds.stepHeader}>
                    {index > 0 && (
                        <View style={[ds.stepConnector, ds.connectorLeft, currentStep >= step.id && ds.stepConnectorActive]} />
                    )}
                    <TouchableOpacity 
                        style={[
                            ds.stepCircle, 
                            isActive && ds.stepCircleActive,
                            isCompleted && ds.stepCircleCompleted
                        ]}
                        onPress={() => animateStepTransition(step.id)}
                        activeOpacity={0.7}
                    >
                        {isCompleted ? (
                            <Feather name="check" size={14} color="#fff" />
                        ) : (
                            <Text style={[ds.stepNumber, isActive && ds.stepNumberActive]}>{step.id}</Text>
                        )}
                    </TouchableOpacity>
                    {index < steps.length - 1 && (
                        <View style={[ds.stepConnector, ds.connectorRight, currentStep > step.id && ds.stepConnectorActive]} />
                    )}
                </View>
                <Text style={[ds.stepLabel, isActive && ds.stepLabelActive]} numberOfLines={1}>
                    {step.label}
                </Text>
            </View>
        );
    };

    const renderAiToolTab = (tool) => {
        const isActive = activeAiTool === tool.id;
        return (
            <TouchableOpacity
                key={tool.id}
                style={[ds.aiTab, isActive && ds.aiTabActive]}
                onPress={() => setActiveAiTool(tool.id)}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={isActive ? [isDark ? '#2D3748' : '#E2F2F4', isDark ? '#2D3748' : '#E2F2F4'] : [isDark ? '#1A202C' : '#CBE8ED', tc.cardBackground]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={ds.aiTabGradient}
                >
                    {tool.type === 'material-community' ? (
                        <MaterialCommunityIcons name={tool.icon} size={20} color={isActive ? tc.accent : tc.textMuted} />
                    ) : (
                        <Feather name={tool.icon} size={20} color={isActive ? tc.accent : tc.textMuted} />
                    )}
                    <Text style={[ds.aiTabText, isActive && ds.aiTabTextActive]}>{tool.label}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <VisitProfile 
                        onNext={() => animateStepTransition(2)} 
                        onBack={() => {}} 
                        patientData={visitData?.patient || visitData?.patientId}
                        medicalData={medicalData}
                        previousVisits={previousVisits}
                        totalPreviousVisits={totalPreviousVisits}
                        loading={loading}
                    />
                );
            case 2:
                return (
                    <VisitInterview 
                        onNext={() => animateStepTransition(3)} 
                        onBack={() => animateStepTransition(1)} 
                        visitId={visitId}
                        patientId={visitData?.patient?.id || visitData?.patient?._id || visitData?.patientId}
                        visitData={visitData}
                        onUpdate={handleVisitUpdate}
                    />
                );
            case 3:
                return (
                    <VisitExamination 
                        onNext={() => animateStepTransition(4)} 
                        onBack={() => animateStepTransition(2)} 
                        visitId={visitId}
                        visitData={visitData}
                        onUpdate={handleVisitUpdate}
                    />
                );
            case 4:
                return (
                    <VisitDiagnosis 
                        onNext={() => animateStepTransition(5)} 
                        onBack={() => animateStepTransition(3)} 
                        visitData={visitData}
                        onUpdate={handleVisitUpdate}
                    />
                );
            case 5:
                return (
                    <LaboratoryContainer
                        onNext={() => animateStepTransition(6)}
                        onBack={() => animateStepTransition(4)}
                        visitId={visitId}
                        visitData={visitData}
                        onUpdate={handleVisitUpdate}
                    />
                );
            case 6:
                return (
                    <ProceduresContainer
                        onNext={() => animateStepTransition(7)}
                        onBack={() => animateStepTransition(5)}
                        visitId={visitId}
                        patientId={visitData?.patient?.id || visitData?.patient?._id || visitData?.patientId}
                        visitData={visitData}
                        onUpdate={handleVisitUpdate}
                    />
                );
            case 7:
                return (
                    <VisitDocuments 
                        onNext={() => animateStepTransition(8)} 
                        onBack={() => animateStepTransition(6)} 
                        visitId={visitId}
                        visitData={visitData}
                        onUpdate={handleVisitUpdate}
                    />
                );
            case 8:
                return (
                    <VisitSummary 
                        onFinish={() => setShowConfirmModal(true)} 
                        onBack={() => animateStepTransition(7)} 
                        visitId={visitId}
                        visitData={visitData}
                        onUpdate={handleVisitUpdate}
                    />
                );
            default:
                return (
                    <View style={ds.placeholderContainer}>
                        <Text style={ds.placeholderText}>{t('common.noData')} {currentStep}</Text>
                    </View>
                );
        }
    };

    const handleSuggestionAccept = (suggestion) => {
        if (suggestion.type === 'diagnosis' && suggestion.diagnosisData) {
            const currentDiagnoses = visitData?.diagnosis?.icd10 || [];
            handleVisitUpdate({ diagnosis: { icd10: [...currentDiagnoses, suggestion.diagnosisData] } });
        }
    };

    const renderAiContent = () => {
        switch (activeAiTool) {
            case 'Decision Support':
                return (
                    <View style={ds.contentContainer}>
                        <ClinicalDecisionSupport
                            visitData={visitData}
                            visitId={visitId}
                            onSuggestionAccept={handleSuggestionAccept}
                        />
                    </View>
                );
            case 'Interview Coach':
                return (
                    <View style={ds.contentContainer}>
                        <InterviewCoachTool
                            visitData={visitData}
                            visitId={visitId}
                            onQuestionSelect={(question) => {
                                console.log('Question selected:', question.text);
                            }}
                        />
                    </View>
                );
            case 'Documentation Assistant':
                return (
                    <View style={ds.contentContainer}>
                        <SmartTranscriptionTool
                            visitData={visitData}
                            visitId={visitId}
                            onUpdate={handleVisitUpdate}
                        />
                    </View>
                );
            case 'Drug Knowledge':
                return (
                    <View style={ds.contentContainer}>
                        <DrugInteractionChecker />
                    </View>
                );
            case 'ICD-10 Assistant':
                return (
                    <View style={ds.contentContainer}>
                        <ICD10AssistantTool
                            visitData={visitData}
                            onUpdate={handleVisitUpdate}
                        />
                    </View>
                );
            case 'Voice Transcription':
                return (
                    <View style={ds.contentContainer}>
                        <VoiceTranscriptionTool
                            visitData={visitData}
                            visitId={visitId}
                            onUpdate={handleVisitUpdate}
                        />
                    </View>
                );
            case 'Diagnostic Assistant':
                return (
                    <View style={ds.contentContainer}>
                        <DiagnosticAssistantTool
                            visitData={visitData}
                            visitId={visitId}
                            onUpdate={handleVisitUpdate}
                        />
                    </View>
                );
            case 'Medication Assistant':
                return (
                    <View style={ds.contentContainer}>
                        <MedicationAssistantTool
                            visitData={visitData}
                            visitId={visitId}
                        />
                    </View>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[ds.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={tc.accent} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={ds.container}>
            {/* Custom Header */}
            <View style={ds.headerContainer}>
                <TouchableOpacity 
                    style={ds.headerBackButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={tc.textPrimary} />
                </TouchableOpacity>
                <Text style={ds.headerTitleMain}>{t('visit.activeVisit')}</Text>
                <View style={{ width: 40 }} /> 
            </View>

            {/* Top Stepper Area */}
            <View style={ds.stepperWrapper}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={ds.stepperContainer}
                >
                    {steps.map((step, index) => renderStep(step, index))}
                </ScrollView>
            </View>

            <ScrollView style={ds.stepContentScroll}>
                {/* AI Tab Bar Area */}
                <View style={ds.aiToolsWrapper}>
                    <View style={ds.aiBadgeContainer}>
                        <LinearGradient
                            colors={['#58A7B3', '#8ED1CC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={ds.aiBadge}
                        >
                            <MaterialCommunityIcons name="auto-fix" size={14} color="#fff" />
                            <Text style={ds.aiBadgeText}>{t('visit.ai.badge')}</Text>
                        </LinearGradient>
                    </View>

                    <View style={ds.aiTabsWrapper}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {aiTools.map(renderAiToolTab)}
                        </ScrollView>
                    </View>

                    {/* AI Content Area */}
                    <View style={ds.aiContentContainer}>
                        {renderAiContent()}
                    </View>
                </View>

                {/* Step Content Area (comes after AI tools) */}
                <Animated.View style={{
                    opacity: stepFadeAnim,
                    transform: [{ translateX: stepSlideAnim }],
                }}>
                    {renderStepContent()}
                </Animated.View>
            </ScrollView>

            <SelectDataModal
                visible={showDataModal}
                onClose={() => setShowDataModal(false)}
                previousVisits={previousVisits}
            />

            <VisitConfirmationModal
                visible={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleFinishVisit}
                loading={finishLoading}
                visitData={visitData}
            />
        </SafeAreaView>
    );
};

const createDynamicStyles = (tc, isDark) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
        backgroundColor: tc.headerBg,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
    },
    headerBackButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: tc.buttonMutedBg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleMain: {
        fontSize: 18,
        fontWeight: '800',
        color: tc.textPrimary,
        letterSpacing: -0.5,
    },
    stepperWrapper: {
        backgroundColor: tc.headerBg,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderColor,
    },
    stepperContainer: {
        flexDirection: 'row',
        paddingHorizontal: wp(2),
        paddingVertical: hp(1.5),
    },
    stepItem: {
        alignItems: 'center',
        width: wp(18),
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 6,
    },
    stepConnector: {
        height: 2.5,
        backgroundColor: tc.borderColor,
        flex: 1,
        marginTop: 1,
    },
    connectorLeft: {
        marginRight: -1,
    },
    connectorRight: {
        marginLeft: -1,
    },
    stepConnectorActive: {
        backgroundColor: '#58A7B3',
    },
    stepCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: tc.cardBackground,
        borderWidth: 2,
        borderColor: tc.borderColor,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    stepCircleActive: {
        backgroundColor: '#58A7B3',
        borderColor: '#58A7B3',
    },
    stepCircleCompleted: {
        backgroundColor: '#58A7B3',
        borderColor: '#58A7B3',
    },
    stepNumber: {
        fontSize: 16,
        color: tc.textMuted,
        fontWeight: '700',
    },
    stepNumberActive: {
        color: '#fff',
    },
    stepLabel: {
        fontSize: 12,
        color: tc.textMuted,
    },
    stepLabelActive: {
        color: tc.accent,
        fontWeight: '600',
    },
    stepContentScroll: {
        flex: 1,
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: tc.cardBackground,
        margin: 16,
        borderRadius: 12,
        minHeight: hp(40),
    },
    placeholderText: {
        fontSize: 16,
        color: tc.textSecondary,
        textAlign: 'center',
    },
    aiToolsWrapper: {
        marginTop: hp(1),
        marginHorizontal: wp(3),
        backgroundColor: tc.cardBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: tc.borderColor,
        overflow: 'hidden',
        marginBottom: hp(1),
    },
    aiBadgeContainer: {
        marginTop: hp(0.5),
    },
    aiBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        height: hp(3),
        width: wp(29),
        justifyContent: 'center',
        borderRadius: wp(8),
    },
    aiBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    aiTabsWrapper: {
        flexDirection: 'row',
        paddingVertical: hp(1),
        paddingHorizontal: wp(1),
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9',
    },
    aiTab: {
        width: wp(34),
        height: hp(7.5),
        borderRadius: 0,
        overflow: 'hidden',
    },
    aiTabGradient: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiTabActive: {
        backgroundColor: isDark ? 'rgba(88,167,179,0.15)' : '#E2F2F4',
        borderWidth: 1.5,
        borderColor: tc.accent,
        borderRadius: 8,
        zIndex: 10,
        shadowColor: tc.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    aiTabText: {
        fontSize: 12,
        color: tc.textMuted,
        marginTop: hp(0.8),
        textAlign: 'center',
        fontWeight: '500',
        paddingHorizontal: wp(1),
    },
    aiTabTextActive: {
        color: tc.accent,
        fontWeight: '700',
    },
    aiContentContainer: {
        flex: 1,
    },
    scrollContent: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    expandableHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: tc.cardBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: tc.borderColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.2 : 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconBackground: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: tc.accentLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    headerSubtitle: {
        fontSize: 12,
        color: tc.textMuted,
        marginTop: 2,
    },
    analysisButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tc.accent,
        marginTop: 20,
        paddingVertical: 14,
        borderRadius: 8,
        shadowColor: tc.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.4 : 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    analysisButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    alertBox: {
        flexDirection: 'row',
        backgroundColor: isDark ? 'rgba(245,158,11,0.1)' : '#FFFBEB',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(245,158,11,0.2)' : '#FEF3C7',
        marginTop: 20,
    },
    alertTextContainer: {
        marginLeft: 10,
        flex: 1,
    },
    alertTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: isDark ? '#FBBF24' : '#856404',
    },
    alertSubtitle: {
        fontSize: 13,
        color: isDark ? '#FBBF24' : '#856404',
        marginTop: 2,
    },
    subTabsContainer: {
        flexDirection: 'row',
        marginTop: 20,
        backgroundColor: tc.searchBarBg,
        padding: 4,
        borderRadius: 8,
    },
    subTab: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 6,
    },
    subTabActive: {
        backgroundColor: tc.cardBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    subTabTextSmall: {
        fontSize: 10,
        color: tc.textMuted,
        marginTop: 4,
        textAlign: 'center',
    },
    subTabTextActiveSmall: {
        color: tc.accent,
        fontWeight: '700',
    },
    subTabContent: {
        marginTop: 10,
    },
    suggestedQuestionsText: {
        marginTop: 6,
        fontSize: 14,
        color: tc.textSecondary,
        paddingHorizontal: 4,
    },
    analysisContainer: {
        marginTop: 12,
    },
    analysisCardsRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    analysisCard: {
        width: wp(42),
        backgroundColor: tc.cardBackground,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: tc.borderColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.2 : 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    analysisCardText: {
        flex: 1,
    },
    cardInfoLabel: {
        fontSize: 11,
        color: tc.textMuted,
        fontWeight: '600',
        marginBottom: 4,
    },
    cardInfoValue: {
        fontSize: 22,
        fontWeight: '800',
        color: tc.textPrimary,
    },
    cardInfoSub: {
        fontSize: 10,
        color: tc.textMuted,
        marginTop: 2,
    },
    recommendationHeader: {
        backgroundColor: tc.cardBackground,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: tc.borderColor,
        marginTop: 4,
    },
    recommendationTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: tc.textPrimary,
    },
    literatureContainer: {
        marginTop: 12,
    },
    literatureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tc.cardBackground,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: tc.borderColor,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.2 : 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    literatureItemLeft: {
        flex: 1,
    },
    literatureHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    literatureItemTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: tc.textPrimary,
        marginLeft: 8,
        flex: 1,
    },
    literatureItemSource: {
        fontSize: 12,
        color: tc.textMuted,
        marginLeft: 22,
        marginBottom: 4,
    },
    accuracyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 22,
    },
    accuracyText: {
        fontSize: 12,
        color: tc.textMuted,
        fontWeight: '600',
        marginLeft: 4,
    },
    searchSection: {
        marginTop: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: tc.textSecondary,
        marginBottom: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: tc.cardBackgroundAlt,
        borderWidth: 1,
        borderColor: tc.borderColor,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        marginTop: 0,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: tc.textPrimary,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        paddingBottom: 40,
    },
    emptyStateText: {
        marginTop: 12,
        fontSize: 14,
        color: tc.textMuted,
    },
});

export default VisitScreen;
