import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../lib/apiClient';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/api/auth/register', { username, email, password });
      
      console.log('Registered successfully. Proceeding to OTP verification.', response.data);
      navigate('/verify-email', { state: { email } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error, setError };
};
