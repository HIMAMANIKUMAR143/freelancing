// Step In API Client Service Layer
const API = {
  activeUserId: localStorage.getItem('stepin_user_id') || '',

  setUserId(id) {
    this.activeUserId = id;
    if (id) {
      localStorage.setItem('stepin_user_id', id);
    } else {
      localStorage.removeItem('stepin_user_id');
    }
  },

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `/api${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'x-demo-user-id': this.activeUserId,
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'API Request Failed');
      }
      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  },

  // Auth & Profile
  getMe() { return this.request('/auth/me'); },
  getDemoUsers() { return this.request('/auth/demo-users'); },
  login(email) { return this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email }) }); },
  register(data) { return this.request('/auth/register', { method: 'POST', body: JSON.stringify(data) }); },
  updateProfile(data) { return this.request('/auth/profile', { method: 'POST', body: JSON.stringify(data) }); },

  // Projects & Search
  getProjects(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/projects?${query}`);
  },
  getProjectById(id) { return this.request(`/projects/${id}`); },
  getSearchSuggestions(q) { return this.request(`/projects/suggestions?q=${encodeURIComponent(q)}`); },
  createProject(data) { return this.request('/projects', { method: 'POST', body: JSON.stringify(data) }); },

  // Proposals
  submitProposal(data) { return this.request('/proposals', { method: 'POST', body: JSON.stringify(data) }); },
  getMyProposals() { return this.request('/proposals/my-proposals'); },
  updateProposalStatus(id, status) { return this.request(`/proposals/${id}/status`, { method: 'POST', body: JSON.stringify({ status }) }); },

  // Contracts & Milestones
  getContracts() { return this.request('/contracts'); },
  releaseMilestonePayment(id) { return this.request(`/contracts/milestones/${id}/release`, { method: 'POST' }); },

  // Wallet
  getWallet() { return this.request('/wallet'); },
  depositWallet(amount, method) { return this.request('/wallet/deposit', { method: 'POST', body: JSON.stringify({ amount, paymentMethod: method }) }); },

  // Messages
  getConversations() { return this.request('/messages/conversations'); },
  getThread(partnerId) { return this.request(`/messages/thread/${partnerId}`); },
  sendMessage(data) { return this.request('/messages/send', { method: 'POST', body: JSON.stringify(data) }); },

  // Reviews
  submitReview(data) { return this.request('/reviews', { method: 'POST', body: JSON.stringify(data) }); },
  getUserReviews(userId) { return this.request(`/reviews/user/${userId}`); },

  // Admin
  getAdminStats() { return this.request('/admin/stats'); },
  toggleUserStatus(id, status) { return this.request(`/admin/users/${id}/toggle-status`, { method: 'POST', body: JSON.stringify({ status }) }); }
};
