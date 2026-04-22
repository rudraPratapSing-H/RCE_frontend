import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../AuthProvider';
import apiClient from '../../../lib/apiClient';

export const useVerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuthContext();

  const verifyEmail = async (email: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/api/auth/verify-email', { email, otp });
      
      console.log('Email verified successfully', response.data);
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
      setError(err.response?.data?.message || 'Verification failed. Please check your OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return { verifyEmail, isLoading, error, setError };
};
