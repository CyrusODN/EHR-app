import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import {useNavigation, useRoute} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PrimaryButton from '../../component/button';
import Gap from '../../component/gap';
// import { VerifyOtp } from '../../Services/Auth.Service';
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
    const route = useRoute();
    const navigation = useNavigation<NavigationProp>();
    const {email, type} = route?.params || '';
    const [spinner, setSpinner] = useState(false);
    
    
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const inputs = useRef<(TextInput | null)[]>([]);
    const [alertConfig, setAlertConfig] = useState({
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

        if (cleanedText && index < 5) {
            inputs.current[index + 1]?.focus();
        }
        if (!cleanedText && index > 0) {
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

   

    const handleVerify = async() => {
        try {
            setSpinner(true);

            const enteredOtp = otp.join('');
            console.log('Verifying OTP:', enteredOtp);
            if (enteredOtp.length !== 6) {
                setSpinner(false);
                console.log('OTP incomplete');
                return;
            }

            // Mocking success for UI view
            setTimeout(() => {
                setSpinner(false);
                setAlertConfig({
                    visible: true,
                    type: 'success',
                    message: 'OTP verified successfully! (UI Mode)'
                });

                if(type =="registration"){
                     navigation.navigate('Sign-In');
                } else if(type=="reset-password"){
                    navigation.navigate('Reset-Password',{
                        email: email,
                        resetPasswordToken: 'mock-token',
                    });
                } else {
                     navigation.navigate('Sign-In');
                }
            }, 1000);

            // let payload={
            //     email:email,
            //     otp:enteredOtp,
            //     type:type
            // }

            // const response = await VerifyOtp(payload)

            // console.log('OTP verification response:', response);
            // setSpinner(false);


            // setAlertConfig({
            //     visible: true,
            //     type: 'success',
            //     message: 'OTP verified successfully!.'
            // });

            // if(type =="registration"){
            //     navigation.navigate('Sign-In');
            // }
            // else if(type=="reset-password"){

            //     navigation.navigate('Reset-Password',{
               
            //         email: email,
            //         resetPasswordToken: response?.resetPasswordToken,
                   
            //       });
            // }

            
        } catch (error: any) {
            setSpinner(false);

            setAlertConfig({
                visible: true,
                type: 'error',
                message: error.message || 'Something went wrong. Please try again.'
            });
            
        }
        
    };

    const handleResendOtp = () => {
        console.log('Resending OTP...');
    };

    const assignRef = (el: TextInput | null, index: number) => {
        inputs.current[index] = el;
    };

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />

            {/* Header */}
            {/* <Text style={styles.header}>{t('otp.verify_email_title')}</Text> */}

            {type =="registration" && (
                  <Text style={styles.header}>{t('otp.verify_email_title')}</Text>
            )}
              {type =="reset-password" && (
                  <Text style={styles.header}>{t('otp.reset_password_title')}</Text>
            )}

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
                style={{
                    width: '100%',
                    alignSelf: "center"
                }}
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

            <Gap height={hp(2)} />

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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp(5),
        backgroundColor: '#fff',
    },
    logo: {
        width: wp(40),
        height: hp(10),
        marginBottom: hp(4),
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: hp(1.5),
    },
    description: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: hp(4),
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: hp(1),
    },
    otpInput: {
        width: wp(12),
        height: wp(13),
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    primaryButton: {
        width: '100%',
        paddingVertical: hp(1.8),
        backgroundColor: '#58a6b8',
        borderColor: '#58a6b8',
    },
    resendContainer: {
        flexDirection: 'row',
        marginTop: hp(2),
    },
    resendText: {
        fontSize: 14,
        color: '#333',
    },
    resendLink: {
        fontSize: 14,
        color: '#58a6b8',
        fontWeight: 'bold',
    },
    backToLoginText: {
        marginTop: hp(2),
        color: 'blue',
        fontSize: 14,
    },
});

export default Otp; 