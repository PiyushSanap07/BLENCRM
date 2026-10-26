import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/database.js';
import invoiceRoutes from './routes/invoices.js';
import paymentRoutes from './routes/payments.js';
import leadRoutes from './routes/leads.js';
import clientRoutes from './routes/clients.js';
import taskRoutes from './routes/tasks.js';
import teamRoutes from './routes/team.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

initDatabase();

app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/team', teamRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'BLENDIGITAL Express API', db: 'SQLite' });
});

// Add this root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the BLENDIGITAL CRM & Billing API',
    status: 'online',
    documentation: 'Use /api/health, /api/invoices, /api/leads, etc.'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});