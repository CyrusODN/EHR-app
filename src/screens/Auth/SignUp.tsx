import React, { useState , useEffect, useCallback} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';

import CustomTextInput from '../../component/customTextInput';
import PrimaryButton from '../../component/button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Gap from '../../component/gap';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../../component/customAlert';
// import { RegisterUser } from '../../Services/Auth.Service';

const defaultBody = {
    email: '',
    fullName: '',
    password: '',
    
};
const defaultValidationErrors = {
	email: false,
	fullName: false,
	password: false,
	
};

const SignUp = () => {

    const { t } = useTranslation();
    const navigation = useNavigation();

  
const [ body , setBody] = useState(defaultBody);

const [validationErrors, setValidationErrors] = useState(defaultValidationErrors);
const [isFormSubmitted, setIsFormSubmitted] = useState(false);
const [spinner, setSpinner] = useState(false);

const [isPasswordVisible, setIsPasswordVisible] = useState(false);
const [alertConfig, setAlertConfig] = useState({
    visible: false,
    message: '',
    type: 'error'
});


const checkValidation = () => {
    for (let field in body) if (body[field as keyof typeof body].length <= 0) return true;
    for (let field in validationErrors) if (validationErrors[field as keyof typeof validationErrors]) return true;

    return false;
};


    const handleSignUp = async() => {

        setSpinner(true);
        // Handle the signup logic here
        console.log('Signing up...');
        console.log("Bodu object", body)

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
                type: 'success',
                message: 'Registration successful! (UI Mode)'
            });
            
            // Navigate to OTP screen after a short delay
            setTimeout(() => {
                navigation.navigate('Otp', {
                    email: body.email,
                    type: 'registration'
                });
            }, 1000);
        }, 1000);

        // try {

        //     await RegisterUser(payload)

        //     setAlertConfig({
        //         visible: true,
        //         type: 'success',
        //         message: 'Registration successful! Please check your email for verification.'
        //     });

        //     console.log('Sign up successful');
        // setSpinner(false);


        //     navigation.navigate('Otp', {
               
        //         email: body.email,
        //         type: 'registration'
               
        //       });
           
            
        // } catch (error: any) {
        // setSpinner(false);
        // setAlertConfig({
        //     visible: true,
        //     type: 'error',
        //     message: error.message || 'Something went wrong. Please try again.'
        // });
        //     console.log('Error during sign up:', error);
            
        // }
    };

    const handleGoogleSignUp = () => {
       
        console.log('Google sign-up...');
    };

    const handleCloseAlert = useCallback(() => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
      }, []);

   
    

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />

            {/* Header */}
            <Text style={styles.header}>{t('login.sign_up')}</Text>

            {/* Full Name Input */}

            <CustomTextInput
    placeholder={t('signup.name_placeholder')}
    name="fullName"
    value={body.fullName}
    setState={setBody}
   
    setValidationsState={setValidationErrors}
    validationState={validationErrors}
    isFormSubmitted={isFormSubmitted}
    icon={<Ionicons name="person-outline" color="#777" size={20} />}
    right={undefined} onRightPress={undefined} keyboardType={undefined}
/>
          
               

            <Gap height={hp(1)} />

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

            <Gap height={hp(1)} />

            {/* Password Input */}
            <CustomTextInput
                placeholder={t('login.password_placeholder')}
                name="password"
                value={body.password}
                setState={setBody}
               
                setValidationsState={setValidationErrors}
				validationState={validationErrors}
                isFormSubmitted={isFormSubmitted}
                icon={<Ionicons name="lock-closed-outline" color="#777" size={20} />}
                right={isPasswordVisible ? <Ionicons name="eye-off-outline" size={20} color="#777" /> : <Ionicons name="eye-outline" size={20} color="#777" />}
                onRightPress={() => setIsPasswordVisible(!isPasswordVisible)} 
                keyboardType={undefined}
                secureTextEntry={!isPasswordVisible} />

            {/* Sign up Button */}
            {/* <PrimaryButton
                label={t('login.sign_up')}
                filled
                onPress={handleSignUp}
                style={styles.primaryButton} 
                icon={undefined}
                 image={undefined}
                  iconStyle={undefined} 
                 imageStyle={undefined} /> */}


<PrimaryButton
    label={t('login.sign_up')}
    filled
    onPress={handleSignUp}
    style={styles.primaryButton}
    loading={spinner}
    disabled={spinner}
    icon={undefined}
    image={undefined}
    iconStyle={undefined}
    imageStyle={undefined}
/>


            {/* Google Sign up Button */}
            <TouchableOpacity style={styles.googleButton} >
                <Image source={require('../../assets/images/google-icon.png')} style={styles.googleIcon} />
                <Text style={{ color: 'black' }}>
                    {t('login.continue_with_google')}
                </Text>
            </TouchableOpacity>

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
    primaryButton: {
        marginTop: hp(2),
        width: "100%"
    },
    googleButton: {
        marginTop: hp(1),
        width: '100%',
        borderWidth: 1, borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row", height: 50
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    signInText: {
        color: 'black',
    }
});

export default SignUp;
