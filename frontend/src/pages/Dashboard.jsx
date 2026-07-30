import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CheckCircle2, DollarSign, Clock, FileText } from 'lucide-react';

export const Dashboard = () => {
  const { currentUser, openAuthModal, showToast } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContracts = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contracts', {
        headers: { 'x-demo-user-id': currentUser.id }
      });
      const data = await res.json();
      if (res.ok) {
        setContracts(data.contracts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [currentUser]);

  const handleReleaseMilestone = async (milestoneId) => {
    try {
      const res = await fetch(`/api/contracts/milestones/${milestoneId}/release`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-user-id': currentUser.id
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to release milestone payment');

      showToast(data.message || 'Milestone funds released to freelancer wallet!', 'success');
      fetchContracts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (!currentUser) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px', maxWidth: '600px', margin: '40px auto' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
        <h2 style={{ fontSize: '26px' }}>Account Required</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>Please sign in to view your dashboard contracts and active milestones.</p>
        <button className="btn btn-primary" onClick={() => openAuthModal('register')}>Sign In / Create Account</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Profile Card */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
            alt={currentUser.name}
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <h2 style={{ fontSize: '24px' }}>Welcome back, {currentUser.name}!</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '2px' }}>
              {currentUser.role.toUpperCase()} • 📍 {currentUser.location || 'Global'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Wallet Balance</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              ${Number(currentUser.wallet?.balance || 0).toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Escrow Hold</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-blue)' }}>
              ${Number(currentUser.wallet?.escrow_hold || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Contracts Section */}
      <div>
        <h3 style={{ fontSize: '22px', marginBottom: '16px' }}>Active Contracts & Escrow Milestones</h3>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px' }}>Loading contracts...</div>
        ) : contracts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
            <h3>No active contracts</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Accepted proposals and locked escrow contracts will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {contracts.map(c => (
              <div key={c.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '20px', color: 'var(--text-primary)' }}>{c.project_title}</h4>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Client: <strong>{c.client_name}</strong> • Freelancer: <strong>{c.freelancer_name}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      Total: ${Number(c.total_amount).toLocaleString()}
                    </div>
                    <span className="badge badge-emerald">ESCROW ACTIVE</span>
                  </div>
                </div>

                {/* Milestones List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Milestones Breakdown</div>
                  
                  {c.milestones && c.milestones.map(m => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Due: {m.due_date}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>${Number(m.amount).toLocaleString()}</span>
                        {m.status === 'paid' ? (
                          <span className="badge badge-emerald"><CheckCircle2 size={12} /> PAID</span>
                        ) : currentUser.role === 'client' ? (
                          <button className="btn btn-sm btn-emerald" onClick={() => handleReleaseMilestone(m.id)}>
                            <ShieldCheck size={14} /> Release Payment
                          </button>
                        ) : (
                          <span className="badge badge-amber"><Clock size={12} /> IN ESCROW</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
