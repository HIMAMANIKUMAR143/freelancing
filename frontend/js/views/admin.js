// Admin Dashboard & Moderation Panel View Component
const AdminView = {
  async render() {
    let html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 28px;">Step In Admin & Trust & Safety</h2>
          <p style="color: var(--text-secondary);">Monitor overall platform volume, escrow holdings, user moderation, and verification status.</p>
        </div>
      </div>

      <div id="admin-stats-container" class="admin-stats-grid">Loading platform analytics...</div>

      <div style="margin-top: 40px;">
        <h3 style="font-size: 22px; margin-bottom: 16px;">Registered Users & Verification Control</h3>
        <div id="admin-users-table-container">Loading users...</div>
      </div>
    `;

    setTimeout(() => this.loadAdminData(), 10);
    return html;
  },

  async loadAdminData() {
    try {
      const data = await API.getAdminStats();

      const statsContainer = document.getElementById('admin-stats-container');
      if (statsContainer) {
        statsContainer.innerHTML = `
          <div class="stat-box">
            <div class="stat-number">$${Number(data.stats.totalVolume || 0).toLocaleString()}</div>
            <div style="font-size: 13px; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">Total Platform Volume</div>
          </div>
          <div class="stat-box">
            <div class="stat-number" style="color: var(--accent-emerald);">$${Number(data.stats.escrowHold || 0).toLocaleString()}</div>
            <div style="font-size: 13px; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">Escrow Funds Under Management</div>
          </div>
          <div class="stat-box">
            <div class="stat-number" style="color: var(--accent-indigo);">${data.stats.totalUsers}</div>
            <div style="font-size: 13px; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">Registered Platform Users</div>
          </div>
          <div class="stat-box">
            <div class="stat-number" style="color: var(--accent-amber);">${data.stats.totalProjects}</div>
            <div style="font-size: 13px; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">Marketplace Projects</div>
          </div>
        `;
      }

      const usersContainer = document.getElementById('admin-users-table-container');
      if (!usersContainer) return;

      usersContainer.innerHTML = `
        <div class="card" style="padding: 0; overflow: hidden;">
          <table class="data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name & Email</th>
                <th>Role</th>
                <th>Verification</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${data.users.map(u => `
                <tr>
                  <td style="font-family: monospace; color: var(--accent-blue);">${u.id}</td>
                  <td>
                    <div style="font-weight: 700;">${u.name}</div>
                    <div style="font-size: 12px; color: var(--text-muted);">${u.email}</div>
                  </td>
                  <td><span class="badge ${u.role === 'client' ? 'badge-blue' : u.role === 'freelancer' ? 'badge-purple' : 'badge-amber'}">${u.role.toUpperCase()}</span></td>
                  <td><span class="badge badge-emerald">✔ VERIFIED ID</span></td>
                  <td><span class="badge ${u.status === 'active' ? 'badge-emerald' : 'badge-amber'}">${u.status.toUpperCase()}</span></td>
                  <td>
                    ${u.status === 'active' ? `
                      <button class="btn btn-sm btn-secondary" onclick="AdminView.toggleStatus('${u.id}', 'suspended')">Suspend</button>
                    ` : `
                      <button class="btn btn-sm btn-emerald" onclick="AdminView.toggleStatus('${u.id}', 'active')">Activate</button>
                    `}
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

  async toggleStatus(userId, status) {
    try {
      const res = await API.toggleUserStatus(userId, status);
      app.showToast(res.message, 'success');
      this.loadAdminData();
    } catch (err) {
      app.showToast(err.message, 'error');
    }
  }
};
