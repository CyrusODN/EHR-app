import { getRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = '/patient-logs';

export async function GetPatientLogs(patientId) {
    console.log("GetPatientLogs PatientId Sent:", patientId);
    try {
        const result = await getRequest(`${MODEL_NAME}/${patientId}/logs`);
        console.log("GetPatientLogs API Response:", JSON.stringify(result, null, 4));
        return result;
    } catch (err) {
        console.log("GetPatientLogs API Error:", JSON.stringify(err, null, 4));
        return throwServerError(err);
    }
}

export async function GetPatientAuditTrail(patientId) {
    try {
        const result = await getRequest(`${MODEL_NAME}/${patientId}/audit-trail`);
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}
