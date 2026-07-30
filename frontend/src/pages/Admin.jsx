import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Users, Briefcase, DollarSign, Lock } from 'lucide-react';

export const Admin = () => {
  const { currentUser, openAuthModal, showToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminStats = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-demo-user-id': currentUser.id }
      });
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, [currentUser]);

  const handleToggleUserStatus = async (userId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-user-id': currentUser.id
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to toggle user status');

      showToast(data.message || 'User status updated', 'success');
      fetchAdminStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (!currentUser) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px', maxWidth: '600px', margin: '40px auto' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
        <h2 style={{ fontSize: '26px' }}>Account Required</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>Please sign in to access the Step In Admin Center.</p>
        <button className="btn btn-primary" onClick={() => openAuthModal('register')}>Sign In / Create Account</button>
      </div>
    );
  }

  if (currentUser.role !== 'admin') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px', maxWidth: '600px', margin: '40px auto' }}>
        <h3>Admin Account Required</h3>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>Managing platform users and analytics requires an Admin persona.</p>
        <button className="btn btn-primary" onClick={() => openAuthModal('register')}>Switch to Admin Persona</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <h2 style={{ fontSize: '28px' }}>Step In Administration & Governance</h2>
        <p style={{ color: 'var(--text-muted)' }}>Monitor marketplace metrics, escrow transaction volume, user verifications, and compliance.</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Platform Users</div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--accent-blue)', marginTop: '8px' }}>
            {stats?.stats?.totalUsers || 0}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Active Projects</div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--accent-emerald)', marginTop: '8px' }}>
            {stats?.stats?.activeProjects || 0}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Active Contracts</div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--accent-cyan)', marginTop: '8px' }}>
            {stats?.stats?.activeContracts || 0}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Escrow Volume</div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--accent-indigo)', marginTop: '8px' }}>
            ${Number(stats?.stats?.totalEscrowVolume || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* User Moderation Table */}
      <div>
        <h3 style={{ fontSize: '22px', marginBottom: '16px' }}>User Moderation & Account Controls</h3>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '32px' }}>Loading platform users...</div>
        ) : !stats?.users || stats.users.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '32px' }}>No user accounts found.</div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '16px 24px' }}>USER</th>
                  <th style={{ padding: '16px 24px' }}>EMAIL</th>
                  <th style={{ padding: '16px 24px' }}>ROLE</th>
                  <th style={{ padding: '16px 24px' }}>LOCATION</th>
                  <th style={{ padding: '16px 24px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {stats.users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={u.avatar} alt={u.name} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {u.id}</div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-purple' : u.role === 'client' ? 'badge-blue' : 'badge-emerald'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{u.location}</td>
                    <td style={{ padding: '16px 24px' }}>
                      {u.verified ? (
                        <span className="badge badge-emerald"><ShieldCheck size={12} /> VERIFIED</span>
                      ) : (
                        <button className="btn btn-sm btn-secondary" onClick={() => handleToggleUserStatus(u.id, 'verified')}>
                          Verify User
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
