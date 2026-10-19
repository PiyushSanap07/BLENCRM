import React, { useState } from 'react';
import { mockDeals } from '../mocks/pipelineData';
import type { Deal } from '../mocks/pipelineData';
import { Plus, Building2, Calendar, User, DollarSign, ArrowRight, XCircle, RotateCcw } from 'lucide-react';

const STAGES: Deal['stage'][] = ['Lead', 'Contacted', 'Proposal Sent', 'Won', 'Lost'];

export const SalesPipeline: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);

  // Advance deal to the next active stage
  const handleAdvanceStage = (dealId: string) => {
    setDeals(prevDeals =>
      prevDeals.map(deal => {
        if (deal.id === dealId) {
          const currentIndex = STAGES.indexOf(deal.stage);
          if (currentIndex >= 0 && currentIndex < STAGES.indexOf('Won')) {
            return { ...deal, stage: STAGES[currentIndex + 1] };
          }
        }
        return deal;
      })
    );
  };

  // Mark deal as Lost
  const handleMarkAsLost = (dealId: string) => {
    setDeals(prevDeals =>
      prevDeals.map(deal => 
        deal.id === dealId ? { ...deal, stage: 'Lost' } : deal
      )
    );
  };

  // Restore a Lost deal back to 'Lead'
  const handleReopenDeal = (dealId: string) => {
    setDeals(prevDeals =>
      prevDeals.map(deal => 
        deal.id === dealId ? { ...deal, stage: 'Lead' } : deal
      )
    );
  };

  const getPriorityBadge = (priority: Deal['priority']) => {
    switch (priority) {
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Medium</span>;
      case 'Low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Low</span>;
    }
  };

  const calculateTotalPipelineValue = () => {
    return deals
      .filter(d => d.stage !== 'Lost')
      .reduce((sum, d) => sum + d.value, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track deals across sales stages. Active Pipeline: <span className="font-semibold text-slate-900 dark:text-slate-100">${calculateTotalPipelineValue().toLocaleString()}</span>
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add New Deal
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage);
          const columnTotal = stageDeals.reduce((acc, d) => acc + d.value, 0);
          const isLostColumn = stage === 'Lost';

          return (
            <div 
              key={stage} 
              className={`p-3 rounded-xl border flex flex-col min-w-[260px] ${
                isLostColumn 
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40' 
                  : 'bg-slate-100/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <h2 className={`text-sm font-bold ${isLostColumn ? 'text-rose-700 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {stage}
                  </h2>
                  <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-semibold">
                    {stageDeals.length}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  ${columnTotal.toLocaleString()}
                </span>
              </div>

              {/* Column Cards Container */}
              <div className="space-y-3 min-h-[350px]">
                {stageDeals.length === 0 ? (
                  <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-lg p-6 text-center text-xs text-slate-400">
                    No deals in {stage}
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                          {deal.title}
                        </h3>
                        {getPriorityBadge(deal.priority)}
                      </div>

                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" /> {deal.company}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-900">
                        <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center">
                          <DollarSign className="w-3 h-3 text-emerald-500" />
                          {deal.value.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {deal.expectedCloseDate}
                        </span>
                      </div>

                      {/* Card Action Bar */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-900">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <User className="w-3 h-3" /> {deal.assignedTo}
                        </span>

                        <div className="flex items-center gap-1">
                          {/* Reopen Lost Deal */}
                          {stage === 'Lost' && (
                            <button
                              onClick={() => handleReopenDeal(deal.id)}
                              title="Re-open deal as Lead"
                              className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-blue-600 px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" /> Reopen
                            </button>
                          )}

                          {/* Mark as Lost & Advance Actions */}
                          {stage !== 'Won' && stage !== 'Lost' && (
                            <>
                              <button
                                onClick={() => handleMarkAsLost(deal.id)}
                                title="Mark as Lost"
                                className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleAdvanceStage(deal.id)}
                                title="Advance to next stage"
                                className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded transition-colors"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
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