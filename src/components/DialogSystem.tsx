import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Info, X } from 'lucide-react';

/* ─────────────────────────────────────────────
   1. CONFIRM DIALOG (replaces window.confirm)
   ───────────────────────────────────────────── */

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open, title, message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm, onCancel,
}) => {
  if (!open) return null;

  const iconMap = {
    danger: <AlertTriangle className="w-6 h-6 text-rose-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
  };

  const btnMap = {
    danger: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
    warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  };

  const iconBgMap = {
    danger: 'bg-rose-100 dark:bg-rose-950/60',
    warning: 'bg-amber-100 dark:bg-amber-950/60',
    info: 'bg-blue-100 dark:bg-blue-950/60',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" style={{ animation: 'fadeIn 150ms ease-out' }}>
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
        style={{ animation: 'scaleIn 150ms ease-out' }}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl ${iconBgMap[variant]} flex items-center justify-center shrink-0`}>
              {iconMap[variant]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${btnMap[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};


/* ─────────────────────────────────────────────
   2. TOAST NOTIFICATION (replaces window.alert)
   ───────────────────────────────────────────── */

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, variant }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container — fixed bottom-right */}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const variantStyles = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-800 dark:text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    },
    error: {
      bg: 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800',
      text: 'text-rose-800 dark:text-rose-200',
      icon: <XCircle className="w-5 h-5 text-rose-500" />,
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800',
      text: 'text-amber-800 dark:text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
  };

  const style = variantStyles[toast.variant];

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm ${style.bg}`}
      style={{ animation: 'slideInRight 200ms ease-out' }}
    >
      <div className="shrink-0 mt-0.5">{style.icon}</div>
      <p className={`text-sm font-medium flex-1 ${style.text}`}>{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 shrink-0 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};


/* ─────────────────────────────────────────────
   3. CSS ANIMATIONS (inject once)
   ───────────────────────────────────────────── */

const styleId = 'dialog-animations';
if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);
}
