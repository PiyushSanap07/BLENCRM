export interface EstimateItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Estimate {
  id: string;
  estimateNumber: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  issueDate: string;
  validUntil: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
  items: EstimateItem[];
  totalAmount: number;
}

export const mockEstimates: Estimate[] = [
  {
    id: "est-1",
    estimateNumber: "EST-2026-001",
    clientName: "Sarah Jenkins",
    clientCompany: "Acme Corporation",
    clientEmail: "sarah@acmecorp.com",
    issueDate: "2026-10-01",
    validUntil: "2026-11-15",
    status: "Sent",
    items: [
      { id: "e1", description: "Enterprise SaaS UI/UX Revamp", quantity: 1, unitPrice: 12500, total: 12500 }
    ],
    totalAmount: 12500
  },
  {
    id: "est-2",
    estimateNumber: "EST-2026-002",
    clientName: "Vikram Malhotra",
    clientCompany: "Zenith Retail",
    clientEmail: "vikram@zenithretail.in",
    issueDate: "2026-10-10",
    validUntil: "2026-11-01",
    status: "Accepted",
    items: [
      { id: "e2", description: "Mobile App Backend API Migration", quantity: 1, unitPrice: 8200, total: 8200 }
    ],
    totalAmount: 8200
  }
];