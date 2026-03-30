import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import {  UpdateVisit, GetVisitDetails } from '../../Services/Visit.Service';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import RecommendationModal from './modals/RecommendationModal';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

interface VisitSummaryProps {
    onBack: () => void;
    onFinish: () => void;
    visitId?: string;
    visitData?: any;
    onUpdate?: (data: any) => void;
}

const VisitSummary = ({ onBack, onFinish, visitId, visitData, onUpdate }: VisitSummaryProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const [expandedSections, setExpandedSections] = useState({
        diagnoses: false,
        documents: false,
        psychiatric: false,
        nextVisit: false,
        general: false,
    });
    const [showRecommendationModal, setShowRecommendationModal] = useState(false);
    const [generalRecommendations, setGeneralRecommendations] = useState(visitData?.recommendations?.specialization || '');

    const debounceTimeoutRef = useRef<any>(null);
    const pendingUpdatesRef = useRef<any>({});

    const handleSync = useCallback(async () => {
        if (!visitId) return;

        const updates = { ...pendingUpdatesRef.current };
        pendingUpdatesRef.current = {};

        const payload = {
            ...visitData,
            ...updates,
            visitId, id: visitId, _id: visitId
        };

        // Handle nested merges for recommendations
        if (updates.recommendations) {
            payload.recommendations = {
                ...(visitData?.recommendations || {}),
                ...updates.recommendations
            };
        }

        try {
            await UpdateVisit(payload);
            const detailsResult = await GetVisitDetails(visitId);
            const fullData = detailsResult?.data || detailsResult;
            if (fullData && onUpdate) {
                onUpdate(fullData);
            }
        } catch (error) {
            console.error("Sync error:", error);
        }
    }, [visitId, visitData, onUpdate]);

    const debouncedSync = (updatedFields: any) => {
        const accumulate = (target: any, source: any) => {
            Object.keys(source).forEach(key => {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
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
            handleSync();
        }, 700);
    };

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
                style={[ds.cardHeader, showAddButton && ds.multiRowHeader]} 
                onPress={() => sectionKey && toggleSection(sectionKey)}
                activeOpacity={0.7}
            >
                <View style={ds.headerTopRow}>
                    <View style={ds.headerTitleRow}>
                        {iconType === 'feather' ? (
                            <Feather name={icon} size={20} color="#58A7B3" style={ds.sectionIcon} />
                        ) : (
                            <MaterialCommunityIcons name={icon} size={20} color="#58A7B3" style={ds.sectionIcon} />
                        )}
                        <Text style={ds.cardTitle} numberOfLines={1}>{title}</Text>
                        {count !== undefined && (
                            <View style={ds.countBadge}>
                                <Text style={ds.countText}>{count}</Text>
                            </View>
                        )}
                    </View>
                    <Feather 
                        name={isExpanded ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color={tc.textPrimary} 
                    />
                </View>

                {showAddButton && (
                    <View style={ds.headerBottomRow}>
                        <TouchableOpacity 
                            style={ds.addRecommendationsButton}
                            onPress={() => setShowRecommendationModal(true)}
                        >
                            <Feather name="plus" size={16} color="#58A7B3" />
                            <Text style={ds.addRecommendationsText}>{t('visit.summary.actions.addRecommendations')}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={ds.container} showsVerticalScrollIndicator={false}>
            {/* Diagnoses Card */}
            <View style={ds.card}>
                {renderHeader(t('visit.summary.sections.diagnoses'), 'activity', 'feather', visitData?.diagnosis?.icd10?.length || 0, 'diagnoses')}
                {expandedSections.diagnoses && (
                    <View style={ds.cardContent}>
                        {visitData?.diagnosis?.icd10?.length > 0 ? (
                            <View style={ds.aiGrid}>
                                {visitData.diagnosis.icd10.map((diag: any, index: number) => (
                                    <View key={index} style={ds.aiToolPill}>
                                        <Text style={ds.aiToolText}>{diag.code || diag}</Text>
                                    </View>
                                ))}
                            </View>
                             ) : (
                            <Text style={ds.placeholderText}>{t('visit.summary.emptyDiagnoses')}</Text>
                        )}
                    </View>
                )}
            </View>

            {/* Issued Documents Card */}
            <View style={ds.card}>
                {renderHeader(t('visit.summary.sections.documents'), 'file-text', 'feather', (visitData?.isPrescription ? 1 : 0) + (visitData?.isReferral ? 1 : 0), 'documents')}
                {expandedSections.documents && (
                    <View style={ds.cardContent}>
                        {visitData?.isPrescription || visitData?.isReferral ? (
                            <View style={ds.aiGrid}>
                                {visitData?.isPrescription && (
                                    <View style={ds.aiToolPill}>
                                        <Text style={ds.aiToolText}>{t('visit.summary.prescriptionIssued')}</Text>
                                    </View>
                                )}
                                {visitData?.isReferral && (
                                    <View style={ds.aiToolPill}>
                                        <Text style={ds.aiToolText}>{t('visit.summary.referralIssued')}</Text>
                                    </View>
                                )}
                            </View>
                             ) : (
                            <Text style={ds.placeholderText}>{t('visit.summary.emptyDocuments')}</Text>
                        )}
                    </View>
                )}
            </View>

            {/* Psychiatric Recommendations Card */}
            <View style={ds.card}>
                {renderHeader(t('visit.summary.sections.recommendations'), 'brain', 'material', visitData?.recommendations?.aiAssistance?.features ? Object.values(visitData.recommendations.aiAssistance.features).filter(Boolean).length : 0, 'psychiatric', true)}
                {expandedSections.psychiatric && (
                    <View style={ds.cardContent}>
                        <View style={ds.aiAssistanceSection}>
                             <View style={ds.aiAssistanceHeader}>
                                <MaterialCommunityIcons name="brain" size={18} color="#58A7B3" />
                                <Text style={ds.aiAssistanceTitle}>{t('visit.summary.aiTitle')}</Text>
                            </View>
                            
                            <View style={ds.aiGrid}>
                                {visitData?.recommendations?.aiAssistance?.features ? (
                                    Object.entries(visitData.recommendations.aiAssistance.features).map(([key, value]) => {
                                        if (value) {
                                            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                            return (
                                                <View key={key} style={ds.aiToolPill}>
                                                    <Text style={ds.aiToolText}>{formattedKey}</Text>
                                                </View>
                                            )
                                        }
                                        return null;
                                    })
                                 ) : (
                                    <View style={ds.aiToolPill}>
                                        <Text style={ds.aiToolText}>{t('visit.summary.noAiFeatures')}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                )}
            </View>

            {/* Next Visit Card */}
            <View style={ds.card}>
                {renderHeader(t('visit.summary.sections.nextVisit'), 'calendar', 'feather', undefined, 'nextVisit')}
                {expandedSections.nextVisit && (
                    <View style={ds.cardContent}>
                         <View style={ds.schedulingSection}>
                            <View style={ds.inputGroup}>
                                <Text style={ds.inputLabel}>{t('common.time')}</Text>
                                <TouchableOpacity 
                                    style={ds.scheduleInputContainer}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <View style={ds.scheduleInputWithIcon}>
                                        <Feather name="calendar" size={18} color={tc.textMuted} />
                                        <Text style={ds.scheduleValueText}>{formatDate(visitDate)}</Text>
                                    </View>
                                    <Feather name="calendar" size={18} color={tc.textPrimary} />
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

                             <View style={ds.timeRow}>
                                <View style={ds.timeInputWrapper}>
                                    <Text style={ds.inputLabel}>{t('common.from')}</Text>
                                    <TouchableOpacity 
                                        style={ds.scheduleInputContainer}
                                        onPress={() => setShowStartTimePicker(true)}
                                    >
                                        <View style={ds.scheduleInputWithIcon}>
                                            <MaterialCommunityIcons name="clock-outline" size={18} color={tc.textMuted} />
                                            <Text style={ds.scheduleValueText}>{formatTime(startTime)}</Text>
                                        </View>
                                        <MaterialCommunityIcons name="clock-outline" size={18} color={tc.textPrimary} />
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
                                 <View style={ds.timeInputWrapper}>
                                    <Text style={ds.inputLabel}>{t('common.to')}</Text>
                                    <TouchableOpacity 
                                        style={ds.scheduleInputContainer}
                                        onPress={() => setShowEndTimePicker(true)}
                                    >
                                        <View style={ds.scheduleInputWithIcon}>
                                            <MaterialCommunityIcons name="clock-outline" size={18} color={tc.textMuted} />
                                            <Text style={ds.scheduleValueText}>{formatTime(endTime)}</Text>
                                        </View>
                                        <MaterialCommunityIcons name="clock-outline" size={18} color={tc.textPrimary} />
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

                            <TouchableOpacity style={ds.createVisitBtn}>
                                <LinearGradient
                                    colors={['#58A7B3', '#8ED1CC']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={ds.createVisitGradient}
                                >
                                     <Feather name="check" size={18} color="#fff" />
                                    <Text style={ds.createVisitText}>{t('visit.summary.nextVisitLabels.create')}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>

            {/* General Recommendations Card */}
            <View style={ds.card}>
                {renderHeader(t('visit.summary.sections.generalRecommendations'), 'clipboard', 'feather', undefined, 'general')}
                {expandedSections.general && (
                    <View style={ds.cardContent}>
                         <TextInput
                            style={ds.generalInput}
                            placeholder={t('visit.summary.placeholders.recommendations')}
                            placeholderTextColor={tc.textMuted}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={generalRecommendations}
                            onChangeText={(text) => {
                                setGeneralRecommendations(text);
                                debouncedSync({ recommendations: { specialization: text } });
                            }}
                        />
                    </View>
                )}
            </View>

            {/* Footer */}
             <View style={ds.footer}>
                <TouchableOpacity style={ds.backButton} onPress={onBack}>
                    <Feather name="arrow-left" size={18} color="#58A7B3" />
                    <Text style={ds.backButtonText}>{t('visit.navigation.previous')}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onFinish}>
                    <LinearGradient
                        colors={['#58A7B3', '#8ED1CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                         style={ds.finishButton}
                    >
                        <Text style={ds.finishButtonText}>{t('visit.summary.actions.finish')}</Text>
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

const createDynamicStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 12,
        },
        card: {
            backgroundColor: tc.cardBackground,
            borderRadius: 10,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: tc.borderColor,
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
            backgroundColor: tc.cardBackground,
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
            color: tc.textPrimary,
        },
        countBadge: {
            backgroundColor: isDark ? 'rgba(88, 167, 179, 0.2)' : '#E2F2F4',
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
            borderTopColor: tc.borderColor,
            backgroundColor: tc.cardBackground,
        },
        placeholderText: {
            fontSize: 14,
            color: tc.textMuted,
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
            color: tc.textPrimary,
            marginLeft: 8,
        },
        aiGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        aiToolPill: {
            width: '48.5%',
            backgroundColor: isDark ? 'rgba(88, 167, 179, 0.1)' : '#E2F2F4',
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
            color: tc.textSecondary,
            marginBottom: 8,
        },
        scheduleInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 48,
            backgroundColor: tc.cardBackgroundAlt,
        },
        scheduleInputWithIcon: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        scheduleValueText: {
            fontSize: 14,
            color: tc.textPrimary,
            marginLeft: 10,
            fontWeight: '500',
        },
        inlinePicker: {
            backgroundColor: tc.cardBackground,
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
            borderColor: tc.borderColor,
            borderRadius: 8,
            padding: 12,
            fontSize: 14,
            color: tc.textPrimary,
            backgroundColor: tc.cardBackgroundAlt,
            minHeight: 100,
            marginTop: 16,
            marginBottom: 8,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            width:wp(80),
            alignItems:'center',
            gap:wp(2)
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
