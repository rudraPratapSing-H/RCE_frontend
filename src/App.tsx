import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { AuthProvider } from './features/auth/AuthProvider';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { ProblemProvider } from './context/ProblemContext';

export default function App() {
  return (
    <BrowserRouter>
      {/* 1. AuthProvider goes highest so everything below knows who the user is */}
      <AuthProvider>
        {/* 2. ProblemProvider sits inside, so it can eventually fetch user-specific problem data */}
        <ProblemProvider>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            
            {/* Workspace Routes */}
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/workspace/:problemId" element={<WorkspacePage />} />
            
            {/* 3. Pro-Tip: Add a Catch-all 404 Route */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </ProblemProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}