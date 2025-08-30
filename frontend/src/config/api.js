// Get API base URL - use environment variable or detect from current location
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isProd = import.meta.env.PROD;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  
  const apiUrl = envUrl || (isProd ? origin : 'http://localhost:5000');
  console.log('API Configuration:', { envUrl, isProd, origin, apiUrl });
  
  return apiUrl;
};

export const API_BASE_URL = getApiUrl();

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
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});