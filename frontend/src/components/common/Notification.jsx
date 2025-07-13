import React, { useState, useEffect } from 'react';

const Notification = ({ message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📝';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${getTypeStyles()} animate-slide-in`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-lg mr-2">{getTypeIcon()}</span>
          <span>{message}</span>
        </div>
        <button 
          onClick={onClose}
          className="mr-2 text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// רכיב LoadingSpinner
export const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} border-4 border-familia-blue border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

// רכיב LoadingMessage
export const LoadingMessage = ({ message = 'טוען...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <LoadingSpinner size="large" />
      <p className="mt-4 text-gray-600 text-lg">{message}</p>
    </div>
  );
};

export default Notification;