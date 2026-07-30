// Navbar Component Logic
const Navbar = {
  updateUserBadge(user) {
    const badgeContainer = document.getElementById('user-profile-badge');
    if (!badgeContainer) return;

    if (user) {
      badgeContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; background: rgba(255, 255, 255, 0.05); padding: 4px 12px 4px 6px; border-radius: var(--radius-full); border: 1px solid var(--border-color);">
          <img class="avatar" src="${user.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}" alt="${user.name}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
          <div style="display: flex; flex-direction: column; cursor: pointer;" onclick="app.navigate('dashboard')">
            <span style="font-size: 13px; font-weight: 700; color: var(--text-primary); line-height: 1.1; white-space: nowrap;">${user.name}</span>
            <span style="font-size: 10px; font-weight: 600; color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em;">${user.role}</span>
          </div>
          <button class="btn btn-sm btn-secondary" style="padding: 4px 10px; font-size: 11px; border-radius: var(--radius-full);" onclick="app.signOut()" title="Sign Out">Sign Out</button>
        </div>
      `;
    } else {
      badgeContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="btn btn-sm btn-secondary" style="border-radius: var(--radius-full); padding: 7px 16px; font-size: 13px;" onclick="AuthView.openModal('login')">Sign In</button>
          <button class="btn btn-sm btn-primary" style="border-radius: var(--radius-full); padding: 7px 18px; font-size: 13px;" onclick="AuthView.openModal('register')">Create Account</button>
        </div>
      `;
    }
  },

  setActiveLink(route) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${route}`);
    if (activeNav) activeNav.classList.add('active');
  }
};
