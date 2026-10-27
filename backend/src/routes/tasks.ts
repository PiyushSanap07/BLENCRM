import { Router, Request, Response } from 'express';
import { db } from '../config/database.js';

const router = Router();

// GET all tasks
router.get('/', (req: Request, res: Response) => {
  try {
    const cols = db.pragma('table_info(tasks)') as any[];
    const hasCreatedAt = cols.some((c: any) => c.name === 'createdAt');
    const orderClause = hasCreatedAt ? 'ORDER BY createdAt DESC' : 'ORDER BY rowid DESC';
    const tasks = db.prepare(`SELECT * FROM tasks ${orderClause}`).all();

    const normalized = tasks.map((task: any) => ({
      ...task,
      assignedTo: task.assignee || task.assignedTo || 'Unassigned',
      clientOrLead: task.clientOrLead || 'General',
      dueTime: task.dueTime || '12:00 PM',
      status: task.status || (task.completed ? 'Completed' : 'Pending'),
    }));

    res.json(normalized);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new task
router.post('/', (req: Request, res: Response) => {
  const { id, title, assignee, assignedTo, priority, category, dueDate, dueTime, clientOrLead, status } = req.body;
  const taskId = id || `task-${Date.now()}`;
  const finalAssignee = assignee || assignedTo || 'Unassigned';
  const initialStatus = status || 'Pending';

  try {
    db.prepare(`
      INSERT INTO tasks (id, title, assignee, priority, category, dueDate, dueTime, clientOrLead, completed, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      taskId,
      title,
      finalAssignee,
      priority || 'Medium',
      category || 'General',
      dueDate || new Date().toISOString().split('T')[0],
      dueTime || '12:00 PM',
      clientOrLead || 'General',
      initialStatus === 'Completed' ? 1 : 0,
      initialStatus
    );
    res.status(201).json({ message: 'Task created successfully', id: taskId });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH update task status manually ('Pending' | 'In Progress' | 'Completed')
router.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid task status' });
    }
    const isCompleted = status === 'Completed' ? 1 : 0;

    const result = db
      .prepare('UPDATE tasks SET status = ?, completed = ? WHERE id = ?')
      .run(status, isCompleted, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task status updated successfully', status, completed: isCompleted });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE task
router.delete('/:id', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;