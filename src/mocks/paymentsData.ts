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

export const mockPayments: PaymentTransaction[] = [];