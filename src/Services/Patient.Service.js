import { getRequest, postRequest, putRequest, deleteRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = "/patient";

export async function CreatePatient(payload) {
	try {
		const result = await postRequest(`${MODEL_NAME}/create`, payload);
		return result;
	} catch (err) {
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

export async function GetPatients(queryParams){

		try {
		const result = await getRequest(`${MODEL_NAME}/patients`, queryParams);
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