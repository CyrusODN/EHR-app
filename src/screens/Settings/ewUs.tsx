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
import { useThemeColors } from '../../hooks/useThemeColors';

const EWUS = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);

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
        <View style={ds.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={tc.cardBackground} />
            <View style={ds.container}>
                {/* Header */}
                <View style={ds.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
                        <Ionicons name="chevron-back" size={24} color={tc.textPrimary} />
                    </TouchableOpacity>
                    <View style={ds.headerIconContainer}>
                        <Ionicons name="shield-outline" size={24} color={tc.accent} />
                    </View>
                    <Text style={ds.headerTitle}>{t('settings.ewus.title')}</Text>
                </View>

                {/* Automatic Insurance Check */}
                <View style={ds.settingRow}>
                    <View style={ds.settingTextContainer}>
                        <Text style={ds.settingTitle}>{t('settings.ewus.auto_insurance')}</Text>
                        <Ionicons
                            name="information-circle-outline"
                            size={20}
                            color={tc.textSecondary}
                            style={ds.infoIcon}
                        />
                    </View>
                    <Switch
                        value={autoInsuranceCheck}
                        onValueChange={setAutoInsuranceCheck}
                        trackColor={{ false: tc.borderSubtle, true: tc.accent }}
                        thumbColor={'#FFFFFF'}
                    />
                </View>

                {/* eWUŚ System */}
                <View style={ds.settingRow}>
                    <Text style={ds.settingTitle}>{t('settings.ewus.system_ewus')}</Text>
                    <Switch
                        value={eWUSSystem}
                        onValueChange={setEWUSSystem}
                        trackColor={{ false: tc.borderSubtle, true: tc.accent }}
                        thumbColor={'#FFFFFF'}
                    />
                </View>

                {/* Branch Dropdown */}
                <View style={ds.inputContainer}>
                    <Text style={ds.inputLabel}>{t('settings.ewus.branch')}</Text>
                    <View style={ds.pickerContainer}>
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
                <View style={ds.inputContainer}>
                    <Text style={ds.inputLabel}>{t('settings.ewus.contractor_type')}</Text>
                    <View style={ds.pickerContainer}>
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
                <View style={ds.inputContainer}>
                    <Text style={ds.inputLabel}>{t('settings.ewus.personnel_code')}</Text>
                    <TextInput
                        style={ds.textInput}
                        value={personnelCode}
                        onChangeText={setPersonnelCode}
                        placeholder={t('settings.ewus.placeholders.enter_personnel_code')}
                        placeholderTextColor={tc.textMuted}
                    />
                </View>

                {/* Password Input */}
                <View style={ds.inputContainer}>
                    <Text style={ds.inputLabel}>{t('settings.ewus.login')}</Text>
                    <TextInput
                        style={ds.textInput}
                        value={login}
                        onChangeText={setLogin}
                        placeholder={t('settings.ewus.placeholders.enter_login')}
                        placeholderTextColor={tc.textMuted}
                        secureTextEntry
                    />
                </View>

                {/* Password Section */}
                <View style={ds.inputContainer}>
                    <Text style={ds.inputLabel}>{t('settings.ewus.password')}</Text>
                    <Text style={ds.passwordText}>{t('settings.ewus.not_changed')}</Text>
                </View>
                <View style={{ backgroundColor: tc.cardBackground }}>


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
                        icon={<Feather name="key" color={tc.accent} size={20} />}
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


const createDynamicStyles = (tc: any, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tc.screenBackground,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: tc.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: isDark ? 'rgba(74, 144, 185, 0.15)' : '#E8F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: tc.textPrimary,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: tc.cardBackground,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    settingTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingTitle: {
        fontSize: 16,
        color: tc.textPrimary,
        marginRight: 8,
    },
    infoIcon: {
        marginLeft: 4,
    },
    inputContainer: {
        backgroundColor: tc.cardBackground,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: tc.borderSubtle,
    },
    inputLabel: {
        fontSize: 16,
        color: tc.textSecondary,
        marginBottom: 8,
        fontWeight: '500',
    },
    pickerContainer: {
        backgroundColor: tc.screenBackground,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 12 : 0,
        borderWidth: 1,
        borderColor: tc.borderColor,
    },
    textInput: {
        backgroundColor: tc.screenBackground,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: tc.textPrimary,
        borderWidth: 1,
        borderColor: tc.borderColor,
    },
    passwordText: {
        fontSize: 16,
        color: tc.textSecondary,
        fontStyle: 'italic',
        backgroundColor: tc.screenBackground,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: tc.borderColor,
    },
});

export default EWUS;