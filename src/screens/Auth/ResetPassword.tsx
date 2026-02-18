import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import CustomTextInput from '../../component/customTextInput';
import PrimaryButton from '../../component/button';
import Gap from '../../component/gap';
import CustomAlert from '../../component/customAlert';
// import { ResetPass } from '../../Services/Auth.Service';



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

  

    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        message: '',
        type: 'error'
    });
    const checkValidation = useCallback(() => {
        if (!body.password || !body.confirmPassword) {
            return true;
        }
        
        if (body.password !== body.confirmPassword) {

        
            return true;
        }
    
        return false;
    }, [body.password, body.confirmPassword]);

    const handlePasswordToggle = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleConfirmPasswordToggle = useCallback(() => {
        setShowConfirmPassword(prev => !prev);
    }, []);




    const handleResetPassword = async () => {

        console.log("resetPasswordToken", resetPasswordToken)
       

        try {


            setSpinner(true);
            setIsFormSubmitted(true);

            if (checkValidation()) {
                setSpinner(false);
                // setAlertConfig({
                //     visible: true,
                //     type: 'error',
                //     message: t('reset_password.passwords_dont_match')
                // });
                return;
            }

            // Mocking success for UI view
            setTimeout(() => {
                setSpinner(false);
                setAlertConfig({
                    visible: true,
                    type: 'success',
                    message: 'Password reset successful! (UI Mode)'
                });

                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Sign-In' }],
                    });
                }, 1500);
            }, 1000);

            // await ResetPass({
            //     email: email,
            //     password: body.password,
            //     resetPasswordToken: resetPasswordToken,
            // });

            // setAlertConfig({
            //     visible: true,
            //     type: 'success',
            //     message: 'Password reset successful!'
            // });

            // navigation.reset({
            //     index: 0,
            //     routes: [{ name: 'Sign-In' }],
            // });

         

        } catch (error: any) {
            setAlertConfig({
                visible: true,
                type: 'error',
                message: error.message || 'Something went wrong. Please try again.'
            });
        } finally {
            // setSpinner(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
            


              <Text style={styles.header}>{t('reset_password.title')}</Text>
              <Text style={styles.header}>{t('reset_password.subtitle')}</Text>

            <Gap height={hp(4)} />
          


<CustomTextInput
                 placeholder={t('reset_password.new_password_placeholder')}
                name="password"
                value={body.password}
                setState={setBody}
                setValidationsState={setValidationErrors}
				validationState={validationErrors}
                isFormSubmitted={isFormSubmitted}
                icon={<Ionicons name="lock-closed-outline" color="#777" size={20} />}
                right={showPassword ? <Ionicons name="eye-off-outline" size={20} color="#777" /> : <Ionicons name="eye-outline" size={20} color="#777" />}
                onRightPress={handlePasswordToggle}
                keyboardType={undefined}
                secureTextEntry={!showPassword} />



            <Gap height={hp(1)} />


            <CustomTextInput
                   placeholder={t('reset_password.confirm_password_placeholder')}
                name="confirmPassword"
                value={body.confirmPassword}
                setState={setBody}
                setValidationsState={setValidationErrors}
				validationState={validationErrors}
                isFormSubmitted={isFormSubmitted}
                icon={<Ionicons name="lock-closed-outline" color="#777" size={20} />}
                right={showConfirmPassword ? <Ionicons name="eye-off-outline" size={20} color="#777" /> : <Ionicons name="eye-outline" size={20} color="#777" />}
                onRightPress={handleConfirmPasswordToggle} 
                keyboardType={undefined}
                secureTextEntry={!showConfirmPassword} />

           

            <Gap height={hp(2)} />

        


<PrimaryButton
 label={t('reset_password.reset_button')}
    filled
    onPress={handleResetPassword}
    style={styles.primaryButton}
    loading={spinner}
    disabled={spinner}
    icon={undefined}
    image={undefined}
    iconStyle={undefined}
    imageStyle={undefined}
/>


    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: hp(2) }}>
                <Text style={styles.signInText}>
                    {t('signup.have_account')}
                </Text>
                <Text
                    onPress={() => {
                        console.log('Sign In Link');
                        navigation.navigate('Sign-In')
                    }}
                    style={{
                        color: "blue"
                    }} >
                    {' ' + t('signup.sign_in')}
                </Text>
            </View>

            <CustomAlert
                visible={alertConfig.visible}
                type={alertConfig.type}
                message={alertConfig.message}
                onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 150,
        height: 150,
        marginTop: hp(5),
    },
    primaryButton: {
        width: '100%',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: hp(1.5),
    },
    signInText: {
        color: 'black',
    }
});

export default ResetPassword;