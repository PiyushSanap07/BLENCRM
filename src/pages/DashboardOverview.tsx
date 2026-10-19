import React from 'react';
import { mockMetrics, mockRecentActivities } from '../mocks/dashboardData';
import { ArrowUpRight, ArrowDownRight, Plus, FileText, UserPlus, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back! Here is what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/dashboard/invoices/new" 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create Invoice
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockMetrics.map((metric, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{metric.title}</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold">{metric.value}</span>
              <span className={`inline-flex items-center text-xs font-semibold ${
                metric.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {metric.isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {metric.change}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">{metric.timeframe}</p>
          </div>
        ))}
      </div>

      {/* Two Column Section: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Log */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Recent System Activity</h2>
            <Link to="/dashboard/activities" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {mockRecentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-900 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-xs mt-0.5">
                  {activity.user[0]}
                </div>
                <div className="flex-1 text-sm">
                  <p className="text-slate-800 dark:text-slate-200">
                    <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                    <span className="font-medium text-blue-600 dark:text-blue-400">{activity.target}</span>
                  </p>
                  <span className="text-xs text-slate-400">{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold mb-1">Quick Shortcuts</h2>
            <p className="text-xs text-slate-500 mb-4">Jump straight into core CRM workflows.</p>
            <div className="space-y-2">
              <Link to="/dashboard/leads" className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-medium transition-colors">
                <UserPlus className="w-4 h-4 text-indigo-500" /> Add New Lead
              </Link>
              <Link to="/dashboard/pipeline" className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-medium transition-colors">
                <DollarSign className="w-4 h-4 text-emerald-500" /> Manage Sales Pipeline
              </Link>
              <Link to="/dashboard/invoices/new" className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-medium transition-colors">
                <FileText className="w-4 h-4 text-blue-500" /> Draft New Invoice
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};