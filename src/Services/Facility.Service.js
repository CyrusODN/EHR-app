import { getRequest, postRequest, putRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = "/facility";

export async function GetFacilitySettings() {
	try {
		const result = await getRequest(`${MODEL_NAME}`,);
		return result;
	} catch (err) {
		return throwServerError(err);
	}
}

export async function UpdateFacilitySettings(payload){

		try {
		const result = await putRequest(`${MODEL_NAME}/update`, payload);
		return result;
	} catch (err) {
		return throwServerError(err);
	}

}

