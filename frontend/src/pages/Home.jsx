import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, ShieldCheck, Zap, Globe, Lock, ArrowRight, Award } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const { openAuthModal, currentUser } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', padding: '40px 0' }}>
      
      {/* Hero Banner */}
      <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: 'var(--radius-full)', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', margin: '0 auto', fontSize: '13px', fontWeight: 600, color: 'var(--accent-blue)' }}>
          <SparklesIcon /> Next-Gen Freelance & Global Remote Talent Protocol
        </div>

        <h1 style={{ fontSize: '56px', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.03em' }}>
          Where Top Talent & Visionary Companies <span className="logo-text">Step In</span>
        </h1>

        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Hire vetted full-stack engineers, AI developers, and UI/UX designers with milestone escrow protection, automated work verification, and instant global payouts.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px' }}>
          <button className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '16px' }} onClick={() => navigate('/marketplace')}>
            Explore Remote Projects <ArrowRight size={18} />
          </button>
          {!currentUser && (
            <button className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '16px' }} onClick={() => openAuthModal('register')}>
              Create Account
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--accent-blue)' }}>$4.8M+</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Escrow Secured Volume</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--accent-emerald)' }}>99.4%</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>On-Time Completion</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--accent-cyan)' }}>12,400+</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Vetted Freelancers</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--accent-indigo)' }}>150+</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Countries Represented</div>
        </div>
      </div>

      {/* Features Showcase */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px' }}>Why Leading Teams Choose Step In</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Designed for speed, security, and global collaboration.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
          <div className="card">
            <ShieldCheck size={32} color="var(--accent-emerald)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Step In Escrow Guarantee</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Client funds are safely held in escrow before work starts and automatically released as project milestones are completed and verified.
            </p>
          </div>

          <div className="card">
            <Globe size={32} color="var(--accent-blue)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Global Work Models</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Find Remote (Global), Hybrid, or In-Office jobs matching your exact location requirements and timezone preferences.
            </p>
          </div>

          <div className="card">
            <Zap size={32} color="var(--accent-cyan)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Instant Skill Search</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Search across React, Next.js, Node.js, Python, and UI/UX design tags with sub-second auto-complete indexing.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

const SparklesIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);
