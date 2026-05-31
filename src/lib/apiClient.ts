import axios from 'axios';
import { getAccessToken, setAccessToken } from './authToken';
import { getBackendBaseUrl } from './backendUrl';

export const FRIENDLY_SERVER_ERROR_MESSAGE = 'Mr. Server is on call with Mrs. Server and will be here in few minutes';

const applyFriendlyServerErrorMessage = (error: any) => {
  const status = error?.response?.status;

  if (status === 404 || status === 500) {
    if (error?.response?.data && typeof error.response.data === 'object') {
      error.response.data.message = FRIENDLY_SERVER_ERROR_MESSAGE;
    }

    error.message = FRIENDLY_SERVER_ERROR_MESSAGE;
  }

  return error;
};

const API_BASE_URL = getBackendBaseUrl();
const hasAbsoluteBackendUrl = /^https?:\/\//i.test(API_BASE_URL);

const apiClient = axios.create({
  baseURL: hasAbsoluteBackendUrl ? API_BASE_URL : undefined,
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

    return Promise.reject(applyFriendlyServerErrorMessage(error));
  }
);

export default apiClient;