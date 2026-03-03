import { postRequest, getRequest, putRequest, deleteRequest } from "../api";
import { throwServerError } from "../utils/custom_errors";

const MODEL_NAME = '/user';

//*********************************************************************** */
// Statistics Services
//*********************************************************************** */

// Get Facility Statistics
export async function GetFacilityStatistics() {
    console.log("GetFacilityStatistics called");
    try {
        const result = await getRequest('/facility/statistics');
        console.log("GetFacilityStatistics response:", result);
        return result;
    } catch (err) {
        console.log("GetFacilityStatistics error:", err);
        return throwServerError(err);
    }
}

//*********************************************************************** */
// Facility Data Services
//*********************************************************************** */


//*********************************************************************** */
// Employees Management Services
//*********************************************************************** */
// Get My Permissions
export async function GetMyPermissions() {
    console.log("GetMyPermissions called");
    try {
        const result = await getRequest(`${MODEL_NAME}/my-permissions`);
        console.log("GetMyPermissions response:", result);
        return result;
    } catch (err) {
        console.log("GetMyPermissions error:", err);
        return throwServerError(err);
    }
}


// Get Director Setting (offices, director info)
export async function GetDirectorSetting() {
    console.log("GetDirectorSetting called");
    try {
        const result = await getRequest('/director-setting');
        console.log("GetDirectorSetting response:", result);
        return result;
    } catch (err) {
        console.log("GetDirectorSetting error:", err);
        return throwServerError(err);
    }
}

//Get Employees
export async function GetEmployees(params) {
    console.log("GetEmployees params:", params);
    try {
        const result = await getRequest(`${MODEL_NAME}/employee`, params);
        console.log("GetEmployees response:", result);
        return result;
    } catch (err) {
        console.log("GetEmployees error:", err);
        return throwServerError(err);
    }
}

// Add Employee
export async function AddEmployee(payload) {
    console.log("AddEmployee payload:", payload);
    try {
        const result = await postRequest(`${MODEL_NAME}/add-employee`, payload);
        console.log("AddEmployee response:", result);
        return result;
    } catch (err) {
        console.log("AddEmployee error:", err);
        return throwServerError(err);
    }  
}

// Set Employee Status
export async function SetEmployeeStatus(id) {
    console.log("SetEmployeeStatus id:", id);
    try {
        const result = await postRequest(`${MODEL_NAME}/set-status`, { id });
        console.log("SetEmployeeStatus response:", result);
        return result;
    } catch (err) {
        console.log("SetEmployeeStatus error:", err);
        return throwServerError(err);
    }
}

// Update Employee
export async function UpdateEmployee(payload) {
    console.log("UpdateEmployee payload:", payload);
    try {
        const result = await putRequest(`${MODEL_NAME}/employee/${payload.id}`, payload);
        console.log("UpdateEmployee response:", result);
        return result;
    } catch (err) {
        console.log("UpdateEmployee error:", err);
        return throwServerError(err);
    }
}

// Update Employee Permissions
export async function UpdateEmployeePermissions(payload) {
    console.log("UpdateEmployeePermissions payload:", payload);
    try {
        const result = await postRequest(`${MODEL_NAME}/employee/permissions`, payload);
        console.log("UpdateEmployeePermissions response:", result);
        return result;
    } catch (err) {
        console.log("UpdateEmployeePermissions error:", err);
        return throwServerError(err);
    }
}

// Give/Revoke Director Privilege
export async function GiveDirectorPrivilege(id, isElevated) {
    console.log("GiveDirectorPrivilege:", id, isElevated);
    try {
        const result = await putRequest(`${MODEL_NAME}/employee/${id}`, { id, isElevated });
        console.log("GiveDirectorPrivilege response:", result);
        return result;
    } catch (err) {
        console.log("GiveDirectorPrivilege error:", err);
        return throwServerError(err);
    }
}

// Get Group Permissions
export async function GetGroupPermissions(role) {
    console.log("GetGroupPermissions role:", role);
    try {
        const result = await getRequest(`${MODEL_NAME}/employee/group-permissions`, { role });
        console.log("GetGroupPermissions response:", result);
        return result;
    } catch (err) {
        console.log("GetGroupPermissions error:", err);
        return throwServerError(err);
    }
}

// Update Group Permissions
export async function UpdateGroupPermissions(payload) {
    console.log("UpdateGroupPermissions payload:", payload);
    try {
        const result = await postRequest(`${MODEL_NAME}/employee/group-permissions`, payload);
        console.log("UpdateGroupPermissions response:", result);
        return result;
    } catch (err) {
        console.log("UpdateGroupPermissions error:", err);
        return throwServerError(err);
    }
}

// Delete Employee
export async function DeleteEmployee(id) {
    console.log("DeleteEmployee id:", id);
    try {
        const result = await deleteRequest(`${MODEL_NAME}/employee/${id}`);
        console.log("DeleteEmployee response:", result);
        return result;
    } catch (err) {
        console.log("DeleteEmployee error:", err);
        return throwServerError(err);
    }
}
