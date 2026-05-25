import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Platform,
    Animated,
    LayoutAnimation,
    UIManager,
    ActivityIndicator,
    Alert,
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CreateVisit, CancelVisit, UpdateVisit, GetVisitDetails } from '../../Services/Visit.Service';
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
    const [isCreatingVisit, setIsCreatingVisit] = useState(false);
    const [createdVisitId, setCreatedVisitId] = useState<string | null>(null);
    const [createdVisitDetails, setCreatedVisitDetails] = useState<any>(null);

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

    const formatTimeForApi = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatDateForApi = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const handleCreateNextVisit = async () => {
        setIsCreatingVisit(true);
        try {
            const visitPayload = {
                date: formatDateForApi(visitDate),
                startTime: formatTimeForApi(startTime),
                endTime: formatTimeForApi(endTime),
                patientId: visitData?.patient?.id || visitData?.patient?._id || visitData?.patientId,
                doctorId: visitData?.doctor?.id || visitData?.doctor?._id || visitData?.doctorId,
                officeId: visitData?.officeId || visitData?.facility,
                visitType: visitData?.visitType || 'private',
                specialization: visitData?.specialization || 'psychiatry',
                isOnline: visitData?.isOnline || false,
                notes: `${t('visit.summary.nextVisitLabels.followUpNotes')} ${visitData?.patient?.name || ''}`,
                parentVisitId: visitData?.id || visitData?._id || visitId,
            };

            const response = await CreateVisit(visitPayload);

            if (response?.data?.id || response?.data?._id || response?.visitId) {
                const newVisitId = response.data?.id || response.data?._id || response.visitId;
                setCreatedVisitId(newVisitId);
                setCreatedVisitDetails({
                    date: formatDate(visitDate),
                    startTime: formatTime(startTime),
                    endTime: formatTime(endTime),
                    patient: visitData?.patient?.name,
                    doctor: visitData?.doctor?.name,
                });

                if (onUpdate) {
                    onUpdate({
                        ...visitData,
                        nextVisit: {
                            date: formatDateForApi(visitDate),
                            startTime: formatTimeForApi(startTime),
                            endTime: formatTimeForApi(endTime),
                            visitId: newVisitId,
                            status: 'scheduled',
                            doctor: visitData?.doctor,
                            patient: visitData?.patient,
                        }
                    });
                }

                Alert.alert(
                    t('visit.summary.nextVisitLabels.successTitle'),
                    t('visit.summary.nextVisitLabels.successMessage')
                );
            } else {
                throw new Error(t('visit.summary.nextVisitLabels.errorMessage'));
            }
        } catch (error: any) {
            console.error('Error creating next visit:', error);
            Alert.alert(
                t('visit.summary.nextVisitLabels.errorTitle'),
                error?.message || t('visit.summary.nextVisitLabels.errorMessage')
            );
        } finally {
            setIsCreatingVisit(false);
        }
    };

    const handleCancelNextVisit = async () => {
        if (!createdVisitId) return;

        Alert.alert(
            t('visit.summary.nextVisitLabels.cancelConfirmTitle'),
            t('visit.summary.nextVisitLabels.cancelConfirmMessage'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('visit.summary.nextVisitLabels.cancelConfirm'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await CancelVisit(createdVisitId);
                            setCreatedVisitId(null);
                            setCreatedVisitDetails(null);

                            if (onUpdate) {
                                onUpdate({
                                    ...visitData,
                                    nextVisit: null,
                                });
                            }

                            Alert.alert(
                                t('visit.summary.nextVisitLabels.cancelSuccessTitle'),
                                t('visit.summary.nextVisitLabels.cancelSuccessMessage')
                            );
                        } catch (error: any) {
                            console.error('Error cancelling next visit:', error);
                            Alert.alert(
                                t('visit.summary.nextVisitLabels.errorTitle'),
                                t('visit.summary.nextVisitLabels.cancelErrorMessage')
                            );
                        }
                    }
                }
            ]
        );
    };

    const handleRecommendationsSave = (recommendations: any) => {
        if (onUpdate) {
            onUpdate({
                ...visitData,
                recommendations: {
                    ...(visitData?.recommendations || {}),
                    ...recommendations,
                }
            });
        }
        debouncedSync({ recommendations });
        setShowRecommendationModal(false);
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        LayoutAnimation.configureNext({
            duration: 300,
            create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
            update: { type: LayoutAnimation.Types.easeInEaseOut },
            delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
        });
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const getDocumentCount = () => {
        let count = 0;
        if (visitData?.prescriptions?.length) count += visitData.prescriptions.length;
        else if (visitData?.isPrescription) count += 1;
        if (visitData?.referrals?.length) count += visitData.referrals.length;
        else if (visitData?.isReferral) count += 1;
        if (visitData?.sickLeave) count += 1;
        return count;
    };

    const getRecommendationCount = () => {
        let count = 0;
        if (visitData?.recommendations?.medications?.length) count += visitData.recommendations.medications.length;
        if (visitData?.recommendations?.scales?.length) count += visitData.recommendations.scales.length;
        if (visitData?.recommendations?.aiAssistance?.features) {
            count += Object.values(visitData.recommendations.aiAssistance.features).filter(Boolean).length;
        }
        return count;
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

    const renderMedicationSchedule = () => {
        const medications = visitData?.recommendations?.medications;
        if (!medications?.length) return null;

        return (
            <View style={ds.subSection}>
                <View style={ds.subSectionHeader}>
                    <MaterialCommunityIcons name="pill" size={16} color="#58A7B3" />
                    <Text style={ds.subSectionTitle}>{t('visit.summary.medicationSchedule')}</Text>
                </View>
                {medications.map((med: any, index: number) => (
                    <View key={index} style={ds.medicationCard}>
                        <Text style={ds.medicationName}>{med.medication?.name || med.name}</Text>
                        <Text style={ds.medicationInstructions}>{med.instructions}</Text>
                        {med.duration && (
                            <Text style={ds.medicationDetail}>
                                {t('visit.summary.duration')}: {med.duration}
                            </Text>
                        )}
                        {med.reminders?.enabled && (
                            <View style={ds.reminderRow}>
                                <Feather name="bell" size={12} color="#58A7B3" />
                                <Text style={ds.reminderText}>
                                    {t('visit.summary.reminders')}: {med.reminders.times?.join(', ')}
                                </Text>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        );
    };

    const renderMonitoringScales = () => {
        const scales = visitData?.recommendations?.scales;
        if (!scales?.length) return null;

        return (
            <View style={ds.subSection}>
                <View style={ds.subSectionHeader}>
                    <MaterialCommunityIcons name="test-tube" size={16} color="#58A7B3" />
                    <Text style={ds.subSectionTitle}>{t('visit.summary.monitoringScales')}</Text>
                </View>
                {scales.map((scale: any, index: number) => (
                    <View key={index} style={ds.scaleCard}>
                        <Text style={ds.scaleName}>{scale.scale}</Text>
                        <Text style={ds.scaleDetails}>
                            {t('visit.summary.every')} {scale.frequencyDays} {t('visit.summary.days')}, {t('visit.summary.starting')} {scale.startDate}
                        </Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderAiFeatures = () => {
        const aiAssistance = visitData?.recommendations?.aiAssistance;
        if (!aiAssistance?.enabled && !aiAssistance?.features) return null;

        return (
            <View style={ds.subSection}>
                <View style={ds.subSectionHeader}>
                    <MaterialCommunityIcons name="brain" size={16} color="#58A7B3" />
                    <Text style={ds.subSectionTitle}>{t('visit.summary.aiTitle')}</Text>
                </View>
                <View style={ds.aiGrid}>
                    {aiAssistance?.features ? (
                        Object.entries(aiAssistance.features).map(([key, value]) => {
                            if (value) {
                                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                return (
                                    <View key={key} style={ds.aiToolPill}>
                                        <Text style={ds.aiToolText}>{formattedKey}</Text>
                                    </View>
                                );
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
        );
    };

    const renderDetailedDocuments = () => {
        const hasPrescriptions = visitData?.prescriptions?.length > 0;
        const hasReferrals = visitData?.referrals?.length > 0;
        const hasSickLeave = !!visitData?.sickLeave;
        const hasSimpleFlags = visitData?.isPrescription || visitData?.isReferral;

        if (!hasPrescriptions && !hasReferrals && !hasSickLeave && !hasSimpleFlags) {
            return <Text style={ds.placeholderText}>{t('visit.summary.emptyDocuments')}</Text>;
        }

        return (
            <View>
                {/* Detailed Prescriptions */}
                {hasPrescriptions && visitData.prescriptions.map((prescription: any, pIndex: number) => (
                    <View key={`rx-${pIndex}`} style={ds.documentSection}>
                        <View style={ds.documentHeaderRow}>
                            <MaterialCommunityIcons name="pill" size={16} color="#58A7B3" />
                            <Text style={ds.documentTypeTitle}>
                                {t('visit.summary.documentTypes.prescription')} {visitData.prescriptions.length > 1 ? `#${pIndex + 1}` : ''}
                            </Text>
                            {prescription.status && (
                                <View style={[ds.statusBadge, prescription.status === 'signed' ? ds.statusSigned : ds.statusDraft]}>
                                    <Text style={ds.statusText}>{prescription.status}</Text>
                                </View>
                            )}
                        </View>
                        {prescription.medications?.map((med: any, mIndex: number) => (
                            <View key={`med-${mIndex}`} style={ds.medicationDetailCard}>
                                <Text style={ds.medDetailName}>{med.name}</Text>
                                {med.dosage && <Text style={ds.medDetailDosage}>{med.dosage}</Text>}
                                {med.quantity !== undefined && (
                                    <Text style={ds.medDetailQuantity}>
                                        {t('visit.summary.documentLabels.quantity')}: {med.quantity}
                                    </Text>
                                )}
                                {med.instructions && (
                                    <Text style={ds.medDetailInstructions}>{med.instructions}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                ))}

                {/* Simple prescription flag fallback */}
                {!hasPrescriptions && visitData?.isPrescription && (
                    <View style={ds.documentSection}>
                        <View style={ds.documentHeaderRow}>
                            <MaterialCommunityIcons name="pill" size={16} color="#58A7B3" />
                            <Text style={ds.documentTypeTitle}>{t('visit.summary.prescriptionIssued')}</Text>
                        </View>
                    </View>
                )}

                {/* Detailed Referrals */}
                {hasReferrals && visitData.referrals.map((referral: any, rIndex: number) => (
                    <View key={`ref-${rIndex}`} style={ds.documentSection}>
                        <View style={ds.documentHeaderRow}>
                            <Feather name="send" size={16} color="#58A7B3" />
                            <Text style={ds.documentTypeTitle}>
                                {t('visit.summary.documentTypes.referral')}
                            </Text>
                        </View>
                        {referral.specialization && (
                            <Text style={ds.referralSpecialization}>
                                {t('visit.summary.documentLabels.specialization')}: {referral.specialization}
                            </Text>
                        )}
                        {referral.reason && (
                            <Text style={ds.referralReason}>
                                {t('visit.summary.documentLabels.reason')}: {referral.reason}
                            </Text>
                        )}
                    </View>
                ))}

                {/* Simple referral flag fallback */}
                {!hasReferrals && visitData?.isReferral && (
                    <View style={ds.documentSection}>
                        <View style={ds.documentHeaderRow}>
                            <Feather name="send" size={16} color="#58A7B3" />
                            <Text style={ds.documentTypeTitle}>{t('visit.summary.referralIssued')}</Text>
                        </View>
                    </View>
                )}

                {/* Sick Leave */}
                {hasSickLeave && (
                    <View style={ds.documentSection}>
                        <View style={ds.documentHeaderRow}>
                            <Feather name="calendar" size={16} color="#58A7B3" />
                            <Text style={ds.documentTypeTitle}>
                                {t('visit.summary.documentTypes.sickLeave')}
                            </Text>
                            {visitData.sickLeave.status && (
                                <View style={[ds.statusBadge, visitData.sickLeave.status === 'signed' ? ds.statusSigned : ds.statusDraft]}>
                                    <Text style={ds.statusText}>{visitData.sickLeave.status}</Text>
                                </View>
                            )}
                        </View>
                        <View style={ds.sickLeaveDetails}>
                            <View style={ds.sickLeaveRow}>
                                <Text style={ds.sickLeaveLabel}>{t('visit.summary.documentLabels.startDate')}:</Text>
                                <Text style={ds.sickLeaveValue}>{visitData.sickLeave.startDate}</Text>
                            </View>
                            <View style={ds.sickLeaveRow}>
                                <Text style={ds.sickLeaveLabel}>{t('visit.summary.documentLabels.endDate')}:</Text>
                                <Text style={ds.sickLeaveValue}>{visitData.sickLeave.endDate}</Text>
                            </View>
                            {visitData.sickLeave.reason && (
                                <Text style={ds.sickLeaveReason}>{visitData.sickLeave.reason}</Text>
                            )}
                        </View>
                    </View>
                )}
            </View>
        );
    };

    const renderNextVisitContent = () => {
        if (createdVisitId && createdVisitDetails) {
            return (
                <View style={ds.createdVisitContainer}>
                    <View style={ds.createdVisitHeader}>
                        <View style={ds.createdVisitCheckRow}>
                            <Feather name="check-circle" size={20} color="#58A7B3" />
                            <Text style={ds.createdVisitTitle}>{t('visit.summary.nextVisitLabels.created')}</Text>
                        </View>
                        <TouchableOpacity
                            style={ds.cancelVisitButton}
                            onPress={handleCancelNextVisit}
                        >
                            <Feather name="x" size={18} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                    <View style={ds.createdVisitInfo}>
                        <View style={ds.createdVisitRow}>
                            <Text style={ds.createdVisitLabel}>{t('visit.summary.nextVisitLabels.date')}:</Text>
                            <Text style={ds.createdVisitValue}>{createdVisitDetails.date}</Text>
                        </View>
                        <View style={ds.createdVisitRow}>
                            <Text style={ds.createdVisitLabel}>{t('visit.summary.nextVisitLabels.time')}:</Text>
                            <Text style={ds.createdVisitValue}>{createdVisitDetails.startTime} - {createdVisitDetails.endTime}</Text>
                        </View>
                        {createdVisitDetails.patient && (
                            <View style={ds.createdVisitRow}>
                                <Text style={ds.createdVisitLabel}>{t('visit.summary.nextVisitLabels.patient')}:</Text>
                                <Text style={ds.createdVisitValue}>{createdVisitDetails.patient}</Text>
                            </View>
                        )}
                        {createdVisitDetails.doctor && (
                            <View style={ds.createdVisitRow}>
                                <Text style={ds.createdVisitLabel}>{t('visit.summary.nextVisitLabels.doctor')}:</Text>
                                <Text style={ds.createdVisitValue}>{createdVisitDetails.doctor}</Text>
                            </View>
                        )}
                    </View>
                </View>
            );
        }

        return (
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

                <TouchableOpacity 
                    style={[ds.createVisitBtn, isCreatingVisit && ds.createVisitBtnDisabled]}
                    onPress={handleCreateNextVisit}
                    disabled={isCreatingVisit}
                >
                    <LinearGradient
                        colors={isCreatingVisit ? ['#94D3D9', '#B8E2DE'] : ['#58A7B3', '#8ED1CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={ds.createVisitGradient}
                    >
                        {isCreatingVisit ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Feather name="check" size={18} color="#fff" />
                        )}
                        <Text style={ds.createVisitText}>
                            {isCreatingVisit 
                                ? t('visit.summary.nextVisitLabels.creating') 
                                : t('visit.summary.nextVisitLabels.create')
                            }
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
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
                            <View style={ds.diagnosisList}>
                                {visitData.diagnosis.icd10.map((diag: any, index: number) => (
                                    <View key={index} style={ds.diagnosisItem}>
                                        <View style={ds.diagnosisCodeRow}>
                                            <View style={ds.diagnosisCodeBadge}>
                                                <Text style={ds.diagnosisCodeText}>{diag.code || diag}</Text>
                                            </View>
                                            {diag.classification && (
                                                <View style={[
                                                    ds.classificationBadge,
                                                    diag.classification === 'Primary' ? ds.classificationPrimary : ds.classificationSecondary
                                                ]}>
                                                    <Text style={[
                                                        ds.classificationText,
                                                        diag.classification === 'Primary' ? ds.classificationPrimaryText : ds.classificationSecondaryText
                                                    ]}>
                                                        {diag.classification}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                        {diag.name && (
                                            <Text style={ds.diagnosisName}>{diag.name}</Text>
                                        )}
                                        {diag.addedAt && (
                                            <Text style={ds.diagnosisDate}>
                                                {t('visit.summary.addedAt')}: {new Date(diag.addedAt).toLocaleString()}
                                            </Text>
                                        )}
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
                {renderHeader(t('visit.summary.sections.documents'), 'file-text', 'feather', getDocumentCount(), 'documents')}
                {expandedSections.documents && (
                    <View style={ds.cardContent}>
                        {renderDetailedDocuments()}
                    </View>
                )}
            </View>

            {/* Psychiatric Recommendations Card */}
            <View style={ds.card}>
                {renderHeader(t('visit.summary.sections.recommendations'), 'brain', 'material', getRecommendationCount(), 'psychiatric', true)}
                {expandedSections.psychiatric && (
                    <View style={ds.cardContent}>
                        {visitData?.recommendations ? (
                            <View>
                                {renderMedicationSchedule()}
                                {renderMonitoringScales()}
                                {renderAiFeatures()}
                                {!visitData?.recommendations?.medications?.length && 
                                 !visitData?.recommendations?.scales?.length && 
                                 !visitData?.recommendations?.aiAssistance?.features && (
                                    <Text style={ds.placeholderText}>{t('visit.summary.noRecommendations')}</Text>
                                )}
                            </View>
                        ) : (
                            <View style={ds.emptyRecommendations}>
                                <MaterialCommunityIcons name="brain" size={32} color={tc.textMuted} style={{ opacity: 0.5, marginBottom: 8 }} />
                                <Text style={ds.placeholderText}>{t('visit.summary.noRecommendations')}</Text>
                                <Text style={ds.placeholderSubtext}>{t('visit.summary.noRecommendationsHelper')}</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Next Visit Card */}
            <View style={ds.card}>
                {renderHeader(
                    t('visit.summary.sections.nextVisit'), 
                    'calendar', 
                    'feather', 
                    createdVisitId ? 1 : undefined, 
                    'nextVisit'
                )}
                {expandedSections.nextVisit && (
                    <View style={ds.cardContent}>
                        {renderNextVisitContent()}
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
                onSave={handleRecommendationsSave}
                visitData={visitData}
                initialRecommendations={visitData?.recommendations}
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
            textAlign: 'center',
        },
        placeholderSubtext: {
            fontSize: 12,
            color: tc.textMuted,
            marginTop: 4,
            textAlign: 'center',
        },

        // Diagnoses
        diagnosisList: {
            marginTop: 12,
        },
        diagnosisItem: {
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: tc.borderColor,
        },
        diagnosisCodeRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
        },
        diagnosisCodeBadge: {
            backgroundColor: isDark ? 'rgba(88, 167, 179, 0.2)' : '#E2F2F4',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
        },
        diagnosisCodeText: {
            fontSize: 13,
            fontWeight: '700',
            color: '#58A7B3',
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        },
        classificationBadge: {
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 10,
            marginLeft: 8,
        },
        classificationPrimary: {
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#DBEAFE',
        },
        classificationSecondary: {
            backgroundColor: isDark ? 'rgba(156, 163, 175, 0.2)' : '#F3F4F6',
        },
        classificationText: {
            fontSize: 11,
            fontWeight: '600',
        },
        classificationPrimaryText: {
            color: isDark ? '#93C5FD' : '#1D4ED8',
        },
        classificationSecondaryText: {
            color: isDark ? '#D1D5DB' : '#374151',
        },
        diagnosisName: {
            fontSize: 14,
            color: tc.textSecondary,
            marginTop: 4,
            lineHeight: 20,
        },
        diagnosisDate: {
            fontSize: 11,
            color: tc.textMuted,
            marginTop: 4,
        },

        // Documents
        documentSection: {
            marginTop: 12,
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : tc.cardBackgroundAlt,
            borderRadius: 8,
            padding: 12,
            marginBottom: 4,
        },
        documentHeaderRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        documentTypeTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.textPrimary,
            marginLeft: 8,
            flex: 1,
        },
        statusBadge: {
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 10,
        },
        statusSigned: {
            backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : '#DCFCE7',
        },
        statusDraft: {
            backgroundColor: isDark ? 'rgba(234, 179, 8, 0.2)' : '#FEF9C3',
        },
        statusText: {
            fontSize: 11,
            fontWeight: '600',
            color: isDark ? '#86EFAC' : '#166534',
        },
        medicationDetailCard: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#fff',
            borderRadius: 6,
            padding: 10,
            marginBottom: 6,
            borderWidth: 1,
            borderColor: tc.borderColor,
        },
        medDetailName: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textPrimary,
        },
        medDetailDosage: {
            fontSize: 13,
            color: tc.textSecondary,
            marginTop: 2,
        },
        medDetailQuantity: {
            fontSize: 12,
            color: tc.textMuted,
            marginTop: 2,
        },
        medDetailInstructions: {
            fontSize: 12,
            color: tc.textMuted,
            fontStyle: 'italic',
            marginTop: 4,
        },
        referralSpecialization: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textPrimary,
        },
        referralReason: {
            fontSize: 13,
            color: tc.textSecondary,
            marginTop: 4,
        },
        sickLeaveDetails: {
            marginTop: 4,
        },
        sickLeaveRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 4,
        },
        sickLeaveLabel: {
            fontSize: 13,
            color: tc.textMuted,
        },
        sickLeaveValue: {
            fontSize: 13,
            fontWeight: '600',
            color: tc.textPrimary,
        },
        sickLeaveReason: {
            fontSize: 13,
            color: tc.textSecondary,
            marginTop: 4,
            fontStyle: 'italic',
        },

        // Recommendations sub-sections
        subSection: {
            marginTop: 16,
        },
        subSectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        subSectionTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: tc.textPrimary,
            marginLeft: 8,
        },
        medicationCard: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : tc.cardBackgroundAlt,
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
        },
        medicationName: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textPrimary,
        },
        medicationInstructions: {
            fontSize: 13,
            color: tc.textSecondary,
            marginTop: 4,
        },
        medicationDetail: {
            fontSize: 12,
            color: tc.textMuted,
            marginTop: 2,
        },
        reminderRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6,
        },
        reminderText: {
            fontSize: 12,
            color: '#58A7B3',
            marginLeft: 4,
        },
        scaleCard: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : tc.cardBackgroundAlt,
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
        },
        scaleName: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textPrimary,
        },
        scaleDetails: {
            fontSize: 13,
            color: tc.textSecondary,
            marginTop: 4,
        },
        emptyRecommendations: {
            alignItems: 'center',
            paddingVertical: 20,
        },

        // AI features
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

        // Next Visit
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
        createVisitBtnDisabled: {
            opacity: 0.7,
        },
        createVisitGradient: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 48,
            width: wp(43),
            borderRadius: 8,
        },
        createVisitText: {
            color: '#fff',
            fontSize: 14,
            fontWeight: '700',
            marginLeft: 8,
        },

        // Created visit display
        createdVisitContainer: {
            marginTop: 12,
            backgroundColor: isDark ? 'rgba(88, 167, 179, 0.1)' : '#E2F2F4',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(88, 167, 179, 0.3)' : '#B8DDE3',
            padding: 16,
        },
        createdVisitHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        createdVisitCheckRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        createdVisitTitle: {
            fontSize: 15,
            fontWeight: '700',
            color: '#58A7B3',
            marginLeft: 8,
        },
        cancelVisitButton: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
            justifyContent: 'center',
            alignItems: 'center',
        },
        createdVisitInfo: {
            gap: 6,
        },
        createdVisitRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 2,
        },
        createdVisitLabel: {
            fontSize: 13,
            color: isDark ? 'rgba(88, 167, 179, 0.8)' : '#4A8D97',
        },
        createdVisitValue: {
            fontSize: 13,
            fontWeight: '600',
            color: isDark ? '#A3D5DB' : '#2D6E78',
        },

        // General recommendations
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

        // Footer
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            width: wp(80),
            alignItems: 'center',
            gap: wp(2),
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
