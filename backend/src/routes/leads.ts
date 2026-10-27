import { Router } from 'express';
import db from '../config/database.js';

const router = Router();

// Get all leads
router.get('/', (req, res) => {
  try {
    const leads = db.prepare('SELECT * FROM leads ORDER BY createdAt DESC').all();
    res.json(leads);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create new lead (Auto-initializes to 'Lead' stage for Sales Pipeline)
router.post('/', (req, res) => {
  try {
    const { id, name, company, email, phone, value, estimatedValue, stage, score, source, assignedTo, notes } = req.body;
    
    let cleanPhone = (phone || '').toString().trim().replace(/[\s\-\(\)\.]/g, '');
    if (/[a-zA-Z]/.test(cleanPhone)) {
      return res.status(400).json({ error: 'Phone number cannot contain letters or alphabets.' });
    }
    if (cleanPhone.startsWith('+91')) cleanPhone = cleanPhone.substring(3);
    else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) cleanPhone = cleanPhone.substring(2);
    else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) cleanPhone = cleanPhone.substring(1);

    if (cleanPhone && !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.' });
    }

    const leadId = id || `lead-${Date.now()}`;
    const leadStage = stage || 'Lead';
    const dealValue = Number(value ?? estimatedValue ?? 0) || 0;
    const stmt = db.prepare(`
      INSERT INTO leads (id, name, company, email, phone, value, stage, convertedToClient, score, source, assignedTo, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)
    `);
    stmt.run(
      leadId,
      name,
      company,
      email,
      phone || '',
      dealValue,
      leadStage,
      Number(score) || 60,
      source || 'Website',
      assignedTo || '',
      notes || ''
    );
    res.status(201).json({ success: true, id: leadId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update lead pipeline stage
router.patch('/:id/stage', (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    
    db.prepare('UPDATE leads SET stage = ? WHERE id = ?').run(stage, id);
    db.prepare('UPDATE clients SET status = ? WHERE leadId = ?').run(stage, id);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Convert Lead to Client (One-time action)
router.post('/:id/convert', (req, res) => {
  try {
    const { id } = req.params;
    const lead: any = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const clientId = `client-${Date.now()}`;
    
    db.prepare(`
      INSERT INTO clients (id, leadId, name, company, email, phone, activeProject, totalBilled, outstandingBalance, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      clientId,
      lead.id,
      lead.name,
      lead.company,
      lead.email,
      lead.phone || '',
      'Custom Software Engagement',
      lead.value || 0,
      lead.value || 0,
      lead.stage
    );

    db.prepare('UPDATE leads SET convertedToClient = 1 WHERE id = ?').run(id);

    res.json({ success: true, clientId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete lead
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;