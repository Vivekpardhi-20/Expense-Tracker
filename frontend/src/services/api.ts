import axios from 'axios';

const isLocalHost =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

const rawApiUrl = import.meta.env.VITE_API_URL || (isLocalHost ? 'http://localhost:8000' : '');
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '').replace(/\/api$/, '');

if (!API_BASE_URL) {
  throw new Error('VITE_API_URL is required when the frontend is deployed.');
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
