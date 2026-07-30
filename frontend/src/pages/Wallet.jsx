import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, ShieldCheck, FileText, Plus } from 'lucide-react';

export const Wallet = () => {
  const { currentUser, openAuthModal, showToast, fetchUser } = useAuth();
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('500');
  const [depositMethod, setDepositMethod] = useState('Credit Card / Stripe');
  const [submittingDeposit, setSubmittingDeposit] = useState(false);

  const fetchWallet = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch('/api/wallet', {
        headers: { 'x-demo-user-id': currentUser.id }
      });
      const data = await res.json();
      if (res.ok) {
        setWalletData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [currentUser]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (Number(depositAmount) <= 0) return showToast('Please enter a valid amount', 'error');

    setSubmittingDeposit(true);
    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-user-id': currentUser.id
        },
        body: JSON.stringify({ amount: Number(depositAmount), paymentMethod: depositMethod })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Deposit failed');

      showToast(data.message || 'Funds deposited successfully!', 'success');
      setDepositModalOpen(false);
      fetchWallet();
      fetchUser();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingDeposit(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px', maxWidth: '600px', margin: '40px auto' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
        <h2 style={{ fontSize: '26px' }}>Account Required</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>Please sign in to view your wallet balance and transactions.</p>
        <button className="btn btn-primary" onClick={() => openAuthModal('register')}>Sign In / Create Account</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '28px' }}>Wallet & Escrow Balance</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage deposits, escrow holdings, milestone releases, and printable PDF invoices.</p>
        </div>

        {currentUser.role === 'client' && (
          <button className="btn btn-primary" onClick={() => setDepositModalOpen(true)}>
            <Plus size={16} /> Deposit Funds
          </button>
        )}
      </div>

      {/* Balance Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Available Balance</div>
          <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--accent-emerald)', marginTop: '8px' }}>
            ${Number(walletData?.wallet?.balance || 0).toLocaleString()}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Escrow Hold Amount</div>
          <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--accent-blue)', marginTop: '8px' }}>
            ${Number(walletData?.wallet?.escrow_hold || 0).toLocaleString()}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Protected Protection</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="var(--accent-emerald)" /> Step In Guarantee Active
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div>
        <h3 style={{ fontSize: '22px', marginBottom: '16px' }}>Transaction History & Invoices</h3>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '32px' }}>Loading transactions...</div>
        ) : !walletData?.transactions || walletData.transactions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '32px' }}>No transactions recorded yet.</div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '16px 24px' }}>TYPE</th>
                  <th style={{ padding: '16px 24px' }}>DESCRIPTION</th>
                  <th style={{ padding: '16px 24px' }}>AMOUNT</th>
                  <th style={{ padding: '16px 24px' }}>DATE</th>
                  <th style={{ padding: '16px 24px' }}>INVOICE</th>
                </tr>
              </thead>
              <tbody>
                {walletData.transactions.map(tx => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <span className={`badge ${tx.type === 'deposit' || tx.type === 'release' ? 'badge-emerald' : 'badge-blue'}`}>
                        {tx.type.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-primary)' }}>{tx.description}</td>
                    <td style={{ padding: '16px 24px', fontWeight: 700, color: tx.type === 'deposit' || tx.type === 'release' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                      ${Number(tx.amount).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{tx.created_at}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <a href={`/api/wallet/invoice/${tx.id}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-secondary">
                        <FileText size={14} /> PDF Invoice
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {depositModalOpen && (
        <Modal
          isOpen={depositModalOpen}
          onClose={() => setDepositModalOpen(false)}
          title="Deposit Funds into Step In Wallet"
        >
          <form onSubmit={handleDeposit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Deposit Amount ($) *</label>
              <input
                type="number"
                className="search-input"
                style={{ paddingLeft: '16px' }}
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>Payment Method</label>
              <select className="search-input" style={{ paddingLeft: '16px' }} value={depositMethod} onChange={e => setDepositMethod(e.target.value)}>
                <option value="Credit Card / Stripe">Credit Card / Stripe</option>
                <option value="PayPal Express">PayPal Express</option>
                <option value="Bank Wire Transfer">Bank Wire Transfer</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setDepositModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-emerald" disabled={submittingDeposit}>
                {submittingDeposit ? 'Processing...' : 'Confirm Deposit'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
