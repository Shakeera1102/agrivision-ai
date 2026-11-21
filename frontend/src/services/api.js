import axios from 'axios';

// When deployed on Vercel, VITE_API_BASE_URL points to the Render backend (e.g., https://your-backend.onrender.com/api)
// When running locally, it defaults to http://localhost:8000/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8000/api'
    : '/api'
);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds to allow Render cold starts and deep feature extraction
});

export const apiService = {
  // Check backend and model status
  async checkHealth() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  },

  // Perform disease & pest detection on uploaded crop image
  async predictImage(file, onUploadProgress) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },

  // Fetch verified research performance metrics and evaluation dataset
  async getModelMetrics() {
    const response = await apiClient.get('/model-metrics');
    return response.data;
  },

  // Fetch model architecture & feature engineering metadata
  async getModelInfo() {
    const response = await apiClient.get('/model-info');
    return response.data;
  },
};

export default apiService;
