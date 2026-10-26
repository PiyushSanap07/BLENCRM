import { Router, Request, Response } from 'express';
import { db } from '../config/database.js';

const router = Router();

// Get all invoices with their line items
router.get('/', (req: Request, res: Response) => {
  try {
    const invoices = db.prepare('SELECT * FROM invoices ORDER BY createdAt DESC').all();
    const invoicesWithItems = invoices.map((inv: any) => {
      const items = db.prepare('SELECT * FROM invoice_items WHERE invoiceId = ?').all(inv.id);
      return { ...inv, items };
    });
    res.json(invoicesWithItems);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single invoice by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const invoice: any = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    const items = db.prepare('SELECT * FROM invoice_items WHERE invoiceId = ?').all(invoice.id);
    res.json({ ...invoice, items });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new invoice
router.post('/', (req: Request, res: Response) => {
  const {
    id,
    invoiceNumber,
    clientName,
    clientCompany,
    clientEmail,
    issueDate,
    dueDate,
    status,
    subtotal,
    taxRate,
    taxAmount,
    totalAmount,
    paidAmount,
    items
  } = req.body;

  try {
    const insertInvoice = db.prepare(`
      INSERT INTO invoices (id, invoiceNumber, clientName, clientCompany, clientEmail, issueDate, dueDate, status, subtotal, taxRate, taxAmount, totalAmount, paidAmount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertItem = db.prepare(`
      INSERT INTO invoice_items (id, invoiceId, description, quantity, unitPrice, total)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction((invData, itemDataList) => {
      insertInvoice.run(
        invData.id,
        invData.invoiceNumber,
        invData.clientName,
        invData.clientCompany,
        invData.clientEmail,
        invData.issueDate,
        invData.dueDate,
        invData.status || 'Draft',
        invData.subtotal,
        invData.taxRate || 10,
        invData.taxAmount,
        invData.totalAmount,
        invData.paidAmount || 0
      );

      for (const item of itemDataList) {
        insertItem.run(item.id, invData.id, item.description, item.quantity, item.unitPrice, item.total);
      }
    });

    transaction(
      { id, invoiceNumber, clientName, clientCompany, clientEmail, issueDate, dueDate, status, subtotal, taxRate, taxAmount, totalAmount, paidAmount },
      items || []
    );

    res.status(201).json({ message: 'Invoice created successfully', id });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Record a payment against an invoice
router.patch('/:id/payment', (req: Request, res: Response) => {
  const { id } = req.params;
  const { paymentAmount, paymentMethod, transactionRef } = req.body;

  try {
    const invoice: any = db.prepare('SELECT * FROM invoices WHERE id = ?').get(id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const newPaidAmount = invoice.paidAmount + Number(paymentAmount);
    const newStatus = newPaidAmount >= invoice.totalAmount ? 'Paid' : 'Partially Paid';

    const updateInvoice = db.prepare(`
      UPDATE invoices SET paidAmount = ?, status = ? WHERE id = ?
    `);

    const insertPayment = db.prepare(`
      INSERT INTO payments (id, transactionRef, invoiceNumber, clientName, clientCompany, amount, paymentMethod, paymentDate, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const payId = 'pay-' + Date.now();
    const txnRef = transactionRef || 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const today = new Date().toISOString().split('T')[0];

    const transaction = db.transaction(() => {
      updateInvoice.run(newPaidAmount, newStatus, id);
      insertPayment.run(
        payId,
        txnRef,
        invoice.invoiceNumber,
        invoice.clientName,
        invoice.clientCompany,
        Number(paymentAmount),
        paymentMethod || 'Bank Transfer / NEFT',
        today,
        'Completed'
      );
    });

    transaction();

    res.json({ message: 'Payment recorded successfully', newPaidAmount, newStatus });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;