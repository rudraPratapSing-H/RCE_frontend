import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { AuthTabs, AuthMode } from '../features/auth/AuthTabs';
import { LoginForm } from '../features/auth/LoginForm';
import { RegisterForm } from '../features/auth/RegisterForm';
import { useLogin } from '../features/auth/hooks/useLogin';
import { useRegister } from '../features/auth/hooks/useRegister';
import { useLocation } from 'react-router-dom';
import { TerminalSquare } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const initialTab = ((location.state as any)?.tab === 'register' ? 'register' : 'login') as AuthMode;
  const [activeTab, setActiveTab] = useState(initialTab);
  const { login, isLoading: isLoginLoading, error: loginError, setError: setLoginError } = useLogin();
  const { register, isLoading: isRegisterLoading, error: registerError, setError: setRegisterError } = useRegister();
  
  const isLoading = isLoginLoading || isRegisterLoading;
  const error = loginError || registerError;

  const handleTabChange = (tab: AuthMode) => {
    setActiveTab(tab);
    setLoginError(null);
    setRegisterError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-zinc-100 selection:bg-blue-500/30 font-sans">
      <div className="mb-8 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(37,99,235,0.15)]">
          <TerminalSquare className="w-6 h-6 text-blue-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Acme Execution</h1>
        <p className="text-zinc-500 text-sm mt-2">Cloud-based RCE environments</p>
      </div>

      <Card className="animate-in fade-in zoom-in-95 duration-500">
        <AuthTabs activeTab={activeTab} onTabChange={handleTabChange} />
        
        {error && (
          <div className="p-3 mb-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        <div className="min-h-[300px]">
          {activeTab === 'login' ? (
            <LoginForm onSubmit={login} isLoading={isLoading} />
          ) : (
            <RegisterForm onSubmit={register} isLoading={isLoading} />
          )}
        </div>
      </Card>
    </div>
  );
};