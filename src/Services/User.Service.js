import { getRequest, putRequest, postRequest, deleteRequest } from "../api";
import { HttpStatusCode } from "axios";

import { ErrorMessages } from "../constants/CustomMessages";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = "/user";


export async function Enable2FA(data){ 

		try {
		const result = await postRequest(`${MODEL_NAME}/enable/2fa`, data);
		return result;
	} catch (err) {
		return throwServerError(err);
	}

}