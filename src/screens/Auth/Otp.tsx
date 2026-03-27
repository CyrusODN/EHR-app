import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';
import {useNavigation, useRoute} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PrimaryButton from '../../component/button';
import Gap from '../../component/gap';
import { VerifyOtp, ResendOtp, Verify2FA } from '../../Services/Auth.Service';
import userStore from '../../store/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../../component/customAlert';

// Define stack param list if not already defined globally
type RootStackParamList = {
    'Sign-In': undefined;
    'Sign-Up': undefined;
    'Otp': {
        email: string;
    };
    // Add other routes as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Otp = () => {
    const { t } = useTranslation();
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const {email, type} = route?.params || {};
    const [spinner, setSpinner] = useState(false);
    const { setAuth } = userStore();
    
    
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const inputs = useRef<(TextInput | null)[]>([]);
    const [alertConfig, setAlertConfig] = useState<{
        visible: boolean;
        message: string;
        type: 'success' | 'warning' | 'error';
    }>({
        visible: false,
        message: '',
        type: 'error'
    });
    



useEffect(() => {
console.log("email ", email)
console.log("otp ", otp)
console.log("type", type)

},[])

    const handleOtpChange = (text: string, index: number) => {
        const cleanedText = text.replace(/[^0-9]/g, '');
        if (cleanedText.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = cleanedText;
        setOtp(newOtp);

        if (cleanedText) {
             if (index < 5) {
                inputs.current[index + 1]?.focus();
            } else if (index === 5) {
                // If the last digit is entered and all other digits are present, auto-verify
                const enteredOtp = newOtp.join('');
                if (enteredOtp.length === 6) {
                    // Use a slight timeout to ensure state/focus is settled
                    setTimeout(() => {
                        handleVerify(enteredOtp);
                    }, 100);
                }
            }
        } else if (!cleanedText && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleCloseAlert = useCallback(() => {
            setAlertConfig(prev => ({ ...prev, visible: false }));
    }, []);

    const isOtpComplete = () => {
            const enteredOtp = otp.join('');
            if (enteredOtp.length !== 6) {
              
                return false; 
            }
            else{
                return true
            }
     };

   

    const handleVerify = async (autoOtp?: string) => {
        try {
            setSpinner(true);

            const enteredOtp = autoOtp || otp.join('');
            if (enteredOtp.length !== 6) {
                setSpinner(false);
                setAlertConfig({
                    visible: true,
                    type: 'warning',
                    message: t('otp.enter_all_digits'),
                });
                return;
            }

            let response: any;
            if (type === '2fa') {
                let deviceId = await AsyncStorage.getItem('stable_device_id');
                if (!deviceId) {
                    deviceId = "mobile_device_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now();
                    await AsyncStorage.setItem('stable_device_id', deviceId);
                }
                const payload = {
                    email: email,
                    token: enteredOtp,
                    deviceId: deviceId,
                    rememberDevice: false
                };
                response = await Verify2FA(payload);
            } else {
                const payload = {
                    email: email,
                    otp: enteredOtp,
                    type: type,
                };
                response = await VerifyOtp(payload);
            }

            setSpinner(false);

            if (response) {
                let successMessage = t('otp.otp_verified');
                
                // If it's a successful 2FA login, update the store
                if (type === '2fa' && response) {
                   setAuth(response);
                }

                if (typeof response === 'object') {
                    successMessage = response.message || response.data || successMessage;
                } else if (typeof response === 'string') {
                    successMessage = response;
                }

                setAlertConfig({
                    visible: true,
                    type: 'success',
                    message: successMessage,
                });

                if (type === "registration") {
                    navigation.navigate('Sign-In');
                } else if (type === "reset-password") {
                    navigation.navigate('Reset-Password', {
                        email: email,
                        resetPasswordToken: (response as any)?.data?.resetPasswordToken || (response as any)?.resetPasswordToken,
                    });
                } else if (type === '2fa') {
                    // No need for explicit navigation here. 
                    // setAuth(response) triggers isAuthenticated change, 
                    // which causes the AppNavigator to swap stacks automatically.
                } else {
                    navigation.navigate('Sign-In');
                }
            }
        } catch (error: any) {
            setSpinner(false);
            setAlertConfig({
                visible: true,
                type: 'error',
                message: error.message || t('auth.error_default'),
            });
        }
    };

    const handleResendOtp = async () => {
        try {
            setSpinner(true);
            const payload = {
                email: email,
                type: type,
            };

            const response = await ResendOtp(payload);
            setSpinner(false);

            if (response) {
                let successMessage = t('otp.new_otp_sent');
                
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
            }
        } catch (error: any) {
            setSpinner(false);
            setAlertConfig({
                visible: true,
                type: 'error',
                message: error.message || t('auth.error_default'),
            });
        }
    };

    const assignRef = (el: TextInput | null, index: number) => {
        inputs.current[index] = el;
    };

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
                        {type === "registration" && (
                            <Text style={styles.header}>{t('otp.verify_email_title')}</Text>
                        )}
                        {type === "reset-password" && (
                            <Text style={styles.header}>{t('otp.reset_password_title')}</Text>
                        )}
                    </View>

                    {/* Description */}
                    <Text style={styles.description}>
                        {t('otp.verification_sent')}
                    </Text>

                    {/* OTP Input */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                style={styles.otpInput}
                                value={digit}
                                onChangeText={(text) => handleOtpChange(text, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                ref={(el) => assignRef(el, index)}
                                selectTextOnFocus
                                textContentType="oneTimeCode"
                            />
                        ))}
                    </View>

                    <Gap height={hp(3)} />

                    {/* Verify Button */}
                    <PrimaryButton
                        label={t('otp.verify_button')}
                        filled={true}
                        onPress={handleVerify}
                        style={styles.primaryButton}
                        loading={spinner}
                        disabled={!isOtpComplete()}
                        icon={undefined}
                        image={undefined}
                        iconStyle={undefined}
                        imageStyle={undefined}
                    />

                    <Gap height={hp(2)} />

                    {/* Resend OTP */}
                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>{t('otp.didnt_receive_code')} </Text>
                        <TouchableOpacity onPress={handleResendOtp}>
                            <Text style={styles.resendLink}>{t('otp.resend_otp')}</Text>
                        </TouchableOpacity>
                    </View>

                    <Gap height={hp(3)} />

                    {/* Back to Login Link */}
                    <TouchableOpacity
                        onPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Sign-In' }],
                            });
                        }}
                    >
                        <Text style={styles.backToLoginText}>{t('otp.back_to_login')}</Text>
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
        marginBottom: hp(4),
        paddingHorizontal: wp(4),
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: hp(1),
    },
    otpInput: {
        width: wp(12),
        height: wp(13),
        borderWidth: 1.5,
        borderColor: '#E8EDF2',
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        backgroundColor: '#F7F9FB',
    },
    primaryButton: {
        width: '100%',
        height: 52,
        borderRadius: 12,
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resendText: {
        fontSize: 14,
        color: '#666',
    },
    resendLink: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    backToLoginText: {
        color: '#007AFF',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default Otp; 