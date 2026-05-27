import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { getBackendUrl } from '../../lib/backendUrl';

interface LoginFormProps {
  onSubmit: (email: string, pass: string) => void;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Input 
        label="Email address" 
        type="email" 
        placeholder="you@example.com" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
      />
      <Input 
        label="Password" 
        type="password" 
        placeholder="••••••••" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required 
      />
      <div className="flex justify-end mt-[-8px]">
        <button type="button" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          Forgot password?
        </button>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1" />
        <button
          type="button"
          aria-label="Sign in with Google"
          onClick={() => { window.location.href = getBackendUrl('/api/auth/google'); }}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
        >
          <div className="sr-only">Sign in with Google</div>
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M44.5 20H24v8.5h11.9C34.7 32.9 30.1 36 24 36c-7 0-12.7-5.7-12.7-12.7S17 10.6 24 10.6c3.2 0 6.1 1.2 8.3 3.1l6-6C35.2 4 29.9 2 24 2 12.3 2 3 11.3 3 23s9.3 21 21 21c11.9 0 21-9.3 21-21 0-1.4-.1-2.7-.5-4z" fill="#FBBC05"/>
            <path d="M6.3 14.6l6.9 5c1.9-5.7 7.3-9.6 13.8-9.6 3.2 0 6.1 1.2 8.3 3.1l6-6C35.2 4 29.9 2 24 2 16.4 2 9.8 6.8 6.3 14.6z" fill="#EA4335"/>
            <path d="M24 44c6.1 0 11.7-2.1 16-5.7l-7.3-6.1c-2.2 1.6-5 2.6-8.7 2.6-6.1 0-11.4-3.8-13.3-9.3l-7 5.4C8.6 38.9 15.8 44 24 44z" fill="#34A853"/>
            <path d="M44.5 20H24v8.5h11.9c-1.1 3.2-3.1 5.9-5.9 7.6-1.6.9-3.4 1.4-5.2 1.4-6.1 0-11.4-3.8-13.3-9.3l-7 5.4C8.6 38.9 15.8 44 24 44c11.9 0 21-9.3 21-21 0-1.4-.1-2.7-.5-4z" fill="#4285F4"/>
          </svg>
        </button>
        <button
          type="button"
          onClick={() => { window.location.href = getBackendUrl('/api/auth/google'); }}
          className="text-sm text-zinc-200 hover:text-white transition-colors"
        >
          Sign in with Google
        </button>
      </div>
      <Button type="submit" isLoading={isLoading} className="mt-2">
        Sign In
      </Button>
    </form>
  );
};