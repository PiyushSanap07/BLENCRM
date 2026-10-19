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

export const mockDeals: Deal[] = [
  {
    id: "deal-301",
    title: "Q4 Web Application Architecture",
    company: "Acme Corporation",
    value: 14000,
    stage: "Proposal Sent",
    priority: "High",
    assignedTo: "Piyush Swarnani",
    expectedCloseDate: "2026-10-28"
  },
  {
    id: "deal-302",
    title: "Payment Gateway & Billing Integration",
    company: "Zenith Retail",
    value: 8500,
    stage: "Contacted",
    priority: "Medium",
    assignedTo: "Alex Rivera",
    expectedCloseDate: "2026-11-05"
  },
  {
    id: "deal-303",
    title: "Cloud Infrastructure & Security Audit",
    company: "TechFlow Ltd",
    value: 22000,
    stage: "Won",
    priority: "High",
    assignedTo: "Piyush Swarnani",
    expectedCloseDate: "2026-10-15"
  },
  {
    id: "deal-304",
    title: "E-Commerce App Optimization",
    company: "Studio Craft",
    value: 5000,
    stage: "Lead",
    priority: "Low",
    assignedTo: "Elena Rostova",
    expectedCloseDate: "2026-11-12"
  },
  {
    id: "deal-305",
    title: "Enterprise Custom CRM & Dashboard",
    company: "Nexus Technologies",
    value: 35000,
    stage: "Proposal Sent",
    priority: "High",
    assignedTo: "Piyush Swarnani",
    expectedCloseDate: "2026-10-31"
  }
];  