import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable loading component with optional full-screen overlay
 * @param fullScreen - If true, shows as a full-screen overlay
 * @param message - Optional loading message to display
 * @param size - Size of the spinner (sm, md, lg)
 */
export default function Loading({ 
  fullScreen = false, 
  message = 'Loading...', 
  size = 'md' 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
      {message && (
        <p className="text-gray-600 font-medium text-center">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{content}</div>;
}
