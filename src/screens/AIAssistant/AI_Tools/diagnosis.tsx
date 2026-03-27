import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import PrimaryButton from '../../../component/button';
import CustomTextInput from '../../../component/customTextInput';
import Gap from '../../../component/gap';
import { useTranslation } from 'react-i18next';

const Diagnosis = () => {
    const { t } = useTranslation();
    const [symptoms, setSymptoms] = useState('');
    const [symptomsList, setSymptomsList] = useState<string[]>([]);

    const handleAddSymptom = () => {
        if (symptoms.trim()) {
            setSymptomsList([...symptomsList, symptoms.trim()]);
            setSymptoms('');
        }
    };

    return (
        <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>{t('aiAssistant.diagnosis.title')}</Text>
            <Text style={{ color: "black" }} >
                {t('aiAssistant.diagnosis.symptoms')}
            </Text>
            <Gap height={hp(1)} />
            <View style={styles.symptomsContainer}>

                <View style={{ flex: 1, marginEnd: 10 }}>
                    <CustomTextInput
                        placeholder={t('aiAssistant.diagnosis.enterSymptom')}
                        value={symptoms}
                        onChangeText={setSymptoms}
                        icon={undefined}
                        right={undefined}
                        onRightPress={undefined}
                        keyboardType={undefined}
                    />
                </View>

                <PrimaryButton
                    label={t('aiAssistant.diagnosis.add')}
                    filled={false}
                    onPress={handleAddSymptom}
                    style={{ width: '25%', marginBottom: 0 }}
                    icon={undefined}
                    image={undefined}
                    iconStyle={undefined}
                    imageStyle={undefined}
                />
            </View>
            <PrimaryButton
                label={t('aiAssistant.diagnosis.analyze')}
                filled={true}
                onPress={() => { }}
                style={{ width: '100%', marginBottom: 0 }}
                icon={<Feather name="search" color={"white"} size={18} />}
                image={undefined}
                iconStyle={undefined}
                imageStyle={undefined}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        padding: 15,
        backgroundColor: '#FFFFFF',
        margin: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333333',
        width: "50%"
    },
    symptomsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        justifyContent: "space-between",
        height: 50
    },
});

export default Diagnosis;
