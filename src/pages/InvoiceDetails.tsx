import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockInvoices, type Invoice, type InvoiceLineItem } from '../mocks/invoicesData';
import { ArrowLeft, Printer, Mail, Building2, CheckCircle2 } from 'lucide-react';

export const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const invoice: Invoice = mockInvoices.find((inv: Invoice) => inv.id === id) || mockInvoices[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/dashboard/invoices" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5"/> Back to Invoices
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{invoice.invoiceNumber}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
            <Mail className="w-4 h-4" /> Resend to Client
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 dark:border-slate-900 pb-6">
          <div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              BLENDIGITAL
            </span>
            <p className="text-xs text-slate-500 mt-1">Digital Solutions & Enterprise CRM Suite</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5"/> {invoice.status}
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2">{invoice.invoiceNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</p>
            <p className="font-bold text-slate-900 dark:text-slate-100">{invoice.clientName}</p>
            <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5"/> {invoice.clientCompany}
            </p>
            <p className="text-blue-600 text-xs mt-1">{invoice.clientEmail}</p>
          </div>
          <div className="sm:text-right space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <p><span className="font-medium text-slate-400">Issue Date:</span> {invoice.issueDate}</p>
            <p><span className="font-medium text-slate-400">Due Date:</span> {invoice.dueDate}</p>
          </div>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
              <tr>
                <th className="p-3">Description</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {invoice.items.map((item: InvoiceLineItem) => (
                <tr key={item.id}>
                  <td className="p-3 font-medium text-slate-900 dark:text-slate-100">{item.description}</td>
                  <td className="p-3 text-center text-slate-600 dark:text-slate-400">{item.quantity}</td>
                  <td className="p-3 text-right text-slate-600 dark:text-slate-400">${item.unitPrice.toLocaleString()}</td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-slate-100">${item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-end space-y-2 text-sm border-t border-slate-100 dark:border-slate-900 pt-4">
          <div className="flex justify-between w-64 text-slate-600 dark:text-slate-400">
            <span>Subtotal:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">${invoice.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between w-64 text-slate-600 dark:text-slate-400">
            <span>Tax ({invoice.taxRate}%):</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">${invoice.taxAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between w-64 text-base font-bold text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800 pt-2">
            <span>Grand Total:</span>
            <span className="text-blue-600 dark:text-blue-400">${invoice.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};