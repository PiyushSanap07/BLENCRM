export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Lead' | 'Proposal Sent' | 'Negotiation' | 'Won' | string;
  leadId?: string;
  totalBilled: number;
  outstandingBalance: number;
  activeProject: string;
  joinedDate: string;
}

export const mockClients: Client[] = [];