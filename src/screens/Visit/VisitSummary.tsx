import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import RecommendationModal from './modals/RecommendationModal';

interface VisitSummaryProps {
    onBack: () => void;
    onFinish: () => void;
    visitData?: any;
    onUpdate?: (data: any) => void;
}

const VisitSummary = ({ onBack, onFinish, visitData, onUpdate }: VisitSummaryProps) => {
    const [expandedSections, setExpandedSections] = useState({
        diagnoses: false,
        documents: false,
        psychiatric: false,
        nextVisit: false,
        general: false,
    });
    const [showRecommendationModal, setShowRecommendationModal] = useState(false);
    const [generalRecommendations, setGeneralRecommendations] = useState(visitData?.recommendations?.specialization || '');

    useEffect(() => {
        if (visitData?.recommendations?.specialization) {
            setGeneralRecommendations(visitData.recommendations.specialization);
        }
    }, [visitData]);

    // Next Visit states
    const [visitDate, setVisitDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) setVisitDate(selectedDate);
    };

    const onStartTimeChange = (event: any, selectedTime?: Date) => {
        setShowStartTimePicker(Platform.OS === 'ios');
        if (selectedTime) setStartTime(selectedTime);
    };

    const onEndTimeChange = (event: any, selectedTime?: Date) => {
        setShowEndTimePicker(Platform.OS === 'ios');
        if (selectedTime) setEndTime(selectedTime);
    };

    const formatDate = (date: Date) => {
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    const formatTime = (date: Date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const renderHeader = (
        title: string, 
        icon: string, 
        iconType: 'feather' | 'material', 
        count?: number, 
        sectionKey?: keyof typeof expandedSections,
        showAddButton?: boolean
    ) => {
        const isExpanded = sectionKey ? expandedSections[sectionKey] : false;

        return (
            <TouchableOpacity 
                style={[styles.cardHeader, showAddButton && styles.multiRowHeader]} 
                onPress={() => sectionKey && toggleSection(sectionKey)}
                activeOpacity={0.7}
            >
                <View style={styles.headerTopRow}>
                    <View style={styles.headerTitleRow}>
                        {iconType === 'feather' ? (
                            <Feather name={icon} size={20} color="#58A7B3" style={styles.sectionIcon} />
                        ) : (
                            <MaterialCommunityIcons name={icon} size={20} color="#58A7B3" style={styles.sectionIcon} />
                        )}
                        <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
                        {count !== undefined && (
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{count}</Text>
                            </View>
                        )}
                    </View>
                    <Feather 
                        name={isExpanded ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color="#1E293B" 
                    />
                </View>

                {showAddButton && (
                    <View style={styles.headerBottomRow}>
                        <TouchableOpacity 
                            style={styles.addRecommendationsButton}
                            onPress={() => setShowRecommendationModal(true)}
                        >
                            <Feather name="plus" size={16} color="#58A7B3" />
                            <Text style={styles.addRecommendationsText}>Add Recommendations</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Diagnoses Card */}
            <View style={styles.card}>
                {renderHeader('Diagnoses', 'activity', 'feather', visitData?.diagnosis?.icd10?.length || 0, 'diagnoses')}
                {expandedSections.diagnoses && (
                    <View style={styles.cardContent}>
                        {visitData?.diagnosis?.icd10?.length > 0 ? (
                            <View style={styles.aiGrid}>
                                {visitData.diagnosis.icd10.map((diag: any, index: number) => (
                                    <View key={index} style={styles.aiToolPill}>
                                        <Text style={styles.aiToolText}>{diag.code || diag}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.placeholderText}>No diagnoses added yet.</Text>
                        )}
                    </View>
                )}
            </View>

            {/* Issued Documents Card */}
            <View style={styles.card}>
                {renderHeader('Issued Documents', 'file-text', 'feather', (visitData?.isPrescription ? 1 : 0) + (visitData?.isReferral ? 1 : 0), 'documents')}
                {expandedSections.documents && (
                    <View style={styles.cardContent}>
                        {visitData?.isPrescription || visitData?.isReferral ? (
                            <View style={styles.aiGrid}>
                                {visitData?.isPrescription && (
                                    <View style={styles.aiToolPill}>
                                        <Text style={styles.aiToolText}>e-Prescription issued</Text>
                                    </View>
                                )}
                                {visitData?.isReferral && (
                                    <View style={styles.aiToolPill}>
                                        <Text style={styles.aiToolText}>Referral issued</Text>
                                    </View>
                                )}
                            </View>
                        ) : (
                            <Text style={styles.placeholderText}>No documents issued.</Text>
                        )}
                    </View>
                )}
            </View>

            {/* Psychiatric Recommendations Card */}
            <View style={styles.card}>
                {renderHeader('Psychiatric Recommendations', 'brain', 'material', visitData?.recommendations?.aiAssistance?.features ? Object.values(visitData.recommendations.aiAssistance.features).filter(Boolean).length : 0, 'psychiatric', true)}
                {expandedSections.psychiatric && (
                    <View style={styles.cardContent}>
                        <View style={styles.aiAssistanceSection}>
                            <View style={styles.aiAssistanceHeader}>
                                <MaterialCommunityIcons name="brain" size={18} color="#58A7B3" />
                                <Text style={styles.aiAssistanceTitle}>AI Assistance</Text>
                            </View>
                            
                            <View style={styles.aiGrid}>
                                {visitData?.recommendations?.aiAssistance?.features ? (
                                    Object.entries(visitData.recommendations.aiAssistance.features).map(([key, value]) => {
                                        if (value) {
                                            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                            return (
                                                <View key={key} style={styles.aiToolPill}>
                                                    <Text style={styles.aiToolText}>{formattedKey}</Text>
                                                </View>
                                            )
                                        }
                                        return null;
                                    })
                                ) : (
                                    <View style={styles.aiToolPill}>
                                        <Text style={styles.aiToolText}>No AI features enabled</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                )}
            </View>

            {/* Next Visit Card */}
            <View style={styles.card}>
                {renderHeader('Next Visit', 'calendar', 'feather', undefined, 'nextVisit')}
                {expandedSections.nextVisit && (
                    <View style={styles.cardContent}>
                        <View style={styles.schedulingSection}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Date</Text>
                                <TouchableOpacity 
                                    style={styles.scheduleInputContainer}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <View style={styles.scheduleInputWithIcon}>
                                        <Feather name="calendar" size={18} color="#94A3B8" />
                                        <Text style={styles.scheduleValueText}>{formatDate(visitDate)}</Text>
                                    </View>
                                    <Feather name="calendar" size={18} color="#1E293B" />
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={visitDate}
                                        mode="date"
                                        display="default"
                                        onChange={onDateChange}
                                        minimumDate={new Date()}
                                    />
                                )}
                            </View>

                            <View style={styles.timeRow}>
                                <View style={styles.timeInputWrapper}>
                                    <Text style={styles.inputLabel}>Start Time</Text>
                                    <TouchableOpacity 
                                        style={styles.scheduleInputContainer}
                                        onPress={() => setShowStartTimePicker(true)}
                                    >
                                        <View style={styles.scheduleInputWithIcon}>
                                            <MaterialCommunityIcons name="clock-outline" size={18} color="#94A3B8" />
                                            <Text style={styles.scheduleValueText}>{formatTime(startTime)}</Text>
                                        </View>
                                        <MaterialCommunityIcons name="clock-outline" size={18} color="#1E293B" />
                                    </TouchableOpacity>
                                    {showStartTimePicker && (
                                        <DateTimePicker
                                            value={startTime}
                                            mode="time"
                                            display="default"
                                            onChange={onStartTimeChange}
                                        />
                                    )}
                                </View>
                                <View style={styles.timeInputWrapper}>
                                    <Text style={styles.inputLabel}>End Time</Text>
                                    <TouchableOpacity 
                                        style={styles.scheduleInputContainer}
                                        onPress={() => setShowEndTimePicker(true)}
                                    >
                                        <View style={styles.scheduleInputWithIcon}>
                                            <MaterialCommunityIcons name="clock-outline" size={18} color="#94A3B8" />
                                            <Text style={styles.scheduleValueText}>{formatTime(endTime)}</Text>
                                        </View>
                                        <MaterialCommunityIcons name="clock-outline" size={18} color="#1E293B" />
                                    </TouchableOpacity>
                                    {showEndTimePicker && (
                                        <DateTimePicker
                                            value={endTime}
                                            mode="time"
                                            display="default"
                                            onChange={onEndTimeChange}
                                        />
                                    )}
                                </View>
                            </View>

                            <TouchableOpacity style={styles.createVisitBtn}>
                                <LinearGradient
                                    colors={['#58A7B3', '#8ED1CC']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.createVisitGradient}
                                >
                                    <Feather name="check" size={18} color="#fff" />
                                    <Text style={styles.createVisitText}>Create next visit</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>

            {/* General Recommendations Card */}
            <View style={styles.card}>
                {renderHeader('General Recommendations', 'clipboard', 'feather', undefined, 'general')}
                {expandedSections.general && (
                    <View style={styles.cardContent}>
                        <TextInput
                            style={styles.generalInput}
                            placeholder="Enter general Recommendations"
                            placeholderTextColor="#94A3B8"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={generalRecommendations}
                            onChangeText={setGeneralRecommendations}
                            onBlur={() => {
                                if (onUpdate && (visitData?.recommendations?.specialization !== generalRecommendations)) {
                                    onUpdate({ recommendations: { specialization: generalRecommendations } });
                                }
                            }}
                        />
                    </View>
                )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Feather name="arrow-left" size={18} color="#58A7B3" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onFinish}>
                    <LinearGradient
                        colors={['#58A7B3', '#8ED1CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.finishButton}
                    >
                        <Text style={styles.finishButtonText}>Finish</Text>
                        <Feather name="arrow-right" size={18} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <RecommendationModal 
                visible={showRecommendationModal}
                onClose={() => setShowRecommendationModal(false)}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    cardHeader: {
        padding: 16,
        minHeight: 64,
        justifyContent: 'center',
    },
    multiRowHeader: {
        paddingBottom: 20,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    headerBottomRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        marginTop: 12,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    sectionIcon: {
        marginRight: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    countBadge: {
        backgroundColor: '#E2F2F4',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginLeft: 8,
        minWidth: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#58A7B3',
    },
    headerRightAction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addRecommendationsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#58A7B3',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
    },
    addRecommendationsText: {
        color: '#58A7B3',
        fontSize: 11,
        fontWeight: '700',
        marginLeft: 4,
    },
    cardContent: {
        padding: 16,
        paddingTop: 0,
        borderTopWidth: 1,
        borderTopColor: '#F8FAFC',
    },
    placeholderText: {
        fontSize: 14,
        color: '#94A3B8',
        fontStyle: 'italic',
        marginTop: 8,
    },
    aiAssistanceSection: {
        marginTop: 16,
        marginBottom: 8,
    },
    aiAssistanceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    aiAssistanceTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
        marginLeft: 8,
    },
    aiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    aiToolPill: {
        width: '48.5%',
        backgroundColor: '#E2F2F4',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginBottom: 10,
    },
    aiToolText: {
        fontSize: 13,
        color: '#58A7B3',
        fontWeight: '600',
    },
    schedulingSection: {
        marginTop: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 8,
    },
    scheduleInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
    },
    scheduleInputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scheduleValueText: {
        fontSize: 14,
        color: '#1E293B',
        marginLeft: 10,
        fontWeight: '500',
    },
    inlinePicker: {
        backgroundColor: '#fff',
        marginTop: 8,
        borderRadius: 8,
        overflow: 'hidden',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    timeInputWrapper: {
        width: '48.5%',
    },
    createVisitBtn: {
        alignSelf: 'flex-end',
        marginBottom: 8,
    },
    createVisitGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(5),
        width: wp(43),
        borderRadius: 8,
    },
    createVisitText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 8,
    },
    generalInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#1E293B',
        minHeight: 100,
        marginTop: 16,
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingBottom: hp(5),
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#58A7B3',
        borderRadius: 8,
        width: wp(43),
        height: 50,
        justifyContent: 'center',
    },
    backButtonText: {
        fontSize: 16,
        color: '#58A7B3',
        fontWeight: '700',
        marginLeft: 8,
    },
    finishButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        width: wp(43),
        height: 50,
        justifyContent: 'center',
    },
    finishButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '700',
        marginRight: 8,
    },
});

export default VisitSummary;
