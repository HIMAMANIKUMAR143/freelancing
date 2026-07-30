const express = require('express');
const router = express.Router();
const db = require('../../database/db');
const { authenticate, authorize } = require('../middleware/auth');

// Get overall platform analytics for Admin Dashboard
router.get('/stats', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const totalUsers = await db.get('SELECT COUNT(*) as count FROM users');
    const totalClients = await db.get("SELECT COUNT(*) as count FROM users WHERE role = 'client'");
    const totalFreelancers = await db.get("SELECT COUNT(*) as count FROM users WHERE role = 'freelancer'");

    const totalProjects = await db.get('SELECT COUNT(*) as count FROM projects');
    const activeContracts = await db.get("SELECT COUNT(*) as count FROM contracts WHERE status = 'active'");

    const volume = await db.get("SELECT SUM(amount) as total FROM transactions WHERE type IN ('escrow_release', 'deposit')");
    const escrowHold = await db.get('SELECT SUM(escrow_hold) as total FROM wallet');

    const usersList = await db.all('SELECT id, name, email, role, status, verified, created_at FROM users ORDER BY created_at DESC');
    const projectsList = await db.all('SELECT p.*, u.name as client_name FROM projects p JOIN users u ON p.client_id = u.id ORDER BY p.created_at DESC');

    res.json({
      stats: {
        totalUsers: totalUsers.count,
        totalClients: totalClients.count,
        totalFreelancers: totalFreelancers.count,
        totalProjects: totalProjects.count,
        activeContracts: activeContracts.count,
        totalVolume: volume ? volume.total || 0 : 0,
        escrowHold: escrowHold ? escrowHold.total || 0 : 0
      },
      users: usersList,
      projects: projectsList
    });
  } catch (err) {
    next(err);
  }
});

// Toggle user verification or account status
router.post('/users/:id/toggle-status', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { status } = req.body; // 'active' or 'suspended'
    await db.run('UPDATE users SET status = ? WHERE id = ?', [status, req.params.id]);

    await db.run('INSERT INTO audit_logs (user_id, action, ip_address) VALUES (?, ?, ?)', [
      req.user.id, `Admin changed user ${req.params.id} status to ${status}`, req.ip
    ]);

    res.json({ success: true, message: `User status changed to ${status}` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
