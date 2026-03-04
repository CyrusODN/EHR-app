import { getRequest, postRequest, putRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = "/medical-data";

export const MEDICATION_FORMS = [
    'Tablet',
    'Capsule',
    'Liquid',
    'Injection',
    'Inhaler',
    'Patch',
    'Cream',
    'Other'
];

export const SEVERITY_LEVELS = [
    'Mild',
    'Moderate',
    'Severe'
];

export const CONDITION_STATUSES = [
    'Active',
    'Remission',
    'Resolved'
];


export const RELATIONSHIP_OPTIONS = [
    'Mother',
    'Father',
    'Sister',
    'Brother',
    'Grandmother (maternal)',
    'Grandmother (paternal)',
    'Grandfather (maternal)',
    'Grandfather (paternal)',
    'Aunt (maternal)',
    'Aunt (paternal)',
    'Uncle (maternal)',
    'Uncle (paternal)'
];

export const RISK_CATEGORIES = [
    'Lifestyle',
    'Genetic',
    'Medical History',
    'Environmental'
];

export const RISK_LEVELS = [
    'Low',
    'Moderate',
    'High'
];

export const ALLERGY_TYPES = [
    'Drug',
    'Food',
    'Environment',
    'Other'
];




export async function GetPatientMedicalData(patientId) {
    console.log("GetPatientMedicalData PatientId Sent:", patientId);
	try {
		const result = await getRequest(`${MODEL_NAME}/${patientId}`);
        console.log("GetPatientMedicalData API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
        console.log("GetPatientMedicalData API Error:", JSON.stringify(err, null, 4));
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