import axios from "axios";

export default class AgingReportApiClient {
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
    private static createFormData(dataFiles: FileList, mappingFile: File): FormData {
        const formData = new FormData();
        
        // Append all data CSV files
        for (let i = 0; i < dataFiles.length; i++) {
            formData.append('data_files', dataFiles[i]);
        }
        
        // Append the single mapping CSV file
        formData.append('mapping_file', mappingFile);
        
        return formData;
    }
    
    /**
     * Uploads aging report files (multiple data CSV files and single mapping CSV file)
     */
    static async uploadAgingReportFiles(dataFiles: FileList, mappingFile: File): Promise<any> {
        const formData = this.createFormData(dataFiles, mappingFile);
        return this.sendAgingReportFiles(formData);
    }
    
    /**
     * Sends form data to the server
     */
    static async sendAgingReportFiles(formData: FormData): Promise<any> {
        try {
            // Make the request with blob responseType for handling file downloads
            const response = await axios.post(`${this.baseUrl}/aging-report/uploadfiles/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: false,
                responseType: 'blob' // Default to blob for file downloads
            });
            
            // If it's a JSON response, check for errors
            if (response.data && typeof response.data === 'object') {
                // Check if this is an error response with the expected format
                if (response.data.is_success === false && response.data.errors) {
                    return {
                        success: false,
                        errorMessages: response.data.errors,
                        error: Array.isArray(response.data.errors) 
                            ? response.data.errors.join(', ') 
                            : 'Error processing files'
                    };
                }
            }
            
            // If response status is 200 and it's a blob, handle file download
            if (response.status === 200 && response.data instanceof Blob) {
                const blob = new Blob([response.data], { 
                    type: response.headers['content-type'] || 'application/octet-stream' 
                });
                const url = window.URL.createObjectURL(blob);
                
                // Get filename from Content-Disposition header or use default
                let filename = 'aging_report';
                const contentDisposition = response.headers['content-disposition'];
                console.log('Content-Disposition header:', contentDisposition);
                
                if (contentDisposition) {
                    // First, try to match "filename="
                    const filenameRegex = /filename=([^;]+)/i;
                    const matches = contentDisposition.match(filenameRegex);
                    
                    if (matches && matches[1]) {
                        // Remove quotes if present
                        filename = matches[1].replace(/["']/g, '').trim();
                        console.log('Extracted filename:', filename);
                    } else {
                        // If the first regex doesn't work, try a more permissive one
                        const alternativeMatch = contentDisposition.match(/filename\s*=\s*(?:(['"])([^'"]+)\1|([^;\s]+))/i);
                        if (alternativeMatch) {
                            filename = (alternativeMatch[2] || alternativeMatch[3]).trim();
                            console.log('Extracted filename (alternative):', filename);
                        }
                    }
                }
                
                // Create a temporary anchor element to trigger download
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                
                // Clean up
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                return { 
                    success: true, 
                    data: { message: 'File downloaded successfully', filename }
                };
            }
            
            // For other successful responses
            return { success: true, data: response.data };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error details:', error.message, error.response);
                
                // Check if status is not 200 and content-type is JSON
                const contentType = error.response?.headers?.['content-type'] || '';
                const isJsonResponse = contentType.includes('application/json');
                
                if (error.response?.data && isJsonResponse) {
                    try {
                        // If response is a blob, convert it to JSON
                        if (error.response.data instanceof Blob) {
                            const text = await error.response.data.text();
                            const jsonData = JSON.parse(text);
                            
                            if (jsonData.is_success === false && jsonData.errors) {
                                return {
                                    success: false,
                                    errorMessages: jsonData.errors,
                                    error: Array.isArray(jsonData.errors) 
                                        ? jsonData.errors.join(', ') 
                                        : 'Error processing files'
                                };
                            }
                        }
                    } catch (e) {
                        console.error('Error parsing error response:', e);
                    }
                }
                
                return { 
                    success: false, 
                    error: error.response?.data?.message || 'Error uploading files' 
                };
            }
            return { success: false, error: 'An unexpected error occurred' };
        }
    }
}
