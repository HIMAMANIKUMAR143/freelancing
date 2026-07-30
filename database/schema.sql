-- Step In Database Schema (PostgreSQL / SQLite compatible)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK(role IN ('client', 'freelancer', 'admin')) NOT NULL,
  avatar TEXT,
  bio TEXT,
  location TEXT,
  status TEXT DEFAULT 'active',
  verified INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
  user_id TEXT PRIMARY KEY,
  company_name TEXT,
  company_website TEXT,
  industry TEXT,
  total_spent REAL DEFAULT 0,
  jobs_posted INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS freelancers (
  user_id TEXT PRIMARY KEY,
  title TEXT,
  hourly_rate REAL DEFAULT 0,
  availability TEXT DEFAULT 'Full-time',
  total_earned REAL DEFAULT 0,
  jobs_completed INTEGER DEFAULT 0,
  rating REAL DEFAULT 5.0,
  overview TEXT,
  resume_url TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS freelancer_skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  freelancer_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  FOREIGN KEY (freelancer_id) REFERENCES freelancers(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  project_type TEXT CHECK(project_type IN ('fixed', 'hourly')) NOT NULL,
  budget REAL NOT NULL,
  duration TEXT,
  experience_level TEXT DEFAULT 'Intermediate',
  location_type TEXT CHECK(location_type IN ('Remote', 'Hybrid', 'In-Office')) DEFAULT 'Remote',
  location_name TEXT DEFAULT 'Global',
  status TEXT CHECK(status IN ('open', 'in_progress', 'completed', 'closed')) DEFAULT 'open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS project_skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS proposals (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  freelancer_id TEXT NOT NULL,
  cover_letter TEXT NOT NULL,
  bid_amount REAL NOT NULL,
  estimated_duration TEXT NOT NULL,
  status TEXT CHECK(status IN ('submitted', 'shortlisted', 'accepted', 'rejected')) DEFAULT 'submitted',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (freelancer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  proposal_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  freelancer_id TEXT NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT CHECK(status IN ('active', 'completed', 'disputed')) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (proposal_id) REFERENCES proposals(id),
  FOREIGN KEY (client_id) REFERENCES users(id),
  FOREIGN KEY (freelancer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL,
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  due_date TEXT,
  status TEXT CHECK(status IN ('pending', 'funded_escrow', 'released', 'revision_requested')) DEFAULT 'pending',
  funded_at DATETIME,
  released_at DATETIME,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wallet (
  user_id TEXT PRIMARY KEY,
  balance REAL DEFAULT 0,
  escrow_hold REAL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT CHECK(type IN ('deposit', 'escrow_lock', 'escrow_release', 'withdrawal', 'fee')) NOT NULL,
  amount REAL NOT NULL,
  reference_id TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  content TEXT NOT NULL,
  attachment_name TEXT,
  attachment_url TEXT,
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL,
  reviewer_id TEXT NOT NULL,
  reviewee_id TEXT NOT NULL,
  rating INTEGER CHECK(rating >= 1 AND rating <= 5) NOT NULL,
  feedback TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES contracts(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id),
  FOREIGN KEY (reviewee_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  issue_type TEXT DEFAULT 'General',
  priority TEXT DEFAULT 'Medium',
  status TEXT DEFAULT 'open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  action TEXT NOT NULL,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
