const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const projectsRoutes = require('./routes/projects');
const proposalsRoutes = require('./routes/proposals');
const contractsRoutes = require('./routes/contracts');
const walletRoutes = require('./routes/wallet');
const messagesRoutes = require('./routes/messages');
const reviewsRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middleware/error');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static frontend assets
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
const staticPath = require('fs').existsSync(distPath) ? distPath : path.join(__dirname, '..', 'frontend');
app.use(express.static(staticPath));

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), platform: 'Step In Freelance Marketplace API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/proposals', proposalsRoutes);
app.use('/api/contracts', contractsRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler
app.use(errorHandler);

// SPA Fallback
app.get('*', (req, res) => {
  const indexFile = require('fs').existsSync(path.join(distPath, 'index.html'))
    ? path.join(distPath, 'index.html')
    : path.join(__dirname, '..', 'frontend', 'index.html');
  res.sendFile(indexFile);
});

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Step In Server is running live on port ${PORT}`);
  console.log(`🌐 Application URL: http://localhost:${PORT}`);
  console.log(`====================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const ALT_PORT = Number(PORT) + 1;
    console.warn(`⚠️ Port ${PORT} is currently occupied. Attempting startup on fallback port ${ALT_PORT}...`);
    app.listen(ALT_PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 Step In Server is running live on port ${ALT_PORT}`);
      console.log(`🌐 Application URL: http://localhost:${ALT_PORT}`);
      console.log(`====================================================`);
    });
  } else {
    console.error('Server error:', err);
  }
});
