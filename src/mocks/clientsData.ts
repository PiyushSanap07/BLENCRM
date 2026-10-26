export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Active' | 'On Hold' | 'Completed' | 'Churned';
  totalBilled: number;
  outstandingBalance: number;
  activeProject: string;
  joinedDate: string;
}

export const mockClients: Client[] = [];