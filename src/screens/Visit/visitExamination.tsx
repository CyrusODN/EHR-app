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

interface VisitExaminationProps {
    onNext: () => void;
    onBack: () => void;
    visitData?: any;
    onUpdate?: (data: any) => void;
}

const VisitExamination = ({ onNext, onBack, visitData, onUpdate }: VisitExaminationProps) => {
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
                <Text style={styles.title}>Physical Examination</Text>

                <View style={styles.formContainer}>
                    {/* Left Column */}
                    <View style={styles.column}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Blood Pressure</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="np. 120/80 mmHg"
                                placeholderTextColor="#94A3B8"
                                value={bloodPressure}
                                onChangeText={setBloodPressure}
                                onBlur={() => {
                                    if (onUpdate && (visitData?.examination?.bloodPressure !== bloodPressure)) {
                                        onUpdate({ examination: { bloodPressure } });
                                    }
                                }}
                            />
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Heart Rate (bpm)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 72"
                                placeholderTextColor="#94A3B8"
                                keyboardType="numeric"
                                value={heartRate}
                                onChangeText={setHeartRate}
                                onBlur={() => {
                                    if (onUpdate && (visitData?.examination?.heartRate !== heartRate)) {
                                        onUpdate({ examination: { heartRate } });
                                    }
                                }}
                            />
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Temperature (°C)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 36.6"
                                placeholderTextColor="#94A3B8"
                                keyboardType="numeric"
                                value={temperature}
                                onChangeText={setTemperature}
                                onBlur={() => {
                                    if (onUpdate && (visitData?.examination?.temperature !== temperature)) {
                                        onUpdate({ examination: { temperature } });
                                    }
                                }}
                            />
                        </View>
                    </View>

                    {/* Right Column */}
                    <View style={styles.column}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>General Condition</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder=""
                                placeholderTextColor="#94A3B8"
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                value={generalCondition}
                                onChangeText={setGeneralCondition}
                                onBlur={() => {
                                    if (onUpdate && (visitData?.examination?.generalCondition !== generalCondition)) {
                                        onUpdate({ examination: { generalCondition } });
                                    }
                                }}
                            />
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Additional Findings</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Other observations..."
                                placeholderTextColor="#94A3B8"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                value={additionalFindings}
                                onChangeText={setAdditionalFindings}
                                onBlur={() => {
                                    if (onUpdate && (visitData?.examination?.additionalFindings !== additionalFindings)) {
                                        onUpdate({ examination: { additionalFindings } });
                                    }
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
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onNext}>
                    <LinearGradient
                        colors={['#58A7B3', '#8ED1CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextButtonText}>Next</Text>
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
