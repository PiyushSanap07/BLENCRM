import { Router, Request, Response } from 'express';
import { db } from '../config/database.js';

const router = Router();

// GET all team members
router.get('/', (req: Request, res: Response) => {
  try {
    const team = db.prepare('SELECT * FROM team_members ORDER BY createdAt DESC').all();
    res.json(team);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST add new team member
router.post('/', (req: Request, res: Response) => {
  const { id, name, email, role, status } = req.body;
  const memberId = id || `tm-${Date.now()}`;

  try {
    db.prepare(`
      INSERT INTO team_members (id, name, email, role, status)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      memberId,
      name,
      email,
      role || 'Developer',
      status || 'Active'
    );
    res.status(201).json({ message: 'Team member added successfully', id: memberId });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE team member
router.delete('/:id', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM team_members WHERE id = ?').run(req.params.id);
    res.json({ message: 'Team member removed successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;