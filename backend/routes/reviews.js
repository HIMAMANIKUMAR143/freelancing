const express = require('express');
const router = express.Router();
const db = require('../../database/db');
const { authenticate } = require('../middleware/auth');

// Create review for completed contract
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { contract_id, reviewee_id, rating, feedback } = req.body;

    if (!contract_id || !reviewee_id || !rating || !feedback) {
      return res.status(400).json({ error: 'All review fields are required.' });
    }

    const reviewId = 'rev_' + Date.now();
    await db.run(
      'INSERT INTO reviews (id, contract_id, reviewer_id, reviewee_id, rating, feedback) VALUES (?, ?, ?, ?, ?, ?)',
      [reviewId, contract_id, req.user.id, reviewee_id, Number(rating), feedback]
    );

    // Recalculate rating average for reviewee if freelancer
    const avg = await db.get('SELECT AVG(rating) as avg_rating FROM reviews WHERE reviewee_id = ?', [reviewee_id]);
    if (avg && avg.avg_rating) {
      await db.run('UPDATE freelancers SET rating = ? WHERE user_id = ?', [parseFloat(avg.avg_rating.toFixed(2)), reviewee_id]);
    }

    res.status(201).json({ success: true, message: 'Review submitted successfully!' });
  } catch (err) {
    next(err);
  }
});

// Get reviews for a user
router.get('/user/:userId', async (req, res, next) => {
  try {
    const reviews = await db.all(`
      SELECT r.*, u.name as reviewer_name, u.avatar as reviewer_avatar
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.reviewee_id = ?
      ORDER BY r.created_at DESC
    `, [req.params.userId]);

    res.json({ reviews });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
