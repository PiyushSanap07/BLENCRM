import React, { useState } from 'react';
import { mockDeals } from '../mocks/pipelineData';
import type { Deal } from '../mocks/pipelineData';
import { 
  Plus, Building2, Calendar, User, IndianRupee, ArrowRight, 
  XCircle, RotateCcw, X, AlertCircle 
} from 'lucide-react';
import { validateIndianCurrency, formatINR } from '../utils/validation';

const STAGES: Deal['stage'][] = ['Lead', 'Contacted', 'Proposal Sent', 'Won', 'Lost'];

export const SalesPipeline: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    value: '',
    priority: 'Medium' as Deal['priority'],
    stage: 'Lead' as Deal['stage'],
    expectedCloseDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    assignedTo: 'Piyush Swarnani',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  const handleOpenModal = () => {
    setFormData({
      title: '',
      company: '',
      value: '',
      priority: 'Medium',
      stage: 'Lead',
      expectedCloseDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      assignedTo: 'Piyush Swarnani',
    });
    setErrorMessage('');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Deal title is required.';
    }
    if (!formData.company.trim()) {
      errors.company = 'Company name is required.';
    }

    const valueVal = validateIndianCurrency(formData.value, 'Deal Value', {
      allowZero: false,
      min: 1,
    });
    if (!valueVal.isValid) {
      errors.value = valueVal.error || 'Deal value in INR (₹) is required and must be greater than 0.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage('Please fill in all required fields properly.');
      return;
    }

    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      title: formData.title.trim(),
      company: formData.company.trim(),
      value: valueVal.value!,
      priority: formData.priority,
      stage: formData.stage,
      expectedCloseDate: formData.expectedCloseDate,
      assignedTo: formData.assignedTo,
    };

    setDeals(prev => [newDeal, ...prev]);
    setFieldErrors({});
    setIsModalOpen(false);
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
        <button 
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer"
        >
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
                          {formatINR(deal.value)}
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
                              className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-blue-600 px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 transition-colors cursor-pointer"
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
                                className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded transition-colors cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleAdvanceStage(deal.id)}
                                title="Advance to next stage"
                                className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded transition-colors cursor-pointer"
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

      {/* Add Deal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add New Deal</h2>
                  <p className="text-xs text-slate-500">Track an active sales pipeline opportunity</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deal Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise CRM License + Cloud Migration"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: '' });
                  }}
                  className={`w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border ${
                    fieldErrors.title ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2`}
                />
                {fieldErrors.title && (
                  <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Global"
                    value={formData.company}
                    onChange={(e) => {
                      setFormData({ ...formData, company: e.target.value });
                      if (fieldErrors.company) setFieldErrors({ ...fieldErrors, company: '' });
                    }}
                    className={`w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border ${
                      fieldErrors.company ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                    } focus:outline-none focus:ring-2`}
                  />
                  {fieldErrors.company && (
                    <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.company}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Deal Value (₹ INR) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      placeholder="250000"
                      value={formData.value}
                      onChange={(e) => {
                        setFormData({ ...formData, value: e.target.value });
                        if (fieldErrors.value) setFieldErrors({ ...fieldErrors, value: '' });
                      }}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border ${
                        fieldErrors.value ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2`}
                    />
                  </div>
                  {fieldErrors.value && (
                    <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.value}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Stage
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Owner
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Piyush Swarnani">Piyush Swarnani</option>
                    <option value="Alex Rivera">Alex Rivera</option>
                    <option value="Elena Rostova">Elena Rostova</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expected Close Date
                </label>
                <input
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium rounded-lg transition-all shadow-sm cursor-pointer"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};