import { Router, Request, Response } from 'express';
import { db } from '../config/database.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const leads = db.prepare('SELECT * FROM leads ORDER BY createdAt DESC').all();
    // Normalize fields so frontend can access value or estimatedValue seamlessly
    const normalized = leads.map((lead: any) => ({
      ...lead,
      estimatedValue: lead.value ?? lead.estimatedValue ?? 0,
      score: lead.score ?? 60,
      source: lead.source || 'Website',
      assignedTo: lead.assignedTo || 'Piyush Swarnani'
    }));
    res.json(normalized);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req: Request, res: Response) => {
  const { id, name, company, email, phone, value, estimatedValue, status, score, source, assignedTo, notes } = req.body;
  
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Lead name is required.' });
  }
  if (!company || !company.trim()) {
    return res.status(400).json({ error: 'Company name is required.' });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email address is required.' });
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

  // Cost in INR Validation
  const rawVal = value !== undefined ? value : estimatedValue;
  if (rawVal === undefined || rawVal === null || rawVal === '') {
    return res.status(400).json({ error: 'Estimated deal value in Indian Rupees (₹) is required.' });
  }
  const finalVal = Number(rawVal);
  if (isNaN(finalVal) || finalVal <= 0) {
    return res.status(400).json({ error: 'Estimated deal value must be a positive amount in Indian Rupees (₹).' });
  }

  // Lead Score Validation (0 - 100)
  if (score === undefined || score === null || score === '') {
    return res.status(400).json({ error: 'Lead score is required (0 - 100).' });
  }
  const finalScore = Number(score);
  if (isNaN(finalScore) || !Number.isInteger(finalScore) || finalScore < 0 || finalScore > 100) {
    return res.status(400).json({ error: 'Lead score must be a whole number between 0 and 100.' });
  }

  const leadId = id || `lead-${Date.now()}`;

  try {
    db.prepare(`
      INSERT INTO leads (id, name, company, email, phone, value, status, score, source, assignedTo, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      leadId,
      name.trim(),
      company.trim(),
      email.trim(),
      cleanPhone,
      finalVal,
      status || 'New',
      finalScore,
      source || 'Website',
      assignedTo || 'Piyush Swarnani',
      notes || ''
    );
    res.status(201).json({ message: 'Lead created successfully', id: leadId });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
    res.json({ message: 'Lead deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;