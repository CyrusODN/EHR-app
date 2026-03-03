import { getRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = '/visit';

// Get Dashboard Visits by Date
export async function GetDashboardVisits(date) {
    console.log("GetDashboardVisits called with date:", date);
    try {
        const result = await getRequest(`${MODEL_NAME}`, { date });
        console.log("GetDashboardVisits response:", result);
        return result;
    } catch (err) {
        console.log("GetDashboardVisits error:", err);
        return throwServerError(err);
    }
}
