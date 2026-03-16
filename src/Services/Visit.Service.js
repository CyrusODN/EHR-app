import { getRequest, postRequest, putRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = "/visit";

export async function GetDoctorSettings() {
	console.log("GetDoctorSettings called");
	try {
		const result = await getRequest(`${MODEL_NAME}`,);
		console.log("GetDoctorSettings API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
		console.log("GetDoctorSettings API Error:", JSON.stringify(err, null, 4));
		return throwServerError(err);
	}
}

export async function GetVisits(queryParams) {
    console.log("GetVisits QueryParams Sent:", JSON.stringify(queryParams, null, 4));
	try {
		const result = await getRequest(`${MODEL_NAME}`, queryParams);
        console.log("GetVisits API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
        console.log("GetVisits API Error:", JSON.stringify(err, null, 4));
		return throwServerError(err);
	}
}

export async function GetPatientVisits(patientId) {
    console.log("GetPatientVisits PatientId Sent:", patientId);
    try {
        const result = await getRequest(`${MODEL_NAME}/${patientId}`);
        console.log("GetPatientVisits API Response:", JSON.stringify(result, null, 4));
        return result;
    } catch (err) {
        console.log("GetPatientVisits API Error:", JSON.stringify(err, null, 4));
        return throwServerError(err);
    }
}

export async function CreateVisit(payload){
	console.log("CreateVisit Payload Sent:", JSON.stringify(payload, null, 4));
	try {
		const result = await postRequest(`${MODEL_NAME}/create`, payload);
		console.log("CreateVisit API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
		console.log("CreateVisit API Error:", JSON.stringify(err, null, 4));
		return throwServerError(err);
	}
}

export async function UpdateVisit(payload){
	console.log("UpdateVisit Payload Sent:", JSON.stringify(payload, null, 4));
	try {
		const result = await putRequest(`${MODEL_NAME}/update`, payload);
		console.log("UpdateVisit API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
		console.log("UpdateVisit API Error:", JSON.stringify(err, null, 4));
		return throwServerError(err);
	}
}


export async function CancelVisit(visitId){
	console.log("CancelVisit VisitId Sent:", visitId);
	try {
		const result = await putRequest(`${MODEL_NAME}/cancel/${visitId}`);
		console.log("CancelVisit API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
		console.log("CancelVisit API Error:", JSON.stringify(err, null, 4));
		return throwServerError(err);
	}
}
export async function GetVisitDetails(visitId) {
    console.log("GetVisitDetails VisitId Sent:", visitId);
    try {
        const result = await getRequest(`${MODEL_NAME}/visit/${visitId}`);
        console.log("GetVisitDetails API Response:", JSON.stringify(result, null, 4));
        return result;
    } catch (err) {
        console.log("GetVisitDetails API Error:", JSON.stringify(err, null, 4));
        return throwServerError(err);
    }
}

export async function GetPreviousVisits(visitId) {
    console.log("GetPreviousVisits VisitId Sent:", visitId);
    try {
        const result = await getRequest(`${MODEL_NAME}/${visitId}/previous`);
        console.log("GetPreviousVisits API Response:", JSON.stringify(result, null, 4));
        return result;
    } catch (err) {
        console.log("GetPreviousVisits API Error:", JSON.stringify(err, null, 4));
        return throwServerError(err);
    }
}
