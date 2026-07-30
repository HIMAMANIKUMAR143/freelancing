const express = require('express');
const router = express.Router();
const db = require('../../database/db');
const { authenticate, authorize } = require('../middleware/auth');

// Submit a proposal for a project (Freelancer only)
router.post('/', authenticate, authorize('freelancer'), async (req, res, next) => {
  try {
    const { project_id, cover_letter, bid_amount, estimated_duration } = req.body;

    if (!project_id || !cover_letter || !bid_amount) {
      return res.status(400).json({ error: 'Project ID, cover letter, and bid amount are required.' });
    }

    const project = await db.get('SELECT * FROM projects WHERE id = ?', [project_id]);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if freelancer already submitted a proposal
    const existing = await db.get('SELECT id FROM proposals WHERE project_id = ? AND freelancer_id = ?', [project_id, req.user.id]);
    if (existing) {
      return res.status(400).json({ error: 'You have already submitted a proposal for this project.' });
    }

    const proposalId = 'prop_' + Date.now();

    await db.run(
      'INSERT INTO proposals (id, project_id, freelancer_id, cover_letter, bid_amount, estimated_duration, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [proposalId, project_id, req.user.id, cover_letter, Number(bid_amount), estimated_duration || '2-4 weeks', 'submitted']
    );

    // Notify project client owner
    await db.run('INSERT INTO notifications (id, user_id, title, message, link) VALUES (?, ?, ?, ?, ?)', [
      'notif_' + Date.now(), project.client_id, 'New Proposal Received', `${req.user.name} submitted a $${bid_amount} proposal for "${project.title}".`, '#proposals'
    ]);

    res.status(201).json({ success: true, proposalId, message: 'Proposal submitted successfully!' });
  } catch (err) {
    next(err);
  }
});

// Get proposals (for client owner or submitted proposals by freelancer)
router.get('/my-proposals', authenticate, async (req, res, next) => {
  try {
    let proposals = [];
    if (req.user.role === 'freelancer') {
      proposals = await db.all(`
        SELECT pr.*, p.title as project_title, p.category as project_category, p.budget as project_budget, u.name as client_name, u.avatar as client_avatar
        FROM proposals pr
        JOIN projects p ON pr.project_id = p.id
        JOIN users u ON p.client_id = u.id
        WHERE pr.freelancer_id = ?
        ORDER BY pr.created_at DESC
      `, [req.user.id]);
    } else {
      proposals = await db.all(`
        SELECT pr.*, p.title as project_title, u.name as freelancer_name, u.avatar as freelancer_avatar, u.location as freelancer_location, f.title as freelancer_title, f.rating as freelancer_rating, f.hourly_rate
        FROM proposals pr
        JOIN projects p ON pr.project_id = p.id
        JOIN users u ON pr.freelancer_id = u.id
        JOIN freelancers f ON u.id = f.user_id
        WHERE p.client_id = ?
        ORDER BY pr.created_at DESC
      `, [req.user.id]);
    }

    res.json({ proposals });
  } catch (err) {
    next(err);
  }
});

// Shortlist, Reject, or Accept Proposal (Client only)
router.post('/:id/status', authenticate, authorize('client'), async (req, res, next) => {
  try {
    const { status } = req.body; // 'shortlisted', 'rejected', 'accepted'
    const proposal = await db.get('SELECT * FROM proposals WHERE id = ?', [req.params.id]);

    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    const project = await db.get('SELECT * FROM projects WHERE id = ?', [proposal.project_id]);
    if (project.client_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to manage proposals for this project' });
    }

    await db.run('UPDATE proposals SET status = ? WHERE id = ?', [status, proposal.id]);

    if (status === 'accepted') {
      // 1. Create Contract
      const contractId = 'contract_' + Date.now();
      await db.run(
        'INSERT INTO contracts (id, project_id, proposal_id, client_id, freelancer_id, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [contractId, project.id, proposal.id, req.user.id, proposal.freelancer_id, proposal.bid_amount, 'active']
      );

      // 2. Create Initial Milestone
      const msId = 'ms_' + Date.now();
      const msAmount = proposal.bid_amount;
      await db.run(
        'INSERT INTO milestones (id, contract_id, title, amount, due_date, status, funded_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
        [msId, contractId, 'Milestone 1: Core Project Deliverables', msAmount, proposal.estimated_duration, 'funded_escrow']
      );

      // 3. Fund Escrow (Update Wallet)
      await db.run('UPDATE wallet SET balance = balance - ?, escrow_hold = escrow_hold + ? WHERE user_id = ?', [msAmount, msAmount, req.user.id]);
      await db.run('UPDATE wallet SET escrow_hold = escrow_hold + ? WHERE user_id = ?', [msAmount, proposal.freelancer_id]);

      // Record transaction
      await db.run('INSERT INTO transactions (id, user_id, type, amount, reference_id, description) VALUES (?, ?, ?, ?, ?, ?)', [
        'tx_' + Date.now(), req.user.id, 'escrow_lock', msAmount, msId, `Escrow funded for contract #${contractId.slice(-6)}`
      ]);

      // Update project status
      await db.run("UPDATE projects SET status = 'in_progress' WHERE id = ?", [project.id]);

      // Notify Freelancer
      await db.run('INSERT INTO notifications (id, user_id, title, message, link) VALUES (?, ?, ?, ?, ?)', [
        'notif_' + Date.now(), proposal.freelancer_id, 'Proposal Accepted & Hired!', `Congratulations! ${req.user.name} accepted your proposal and funded $${msAmount} into Escrow.`, '#dashboard'
      ]);

      return res.json({ success: true, contractId, message: 'Proposal accepted, contract created, and $ ' + msAmount + ' funded into escrow!' });
    }

    res.json({ success: true, message: `Proposal status updated to ${status}` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
