/**
 * Utility functions for handling file uploads
 */
export default class FileUploadUtils {
    /**
     * Creates FormData from multiple files and a single file
     * @param multipleFiles FileList containing multiple files
     * @param multipleFilesFieldName Field name for multiple files
     * @param singleFile Single file to upload
     * @param singleFileFieldName Field name for single file
     * @param additionalFields Optional object containing additional form fields
     * @returns FormData object with appended files and additional fields
     */
    public static createFormData(
        multipleFiles: FileList,
        multipleFilesFieldName: string,
        singleFile: File | FileList,
        singleFileFieldName: string,
        additionalFields?: Record<string, string>
    ): FormData {
        const formData = new FormData();
        
        // Append all files from the FileList
        for (let i = 0; i < multipleFiles.length; i++) {
            formData.append(multipleFilesFieldName, multipleFiles[i]);
        }
        
        // Append the single file or multiple files
        if (singleFile instanceof File) {
            formData.append(singleFileFieldName, singleFile);
        } else if (singleFile instanceof FileList) {
            for (let i = 0; i < singleFile.length; i++) {
                formData.append(singleFileFieldName, singleFile[i]);
            }
        }
        
        // Append additional fields if provided
        if (additionalFields) {
            Object.entries(additionalFields).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });
        }
        
        return formData;
    }
}
