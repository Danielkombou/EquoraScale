/**
 * Admin Dashboard Component
 * Overview of system statistics and admin actions
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../constants';
import { useUser } from '../../hooks/usePermissions';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Shield,
  Activity,
  Database,
  Key
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();

  const stats = [
    {
      label: 'Total Users',
      value: '0',
      icon: Icons.Users,
      color: 'bg-blue-500',
      path: '/app/admin/users',
    },
    {
      label: 'Total Documents',
      value: '0',
      icon: Icons.FileText,
      color: 'bg-indigo-500',
      path: '/app/repository/ALL',
    },
    {
      label: 'System Health',
      value: '100%',
      icon: Icons.Activity,
      color: 'bg-emerald-500',
      path: '/app/admin',
    },
    {
      label: 'Active Sessions',
      value: '1',
      icon: Icons.Shield,
      color: 'bg-purple-500',
      path: '/app/admin',
    },
  ];

  const quickActions = [
    {
      label: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Icons.Users,
      path: '/app/admin/users',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'System Settings',
      description: 'Configure system-wide settings',
      icon: Icons.Settings,
      path: '/app/settings',
      color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    },
    {
      label: 'Analytics',
      description: 'View system analytics and reports',
      icon: Icons.BarChart3,
      path: '/app/analytics',
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    },
    {
      label: 'API Keys',
      description: 'Manage API keys and integrations',
      icon: Icons.Key,
      path: '/app/admin',
      color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 sm:mt-2 text-xs sm:text-sm font-medium">
              System overview and administrative controls
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Administrator Access
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              onClick={() => navigate(stat.path)}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <Icons.ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => navigate(action.path)}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${action.color} shrink-0`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {action.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {action.description}
                    </p>
                  </div>
                  <Icons.ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4">
            System Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Current Admin
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {user?.username || 'Unknown'}
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Role
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white uppercase">
                {user?.role || 'User'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
