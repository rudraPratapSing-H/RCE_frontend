import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface RegisterFormProps {
  onSubmit: (username: string, email: string, pass: string) => void;
  isLoading: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Input 
        label="Username" 
        type="text" 
        placeholder="johndoe" 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required 
      />
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
        placeholder="Choose a strong password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required 
      />
      <Button type="submit" isLoading={isLoading} className="mt-4">
        Create Account
      </Button>
      <p className="text-xs text-zinc-500 text-center mt-2">
        By creating an account, you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  );
};