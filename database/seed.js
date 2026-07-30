const db = require('./db');

async function seedData() {
  console.log('Seeding Step In database with rich demo data...');

  try {
    // Clear existing tables
    await db.run('DELETE FROM audit_logs');
    await db.run('DELETE FROM support_tickets');
    await db.run('DELETE FROM notifications');
    await db.run('DELETE FROM reviews');
    await db.run('DELETE FROM messages');
    await db.run('DELETE FROM transactions');
    await db.run('DELETE FROM wallet');
    await db.run('DELETE FROM milestones');
    await db.run('DELETE FROM contracts');
    await db.run('DELETE FROM proposals');
    await db.run('DELETE FROM project_skills');
    await db.run('DELETE FROM projects');
    await db.run('DELETE FROM freelancer_skills');
    await db.run('DELETE FROM freelancers');
    await db.run('DELETE FROM clients');
    await db.run('DELETE FROM users');

    // 1. Users
    const users = [
      { id: 'user_c1', name: 'Elena Vance', email: 'elena@techcorp.io', role: 'client', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', bio: 'VP of Product at TechCorp Labs.', location: 'San Francisco, CA' },
      { id: 'user_c2', name: 'Marcus Brody', email: 'marcus@novafin.com', role: 'client', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', bio: 'Founder & CEO at Nova Financial.', location: 'New York, NY' },
      { id: 'user_f1', name: 'Alex Rivera', email: 'alex@riveracode.dev', role: 'freelancer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', bio: 'Senior Full-Stack & AI Architect. 8+ yrs building scalable apps.', location: 'Austin, TX' },
      { id: 'user_f2', name: 'Sophia Chen', email: 'sophia@chendesign.io', role: 'freelancer', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', bio: 'Award-winning UI/UX & Design Systems Specialist.', location: 'Seattle, WA' },
      { id: 'user_f3', name: 'David Miller', email: 'david@cloudops.net', role: 'freelancer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', bio: 'DevOps Architect & Kubernetes Security Specialist.', location: 'Chicago, IL' },
      { id: 'user_admin', name: 'Step In Admin', email: 'admin@stepin.io', role: 'admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', bio: 'Platform Lead & Trust & Safety.', location: 'Global HQ' }
    ];

    for (const u of users) {
      await db.run(
        'INSERT INTO users (id, name, email, role, avatar, bio, location, verified) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
        [u.id, u.name, u.email, u.role, u.avatar, u.bio, u.location]
      );
    }

    // 2. Clients
    await db.run('INSERT INTO clients (user_id, company_name, company_website, industry, total_spent, jobs_posted) VALUES (?, ?, ?, ?, ?, ?)', ['user_c1', 'TechCorp Labs', 'https://techcorp.io', 'AI & Enterprise Software', 42500, 8]);
    await db.run('INSERT INTO clients (user_id, company_name, company_website, industry, total_spent, jobs_posted) VALUES (?, ?, ?, ?, ?, ?)', ['user_c2', 'Nova Financial', 'https://novafin.com', 'FinTech & Blockchain', 18200, 4]);

    // 3. Freelancers
    await db.run('INSERT INTO freelancers (user_id, title, hourly_rate, availability, total_earned, jobs_completed, rating, overview, resume_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      'user_f1', 'Senior Full-Stack & AI Engineer', 95.00, 'Full-time (40 hrs/wk)', 68400, 24, 4.98, 'Specialized in Next.js, Node.js, Python AI Agents, PostgreSQL, and high-concurrency microservices.', 'https://riveracode.dev/resume.pdf'
    ]);
    await db.run('INSERT INTO freelancers (user_id, title, hourly_rate, availability, total_earned, jobs_completed, rating, overview, resume_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      'user_f2', 'Lead UI/UX & Product Designer', 85.00, 'Part-time (20 hrs/wk)', 54200, 19, 5.00, 'Crafting Apple-level design systems, Figma component libraries, and ultra-smooth fluid Web UI animations.', 'https://chendesign.io/portfolio.pdf'
    ]);
    await db.run('INSERT INTO freelancers (user_id, title, hourly_rate, availability, total_earned, jobs_completed, rating, overview, resume_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      'user_f3', 'DevOps & Cloud Security Architect', 110.00, 'As Needed', 89000, 31, 4.95, 'AWS Certified Solutions Architect, Terraform infrastructure automation, CI/CD pipelines, and Zero-Trust cloud security.', 'https://cloudops.net/resume.pdf'
    ]);

    // Freelancer Skills
    const fSkills = [
      { id: 'user_f1', skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'AI/LLM'] },
      { id: 'user_f2', skills: ['UI/UX Design', 'Figma', 'Design Systems', 'CSS3/Animations', 'Tailwind', 'Prototyping'] },
      { id: 'user_f3', skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Security Audit'] }
    ];
    for (const item of fSkills) {
      for (const sk of item.skills) {
        await db.run('INSERT INTO freelancer_skills (freelancer_id, skill_name) VALUES (?, ?)', [item.id, sk]);
      }
    }

    // 4. Projects
    const projects = [
      {
        id: 'proj_1',
        client_id: 'user_c1',
        title: 'Next-Gen AI Analytics Dashboard with Real-Time Streaming',
        category: 'Web Development',
        description: 'We are seeking an expert Full-Stack Engineer to build our enterprise AI Analytics Dashboard. The system requires real-time data streaming, interactive data visualization widgets, high-performance API endpoints, and clean dark-mode UI aesthetics.',
        project_type: 'fixed',
        budget: 6500.00,
        duration: '1 to 3 months',
        experience_level: 'Expert',
        location_type: 'Remote',
        location_name: 'Global / Remote',
        status: 'open',
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AI/LLM']
      },
      {
        id: 'proj_2',
        client_id: 'user_c1',
        title: 'Complete Brand Identity & Design System for Web3 Platform',
        category: 'Design & Creative',
        description: 'Looking for a world-class Product Designer to overhaul our entire Web3 application design system. Must deliver comprehensive Figma component libraries, responsive design layouts, custom icon set, and interaction guidelines.',
        project_type: 'fixed',
        budget: 4200.00,
        duration: 'Less than 1 month',
        experience_level: 'Expert',
        location_type: 'Hybrid',
        location_name: 'San Francisco, CA (Hybrid 2 days/wk)',
        status: 'in_progress',
        skills: ['UI/UX Design', 'Figma', 'Design Systems', 'Prototyping']
      },
      {
        id: 'proj_3',
        client_id: 'user_c2',
        title: 'AWS Cloud Infrastructure Automation & Terraform CI/CD',
        category: 'DevOps & Cloud',
        description: 'Migration of our fintech backend to AWS ECS & EKS with complete Terraform IaC scripts, zero-downtime blue/green deployment pipelines, and SOC2 compliance monitoring tools.',
        project_type: 'hourly',
        budget: 110.00,
        duration: '3 to 6 months',
        experience_level: 'Expert',
        location_type: 'Remote',
        location_name: 'Global / Remote',
        status: 'open',
        skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD']
      },
      {
        id: 'proj_4',
        client_id: 'user_c2',
        title: 'High-Frequency Algorithmic Trading API & Microservices',
        category: 'Web Development',
        description: 'Build robust low-latency WebSocket microservices in Node.js and Rust to stream crypto market orders with sub-10ms response times.',
        project_type: 'fixed',
        budget: 8500.00,
        duration: '1 to 3 months',
        experience_level: 'Expert',
        location_type: 'In-Office',
        location_name: 'New York, NY (In-Office HQ)',
        status: 'open',
        skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Security Audit']
      },
      {
        id: 'proj_5',
        client_id: 'user_c1',
        title: 'FinTech Mobile App UI Design & iOS Prototyping',
        category: 'Design & Creative',
        description: 'We need an experienced Mobile Product Designer to create intuitive wallet screens, transaction flow diagrams, and iOS Figma components for our European fintech launch.',
        project_type: 'fixed',
        budget: 5200.00,
        duration: '1 to 2 months',
        experience_level: 'Intermediate',
        location_type: 'Hybrid',
        location_name: 'London, UK (Hybrid Tech Hub)',
        status: 'open',
        skills: ['UI/UX Design', 'Figma', 'Prototyping']
      }
    ];

    for (const p of projects) {
      await db.run(
        'INSERT INTO projects (id, client_id, title, category, description, project_type, budget, duration, experience_level, location_type, location_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [p.id, p.client_id, p.title, p.category, p.description, p.project_type, p.budget, p.duration, p.experience_level, p.location_type || 'Remote', p.location_name || 'Global', p.status]
      );
      for (const sk of p.skills) {
        await db.run('INSERT INTO project_skills (project_id, skill_name) VALUES (?, ?)', [p.id, sk]);
      }
    }

    // 5. Proposals
    await db.run(
      'INSERT INTO proposals (id, project_id, freelancer_id, cover_letter, bid_amount, estimated_duration, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        'prop_1',
        'proj_1',
        'user_f1',
        'Hi Elena! I read your project requirements with great excitement. Having built 15+ real-time streaming dashboards using Next.js and WebSockets, I can guarantee 60fps performance and pixel-perfect dark-mode aesthetics. My architecture plan includes modular state management, optimized charts, and clean REST APIs.',
        6200.00,
        '4 weeks',
        'shortlisted'
      ]
    );

    await db.run(
      'INSERT INTO proposals (id, project_id, freelancer_id, cover_letter, bid_amount, estimated_duration, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        'prop_2',
        'proj_2',
        'user_f2',
        'Hello Elena! I specialize in building linear-quality design systems in Figma and translating them into pristine code. I will deliver full component tokens, typography rules, dark/light variations, and micro-interaction prototypes.',
        4200.00,
        '3 weeks',
        'accepted'
      ]
    );

    // 6. Contracts & Milestones
    await db.run(
      'INSERT INTO contracts (id, project_id, proposal_id, client_id, freelancer_id, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['contract_1', 'proj_2', 'prop_2', 'user_c1', 'user_f2', 4200.00, 'active']
    );

    await db.run(
      'INSERT INTO milestones (id, contract_id, title, amount, due_date, status, funded_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      ['ms_1', 'contract_1', 'Milestone 1: Design System Core & Figma Tokens', 2100.00, '2026-08-10', 'funded_escrow']
    );
    await db.run(
      'INSERT INTO milestones (id, contract_id, title, amount, due_date, status) VALUES (?, ?, ?, ?, ?, ?)',
      ['ms_2', 'contract_1', 'Milestone 2: Responsive Screen Layouts & Component Docs', 2100.00, '2026-08-25', 'pending']
    );

    // 7. Wallets & Transactions
    const wallets = [
      { user_id: 'user_c1', balance: 14500.00, escrow_hold: 2100.00 },
      { user_id: 'user_c2', balance: 8200.00, escrow_hold: 0 },
      { user_id: 'user_f1', balance: 4850.00, escrow_hold: 0 },
      { user_id: 'user_f2', balance: 3200.00, escrow_hold: 2100.00 },
      { user_id: 'user_f3', balance: 6700.00, escrow_hold: 0 }
    ];
    for (const w of wallets) {
      await db.run('INSERT INTO wallet (user_id, balance, escrow_hold) VALUES (?, ?, ?)', [w.user_id, w.balance, w.escrow_hold]);
    }

    await db.run('INSERT INTO transactions (id, user_id, type, amount, reference_id, description) VALUES (?, ?, ?, ?, ?, ?)', [
      'tx_1', 'user_c1', 'escrow_lock', 2100.00, 'ms_1', 'Escrow funded for Milestone 1 - Design System Core'
    ]);

    // 8. Messages
    await db.run('INSERT INTO messages (id, project_id, sender_id, receiver_id, content) VALUES (?, ?, ?, ?, ?)', [
      'msg_1', 'proj_2', 'user_c1', 'user_f2', 'Hi Sophia! We loved your portfolio and accepted your proposal for the Web3 design system. Milestone 1 ($2,100) has been funded into escrow!'
    ]);
    await db.run('INSERT INTO messages (id, project_id, sender_id, receiver_id, content) VALUES (?, ?, ?, ?, ?)', [
      'msg_2', 'proj_2', 'user_f2', 'user_c1', 'Thank you so much Elena! I have already started drafting the core tokens and typography scale in Figma. I will share the first preview link tomorrow morning!'
    ]);

    // 9. Notifications
    await db.run('INSERT INTO notifications (id, user_id, title, message, link) VALUES (?, ?, ?, ?, ?)', [
      'notif_1', 'user_f2', 'Contract Offer Accepted!', 'Elena Vance accepted your proposal and funded $2,100 into Escrow for Milestone 1.', '#chat'
    ]);
    await db.run('INSERT INTO notifications (id, user_id, title, message, link) VALUES (?, ?, ?, ?, ?)', [
      'notif_2', 'user_c1', 'New Proposal Received', 'Alex Rivera submitted a $6,200 proposal for your AI Analytics Dashboard project.', '#proposals'
    ]);

    // 10. Reviews
    await db.run('INSERT INTO reviews (id, contract_id, reviewer_id, reviewee_id, rating, feedback) VALUES (?, ?, ?, ?, ?, ?)', [
      'rev_1', 'contract_prev', 'user_c1', 'user_f1', 5, 'Alex is hands down one of the best software engineers I have ever hired. Delivered 3 days ahead of schedule with spotless code quality!'
    ]);

    console.log('Database successfully seeded with realistic sample data!');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

seedData();
