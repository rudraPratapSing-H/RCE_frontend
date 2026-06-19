import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../lib/apiClient';
import { useAuthContext } from '../AuthProvider';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuthContext();
  const ORG_ID = (import.meta as any).env?.VITE_ORGANIZATION_ID ?? null;

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/api/auth/register', { username, email, password, organizationId: ORG_ID });
      
      console.log('Registered successfully. Logging in.', response.data);
      
      // The backend now returns the access token directly on register, so we can skip OTP
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);

      // Check for drafts to redirect
      let draftRedirect = '/workspace';
      try {
        const drafts = Object.keys(localStorage)
          .filter(key => key.startsWith('draft_'))
          .map(key => {
            const item = localStorage.getItem(key);
            return { key, ...(item ? JSON.parse(item) : { timestamp: 0 }) };
          })
          .sort((a, b) => b.timestamp - a.timestamp);

        if (drafts.length > 0) {
          const latestProblemId = drafts[0].key.replace('draft_', '');
          draftRedirect = `/workspace/${latestProblemId}`;
        }
      } catch (e) {
        console.error('Error reading drafts', e);
      }

      navigate(draftRedirect);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error, setError };
};
