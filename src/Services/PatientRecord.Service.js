import { getRequest, postRequest, putRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = "/patient-record";

export async function GetPatientMedicalRecord(patientId) {
    console.log("GetPatientMedicalRecord PatientId Sent:", patientId);
	try {
		const result = await getRequest(`${MODEL_NAME}/${patientId}`);
        console.log("GetPatientMedicalRecord API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
        console.log("GetPatientMedicalRecord API Error:", JSON.stringify(err, null, 4));
		return throwServerError(err);
	}
}

export async function UpdatePatientMedicalRecord(payload){

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