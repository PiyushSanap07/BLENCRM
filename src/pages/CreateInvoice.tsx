import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Send } from 'lucide-react';
import type { InvoiceLineItem } from '../mocks/invoicesData';

export const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();

  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-092');
  const [issueDate, setIssueDate] = useState('2026-10-19');
  const [dueDate, setDueDate] = useState('2026-11-02');
  const [taxRate, setTaxRate] = useState(10);

  const [items, setItems] = useState<InvoiceLineItem[]>([
    { id: '1', description: 'Full-Stack Web Application Development', quantity: 1, unitPrice: 2500, total: 2500 },
  ]);

  const handleItemChange = (id: string, field: keyof InvoiceLineItem, value: string | number) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.total = Number(updated.quantity) * Number(updated.unitPrice);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const addItem = () => {
    setItems(prev => [
      ...prev,
      { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, total: 0 }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard/invoices');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <Link to="/dashboard/invoices" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5"/> Back to Invoices
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Create New Invoice</h1>
          <p className="text-sm text-slate-500">Draft an invoice and itemize billable work for your client.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => navigate('/dashboard/invoices')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button 
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" /> Send Invoice
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Client Information</h2>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Company Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Acme Corporation" 
              value={clientCompany}
              onChange={(e) => setClientCompany(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Contact Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Sarah Jenkins" 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Billing Email</label>
              <input 
                type="email" 
                required
                placeholder="sarah@acmecorp.com" 
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Invoice Metadata</h2>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Invoice Number</label>
            <input 
              type="text" 
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Issue Date</label>
              <input 
                type="date" 
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Due Date</label>
              <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Line Items</h2>
        
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <input 
                type="text" 
                placeholder="Service description..." 
                value={item.description}
                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                className="flex-1 w-full px-3 py-1.5 text-sm rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none"
              />
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="w-20">
                  <input 
                    type="number" 
                    min="1"
                    placeholder="Qty" 
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm text-center rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div className="w-28">
                  <input 
                    type="number" 
                    min="0"
                    placeholder="Price ($)" 
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm text-right rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                  />
                </div>
                <span className="w-24 text-right font-bold text-sm text-slate-900 dark:text-slate-100">
                  ${item.total.toLocaleString()}
                </span>
                <button 
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button 
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline pt-2"
        >
          <Plus className="w-3.5 h-3.5" /> Add Row Item
        </button>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col items-end space-y-2 text-sm">
          <div className="flex items-center gap-8 text-slate-600 dark:text-slate-400">
            <span>Subtotal:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            <span>Tax Rate (%):</span>
            <input 
              type="number" 
              min="0"
              max="100"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-16 px-2 py-1 text-xs text-right rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
            <span className="w-20 text-right font-semibold text-slate-900 dark:text-slate-100">${taxAmount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-8 text-base font-bold text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800 pt-2">
            <span>Total Amount:</span>
            <span className="text-blue-600 dark:text-blue-400">${grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </form>
  );
};