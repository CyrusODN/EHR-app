import { getRequest, postRequest, putRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = "/visit";

export async function GetDoctorSettings() {
	try {
		const result = await getRequest(`${MODEL_NAME}`,);
		return result;
	} catch (err) {
		return throwServerError(err);
	}
}

export async function GetVisits(queryParams) {
	try {
		const result = await getRequest(`${MODEL_NAME}`,queryParams);
		return result;
	} catch (err) {
		return throwServerError(err);
	}
}

export async function CreateVisit(payload){

		try {
		const result = await postRequest(`${MODEL_NAME}/create`, payload);
		return result;
	} catch (err) {
		return throwServerError(err);
	}

}

export async function UpdateVisit(payload){

		try {
		const result = await putRequest(`${MODEL_NAME}/update`, payload);
		return result;
	} catch (err) {
		return throwServerError(err);
	}

}


export async function CancelVisit(visitId){

		try {
		const result = await putRequest(`${MODEL_NAME}/cancel/${visitId}`);
		return result;
	} catch (err) {
		return throwServerError(err);
	}

}




