import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { Plus, Search, Filter, Building2, IndianRupee, AlertCircle } from 'lucide-react';
import { formatINR, validateIndianCurrency } from '../utils/validation';

export const InvoicesList: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Payment modal state
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR Code');
  const [paymentError, setPaymentError] = useState('');

  const fetchInvoices = async () => {
    try {
      const data = await apiClient.getInvoices();
      setInvoices(data);
    } catch (err) {
      console.error('Failed to load invoices from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setPaymentError('');

    const val = validateIndianCurrency(paymentAmount, 'Payment Amount', {
      allowZero: false,
      min: 1,
    });
    if (!val.isValid) {
      setPaymentError(val.error || 'Please enter a valid payment amount in Indian Rupees (₹).');
      return;
    }

    const dueAmount = selectedInvoice.totalAmount - (selectedInvoice.paidAmount || 0);
    if (val.value! > dueAmount) {
      setPaymentError(`Payment amount cannot exceed remaining balance of ${formatINR(dueAmount)}.`);
      return;
    }

    try {
      await apiClient.recordPayment(selectedInvoice.id, {
        paymentAmount: val.value!,
        paymentMethod
      });
      setSelectedInvoice(null);
      setPaymentAmount('');
      setPaymentError('');
      fetchInvoices(); // Refresh list
    } catch (err: any) {
      console.error('Error recording payment:', err);
      setPaymentError(err.message || 'Error recording payment.');
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading live invoices from SQLite backend...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices & Billing</h1>
          <p className="text-sm text-slate-500">Live SQLite backend connected • Manage client invoices and record payments.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/invoices/new')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Invoice
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search invoice #, company..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          {['All', 'Paid', 'Partially Paid', 'Sent', 'Draft'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === status 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Client / Company</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Paid</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No invoices recorded in SQLite. Click "Create Invoice" to generate your first invoice.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                      <Link to={`/dashboard/invoices/${inv.id}`} className="hover:text-blue-600">{inv.invoiceNumber}</Link>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{inv.clientName}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3"/> {inv.clientCompany}
                      </p>
                    </td>
                    <td className="p-4 text-xs text-slate-600 dark:text-slate-400">{inv.dueDate}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{formatINR(inv.totalAmount)}</td>
                    <td className="p-4 text-emerald-600 dark:text-emerald-400 font-semibold">{formatINR(inv.paidAmount)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        inv.status === 'Partially Paid' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => { setSelectedInvoice(inv); setPaymentAmount((inv.totalAmount - inv.paidAmount).toString()); setPaymentError(''); }}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold rounded transition-colors"
                        >
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleRecordPayment} className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold">Record Payment for {selectedInvoice.invoiceNumber}</h3>
            <p className="text-xs text-slate-500">Client: {selectedInvoice.clientCompany} • Total: {formatINR(selectedInvoice.totalAmount)}</p>
            
            {paymentError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1">
                Payment Amount (₹ INR) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="number" 
                  step="any"
                  min="1"
                  value={paymentAmount}
                  onChange={(e) => {
                    setPaymentAmount(e.target.value);
                    if (paymentError) setPaymentError('');
                  }}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                    paymentError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500'
                  } bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2`}
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Remaining balance: {formatINR(selectedInvoice.totalAmount - (selectedInvoice.paidAmount || 0))}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Payment Method <span className="text-rose-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
              >
                <option value="UPI / QR Code">UPI / QR Code</option>
                <option value="Bank Transfer / NEFT">Bank Transfer / NEFT</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Wire Transfer">Wire Transfer</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => { setSelectedInvoice(null); setPaymentError(''); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm cursor-pointer"
              >
                Confirm Payment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};