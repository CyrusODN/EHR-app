import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomTextInput from '../../component/customTextInput';
import PrimaryButton from '../../component/button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Gap from '../../component/gap';
import CustomAlert from '../../component/customAlert';
// import { ForgotPassword } from '../../Services/Auth.Service';

const defaultBody = {
	email: "",
};

const defaultValidationErrors = {
	email: false,
};


const ForgetPassword = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [ body , setBody] = useState(defaultBody);
    const [validationErrors, setValidationErrors] = useState(defaultValidationErrors);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        message: '',
        type: 'error'
    });

    const handleCloseAlert = useCallback(() => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
      }, []);


const checkValidation = () => {
    for (let field in body) if (body[field as keyof typeof body].length <= 0) return true;
    for (let field in validationErrors) if (validationErrors[field as keyof typeof validationErrors]) return true;

    return false;
};
    

    const handleSendInstructions =async () => {
        // Handle sending password reset instructions here
        console.log('Sending password reset instructions...');

        try {

            setSpinner(true);
      
    
            setIsFormSubmitted(true)
    
            if (checkValidation()) {
                setSpinner(false);
                return;
            }

            // Mocking success for UI view
            setTimeout(() => {
                setSpinner(false);
                setAlertConfig({
                    visible: true,
                    message: "An email has been sent to your registered email address with otp code to reset your password. (UI Mode)",
                    type: 'success'
                });

                setTimeout(() => {
                    navigation.navigate('Otp', {
                        email: body.email,
                        type: 'reset-password'
                    });
                }, 1000);
            }, 1000);

            // await ForgotPassword(payload)
            // setSpinner(false)
            // setAlertConfig({
            //     visible: true,
            //     message: "An email has been sent to your registered email address with otp code to reset your password.",
            //     type: 'success'
            // });

            // navigation.navigate('Otp', {
               
            //     email: body.email,
            //     type: 'reset-password'
               
            //   });

            
           
            
        } catch (error: any) {
            setSpinner(false)
            console.log("error", error)
            setAlertConfig({
                visible: true,
                message: error?.message || 'Something went wrong' ,
                type: 'error'
            });
            
        }
    };

   

    useEffect(() => {

        console.log("Body object", body)
    },[])
    

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />

            {/* Header */}
            <Text style={styles.header}>{t('forgot_password.title')}</Text>

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
                right={undefined} onRightPress={undefined} keyboardType={undefined} />

            <Gap height={hp(2)} />

            {/* Send Button */}
            {/* <PrimaryButton
                label={t('forgot_password.send_button')}
                filled
                onPress={handleSendInstructions}
                style={styles.primaryButton}
                icon={undefined}
                image={undefined}
                iconStyle={undefined}
                imageStyle={undefined}
            /> */}

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

            {/* Back to Login Link */}
            <TouchableOpacity onPress={() => { navigation.navigate('Sign-In') }}>
                <Text style={styles.backToLoginText}>{t('reset_password.back_to_login')}</Text>
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
        marginBottom: hp(2),
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: hp(3),
    },
    description: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        marginBottom: hp(3),
    },
    primaryButton: {
        marginTop: hp(2),
        width: '100%',
    },
    backToLoginText: {
        marginTop: hp(2),
        color: 'blue',
    },
});

export default ForgetPassword;
