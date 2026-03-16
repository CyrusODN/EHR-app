import React, { useState } from 'react';
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
}

const VisitExamination = ({ onNext, onBack }: VisitExaminationProps) => {
    const [bloodPressure, setBloodPressure] = useState('');
    const [heartRate, setHeartRate] = useState('');
    const [temperature, setTemperature] = useState('');
    const [generalCondition, setGeneralCondition] = useState('');
    const [additionalFindings, setAdditionalFindings] = useState('');

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
                            />
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Heart Rate</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="np. 72/min"
                                placeholderTextColor="#94A3B8"
                                value={heartRate}
                                onChangeText={setHeartRate}
                            />
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Temperature</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="np. 36.6°C"
                                placeholderTextColor="#94A3B8"
                                value={temperature}
                                onChangeText={setTemperature}
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
                            />
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Additional Findings</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder=""
                                placeholderTextColor="#94A3B8"
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                value={additionalFindings}
                                onChangeText={setAdditionalFindings}
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
