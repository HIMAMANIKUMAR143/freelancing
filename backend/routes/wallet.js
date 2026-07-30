const express = require('express');
const router = express.Router();
const db = require('../../database/db');
const { authenticate } = require('../middleware/auth');

// Get wallet info & transactions
router.get('/', authenticate, async (req, res, next) => {
  try {
    let wallet = await db.get('SELECT balance, escrow_hold FROM wallet WHERE user_id = ?', [req.user.id]);
    if (!wallet) {
      wallet = { balance: 0, escrow_hold: 0 };
    }

    const transactions = await db.all('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [req.user.id]);

    res.json({
      wallet,
      transactions
    });
  } catch (err) {
    next(err);
  }
});

// Deposit funds into client wallet
router.post('/deposit', authenticate, async (req, res, next) => {
  try {
    const { amount, paymentMethod } = req.body;
    const depositAmount = Number(amount);

    if (!depositAmount || depositAmount <= 0) {
      return res.status(400).json({ error: 'Valid deposit amount required' });
    }

    // Update wallet balance
    await db.run('UPDATE wallet SET balance = balance + ? WHERE user_id = ?', [depositAmount, req.user.id]);

    // Record transaction
    const txId = 'tx_' + Date.now();
    await db.run('INSERT INTO transactions (id, user_id, type, amount, reference_id, description) VALUES (?, ?, ?, ?, ?, ?)', [
      txId, req.user.id, 'deposit', depositAmount, 'stripe_card', `Added funds via ${paymentMethod || 'Stripe Card (**4242)'}`
    ]);

    res.json({ success: true, message: `$${depositAmount.toFixed(2)} added to wallet balance.`, txId });
  } catch (err) {
    next(err);
  }
});

// Render formatted Printable PDF/HTML Invoice
router.get('/invoice/:txId', authenticate, async (req, res, next) => {
  try {
    const tx = await db.get('SELECT * FROM transactions WHERE id = ?', [req.params.txId]);
    if (!tx) return res.status(404).send('Invoice not found');

    const user = await db.get('SELECT * FROM users WHERE id = ?', [tx.user_id]);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${tx.id} - Step In</title>
        <style>
          body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0b0f17; color: #e2e8f0; padding: 40px; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #1e293b; background: #111827; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { display: flex; justify-content: space-between; border-bottom: 1px solid #1e293b; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 800; color: #3b82f6; letter-spacing: -0.5px; }
          .badge { background: #10b98120; color: #10b981; padding: 6px 12px; border-radius: 20px; font-weight: 600; font-size: 13px; border: 1px solid #10b98140; }
          .details { margin: 30px 0; display: flex; justify-content: space-between; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { text-align: left; background: #1e293b; padding: 12px; color: #94a3b8; font-size: 13px; text-transform: uppercase; }
          td { padding: 16px 12px; border-bottom: 1px solid #1e293b; }
          .total { text-align: right; font-size: 20px; font-weight: bold; color: #10b981; margin-top: 20px; }
          .footer { text-align: center; margin-top: 40px; color: #64748b; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div>
              <div class="logo">Step In</div>
              <div style="color: #64748b; font-size: 14px; margin-top: 4px;">Official Financial Receipt</div>
            </div>
            <div>
              <span class="badge">COMPLETED & VERIFIED</span>
              <div style="color: #94a3b8; font-size: 13px; margin-top: 8px;">Date: ${new Date(tx.created_at).toLocaleDateString()}</div>
            </div>
          </div>
          <div class="details">
            <div>
              <strong>Billed To:</strong><br>
              ${user.name}<br>
              ${user.email}<br>
              ${user.location}
            </div>
            <div style="text-align: right;">
              <strong>Transaction Ref:</strong><br>
              ${tx.id}<br>
              <strong>Payment Status:</strong> Paid via Escrow Wallet
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${tx.description}</td>
                <td>${tx.type.toUpperCase()}</td>
                <td>$${tx.amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">
            Total Paid: $${tx.amount.toFixed(2)}
          </div>
          <div class="footer">
            Step In Global Escrow Platform • Secure SSL 256-Bit Encryption • Thank you for choosing Step In!
          </div>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
