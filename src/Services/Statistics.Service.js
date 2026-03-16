import { getRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = '/statistics';

/**
 * Fetches visit statistics for a given date range
 * @param {string} startDate - ISO string date
 * @param {string} endDate - ISO string date
 * @returns {Promise<Object>} The visit statistics data
 */
export async function getVisitStatistics(startDate, endDate) {
    console.log(`[StatisticsService] Fetching visit statistics from ${startDate} to ${endDate}`);
    try {
        const response = await getRequest(`${MODEL_NAME}/visits`, {
            startDate,
            endDate
        });
        console.log("[StatisticsService] Visit statistics fetched successfully:", response);
        return response;
    } catch (err) {
        console.error("[StatisticsService] Error fetching visit statistics:", err);
        return throwServerError(err);
    }
}

/**
 * Fetches clinical statistics for a given date range
 * @param {string} startDate - ISO string date
 * @param {string} endDate - ISO string date
 * @returns {Promise<Object>} The clinical statistics data
 */
export async function getClinicalStatistics(startDate, endDate) {
    console.log(`[StatisticsService] Fetching clinical statistics from ${startDate} to ${endDate}`);
    try {
        const response = await getRequest(`${MODEL_NAME}/clinical`, {
            startDate,
            endDate
        });
        console.log("[StatisticsService] Clinical statistics fetched successfully:", response);
        return response;
    } catch (err) {
        console.error("[StatisticsService] Error fetching clinical statistics:", err);
        return throwServerError(err);
    }
}

/**
 * Fetches demographics statistics
 * @returns {Promise<Object>} The demographics statistics data
 */
export async function getDemographicsStatistics() {
    console.log("[StatisticsService] Fetching demographics statistics");
    try {
        const response = await getRequest(`${MODEL_NAME}/demographics`);
        console.log("[StatisticsService] Demographics statistics fetched successfully:", response);
        return response;
    } catch (err) {
        console.error("[StatisticsService] Error fetching demographics statistics:", err);
        return throwServerError(err);
    }
}

/**
 * Fetches overall summary statistics
 * @returns {Promise<Object>} The summary data
 */
export async function getSummaryStatistics() {
    console.log("[StatisticsService] Fetching summary statistics");
    try {
        const response = await getRequest(`${MODEL_NAME}/summary`);
        console.log("[StatisticsService] Summary statistics fetched successfully:", response);
        return response;
    } catch (err) {
        console.error("[StatisticsService] Error fetching summary statistics:", err);
        return throwServerError(err);
    }
}

/**
 * Fetches referral statistics for a given date range
 * @param {string} startDate - ISO string date
 * @param {string} endDate - ISO string date
 * @returns {Promise<Object>} The referral statistics data
 */
export async function getReferralStatistics(startDate, endDate) {
    console.log(`[StatisticsService] Fetching referral statistics from ${startDate} to ${endDate}`);
    try {
        const response = await getRequest(`${MODEL_NAME}/referrals`, {
            startDate,
            endDate
        });
        console.log("[StatisticsService] Referral statistics fetched successfully:", response);
        return response;
    } catch (err) {
        console.error("[StatisticsService] Error fetching referral statistics:", err);
        return throwServerError(err);
    }
}
