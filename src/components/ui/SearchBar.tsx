import React from 'react';
import { Search } from 'lucide-react';

export type SearchBarProps = React.InputHTMLAttributes<HTMLInputElement>;

export const SearchBar: React.FC<SearchBarProps> = ({ className = '', type = 'search', ...props }) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      <input
        type={type}
        className={`w-full rounded-xl border border-zinc-800 bg-gray-800 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-sm outline-none transition-all duration-200 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 ${className}`}
        {...props}
      />
    </div>
  );
};
