import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

export const initDatabase = () => {
  // Leads table with pipeline stage & conversion tracking
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      value REAL DEFAULT 0,
      stage TEXT DEFAULT 'Lead',
      convertedToClient INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Clients table linked to leads
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      leadId TEXT,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      activeProject TEXT,
      totalBilled REAL DEFAULT 0,
      outstandingBalance REAL DEFAULT 0,
      status TEXT DEFAULT 'Lead',
      joinedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(leadId) REFERENCES leads(id)
    )
  `);

  // Invoices table
  db.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      invoiceNumber TEXT NOT NULL,
      clientName TEXT NOT NULL,
      clientCompany TEXT NOT NULL,
      clientEmail TEXT NOT NULL,
      issueDate TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      status TEXT NOT NULL,
      subtotal REAL NOT NULL,
      taxRate REAL NOT NULL,
      taxAmount REAL NOT NULL,
      totalAmount REAL NOT NULL,
      paidAmount REAL DEFAULT 0
    )
  `);

  // Payments ledger table
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      invoiceId TEXT NOT NULL,
      paymentAmount REAL NOT NULL,
      paymentMethod TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(invoiceId) REFERENCES invoices(id)
    )
  `);

  // Tasks table (includes status field for manual tracking)
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      assignee TEXT NOT NULL,
      priority TEXT NOT NULL,
      category TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      dueTime TEXT,
      clientOrLead TEXT,
      completed INTEGER DEFAULT 0,
      status TEXT DEFAULT 'Pending'
    )
  `);

  // Invoice items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id TEXT PRIMARY KEY,
      invoiceId TEXT NOT NULL,
      description TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unitPrice REAL NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (invoiceId) REFERENCES invoices (id) ON DELETE CASCADE
    )
  `);

  // Team members table
  db.exec(`
    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Developer',
      status TEXT NOT NULL DEFAULT 'Active',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Helper to add missing columns safely
  const addColumnIfNotExists = (table: string, column: string, def: string) => {
    try {
      const cols = db.pragma(`table_info(${table})`) as any[];
      if (!cols.some((c: any) => c.name === column)) {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${def}`);
      }
    } catch (err) {
      console.warn(`Could not add column ${column} to ${table}:`, err);
    }
  };

  // Safe migrations for missing columns
  addColumnIfNotExists('clients', 'createdAt', 'DATETIME DEFAULT CURRENT_TIMESTAMP');
  addColumnIfNotExists('invoices', 'createdAt', 'DATETIME DEFAULT CURRENT_TIMESTAMP');
  addColumnIfNotExists('tasks', 'createdAt', 'DATETIME DEFAULT CURRENT_TIMESTAMP');
  addColumnIfNotExists('tasks', 'status', "TEXT DEFAULT 'Pending'");
  addColumnIfNotExists('leads', 'score', 'INTEGER DEFAULT 60');
  addColumnIfNotExists('leads', 'source', "TEXT DEFAULT 'Website'");
  addColumnIfNotExists('leads', 'assignedTo', "TEXT DEFAULT ''");
  addColumnIfNotExists('leads', 'notes', "TEXT DEFAULT ''");

  // Remove mock/pre-seeded team members so only user-added members exist
  try {
    db.prepare("DELETE FROM team_members WHERE id IN ('tm-1', 'tm-2', 'tm-3')").run();
  } catch (err) {
    // ignore
  }

  // Migrate any old 'Inquiry' or legacy status to 'Lead'
  try {
    db.prepare("UPDATE leads SET stage = 'Lead' WHERE stage = 'Inquiry' OR stage IS NULL OR stage = '' OR stage IN ('New', 'Contacted', 'Qualified', 'Unqualified')").run();
    db.prepare("UPDATE clients SET status = 'Lead' WHERE status = 'Inquiry' OR status IS NULL OR status = '' OR status IN ('Active', 'On Hold', 'Completed', 'Churned')").run();
  } catch (err) {
    // ignore
  }

  console.log('📦 SQLite database initialized with unified pipeline schema.');
};

export { db };
export default db;