// Digital Wallet & Financial Center View Component
const WalletView = {
  async render() {
    let html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 28px;">Digital Wallet & Escrow Protection</h2>
          <p style="color: var(--text-secondary);">Manage wallet balance, track escrow holds, and download official transaction invoices.</p>
        </div>
        <button class="btn btn-primary" onclick="WalletView.openDepositModal()">+ Deposit Funds</button>
      </div>

      <div id="wallet-summary-cards" class="dashboard-grid">Loading wallet metrics...</div>

      <div style="margin-top: 40px;">
        <h3 style="font-size: 22px; margin-bottom: 16px;">Transaction History & Invoices</h3>
        <div id="transactions-list-container">Loading transactions...</div>
      </div>
    `;

    setTimeout(() => this.loadWallet(), 10);
    return html;
  },

  async loadWallet() {
    try {
      const { wallet, transactions } = await API.getWallet();

      const summaryContainer = document.getElementById('wallet-summary-cards');
      if (summaryContainer) {
        summaryContainer.innerHTML = `
          <div class="metric-card">
            <div class="metric-value">$${Number(wallet.balance || 0).toLocaleString()}</div>
            <div class="metric-label">Available Balance</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">$${Number(wallet.escrow_hold || 0).toLocaleString()}</div>
            <div class="metric-label">Locked in Escrow</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${transactions.length}</div>
            <div class="metric-label">Total Transactions</div>
          </div>
        `;
      }

      const txContainer = document.getElementById('transactions-list-container');
      if (!txContainer) return;

      if (!transactions || transactions.length === 0) {
        txContainer.innerHTML = `
          <div class="card" style="text-align: center; padding: 48px;">
            <h3>No transactions recorded yet</h3>
          </div>
        `;
        return;
      }

      txContainer.innerHTML = `
        <div class="card" style="padding: 0; overflow: hidden;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(t => `
                <tr>
                  <td style="font-family: monospace; font-weight: 600; color: var(--accent-blue);">${t.id}</td>
                  <td><span class="badge ${t.type === 'deposit' || t.type === 'escrow_release' ? 'badge-emerald' : 'badge-amber'}">${t.type.toUpperCase()}</span></td>
                  <td>${t.description}</td>
                  <td style="font-weight: 700; color: ${t.type === 'deposit' || t.type === 'escrow_release' ? 'var(--accent-emerald)' : 'var(--text-primary)'};">$${Number(t.amount).toLocaleString()}</td>
                  <td style="color: var(--text-muted); font-size: 13px;">${new Date(t.created_at).toLocaleDateString()}</td>
                  <td>
                    <button class="btn btn-sm btn-secondary" onclick="WalletView.openInvoice('${t.id}')">📄 View Invoice</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      console.error(err);
    }
  },

  openDepositModal() {
    const bodyHtml = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px;">Deposit Amount ($)</label>
          <input type="number" id="deposit-amount" class="search-input" style="padding-left: 16px;" value="2500" min="10">
        </div>
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px;">Payment Method</label>
          <select id="deposit-method" class="search-input" style="padding-left: 16px;">
            <option value="Stripe Credit Card (**** 4242)">Stripe Credit Card (**** 4242)</option>
            <option value="Razorpay Instant Transfer">Razorpay Instant Transfer</option>
            <option value="Direct ACH Bank Wire">Direct ACH Bank Wire</option>
          </select>
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="WalletView.confirmDeposit()">Confirm Deposit</button>
    `;

    Modal.open('Deposit Funds into Wallet', bodyHtml, footerHtml);
  },

  async confirmDeposit() {
    try {
      const amount = Number(document.getElementById('deposit-amount')?.value);
      const method = document.getElementById('deposit-method')?.value;
      if (!amount || amount <= 0) return app.showToast('Please enter a valid deposit amount', 'error');

      const res = await API.depositWallet(amount, method);
      app.showToast(res.message, 'success');
      Modal.close();
      this.loadWallet();
    } catch (err) {
      app.showToast(err.message, 'error');
    }
  },

  openInvoice(txId) {
    window.open(`/api/wallet/invoice/${txId}`, '_blank', 'width=900,height=800');
  }
};
