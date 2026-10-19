// src/pages/LeadDetails.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockLeads } from '../mocks/leadsData';
import { 
  ArrowLeft, Mail, Phone, Building2, User, Calendar, 
  DollarSign, Tag, FileText 
} from 'lucide-react';

export const LeadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const lead = mockLeads.find((l) => l.id === id) || mockLeads[0];

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
          <button className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            Edit Lead
          </button>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
            Convert to Client
          </button>
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
              <span className="font-medium">{lead.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2"><DollarSign className="w-4 h-4"/> Est. Value</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">${lead.estimatedValue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2"><Tag className="w-4 h-4"/> Source</span>
              <span className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-xs font-medium">{lead.source}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2"><User className="w-4 h-4"/> Owner</span>
              <span className="font-medium">{lead.assignedTo}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4"/> Created</span>
              <span className="text-slate-600 dark:text-slate-400">{lead.createdAt}</span>
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
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{lead.score}<span className="text-sm text-slate-400">/100</span></div>
              <div className="flex-1 bg-slate-100 dark:bg-slate-900 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${lead.score >= 80 ? 'bg-emerald-500' : lead.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                  style={{ width: `${lead.score}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};