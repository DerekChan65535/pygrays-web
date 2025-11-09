import BaseApiClient from "../utils/BaseApiClient";

export default class BankStatementApiClient extends BaseApiClient {
    // API endpoint for bank statement uploads
    private static readonly UPLOAD_ENDPOINT = "/bank-statement/process";
    
    // Field name for form data
    private static readonly CSV_FILE_FIELD = "csv_file";
    
    /**
     * Uploads a Bank Statement CSV file for processing
     * @param csvFile - The CSV file (.csv) to upload
     */
    static async uploadBankStatementFile(csvFile: File): Promise<any> {
        const formData = new FormData();
        formData.append(this.CSV_FILE_FIELD, csvFile);
        
        return this.sendFormDataRequest(this.UPLOAD_ENDPOINT, formData);
    }
}

