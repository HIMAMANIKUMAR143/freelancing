import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{ marginBottom: '16px' }}>
              <div className="logo-icon">S</div>
              <span className="logo-text">Step In</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '300px' }}>
              The next-generation global freelance marketplace powered by escrow protection, instant match algorithms, and transparent smart contracts.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>For Clients</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/post-project" style={{ color: 'var(--text-muted)' }}>Post a Project</Link></li>
              <li><Link to="/marketplace" style={{ color: 'var(--text-muted)' }}>Find Global Talent</Link></li>
              <li><Link to="/wallet" style={{ color: 'var(--text-muted)' }}>Escrow Guarantee</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>For Freelancers</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/marketplace" style={{ color: 'var(--text-muted)' }}>Browse Remote Jobs</Link></li>
              <li><Link to="/proposals" style={{ color: 'var(--text-muted)' }}>Submit Proposals</Link></li>
              <li><Link to="/dashboard" style={{ color: 'var(--text-muted)' }}>My Contracts</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/admin" style={{ color: 'var(--text-muted)' }}>Admin Center</Link></li>
              <li><Link to="/chat" style={{ color: 'var(--text-muted)' }}>Real-Time Chat</Link></li>
              <li><a href="http://localhost:3000/api/health" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>API Status</a></li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
          &copy; {new Date().getFullYear()} Step In Inc. All Rights Reserved. Protected by Step In Escrow.
        </div>
      </div>
    </footer>
  );
};
