/**
 * Access Denied Component
 * Shown when user doesn't have required permissions
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../constants';

interface AccessDeniedProps {
  requiredRole?: string;
  requiredPermission?: string;
  message?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ 
  requiredRole, 
  requiredPermission,
  message 
}) => {
  const navigate = useNavigate();

  const getMessage = () => {
    if (message) return message;
    if (requiredRole) {
      return `This page requires ${requiredRole} role. You don't have the necessary permissions to access this resource.`;
    }
    if (requiredPermission) {
      return `This action requires the following permission: ${requiredPermission}`;
    }
    return "You don't have permission to access this resource.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/50 shadow-xl text-center">
        <div className="w-16 h-16 mx-auto bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-4">
          <Icons.Lock className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          {getMessage()}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={() => navigate('/app')}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Go to Dashboard
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
