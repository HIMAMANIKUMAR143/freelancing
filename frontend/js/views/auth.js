// Authentication & Account Creation Modal View Component
const AuthView = {
  activeTab: 'register', // 'register' or 'login'

  openModal(tab = 'register') {
    this.activeTab = tab;
    this.renderModal();
  },

  renderModal() {
    const bodyHtml = `
      <div style="display: flex; gap: 8px; margin-bottom: 20px; background: var(--bg-input); padding: 4px; border-radius: var(--radius-full);">
        <button class="role-btn ${this.activeTab === 'register' ? 'active' : ''}" style="flex: 1; padding: 10px; font-size: 14px;" onclick="AuthView.switchTab('register')">Create Account</button>
        <button class="role-btn ${this.activeTab === 'login' ? 'active' : ''}" style="flex: 1; padding: 10px; font-size: 14px;" onclick="AuthView.switchTab('login')">Sign In</button>
      </div>

      <div id="auth-tab-content">
        ${this.activeTab === 'register' ? this.renderRegisterForm() : this.renderLoginForm()}
      </div>

      <div style="margin-top: 24px; border-top: 1px solid var(--border-color); padding-top: 16px;">
        <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; text-align: center;">⚡ Or Instant 1-Click Demo Sign In</div>
        <div style="display: flex; gap: 8px; justify-content: center;">
          <button class="btn btn-sm btn-secondary" onclick="AuthView.quickDemo('user_c1')">Client (Elena)</button>
          <button class="btn btn-sm btn-secondary" onclick="AuthView.quickDemo('user_f1')">Freelancer (Alex)</button>
          <button class="btn btn-sm btn-secondary" onclick="AuthView.quickDemo('user_admin')">Admin</button>
        </div>
      </div>
    `;

    Modal.open(this.activeTab === 'register' ? 'Create Your Step In Account' : 'Sign In to Step In', bodyHtml, '');
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.renderModal();
  },

  renderRegisterForm() {
    return `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px;">I want to *</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <label class="card" style="padding: 12px; cursor: pointer; text-align: center;">
              <input type="radio" name="auth-role" value="client" checked onchange="AuthView.toggleRoleFields('client')">
              <div style="font-weight: 700; color: var(--text-primary);">Hire Talent (Client)</div>
            </label>
            <label class="card" style="padding: 12px; cursor: pointer; text-align: center;">
              <input type="radio" name="auth-role" value="freelancer" onchange="AuthView.toggleRoleFields('freelancer')">
              <div style="font-weight: 700; color: var(--text-primary);">Work & Earn (Freelancer)</div>
            </label>
          </div>
        </div>

        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px;">Full Name *</label>
          <input type="text" id="reg-name" class="search-input" style="padding-left: 16px;" placeholder="e.g. Sarah Connor">
        </div>

        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px;">Email Address *</label>
          <input type="email" id="reg-email" class="search-input" style="padding-left: 16px;" placeholder="sarah@example.com">
        </div>

        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px;">Location (City, Country)</label>
          <input type="text" id="reg-location" class="search-input" style="padding-left: 16px;" placeholder="e.g. San Francisco, USA or Remote">
        </div>

        <div id="role-extra-field">
          <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px;">Company Name</label>
          <input type="text" id="reg-company" class="search-input" style="padding-left: 16px;" placeholder="e.g. Apex AI Labs">
        </div>

        <button class="btn btn-primary" style="width: 100%; margin-top: 8px;" onclick="AuthView.handleRegister()">Create Account & Sign In →</button>
      </div>
    `;
  },

  renderLoginForm() {
    return `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px;">Account Email Address *</label>
          <input type="email" id="login-email" class="search-input" style="padding-left: 16px;" placeholder="elena@techcorp.io">
        </div>

        <button class="btn btn-primary" style="width: 100%; margin-top: 8px;" onclick="AuthView.handleLogin()">Sign In to Account →</button>
      </div>
    `;
  },

  toggleRoleFields(role) {
    const field = document.getElementById('role-extra-field');
    if (!field) return;
    if (role === 'client') {
      field.innerHTML = `
        <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px;">Company Name</label>
        <input type="text" id="reg-company" class="search-input" style="padding-left: 16px;" placeholder="e.g. Apex AI Labs">
      `;
    } else {
      field.innerHTML = `
        <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px;">Professional Title & Hourly Rate ($)</label>
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px;">
          <input type="text" id="reg-title" class="search-input" style="padding-left: 16px;" placeholder="e.g. Senior Full-Stack Engineer">
          <input type="number" id="reg-rate" class="search-input" style="padding-left: 16px;" value="85">
        </div>
      `;
    }
  },

  async handleRegister() {
    try {
      const role = document.querySelector('input[name="auth-role"]:checked')?.value || 'client';
      const name = document.getElementById('reg-name')?.value;
      const email = document.getElementById('reg-email')?.value;
      const location = document.getElementById('reg-location')?.value;
      const company_name = document.getElementById('reg-company')?.value;
      const title = document.getElementById('reg-title')?.value;
      const hourly_rate = document.getElementById('reg-rate')?.value;

      if (!name || !email) return app.showToast('Please enter your name and email address', 'error');

      const res = await API.register({ name, email, role, location, company_name, title, hourly_rate });
      app.showToast(res.message, 'success');
      API.setUserId(res.user.id);
      await app.fetchUser();
      Modal.close();
      app.navigate('dashboard');
    } catch (err) {
      app.showToast(err.message, 'error');
    }
  },

  async handleLogin() {
    try {
      const email = document.getElementById('login-email')?.value;
      if (!email) return app.showToast('Please enter your email address', 'error');

      const res = await API.login(email);
      app.showToast(res.message, 'success');
      API.setUserId(res.user.id);
      await app.fetchUser();
      Modal.close();
      app.navigate('dashboard');
    } catch (err) {
      app.showToast(err.message, 'error');
    }
  },

  async quickDemo(userId) {
    API.setUserId(userId);
    await app.fetchUser();
    Modal.close();
    app.showToast(`Signed in as ${app.currentUser.name} (${app.currentUser.role.toUpperCase()})`, 'info');
    app.navigate('dashboard');
  }
};
