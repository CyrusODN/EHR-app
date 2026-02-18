import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
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
import userStore from '../../store/user';
// import {Login, SocialSignUp} from '../../Services/Auth.Service';

// import {
//   GoogleSignin,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';

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
  const navigation = useNavigation();

  const {setAuth, purgeAuth} = userStore();

  const [body, setBody] = useState(defaultBody);

  const [validationErrors, setValidationErrors] = useState(
    defaultValidationErrors,
  );
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    message: '',
    type: 'error',
  });

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSignIn = async () => {
    // try {
      setSpinner(true);

      setIsFormSubmitted(true);

      if (checkValidation()) {
        setSpinner(false);
        return;
      }

      setTimeout(() => {
        setSpinner(false);
         navigation.navigate('ModuleSelection');
      }, 1000);

      // let payload = {
      //   username: body.email,
      //   password: body.password,
      // };
      // const user = await Login(payload);

      // setSpinner(false);

      // if (user.requires2FA) {
      //   // Navigate to OTP screen with email and indicating this is for 2FA

      //   navigation.navigate('Otp', {
      //     email: body.email,
      //     type: '2fa',
      //   });

      //   setAlertConfig({
      //     visible: true,
      //     type: 'success',
      //     message:
      //       'Registration successful! Please check your email for verification.',
      //   });

      //   return;
      // }

      // setAuth(user);

      // setAlertConfig({
      //   visible: true,
      //   type: 'success',
      //   message: 'Login successful!',
      // });

      // if (user.role == 'doctor') {
      //   navigation.navigate('Dashboard');
      // } else if (user.role == 'admin') {
      //   navigation.navigate('Dashboard');
      // }
    // } catch (error) {
    //   setSpinner(false);
    //   setAlertConfig({
    //     visible: true,
    //     type: 'error',
    //     message: error.message,
    //   });
    // }
  };

  const checkValidation = () => {
    for (const field in body) {
      if (body[field as keyof typeof body].length <= 0) {
        return true;
      }
    }
    for (const field in validationErrors) {
      if (validationErrors[field as keyof typeof validationErrors]) {
        return true;
      }
    }

    return false;
  };

//   const handleGoogleSignIn = async () => {
//     console.log('Gogle sign in called');

//     try {
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();

//       console.log('user infor', userInfo);
//     } catch (error) {
//       console.log('Error', error);
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         setIsGoogleLoading(false);
//         return;
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         setIsGoogleLoading(false);
//         return;
//       }
//       purgeAuth();
//       setAlertConfig({
//         visible: true,
//         type: 'error',
//         message: error.message,
//       });
//       setIsGoogleLoading(false);
//       return;
//     } finally {
//       setIsGoogleLoading(false);
//     }
//   };

  const handleCloseAlert = useCallback(() => {
    setAlertConfig(prev => ({...prev, visible: false}));
  }, []);

//   useEffect(() => {
//     GoogleSignin.configure({
//       webClientId:
//         '514590497112-834sj8t4rsrrupil2t60splptf3b79q5.apps.googleusercontent.com',
//       iosClientId:
//         '514590497112-834sj8t4rsrrupil2t60splptf3b79q5.apps.googleusercontent.com',
//     });
//   }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

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
        keyboardType={undefined}
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
        right={isPasswordVisible ? <Ionicons name="eye-off-outline" size={20} color="#777" /> : <Ionicons name="eye-outline" size={20} color="#777" />}
        onRightPress={() => setIsPasswordVisible(!isPasswordVisible)}
        keyboardType={undefined}
        secureTextEntry={!isPasswordVisible}
      />
      <Gap height={hp(1)} />

      {/* Forgot Password Link */}
      <TouchableOpacity onPress={() => navigation.navigate('Forget-Password')}>
        <Text style={styles.forgotPasswordText}>
          {t('login.forgot_password')}
        </Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      {/* <PrimaryButton
                label={t('login.login_button')}
                filled
                onPress={handleSignIn}
                style={styles.primaryButton} icon={undefined} image={undefined} iconStyle={undefined} imageStyle={undefined} /> */}

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

      {/* Google Sign In Button */}
      <TouchableOpacity
        style={styles.googleButton}

        // onPress={handleGoogleSignIn}
        >
        <Image
          source={require('../../assets/images/google-icon.png')}
          style={styles.googleIcon}
        />
        <Text style={{color: 'black'}}>{t('login.continue_with_google')}</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <TouchableOpacity onPress={() => navigation.navigate('Sign-Up')}>
        <Text style={styles.signUpText}>
          {t('login.no_account')}{' '}
          <Text style={{color: 'blue'}}>{t('login.sign_up')}</Text>
        </Text>
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
  primaryButton: {
    marginTop: hp(2),
    width: '100%',
  },
  googleButton: {
    marginTop: hp(1),
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 50,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  forgotPasswordText: {
    marginTop: hp(1),
    color: 'blue',
    textAlign: 'right',
    fontSize: 14,
  },
  signUpText: {
    marginTop: hp(2),
    color: 'black',
  },
});

export default SignIn;
