
import axios from "axios";

export default class ApiClient {
    /**
     * Dynamically calculates the base URL based on the current page URL
     * Returns the hostname from the current URL with port 8000
     */
    private static getBaseUrl(): string {
        // Use environment variable if available (for development)
        if (process.env.REACT_APP_API_URL) {
            return process.env.REACT_APP_API_URL;
        }
        
        // In browser environment
        if (typeof window !== 'undefined') {
            const location = window.location;
            const protocol = location.protocol;
            const hostname = location.hostname;
            
            // Always use port 8000 for the API
            return `${protocol}//${hostname}:8000`;
        }
        
        // Fallback to localhost if not in browser
        return "http://127.0.0.1:8000";
    }
    
    /**
     * Get the base URL for API requests
     */
    private static get baseUrl(): string {
        return this.getBaseUrl();
    }
    
    /**
     * Creates FormData from the provided files
     */
    private static createFormData(txtFiles: FileList, csvFile: File): FormData {
        const formData = new FormData();
        
        // Append all TXT files
        for (let i = 0; i < txtFiles.length; i++) {
            formData.append('txt_files', txtFiles[i]);
        }
        
        // Append the single CSV file
        formData.append('csv_files', csvFile);
        
        return formData;
    }
    
    /**
     * Uploads inventory files (multiple TXT files and single CSV file)
     */
    static async uploadInventoryFiles(txtFiles: FileList, csvFile: File): Promise<any> {
        const formData = this.createFormData(txtFiles, csvFile);
        return this.sendInventoryFiles(formData);
    }
    
    /**
     * Sends form data to the server
     */
    static async sendInventoryFiles(formData: FormData): Promise<any> {
        try {
            const response = await axios.post(`${this.baseUrl}/inventory/uploadfiles`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return { success: true, data: response.data };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return { 
                    success: false, 
                    error: error.response?.data?.message || 'Error uploading files' 
                };
            }
            return { success: false, error: 'An unexpected error occurred' };
        }
    }
}