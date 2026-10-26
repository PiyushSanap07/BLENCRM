export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: 'Website' | 'LinkedIn' | 'Referral' | 'Cold Outreach' | 'Event';
  status: 'New' | 'Contacted' | 'Qualified' | 'Unqualified';
  score: number;
  estimatedValue: number;
  assignedTo: string;
  createdAt: string;
  notes?: string;
}

export const mockLeads: Lead[] = [];