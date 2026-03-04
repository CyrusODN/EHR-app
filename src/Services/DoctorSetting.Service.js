import { getRequest, postRequest, putRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = "/doctor-setting";

export async function GetDoctorSettings() {
    console.log("GetDoctorSettings called");
	try {
		const result = await getRequest(`${MODEL_NAME}`);
        console.log("GetDoctorSettings API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
        console.log("GetDoctorSettings API Error:", JSON.stringify(err, null, 4));
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


export async function GetVisitRequirements() {
    console.log("GetVisitRequirements called");
	try {
		const result = await getRequest(`${MODEL_NAME}/visit/requirements`);
        console.log("GetVisitRequirements API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
        console.log("GetVisitRequirements API Error:", JSON.stringify(err, null, 4));
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