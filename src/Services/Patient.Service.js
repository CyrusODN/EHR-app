import { getRequest, postRequest, putRequest, deleteRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = "/patient";

export async function CreatePatient(payload) {
    console.log("CreatePatient Payload Sent:", JSON.stringify(payload, null, 4));
	try {
		const result = await postRequest(`${MODEL_NAME}/create`, payload);
        console.log("CreatePatient API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
        console.log("CreatePatient API Error:", JSON.stringify(err, null, 4));
		return throwServerError(err);
	}
}

export async function DeletePatient(id) {
	try {
		const result = await deleteRequest(`${MODEL_NAME}/${id}`);
		return result;
	} catch (err) {
		return throwServerError(err);
	}
}

export async function GetPatients(queryParams) {
    console.log("GetPatients Payload Sent:", JSON.stringify(queryParams, null, 4));
	try {
		const result = await getRequest(`${MODEL_NAME}/patients`, queryParams);
        console.log("GetPatients API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
        console.log("GetPatients API Error:", JSON.stringify(err, null, 4));
		return throwServerError(err); 
	}
}

export async function GetPatientBySlug(slug) {
    console.log("GetPatientBySlug Slug Sent:", slug);
	try {
		const result = await getRequest(`${MODEL_NAME}/patient/${slug}`);
        console.log("GetPatientBySlug API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
        console.log("GetPatientBySlug API Error:", JSON.stringify(err, null, 4));
		return throwServerError(err);
	}
}