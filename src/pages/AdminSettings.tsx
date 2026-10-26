import React, { useState } from 'react';
import { 
  Building2, IndianRupee, Bell, Shield, Save, Check, Globe, Mail, Phone, Sun, Moon, AlertCircle 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { validateIndianPhone } from '../utils/validation';

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'invoicing' | 'notifications' | 'security'>('general');
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { theme, setTheme } = useTheme();

  // General Settings State
  const [companyName, setCompanyName] = useState('BLENDIGITAL');
  const [tagline, setTagline] = useState('Digital Agency & Custom Software Development');
  const [companyEmail, setCompanyEmail] = useState('contact@blendigital.io');
  const [companyPhone, setCompanyPhone] = useState('9876543210');
  const [currency, setCurrency] = useState('INR (₹)');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST +5:30)');

  // Invoicing Settings
  const [invoicePrefix, setInvoicePrefix] = useState('INV-');
  const [defaultTaxRate, setDefaultTaxRate] = useState(18); // 18% GST
  const [paymentTerms, setPaymentTerms] = useState('Net 15');
  const [bankDetails, setBankDetails] = useState('HDFC Bank | IFSC: HDFC0001234 | A/C: 50200012345678 | UPI: blendigital@hdfcbank');

  // Notification Toggles
  const [notifyOnNewLead, setNotifyOnNewLead] = useState(true);
  const [notifyOnPayment, setNotifyOnPayment] = useState(true);
  const [notifyOnOverdue, setNotifyOnOverdue] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const phoneVal = validateIndianPhone(companyPhone);
    if (!phoneVal.isValid) {
      setErrorMsg(phoneVal.error || 'Please enter a valid 10-digit Indian mobile number for Official Phone.');
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin & Agency Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Configure BLENDIGITAL workspace parameters, invoicing defaults, and notification preferences.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm self-start sm:self-auto"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-emerald-200" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'general'
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" /> General Info
        </button>
        <button
          onClick={() => setActiveTab('invoicing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'invoicing'
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          <IndianRupee className="w-4 h-4" /> Invoicing & Tax
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" /> Notifications
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" /> Security & API
        </button>
      </div>

      {/* Tab Panels */}
      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === 'general' && (
          <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
            <h2 className="text-base font-semibold border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" /> Agency Identity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Agency / Brand Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Business Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Official Contact Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="col-span-full p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Official Phone (Indian 10-Digit) <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1.5 text-slate-400 pointer-events-none">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 border-r border-slate-300 dark:border-slate-600 pr-1.5">+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    maxLength={14}
                    value={companyPhone}
                    onChange={(e) => {
                      setCompanyPhone(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className={`w-full pl-18 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border ${
                      errorMsg ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500'
                    } focus:outline-none focus:ring-2`}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">10-digit mobile number starting with 6, 7, 8, or 9</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Default Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD ($)">USD ($) - United States Dollar</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                  <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Operational Timezone
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Appearance / Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                      theme === 'light'
                        ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> Light Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                      theme === 'dark'
                        ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-400" /> Dark Mode
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoicing' && (
          <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
            <h2 className="text-base font-semibold border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-500" /> Default Invoice Parameters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Invoice Number Prefix
                </label>
                <input
                  type="text"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Default Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={defaultTaxRate}
                  onChange={(e) => setDefaultTaxRate(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Payment Terms
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 15">Net 15 Days</option>
                  <option value="Net 30">Net 30 Days</option>
                  <option value="Net 60">Net 60 Days</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Bank & Payment Wire Instructions (Shown on Invoices)
              </label>
              <textarea
                rows={3}
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
            <h2 className="text-base font-semibold border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" /> Automated Email Notifications
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">New Inbound Leads</p>
                  <p className="text-xs text-slate-500">Receive immediate email alerts when a lead enters the pipeline.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnNewLead}
                  onChange={(e) => setNotifyOnNewLead(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Payment Confirmations</p>
                  <p className="text-xs text-slate-500">Get notified whenever a client payment is recorded or settled.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnPayment}
                  onChange={(e) => setNotifyOnPayment(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Overdue Invoice Reminders</p>
                  <p className="text-xs text-slate-500">Daily digests of unpaid invoices that have crossed due dates.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnOverdue}
                  onChange={(e) => setNotifyOnOverdue(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
            <h2 className="text-base font-semibold border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-500" /> API Keys & Integration Webhooks
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Live REST API Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    readOnly
                    value="blen_live_sk_89f02931bc402ae89"
                    className="w-full px-3 py-2 text-sm font-mono rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText('blen_live_sk_89f02931bc402ae89')}
                    className="px-3 py-2 text-xs font-medium border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Webhook Dispatch URL (Payment Gateway / CRM Sync)
                </label>
                <input
                  type="text"
                  defaultValue="https://api.blendigital.io/v1/webhooks/crm-events"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
