import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = 'Loading...',
  fullScreen = false 
}) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 z-modal-backdrop'
    : 'absolute inset-0';

  return (
    <div className={`${containerClass} bg-bg-overlay backdrop-blur-sm flex flex-col items-center justify-center`}>
      <LoadingSpinner size="large" />
      {message && (
        <p className="mt-4 text-text-primary font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingOverlay;
