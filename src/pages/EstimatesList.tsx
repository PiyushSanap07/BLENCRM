import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockEstimates } from '../mocks/estimatesData';
import type { Estimate } from '../mocks/estimatesData';
import { Plus, Search, Building2, FileSpreadsheet, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { formatINR } from '../utils/validation';

export const EstimatesList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEstimates = mockEstimates.filter((est: Estimate) => {
    return (
      est.estimateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.clientCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleConvertToInvoice = (estimate: Estimate) => {
    // Navigate to create invoice with pre-filled state
    navigate('/dashboard/invoices/new', { state: { estimate } });
  };

  const getStatusBadge = (status: Estimate['status']) => {
    switch (status) {
      case 'Accepted':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><CheckCircle2 className="w-3 h-3"/> Accepted</span>;
      case 'Sent':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"><Clock className="w-3 h-3"/> Sent</span>;
      case 'Declined':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">Declined</span>;
      case 'Draft':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Draft</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Estimates & Quotes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Draft project quotes and convert accepted estimates directly into invoices.
          </p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/invoices/new')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Estimate
        </button>
      </div>

      <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search estimate or client..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
              <tr>
                <th className="p-4">Estimate #</th>
                <th className="p-4">Client / Company</th>
                <th className="p-4">Valid Until</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredEstimates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No estimates created yet. Click "Create Estimate" to generate your first quote.
                  </td>
                </tr>
              ) : (
                filteredEstimates.map((est: Estimate) => (
                  <tr key={est.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                      {est.estimateNumber}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{est.clientName}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3"/> {est.clientCompany}
                      </p>
                    </td>
                    <td className="p-4 text-xs text-slate-600 dark:text-slate-400">{est.validUntil}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{formatINR(est.totalAmount)}</td>
                    <td className="p-4">{getStatusBadge(est.status)}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleConvertToInvoice(est)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-md transition-colors"
                      >
                        Convert to Invoice <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};