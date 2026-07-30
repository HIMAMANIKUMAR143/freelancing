import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut, ShieldCheck, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { currentUser, theme, toggleTheme, signOut, openAuthModal } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container nav-wrapper">
        {/* Logo - Single Line Layout */}
        <div className="logo" onClick={() => navigate('/')}>
          <div className="logo-icon">S</div>
          <span className="logo-text">Step In</span>
        </div>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li><NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink></li>
          <li><NavLink to="/marketplace" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Find Work</NavLink></li>
          <li><NavLink to="/post-project" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Post a Job</NavLink></li>
          <li><NavLink to="/proposals" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Proposals</NavLink></li>
          <li><NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink></li>
          <li><NavLink to="/wallet" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Wallet & Escrow</NavLink></li>
          <li><NavLink to="/chat" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Messages</NavLink></li>
          <li><NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Admin</NavLink></li>
        </ul>

        {/* Right Side Actions */}
        <div className="nav-actions">
          {/* Theme Toggle */}
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Dynamic Profile Badge / Auth Buttons */}
          {currentUser ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '4px 12px 4px 6px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)'
            }}>
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                alt={currentUser.name}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div
                style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                onClick={() => navigate('/dashboard')}
              >
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {currentUser.role}
                </span>
              </div>
              <button
                className="btn btn-sm btn-secondary"
                style={{ padding: '4px 10px', fontSize: '11px', borderRadius: 'var(--radius-full)' }}
                onClick={signOut}
                title="Sign Out"
              >
                <LogOut size={12} />
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                className="btn btn-sm btn-secondary"
                style={{ borderRadius: 'var(--radius-full)', padding: '7px 16px', fontSize: '13px' }}
                onClick={() => openAuthModal('login')}
              >
                Sign In
              </button>
              <button
                className="btn btn-sm btn-primary"
                style={{ borderRadius: 'var(--radius-full)', padding: '7px 18px', fontSize: '13px' }}
                onClick={() => openAuthModal('register')}
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
