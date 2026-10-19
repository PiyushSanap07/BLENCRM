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

export const mockClients: Client[] = [
  {
    id: "client-201",
    name: "Sarah Jenkins",
    company: "Acme Corporation",
    email: "sarah@acmecorp.com",
    phone: "+1 (555) 019-2834",
    status: "Active",
    totalBilled: 38500,
    outstandingBalance: 4500,
    activeProject: "Q4 Full-Stack Web App Redesign",
    joinedDate: "2025-06-12"
  },
  {
    id: "client-202",
    name: "Vikram Malhotra",
    company: "Zenith Retail",
    email: "vikram@zenithretail.in",
    phone: "+91 98220 11223",
    status: "Active",
    totalBilled: 14000,
    outstandingBalance: 0,
    activeProject: "E-Commerce Payment Gateway Integration",
    joinedDate: "2025-09-01"
  },
  {
    id: "client-203",
    name: "Elena Rostova",
    company: "TechFlow Ltd",
    email: "elena@techflow.io",
    phone: "+44 20 7946 0912",
    status: "On Hold",
    totalBilled: 22000,
    outstandingBalance: 1200,
    activeProject: "Cloud Infrastructure Audit",
    joinedDate: "2025-03-18"
  }
];