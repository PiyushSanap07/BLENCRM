import { Router, Request, Response } from 'express';
import { db } from '../config/database.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const cols = db.pragma('table_info(clients)') as any[];
    const hasCreatedAt = cols.some((c: any) => c.name === 'createdAt');
    const orderClause = hasCreatedAt ? 'ORDER BY createdAt DESC' : 'ORDER BY rowid DESC';
    const clients = db.prepare(`SELECT * FROM clients ${orderClause}`).all();
    const normalized = clients.map((c: any) => ({
      ...c,
      totalBilled: c.totalBilled || 0,
      outstandingBalance: c.outstandingBalance || 0,
      activeProject: c.activeProject || 'General Retainer',
      joinedDate: c.joinedDate || (c.createdAt ? c.createdAt.split(' ')[0] : new Date().toISOString().split('T')[0])
    }));
    res.json(normalized);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req: Request, res: Response) => {
  const { id, name, company, email, phone, totalBilled, outstandingBalance, activeProject, status } = req.body;
  
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Client contact name is required.' });
  }
  if (!company || !company.trim()) {
    return res.status(400).json({ error: 'Client company name is required.' });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Client email address is required.' });
  }

  // Indian 10-digit Phone Validation
  let cleanPhone = (phone || '').toString().trim().replace(/[\s\-\(\)\.]/g, '');
  if (cleanPhone.startsWith('+91')) cleanPhone = cleanPhone.substring(3);
  else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) cleanPhone = cleanPhone.substring(2);
  else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) cleanPhone = cleanPhone.substring(1);

  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    return res.status(400).json({ 
      error: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.' 
    });
  }

  const numBilled = Number(totalBilled ?? 0);
  if (isNaN(numBilled) || numBilled < 0) {
    return res.status(400).json({ error: 'Total billed must be a valid amount in Indian Rupees (₹).' });
  }

  const numDue = Number(outstandingBalance ?? 0);
  if (isNaN(numDue) || numDue < 0) {
    return res.status(400).json({ error: 'Balance due must be a valid amount in Indian Rupees (₹).' });
  }

  const clientId = id || `client-${Date.now()}`;
  try {
    db.prepare(`
      INSERT INTO clients (id, name, company, email, phone, totalBilled, outstandingBalance, activeProject, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      clientId,
      name.trim(),
      company.trim(),
      email.trim(),
      cleanPhone,
      numBilled,
      numDue,
      activeProject ? activeProject.trim() : 'Active Engagement',
      status || 'Lead'
    );
    res.status(201).json({ message: 'Client registered successfully', id: clientId });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE clients SET status = ? WHERE id = ?').run(status, req.params.id);
    const client: any = db.prepare('SELECT leadId FROM clients WHERE id = ?').get(req.params.id);
    if (client && client.leadId) {
      db.prepare('UPDATE leads SET stage = ? WHERE id = ?').run(status, client.leadId);
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM clients WHERE id = ?').run(req.params.id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;