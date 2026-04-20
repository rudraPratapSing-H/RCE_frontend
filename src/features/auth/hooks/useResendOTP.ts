import { useState } from 'react';
import apiClient from '../../../lib/apiClient';

export const useResendOTP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resendOTP = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/api/auth/resend-otp', { email });
      console.log('OTP Resent successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return { resendOTP, isLoading, error, setError };
};
