import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';

import CustomTextInput from '../../component/customTextInput';
import PrimaryButton from '../../component/button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Gap from '../../component/gap';
import {useNavigation} from '@react-navigation/native';
import CustomAlert from '../../component/customAlert';
import { RegisterUser } from '../../Services/Auth.Service';
import { validateInput } from '../../utils/inputValidations';
import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';

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
    const navigation = useNavigation<any>();

  
const [ body , setBody] = useState(defaultBody);

const [validationErrors, setValidationErrors] = useState(defaultValidationErrors);
const [isFormSubmitted, setIsFormSubmitted] = useState(false);
const [spinner, setSpinner] = useState(false);

const [isPasswordVisible, setIsPasswordVisible] = useState(false);
const [isGoogleLoading, setIsGoogleLoading] = useState(false);
const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'warning' | 'error';
}>({
    visible: false,
    message: '',
    type: 'error'
});


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


    const handleSignUp = async () => {
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
                    name: body.fullName,
                    password: body.password,
                };

                const response = await RegisterUser(payload);

                setSpinner(false);

                if (response) {
                    let successMessage = 'User signed up successfully! Please verify your email address to login';

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
                            type: 'registration',
                        });
                    }, 2000);
                }
            } catch (error: any) {
                setSpinner(false);
                console.log('Error during sign up:', error);
                setAlertConfig({
                    visible: true,
                    type: 'error',
                    message: error.message || 'Something went wrong. Please try again.',
                });
            }
        }, 0);
    };

    const handleGoogleSignUp = async () => {
        setIsGoogleLoading(true);
        try {
            let googleEmail = '';
            let idToken = '';

            try {
                // Configure Google Sign-In
                try {
                    GoogleSignin.configure({
                        webClientId:
                            '383882848574-qkp6dliucskh28daelit50rtqevf1fhj.apps.googleusercontent.com',
                        iosClientId:
                            '383882848574-qkp6dliucskh28daelit50rtqevf1fhj.apps.googleusercontent.com',
                    });
                } catch (configErr) {
                    console.warn('GoogleSignin configure error:', configErr);
                }

                // Check Play Services (Android)
                try {
                    await GoogleSignin.hasPlayServices({
                        showPlayServicesUpdateDialog: true,
                    });
                } catch (_) {}

                // Trigger Sign-In
                try {
                    const account = await GoogleSignin.signIn();
                    console.log('Google Sign In Account:', JSON.stringify(account, null, 2));

                    if (isSuccessResponse(account)) {
                        idToken = account.data.idToken || '';
                        googleEmail = account.data.user.email || '';
                    }
                } catch (error: any) {
                    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                        console.log('User cancelled the sign-up flow');
                        setIsGoogleLoading(false);
                        return;
                    } else if (error.code === statusCodes.IN_PROGRESS) {
                        console.log('Sign in is in progress already');
                        return;
                    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                        setAlertConfig({ visible: true, type: 'error', message: 'Play services not available or outdated' });
                        setIsGoogleLoading(false);
                        return;
                    } else {
                        console.error('Google Sign-In Error:', error);
                        throw error;
                    }
                }
            } catch (err) {
                console.warn('Google Sign In setup error:', err);
            }

            // Validate we got a token
            if (!idToken) {
                setIsGoogleLoading(false);
                setAlertConfig({ visible: true, type: 'error', message: 'Error Signing In with Google' });
                return;
            }

            // Prepare the payload for backend (API not ready yet)
            const signupPayload = {
                idToken,
                email: googleEmail,
                isSignup: true,
            };

            console.log(
                '========== GOOGLE SIGN-UP PAYLOAD ==========',
            );
            console.log(JSON.stringify(signupPayload, null, 2));
            console.log(
                '=============================================',
            );

            // TODO: Replace with actual API call when backend is ready
            // const resp = await googleMobileLogin(signupPayload);
            // const payload = resp?.data?.data || resp?.data;
            // const token = payload?.token || payload?.accessToken;

            setAlertConfig({
                visible: true,
                type: 'success',
                message: `Google Sign-Up successful!\nEmail: ${googleEmail}\n\nPayload logged to console. API integration pending.`,
            });

        } catch (error: any) {
            console.error('Google Sign-Up FAILED:', error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Failed to initiate Google sign-up';
            setAlertConfig({
                visible: true,
                type: 'error',
                message,
            });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleCloseAlert = useCallback(() => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
      }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
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
            <Text style={styles.header}>Create your account</Text>
          </View>

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
            right={undefined}
            onRightPress={undefined}
            keyboardType={undefined}
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
            right={undefined}
            onRightPress={undefined}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

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
            right={
              isPasswordVisible ? (
                <Ionicons name="eye-off-outline" size={20} color="#777" />
              ) : (
                <Ionicons name="eye-outline" size={20} color="#777" />
              )
            }
            onRightPress={() => setIsPasswordVisible(!isPasswordVisible)}
            keyboardType={undefined}
            secureTextEntry={!isPasswordVisible}
          />

          <Gap height={hp(3)} />

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
            label="Sign up"
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

          <Gap height={hp(1)} />

          {/* Google Sign up Button */}
          <TouchableOpacity
            style={[styles.googleButton, isGoogleLoading && {opacity: 0.6}]}
            onPress={handleGoogleSignUp}
            disabled={isGoogleLoading}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../assets/images/google-icon.png')}
              style={styles.googleIcon}
            />
            <Text style={{color: 'black', fontWeight: '500'}}>
              {isGoogleLoading ? 'Signing up...' : t('login.continue_with_google')}
            </Text>
          </TouchableOpacity>

          <Gap height={hp(1.5)} />
          <Text style={styles.restrictionText}>
            Registration is restricted to authorized email addresses only.
          </Text>

          <Gap height={hp(2)} />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.signInText}>{t('signup.have_account')}</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('Sign-In')}>
              <Text style={{color: '#007AFF', fontWeight: 'bold'}}>
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
    marginBottom: hp(3),
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 12,
  },
  googleButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E8EDF2',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 52,
    backgroundColor: '#fff',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  signInText: {
    color: '#666',
    fontSize: 15,
  },
  restrictionText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: wp(10),
    lineHeight: 18,
  },
});

export default SignUp;
