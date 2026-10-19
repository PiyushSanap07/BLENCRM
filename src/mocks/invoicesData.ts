export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Partially Paid';
  items: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
}

export const mockInvoices: Invoice[] = [
  {
    id: "inv-501",
    invoiceNumber: "INV-2026-089",
    clientName: "Sarah Jenkins",
    clientCompany: "Acme Corporation",
    clientEmail: "sarah@acmecorp.com",
    issueDate: "2026-10-01",
    dueDate: "2026-10-15",
    status: "Paid",
    items: [
      { id: "li-1", description: "Frontend React UI & Tailwind Setup", quantity: 40, unitPrice: 85, total: 3400 },
      { id: "li-2", description: "Node.js REST API & Middleware Integration", quantity: 20, unitPrice: 95, total: 1900 }
    ],
    subtotal: 5300,
    taxRate: 10,
    taxAmount: 530,
    totalAmount: 5830,
    paidAmount: 5830
  },
  {
    id: "inv-502",
    invoiceNumber: "INV-2026-090",
    clientName: "Vikram Malhotra",
    clientCompany: "Zenith Retail",
    clientEmail: "vikram@zenithretail.in",
    issueDate: "2026-10-10",
    dueDate: "2026-10-24",
    status: "Sent",
    items: [
      { id: "li-3", description: "Payment Gateway Integration & Webhooks", quantity: 25, unitPrice: 90, total: 2250 }
    ],
    subtotal: 2250,
    taxRate: 18,
    taxAmount: 405,
    totalAmount: 2655,
    paidAmount: 0
  },
  {
    id: "inv-503",
    invoiceNumber: "INV-2026-091",
    clientName: "Elena Rostova",
    clientCompany: "TechFlow Ltd",
    clientEmail: "elena@techflow.io",
    issueDate: "2026-09-15",
    dueDate: "2026-09-30",
    status: "Overdue",
    items: [
      { id: "li-4", description: "Cloud Infrastructure Audit & DevOps Pipeline", quantity: 30, unitPrice: 110, total: 3300 }
    ],
    subtotal: 3300,
    taxRate: 10,
    taxAmount: 330,
    totalAmount: 3630,
    paidAmount: 0
  }
];