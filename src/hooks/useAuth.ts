import { useSyncExternalStore, useCallback } from 'react';
import { getAccessToken, setAccessToken, subscribeAccessToken } from '../lib/authToken';
import apiClient from '../lib/apiClient';

export const useAuth = () => {
  const getServerSnapshot = () => getAccessToken();

  const token = useSyncExternalStore(
    subscribeAccessToken,
    getAccessToken,
    getServerSnapshot // For SSR compatibility (if applicable)
  );

  const isAuthenticated = !!token;

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear local token regardless of backend response to securely end the session locally
      setAccessToken(null);
    }
  }, []);

  return {
    isAuthenticated,
    logout,
    token
  };
};
