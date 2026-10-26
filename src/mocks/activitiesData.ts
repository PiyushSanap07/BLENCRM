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

export const mockTasks: TaskItem[] = [];