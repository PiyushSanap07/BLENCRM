import { Router, Request, Response } from 'express';
import { db } from '../config/database.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const members = db.prepare('SELECT * FROM team_members ORDER BY createdAt ASC').all();
    res.json(members);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req: Request, res: Response) => {
  const { id, name, email, role, status } = req.body;
  const memberId = id || `tm-${Date.now()}`;
  try {
    db.prepare(`
      INSERT INTO team_members (id, name, email, role, status)
      VALUES (?, ?, ?, ?, ?)
    `).run(memberId, name, email, role || 'Developer', status || 'Active');
    res.status(201).json({ message: 'Team member added successfully', id: memberId });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM team_members WHERE id = ?').run(req.params.id);
    res.json({ message: 'Team member removed successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
