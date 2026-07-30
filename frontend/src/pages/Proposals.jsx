import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

export const Proposals = () => {
  const { currentUser, openAuthModal, showToast } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch('/api/proposals/my-proposals', {
        headers: { 'x-demo-user-id': currentUser.id }
      });
      const data = await res.json();
      if (res.ok) {
        setProposals(data.proposals || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [currentUser]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/proposals/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-user-id': currentUser.id
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update proposal status');

      showToast(data.message || `Proposal ${status}! Escrow locked.`, 'success');
      fetchProposals();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (!currentUser) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px', maxWidth: '600px', margin: '40px auto' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
        <h2 style={{ fontSize: '26px' }}>Account Required</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>Please sign in to view your proposals and active offers.</p>
        <button className="btn btn-primary" onClick={() => openAuthModal('register')}>Sign In / Create Account</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '28px' }}>
            {currentUser.role === 'client' ? 'Received Job Proposals & Escrow Offers' : 'My Submitted Job Proposals'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {currentUser.role === 'client'
              ? 'Review candidate applications, compare rates, and accept proposals to lock funds into Step In Escrow.'
              : 'Track proposal submission status, client responses, and accepted contract agreements.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>Loading proposals...</div>
      ) : proposals.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <h3>No proposals found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            {currentUser.role === 'client'
              ? 'No proposals submitted for your posted projects yet.'
              : 'You have not submitted proposals for any marketplace jobs yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {proposals.map(pr => (
            <div key={pr.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '20px', color: 'var(--text-primary)' }}>{pr.project_title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <span>Candidate: <strong>{pr.freelancer_name}</strong> ({pr.freelancer_title})</span>
                    <span>•</span>
                    <span>📍 {pr.freelancer_location}</span>
                    <span>•</span>
                    <span className="badge badge-emerald">${pr.proposed_bid} proposed</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${pr.status === 'accepted' ? 'badge-emerald' : pr.status === 'rejected' ? 'badge-amber' : 'badge-blue'}`}>
                    {pr.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '16px', background: 'var(--bg-input)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>COVER LETTER</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{pr.cover_letter}</p>
              </div>

              {currentUser.role === 'client' && pr.status === 'pending' && (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button className="btn btn-sm btn-secondary" onClick={() => handleUpdateStatus(pr.id, 'rejected')}>Decline</button>
                  <button className="btn btn-sm btn-emerald" onClick={() => handleUpdateStatus(pr.id, 'accepted')}>
                    <ShieldCheck size={14} /> Accept & Fund Escrow (${pr.proposed_bid})
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
