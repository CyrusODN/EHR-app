import { getRequest, postRequest, putRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = "/personal-data";

export async function GetPatientPersonalData(patientId) {
    console.log("GetPatientPersonalData PatientId Sent:", patientId);
	try {
		const result = await getRequest(`${MODEL_NAME}/${patientId}`);
        console.log("GetPatientPersonalData API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
        console.log("GetPatientPersonalData API Error:", JSON.stringify(err, null, 4));
		return throwServerError(err);
	}
}

export async function UpdatePersonalData(payload){

		try {
		const result = await putRequest(`${MODEL_NAME}/update`, payload);
		return result;
	} catch (err) {
		return throwServerError(err);
	}

}

export async function GetPatientBySlug(slug){
	try {
		const result = await getRequest(`${MODEL_NAME}/patient/${slug}`);
		return result;
	} catch (err) {
		return throwServerError(err);
	}
}