import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useThemeColors } from '../../hooks/useThemeColors';
import LogoSvg from '../../component/logo';

import CustomTextInput from '../../component/customTextInput';
import PrimaryButton from '../../component/button';
import Gap from '../../component/gap';
import CustomAlert from '../../component/customAlert';
import { ResetPass } from '../../Services/Auth.Service';
import { validateInput } from '../../utils/inputValidations';



const defaultBody = {
    password: '',
    confirmPassword: '',
};

const defaultValidationErrors = {
    password: false,
    confirmPassword: false,
};




const ResetPassword = () => {
    const { t } = useTranslation();
    const { colors: tc, isDark } = useThemeColors();
    const ds = createDynamicStyles(tc, isDark);
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { email , resetPasswordToken} = route.params || {};

    useEffect(()=>{
        console.log("resetPasswordToken", resetPasswordToken)

    },[])

    const [body, setBody] = useState(defaultBody);
    const [validationErrors, setValidationErrors] = useState(defaultValidationErrors);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  

    const [alertConfig, setAlertConfig] = useState<{
        visible: boolean;
        message: string;
        type: 'success' | 'warning' | 'error';
    }>({
        visible: false,
        message: '',
        type: 'error'
    });
    const checkValidation = useCallback(() => {
        let hasError = false;
        const newValidationErrors = { ...defaultValidationErrors };

        for (const field in body) {
            const fieldName = field as keyof typeof body;
            const errors = validateInput(body[fieldName], fieldName);
            if (errors.length > 0) {
                hasError = true;
                (newValidationErrors as any)[fieldName] = true;
            }
        }

        if (body.password !== body.confirmPassword) {
            hasError = true;
            (newValidationErrors as any).confirmPassword = true;
            setAlertConfig({
                visible: true,
                type: 'error',
                message: t('reset_password.passwords_not_match')
            });
        }

        setValidationErrors(newValidationErrors);
        return hasError;
    }, [body]);

    const handlePasswordToggle = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleConfirmPasswordToggle = useCallback(() => {
        setShowConfirmPassword(prev => !prev);
    }, []);




    const handleResetPassword = async () => {
        setSpinner(true);
        setIsFormSubmitted(false);

        // Toggle isFormSubmitted to true on next tick to trigger visual validation in children
        setTimeout(async () => {
            try {
                setIsFormSubmitted(true);

                if (checkValidation()) {
                    setSpinner(false);
                    return;
                }

                const payload = {
                    email: email,
                    password: body.password,
                    resetPasswordToken: resetPasswordToken,
                };

                const response = await ResetPass(payload);

                setSpinner(false);

                if (response) {
                    let successMessage = t('reset_password.reset_success');

                    if (typeof response === 'object') {
                        successMessage = response.data || successMessage;
                    } else if (typeof response === 'string') {
                        successMessage = response;
                    }

                    setAlertConfig({
                        visible: true,
                        type: 'success',
                        message: successMessage,
                    });

                    // Navigate to Sign-In screen after a short delay
                    setTimeout(() => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Sign-In' }],
                        });
                    }, 2000);
                }
            } catch (error: any) {
                setSpinner(false);
                console.log('Error during reset password:', error);
                setAlertConfig({
                    visible: true,
                    type: 'error',
                    message: error.message || t('auth.error_default'),
                });
            }
        }, 0);
    };

    return (
        <View style={ds.mainContainer}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={ds.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <View style={ds.container}>
                    {/* Logo */}
                    <View style={ds.logoContainer}>
                        <LogoSvg />
                    </View>

                    {/* Header */}
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={ds.header}>{t('reset_password.title')}</Text>
                        <Text style={ds.header}>{t('reset_password.subtitle')}</Text>
                    </View>

                    <Gap height={hp(4)} />

                    {/* New Password Input */}
                    <CustomTextInput
                        placeholder={t('reset_password.new_password_placeholder')}
                        name="password"
                        value={body.password}
                        setState={setBody}
                        setValidationsState={setValidationErrors}
                        validationState={validationErrors}
                        isFormSubmitted={isFormSubmitted}
                        icon={<Ionicons name="lock-closed-outline" color={tc.textSecondary} size={20} />}
                        right={showPassword ? <Ionicons name="eye-off-outline" size={20} color={tc.textSecondary} /> : <Ionicons name="eye-outline" size={20} color={tc.textSecondary} />}
                        onRightPress={handlePasswordToggle}
                        keyboardType={undefined}
                        secureTextEntry={!showPassword}
                    />

                    <Gap height={hp(1)} />

                    {/* Confirm Password Input */}
                    <CustomTextInput
                        placeholder={t('reset_password.confirm_password_placeholder')}
                        name="confirmPassword"
                        value={body.confirmPassword}
                        setState={setBody}
                        setValidationsState={setValidationErrors}
                        validationState={validationErrors}
                        isFormSubmitted={isFormSubmitted}
                        icon={<Ionicons name="lock-closed-outline" color={tc.textSecondary} size={20} />}
                        right={showConfirmPassword ? <Ionicons name="eye-off-outline" size={20} color={tc.textSecondary} /> : <Ionicons name="eye-outline" size={20} color={tc.textSecondary} />}
                        onRightPress={handleConfirmPasswordToggle}
                        keyboardType={undefined}
                        secureTextEntry={!showConfirmPassword}
                    />

                    <Gap height={hp(3)} />

                    {/* Reset Button */}
                    <PrimaryButton
                        label={t('reset_password.reset_button')}
                        filled
                        onPress={handleResetPassword}
                        style={ds.primaryButton}
                        loading={spinner}
                        disabled={spinner}
                        icon={undefined}
                        image={undefined}
                        iconStyle={undefined}
                        imageStyle={undefined}
                    />

                    <Gap height={hp(2)} />

                    {/* Sign In Link */}
                    <View style={ds.signInContainer}>
                        <Text style={ds.signInText}>
                            {t('signup.have_account')}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Sign-In')}>
                            <Text style={ds.signInLink}>
                                {' ' + t('signup.sign_in')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>

            <CustomAlert
                visible={alertConfig.visible}
                type={alertConfig.type}
                message={alertConfig.message}
                onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
            />
        </View>
    );
};

const createDynamicStyles = (tc: any, isDark: boolean) =>
    StyleSheet.create({
        mainContainer: {
            flex: 1,
            backgroundColor: tc.background,
        },
        scrollContent: {
            flexGrow: 1,
            paddingVertical: hp(2),
        },
        container: {
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: wp(6),
            backgroundColor: tc.background,
        },
        logoContainer: {
            marginTop: hp(12),
            marginBottom: hp(1),
            alignItems: 'center',
            justifyContent: 'center',
            width: wp(50),
            height: hp(12),
        },
        header: {
            fontSize: 24,
            fontWeight: 'bold',
            color: tc.textPrimary,
            textAlign: 'center',
        },
        primaryButton: {
            width: '100%',
            height: 52,
            borderRadius: 12,
        },
        signInContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        signInText: {
            color: tc.textSecondary,
            fontSize: 15,
        },
        signInLink: {
            color: '#007AFF',
            fontSize: 15,
            fontWeight: 'bold',
        },
    });

export default ResetPassword;