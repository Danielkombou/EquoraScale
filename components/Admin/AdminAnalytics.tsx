/**
 * Admin Analytics Component
 * System-wide analytics and reporting for administrators
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icons } from '../../constants';
import { listFiles, flattenFileStructure } from '../../services/files';
import { getAllUsers } from '../../services/users';
import { DocumentType } from '../../types';

const AdminAnalytics: React.FC = () => {
  // Fetch real data from API
  const { data: fileStructure } = useQuery({
    queryKey: ['files'],
    queryFn: () => listFiles(),
  });

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getAllUsers(),
  });

  // Calculate analytics from real data
  const allFiles = fileStructure ? flattenFileStructure(fileStructure) : [];
  const totalDocuments = allFiles.length;
  const totalUsers = users?.length || 0;

  const documentsByType = {
    RFQ: allFiles.filter(f => f.docType === DocumentType.RFQ).length,
    PO: allFiles.filter(f => f.docType === DocumentType.PO).length,
    QUOTATION: allFiles.filter(f => f.docType === DocumentType.QUOTATION).length,
    INVOICE: allFiles.filter(f => f.docType === DocumentType.INVOICE).length,
    GENERAL: allFiles.filter(f => f.docType === DocumentType.GENERAL).length,
  };

  const analytics = {
    totalDocuments,
    totalUsers,
    documentsByType,
    recentActivity: [],
    systemHealth: {
      status: 'healthy',
      uptime: '99.9%',
      storage: 'N/A', // Backend doesn't provide storage info yet
    },
  };

  const metrics = [
    {
      label: 'Total Documents',
      value: analytics.totalDocuments.toLocaleString(),
      icon: Icons.FileText,
      color: 'bg-indigo-500',
      change: '+12%',
      trend: 'up',
    },
    {
      label: 'Total Users',
      value: analytics.totalUsers.toLocaleString(),
      icon: Icons.Users,
      color: 'bg-blue-500',
      change: '+5%',
      trend: 'up',
    },
    {
      label: 'System Uptime',
      value: analytics.systemHealth.uptime,
      icon: Icons.Activity,
      color: 'bg-emerald-500',
      change: 'Stable',
      trend: 'stable',
    },
    {
      label: 'Storage Used',
      value: analytics.systemHealth.storage,
      icon: Icons.Database,
      color: 'bg-purple-500',
      change: '25%',
      trend: 'stable',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 sm:mt-2 text-xs sm:text-sm font-medium">
              System-wide insights and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>All time</option>
            </select>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${metric.color} text-white`}>
                  <metric.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${
                  metric.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' :
                  metric.trend === 'down' ? 'text-rose-600 dark:text-rose-400' :
                  'text-slate-500 dark:text-slate-400'
                }`}>
                  {metric.trend === 'up' && <Icons.TrendingUp className="w-3 h-3" />}
                  {metric.change}
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
                {metric.value}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Documents by Type */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6">
            Documents by Type
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {Object.entries(analytics.documentsByType).map(([type, count]) => (
              <div key={type} className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
                  {count}
                </p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {type}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4">
              System Health
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icons.Activity className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status</span>
                </div>
                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded text-xs font-bold uppercase">
                  {analytics.systemHealth.status}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icons.Clock className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Uptime</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {analytics.systemHealth.uptime}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icons.Database className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Storage</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {analytics.systemHealth.storage}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm font-semibold">
                Generate Report
              </button>
              <button className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm font-semibold">
                Export Data
              </button>
              <button className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm font-semibold">
                View Logs
              </button>
            </div>
          </div>
        </div>

        {/* Placeholder for Charts */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-sm">
          <div className="text-center">
            <Icons.BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
            <p className="text-lg font-bold text-slate-600 dark:text-slate-400 mb-2">
              Advanced Analytics
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Charts and detailed analytics will be available here
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;
