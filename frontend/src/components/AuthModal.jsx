import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Modal } from './Modal';
import { Sparkles, UserPlus, LogIn } from 'lucide-react';

export const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, authModalTab, setAuthModalTab, login, register, quickDemo, showToast } = useAuth();
  
  const [role, setRole] = useState('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [hourlyRate, setHourlyRate] = useState('85');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email) return showToast('Please enter your name and email', 'error');

    setSubmitting(true);
    try {
      await register({
        name,
        email,
        role,
        location: location || 'Global / Remote',
        company_name: companyName,
        title,
        hourly_rate: hourlyRate
      });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return showToast('Please enter your email', 'error');

    setSubmitting(true);
    try {
      await login(email);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      title={authModalTab === 'register' ? 'Create Your Step In Account' : 'Sign In to Step In'}
    >
      {/* Tab Controls */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'var(--bg-input)', padding: '4px', borderRadius: 'var(--radius-full)' }}>
        <button
          className={`role-btn ${authModalTab === 'register' ? 'active' : ''}`}
          style={{ flex: 1, padding: '10px', fontSize: '14px' }}
          onClick={() => setAuthModalTab('register')}
        >
          Create Account
        </button>
        <button
          className={`role-btn ${authModalTab === 'login' ? 'active' : ''}`}
          style={{ flex: 1, padding: '10px', fontSize: '14px' }}
          onClick={() => setAuthModalTab('login')}
        >
          Sign In
        </button>
      </div>

      {authModalTab === 'register' ? (
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>I want to *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label
                className="card"
                style={{
                  padding: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  borderColor: role === 'client' ? 'var(--accent-blue)' : 'var(--border-color)'
                }}
              >
                <input type="radio" name="authRole" value="client" checked={role === 'client'} onChange={() => setRole('client')} />
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Hire Talent (Client)</div>
              </label>
              <label
                className="card"
                style={{
                  padding: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  borderColor: role === 'freelancer' ? 'var(--accent-blue)' : 'var(--border-color)'
                }}
              >
                <input type="radio" name="authRole" value="freelancer" checked={role === 'freelancer'} onChange={() => setRole('freelancer')} />
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Work & Earn (Freelancer)</div>
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Full Name *</label>
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: '16px' }}
              placeholder="e.g. Sarah Connor"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Email Address *</label>
            <input
              type="email"
              className="search-input"
              style={{ paddingLeft: '16px' }}
              placeholder="sarah@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Location (City, Country)</label>
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: '16px' }}
              placeholder="e.g. San Francisco, USA or Remote"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>

          {role === 'client' ? (
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Company Name</label>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '16px' }}
                placeholder="e.g. Apex AI Labs"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Professional Title & Hourly Rate ($)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                <input
                  type="text"
                  className="search-input"
                  style={{ paddingLeft: '16px' }}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <input
                  type="number"
                  className="search-input"
                  style={{ paddingLeft: '16px' }}
                  value={hourlyRate}
                  onChange={e => setHourlyRate(e.target.value)}
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={submitting}>
            <UserPlus size={16} />
            {submitting ? 'Creating Account...' : 'Create Account & Sign In →'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Account Email Address *</label>
            <input
              type="email"
              className="search-input"
              style={{ paddingLeft: '16px' }}
              placeholder="elena@techcorp.io"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={submitting}>
            <LogIn size={16} />
            {submitting ? 'Signing In...' : 'Sign In to Account →'}
          </button>
        </form>
      )}

      {/* Instant 1-Click Demo Persona Switcher */}
      <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', textAlign: 'center' }}>
          ⚡ Or Instant 1-Click Demo Sign In
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button type="button" className="btn btn-sm btn-secondary" onClick={() => quickDemo('user_c1')}>Client (Elena)</button>
          <button type="button" className="btn btn-sm btn-secondary" onClick={() => quickDemo('user_f1')}>Freelancer (Alex)</button>
          <button type="button" className="btn btn-sm btn-secondary" onClick={() => quickDemo('user_admin')}>Admin</button>
        </div>
      </div>
    </Modal>
  );
};
