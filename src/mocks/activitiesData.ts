export interface TaskItem {
  id: string;
  title: string;
  clientOrLead: string;
  dueDate: string;
  dueTime: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  category: 'Call' | 'Meeting' | 'Proposal' | 'Billing' | 'Code Review';
  assignedTo: string;
}

export const mockTasks: TaskItem[] = [
  {
    id: "task-401",
    title: "Follow up on Q4 Proposal & Architecture Scope",
    clientOrLead: "Acme Corporation",
    dueDate: "2026-10-20",
    dueTime: "11:00 AM",
    priority: "High",
    status: "Pending",
    category: "Call",
    assignedTo: "Piyush Swarnani"
  },
  {
    id: "task-402",
    title: "Send milestone invoice for API integration phase",
    clientOrLead: "Zenith Retail",
    dueDate: "2026-10-21",
    dueTime: "02:30 PM",
    priority: "Medium",
    status: "In Progress",
    category: "Billing",
    assignedTo: "Piyush Swarnani"
  },
  {
    id: "task-403",
    title: "Discovery meeting for Cloud Infrastructure Audit",
    clientOrLead: "TechFlow Ltd",
    dueDate: "2026-10-22",
    dueTime: "04:00 PM",
    priority: "High",
    status: "Pending",
    category: "Meeting",
    assignedTo: "Alex Rivera"
  },
  {
    id: "task-404",
    title: "Review backend database migration scripts",
    clientOrLead: "Global Logistics Co.",
    dueDate: "2026-10-18",
    dueTime: "05:00 PM",
    priority: "Low",
    status: "Completed",
    category: "Code Review",
    assignedTo: "Elena Rostova"
  }
];