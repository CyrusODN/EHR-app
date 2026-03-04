import { getRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = '/visit';

// Get Dashboard Visits by Date
// Expected URL: https://ehr.remedius.ai/api/visit?date=YYYY-MM-DD
export async function GetDashboardVisits(date) {
    console.log("GetDashboardVisits Query Parameter:", JSON.stringify({ date }, null, 4));
    try {
        // Axios getRequest will append { date } as ?date=value
        const result = await getRequest(MODEL_NAME, { date });
        console.log("GetDashboardVisits API Response:", JSON.stringify(result, null, 4));
        return result;
    } catch (err) {
        console.log("GetDashboardVisits API Error:", JSON.stringify(err, null, 4));
        return throwServerError(err);
    }
}
