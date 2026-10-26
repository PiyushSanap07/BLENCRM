import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'blendigital.db');
export const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      invoiceNumber TEXT NOT NULL UNIQUE,
      clientName TEXT NOT NULL,
      clientCompany TEXT NOT NULL,
      clientEmail TEXT NOT NULL,
      issueDate TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Draft',
      subtotal REAL NOT NULL,
      taxRate REAL NOT NULL DEFAULT 10,
      taxAmount REAL NOT NULL,
      totalAmount REAL NOT NULL,
      paidAmount REAL NOT NULL DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS invoice_items (
      id TEXT PRIMARY KEY,
      invoiceId TEXT NOT NULL,
      description TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unitPrice REAL NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (invoiceId) REFERENCES invoices (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      transactionRef TEXT NOT NULL UNIQUE,
      invoiceNumber TEXT NOT NULL,
      clientName TEXT NOT NULL,
      clientCompany TEXT NOT NULL,
      amount REAL NOT NULL,
      paymentMethod TEXT NOT NULL,
      paymentDate TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Completed',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      value REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'New',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      totalBilled REAL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'Active',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      assignee TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'Medium',
      category TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Developer',
      status TEXT NOT NULL DEFAULT 'Active',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Helper to add missing column safely
  const addColumnIfNotExists = (table: string, column: string, def: string) => {
    const cols = db.pragma(`table_info(${table})`) as any[];
    if (!cols.some((c: any) => c.name === column)) {
      try {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${def}`);
      } catch (err) {
        console.warn(`Could not add column ${column} to ${table}:`, err);
      }
    }
  };

  // Ensure leads has all expected fields
  addColumnIfNotExists('leads', 'score', 'INTEGER DEFAULT 60');
  addColumnIfNotExists('leads', 'source', "TEXT DEFAULT 'Website'");
  addColumnIfNotExists('leads', 'assignedTo', "TEXT DEFAULT 'Piyush Swarnani'");
  addColumnIfNotExists('leads', 'notes', "TEXT DEFAULT ''");

  // Ensure tasks has all expected fields
  addColumnIfNotExists('tasks', 'clientOrLead', "TEXT DEFAULT ''");
  addColumnIfNotExists('tasks', 'dueTime', "TEXT DEFAULT '12:00 PM'");

  // Ensure clients has all expected fields
  addColumnIfNotExists('clients', 'outstandingBalance', 'REAL DEFAULT 0');
  addColumnIfNotExists('clients', 'activeProject', "TEXT DEFAULT ''");
  addColumnIfNotExists('clients', 'joinedDate', "TEXT DEFAULT ''");

  // Seed default team members if empty
  try {
    const teamCount = (db.prepare('SELECT COUNT(*) as count FROM team_members').get() as any)?.count || 0;
    if (teamCount === 0) {
      const insert = db.prepare('INSERT INTO team_members (id, name, email, role, status) VALUES (?, ?, ?, ?, ?)');
      insert.run('tm-1', 'Piyush Swarnani', 'piyush@blendigital.io', 'Super Admin', 'Active');
      insert.run('tm-2', 'Alex Rivera', 'alex@blendigital.io', 'Sales Manager', 'Active');
      insert.run('tm-3', 'Elena Rostova', 'elena@blendigital.io', 'Accountant', 'Active');
    }
  } catch (err) {
    console.error('Error seeding team members:', err);
  }

  console.log('✅ SQLite Clean Database & Tables Initialized (Ready for manual data entry)');
}