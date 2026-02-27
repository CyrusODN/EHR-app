import { getRequest, postRequest, putRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = "/doctor-setting";

export async function GetDoctorSettings() {
	try {
		const result = await getRequest(`${MODEL_NAME}`,);
		return result;
	} catch (err) {
		return throwServerError(err);
	}
}

export async function UpdateDoctorSettings(payload){

		try {
		const result = await putRequest(`${MODEL_NAME}/update`, payload);
		return result;
	} catch (err) {
		return throwServerError(err);
	}

}


export async function GetVisitRequirements(){

		try {
		const result = await getRequest(`${MODEL_NAME}/visit/requirements`);
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