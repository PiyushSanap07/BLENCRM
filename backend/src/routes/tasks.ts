import { Router, Request, Response } from 'express';
import { db } from '../config/database.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY createdAt DESC').all();
    const normalized = tasks.map((task: any) => ({
      ...task,
      assignedTo: task.assignee || task.assignedTo || 'Piyush Swarnani',
      clientOrLead: task.clientOrLead || 'General',
      dueTime: task.dueTime || '12:00 PM',
      status: task.completed ? 'Completed' : 'Pending',
    }));
    res.json(normalized);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req: Request, res: Response) => {
  const { id, title, assignee, assignedTo, priority, category, dueDate, dueTime, clientOrLead } = req.body;
  const taskId = id || `task-${Date.now()}`;
  const finalAssignee = assignee || assignedTo || 'Piyush Swarnani';

  try {
    db.prepare(`
      INSERT INTO tasks (id, title, assignee, priority, category, dueDate, dueTime, clientOrLead, completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).run(
      taskId,
      title,
      finalAssignee,
      priority || 'Medium',
      category || 'General',
      dueDate || new Date().toISOString().split('T')[0],
      dueTime || '12:00 PM',
      clientOrLead || 'General'
    );
    res.status(201).json({ message: 'Task created successfully', id: taskId });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/toggle', (req: Request, res: Response) => {
  try {
    const task: any = db.prepare('SELECT completed FROM tasks WHERE id = ?').get(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    const newStatus = task.completed ? 0 : 1;
    db.prepare('UPDATE tasks SET completed = ? WHERE id = ?').run(newStatus, req.params.id);
    res.json({ message: 'Task status updated', completed: newStatus, status: newStatus ? 'Completed' : 'Pending' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;