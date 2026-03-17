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
import VisitProfile from './VisitProfile';
import VisitInterview from './VisitInterview';
import VisitExamination from './visitExamination';
import VisitDiagnosis from './VisitDiagnosis';
import VisitDocuments from './VisitDocuments';
import VisitSummary from './VisitSummary';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GetVisitDetails, GetPreviousVisits, UpdateVisit } from '../../Services/Visit.Service';
import { GetPatientMedicalData } from '../../Services/MedicalData.Service';
import { useEffect, useCallback } from 'react';

const VisitScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { visitId } = route.params || {};

    const [currentStep, setCurrentStep] = useState(1);
    const [activeAiTool, setActiveAiTool] = useState('Decision Support');
    const [showDataModal, setShowDataModal] = useState(false);
    const [aiContentExpanded, setAiContentExpanded] = useState(false);
    const [activeInterviewSubTab, setActiveInterviewSubTab] = useState('Question suggestions');

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

    const handleVisitUpdate = useCallback(async (updatedFields) => {
        if (!visitData || !visitId) return;

        // Optimistically update local state
        const newVisitData = {
            ...visitData,
            ...updatedFields
        };
        
        // Deep merge for nested fields like interview, examination, etc.
        Object.keys(updatedFields).forEach(key => {
            if (typeof updatedFields[key] === 'object' && updatedFields[key] !== null) {
                newVisitData[key] = {
                    ...(visitData[key] || {}),
                    ...updatedFields[key]
                };
            }
        });

        setVisitData(newVisitData);

        // Send payload ensuring id properties are set as required by the backend
        const payload = {
            ...newVisitData,
            visitId: newVisitData.visitId || visitId,
            id: newVisitData.id || visitId,
            _id: newVisitData._id || visitId
        };

        try {
            await UpdateVisit(payload);
        } catch (error) {
            console.error("Error updating visit data:", error);
            // Optionally, we could revert state here on failure, but optimistic is often better for simple texts 
        }
    }, [visitData, visitId]);

    const steps = [
        { id: 1, label: 'Profile' },
        { id: 2, label: 'Interview' },
        { id: 3, label: 'Examination' },
        { id: 4, label: 'Diagnosis' },
        { id: 5, label: 'Documents' },
        { id: 6, label: 'Summary' },
    ];

    const aiTools = [
        { id: 'Decision Support', label: 'Decision Support', icon: 'brain', type: 'material-community' },
        { id: 'Interview Coach', label: 'Interview Coach', icon: 'message-square', type: 'feather' },
        { id: 'Documentation Assistant', label: 'Documentation Assistant', icon: 'mic', type: 'feather' },
        { id: 'Drug Knowledge', label: 'Drug Knowledge', icon: 'pill', type: 'material-community' },
        { id: 'ICD-10 Assistant', label: 'ICD-10 Assistant', icon: 'file-text', type: 'feather' },
    ];

    const renderStep = (step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        
        return (
            <View key={step.id} style={styles.stepItem}>
                <View style={styles.stepHeader}>
                    {index > 0 && (
                        <View style={[styles.stepConnector, styles.connectorLeft, currentStep >= step.id && styles.stepConnectorActive]} />
                    )}
                    <TouchableOpacity 
                        style={[
                            styles.stepCircle, 
                            isActive && styles.stepCircleActive,
                            isCompleted && styles.stepCircleCompleted
                        ]}
                        onPress={() => setCurrentStep(step.id)}
                        activeOpacity={0.7}
                    >
                        {isCompleted ? (
                            <Feather name="check" size={14} color="#fff" />
                        ) : (
                            <Text style={[styles.stepNumber, isActive && styles.stepNumberActive]}>{step.id}</Text>
                        )}
                    </TouchableOpacity>
                    {index < steps.length - 1 && (
                        <View style={[styles.stepConnector, styles.connectorRight, currentStep > step.id && styles.stepConnectorActive]} />
                    )}
                </View>
                <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]} numberOfLines={1}>
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
                style={[styles.aiTab, isActive && styles.aiTabActive]}
                onPress={() => setActiveAiTool(tool.id)}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={isActive ? ['#E2F2F4', '#E2F2F4'] : ['#CBE8ED', '#FFFFFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.aiTabGradient}
                >
                    {tool.type === 'material-community' ? (
                        <MaterialCommunityIcons name={tool.icon} size={20} color={isActive ? '#58A7B3' : '#64748B'} />
                    ) : (
                        <Feather name={tool.icon} size={20} color={isActive ? '#58A7B3' : '#64748B'} />
                    )}
                    <Text style={[styles.aiTabText, isActive && styles.aiTabTextActive]}>{tool.label}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <VisitProfile 
                        onNext={() => setCurrentStep(2)} 
                        onBack={() => {/* Navigation back handled by parent if needed */}} 
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
                        onNext={() => setCurrentStep(3)} 
                        onBack={() => setCurrentStep(1)} 
                        visitId={visitId}
                        patientId={visitData?.patient?.id || visitData?.patient?._id || visitData?.patientId}
                        visitData={visitData}
                        onUpdate={handleVisitUpdate}
                    />
                );
            case 3:
                return (
                    <VisitExamination 
                        onNext={() => setCurrentStep(4)} 
                        onBack={() => setCurrentStep(2)} 
                        visitData={visitData}
                        onUpdate={handleVisitUpdate}
                    />
                );
            case 4:
                return (
                    <VisitDiagnosis 
                        onNext={() => setCurrentStep(5)} 
                        onBack={() => setCurrentStep(3)} 
                        visitData={visitData}
                        onUpdate={handleVisitUpdate}
                    />
                );
            case 5:
                return (
                    <VisitDocuments 
                        onNext={() => setCurrentStep(6)} 
                        onBack={() => setCurrentStep(4)} 
                        visitData={visitData}
                        onUpdate={handleVisitUpdate}
                    />
                );
            case 6:
                return (
                    <VisitSummary 
                        onFinish={() => {/* Final action */}} 
                        onBack={() => setCurrentStep(5)} 
                        visitData={visitData}
                        onUpdate={handleVisitUpdate}
                    />
                );
            default:
                return (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Content for Step {currentStep} coming soon...</Text>
                    </View>
                );
        }
    };

    const renderAiContent = () => {
        switch (activeAiTool) {
            case 'Decision Support':
                return (
                    <View style={styles.contentContainer}>
                        <TouchableOpacity 
                            style={styles.expandableHeader}
                            onPress={() => setAiContentExpanded(!aiContentExpanded)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.headerLeft}>
                                <View style={styles.iconBackground}>
                                    <MaterialCommunityIcons name="brain" size={24} color="#58A7B3" />
                                </View>
                                <View>
                                    <Text style={styles.headerTitle}>Clinical Decision Support</Text>
                                    <Text style={styles.headerSubtitle}>AI analysis of clinical data</Text>
                                </View>
                            </View>
                            <Feather name={aiContentExpanded ? "chevron-up" : "chevron-down"} size={24} color="#333" />
                        </TouchableOpacity>
                        
                        {aiContentExpanded && (
                            <TouchableOpacity style={styles.analysisButton} onPress={() => setShowDataModal(true)}>
                                <Feather name="file-text" size={18} color="#fff" />
                                <Text style={styles.analysisButtonText}>Select data for analysis</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                );
            case 'Interview Coach':
                return (
                    <View style={styles.contentContainer}>
                        <TouchableOpacity 
                            style={styles.expandableHeader}
                            onPress={() => setAiContentExpanded(!aiContentExpanded)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.headerLeft}>
                                <View style={styles.iconBackground}>
                                    <MaterialCommunityIcons name="brain" size={24} color="#58A7B3" />
                                </View>
                                <View>
                                    <Text style={styles.headerTitle}>Medical Interview Coach</Text>
                                    <Text style={styles.headerSubtitle}>AI-powered medical interview Coach</Text>
                                </View>
                            </View>
                            <Feather name={aiContentExpanded ? "chevron-up" : "chevron-down"} size={24} color="#333" />
                        </TouchableOpacity>

                        {aiContentExpanded && (
                            <>
                                <View style={styles.alertBox}>
                                    <Ionicons name="alert-circle-outline" size={20} color="#856404" />
                                    <View style={styles.alertTextContainer}>
                                        <Text style={styles.alertTitle}>No data available for analysis</Text>
                                        <Text style={styles.alertSubtitle}>Please conduct a medical interview to analyze communication quality.</Text>
                                    </View>
                                </View>

                                <View style={styles.subTabsContainer}>
                                    <TouchableOpacity 
                                        style={[styles.subTab, activeInterviewSubTab === 'Question suggestions' && styles.subTabActive]}
                                        onPress={() => setActiveInterviewSubTab('Question suggestions')}
                                    >
                                        <Feather name="message-square" size={14} color={activeInterviewSubTab === 'Question suggestions' ? "#58A7B3" : "#64748B"} />
                                        <Text style={[styles.subTabTextSmall, activeInterviewSubTab === 'Question suggestions' && styles.subTabTextActiveSmall]}>Question suggestions</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.subTab, activeInterviewSubTab === 'Communication analysis' && styles.subTabActive]}
                                        onPress={() => setActiveInterviewSubTab('Communication analysis')}
                                    >
                                        <Feather name="bar-chart-2" size={14} color={activeInterviewSubTab === 'Communication analysis' ? "#58A7B3" : "#64748B"} />
                                        <Text style={[styles.subTabTextSmall, activeInterviewSubTab === 'Communication analysis' && styles.subTabTextActiveSmall]}>Communication analysis</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.subTab, activeInterviewSubTab === 'Literature' && styles.subTabActive]}
                                        onPress={() => setActiveInterviewSubTab('Literature')}
                                    >
                                        <Feather name="book-open" size={14} color={activeInterviewSubTab === 'Literature' ? "#58A7B3" : "#64748B"} />
                                        <Text style={[styles.subTabTextSmall, activeInterviewSubTab === 'Literature' && styles.subTabTextActiveSmall]}>Literature</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.subTabContent}>
                                    {activeInterviewSubTab === 'Question suggestions' && (
                                        <Text style={styles.suggestedQuestionsText}>Suggested questions 0</Text>
                                    )}

                                    {activeInterviewSubTab === 'Communication analysis' && (
                                        <View style={styles.analysisContainer}>
                                            <ScrollView 
                                                horizontal 
                                                showsHorizontalScrollIndicator={false}
                                                contentContainerStyle={styles.analysisCardsRow}
                                            >
                                                <View style={styles.analysisCard}>
                                                    <View style={styles.analysisCardText}>
                                                        <Text style={styles.cardInfoLabel}>Symptom Clusters</Text>
                                                        <Text style={styles.cardInfoValue}>0</Text>
                                                        <Text style={styles.cardInfoSub}>Identified Areas</Text>
                                                    </View>
                                                    <MaterialCommunityIcons name="brain" size={32} color="#58A7B3" />
                                                </View>
                                                <View style={styles.analysisCard}>
                                                    <View style={styles.analysisCardText}>
                                                        <Text style={styles.cardInfoLabel}>Potential Diagnoses</Text>
                                                        <Text style={styles.cardInfoValue}>0</Text>
                                                        <Text style={styles.cardInfoSub}>To Consider</Text>
                                                    </View>
                                                    <MaterialCommunityIcons name="target" size={32} color="#4CAF50" />
                                                </View>
                                                <View style={styles.analysisCard}>
                                                    <View style={styles.analysisCardText}>
                                                        <Text style={styles.cardInfoLabel}>Diagnostic Gaps</Text>
                                                        <Text style={styles.cardInfoValue}>0</Text>
                                                        <Text style={styles.cardInfoSub}>Require Attention</Text>
                                                    </View>
                                                    <Feather name="alert-triangle" size={32} color="#EAB308" />
                                                </View>
                                            </ScrollView>
                                            <View style={styles.recommendationHeader}>
                                                <Text style={styles.recommendationTitle}>Clinical Recommendations</Text>
                                            </View>
                                        </View>
                                    )}

                                    {activeInterviewSubTab === 'Literature' && (
                                        <View style={styles.literatureContainer}>
                                            {[
                                                { title: 'Structured Interview Guidelines for Depression', source: 'Journal of Clinical Psychiatry, 2023', accuracy: '95%' },
                                                { title: 'Best Practices in Patient Communication', source: 'Medical Communication Quarterly, 2023', accuracy: '88%' }
                                            ].map((item, index) => (
                                                <View key={index} style={styles.literatureItem}>
                                                    <View style={styles.literatureItemLeft}>
                                                        <View style={styles.literatureHeaderRow}>
                                                            <Feather name="book-open" size={14} color="#58A7B3" />
                                                            <Text style={styles.literatureItemTitle}>{item.title}</Text>
                                                        </View>
                                                        <Text style={styles.literatureItemSource}>{item.source}</Text>
                                                        <View style={styles.accuracyRow}>
                                                            <Feather name="star" size={12} color="#EAB308" />
                                                            <Text style={styles.accuracyText}>Accuracy: {item.accuracy}</Text>
                                                        </View>
                                                    </View>
                                                    <Feather name="external-link" size={16} color="#58A7B3" />
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </>
                        )}
                    </View>
                );
            case 'Documentation Assistant':
                return (
                    <View style={styles.contentContainer}>
                        {['Smart Transcription', 'Remedius Consult', 'Pharmacopedia'].map((title, index) => (
                            <View key={index} style={[styles.expandableHeader, { marginBottom: hp(1.5) }]}>
                                <View style={styles.headerLeft}>
                                    <View style={styles.iconBackground}>
                                        <MaterialCommunityIcons 
                                            name={title === 'Smart Transcription' ? 'brain' : title === 'Remedius Consult' ? 'stethoscope' : 'pill'} 
                                            size={20} 
                                            color="#58A7B3" 
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.headerTitle}>{title}</Text>
                                        <Text style={styles.headerSubtitle}>
                                            {title === 'Smart Transcription' ? 'AI-powered transcription of medical conversations' :
                                             title === 'Remedius Consult' ? 'AI-powered clinical assistant for medical consultations...' :
                                             'Comprehensive AI-driven drug information and interaction checker'}
                                        </Text>
                                    </View>
                                </View>
                                <Feather name="chevron-down" size={24} color="#333" />
                            </View>
                        ))}
                    </View>
                );
            case 'Drug Knowledge':
                return (
                    <View style={styles.contentContainer}>
                        <View style={styles.expandableHeader}>
                            <View style={styles.headerLeft}>
                                <View style={styles.iconBackground}>
                                    <Ionicons name="shield-checkmark-outline" size={24} color="#58A7B3" />
                                </View>
                                <View>
                                    <Text style={styles.headerTitle}>Medicine Information</Text>
                                </View>
                            </View>
                            <Feather name="chevron-up" size={24} color="#333" />
                        </View>
                        
                        <View style={styles.searchSection}>
                            <Text style={styles.inputLabel}>Search Medicine</Text>
                            <View style={styles.searchContainer}>
                                <Feather name="search" size={20} color="#94A3B8" />
                                <TextInput 
                                    placeholder="Enter medicine name (min. 3 characters)..." 
                                    style={styles.searchInput}
                                    placeholderTextColor="#94A3B8"
                                />
                            </View>
                        </View>

                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="pill" size={60} color="#CBD5E1" />
                            <Text style={styles.emptyStateText}>Search for a medicine to view details</Text>
                        </View>
                    </View>
                );
            case 'ICD-10 Assistant':
                return (
                    <View style={styles.contentContainer}>
                        <View style={styles.searchContainer}>
                            <Feather name="search" size={20} color="#94A3B8" />
                            <TextInput 
                                placeholder="Search for ICD-10 code or diagnosis name..." 
                                style={styles.searchInput}
                                placeholderTextColor="#94A3B8"
                            />
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#58A7B3" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Custom Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    style={styles.headerBackButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitleMain}>Active Visit</Text>
                <View style={{ width: 40 }} /> 
            </View>

            {/* Top Stepper Area */}
            <View style={styles.stepperWrapper}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.stepperContainer}
                >
                    {steps.map((step, index) => renderStep(step, index))}
                </ScrollView>
            </View>

            <ScrollView style={styles.stepContentScroll}>
                {/* AI Tab Bar Area */}
                <View style={styles.aiToolsWrapper}>
                    <View style={styles.aiBadgeContainer}>
                        <LinearGradient
                            colors={['#58A7B3', '#8ED1CC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.aiBadge}
                        >
                            <MaterialCommunityIcons name="auto-fix" size={14} color="#fff" />
                            <Text style={styles.aiBadgeText}>AI Powered</Text>
                        </LinearGradient>
                    </View>

                    <View style={styles.aiTabsWrapper}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {aiTools.map(renderAiToolTab)}
                        </ScrollView>
                    </View>

                    {/* AI Content Area */}
                    <View style={styles.aiContentContainer}>
                        {renderAiContent()}
                    </View>
                </View>

                {/* Step Content Area (comes after AI tools) */}
                {renderStepContent()}
            </ScrollView>

            <SelectDataModal
                visible={showDataModal}
                onClose={() => setShowDataModal(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerBackButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleMain: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        letterSpacing: -0.5,
    },
    stepperWrapper: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    stepperContainer: {
        flexDirection: 'row',
        paddingHorizontal: wp(2),
        paddingVertical: hp(1.5),
    },
    stepItem: {
        alignItems: 'center',
        width: wp(22),
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
        backgroundColor: '#F1F5F9',
        flex: 1,
        marginTop: 1, // Vertical alignment fix
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
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2, // Ensure it stays above connectors
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
        color: '#94A3B8',
        fontWeight: '700',
    },
    stepNumberActive: {
        color: '#fff',
    },
    stepLabel: {
        fontSize: 12,
        color: '#94A3B8',
    },
    stepLabelActive: {
        color: '#58A7B3',
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
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 12,
        minHeight: hp(40),
    },
    placeholderText: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
    },
    aiToolsWrapper: {
        marginTop: hp(1),
        marginHorizontal: wp(3),
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
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
        alignItems: 'center',
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
        backgroundColor: '#F1F5F9',
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
        backgroundColor: '#E2F2F4',
        borderWidth: 1.5,
        borderColor: '#58A7B3',
        borderRadius: 8,
        zIndex: 10,
        shadowColor: '#58A7B3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    aiTabText: {
        fontSize: 12,
        color: '#64748B',
        marginTop: hp(0.8),
        textAlign: 'center',
        fontWeight: '500',
        paddingHorizontal: wp(1),
    },
    aiTabTextActive: {
        color: '#58A7B3',
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
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        // Elevation for Android
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
        backgroundColor: '#E2F2F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    analysisButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#58A7B3',
        marginTop: 20,
        paddingVertical: 14,
        borderRadius: 8,
        // Gradient effect simulation
        shadowColor: '#58A7B3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
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
        backgroundColor: '#FFFBEB',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FEF3C7',
        marginTop: 20,
    },
    alertTextContainer: {
        marginLeft: 10,
        flex: 1,
    },
    alertTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#856404',
    },
    alertSubtitle: {
        fontSize: 13,
        color: '#856404',
        marginTop: 2,
    },
    subTabsContainer: {
        flexDirection: 'row',
        marginTop: 20,
        backgroundColor: '#F1F5F9',
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
        backgroundColor: '#fff',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    subTabTextSmall: {
        fontSize: 10,
        color: '#64748B',
        marginTop: 4,
        textAlign: 'center',
    },
    subTabTextActiveSmall: {
        color: '#58A7B3',
        fontWeight: '700',
    },
    subTabContent: {
        marginTop: 10,
    },
    suggestedQuestionsText: {
        marginTop: 6,
        fontSize: 14,
        color: '#64748B',
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
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 4,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    analysisCardText: {
        flex: 1,
    },
    cardInfoLabel: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '600',
        marginBottom: 4,
    },
    cardInfoValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1E293B',
    },
    cardInfoSub: {
        fontSize: 10,
        color: '#94A3B8',
        marginTop: 2,
    },
    recommendationHeader: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginTop: 4,
    },
    recommendationTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
    },
    literatureContainer: {
        marginTop: 12,
    },
    literatureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginBottom: 12,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
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
        color: '#1E293B',
        marginLeft: 8,
        flex: 1,
    },
    literatureItemSource: {
        fontSize: 12,
        color: '#64748B',
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
        color: '#64748B',
        fontWeight: '600',
        marginLeft: 4,
    },
    searchSection: {
        marginTop: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        marginTop: 20, // Specific for ICD-10 screenshot look
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#1E293B',
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
        color: '#64748B',
    },
});

export default VisitScreen;
