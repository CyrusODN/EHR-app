import { getRequest, postRequest, putRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = "/visit";

export async function GetDoctorSettings() {
	console.log("GetDoctorSettings called");
	try {
		const result = await getRequest(`${MODEL_NAME}`,);
		console.log("GetDoctorSettings API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
		console.log("GetDoctorSettings API Error:", JSON.stringify(err, null, 4));
		return throwServerError(err);
	}
}

export async function GetVisits(queryParams) {
    console.log("GetVisits QueryParams Sent:", JSON.stringify(queryParams, null, 4));
	try {
		const result = await getRequest(`${MODEL_NAME}`, queryParams);
        console.log("GetVisits API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
        console.log("GetVisits API Error:", JSON.stringify(err, null, 4));
		return throwServerError(err);
	}
}

export async function GetPatientVisits(patientId) {
    console.log("GetPatientVisits PatientId Sent:", patientId);
    try {
        const result = await getRequest(`${MODEL_NAME}/${patientId}`);
        console.log("GetPatientVisits API Response:", JSON.stringify(result, null, 4));
        return result;
    } catch (err) {
        console.log("GetPatientVisits API Error:", JSON.stringify(err, null, 4));
        return throwServerError(err);
    }
}

export async function CreateVisit(payload){
	console.log("CreateVisit Payload Sent:", JSON.stringify(payload, null, 4));
	try {
		const result = await postRequest(`${MODEL_NAME}/create`, payload);
		console.log("CreateVisit API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
		console.log("CreateVisit API Error:", JSON.stringify(err, null, 4)); 
		return throwServerError(err);
	}
}

export async function UpdateVisit(payload){
	console.log("UpdateVisit Payload Sent:", JSON.stringify(payload, null, 4));
	try {
		const result = await putRequest(`${MODEL_NAME}/update`, payload);
		console.log("UpdateVisit API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
		console.log("UpdateVisit API Error:", JSON.stringify(err, null, 4));
		return throwServerError(err);
	}
}


export async function CancelVisit(visitId){
	console.log("CancelVisit VisitId Sent:", visitId);
	try {
		const result = await putRequest(`${MODEL_NAME}/cancel/${visitId}`);
		console.log("CancelVisit API Response:", JSON.stringify(result, null, 4));
		return result;
	} catch (err) {
		console.log("CancelVisit API Error:", JSON.stringify(err, null, 4));
		return throwServerError(err);
	}
}
export async function GetVisitDetails(visitId) {
    console.log("GetVisitDetails VisitId Sent:", visitId);
    try {
        const result = await getRequest(`${MODEL_NAME}/visit/${visitId}`);
        console.log("GetVisitDetails API Response:", JSON.stringify(result, null, 4));
        return result;
    } catch (err) {
        console.log("GetVisitDetails API Error:", JSON.stringify(err, null, 4));
        return throwServerError(err);
    }
}

export async function GetPreviousVisits(visitId, limit) {
    try {
        const params = limit ? { limit } : undefined;
        const result = await getRequest(`${MODEL_NAME}/${visitId}/previous`, params);
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

export async function GetClinicalDecisionSupport(visitId, selectedVisitIds = []) {
    try {
        const result = await postRequest(`${MODEL_NAME}/clinical-decision-support/${visitId}`, {
            selectedVisitIds,
        });
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

export async function GetInterviewAnalysis(visitId) {
    try {
        const result = await postRequest(`${MODEL_NAME}/interview-analysis/${visitId}`, {});
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

export async function SearchMedicines(query, limit = 20) {
    try {
        const result = await getRequest('/medical-data/medicines/search', { query, limit });
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

export async function GetMedicineDetails(key) {
    try {
        const result = await getRequest(`/medical-data/medicines/${key}`);
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

export async function TranscribeAudio(visitId, audioUrl) {
    try {
        const result = await postRequest(`/visit-notes/${visitId}/transcribe`, { audioUrl });
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

export async function GenerateVisitNoteStreaming({ visitId, noteType, visitType, specialization, instructions, previousVisits, length = 'large', customPromptId }) {
    try {
        const result = await postRequest(`/visit-notes/${visitId}/generate-notes-stream`, {
            noteType, visitType, specialization, instructions, previousVisits, length, customPromptId,
        });
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

// Laboratory Services
export async function CreateLabOrder(visitId, payload) {
    try {
        const result = await postRequest(`${MODEL_NAME}/${visitId}/lab-orders`, payload);
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

export async function GetLabOrders(visitId) {
    try {
        const result = await getRequest(`${MODEL_NAME}/${visitId}/lab-orders`);
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

export async function UpdateLabOrderStatus(visitId, orderId, status) {
    try {
        const result = await putRequest(`${MODEL_NAME}/${visitId}/lab-orders/${orderId}/status`, { status });
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

export async function AddLabResults(visitId, orderId, results) {
    try {
        const result = await postRequest(`${MODEL_NAME}/${visitId}/lab-orders/${orderId}/results`, results);
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

export async function GetAvailableLabTests() {
    try {
        const result = await getRequest('/medical-data/lab-tests');
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

// Procedures Services
export async function CreateProcedure(visitId, payload) {
    try {
        const result = await postRequest(`${MODEL_NAME}/${visitId}/procedures`, payload);
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

export async function GetProcedures(visitId) {
    try {
        const result = await getRequest(`${MODEL_NAME}/${visitId}/procedures`);
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

export async function UpdateProcedureStatus(visitId, procedureId, status) {
    try {
        const result = await putRequest(`${MODEL_NAME}/${visitId}/procedures/${procedureId}/status`, { status });
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

export async function AddProcedureResults(visitId, procedureId, results) {
    try {
        const result = await postRequest(`${MODEL_NAME}/${visitId}/procedures/${procedureId}/results`, results);
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

export async function GetAvailableProcedures() {
    try {
        const result = await getRequest('/medical-data/procedures');
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

// Voice Transcription Services
export async function UploadAudioFile(formData) {
    try {
        const result = await postRequest('/upload', formData);
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

// Diagnostic Assistant
export async function GetDiagnosticSuggestions(visitId, symptoms) {
    try {
        const result = await postRequest(`${MODEL_NAME}/${visitId}/diagnostic-assistant`, { symptoms });
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

// Medication Assistant
export async function GetMedicationKnowledgeGraph(medicationName) {
    try {
        const result = await getRequest('/medical-data/medication-graph', { query: medicationName });
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}

export async function GetNearbyPharmacies(medicationName, location) {
    try {
        const result = await getRequest('/medical-data/pharmacies', { medication: medicationName, ...location });
        return result;
    } catch (err) {
        return throwServerError(err);
    }
}
