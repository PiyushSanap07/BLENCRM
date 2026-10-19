export interface PaymentTransaction {
  id: string;
  transactionRef: string;
  invoiceNumber: string;
  clientName: string;
  clientCompany: string;
  amount: number;
  paymentMethod: 'Bank Transfer / NEFT' | 'UPI / QR Code' | 'Credit Card' | 'Wire Transfer';
  paymentDate: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export const mockPayments: PaymentTransaction[] = [
  {
    id: "pay-101",
    transactionRef: "TXN-998201",
    invoiceNumber: "INV-2026-089",
    clientName: "Sarah Jenkins",
    clientCompany: "Acme Corporation",
    amount: 5830,
    paymentMethod: "Bank Transfer / NEFT",
    paymentDate: "2026-10-12",
    status: "Completed"
  },
  {
    id: "pay-102",
    transactionRef: "TXN-998202",
    invoiceNumber: "INV-2026-090",
    clientName: "Vikram Malhotra",
    clientCompany: "Zenith Retail",
    amount: 1500,
    paymentMethod: "UPI / QR Code",
    paymentDate: "2026-10-18",
    status: "Completed"
  },
  {
    id: "pay-103",
    transactionRef: "TXN-998203",
    invoiceNumber: "INV-2026-088",
    clientName: "Alex Rivera",
    clientCompany: "Nexus Technologies",
    amount: 12000,
    paymentMethod: "Wire Transfer",
    paymentDate: "2026-10-05",
    status: "Completed"
  }
];