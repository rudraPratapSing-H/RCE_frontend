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

      navigate('/workspace');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please check your OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return { verifyEmail, isLoading, error, setError };
};
