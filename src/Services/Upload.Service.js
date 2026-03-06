import { HttpStatusCode } from "axios";
import { postFormDataRequest } from "../api";
import { throwServerError } from "./../utils/custom_errors";


const MODEL_NAME = "/upload";

export async function uploadFileOnServer(file) {
  try {
    let formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name || file.fileName || 'upload.pdf',
      type: file.type || 'application/pdf'
    });

    const result = await postFormDataRequest(`${MODEL_NAME}`, formData);
    return result;
   
  } catch (err) {
    return throwServerError(err);
  }
}
