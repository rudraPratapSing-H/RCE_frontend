import React from 'react';
import { FRIENDLY_SERVER_ERROR_MESSAGE } from '../lib/apiClient';

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('ErrorBoundary caught', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-900 flex items-center justify-center text-white p-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">{FRIENDLY_SERVER_ERROR_MESSAGE}</h2>
          </div>
        </div>
      );
    }

    return this.props.children as JSX.Element;
  }
}

export default ErrorBoundary;
