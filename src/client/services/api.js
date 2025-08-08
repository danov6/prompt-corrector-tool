import axios from 'axios';
import { API_CONFIG } from '../../shared/constants';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.response?.status === 404) {
      throw new Error('Service not found. Please check your connection.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    } else {
      throw new Error(error.response?.data?.error || 'Something went wrong. Please try again.');
    }
  }
);

export const gradePrompt = async (prompt) => {
  try {
    const response = await api.post('/prompts/grade', { prompt });
    return response.data.score;
  } catch (error) {
    console.error('Failed to grade prompt:', error);
    throw error;
  }
};

export const getSuggestions = async (prompt) => {
  try {
    const response = await api.post('/prompts/suggestions', { prompt });
    return response.data.suggestions;
  } catch (error) {
    console.error('Failed to get suggestions:', error);
    throw error;
  }
};

export default api;