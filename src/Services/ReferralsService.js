import { getRequest, postRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = "/referral";

export async function GetIncomingReferrals(queryParams) {
    try {
        const result = await getRequest(`${MODEL_NAME}/incoming`, queryParams);
        console.log("GetIncomingReferrals API Response:", JSON.stringify(result, null, 4));
        return result;
    } catch (err) {
        console.log("GetIncomingReferrals API Error:", JSON.stringify(err, null, 4));
        return throwServerError(err);
    }
}

export async function GetOutgoingReferrals(queryParams) {
    try {
        const result = await getRequest(`${MODEL_NAME}/outgoing`, queryParams);
        console.log("GetOutgoingReferrals API Response:", JSON.stringify(result, null, 4));
        return result;
    } catch (err) {
        console.log("GetOutgoingReferrals API Error:", JSON.stringify(err, null, 4));
        return throwServerError(err);
    }
}

export async function CreateReferral(payload) {
    console.log("CreateReferral Payload Sent:", JSON.stringify(payload, null, 4));
    try {
        const result = await postRequest(`${MODEL_NAME}/create`, {
            patientId: payload.patientId,
            referredToId: payload.referredToId,
            reason: payload.reason,
            specialization: payload.specialization,
            notes: payload.notes,
        });
        console.log("CreateReferral API Response:", JSON.stringify(result, null, 4));
        return result;
    } catch (err) {
        console.log("CreateReferral API Error:", JSON.stringify(err, null, 4));
        throwServerError(err);
    }
}

export async function GetReferralPatientOptions() {
    try {
        const result = await getRequest(`${MODEL_NAME}/options/patients`);
        console.log("GetReferralPatientOptions API Response:", JSON.stringify(result, null, 4));
        return result;
    } catch (err) {
        console.log("GetReferralPatientOptions API Error:", JSON.stringify(err, null, 4));
        return throwServerError(err);
    }
}

export async function GetReferralDoctorOptions() {
    try {
        const result = await getRequest(`${MODEL_NAME}/options/doctors`);
        console.log("GetReferralDoctorOptions API Response:", JSON.stringify(result, null, 4));
        return result;
    } catch (err) {
        console.log("GetReferralDoctorOptions API Error:", JSON.stringify(err, null, 4));
        return throwServerError(err);
    }
}

export async function GetReferralNurseOptions() {
    try {
        const result = await getRequest(`${MODEL_NAME}/options/nurses`);
        console.log("GetReferralNurseOptions API Response:", JSON.stringify(result, null, 4));
        return result;
    } catch (err) {
        console.log("GetReferralNurseOptions API Error:", JSON.stringify(err, null, 4));
        return throwServerError(err);
    }
}
