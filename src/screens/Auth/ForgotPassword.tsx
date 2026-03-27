import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import CustomTextInput from '../../component/customTextInput';
import PrimaryButton from '../../component/button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Gap from '../../component/gap';
import { ForgotPassword } from '../../Services/Auth.Service';
import CustomAlert from '../../component/customAlert';
import { validateInput } from '../../utils/inputValidations';

const defaultBody = {
	email: "",
};

const defaultValidationErrors = {
	email: false,
};


const ForgetPassword = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const [ body , setBody] = useState(defaultBody);
    const [validationErrors, setValidationErrors] = useState(defaultValidationErrors);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const [alertConfig, setAlertConfig] = useState<{
        visible: boolean;
        message: string;
        type: 'success' | 'warning' | 'error';
    }>({
        visible: false,
        message: '',
        type: 'error'
    });

    const handleCloseAlert = useCallback(() => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
      }, []);


const checkValidation = () => {
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

    setValidationErrors(newValidationErrors);
    return hasError;
};
    

    const handleSendInstructions = async () => {
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
                    email: body.email.trim().toLowerCase(),
                };

                const response = await ForgotPassword(payload);

                setSpinner(false);

                if (response) {
                    let successMessage = t('forgot_password.otp_success');

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

                    // Navigate to OTP screen after a short delay
                    setTimeout(() => {
                        navigation.navigate('Otp', {
                            email: body.email,
                            type: 'reset-password',
                        });
                    }, 2000);
                }
            } catch (error: any) {
                setSpinner(false);
                console.log('Error during forgot password:', error);
                setAlertConfig({
                    visible: true,
                    type: 'error',
                    message: error.message || t('auth.error_default'),
                });
            }
        }, 0);
    };

   

    useEffect(() => {

        console.log("Body object", body)
    },[])
    

    return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    {/* Logo */}
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    {/* Header */}
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text style={styles.header}>{t('forgot_password.title')}</Text>
                    </View>

                    {/* Description */}
                    <Text style={styles.description}>
                        {t('forgot_password.reset_instructions')}
                    </Text>

                    {/* Email Input */}
                    <CustomTextInput
                        placeholder={t('login.email_placeholder')}
                        name="email"
                        value={body.email}
                        setState={setBody}
                        setValidationsState={setValidationErrors}
                        validationState={validationErrors}
                        isFormSubmitted={isFormSubmitted}
                        icon={<Ionicons name="mail-outline" color="#777" size={20} />}
                        right={undefined}
                        onRightPress={undefined}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Gap height={hp(2)} />

                    {/* Send Button */}
                    <PrimaryButton
                        label={t('forgot_password.send_button')}
                        filled
                        onPress={handleSendInstructions}
                        style={styles.primaryButton}
                        loading={spinner}
                        disabled={spinner}
                        icon={undefined}
                        image={undefined}
                        iconStyle={undefined}
                        imageStyle={undefined}
                    />

                    <Gap height={hp(2)} />

                    {/* Back to Login Link */}
                    <TouchableOpacity onPress={() => { navigation.navigate('Sign-In') }}>
                        <Text style={styles.backToLoginText}>{t('reset_password.back_to_login')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>

            <CustomAlert
                visible={alertConfig.visible}
                type={alertConfig.type}
                message={alertConfig.message}
                onClose={handleCloseAlert}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingVertical: hp(2),
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: wp(6),
        backgroundColor: '#fff',
    },
    logo: {
        width: wp(50),
        height: hp(12),
        marginTop: hp(12),
        marginBottom: hp(1),
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: hp(1),
    },
    description: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: hp(3),
        paddingHorizontal: wp(4),
    },
    primaryButton: {
        width: '100%',
        height: 52,
        borderRadius: 12,
    },
    backToLoginText: {
        color: '#007AFF',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default ForgetPassword;
