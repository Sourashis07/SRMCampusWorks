// Get API base URL - use environment variable or fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://your-backend-url.herokuapp.com' : 'http://localhost:5000');

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
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});