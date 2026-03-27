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
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../../component/customAlert';
import LanguageSelector from '../../component/LanguageSelector';
import userStore from '../../store/user';
import {Login, SocialSignUp} from '../../Services/Auth.Service';
import { validateInput } from '../../utils/inputValidations';
import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';

const defaultBody = {
  email: '',
  password: '',
};
const defaultValidationErrors = {
  email: false,

  password: false,
};

const SignIn = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();

  const {setAuth, purgeAuth} = userStore();

  const [body, setBody] = useState(defaultBody);

  const [validationErrors, setValidationErrors] = useState(
    defaultValidationErrors,
  );
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'warning' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'error',
  });

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSignIn = async () => {
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
          password: body.password,
        };

        const user = await Login(payload);

        setSpinner(false);

        if (user.requires2FA) {
          navigation.navigate('Otp', {
            email: body.email,
            type: '2fa',
          });
          return;
        }

        // If user is not verified but we got data (depends on backend behavior)
        // Some backends return success: false for unverified, check accordingly
        
        setAuth(user);

        let successMessage = t('login.login_success');
        if (typeof user === 'object') {
          successMessage = (user as any).data || successMessage;
        } else if (typeof user === 'string') {
          successMessage = user;
        }

        setAlertConfig({
          visible: true,
          type: 'success',
          message: successMessage,
        });

        // Navigate after successful login
        setTimeout(() => {
          navigation.navigate('ModuleSelection');
        }, 1000);
      } catch (error: any) {
        setSpinner(false);
        console.log('Error during sign in:', error);
        setAlertConfig({
          visible: true,
          type: 'error',
          message: error.message || t('auth.error_default'),
        });
      }
    }, 0);
  };

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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setSpinner(true);
    try {
      let googleEmail = '';
      let idToken = '';

      try {
        // Configure Google Sign-In
        try {
          setSpinner(true);
          GoogleSignin.configure({
            webClientId:
              '383882848574-qkp6dliucskh28daelit50rtqevf1fhj.apps.googleusercontent.com',
            iosClientId:
              '383882848574-qkp6dliucskh28daelit50rtqevf1fhj.apps.googleusercontent.com',
          });
        } catch (configErr) {
          setSpinner(false);
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
            setSpinner(false);
            console.log('User cancelled the login flow');
            setIsGoogleLoading(false);
            return;
          } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log('Sign in is in progress already');
            return;
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            setAlertConfig({ visible: true, type: 'error', message: t('login.play_services_error') });
            setSpinner(false);
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
        setAlertConfig({ visible: true, type: 'error', message: t('login.google_signin_error') });
        return;
      }

      // Prepare the payload for backend (API not ready yet)
      const loginPayload = {
        idToken,
        email: googleEmail,
        isSignup: false,
      };

      console.log(
        '========== GOOGLE SIGN-IN PAYLOAD (Login) ==========',
      );
      console.log(JSON.stringify(loginPayload, null, 2));
      console.log(
        '====================================================',
      );

      // TODO: Replace with actual API call when backend is ready
      // const resp = await googleMobileLogin(loginPayload);
      // const payload = resp?.data?.data || resp?.data;
      // const token = payload?.token || payload?.accessToken;

      setAlertConfig({
        visible: true,
        type: 'success',
        message: t('login.google_signin_success'),
      });

    } catch (error: any) {
      console.error('Google Sign-In FAILED:', error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        t('login.google_login_failed');
      setAlertConfig({
        visible: true,
        type: 'error',
        message,
      });
    } finally {
      setIsGoogleLoading(false);
      setSpinner(false);
    }
  };

  const handleCloseAlert = useCallback(() => {
    setAlertConfig(prev => ({...prev, visible: false}));
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

            <LanguageSelector />

            {/* Header */}
            <Text style={styles.header}>{t('login.welcome_back')}</Text>

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

            <Gap height={hp(1.5)} />

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

            {/* Forgot Password Link */}
            <View style={{width: '100%', alignItems: 'flex-end', marginTop: hp(1)}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Forget-Password')}>
                <Text style={styles.forgotPasswordText}>
                  {t('login.forgot_password')}
                </Text>
              </TouchableOpacity>
            </View>

            <Gap height={hp(2)} />

            {/* Sign In Button */}
            <PrimaryButton
              label={t('login.login_button')}
              filled
              onPress={handleSignIn}
              style={styles.primaryButton}
              loading={spinner}
              disabled={spinner}
              icon={undefined}
              image={undefined}
              iconStyle={undefined}
              imageStyle={undefined}
            />

            <Gap height={hp(1)} />

            {/* Google Sign In Button */}
            <TouchableOpacity
              style={[styles.googleButton, isGoogleLoading && {opacity: 0.6}]}
              onPress={handleGoogleSignIn}
              disabled={isGoogleLoading}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/images/google-icon.png')}
                style={styles.googleIcon}
              />
              <Text style={{color: 'black', fontWeight: '500'}}>
                {isGoogleLoading ? t('login.signing_in') : t('login.continue_with_google')}
              </Text>
            </TouchableOpacity>

            <Gap height={hp(2)} />

            {/* Sign Up Link */}
            <TouchableOpacity onPress={() => navigation.navigate('Sign-Up')}>
              <Text style={styles.signUpText}>
                {t('login.no_account')}{' '}
                <Text style={{color: '#007AFF', fontWeight: 'bold'}}>{t('login.sign_up')}</Text>
              </Text>
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
    justifyContent: 'center',
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
    marginTop: hp(10),
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
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  signUpText: {
    color: '#666',
    fontSize: 15,
  },
});

export default SignIn;
