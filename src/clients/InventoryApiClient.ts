
import BaseApiClient from "../utils/BaseApiClient";
import FileUploadUtils from "../utils/FileUploadUtils";

export default class InventoryApiClient extends BaseApiClient {
    // API endpoint for inventory uploads
    private static readonly UPLOAD_ENDPOINT = "/inventory/uploadfiles/";
    
    // Field names for form data
    private static readonly TXT_FILES_FIELD = "txt_files";
    private static readonly CSV_FILE_FIELD = "csv_files";
    
    /**
     * Uploads inventory files (multiple TXT files and single CSV file)
     */
    static async uploadInventoryFiles(txtFiles: FileList, csvFile: File): Promise<any> {
        const formData = FileUploadUtils.createFormData(
            txtFiles,
            this.TXT_FILES_FIELD,
            csvFile,
            this.CSV_FILE_FIELD
        );
        
        return this.sendFormDataRequest(this.UPLOAD_ENDPOINT, formData);
    }
}