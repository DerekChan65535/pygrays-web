import BaseApiClient from "../utils/BaseApiClient";
import FileUploadUtils from "../utils/FileUploadUtils";

export default class AgingReportApiClient extends BaseApiClient {
    // API endpoint for aging report uploads
    private static readonly UPLOAD_ENDPOINT = "/aging-reports/process/";
    
    // Field names for form data
    private static readonly DATA_FILES_FIELD = "data_files";
    private static readonly MAPPING_FILE_FIELD = "mapping_file";
    private static readonly REPORT_DATE_FIELD = "report_date";
    
    /**
     * Uploads aging report files (multiple data CSV files and single mapping CSV file)
     * @param dataFiles - The data files to upload
     * @param mappingFile - The mapping file to upload
     * @param reportDate - Optional date to use for report calculations (format YYYY-MM-DD)
     */
    static async uploadAgingReportFiles(
        dataFiles: FileList, 
        mappingFile: File, 
        reportDate?: string
    ): Promise<any> {
        const formData = FileUploadUtils.createFormData(
            dataFiles,
            this.DATA_FILES_FIELD,
            mappingFile,
            this.MAPPING_FILE_FIELD
        );
        
        // Add report date to form data if provided
        if (reportDate) {
            formData.append(this.REPORT_DATE_FIELD, reportDate);
        }
        
        return this.sendFormDataRequest(this.UPLOAD_ENDPOINT, formData);
    }
}
