import BaseApiClient from "../utils/BaseApiClient";
import FileUploadUtils from "../utils/FileUploadUtils";

export default class PaymentExtractApiClient extends BaseApiClient {
    // API endpoint for payment extract uploads
    private static readonly UPLOAD_ENDPOINT = "/payment-extract/process/";
    
    // Field name for form data
    private static readonly EXCEL_FILE_FIELD = "excel_file";
    
    /**
     * Uploads a Payment Extract Excel file for processing
     * @param excelFile - The Excel file (.xlsx) to upload
     */
    static async uploadPaymentExtractFile(excelFile: File): Promise<any> {
        const formData = new FormData();
        formData.append(this.EXCEL_FILE_FIELD, excelFile);
        
        return this.sendFormDataRequest(this.UPLOAD_ENDPOINT, formData);
    }
}

