import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { AuthProvider } from './features/auth/AuthProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import AuthSuccessPage from './pages/AuthSuccessPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { DashboardPage } from './pages/DashboardPage';
import { ProblemProvider } from './context/ProblemContext';
import { CompetitionsPage } from './features/competitions/pages/CompetitionsPage';
import { CompetitionQuestionsPage } from './features/competitions/pages/CompetitionQuestionsPage';
import { FRIENDLY_SERVER_ERROR_MESSAGE } from './lib/apiClient';

const App = () =>
  React.createElement(
    BrowserRouter,
    null,
    React.createElement(
      ErrorBoundary,
      null,
      React.createElement(
        AuthProvider,
        null,
        React.createElement(
          ProblemProvider,
          null,
          React.createElement(
            Routes,
            null,
            React.createElement(Route, { path: '/', element: React.createElement(AuthPage) }),
            React.createElement(Route, { path: '/verify-email', element: React.createElement(VerifyEmailPage) }),
            React.createElement(Route, { path: '/auth-success', element: React.createElement(AuthSuccessPage) }),
            React.createElement(Route, { path: '/dashboard', element: React.createElement(DashboardPage) }),
            React.createElement(Route, { path: '/workspace', element: React.createElement(WorkspacePage) }),
            React.createElement(Route, { path: '/workspace/competitions', element: React.createElement(CompetitionsPage) }),
            React.createElement(Route, { path: '/workspace/competitions/:competitionId', element: React.createElement(CompetitionQuestionsPage) }),
            React.createElement(Route, { path: '/workspace/:problemId', element: React.createElement(WorkspacePage) }),
            React.createElement(Route, {
              path: '*',
              element: React.createElement('div', null, FRIENDLY_SERVER_ERROR_MESSAGE)
            })
          )
        )
      )
    )
  );

export default App;