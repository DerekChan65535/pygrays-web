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
     * @returns FormData object with appended files
     */
    public static createFormData(
        multipleFiles: FileList,
        multipleFilesFieldName: string,
        singleFile: File,
        singleFileFieldName: string
    ): FormData {
        const formData = new FormData();
        
        // Append all files from the FileList
        for (let i = 0; i < multipleFiles.length; i++) {
            formData.append(multipleFilesFieldName, multipleFiles[i]);
        }
        
        // Append the single file
        formData.append(singleFileFieldName, singleFile);
        
        return formData;
    }
}
