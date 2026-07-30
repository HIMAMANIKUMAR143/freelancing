const express = require('express');
const router = express.Router();
const db = require('../../database/db');
const { authenticate, authorize } = require('../middleware/auth');

// Get active contracts for user
router.get('/', authenticate, async (req, res, next) => {
  try {
    let sql = `
      SELECT c.*, p.title as project_title, p.category as project_category,
      uc.name as client_name, uc.avatar as client_avatar,
      uf.name as freelancer_name, uf.avatar as freelancer_avatar
      FROM contracts c
      JOIN projects p ON c.project_id = p.id
      JOIN users uc ON c.client_id = uc.id
      JOIN users uf ON c.freelancer_id = uf.id
    `;

    if (req.user.role === 'client') {
      sql += ` WHERE c.client_id = ?`;
    } else if (req.user.role === 'freelancer') {
      sql += ` WHERE c.freelancer_id = ?`;
    }

    sql += ` ORDER BY c.created_at DESC`;

    const contracts = await db.all(sql, req.user.role === 'admin' ? [] : [req.user.id]);

    for (const contract of contracts) {
      const milestones = await db.all('SELECT * FROM milestones WHERE contract_id = ?', [contract.id]);
      contract.milestones = milestones;
    }

    res.json({ contracts });
  } catch (err) {
    next(err);
  }
});

// Release payment for a milestone (Client releases escrow funds to freelancer balance)
router.post('/milestones/:id/release', authenticate, authorize('client'), async (req, res, next) => {
  try {
    const milestone = await db.get('SELECT * FROM milestones WHERE id = ?', [req.params.id]);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    if (milestone.status === 'released') {
      return res.status(400).json({ error: 'Milestone funds have already been released.' });
    }

    const contract = await db.get('SELECT * FROM contracts WHERE id = ?', [milestone.contract_id]);
    if (contract.client_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to release payment for this contract' });
    }

    const amount = milestone.amount;

    // 1. Update milestone status
    await db.run("UPDATE milestones SET status = 'released', released_at = CURRENT_TIMESTAMP WHERE id = ?", [milestone.id]);

    // 2. Transfer from Client's escrow hold to Freelancer's available balance
    await db.run('UPDATE wallet SET escrow_hold = escrow_hold - ? WHERE user_id = ?', [amount, req.user.id]);
    await db.run('UPDATE wallet SET balance = balance + ?, escrow_hold = escrow_hold - ? WHERE user_id = ?', [amount, amount, contract.freelancer_id]);

    // Update Client total_spent & Freelancer total_earned
    await db.run('UPDATE clients SET total_spent = total_spent + ? WHERE user_id = ?', [amount, req.user.id]);
    await db.run('UPDATE freelancers SET total_earned = total_earned + ?, jobs_completed = jobs_completed + 1 WHERE user_id = ?', [amount, contract.freelancer_id]);

    // 3. Record Transactions
    await db.run('INSERT INTO transactions (id, user_id, type, amount, reference_id, description) VALUES (?, ?, ?, ?, ?, ?)', [
      'tx_' + Date.now() + '_1', req.user.id, 'escrow_release', amount, milestone.id, `Payment released for "${milestone.title}"`
    ]);
    await db.run('INSERT INTO transactions (id, user_id, type, amount, reference_id, description) VALUES (?, ?, ?, ?, ?, ?)', [
      'tx_' + Date.now() + '_2', contract.freelancer_id, 'deposit', amount, milestone.id, `Funds received for "${milestone.title}"`
    ]);

    // 4. Update Contract & Project status to completed if all milestones released
    const remaining = await db.all("SELECT id FROM milestones WHERE contract_id = ? AND status != 'released'", [contract.id]);
    if (remaining.length === 0) {
      await db.run("UPDATE contracts SET status = 'completed' WHERE id = ?", [contract.id]);
      await db.run("UPDATE projects SET status = 'completed' WHERE id = ?", [contract.project_id]);
    }

    // 5. Notify Freelancer
    await db.run('INSERT INTO notifications (id, user_id, title, message, link) VALUES (?, ?, ?, ?, ?)', [
      'notif_' + Date.now(), contract.freelancer_id, 'Payment Released!', `$${amount} has been deposited into your available wallet balance for "${milestone.title}".`, '#wallet'
    ]);

    res.json({
      success: true,
      message: `$${amount} successfully released to freelancer's available wallet balance!`,
      milestoneId: milestone.id
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
