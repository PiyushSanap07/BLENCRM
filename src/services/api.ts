const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = {
  // Invoices
  getInvoices: async () => {
    const res = await fetch(`${API_BASE_URL}/invoices`);
    if (!res.ok) throw new Error('Failed to fetch invoices');
    return res.json();
  },

  getInvoiceById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/invoices/${id}`);
    if (!res.ok) throw new Error('Failed to fetch invoice');
    return res.json();
  },

  createInvoice: async (invoiceData: any) => {
    const res = await fetch(`${API_BASE_URL}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData),
    });
    if (!res.ok) throw new Error('Failed to create invoice');
    return res.json();
  },

  recordPayment: async (invoiceId: string, paymentData: { paymentAmount: number; paymentMethod: string; transactionRef?: string }) => {
    const res = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });
    if (!res.ok) throw new Error('Failed to record payment');
    return res.json();
  },

  // Payments Ledger
  getPayments: async () => {
    const res = await fetch(`${API_BASE_URL}/payments`);
    if (!res.ok) throw new Error('Failed to fetch payments');
    return res.json();
  },

  // Leads
  getLeads: async () => {
    const res = await fetch(`${API_BASE_URL}/leads`);
    if (!res.ok) throw new Error('Failed to fetch leads');
    return res.json();
  },

  createLead: async (leadData: any) => {
    const res = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
    if (!res.ok) throw new Error('Failed to create lead');
    return res.json();
  },

  deleteLead: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/leads/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete lead');
    return res.json();
  },

  // Tasks & Activities
  getTasks: async () => {
    const res = await fetch(`${API_BASE_URL}/tasks`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  createTask: async (taskData: any) => {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  toggleTask: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to toggle task');
    return res.json();
  },

  deleteTask: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return res.json();
  },

  // Clients
  getClients: async () => {
    const res = await fetch(`${API_BASE_URL}/clients`);
    if (!res.ok) throw new Error('Failed to fetch clients');
    return res.json();
  },

  createClient: async (clientData: any) => {
    const res = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData),
    });
    if (!res.ok) throw new Error('Failed to create client');
    return res.json();
  },

  deleteClient: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete client');
    return res.json();
  },

  // Team Members
  getTeam: async () => {
    const res = await fetch(`${API_BASE_URL}/team`);
    if (!res.ok) throw new Error('Failed to fetch team members');
    return res.json();
  },

  createTeamMember: async (memberData: any) => {
    const res = await fetch(`${API_BASE_URL}/team`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData),
    });
    if (!res.ok) throw new Error('Failed to create team member');
    return res.json();
  },

  deleteTeamMember: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/team/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete team member');
    return res.json();
  },
};