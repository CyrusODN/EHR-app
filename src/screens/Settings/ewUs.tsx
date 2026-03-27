import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Switch,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CustomDropdown from '../../component/customDropDown';
import PrimaryButton from '../../component/button';
import Feather from 'react-native-vector-icons/Feather';
import Gap from '../../component/gap';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const EWUS = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    // State for switches and inputs
    const [autoInsuranceCheck, setAutoInsuranceCheck] = useState(true);
    const [eWUSSystem, setEWUSSystem] = useState(true);
    const [personnelCode, setPersonnelCode] = useState('11234590');
    const [login, setLogin] = useState('');

    const [branch, setBranch] = useState<string | number>('');
    const [contractor, setContractor] = useState<string | number>('');

    // Departments
    const departments = [
        { label: t('settings.ewus.departments.maritime'), value: 'Maritime (11)' },
        { label: t('settings.ewus.departments.masovian'), value: 'Masovian (07)' },
        { label: t('settings.ewus.departments.silesian'), value: 'Silesian (12)' }
    ];

    // Contractor Types
    const contractorTypes = [
        { label: t('settings.ewus.contractor_types.doctor'), value: 'Doctor' },
        { label: t('settings.ewus.contractor_types.clinic'), value: 'Clinic' },
        { label: t('settings.ewus.contractor_types.hospital'), value: 'Hospital' }
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.headerIconContainer}>
                        <Ionicons name="shield-outline" size={24} color="#4A90B9" />
                    </View>
                    <Text style={styles.headerTitle}>{t('settings.ewus.title')}</Text>
                </View>

                {/* Automatic Insurance Check */}
                <View style={styles.settingRow}>
                    <View style={styles.settingTextContainer}>
                        <Text style={styles.settingTitle}>{t('settings.ewus.auto_insurance')}</Text>
                        <Ionicons
                            name="information-circle-outline"
                            size={20}
                            color="#666666"
                            style={styles.infoIcon}
                        />
                    </View>
                    <Switch
                        value={autoInsuranceCheck}
                        onValueChange={setAutoInsuranceCheck}
                        trackColor={{ false: '#D1D1D6', true: '#4A90B9' }}
                        thumbColor={'#FFFFFF'}
                    />
                </View>

                {/* eWUŚ System */}
                <View style={styles.settingRow}>
                    <Text style={styles.settingTitle}>{t('settings.ewus.system_ewus')}</Text>
                    <Switch
                        value={eWUSSystem}
                        onValueChange={setEWUSSystem}
                        trackColor={{ false: '#D1D1D6', true: '#4A90B9' }}
                        thumbColor={'#FFFFFF'}
                    />
                </View>

                {/* Branch Dropdown */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{t('settings.ewus.branch')}</Text>
                    <View style={styles.pickerContainer}>
                        <CustomDropdown
                            placeholder={t('settings.ewus.placeholders.maritime')}
                            options={departments}
                            value={branch}
                            onChange={setBranch}
                            icon={undefined}
                        />
                    </View>
                </View>

                {/* Contractor Type Dropdown */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{t('settings.ewus.contractor_type')}</Text>
                    <View style={styles.pickerContainer}>
                        <CustomDropdown
                            placeholder={t('settings.ewus.placeholders.doctor')}
                            options={contractorTypes}
                            value={contractor}
                            onChange={setContractor}
                            icon={undefined}
                        />
                    </View>
                </View>

                {/* Personnel Code Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{t('settings.ewus.personnel_code')}</Text>
                    <TextInput
                        style={styles.textInput}
                        value={personnelCode}
                        onChangeText={setPersonnelCode}
                        placeholder={t('settings.ewus.placeholders.enter_personnel_code')}
                    />
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{t('settings.ewus.login')}</Text>
                    <TextInput
                        style={styles.textInput}
                        value={login}
                        onChangeText={setLogin}
                        placeholder={t('settings.ewus.placeholders.enter_login')}
                        secureTextEntry
                    />
                </View>

                {/* Password Section */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{t('settings.ewus.password')}</Text>
                    <Text style={styles.passwordText}>{t('settings.ewus.not_changed')}</Text>
                </View>
                <View style={{ backgroundColor: "white" }}>


                    <PrimaryButton
                        label={'Save and verify data accuracy'}
                        filled={true}
                        onPress={() => { }}
                        style={{ width: wp(85), alignSelf: "center" }}
                        icon={<Feather name="save" color='white' size={20} />}
                        image={undefined}
                        iconStyle={undefined}
                        imageStyle={undefined}
                        loading={false}
                        disabled={false}
                    />
                    {/* Action Buttons */}

                    <PrimaryButton
                        label={'Change Password'}
                        filled={false}
                        onPress={() => { }}
                        style={{ width: wp(85), alignSelf: "center" }}
                        icon={<Feather name="key" color='#4A90B9' size={20} />}
                        image={undefined}
                        iconStyle={undefined}
                        imageStyle={undefined}
                        loading={false}
                        disabled={false}
                    />

                    <PrimaryButton
                        label={'Check Now'}
                        filled={true}
                        onPress={() => { }}
                        style={{ alignSelf: "center", width: wp(85) }}
                        icon={undefined}
                        image={undefined}
                        iconStyle={undefined}
                        imageStyle={undefined}
                        loading={false}
                        disabled={false}
                    />
                    <Gap height={hp(2)} />
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#E8F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    settingTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingTitle: {
        fontSize: 16,
        color: 'black',
        marginRight: 8,
    },
    infoIcon: {
        marginLeft: 4,
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    inputLabel: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 8,
    },
    pickerContainer: {
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    },
    textInput: {
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333333',
    },
    passwordText: {
        fontSize: 16,
        color: '#666666',
        fontStyle: 'italic',
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    actionButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    primaryButton: {
        flex: 0.7,
        backgroundColor: '#4A90B9',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    secondaryButton: {
        flex: 0.3,
        backgroundColor: '#E8F4F8',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    secondaryButtonText: {
        color: '#4A90B9',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    checkNowButton: {
        backgroundColor: '#4A90B9',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        margin: 16,
        alignItems: 'center',
    },
    checkNowButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default EWUS;