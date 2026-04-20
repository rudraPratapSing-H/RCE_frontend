import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

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
      <Button type="submit" isLoading={isLoading} className="mt-2">
        Sign In
      </Button>
    </form>
  );
};