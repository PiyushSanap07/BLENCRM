import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import type { Client } from '../mocks/clientsData';
import { 
  ArrowLeft, Mail, Phone, Building2, Calendar, IndianRupee, 
  FileText, Plus, Loader2 
} from 'lucide-react';
import { formatINR, formatIndianPhone } from '../utils/validation';

export const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const clients = await apiClient.getClients();
        const found = clients.find((c: any) => c.id === id);
        setClient(found || null);
      } catch (err) {
        console.error('Failed to load client details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
        Loading client details...
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Link to="/dashboard/clients" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5"/> Back to Clients Directory
        </Link>
        <div className="bg-white dark:bg-slate-950 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-500">
          Client not found or has been removed.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/dashboard/clients" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5"/> Back to Clients Directory
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
          <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
            <Building2 className="w-4 h-4"/> {client.company} • <span className="text-emerald-600 font-medium">{client.status}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/dashboard/invoices/new" 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create Invoice for Client
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Financial & Account Info */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-base font-semibold border-b border-slate-100 dark:border-slate-900 pb-3">Account Summary</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2"><Mail className="w-4 h-4"/> Email</span>
              <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline font-medium">{client.email}</a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2"><Phone className="w-4 h-4"/> Phone</span>
              <span className="font-medium">{client.phone ? formatIndianPhone(client.phone) : 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2"><IndianRupee className="w-4 h-4"/> Total Billed</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{formatINR(client.totalBilled || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2"><IndianRupee className="w-4 h-4"/> Outstanding</span>
              <span className={`font-bold ${(client.outstandingBalance || 0) > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {formatINR(client.outstandingBalance || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4"/> Client Since</span>
              <span className="text-slate-600 dark:text-slate-400">{client.joinedDate || '2026-10-26'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Project & Recent Billing Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500"/> Active Project Engagement
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{client.activeProject || 'Custom Engagement'}</p>
                <p className="text-xs text-slate-500 mt-1">Managed under BLENDIGITAL Service Level Agreement</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-semibold">In Progress</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-semibold mb-3">Recent Invoices & Payment History</h2>
            <p className="text-xs text-slate-400">All invoices generated for {client.company} by BLENDIGITAL finance team will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};