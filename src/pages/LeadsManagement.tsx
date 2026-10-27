import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import type { Lead } from '../mocks/leadsData';
import { 
  Search, Plus, Building2, 
  CheckCircle2, AlertCircle, X, Loader2, Trash2, Mail, Phone, IndianRupee
} from 'lucide-react';
import { 
  validateIndianPhone, 
  validateIndianCurrency, 
  validateLeadScore, 
  formatINR,
  formatIndianPhone 
} from '../utils/validation';
import { ConfirmDialog, useToast } from '../components/DialogSystem';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export const LeadsManagement: React.FC = () => {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [leadToDelete, setLeadToDelete] = useState<{ id: string; name: string } | null>(null);
  const [leadToConvert, setLeadToConvert] = useState<{ id: string; name: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    estimatedValue: '',
    source: 'Website' as Lead['source'],
    assignedTo: '',
    score: '75',
    notes: '',
  });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getLeads();
      setLeads(data);
    } catch (err: any) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const data = await apiClient.getTeam();
      setTeamMembers(data);
      return data;
    } catch (err: any) {
      console.error('Failed to fetch team members:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchTeamMembers();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      estimatedValue: '',
      source: 'Website',
      assignedTo: teamMembers.length > 0 ? teamMembers[0].name : '',
      score: '75',
      notes: '',
    });
    setErrorMessage('');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleConfirmConvert = async () => {
    if (!leadToConvert) return;
    try {
      await apiClient.convertLeadToClient(leadToConvert.id);
      showToast(`Lead "${leadToConvert.name}" successfully converted to client!`, 'success');
      await fetchLeads();
    } catch (err: any) {
      showToast(`Error converting lead: ${err.message}`, 'error');
    } finally {
      setLeadToConvert(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const errors: Record<string, string> = {};

    // 1. Required text fields
    if (!formData.name.trim()) {
      errors.name = 'Contact name is required.';
    }
    if (!formData.company.trim()) {
      errors.company = 'Company name is required.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    // 2. Required Indian 10-digit Phone Number validation
    const phoneValidation = validateIndianPhone(formData.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error || 'Valid 10-digit Indian mobile number is required.';
    }

    // 3. Required Cost in Indian Rs (₹)
    const costValidation = validateIndianCurrency(formData.estimatedValue, 'Estimated Deal Value', {
      allowZero: false,
      min: 1,
    });
    if (!costValidation.isValid) {
      errors.estimatedValue = costValidation.error || 'Estimated deal value in INR (₹) is required and must be greater than 0.';
    }

    // 4. Required Lead Score (0 - 100)
    const scoreValidation = validateLeadScore(formData.score);
    if (!scoreValidation.isValid) {
      errors.score = scoreValidation.error || 'Lead score is required and must be between 0 and 100.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage('Please fix the highlighted required fields before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      setFieldErrors({});
      setErrorMessage('');

      const payload = {
        id: `lead-${Date.now()}`,
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        phone: phoneValidation.value!,
        value: costValidation.value!,
        estimatedValue: costValidation.value!,
        source: formData.source,
        stage: 'Lead',
        score: scoreValidation.value!,
        assignedTo: formData.assignedTo,
        notes: formData.notes.trim(),
      };

      await apiClient.createLead(payload);
      await fetchLeads();
      setIsModalOpen(false);
      showToast('Lead created successfully!', 'success');
    } catch (err: any) {
      console.error('Error creating lead:', err);
      setErrorMessage(err.message || 'Failed to create lead. Make sure backend is running.');
      showToast(err.message || 'Failed to create lead', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLead = (id: string, name: string) => {
    setLeadToDelete({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;
    try {
      await apiClient.deleteLead(leadToDelete.id);
      setLeads(prev => prev.filter(l => l.id !== leadToDelete.id));
      showToast(`Lead "${leadToDelete.name}" deleted successfully`, 'success');
    } catch (err: any) {
      showToast(`Error deleting lead: ${err.message}`, 'error');
    } finally {
      setLeadToDelete(null);
    }
  };

  const filteredLeads = leads.filter(lead => {
    return (
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Capture, track, and qualify potential clients.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Lead
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search lead, company, or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
              <tr>
                <th className="p-4">Lead / Company</th>
                <th className="p-4">Score</th>
                <th className="p-4">Est. Value</th>
                <th className="p-4">Source</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading leads from database...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <p className="font-medium text-slate-600 dark:text-slate-300">No leads found.</p>
                    <p className="text-xs text-slate-400 mt-1">Click "Add New Lead" above to capture your first opportunity.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="p-4">
                      <Link to={`/dashboard/leads/${lead.id}`} className="group">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{lead.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3"/> {lead.company}
                          {lead.phone && (
                            <span className="text-slate-400 text-[11px]">• {formatIndianPhone(lead.phone)}</span>
                          )}
                        </p>
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${(lead.score || 0) >= 80 ? 'bg-emerald-500' : (lead.score || 0) >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                            style={{ width: `${Math.min(100, lead.score || 50)}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold">{lead.score || 50}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{formatINR(lead.value || lead.estimatedValue || 0)}</td>
                    <td className="p-4 text-xs text-slate-500">{lead.source}</td>
                    <td className="p-4 text-xs text-slate-600 dark:text-slate-400">{lead.assignedTo}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/dashboard/leads/${lead.id}`} 
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-md transition-colors"
                        >
                          View
                        </Link>
                        {lead.convertedToClient !== 1 ? (
                          <button
                            onClick={() => setLeadToConvert({ id: lead.id, name: lead.name })}
                            className="px-2.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                            title="Convert to Client"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Convert to Client
                          </button>
                        ) : (
                          <span className="px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded border border-emerald-200 dark:border-emerald-800">
                            ✓ Converted
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteLead(lead.id, lead.name)}
                          title="Delete Lead"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add New Lead</h2>
                  <p className="text-xs text-slate-500">Enter prospect details to begin qualification</p>
                </div>
              </div>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                    }}
                    className={`w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border ${
                      fieldErrors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                    } focus:outline-none focus:ring-2`}
                  />
                  {fieldErrors.name && (
                    <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                      }}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border ${
                        fieldErrors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number (Indian 10-Digit) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center gap-1.5 text-slate-400 pointer-events-none">
                      <Phone className="w-4 h-4" />
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 border-r border-slate-300 dark:border-slate-600 pr-1.5">+91</span>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      placeholder="9876543210"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, phone: digitsOnly });
                        if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
                      }}
                      onKeyDown={(e) => {
                        if (
                          !/^\d$/.test(e.key) &&
                          !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key) &&
                          !e.ctrlKey && !e.metaKey
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className={`w-full pl-18 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border ${
                        fieldErrors.phone ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2`}
                    />
                  </div>
                  {fieldErrors.phone ? (
                    <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.phone}</p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1">10-digit mobile starting with 6, 7, 8, or 9</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Deal Value (₹ INR) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      placeholder="150000"
                      value={formData.estimatedValue}
                      onChange={(e) => {
                        setFormData({ ...formData, estimatedValue: e.target.value });
                        if (fieldErrors.estimatedValue) setFieldErrors({ ...fieldErrors, estimatedValue: '' });
                      }}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border ${
                        fieldErrors.estimatedValue ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2`}
                    />
                  </div>
                  {fieldErrors.estimatedValue ? (
                    <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.estimatedValue}</p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1">Cost in Indian Rupees (e.g. ₹1,50,000)</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lead Score (0 - 100) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    placeholder="75"
                    value={formData.score}
                    onChange={(e) => {
                      setFormData({ ...formData, score: e.target.value });
                      if (fieldErrors.score) setFieldErrors({ ...fieldErrors, score: '' });
                    }}
                    className={`w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border ${
                      fieldErrors.score ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                    } focus:outline-none focus:ring-2`}
                  />
                  {fieldErrors.score ? (
                    <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.score}</p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1">Required qualification rating between 0 and 100</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lead Source
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Website">Website</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Outreach">Cold Outreach</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Rep
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {teamMembers.length === 0 ? (
                      <option value="">No team members found</option>
                    ) : (
                      teamMembers.map((member) => (
                        <option key={member.id} value={member.name}>{member.name} — {member.role}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional context on project requirements, timeline, or lead source..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Creating...' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Convert Dialog */}
      <ConfirmDialog
        open={!!leadToConvert}
        title="Convert Lead to Client"
        message={`Are you sure you want to convert "${leadToConvert?.name}" into an active client? This lead will be automatically registered in the Clients Directory.`}
        confirmLabel="Convert to Client"
        variant="info"
        onConfirm={handleConfirmConvert}
        onCancel={() => setLeadToConvert(null)}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!leadToDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete lead "${leadToDelete?.name}"? All associated data will be removed.`}
        confirmLabel="Delete Lead"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setLeadToDelete(null)}
      />
    </div>
  );
};