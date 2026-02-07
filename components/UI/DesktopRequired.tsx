/**
 * Desktop Required Component
 * Shown to users accessing the app on mobile/tablet devices
 */

import React from 'react';
import { Icons } from '../../constants';

const DesktopRequired: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
        <div className="w-16 h-16 mx-auto bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4">
          <Icons.Monitor className="w-8 h-8 text-indigo-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
          Desktop Required
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          EquoraScale is optimized for desktop use. Please access this application from a desktop or laptop computer with a minimum screen width of 1024px.
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-left">
            <Icons.Monitor className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Recommended Screen Size
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Minimum 1024px width for optimal experience
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-left">
            <Icons.FileText className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Document Management
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                File indexing and management require desktop access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopRequired;
