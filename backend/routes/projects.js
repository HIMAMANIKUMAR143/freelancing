const express = require('express');
const router = express.Router();
const db = require('../../database/db');
const { authenticate, authorize } = require('../middleware/auth');

// Get all projects with Meilisearch-style instant search, filters, and skill matching
router.get('/', async (req, res, next) => {
  try {
    const { q, category, type, minBudget, maxBudget, skill, level, locationType } = req.query;

    let sql = `
      SELECT p.*, u.name as client_name, u.avatar as client_avatar, u.location as client_location, c.company_name, c.total_spent as client_total_spent,
      (SELECT COUNT(*) FROM proposals pr WHERE pr.project_id = p.id) as proposal_count
      FROM projects p
      JOIN users u ON p.client_id = u.id
      JOIN clients c ON u.id = c.user_id
      WHERE p.status != 'closed'
    `;

    const params = [];

    if (q) {
      sql += ` AND (p.title LIKE ? OR p.description LIKE ? OR p.category LIKE ? OR p.location_name LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (category && category !== 'All') {
      sql += ` AND p.category = ?`;
      params.push(category);
    }

    if (type && type !== 'All') {
      sql += ` AND p.project_type = ?`;
      params.push(type.toLowerCase());
    }

    if (locationType && locationType !== 'All') {
      sql += ` AND p.location_type = ?`;
      params.push(locationType);
    }

    if (minBudget) {
      sql += ` AND p.budget >= ?`;
      params.push(Number(minBudget));
    }

    if (maxBudget) {
      sql += ` AND p.budget <= ?`;
      params.push(Number(maxBudget));
    }

    if (level && level !== 'All') {
      sql += ` AND p.experience_level = ?`;
      params.push(level);
    }

    sql += ` ORDER BY p.created_at DESC`;

    const projects = await db.all(sql, params);

    // Attach required skills for each project
    for (const proj of projects) {
      const skills = await db.all('SELECT skill_name FROM project_skills WHERE project_id = ?', [proj.id]);
      proj.skills = skills.map(s => s.skill_name);
    }

    // Filter by specific skill if requested
    let result = projects;
    if (skill) {
      result = projects.filter(p => p.skills.some(s => s.toLowerCase().includes(skill.toLowerCase())));
    }

    res.json({ count: result.length, projects: result });
  } catch (err) {
    next(err);
  }
});

// Auto-complete suggestion endpoint
router.get('/suggestions', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json({ suggestions: [] });

    const titles = await db.all('SELECT DISTINCT title FROM projects WHERE title LIKE ? LIMIT 5', [`%${q}%`]);
    const skills = await db.all('SELECT DISTINCT skill_name FROM project_skills WHERE skill_name LIKE ? LIMIT 5', [`%${q}%`]);

    res.json({
      suggestions: [
        ...titles.map(t => ({ type: 'project', label: t.title })),
        ...skills.map(s => ({ type: 'skill', label: s.skill_name }))
      ]
    });
  } catch (err) {
    next(err);
  }
});

// Get project details by ID
router.get('/:id', async (req, res, next) => {
  try {
    const proj = await db.get(`
      SELECT p.*, u.name as client_name, u.avatar as client_avatar, u.location as client_location, c.company_name, c.total_spent as client_spent, c.jobs_posted
      FROM projects p
      JOIN users u ON p.client_id = u.id
      JOIN clients c ON u.id = c.user_id
      WHERE p.id = ?
    `, [req.params.id]);

    if (!proj) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const skills = await db.all('SELECT skill_name FROM project_skills WHERE project_id = ?', [proj.id]);
    proj.skills = skills.map(s => s.skill_name);

    const proposalCount = await db.get('SELECT COUNT(*) as count FROM proposals WHERE project_id = ?', [proj.id]);
    proj.proposal_count = proposalCount ? proposalCount.count : 0;

    res.json({ project: proj });
  } catch (err) {
    next(err);
  }
});

// Post a new project (Client only)
router.post('/', authenticate, authorize('client'), async (req, res, next) => {
  try {
    const { title, category, description, project_type, budget, duration, experience_level, location_type, location_name, skills } = req.body;

    if (!title || !category || !description || !budget) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const projectId = 'proj_' + Date.now();

    await db.run(
      'INSERT INTO projects (id, client_id, title, category, description, project_type, budget, duration, experience_level, location_type, location_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [projectId, req.user.id, title, category, description, project_type || 'fixed', Number(budget), duration || '1 to 3 months', experience_level || 'Intermediate', location_type || 'Remote', location_name || 'Global', 'open']
    );

    if (skills && Array.isArray(skills)) {
      for (const sk of skills) {
        await db.run('INSERT INTO project_skills (project_id, skill_name) VALUES (?, ?)', [projectId, sk]);
      }
    }

    // Increment client's jobs_posted count
    await db.run('UPDATE clients SET jobs_posted = jobs_posted + 1 WHERE user_id = ?', [req.user.id]);

    // Create notification
    await db.run('INSERT INTO notifications (id, user_id, title, message, link) VALUES (?, ?, ?, ?, ?)', [
      'notif_' + Date.now(), req.user.id, 'Project Published!', `Your job "${title}" is live on the marketplace.`, '#marketplace'
    ]);

    res.status(201).json({ success: true, projectId, message: 'Project published successfully!' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
