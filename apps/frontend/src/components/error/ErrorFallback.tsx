import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface ErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
  title?: string;
  message?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  onRetry,
  title = 'Something went wrong',
  message = 'Unable to load this content. Please try again.',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={32} className="text-error" />
      </div>

      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-muted mb-4 max-w-md">{message}</p>

      {import.meta.env.DEV && error && (
        <details className="mb-4 text-left w-full max-w-md">
          <summary className="cursor-pointer text-xs text-text-muted hover:text-text-primary mb-2">
            Error Details
          </summary>
          <div className="bg-bg-tertiary rounded-lg p-3 text-xs font-mono text-error overflow-auto max-h-32">
            {error.toString()}
          </div>
        </details>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all"
        >
          <RefreshCcw size={18} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;
