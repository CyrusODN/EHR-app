import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RecommendationModalProps {
    visible: boolean;
    onClose: () => void;
}

const RecommendationModal = ({ visible, onClose }: RecommendationModalProps) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [aiEnabled, setAiEnabled] = useState(true);
    const [selectedAlTools, setSelectedAlTools] = useState(['mood', 'meds', 'crisis', 'coping']);
    const [shareEmergency, setShareEmergency] = useState(true);

    const toggleAiTool = (id: string) => {
        setSelectedAlTools(prev => 
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const AssessmentItem = ({ title }: { title: string }) => (
        <View style={styles.assessmentCard}>
            <View style={styles.assessmentHeader}>
                <Text style={styles.assessmentTitle}>{title}</Text>
                <Feather name="info" size={14} color="#CBD5E1" />
            </View>
            <TouchableOpacity style={styles.addMonitoringBtn}>
                <Feather name="plus" size={14} color="#58A7B3" />
                <Text style={styles.addMonitoringText}>Add to monitoring</Text>
            </TouchableOpacity>
        </View>
    );

    const AiAssistantTool = ({ id, icon, title, description }: any) => {
        const isSelected = selectedAlTools.includes(id);
        return (
            <TouchableOpacity 
                style={styles.aiToolCard}
                onPress={() => toggleAiTool(id)}
                activeOpacity={0.7}
            >
                <View style={styles.aiToolContent}>
                    <View style={styles.aiToolIconContainer}>
                        {id === 'mood' ? (
                            <MaterialCommunityIcons name="brain" size={20} color="#58A7B3" />
                        ) : id === 'meds' ? (
                            <Feather name="bell" size={20} color="#58A7B3" />
                        ) : id === 'crisis' ? (
                            <Feather name="shield" size={20} color="#58A7B3" />
                        ) : (
                            <Feather name="sparkles" size={20} color="#58A7B3" />
                        )}
                    </View>
                    <View style={styles.aiToolTextContainer}>
                        <Text style={styles.aiToolTitle}>{title}</Text>
                        <Text style={styles.aiToolDescription}>{description}</Text>
                    </View>
                </View>
                <View style={[styles.customCheckbox, isSelected && styles.customCheckboxChecked]}>
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
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { marginTop: insets.top + 20, marginBottom: insets.bottom + 20 }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Recommendations for Patient Portal</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.innerHeader}>
                            <MaterialCommunityIcons name="brain" size={24} color="#58A7B3" />
                            <Text style={styles.innerHeaderTitle}>Recommendations for Patient Portal</Text>
                        </View>

                        {/* Medication Schedule */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeaderRow}>
                                <Text style={styles.sectionLabel}>Medication Schedule</Text>
                                <View style={styles.searchContainer}>
                                    <TextInput 
                                        style={styles.searchInput}
                                        placeholder="Search medication..."
                                        placeholderTextColor="#94A3B8"
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Scale Monitoring */}
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Scale Monitoring</Text>
                            
                            <Text style={styles.subHeading}>Depression Assessment</Text>
                            <View style={styles.assessmentGrid}>
                                <AssessmentItem title="PHQ-9" />
                                <AssessmentItem title="BDI-II" />
                                <AssessmentItem title="CES-D" />
                            </View>

                            <Text style={styles.subHeading}>Anxiety Assessment</Text>
                            <View style={styles.assessmentGrid}>
                                <AssessmentItem title="GAD-7" />
                                <AssessmentItem title="BAI" />
                                <AssessmentItem title="HADS" />
                            </View>

                            <Text style={styles.subHeading}>Mental Health Assessment</Text>
                            <View style={styles.assessmentGrid}>
                                <AssessmentItem title="WHO-5" />
                                <AssessmentItem title="SF-12" />
                                <AssessmentItem title="CORE-OM" />
                            </View>

                            <Text style={styles.subHeading}>PTSD and Trauma Assessment</Text>
                            <View style={styles.assessmentGrid}>
                                <AssessmentItem title="PCL-5" />
                                <AssessmentItem title="IES-R" />
                            </View>

                            <Text style={styles.subHeading}>Addiction Assessment</Text>
                            <View style={styles.assessmentGrid}>
                                <AssessmentItem title="AUDIT" />
                                <AssessmentItem title="DUDIT" />
                                <AssessmentItem title="SCOFF" />
                            </View>

                            <Text style={styles.subHeading}>Sleep Assessment</Text>
                            <View style={styles.assessmentGrid}>
                                <AssessmentItem title="PSQI" />
                                <AssessmentItem title="ISI" />
                            </View>
                        </View>

                        {/* AI Assistant */}
                        <View style={styles.section}>
                            <View style={styles.aiHeader}>
                                <Text style={styles.sectionLabelBold}>AI Assistant</Text>
                                <TouchableOpacity 
                                    style={styles.checkboxRow}
                                    onPress={() => setAiEnabled(!aiEnabled)}
                                >
                                    <View style={[styles.mainCheckbox, aiEnabled && styles.mainCheckboxChecked]}>
                                        {aiEnabled && <Feather name="check" size={14} color="#fff" />}
                                    </View>
                                    <Text style={styles.checkboxText}>Enable AI assistant</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.aiToolList}>
                                <AiAssistantTool 
                                    id="mood"
                                    title="Intelligent Mood Tracking"
                                    description="AI analyzes mood patterns and suggests interventions"
                                />
                                <AiAssistantTool 
                                    id="meds"
                                    title="Adaptive Medication Reminders"
                                    description="AI adjusts reminders to the patient's daily rhythm"
                                />
                                <AiAssistantTool 
                                    id="crisis"
                                    title="Crisis Support"
                                    description="AI detects warning signals and suggests appropriate actions"
                                />
                                <AiAssistantTool 
                                    id="coping"
                                    title="Personalized Coping Strategies"
                                    description="AI proposes techniques tailored to the patient's situation"
                                />
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.emergencyRow}
                            onPress={() => setShareEmergency(!shareEmergency)}
                        >
                            <View style={[styles.mainCheckbox, shareEmergency && styles.mainCheckboxChecked]}>
                                {shareEmergency && <Feather name="check" size={14} color="#fff" />}
                            </View>
                            <Text style={styles.checkboxText}>Share emergency contacts in the portal</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        {/* Actions */}
                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onClose}>
                                <LinearGradient
                                    colors={['#58A7B3', '#8ED1CC']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.saveBtn}
                                >
                                    <Text style={styles.saveText}>Save Recommendations</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
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
        borderBottomColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
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
        color: '#1E293B',
    },
    sectionLabelBold: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    searchContainer: {
        width: wp(40),
        height: 40,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },
    searchInput: {
        fontSize: 14,
        color: '#1E293B',
        padding: 0,
    },
    subHeading: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
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
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
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
        color: '#1E293B',
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
        borderColor: '#CBD5E1',
        borderRadius: 4,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainCheckboxChecked: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    checkboxText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    aiToolList: {
        marginTop: 8,
    },
    aiToolCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAFC',
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    aiToolTextContainer: {
        flex: 1,
    },
    aiToolTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 2,
    },
    aiToolDescription: {
        fontSize: 12,
        color: '#64748B',
    },
    customCheckbox: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    customCheckboxChecked: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    emergencyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
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
