import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-8 w-full max-w-md ${className}`}>
      {children}
    </div>
  );
};
