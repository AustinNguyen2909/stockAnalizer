import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to parse numeric values
const parseNumericValues = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(item => parseNumericValues(item));
  }
  
  if (data !== null && typeof data === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Check if the value is a string that looks like a number
      if (typeof value === 'string' && /^-?\d*\.?\d+$/.test(value)) {
        result[key] = parseFloat(value);
      } else if (typeof value === 'object') {
        result[key] = parseNumericValues(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  
  return data;
};

// Response interceptor for handling errors and parsing numeric values
api.interceptors.response.use(
  (response) => {
    // Parse numeric values in the response data
    response.data = parseNumericValues(response.data);
    return response;
  },
  (error) => {
    // Only redirect to login if we're not already on the login page
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 