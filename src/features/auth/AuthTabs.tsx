import React from 'react';

export type AuthMode = 'login' | 'register';

interface AuthTabsProps {
  activeTab: AuthMode;
  onTabChange: (tab: AuthMode) => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex p-1 bg-zinc-950/50 rounded-lg border border-zinc-800/80 mb-6">
      <button
        onClick={() => onTabChange('login')}
        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
          activeTab === 'login'
            ? 'bg-zinc-800 text-zinc-100 shadow-sm'
            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
        }`}
      >
        Sign In
      </button>
      <button
        onClick={() => onTabChange('register')}
        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
          activeTab === 'register'
            ? 'bg-zinc-800 text-zinc-100 shadow-sm'
            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
        }`}
      >
        Create Account
      </button>
    </div>
  );
};