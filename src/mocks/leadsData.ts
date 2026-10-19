export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: 'Website' | 'LinkedIn' | 'Referral' | 'Cold Outreach' | 'Event';
  status: 'New' | 'Contacted' | 'Qualified' | 'Unqualified';
  score: number; // 0 to 100
  estimatedValue: number;
  assignedTo: string;
  createdAt: string;
  notes?: string;
}

export const mockLeads: Lead[] = [
  {
    id: "lead-101",
    name: "Aarav Sharma",
    company: "Nexus Technologies",
    email: "aarav@nexustech.io",
    phone: "+91 98765 43210",
    source: "Website",
    status: "New",
    score: 85,
    estimatedValue: 12000,
    assignedTo: "Alex Rivera",
    createdAt: "2026-10-18",
    notes: "Interested in full-stack web application development and cloud migration."
  },
  {
    id: "lead-102",
    name: "Riya Patel",
    company: "Apex Innovations",
    email: "riya.p@apexinnovations.com",
    phone: "+91 98123 45678",
    source: "LinkedIn",
    status: "Contacted",
    score: 62,
    estimatedValue: 8500,
    assignedTo: "Piyush Swarnani",
    createdAt: "2026-10-15",
    notes: "Had initial discovery call. Sent product breakdown and portfolio."
  },
  {
    id: "lead-103",
    name: "Michael Chen",
    company: "Global Logistics Co.",
    email: "m.chen@globallogistics.com",
    phone: "+1 (555) 019-2834",
    source: "Referral",
    status: "Qualified",
    score: 94,
    estimatedValue: 25000,
    assignedTo: "Alex Rivera",
    createdAt: "2026-10-10",
    notes: "High-value enterprise lead. Ready to evaluate dynamic billing integration."
  },
  {
    id: "lead-104",
    name: "Sneha Kulkarni",
    company: "Studio Craft",
    email: "sneha@studiocraft.in",
    phone: "+91 97654 32109",
    source: "Cold Outreach",
    status: "Unqualified",
    score: 30,
    estimatedValue: 3000,
    assignedTo: "Piyush Swarnani",
    createdAt: "2026-10-02",
    notes: "Budget is below standard threshold for custom software."
  }
];