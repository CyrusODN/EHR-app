import axios from "axios";
import { postRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = '/auth';
const TOOLS_API_URL = 'https://tools.remedius.ai/api';

// Create a separate axios instance for tools to avoid global interceptors from src/api/index.js
const toolsAxios = axios.create({
    baseURL: TOOLS_API_URL,
    timeout: 60000,
});

export async function getChatbotServiceToken() {
    try {
        const result = await postRequest(`${MODEL_NAME}/chatbot-service-token`, {});
        console.log("Chatbot Service Token response:", result);
        return result;
    } catch (err) {
        console.log("Chatbot Service Token error:", err);
        return throwServerError(err);
    }
}

/**
 * Searches for clinical trials
 * @param {string} token - The chatbot service token
 * @param {string} containAll - The search term for diagnosis
 * @param {string} containAny - The search term for location
 * @returns {Promise<any>} The search results
 */
export async function searchClinicalTrials(token, containAll, containAny) {
    const payload = {
        containAll: containAll,
        containAny: containAny
    };
    
    const headers = {
        Authorization: `Bearer ${token}`
    };

    console.log("[AiAssitantsService] Searching clinical trials...");
    console.log("[AiAssitantsService] Request URL:", `${TOOLS_API_URL}/clinical-trials/search`);
    console.log("[AiAssitantsService] Payload:", JSON.stringify(payload, null, 2));
    console.log("[AiAssitantsService] Headers:", JSON.stringify(headers, null, 2));
    
    try {
        const response = await toolsAxios.post('/clinical-trials/search', payload, {
            headers: headers
        });
        
        console.log("[AiAssitantsService] Clinical trials search response received:", JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (err) {
        console.error("[AiAssitantsService] searchClinicalTrials Error:", err.response?.data || err.message);
        return throwServerError(err);
    }
}
