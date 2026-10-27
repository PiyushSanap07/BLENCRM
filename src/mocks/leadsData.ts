export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: 'Website' | 'LinkedIn' | 'Referral' | 'Cold Outreach' | 'Event';
  status?: 'Lead' | 'Proposal Sent' | 'Negotiation' | 'Won' | string;
  stage?: 'Lead' | 'Proposal Sent' | 'Negotiation' | 'Won' | string;
  convertedToClient?: number;
  score: number;
  estimatedValue: number;
  value?: number;
  assignedTo: string;
  createdAt: string;
  notes?: string;
}

export const mockLeads: Lead[] = [];