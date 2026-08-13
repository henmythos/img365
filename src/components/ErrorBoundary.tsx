import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in img365.in:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 text-center space-y-6">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Something unexpected occurred
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                A browser script asset may have failed to load. Please click below to refresh.
              </p>
            </div>

            <button
              onClick={this.handleReload}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
