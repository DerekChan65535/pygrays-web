
import axios from "axios";

export default class ApiClient {
    private static baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
    
    static async sendFiles(formData: FormData): Promise<any> {
        try {
            const response = await axios.post(`${this.baseUrl}/upload-files`, formData, {
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