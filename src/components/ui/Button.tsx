import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  isLoading, 
  disabled, 
  className = '', 
  variant = 'primary', 
  ...props 
}) => {
  const baseStyle = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.25)] hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] focus:ring-blue-500/40',
    secondary: 'border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 focus:ring-zinc-600/40',
    ghost: 'bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 focus:ring-zinc-700/40',
    danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500/40'
  };

  return (
    <button 
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      disabled={isLoading || disabled}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};