// Role-Based Workspace & Contracts Dashboard View
const DashboardView = {
  async render() {
    const isClient = app.currentUser && app.currentUser.role === 'client';

    let html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 28px;">${isClient ? 'Client Workspace Dashboard' : 'Freelancer Dashboard'}</h2>
          <p style="color: var(--text-secondary);">${isClient ? 'Manage active contracts, review milestone progress, and release escrow payments.' : 'Track active work, earnings, and completed milestone deliverables.'}</p>
        </div>
      </div>

      <!-- Quick Metrics Cards -->
      <div id="dashboard-metrics-container" class="dashboard-grid">
        <!-- Rendered dynamically -->
      </div>

      <div style="margin-top: 40px;">
        <h3 style="font-size: 22px; margin-bottom: 16px;">Active Contracts & Escrow Milestones</h3>
        <div id="contracts-list-container">Loading contracts...</div>
      </div>
    `;

    setTimeout(() => this.loadDashboard(), 10);
    return html;
  },

  async loadDashboard() {
    try {
      const { user } = await API.getMe();
      const { contracts } = await API.getContracts();

      // Render Metrics
      const metricsContainer = document.getElementById('dashboard-metrics-container');
      if (metricsContainer) {
        if (user.role === 'client') {
          metricsContainer.innerHTML = `
            <div class="metric-card">
              <div class="metric-value">$${Number(user.total_spent || 0).toLocaleString()}</div>
              <div class="metric-label">Total Spent</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">$${Number(user.wallet?.escrow_hold || 0).toLocaleString()}</div>
              <div class="metric-label">Currently Locked in Escrow</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${user.jobs_posted || 0}</div>
              <div class="metric-label">Jobs Posted</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${contracts.length}</div>
              <div class="metric-label">Active Contracts</div>
            </div>
          `;
        } else {
          metricsContainer.innerHTML = `
            <div class="metric-card">
              <div class="metric-value">$${Number(user.total_earned || 0).toLocaleString()}</div>
              <div class="metric-label">Total Earned</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">$${Number(user.wallet?.balance || 0).toLocaleString()}</div>
              <div class="metric-label">Available Wallet Balance</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">$${Number(user.wallet?.escrow_hold || 0).toLocaleString()}</div>
              <div class="metric-label">Pending Escrow Funds</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">★ ${user.rating || 5.0}</div>
              <div class="metric-label">Client Rating</div>
            </div>
          `;
        }
      }

      // Render Contracts & Milestones List
      const contractsContainer = document.getElementById('contracts-list-container');
      if (!contractsContainer) return;

      if (!contracts || contracts.length === 0) {
        contractsContainer.innerHTML = `
          <div class="card" style="text-align: center; padding: 48px;">
            <h3>No active contracts</h3>
            <p style="color: var(--text-muted); margin-top: 8px;">Explore the marketplace or review submitted proposals to start a contract.</p>
          </div>
        `;
        return;
      }

      contractsContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 24px;">
          ${contracts.map(c => `
            <div class="card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px;">
                <div>
                  <div style="font-size: 20px; font-weight: 700;">${c.project_title}</div>
                  <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
                    Contract #${c.id.slice(-6)} • Client: <strong>${c.client_name}</strong> • Freelancer: <strong>${c.freelancer_name}</strong>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 22px; font-weight: 800; color: var(--accent-emerald);">$${Number(c.total_amount).toLocaleString()}</div>
                  <span class="badge ${c.status === 'completed' ? 'badge-emerald' : 'badge-blue'}">${c.status.toUpperCase()}</span>
                </div>
              </div>

              <!-- Milestones Timeline -->
              <h4 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 12px;">Milestones Breakdown</h4>
              <div class="milestone-timeline">
                ${c.milestones.map(m => `
                  <div class="milestone-item">
                    <div class="milestone-info">
                      <div style="font-weight: 700; color: var(--text-primary);">${m.title}</div>
                      <div style="font-size: 12px; color: var(--text-muted);">Status: <span class="badge ${m.status === 'released' ? 'badge-emerald' : 'badge-amber'}">${m.status.replace('_', ' ').toUpperCase()}</span></div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 16px;">
                      <div class="milestone-amount">$${Number(m.amount).toLocaleString()}</div>
                      ${user.role === 'client' && m.status === 'funded_escrow' ? `
                        <button class="btn btn-sm btn-emerald" onclick="DashboardView.releasePayment('${m.id}', '${m.title.replace(/'/g, "\\'")}', ${m.amount})">Release Payment</button>
                      ` : ''}
                      ${m.status === 'released' ? `
                        <span style="color: var(--accent-emerald); font-size: 13px; font-weight: 600;">✔ Released to Wallet</span>
                      ` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } catch (err) {
      console.error(err);
    }
  },

  releasePayment(milestoneId, title, amount) {
    const bodyHtml = `
      <p>Are you sure you want to release <strong>$${amount.toLocaleString()}</strong> for <strong>"${title}"</strong>?</p>
      <div style="margin-top: 16px; background: var(--bg-input); padding: 16px; border-radius: var(--radius-md); font-size: 13px;">
        💸 The funds will immediately transfer from your Escrow hold to the freelancer's available wallet balance, and an official ApexWork Invoice will be generated.
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-emerald" onclick="DashboardView.confirmRelease('${milestoneId}')">Release $${amount.toLocaleString()}</button>
    `;

    Modal.open(`Release Milestone Payment ($${amount.toLocaleString()})`, bodyHtml, footerHtml);
  },

  async confirmRelease(milestoneId) {
    try {
      Modal.close();
      const res = await API.releaseMilestonePayment(milestoneId);
      app.showToast(res.message, 'success');
      this.loadDashboard();
    } catch (err) {
      app.showToast(err.message, 'error');
    }
  }
};
