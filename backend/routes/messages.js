const express = require('express');
const router = express.Router();
const db = require('../../database/db');
const { authenticate } = require('../middleware/auth');

// Get active conversation threads for current user
router.get('/conversations', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const threads = await db.all(`
      SELECT DISTINCT 
        CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as other_user_id,
        project_id
      FROM messages
      WHERE sender_id = ? OR receiver_id = ?
    `, [userId, userId, userId]);

    const result = [];
    for (const t of threads) {
      const other = await db.get('SELECT id, name, avatar, role FROM users WHERE id = ?', [t.other_user_id]);
      const lastMsg = await db.get(`
        SELECT content, created_at, attachment_name FROM messages
        WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
        ORDER BY created_at DESC LIMIT 1
      `, [userId, t.other_user_id, t.other_user_id, userId]);

      if (other && lastMsg) {
        result.push({
          partner: other,
          lastMessage: lastMsg.content,
          attachmentName: lastMsg.attachment_name,
          timestamp: lastMsg.created_at,
          projectId: t.project_id
        });
      }
    }

    res.json({ conversations: result });
  } catch (err) {
    next(err);
  }
});

// Get messages with a specific partner user
router.get('/thread/:partnerId', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const partnerId = req.params.partnerId;

    const messages = await db.all(`
      SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC
    `, [userId, partnerId, partnerId, userId]);

    const partner = await db.get('SELECT id, name, avatar, role, bio FROM users WHERE id = ?', [partnerId]);

    res.json({ partner, messages });
  } catch (err) {
    next(err);
  }
});

// Send message to partner
router.post('/send', authenticate, async (req, res, next) => {
  try {
    const { receiver_id, content, project_id, attachment_name, attachment_url } = req.body;

    if (!receiver_id || (!content && !attachment_name)) {
      return res.status(400).json({ error: 'Receiver ID and message content required.' });
    }

    const msgId = 'msg_' + Date.now();
    await db.run(
      'INSERT INTO messages (id, project_id, sender_id, receiver_id, content, attachment_name, attachment_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [msgId, project_id || null, req.user.id, receiver_id, content || '', attachment_name || null, attachment_url || null]
    );

    // Notify receiver
    await db.run('INSERT INTO notifications (id, user_id, title, message, link) VALUES (?, ?, ?, ?, ?)', [
      'notif_' + Date.now(), receiver_id, 'New Message', `${req.user.name}: "${(content || 'Attachment').slice(0, 40)}..."`, '#chat'
    ]);

    const insertedMsg = await db.get('SELECT m.*, u.name as sender_name, u.avatar as sender_avatar FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.id = ?', [msgId]);

    res.status(201).json({ success: true, message: insertedMsg });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
