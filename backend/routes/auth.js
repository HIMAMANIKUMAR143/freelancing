const express = require('express');
const router = express.Router();
const db = require('../../database/db');
const { authenticate } = require('../middleware/auth');

// Get current logged-in user profile with role metadata
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = req.user;
    let extra = {};

    if (user.role === 'client') {
      extra = await db.get('SELECT * FROM clients WHERE user_id = ?', [user.id]);
    } else if (user.role === 'freelancer') {
      extra = await db.get('SELECT * FROM freelancers WHERE user_id = ?', [user.id]);
      const skills = await db.all('SELECT skill_name FROM freelancer_skills WHERE freelancer_id = ?', [user.id]);
      extra.skills = skills.map(s => s.skill_name);
    }

    const wallet = await db.get('SELECT balance, escrow_hold FROM wallet WHERE user_id = ?', [user.id]);

    res.json({
      user: {
        ...user,
        ...extra,
        wallet: wallet || { balance: 0, escrow_hold: 0 }
      }
    });
  } catch (err) {
    next(err);
  }
});

// Demo quick role switcher for testing all personas instantly
router.get('/demo-users', async (req, res, next) => {
  try {
    const users = await db.all('SELECT id, name, email, role, avatar, bio FROM users ORDER BY role DESC');
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

// Login endpoint by email
router.post('/login', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email address is required' });

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email. Please create an account.' });
    }

    res.json({ success: true, message: `Welcome back, ${user.name}!`, user });
  } catch (err) {
    next(err);
  }
});

// Register new account (Client or Freelancer)
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, role, location, company_name, title, hourly_rate } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email, and role (client or freelancer) are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await db.get('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' });
    }

    const userId = 'user_' + Date.now();
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    await db.run(
      'INSERT INTO users (id, name, email, role, avatar, bio, location, verified) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
      [userId, name, cleanEmail, role, avatar, `${role.toUpperCase()} on Step In Platform`, location || 'Remote / Global']
    );

    if (role === 'client') {
      await db.run('INSERT INTO clients (user_id, company_name, company_website, industry, total_spent, jobs_posted) VALUES (?, ?, ?, ?, 0, 0)', [
        userId, company_name || `${name} Corp`, '', 'Technology'
      ]);
      await db.run('INSERT INTO wallet (user_id, balance, escrow_hold) VALUES (?, 1000.00, 0)', [userId]);
    } else {
      await db.run('INSERT INTO freelancers (user_id, title, hourly_rate, availability, total_earned, jobs_completed, rating, overview) VALUES (?, ?, ?, ?, 0, 0, 5.0, ?)', [
        userId, title || 'Software Specialist', Number(hourly_rate || 50), 'Full-time', 'Experienced freelance professional.'
      ]);
      await db.run('INSERT INTO wallet (user_id, balance, escrow_hold) VALUES (?, 0, 0)', [userId]);
    }

    const newUser = await db.get('SELECT * FROM users WHERE id = ?', [userId]);

    res.status(201).json({ success: true, message: 'Account created successfully! Welcome to Step In.', user: newUser });
  } catch (err) {
    next(err);
  }
});

// Update profile endpoint
router.post('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, bio, location, title, hourly_rate } = req.body;
    await db.run('UPDATE users SET name = ?, bio = ?, location = ? WHERE id = ?', [name, bio, location, req.user.id]);

    if (req.user.role === 'freelancer') {
      await db.run('UPDATE freelancers SET title = ?, hourly_rate = ? WHERE user_id = ?', [title, hourly_rate, req.user.id]);
    }

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
