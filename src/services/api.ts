const API_BASE = 'http://localhost:5000/api';

export const apiClient = {
  getLeads: async () => {
    try {
      const res = await fetch(`${API_BASE}/leads`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },
  createLead: async (data: any) => (await fetch(`${API_BASE}/leads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })).json(),
  updateLeadStage: async (id: string, stage: string) => (await fetch(`${API_BASE}/leads/${id}/stage`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage }) })).json(),
  convertLeadToClient: async (id: string) => (await fetch(`${API_BASE}/leads/${id}/convert`, { method: 'POST' })).json(),
  deleteLead: async (id: string) => (await fetch(`${API_BASE}/leads/${id}`, { method: 'DELETE' })).json(),

  getClients: async () => {
    try {
      const res = await fetch(`${API_BASE}/clients`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },
  createClient: async (data: any) => (await fetch(`${API_BASE}/clients`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })).json(),
  updateClientStatus: async (id: string, status: string) => (await fetch(`${API_BASE}/clients/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })).json(),
  deleteClient: async (id: string) => (await fetch(`${API_BASE}/clients/${id}`, { method: 'DELETE' })).json(),

  getTeam: async () => {
    try {
      const res = await fetch(`${API_BASE}/team`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },
  createTeamMember: async (data: any) => (await fetch(`${API_BASE}/team`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })).json(),
  deleteTeamMember: async (id: string) => (await fetch(`${API_BASE}/team/${id}`, { method: 'DELETE' })).json(),

  getInvoices: async () => {
    try {
      const res = await fetch(`${API_BASE}/invoices`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },
  getInvoiceById: async (id: string) => (await fetch(`${API_BASE}/invoices/${id}`)).json(),
  createInvoice: async (data: any) => {
    const res = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to save invoice');
    return result;
  },
  updateInvoiceStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_BASE}/invoices/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to update invoice status');
    return result;
  },
  recordPayment: async (id: string, data: any) => (await fetch(`${API_BASE}/invoices/${id}/payment`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })).json(),
  getPayments: async () => {
    try {
      const res = await fetch(`${API_BASE}/payments`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getTasks: async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },
  createTask: async (data: any) => (await fetch(`${API_BASE}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })).json(),
  toggleTask: async (id: string) => (await fetch(`${API_BASE}/tasks/${id}/toggle`, { method: 'PATCH' })).json(),
  updateTaskStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update task status');
    return data;
  },
  deleteTask: async (id: string) => (await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' })).json(),
};