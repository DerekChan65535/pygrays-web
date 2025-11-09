import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Base API client that provides common functionality for API communication
 */
export default class BaseApiClient {
    /**
     * Dynamically calculates the base URL based on the current page URL
     * Returns the base URL with /api prefix for nginx reverse proxy
     */
    protected static getBaseUrl(): string {
        // Use environment variable if available (for development)
        if (process.env.REACT_APP_API_URL) {
            return process.env.REACT_APP_API_URL;
        }
        
        // In browser environment - use /api prefix for nginx reverse proxy
        if (typeof window !== 'undefined') {
            const location = window.location;
            const protocol = location.protocol;
            const hostname = location.hostname;
            const port = location.port;
            
            // Build base URL with port if present, then add /api prefix
            const baseUrl = port ? `${protocol}//${hostname}:${port}` : `${protocol}//${hostname}`;
            return `${baseUrl}/api`;
        }
        
        // Fallback to localhost if not in browser
        return "http://127.0.0.1/api";
    }
    
    /**
     * Get the base URL for API requests
     */
    protected static get baseUrl(): string {
        return this.getBaseUrl();
    }
    
    /**
     * Sends a POST request with FormData and handles file downloads
     */
    protected static async sendFormDataRequest(
        endpoint: string, 
        formData: FormData, 
        config: AxiosRequestConfig = {}
    ): Promise<any> {
        try {
            // Set default headers and options for FormData requests
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: false,
                responseType: 'blob', // Default to blob for file downloads
                ...config
            };
            
            // Make the request
            const response = await axios.post(
                `${this.baseUrl}${endpoint}`, 
                formData, 
                requestConfig
            );
            
            return this.processResponse(response);
        } catch (error) {
            return this.processError(error);
        }
    }
    
    /**
     * Process successful response, handling both blob downloads and JSON responses
     */
    private static async processResponse(response: AxiosResponse): Promise<any> {
        // If it's a JSON response, check for errors
        if (response.data && typeof response.data === 'object' && !(response.data instanceof Blob)) {
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
            return this.handleFileDownload(response);
        }
        
        // For other successful responses
        return { success: true, data: response.data };
    }
    
    /**
     * Process error responses, handling Axios errors and blob error responses
     */
    private static async processError(error: any): Promise<any> {
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
    
    /**
     * Handle file download from blob response
     */
    private static handleFileDownload(response: AxiosResponse): any {
        const blob = new Blob([response.data], { 
            type: response.headers['content-type'] || 'application/octet-stream' 
        });
        const url = window.URL.createObjectURL(blob);
        
        // Get filename from Content-Disposition header or use default
        let filename = 'downloaded_file';
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
}
