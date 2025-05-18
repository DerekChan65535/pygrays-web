import BaseApiClient from "../utils/BaseApiClient";
import FileUploadUtils from "../utils/FileUploadUtils";

export default class AgingReportApiClient extends BaseApiClient {
    // API endpoint for aging report uploads
    private static readonly UPLOAD_ENDPOINT = "/aging-reports/process/";
    
    // Field names for form data
    private static readonly DATA_FILES_FIELD = "data_files";
    private static readonly MAPPING_FILE_FIELD = "mapping_file";
    
    /**
     * Uploads aging report files (multiple data CSV files and single mapping CSV file)
     */
    static async uploadAgingReportFiles(dataFiles: FileList, mappingFile: File): Promise<any> {
        const formData = FileUploadUtils.createFormData(
            dataFiles,
            this.DATA_FILES_FIELD,
            mappingFile,
            this.MAPPING_FILE_FIELD
        );
        
        return this.sendFormDataRequest(this.UPLOAD_ENDPOINT, formData);
    }
}
