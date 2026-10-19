import React from 'react';
import { mockMonthlyRevenue, mockKpis } from '../mocks/reportsData';
import type { MonthlyRevenue } from '../mocks/reportsData';
import { DollarSign, TrendingUp, Users, ArrowUpRight, Download } from 'lucide-react';

export const FinancialReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Reports & Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor BLENDIGITAL revenue growth, cash flow, and key business performance indicators.
          </p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        >
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>YTD Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${mockKpis.totalYTDRevenue.toLocaleString()}</p>
          <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> +18.4% vs last year
          </span>
        </div>

        <div className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Outstanding Receivables</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${mockKpis.outstandingReceivables.toLocaleString()}</p>
          <span className="text-xs text-slate-400">Pending client clearance</span>
        </div>

        <div className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Average Deal Size</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${mockKpis.averageDealSize.toLocaleString()}</p>
          <span className="text-xs text-blue-600 font-medium">Custom dev scope</span>
        </div>

        <div className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Lead Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{mockKpis.leadConversionRate}</p>
          <span className="text-xs text-emerald-600 font-medium">+4.2% this quarter</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        <h2 className="text-base font-semibold border-b border-slate-100 dark:border-slate-900 pb-3">Monthly Revenue Growth</h2>
        
        <div className="space-y-4">
          {mockMonthlyRevenue.map((item: MonthlyRevenue, idx: number) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-700 dark:text-slate-300">{item.month} ({item.invoicesCount} invoices)</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">${item.revenue.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${(item.revenue / 45000) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};