import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../features/auth/AuthProvider';

export const AuthSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken, setUser } = useAuthContext();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');
    const userId = params.get('userId');
    const username = params.get('username');

    if (accessToken) {
      setAccessToken(accessToken);

      if (userId || username) {
        setUser({
          id: userId || '',
          username: username || '',
          email: ''
        });
      }

      // Navigate to workspace after setting token
      navigate('/workspace', { replace: true });
    } else {
      // If no token found, go back to login
      navigate('/', { replace: true });
    }
  }, [location.search, navigate, setAccessToken, setUser]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-100">
      <div className="text-center">
        <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <p className="text-zinc-400">Signing you in…</p>
      </div>
    </div>
  );
};

export default AuthSuccessPage;
