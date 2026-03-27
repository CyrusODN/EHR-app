import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import PrimaryButton from '../../../component/button';
import CustomTextInput from '../../../component/customTextInput';
import Gap from '../../../component/gap';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../../../hooks/useThemeColors';

const Diagnosis = () => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const [symptoms, setSymptoms] = useState('');
    const [symptomsList, setSymptomsList] = useState<string[]>([]);

    const handleAddSymptom = () => {
        if (symptoms.trim()) {
            setSymptomsList([...symptomsList, symptoms.trim()]);
            setSymptoms('');
        }
    };

    return (
        <View style={ds.contentContainer}>
            <Text style={ds.sectionTitle}>{t('aiAssistant.diagnosis.title')}</Text>
            <Text style={ds.label} >
                {t('aiAssistant.diagnosis.symptoms')}
            </Text>
            <Gap height={hp(1)} />
            <View style={ds.symptomsContainer}>
                <View style={ds.inputWrapper}>
                    <CustomTextInput
                        placeholder={t('aiAssistant.diagnosis.enterSymptom')}
                        value={symptoms}
                        onChangeText={setSymptoms}
                    />
                </View>

                <PrimaryButton
                    label={t('aiAssistant.diagnosis.add')}
                    filled={false}
                    onPress={handleAddSymptom}
                    style={ds.addButton}
                />
            </View>
            <PrimaryButton
                label={t('aiAssistant.diagnosis.analyze')}
                filled={true}
                onPress={() => { }}
                style={ds.analyzeButton}
                icon={<Feather name="search" color={"#FFF"} size={18} />}
            />
        </View>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    contentContainer: {
        padding: 20,
        backgroundColor: tc.cardBackground,
        margin: 15,
        borderRadius: 12,
        shadowColor: tc.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: isDark ? 1 : 0,
        borderColor: tc.borderSubtle,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: tc.textPrimary,
    },
    label: {
        fontSize: 14,
        color: tc.textSecondary,
        marginBottom: 8,
    },
    symptomsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 12,
    },
    inputWrapper: {
        flex: 1,
    },
    addButton: {
        width: '30%',
        height: 48,
        marginBottom: 0,
        borderRadius: 10,
    },
    analyzeButton: {
        width: '100%',
        height: 52,
        marginBottom: 0,
        borderRadius: 10,
    },
});

export default Diagnosis;
