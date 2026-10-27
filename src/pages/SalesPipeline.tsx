import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { Building2, CheckCircle, Loader2 } from 'lucide-react';
import { formatINR } from '../utils/validation';
import { useToast } from '../components/DialogSystem';

const STAGES = ['Lead', 'Proposal Sent', 'Negotiation', 'Won'];

export const SalesPipeline: React.FC = () => {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPipelineData = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getLeads();
      setLeads(data);
    } catch (err) {
      console.error('Failed to load pipeline leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelineData();
  }, []);

  const handleStageChange = async (leadId: string, newStage: string) => {
    try {
      await apiClient.updateLeadStage(leadId, newStage);
      showToast(`Deal moved to ${newStage}`, 'info');
      fetchPipelineData();
    } catch (err) {
      showToast('Failed to update stage', 'error');
    }
  };

  const handleConvert = async (leadId: string) => {
    try {
      await apiClient.convertLeadToClient(leadId);
      showToast('Lead converted to client successfully!', 'success');
      fetchPipelineData();
    } catch (err) {
      showToast('Conversion failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
        Loading sales pipeline...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales Pipeline Kanban</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage deal momentum. Newly added leads automatically appear in the Lead column.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => (l.stage || 'Lead') === stage);
          const stageTotal = stageLeads.reduce((sum, l) => sum + (l.value || 0), 0);

          return (
            <div key={stage} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">{stage}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {stageLeads.length}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">Value: {formatINR(stageTotal)}</p>

              <div className="space-y-3">
                {stageLeads.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    No deals in this stage
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div 
                      key={lead.id} 
                      className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{lead.name}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3"/> {lead.company}
                        </p>
                      </div>

                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {formatINR(lead.value || 0)}
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-900 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Move stage:</span>
                          <select 
                            value={lead.stage}
                            onChange={(e) => handleStageChange(lead.id, e.target.value)}
                            className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-1 text-xs font-medium"
                          >
                            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>

                        {lead.stage === 'Won' && lead.convertedToClient !== 1 && (
                          <button
                            onClick={() => handleConvert(lead.id)}
                            className="w-full mt-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Convert to Client
                          </button>
                        )}

                        {lead.convertedToClient === 1 && (
                          <span className="text-center py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded">
                            ✓ Onboarded to Directory
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};