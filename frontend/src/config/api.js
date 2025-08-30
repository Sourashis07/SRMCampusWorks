export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH_SYNC: '/api/auth/sync',
  TASKS: '/api/tasks',
  BIDS: '/api/bids',
  USERS: '/api/users',
  SUBMISSIONS: '/api/submissions',
  PAYMENTS: '/api/payments'
};