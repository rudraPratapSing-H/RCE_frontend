import axios from 'axios';
import { getAccessToken, setAccessToken } from './authToken';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const refreshedAccessToken = response.headers?.['x-new-access-token'];
    if (refreshedAccessToken) {
      setAccessToken(refreshedAccessToken);
    }

    return response;
  },
  (error) => {
    const refreshedAccessToken = error?.response?.headers?.['x-new-access-token'];
    if (refreshedAccessToken) {
      setAccessToken(refreshedAccessToken);
    }

    return Promise.reject(error);
  }
);

export default apiClient;