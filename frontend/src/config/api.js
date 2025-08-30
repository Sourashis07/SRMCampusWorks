// Get API base URL - use environment variable or fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://srmcampusworks-production.up.railway.app' : 'http://localhost:5000');

console.log('API Base URL:', API_BASE_URL);

export const API_ENDPOINTS = {
  AUTH_SYNC: '/api/auth/sync',
  TASKS: '/api/tasks',
  BIDS: '/api/bids',
  USERS: '/api/users',
  SUBMISSIONS: '/api/submissions',
  PAYMENTS: '/api/payments'
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// Create axios instance with base configuration
import axios from 'axios';
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);