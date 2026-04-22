import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Settings, Terminal, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import { SearchComposer } from './components/SearchComposer';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-zinc-100 transition-colors hover:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <Terminal className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <span className="text-sm font-semibold tracking-wide sm:text-base">CodeEngine</span>
        </Link>

        <div className="hidden flex-1 md:flex md:justify-center">
          <SearchComposer />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <IconButton icon={<Bell className="h-4 w-4" />} aria-label="Notifications" />
          <IconButton icon={<Settings className="h-4 w-4" />} aria-label="Settings" />

          <div className="mx-2 hidden h-7 w-px bg-zinc-800 sm:block" />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleLogout} className="flex w-auto items-center gap-2 px-4 shadow-[0_0_20px_rgba(239,68,68,0.05)] hover:text-red-400">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/')} className="hidden w-auto px-4 sm:inline-flex">
                Log in
              </Button>
              <Button variant="primary" onClick={() => navigate('/', { state: { tab: 'register' } })} className="w-auto px-4">
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};