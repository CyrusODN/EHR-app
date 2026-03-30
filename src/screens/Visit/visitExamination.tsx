import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { GetPreviousVisits, UpdateVisit, GetVisitDetails } from '../../Services/Visit.Service';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../hooks/useThemeColors';

interface VisitExaminationProps {
    onNext: () => void;
    onBack: () => void;
    visitId?: string;
    visitData?: any;
    onUpdate?: (data: any) => void;
}

const VisitExamination = ({ onNext, onBack, visitId, visitData, onUpdate }: VisitExaminationProps) => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const [bloodPressure, setBloodPressure] = useState(visitData?.examination?.bloodPressure || '');
    const [heartRate, setHeartRate] = useState(visitData?.examination?.heartRate || '');
    const [temperature, setTemperature] = useState(visitData?.examination?.temperature || '');
    const [generalCondition, setGeneralCondition] = useState(visitData?.examination?.generalCondition || '');
    const [additionalFindings, setAdditionalFindings] = useState(visitData?.examination?.additionalFindings || '');

    const debounceTimeoutRef = useRef<any>(null);
    const pendingUpdatesRef = useRef<any>({});

    const handleSync = useCallback(async () => {
        if (!visitId) return;

        const updates = { ...pendingUpdatesRef.current };
        pendingUpdatesRef.current = {}; // Clear for next cycle

        // Construct payload
        const payload = {
            ...visitData,
            ...updates,
            visitId, id: visitId, _id: visitId
        };

        // Handle nested merges for examination fields
        if (updates.examination) {
            payload.examination = {
                ...(visitData?.examination || {}),
                ...updates.examination
            };
        }

        try {
            await UpdateVisit(payload);
            
            // Refresh full visit details from backend to ensure state consistency
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
        if (visitData?.examination) {
            setBloodPressure(visitData.examination.bloodPressure || '');
            setHeartRate(visitData.examination.heartRate || '');
            setTemperature(visitData.examination.temperature || '');
            setGeneralCondition(visitData.examination.generalCondition || '');
            setAdditionalFindings(visitData.examination.additionalFindings || '');
        }
    }, [visitData]);

    return (
        <ScrollView style={ds.container} showsVerticalScrollIndicator={false}>
            <View style={ds.card}>
                <Text style={ds.title}>{t('visit.examination.title')}</Text>

                <View style={ds.formContainer}>
                    {/* Left Column */}
                    <View style={ds.column}>
                        <View style={ds.fieldContainer}>
                            <Text style={ds.label}>{t('visit.examination.bloodPressure')}</Text>
                            <TextInput
                                style={ds.input}
                                placeholder={t('visit.examination.placeholders.bp')}
                                placeholderTextColor={tc.textMuted}
                                value={bloodPressure}
                                onChangeText={(text) => {
                                    setBloodPressure(text);
                                    debouncedSync({ examination: { bloodPressure: text } });
                                }}
                            />
                        </View>

                        <View style={ds.fieldContainer}>
                            <Text style={ds.label}>{t('visit.examination.heartRate')}</Text>
                            <TextInput
                                style={ds.input}
                                placeholder={t('visit.examination.placeholders.hr')}
                                placeholderTextColor={tc.textMuted}
                                keyboardType="numeric"
                                value={heartRate}
                                onChangeText={(text) => {
                                    setHeartRate(text);
                                    debouncedSync({ examination: { heartRate: text } });
                                }}
                            />
                        </View>

                        <View style={ds.fieldContainer}>
                            <Text style={ds.label}>{t('visit.examination.temperature')}</Text>
                            <TextInput
                                style={ds.input}
                                placeholder={t('visit.examination.placeholders.temp')}
                                placeholderTextColor={tc.textMuted}
                                keyboardType="numeric"
                                value={temperature}
                                onChangeText={(text) => {
                                    setTemperature(text);
                                    debouncedSync({ examination: { temperature: text } });
                                }}
                            />
                        </View>
                    </View>

                    {/* Right Column */}
                    <View style={ds.column}>
                        <View style={ds.fieldContainer}>
                            <Text style={ds.label}>{t('visit.examination.generalCondition')}</Text>
                            <TextInput
                                style={ds.textArea}
                                placeholder=""
                                placeholderTextColor={tc.textMuted}
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                value={generalCondition}
                                onChangeText={(text) => {
                                    setGeneralCondition(text);
                                    debouncedSync({ examination: { generalCondition: text } });
                                }}
                            />
                        </View>

                        <View style={ds.fieldContainer}>
                            <Text style={ds.label}>{t('visit.examination.additionalFindings')}</Text>
                            <TextInput
                                style={ds.textArea}
                                placeholder={t('visit.examination.placeholders.findings')}
                                placeholderTextColor={tc.textMuted}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                value={additionalFindings}
                                onChangeText={(text) => {
                                    setAdditionalFindings(text);
                                    debouncedSync({ examination: { additionalFindings: text } });
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={ds.footer}>
                <TouchableOpacity style={ds.backButton} onPress={onBack}>
                    <Feather name="arrow-left" size={18} color="#58A7B3" />
                    <Text style={ds.backButtonText}>{t('visit.navigation.previous')}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onNext}>
                    <LinearGradient
                        colors={['#58A7B3', '#8ED1CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={ds.nextButton}
                    >
                        <Text style={ds.nextButtonText}>{t('visit.navigation.next')}</Text>
                        <Feather name="arrow-right" size={18} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
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
            borderRadius: 12,
            padding: 20,
            borderWidth: 1,
            borderColor: tc.borderColor,
        },
        title: {
            fontSize: 18,
            fontWeight: '700',
            color: tc.textPrimary,
            marginBottom: 20,
        },
        formContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        column: {
            width: '48%',
        },
        fieldContainer: {
            marginBottom: 16,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: tc.textSecondary,
            marginBottom: 8,
        },
        input: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            padding: 12,
            fontSize: 14,
            color: tc.textPrimary,
            backgroundColor: tc.cardBackgroundAlt,
            height: hp(6),
        },
        textArea: {
            borderWidth: 1,
            borderColor: tc.borderColor,
            borderRadius: 8,
            padding: 12,
            fontSize: 14,
            color: tc.textPrimary,
            backgroundColor: tc.cardBackgroundAlt,
            minHeight: hp(15),
        },
        footer: {
            width: '80%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems:'center',
            marginTop: 20,
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
        nextButton: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 8,
            width: wp(43),
            height: 50,
            justifyContent: 'center',
        },
        nextButtonText: {
            fontSize: 16,
            color: '#fff',
            fontWeight: '700',
            marginRight: 8,
        },
    });

export default VisitExamination;
