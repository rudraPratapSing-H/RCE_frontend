import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'ghost' | 'solid';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'ghost',
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40';

  const variantStyles = {
    ghost: 'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
    solid: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
  };

  return (
    <button type={type} className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {icon}
    </button>
  );
};
