import axios from 'axios';
import { getChatbotUserId } from '../utils/aiTools';

// Base URL for tools service
const TOOLS_API_URL = 'https://tools.remedius.ai/api';

// Create a separate axios instance for tools to avoid global interceptors from src/api/index.js
const toolsAxios = axios.create({
    baseURL: TOOLS_API_URL,
    timeout: 120000,
});

/**
 * Fetches clinical consultation sessions
 * @param {string} token - The chatbot service token
 * @returns {Promise<Object>} The sessions data
 */
export async function getConsultSessions(token) {
    console.log("[ConsultToolService] Initiating getConsultSessions request...");
    
    if (!token) {
        console.error("[ConsultToolService] Error: No token provided to getConsultSessions");
        return { success: false, message: "No token provided" };
    }

    try {
        const response = await toolsAxios.get('/consult/sessions', {
            params: {
                userId: getChatbotUserId(),
                projectId: 'remedy-ehr',
                limit: 20
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log("[ConsultToolService] getConsultSessions Success:", {
            status: response.status,
            dataCount: response.data?.data?.length || 0,
            success: response.data?.success
        });
        
        return response.data;
    } catch (err) {
        const errorDetails = {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url
        };
        console.error("[ConsultToolService] getConsultSessions Error:", errorDetails);
        
        // Return a structured error response instead of throwing to prevent app crash if unhandled
        return {
            success: false,
            message: err.response?.data?.message || err.message,
            error: errorDetails
        };
    }
}

/**
 * Creates a new clinical consultation session
 * @param {string} token - The chatbot service token
 * @param {string} specialty - One of 'childPsychiatry', 'adultPsychiatry', or 'internalMedicine'
 * @returns {Promise<Object>} The created session data
 */
export async function createConsultSession(token, specialty) {
    const payload = {
        patientInfo: {},
        projectId: "remedy-ehr",
        specialty: specialty,
        userId: getChatbotUserId()
    };
    
    console.log("[ConsultToolService] Initiating createConsultSession...");
    console.log("[ConsultToolService] Payload sent:", JSON.stringify(payload, null, 2));
    
    if (!token) {
        console.error("[ConsultToolService] Error: No token provided to createConsultSession");
        return { success: false, message: "No token provided" };
    }

    try {
        const response = await toolsAxios.post('/consult/session', payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log("[ConsultToolService] Response received:", JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (err) {
        const errorDetails = {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url
        };
        console.error("[ConsultToolService] createConsultSession Error:", errorDetails);
        return {
            success: false,
            message: err.response?.data?.message || err.message,
            error: errorDetails
        };
    }
}
/**
 * Fetches details and history for a specific consultation session
 * @param {string} token - The chatbot service token
 * @param {string} sessionId - The ID of the session to retrieve
 * @returns {Promise<Object>} The session details and message history
 */
export async function getConsultSessionDetails(token, sessionId) {
    console.log(`[ConsultToolService] Fetching details for session: ${sessionId}...`);
    
    if (!token || !sessionId) {
        console.error("[ConsultToolService] Error: Missing token or sessionId for getConsultSessionDetails");
        return { success: false, message: "Missing token or sessionId" };
    }

    try {
        const response = await toolsAxios.get(`/consult/session/${sessionId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log("[ConsultToolService] Session details received:", JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (err) {
        const errorDetails = {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url
        };
        console.error("[ConsultToolService] getConsultSessionDetails Error:", errorDetails);
        return {
            success: false,
            message: err.response?.data?.message || err.message,
            error: errorDetails
        };
    }
}

/**
 * Sends a message to the consultation AI assistant
 * @param {string} token - The chatbot service token
 * @param {Object} data - Message data (message, sessionId, etc.)
 * @returns {Promise<Object>} The AI response
 */
export async function sendConsultMessage(token, data) {
    const payload = {
        message: data.message || "",
        sessionId: data.sessionId || "",
        patientInfo: data.patientInfo || {},
        symptoms: data.symptoms || "",
        history: data.history || "",
        additionalContext: data.additionalContext || ""
    };
    
    console.log("[ConsultToolService] Sending message to AI...");
    console.log("[ConsultToolService] Message payload:", JSON.stringify(payload, null, 2));
    
    if (!token) {
        console.error("[ConsultToolService] Error: No token provided for sendConsultMessage");
        return { success: false, message: "No token provided" };
    }

    try {
        const response = await toolsAxios.post('/consult/message', payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log("[ConsultToolService] AI Response received:", JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (err) {
        const errorDetails = {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url
        };
        console.error("[ConsultToolService] sendConsultMessage Error:", errorDetails);
        return {
            success: false,
            message: err.response?.data?.message || err.message,
            error: errorDetails
        };
    }
}

/**
 * Deletes a specific consultation session
 * @param {string} token - The chatbot service token
 * @param {string} sessionId - The ID of the session to delete
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteConsultSession(token, sessionId) {
    console.log(`[ConsultToolService] Initiating deletion of session: ${sessionId}...`);
    
    if (!token || !sessionId) {
        console.error("[ConsultToolService] Error: Missing token or sessionId for deleteConsultSession");
        return { success: false, message: "Missing token or sessionId" };
    }

    try {
        const response = await toolsAxios.delete(`/consult/session/${sessionId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log("[ConsultToolService] Deletion Response received:", JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (err) {
        const errorDetails = {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url
        };
        console.error("[ConsultToolService] deleteConsultSession Error:", errorDetails);
        return {
            success: false,
            message: err.response?.data?.message || err.message,
            error: errorDetails
        };
    }
}

