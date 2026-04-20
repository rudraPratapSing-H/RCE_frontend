import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-zinc-400">{label}</label>
      <input 
        className={`px-3 py-2.5 bg-zinc-950 border ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-zinc-800 focus:border-blue-500/50 focus:ring-blue-500/50'} rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all duration-200 ${className}`}
        {...props} 
      />
      {error && <span className="text-xs text-red-400 mt-0.5">{error}</span>}
    </div>
  );
};
