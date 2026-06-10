import axios from 'axios';
import { getChatbotUserId } from '../utils/aiTools';

// Base URL for tools service
const TOOLS_API_URL = 'https://tools.remedius.ai/api';

// Create a separate axios instance for tools to avoid global interceptors from src/api/index.js
const toolsAxios = axios.create({
    baseURL: TOOLS_API_URL,
    timeout: 60000,
});

/**
 * Fetches pharmacopedia consultation sessions
 * @param {string} token - The chatbot service token
 * @returns {Promise<Object>} The sessions data
 */
export async function getPharmacopediaSessions(token) {
    console.log("[PharmacopediaToolService] Fetching sessions...");
    
    if (!token) {
        console.error("[PharmacopediaToolService] Error: Missing token for getPharmacopediaSessions");
        return { success: false, message: "Missing token" };
    }

    try {
        const response = await toolsAxios.get('/pharmacopedia/sessions', {
            params: {
                userId: getChatbotUserId(),
                projectId: 'remedy-ehr',
                limit: 20
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log("[PharmacopediaToolService] Sessions fetched successfully:", response.data?.data?.length || 0, "sessions found");
        // Log the first session for debugging if available
        if (response.data?.data?.length > 0) {
            console.log("[PharmacopediaToolService] First session sample:", JSON.stringify(response.data.data[0], null, 2));
        }
        
        return response.data;
    } catch (err) {
        const errorDetails = {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url
        };
        console.error("[PharmacopediaToolService] getPharmacopediaSessions Error:", errorDetails);
        return {
            success: false,
            message: err.response?.data?.message || err.message,
            error: errorDetails
        };
    }
}

/**
 * Creates a new pharmacopedia consultation session
 * @param {string} token - The chatbot service token
 * @returns {Promise<Object>} The new session data
 */
export async function createPharmacopediaSession(token) {
    console.log("[PharmacopediaToolService] Creating new session...");
    
    if (!token) {
        console.error("[PharmacopediaToolService] Error: Missing token for createPharmacopediaSession");
        return { success: false, message: "Missing token" };
    }

    const payload = {
        medications: [],
        patientId: null,
        projectId: "remedy-ehr",
        userId: getChatbotUserId(),
        visitId: null
    };

    console.log("[PharmacopediaToolService] Create Session Payload:", JSON.stringify(payload, null, 2));

    try {
        const response = await toolsAxios.post('/pharmacopedia/session', payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log("[PharmacopediaToolService] Create Session Response received:", JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (err) {
        const errorDetails = {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url
        };
        console.error("[PharmacopediaToolService] createPharmacopediaSession Error:", errorDetails);
        return {
            success: false,
            message: err.response?.data?.message || err.message,
            error: errorDetails
        };
    }
}

/**
 * Retrieves a specific pharmacopedia session's details and history
 * @param {string} token - The chatbot service token
 * @param {string} sessionId - The ID of the session to retrieve
 * @returns {Promise<Object>} The session details and history
 */
export async function getPharmacopediaSessionDetails(token, sessionId) {
    console.log(`[PharmacopediaToolService] Fetching details for session: ${sessionId}...`);
    
    if (!token || !sessionId) {
        console.error("[PharmacopediaToolService] Error: Missing token or sessionId for getPharmacopediaSessionDetails");
        return { success: false, message: "Missing token or sessionId" };
    }

    try {
        const response = await toolsAxios.get(`/pharmacopedia/session/${sessionId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log("[PharmacopediaToolService] Session Details Response received:", JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (err) {
        const errorDetails = {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url
        };
        console.error("[PharmacopediaToolService] getPharmacopediaSessionDetails Error:", errorDetails);
        return {
            success: false,
            message: err.response?.data?.message || err.message,
            error: errorDetails
        };
    }
}

/**
 * Deletes a specific pharmacopedia session
 * @param {string} token - The chatbot service token
 * @param {string} sessionId - The ID of the session to delete
 * @returns {Promise<Object>} Deletion result
 */
export async function deletePharmacopediaSession(token, sessionId) {
    console.log(`[PharmacopediaToolService] Initiating deletion of session: ${sessionId}...`);
    
    if (!token || !sessionId) {
        console.error("[PharmacopediaToolService] Error: Missing token or sessionId for deletePharmacopediaSession");
        return { success: false, message: "Missing token or sessionId" };
    }

    try {
        const response = await toolsAxios.put(`/pharmacopedia/session/${sessionId}/delete`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log("[PharmacopediaToolService] Deletion Response received:", JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (err) {
        const errorDetails = {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url
        };
        console.error("[PharmacopediaToolService] deletePharmacopediaSession Error:", errorDetails);
        return {
            success: false,
            message: err.response?.data?.message || err.message,
            error: errorDetails
        };
    }
}

/**
 * Sends a message to the pharmacopedia chatbot
 * @param {string} token - The chatbot service token
 * @param {string} sessionId - The current session ID
 * @param {string} message - The message text
 * @returns {Promise<Object>} The AI response
 */
export async function sendPharmacopediaMessage(token, sessionId, message) {
    console.log(`[PharmacopediaToolService] Sending message to session: ${sessionId}...`);
    
    if (!token || !sessionId || !message) {
        console.error("[PharmacopediaToolService] Error: Missing required parameters for sendPharmacopediaMessage");
        return { success: false, message: "Missing token, sessionId, or message" };
    }

    const payload = {
        context: {},
        message: message,
        sessionId: sessionId
    };

    console.log("[PharmacopediaToolService] Send Message Payload:", JSON.stringify(payload, null, 2));

    try {
        const response = await toolsAxios.post('/pharmacopedia/message', payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log("[PharmacopediaToolService] Message Response received:", JSON.stringify(response.data, null, 2));
        
        return response.data;
    } catch (err) {
        const errorDetails = {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url
        };
        console.error("[PharmacopediaToolService] sendPharmacopediaMessage Error:", errorDetails);
        return {
            success: false,
            message: err.response?.data?.message || err.message,
            error: errorDetails
        };
    }
}



