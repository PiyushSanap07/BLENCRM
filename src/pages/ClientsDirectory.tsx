import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import type { Client } from '../mocks/clientsData';
import { 
  Search, Building2, Plus, ShieldCheck, Clock, 
  AlertCircle, X, Loader2, Trash2, Mail, Phone, IndianRupee 
} from 'lucide-react';
import { 
  validateIndianPhone, 
  validateIndianCurrency, 
  formatINR, 
  formatIndianPhone 
} from '../utils/validation';
import { ConfirmDialog, useToast } from '../components/DialogSystem';

export const ClientsDirectory: React.FC = () => {
  const { showToast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientToDelete, setClientToDelete] = useState<{ id: string; name: string } | null>(null);

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
    activeProject: '',
    totalBilled: '0',
    outstandingBalance: '0',
    status: 'Lead' as Client['status'],
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getClients();
      setClients(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load clients:', err);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      activeProject: '',
      totalBilled: '0',
      outstandingBalance: '0',
      status: 'Lead',
    });
    setErrorMessage('');
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');
    setFieldErrors({});
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Contact person name is required.';
    }
    if (!formData.company.trim()) {
      errors.company = 'Company name is required.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Billing email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    // Required Indian 10-digit mobile number
    const phoneVal = validateIndianPhone(formData.phone);
    if (!phoneVal.isValid) {
      errors.phone = phoneVal.error || 'Valid 10-digit Indian phone number is required.';
    }

    // Required INR amounts
    const billedVal = validateIndianCurrency(formData.totalBilled, 'Total Billed', { allowZero: true });
    if (!billedVal.isValid) {
      errors.totalBilled = billedVal.error || 'Total billed amount in INR (₹) is required.';
    }

    const dueVal = validateIndianCurrency(formData.outstandingBalance, 'Balance Due', { allowZero: true });
    if (!dueVal.isValid) {
      errors.outstandingBalance = dueVal.error || 'Balance due in INR (₹) is required.';
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
        id: `client-${Date.now()}`,
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        phone: phoneVal.value!,
        activeProject: formData.activeProject.trim() || 'Custom Engagement',
        totalBilled: billedVal.value!,
        outstandingBalance: dueVal.value!,
        status: formData.status,
      };

      await apiClient.createClient(payload);
      await fetchClients();
      setIsModalOpen(false);
      showToast('Client added successfully!', 'success');
    } catch (err: any) {
      console.error('Error creating client:', err);
      setErrorMessage(err.message || 'Failed to create client.');
      showToast(err.message || 'Failed to create client', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClient = (id: string, name: string) => {
    setClientToDelete({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;
    try {
      await apiClient.deleteClient(clientToDelete.id);
      setClients(prev => prev.filter(c => c.id !== clientToDelete.id));
      showToast(`Client "${clientToDelete.name}" removed successfully`, 'success');
    } catch (err: any) {
      showToast(`Error deleting client: ${err.message}`, 'error');
    } finally {
      setClientToDelete(null);
    }
  };

  const clientList = Array.isArray(clients) ? clients : [];
  const filteredClients = clientList.filter(client => {
    return (
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusBadge = (status: Client['status']) => {
    switch (status) {
      case 'Lead':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"><Clock className="w-3 h-3"/> Lead</span>;
      case 'Proposal Sent':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"><Clock className="w-3 h-3"/> Proposal Sent</span>;
      case 'Negotiation':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"><AlertCircle className="w-3 h-3"/> Negotiation</span>;
      case 'Won':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><ShieldCheck className="w-3 h-3"/> Won</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">BLENDIGITAL Clients Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage active accounts, project scopes, and billing statuses.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Client
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search client or company..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
              <tr>
                <th className="p-4">Client Name / Company</th>
                <th className="p-4">Status</th>
                <th className="p-4">Active Project</th>
                <th className="p-4">Total Billed</th>
                <th className="p-4">Outstanding Balance</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading clients...
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 text-sm">
                    <p className="font-medium text-slate-600 dark:text-slate-300">No clients registered yet.</p>
                    <p className="text-xs text-slate-400 mt-1">Click "Add New Client" above to onboard your first account.</p>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="p-4">
                      <Link to={`/dashboard/clients/${client.id}`} className="group">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{client.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3"/> {client.company}
                          {client.phone && (
                            <span className="text-slate-400 text-[11px]">• {formatIndianPhone(client.phone)}</span>
                          )}
                        </p>
                      </Link>
                    </td>
                    <td className="p-4">{getStatusBadge(client.status)}</td>
                    <td className="p-4 text-xs font-medium text-slate-700 dark:text-slate-300">{client.activeProject || 'Standard Account'}</td>
                    <td className="p-4 font-semibold">{formatINR(client.totalBilled || 0)}</td>
                    <td className="p-4">
                      <span className={`font-semibold ${(client.outstandingBalance || 0) > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {formatINR(client.outstandingBalance || 0)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/dashboard/clients/${client.id}`} 
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-md transition-colors"
                        >
                          Manage
                        </Link>
                        <button
                          onClick={() => handleDeleteClient(client.id, client.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition-colors cursor-pointer"
                          title="Delete Client"
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

      {/* Add Client Modal */}
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
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add New Client</h2>
                  <p className="text-xs text-slate-500">Register a new client company account</p>
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
            <form onSubmit={handleCreateClient} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Person <span className="text-rose-500">*</span>
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
                    placeholder="e.g. Acme Corporation"
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
                    Billing Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="billing@acme.com"
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Active Project / Service Scope
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js SaaS Platform, Brand Redesign"
                  value={formData.activeProject}
                  onChange={(e) => setFormData({ ...formData, activeProject: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Billed (₹ INR) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      required
                      min="0"
                      step="any"
                      placeholder="0"
                      value={formData.totalBilled}
                      onChange={(e) => {
                        setFormData({ ...formData, totalBilled: e.target.value });
                        if (fieldErrors.totalBilled) setFieldErrors({ ...fieldErrors, totalBilled: '' });
                      }}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border ${
                        fieldErrors.totalBilled ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2`}
                    />
                  </div>
                  {fieldErrors.totalBilled && (
                    <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.totalBilled}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Balance Due (₹ INR) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      required
                      min="0"
                      step="any"
                      placeholder="0"
                      value={formData.outstandingBalance}
                      onChange={(e) => {
                        setFormData({ ...formData, outstandingBalance: e.target.value });
                        if (fieldErrors.outstandingBalance) setFieldErrors({ ...fieldErrors, outstandingBalance: '' });
                      }}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border ${
                        fieldErrors.outstandingBalance ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                      } focus:outline-none focus:ring-2`}
                    />
                  </div>
                  {fieldErrors.outstandingBalance && (
                    <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.outstandingBalance}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                  </select>
                </div>
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
                  {submitting ? 'Creating...' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirm Delete Client Dialog */}
      <ConfirmDialog
        open={!!clientToDelete}
        title="Remove Client"
        message={`Are you sure you want to remove client "${clientToDelete?.name}"? All related project information will be archived.`}
        confirmLabel="Remove Client"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setClientToDelete(null)}
      />
    </div>
  );
};