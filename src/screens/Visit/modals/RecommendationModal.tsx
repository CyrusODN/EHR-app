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
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

interface RecommendationModalProps {
    visible: boolean;
    onClose: () => void;
}

const RecommendationModal = ({ visible, onClose }: RecommendationModalProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
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
        <View style={ds.assessmentCard}>
            <View style={ds.assessmentHeader}>
                <Text style={ds.assessmentTitle}>{title}</Text>
                <Feather name="info" size={14} color={tc.textMuted} />
            </View>
            <TouchableOpacity style={ds.addMonitoringBtn}>
                <Feather name="plus" size={14} color="#58A7B3" />
                <Text style={ds.addMonitoringText}>{t('visit.recommendations.add_to_monitoring')}</Text>
            </TouchableOpacity>
        </View>
    );

    const AiAssistantTool = ({ id, icon, title, description }: any) => {
        const isSelected = selectedAlTools.includes(id);
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
                            <Feather name="sparkles" size={20} color="#58A7B3" />
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
                                <View style={ds.searchContainer}>
                                    <TextInput 
                                        style={ds.searchInput}
                                        placeholder={t('visit.recommendations.search_medication')}
                                        placeholderTextColor={tc.textMuted}
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Scale Monitoring */}
                        <View style={ds.section}>
                            <Text style={ds.sectionLabel}>{t('visit.recommendations.scale_monitoring')}</Text>
                            
                            <Text style={ds.subHeading}>{t('visit.recommendations.assessments.depression')}</Text>
                            <View style={ds.assessmentGrid}>
                                <AssessmentItem title="PHQ-9" />
                                <AssessmentItem title="BDI-II" />
                                <AssessmentItem title="CES-D" />
                            </View>

                            <Text style={ds.subHeading}>{t('visit.recommendations.assessments.anxiety')}</Text>
                            <View style={ds.assessmentGrid}>
                                <AssessmentItem title="GAD-7" />
                                <AssessmentItem title="BAI" />
                                <AssessmentItem title="HADS" />
                            </View>

                            <Text style={ds.subHeading}>{t('visit.recommendations.assessments.mental_health')}</Text>
                            <View style={ds.assessmentGrid}>
                                <AssessmentItem title="WHO-5" />
                                <AssessmentItem title="SF-12" />
                                <AssessmentItem title="CORE-OM" />
                            </View>

                            <Text style={ds.subHeading}>{t('visit.recommendations.assessments.ptsd_trauma')}</Text>
                            <View style={ds.assessmentGrid}>
                                <AssessmentItem title="PCL-5" />
                                <AssessmentItem title="IES-R" />
                            </View>

                            <Text style={ds.subHeading}>{t('visit.recommendations.assessments.addiction')}</Text>
                            <View style={ds.assessmentGrid}>
                                <AssessmentItem title="AUDIT" />
                                <AssessmentItem title="DUDIT" />
                                <AssessmentItem title="SCOFF" />
                            </View>

                            <Text style={ds.subHeading}>{t('visit.recommendations.assessments.sleep')}</Text>
                            <View style={ds.assessmentGrid}>
                                <AssessmentItem title="PSQI" />
                                <AssessmentItem title="ISI" />
                            </View>
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
                            <TouchableOpacity onPress={onClose}>
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
            backgroundColor: tc.cardBackground,
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
        searchContainer: {
            width: wp(40),
            height: 40,
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            justifyContent: 'center',
            backgroundColor: tc.cardBackgroundAlt,
        },
        searchInput: {
            fontSize: 14,
            color: tc.textPrimary,
            padding: 0,
        },
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
            backgroundColor: tc.cardBackgroundAlt,
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
            backgroundColor: tc.cardBackgroundAlt,
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
