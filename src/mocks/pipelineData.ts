export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: 'Lead' | 'Contacted' | 'Proposal Sent' | 'Won' | 'Lost';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  expectedCloseDate: string;
}

export const mockDeals: Deal[] = [];