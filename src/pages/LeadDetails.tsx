import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import type { Lead } from '../mocks/leadsData';
import { 
  ArrowLeft, Mail, Phone, Building2, User, 
  IndianRupee, Tag, FileText, Loader2, CheckCircle2 
} from 'lucide-react';
import { formatINR, formatIndianPhone } from '../utils/validation';
import { ConfirmDialog, useToast } from '../components/DialogSystem';

export const LeadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [showConvertConfirm, setShowConvertConfirm] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        const leads = await apiClient.getLeads();
        const found = leads.find((l: any) => l.id === id);
        setLead(found || null);
      } catch (err) {
        console.error('Failed to fetch lead details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  const handleConfirmConvert = async () => {
    if (!lead) return;
    try {
      setConverting(true);
      await apiClient.convertLeadToClient(lead.id);
      showToast(`Lead "${lead.name}" converted to client successfully!`, 'success');
      setLead(prev => prev ? { ...prev, convertedToClient: 1 } : null);
    } catch (err: any) {
      showToast(`Error converting lead: ${err.message}`, 'error');
    } finally {
      setConverting(false);
      setShowConvertConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
        Loading lead details...
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Link to="/dashboard/leads" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5"/> Back to Leads
        </Link>
        <div className="bg-white dark:bg-slate-950 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-500">
          Lead not found or has been deleted.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/dashboard/leads" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5"/> Back to Leads
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{lead.name}</h1>
          <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
            <Building2 className="w-4 h-4"/> {lead.company}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lead.convertedToClient !== 1 ? (
            <button 
              onClick={() => setShowConvertConfirm(true)}
              disabled={converting}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-medium rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {converting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {converting ? 'Converting...' : 'Convert to Client'}
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4" /> Converted to Client
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-base font-semibold border-b border-slate-100 dark:border-slate-900 pb-3">Lead Overview</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2"><Mail className="w-4 h-4"/> Email</span>
              <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline font-medium">{lead.email}</a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2"><Phone className="w-4 h-4"/> Phone</span>
              <span className="font-medium">{lead.phone ? formatIndianPhone(lead.phone) : 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2"><IndianRupee className="w-4 h-4"/> Est. Value</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{formatINR(lead.value || lead.estimatedValue || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2"><Tag className="w-4 h-4"/> Source</span>
              <span className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-xs font-medium">{lead.source}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2"><User className="w-4 h-4"/> Rep</span>
              <span className="font-medium">{lead.assignedTo}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500"/> Discovery Notes & Needs
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
              {lead.notes || "No additional notes provided for this lead."}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-semibold mb-4">Lead Qualification Rating</h2>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{lead.score || 50}<span className="text-sm text-slate-400">/100</span></div>
              <div className="flex-1 bg-slate-100 dark:bg-slate-900 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${(lead.score || 0) >= 80 ? 'bg-emerald-500' : (lead.score || 0) >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                  style={{ width: `${Math.min(100, lead.score || 50)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Convert Dialog */}
      <ConfirmDialog
        open={showConvertConfirm}
        title="Convert Lead to Client"
        message={`Are you sure you want to convert "${lead?.name}" (${lead?.company}) to an active client? This will create a new client profile.`}
        confirmLabel="Convert to Client"
        variant="info"
        onConfirm={handleConfirmConvert}
        onCancel={() => setShowConvertConfirm(false)}
      />
    </div>
  );
};