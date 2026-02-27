import { getRequest, postRequest, putRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = "/medical-data";

export async function GetPatientMedicallData(patientId) {
	try {
		const result = await getRequest(`${MODEL_NAME}/${patientId}`,);
		return result;
	} catch (err) {
		return throwServerError(err);
	}
}

export async function UpdateMedicalData(payload){

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