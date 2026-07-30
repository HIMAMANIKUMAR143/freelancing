// Step In Single Page Application Core Controller
const app = {
  currentRoute: 'home',
  currentUser: null,
  theme: 'dark',

  async init() {
    console.log('⚡ Step In Platform initializing...');
    
    // Initialize Theme
    const savedTheme = localStorage.getItem('stepin_theme') || 'dark';
    this.setTheme(savedTheme);

    // Fetch Logged-in User Profile
    await this.fetchUser();

    // Setup Router Listener
    window.addEventListener('hashchange', () => this.handleHashChange());
    this.handleHashChange();
  },

  async fetchUser() {
    try {
      if (!API.activeUserId) {
        this.currentUser = null;
        Navbar.updateUserBadge(null);
        return;
      }
      const data = await API.getMe();
      this.currentUser = data.user;
      Navbar.updateUserBadge(this.currentUser);
    } catch (err) {
      console.warn('Could not fetch user profile:', err);
      this.currentUser = null;
      API.setUserId('');
      Navbar.updateUserBadge(null);
    }
  },

  signOut() {
    API.setUserId('');
    this.currentUser = null;
    Navbar.updateUserBadge(null);
    this.showToast('You have signed out of Step In.', 'info');
    this.navigate('home');
  },

  async switchRole(userId) {
    API.setUserId(userId);
    await this.fetchUser();
    this.showToast(`Switched active user to ${this.currentUser.name} (${this.currentUser.role.toUpperCase()})`, 'info');
    this.renderView(this.currentRoute);
  },

  navigate(route, params = {}) {
    window.location.hash = route + (Object.keys(params).length > 0 ? `?${new URLSearchParams(params).toString()}` : '');
  },

  handleHashChange() {
    const rawHash = window.location.hash.replace('#', '') || 'home';
    const [route, queryString] = rawHash.split('?');
    const params = Object.fromEntries(new URLSearchParams(queryString || ''));

    this.currentRoute = route;
    Navbar.setActiveLink(route);
    this.renderView(route, params);
  },

  async renderView(route, params = {}) {
    const main = document.getElementById('main-content');
    if (!main) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const protectedRoutes = ['post-project', 'proposals', 'dashboard', 'wallet', 'chat', 'admin'];
    if (protectedRoutes.includes(route) && !this.currentUser) {
      main.innerHTML = `
        <div class="card" style="text-align: center; padding: 48px; max-width: 600px; margin: 40px auto;">
          <div style="font-size: 40px; margin-bottom: 12px;">🔒</div>
          <h2 style="font-size: 26px;">Account Required</h2>
          <p style="color: var(--text-secondary); margin: 12px 0 24px;">Please create an account or sign in to access ${route.replace('-', ' ')}.</p>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button class="btn btn-primary" onclick="AuthView.openModal('register')">Create Account</button>
            <button class="btn btn-secondary" onclick="AuthView.openModal('login')">Sign In</button>
          </div>
        </div>
      `;
      AuthView.openModal('register');
      return;
    }

    let viewHtml = '';
    switch (route) {
      case 'home':
        viewHtml = HomeView.render();
        break;
      case 'marketplace':
        viewHtml = await MarketplaceView.render(params);
        break;
      case 'post-project':
        viewHtml = PostProjectView.render();
        break;
      case 'proposals':
        viewHtml = await ProposalsView.render();
        break;
      case 'dashboard':
        viewHtml = await DashboardView.render();
        break;
      case 'wallet':
        viewHtml = await WalletView.render();
        break;
      case 'chat':
        viewHtml = await ChatView.render();
        break;
      case 'admin':
        viewHtml = await AdminView.render();
        break;
      default:
        viewHtml = HomeView.render();
        break;
    }

    main.innerHTML = viewHtml;
  },

  toggleTheme() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  },

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stepin_theme', theme);
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) themeBtn.innerText = theme === 'dark' ? '🌙' : '☀️';
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? '✔' : type === 'error' ? '✖' : 'ℹ';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }
};

// Initialize App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => app.init());
