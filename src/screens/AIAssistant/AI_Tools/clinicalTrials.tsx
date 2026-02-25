import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import PrimaryButton from '../../../component/button';
import CustomTextInput from '../../../component/customTextInput';
import Gap from '../../../component/gap';

const ClinicalTrials = () => {
    const [diagnosis, setDiagnosis] = useState('');
    const [location, setLocation] = useState('');

    return (
        <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Clinical Research Search</Text>
            <Text style={{ color: "black" }} >
                Diagnosis
            </Text>

            <Gap height={hp(1)} />

            <CustomTextInput
                placeholder={'e.g. Migraine'}
                value={diagnosis}
                onChangeText={setDiagnosis}
                icon={undefined}
                right={undefined}
                onRightPress={undefined}
                keyboardType={undefined}
            />

            <Gap height={hp(2)} />

            <Text style={{ color: "black" }} >
                Location
            </Text>

            <Gap height={hp(1)} />

            <CustomTextInput
                placeholder={'e.g. Warsaw'}
                value={location}
                onChangeText={setLocation}
                icon={undefined}
                right={undefined}
                onRightPress={undefined}
                keyboardType={undefined}
            />

            <Gap height={hp(2)} />

            <PrimaryButton
                label={"Search Studies"}
                filled={true}
                onPress={() => { }}
                style={{ width: '100%' }}
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
});

export default ClinicalTrials;
