import React, { useState, useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';

interface VisitExaminationProps {
    onNext: () => void;
    onBack: () => void;
    visitData?: any;
    onUpdate?: (data: any) => void;
}

const VisitExamination = ({ onNext, onBack, visitData, onUpdate }: VisitExaminationProps) => {
    const { t } = useTranslation();
    const [bloodPressure, setBloodPressure] = useState(visitData?.examination?.bloodPressure || '');
    const [heartRate, setHeartRate] = useState(visitData?.examination?.heartRate || '');
    const [temperature, setTemperature] = useState(visitData?.examination?.temperature || '');
    const [generalCondition, setGeneralCondition] = useState(visitData?.examination?.generalCondition || '');
    const [additionalFindings, setAdditionalFindings] = useState(visitData?.examination?.additionalFindings || '');

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
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
                <Text style={styles.title}>{t('visit.examination.title')}</Text>

                <View style={styles.formContainer}>
                    {/* Left Column */}
                    <View style={styles.column}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>{t('visit.examination.bloodPressure')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={t('visit.examination.placeholders.bp')}
                                placeholderTextColor="#94A3B8"
                                value={bloodPressure}
                                onChangeText={(text) => {
                                    setBloodPressure(text);
                                    if (onUpdate) onUpdate({ examination: { bloodPressure: text } });
                                }}
                            />
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>{t('visit.examination.heartRate')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={t('visit.examination.placeholders.hr')}
                                placeholderTextColor="#94A3B8"
                                keyboardType="numeric"
                                value={heartRate}
                                onChangeText={(text) => {
                                    setHeartRate(text);
                                    if (onUpdate) onUpdate({ examination: { heartRate: text } });
                                }}
                            />
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>{t('visit.examination.temperature')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={t('visit.examination.placeholders.temp')}
                                placeholderTextColor="#94A3B8"
                                keyboardType="numeric"
                                value={temperature}
                                onChangeText={(text) => {
                                    setTemperature(text);
                                    if (onUpdate) onUpdate({ examination: { temperature: text } });
                                }}
                            />
                        </View>
                    </View>

                    {/* Right Column */}
                    <View style={styles.column}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>{t('visit.examination.generalCondition')}</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder=""
                                placeholderTextColor="#94A3B8"
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                value={generalCondition}
                                onChangeText={(text) => {
                                    setGeneralCondition(text);
                                    if (onUpdate) onUpdate({ examination: { generalCondition: text } });
                                }}
                            />
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>{t('visit.examination.additionalFindings')}</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder={t('visit.examination.placeholders.findings')}
                                placeholderTextColor="#94A3B8"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                value={additionalFindings}
                                onChangeText={(text) => {
                                    setAdditionalFindings(text);
                                    if (onUpdate) onUpdate({ examination: { additionalFindings: text } });
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Feather name="arrow-left" size={18} color="#58A7B3" />
                    <Text style={styles.backButtonText}>{t('visit.navigation.previous')}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onNext}>
                    <LinearGradient
                        colors={['#58A7B3', '#8ED1CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextButtonText}>{t('visit.navigation.next')}</Text>
                        <Feather name="arrow-right" size={18} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
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
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
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
        color: '#64748B',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#1E293B',
        backgroundColor: '#fff',
        height: hp(6),
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#1E293B',
        backgroundColor: '#fff',
        minHeight: hp(15),
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
