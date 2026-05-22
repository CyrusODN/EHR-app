import { getRequest, postRequest, putRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";
import AsyncStorage from '@react-native-async-storage/async-storage';

const MODEL_NAME = '/auth';

export async function getCurrentUser() {
	try {
		const result = await getRequest(`${MODEL_NAME}/context`);
		return result;
	} catch (err) {
		return throwServerError(err);
	}
}


export async function Login(data) {
	try {
        // Generate or retrieve a stable deviceId without native dependencies
        let deviceId = await AsyncStorage.getItem('stable_device_id');
        if (!deviceId) {
            deviceId = "mobile_device_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now();
            await AsyncStorage.setItem('stable_device_id', deviceId);
        }

		let { email, password } = data;
		let payload = { 
            user: { 
                username: email, 
                password 
            },
            deviceId 
        };
        console.log("Login final payload sent to API:", payload);

		const result = await postRequest(`${MODEL_NAME}/login`, payload);
		console.log("Login response:", result);
		return result?.user || result;
	} catch (err) {
		console.log("Login error:", err);
		return throwServerError(err);
	}
}

export async function SocialSignUp(user) {
	console.log("SocialSignUp payload:", user);
	try {
		const result = await postRequest(`${MODEL_NAME}/social-signup`, user);
		console.log("SocialSignUp response:", result);
		return result?.user || result;
	} catch (err) {
		console.log("SocialSignUp error:", err);
		return throwServerError(err);
	}
}

export async function googleMobileLogin({
	idToken,
	email,
	socialID,
	name,
	profileImage = '',
	isSignup = false,
}) {
	try {
		let deviceId = await AsyncStorage.getItem('stable_device_id');
		if (!deviceId) {
			deviceId =
				'mobile_device_' +
				Math.random().toString(36).substring(2, 15) +
				'_' +
				Date.now();
			await AsyncStorage.setItem('stable_device_id', deviceId);
		}

		const payload = {
			user: {
				username: name || email?.trim().toLowerCase(),
				email: email?.trim().toLowerCase(),
				accountType: 'google',
				socialID,
				profileImage: profileImage || '',
			},
			idToken,
			deviceId,
			isSignup,
		};

		console.log('googleMobileLogin payload:', payload);
		const result = await postRequest(`${MODEL_NAME}/social-signup`, payload);
		console.log('googleMobileLogin response:', result);
		return result?.user || result;
	} catch (err) {
		console.log('googleMobileLogin error:', err);
		return throwServerError(err);
	}
}

export async function FindUser(loginUserName) {
	try {
		const result = await getRequest(`${MODEL_NAME}/find-user/${loginUserName}`);
		console.log('result from service', result);
		return result?.user;
	} catch (err) {
		console.log(err);
		return throwServerError(err);
	}
}

export async function RegisterUser(data) {
	console.log("RegisterUser payload:", data);
	try {
		const result = await postRequest(`${MODEL_NAME}/signup`, data);
		console.log("RegisterUser response:", result);
		return result;
	} catch (err) {
		console.log("RegisterUser error:", err);
		return throwServerError(err);
	}
}

export async function ForgotPassword(payload) {
	console.log("ForgotPassword payload:", payload);
	try {
		const result = await postRequest(`${MODEL_NAME}/forget-password`, payload);
		console.log("ForgotPassword response:", result);
		return result;
	} catch (err) {
		console.log("ForgotPassword error:", err);
		return throwServerError(err);
	}
}

export async function VerifyOtp(payload) {
	console.log("VerifyOtp payload:", payload);
	try {
		const result = await postRequest(`${MODEL_NAME}/verify-otp`, payload);
		console.log("VerifyOtp response:", result);
		return result;
	} catch (err) {
		console.log("VerifyOtp error:", err);
		return throwServerError(err);
	}
}

export async function ResetPass(payload) {
	console.log("ResetPass payload:", payload);
	try {
		const result = await postRequest(`${MODEL_NAME}/reset-password`, payload);
		console.log("ResetPass response:", result);
		return result;
	} catch (err) {
		console.log("ResetPass error:", err);
		return throwServerError(err);
	}
}

export async function ResendVerificationEmail(phone) {
	try {
		const result = await postRequest(`${MODEL_NAME}/resend/email/${phone}`);
		return result;
	} catch (err) {
		return throwServerError(err);
	}
}

export async function ResendOtp(payload) {
	console.log("ResendOtp payload:", payload);
	try {
		const result = await postRequest(`${MODEL_NAME}/otp/resend`, payload);
		console.log("ResendOtp response:", result);
		return result;
	} catch (err) {
		console.log("ResendOtp error:", err);
		return throwServerError(err);
	}
}

export async function Verify2FA(payload) {
    console.log("Verify2FA Payload Sent:", JSON.stringify(payload, null, 4));
    try {
        const result = await postRequest(`${MODEL_NAME}/verify-2fa`, payload);
        console.log("Verify2FA API Response:", JSON.stringify(result, null, 4));
        return result;
    } catch (err) {
        console.log("Verify2FA API Error:", JSON.stringify(err, null, 4));
        return throwServerError(err);
    }
}
