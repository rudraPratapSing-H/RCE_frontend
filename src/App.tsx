import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { AuthProvider } from './features/auth/AuthProvider';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { WorkspacePage } from './pages/WorkspacePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/workspace/:problemId" element={<WorkspacePage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}