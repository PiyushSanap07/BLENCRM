import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockPayments } from '../mocks/paymentsData';
import type { PaymentTransaction } from '../mocks/paymentsData';
import { Search, Filter, CreditCard, CheckCircle2, Building2, Download } from 'lucide-react';

export const PaymentsLedger: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('All');

  const filteredPayments = mockPayments.filter((pay: PaymentTransaction) => {
    const matchesSearch = 
      pay.transactionRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.clientCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethod = methodFilter === 'All' || pay.paymentMethod === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const totalCollected = mockPayments
    .filter((p: PaymentTransaction) => p.status === 'Completed')
    .reduce((sum: number, p: PaymentTransaction) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments Ledger</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time audit log of all received client payments and transaction references.
          </p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" /> Export Ledger
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500">Total Payments Logged</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${totalCollected.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500">Total Transactions</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{mockPayments.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500">Primary Payment Mode</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">Bank Transfer / NEFT</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search txn ref, invoice #, client..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          {['All', 'Bank Transfer / NEFT', 'UPI / QR Code', 'Credit Card', 'Wire Transfer'].map((method) => (
            <button
              key={method}
              onClick={() => setMethodFilter(method)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                methodFilter === method 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
              <tr>
                <th className="p-4">Txn Reference</th>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Client / Company</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredPayments.map((pay: PaymentTransaction) => (
                <tr key={pay.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {pay.transactionRef}
                  </td>
                  <td className="p-4 font-semibold text-blue-600 dark:text-blue-400">
                    <Link to="/dashboard/invoices">{pay.invoiceNumber}</Link>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{pay.clientName}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3"/> {pay.clientCompany}
                    </p>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 pt-5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    {pay.paymentMethod}
                  </td>
                  <td className="p-4 text-xs text-slate-600 dark:text-slate-400">{pay.paymentDate}</td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">${pay.amount.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3"/> {pay.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};