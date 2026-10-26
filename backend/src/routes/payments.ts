import { Router, Request, Response } from 'express';
import { db } from '../config/database.js';

const router = Router();

// Get all payment transactions
router.get('/', (req: Request, res: Response) => {
  try {
    const payments = db.prepare('SELECT * FROM payments ORDER BY createdAt DESC').all();
    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;