import axios from "axios";
import { throwServerError } from "../utils/custom_errors";
import userStore from "../store/user";

const TOOLS_API_URL = 'https://tools.remedius.ai/api';

const toolsAxios = axios.create({
    baseURL: TOOLS_API_URL,
    timeout: 30000,
});

/**
 * Fetches research projects (sessions) for Pathfinder
 * @param {string|number} userId - The user ID
 * @param {string} projectId - The project identifier
 * @param {number} limit - Maximum number of results
 * @returns {Promise<any>} The list of research projects
 */
export async function getPathfinderSessions(userId = 1, projectId = 'remedy-ehr', limit = 20) {
    try {
        const token = userStore.getState().token;
        console.log(`[PathfinderService] Fetching research projects from: ${TOOLS_API_URL}/pathfinder/research/projects`);
        
        const response = await toolsAxios.get('/pathfinder/research/projects', {
            params: {
                userId,
                projectId,
                limit
            },
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        console.log("[PathfinderService] Research projects retrieved successfully:", response.data);
        return response.data;
    } catch (err) {
        console.error("[PathfinderService] Error retrieving research projects:", err.response?.data || err.message);
        return throwServerError(err);
    }
}
