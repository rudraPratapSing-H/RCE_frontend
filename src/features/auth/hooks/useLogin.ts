import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../AuthProvider';
import apiClient from '../../../lib/apiClient';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuthContext();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      
      console.log('Logged in successfully', response.data);
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);

      navigate('/workspace');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error, setError };
};
