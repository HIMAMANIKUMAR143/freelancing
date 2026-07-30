// Marketplace View Component
const MarketplaceView = {
  state: {
    query: '',
    category: 'All',
    type: 'All',
    locationType: 'All',
    skill: '',
    minBudget: 0,
    maxBudget: 20000,
    projects: []
  },

  async render(params = {}) {
    if (params.skill) this.state.skill = params.skill;

    const html = `
      <div class="search-banner">
        <h2 style="font-size: 28px;">Explore Verified Projects Worldwide</h2>
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input type="text" id="marketplace-search-input" class="search-input" placeholder="Search by job title, location (e.g. London, Remote, New York), or skills..." value="${this.state.query}" oninput="MarketplaceView.handleSearchInput(event)">
          <div id="search-autocomplete-dropdown" class="autocomplete-dropdown"></div>
        </div>
      </div>

      <div class="marketplace-layout">
        <!-- Sidebar Filters -->
        <aside class="filter-sidebar">
          <div class="filter-group">
            <div class="filter-title">Work Location Setup</div>
            <label class="filter-option"><input type="radio" name="loc" value="All" ${this.state.locationType === 'All' ? 'checked' : ''} onchange="MarketplaceView.setFilter('locationType', 'All')"> All Setup Models</label>
            <label class="filter-option"><input type="radio" name="loc" value="Remote" ${this.state.locationType === 'Remote' ? 'checked' : ''} onchange="MarketplaceView.setFilter('locationType', 'Remote')"> 🌐 Remote (Global)</label>
            <label class="filter-option"><input type="radio" name="loc" value="Hybrid" ${this.state.locationType === 'Hybrid' ? 'checked' : ''} onchange="MarketplaceView.setFilter('locationType', 'Hybrid')"> 🏢 Hybrid Setup</label>
            <label class="filter-option"><input type="radio" name="loc" value="In-Office" ${this.state.locationType === 'In-Office' ? 'checked' : ''} onchange="MarketplaceView.setFilter('locationType', 'In-Office')"> 🏬 In-Office HQ</label>
          </div>

          <div class="filter-group">
            <div class="filter-title">Category</div>
            <label class="filter-option"><input type="radio" name="cat" value="All" ${this.state.category === 'All' ? 'checked' : ''} onchange="MarketplaceView.setFilter('category', 'All')"> All Categories</label>
            <label class="filter-option"><input type="radio" name="cat" value="Web Development" ${this.state.category === 'Web Development' ? 'checked' : ''} onchange="MarketplaceView.setFilter('category', 'Web Development')"> Web Development</label>
            <label class="filter-option"><input type="radio" name="cat" value="Design & Creative" ${this.state.category === 'Design & Creative' ? 'checked' : ''} onchange="MarketplaceView.setFilter('category', 'Design & Creative')"> Design & Creative</label>
            <label class="filter-option"><input type="radio" name="cat" value="DevOps & Cloud" ${this.state.category === 'DevOps & Cloud' ? 'checked' : ''} onchange="MarketplaceView.setFilter('category', 'DevOps & Cloud')"> DevOps & Cloud</label>
          </div>

          <div class="filter-group">
            <div class="filter-title">Project Type</div>
            <label class="filter-option"><input type="radio" name="type" value="All" ${this.state.type === 'All' ? 'checked' : ''} onchange="MarketplaceView.setFilter('type', 'All')"> All Types</label>
            <label class="filter-option"><input type="radio" name="type" value="Fixed" ${this.state.type === 'Fixed' ? 'checked' : ''} onchange="MarketplaceView.setFilter('type', 'Fixed')"> Fixed Price</label>
            <label class="filter-option"><input type="radio" name="type" value="Hourly" ${this.state.type === 'Hourly' ? 'checked' : ''} onchange="MarketplaceView.setFilter('type', 'Hourly')"> Hourly Rate</label>
          </div>

          <div class="filter-group">
            <div class="filter-title">Max Budget ($)</div>
            <input type="range" min="500" max="20000" step="500" value="${this.state.maxBudget}" oninput="MarketplaceView.setFilter('maxBudget', this.value)" style="width: 100%; accent-color: var(--accent-blue);">
            <div style="font-size: 13px; color: var(--text-muted); text-align: right;">Up to $${Number(this.state.maxBudget).toLocaleString()}</div>
          </div>
        </aside>

        <!-- Main Project Grid -->
        <main>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div id="projects-count-label" style="font-size: 14px; color: var(--text-muted);">Loading projects...</div>
          </div>
          <div id="projects-grid-container" class="projects-grid">
            <!-- Project Cards Rendered Dynamically -->
          </div>
        </main>
      </div>
    `;

    setTimeout(() => this.loadProjects(), 10);
    return html;
  },

  async loadProjects() {
    try {
      const data = await API.getProjects({
        q: this.state.query,
        category: this.state.category,
        type: this.state.type,
        locationType: this.state.locationType,
        skill: this.state.skill,
        maxBudget: this.state.maxBudget
      });

      this.state.projects = data.projects;

      const container = document.getElementById('projects-grid-container');
      const countLabel = document.getElementById('projects-count-label');

      if (countLabel) countLabel.innerText = `Showing ${data.count} verified active project${data.count === 1 ? '' : 's'}`;

      if (!container) return;

      if (data.projects.length === 0) {
        container.innerHTML = `
          <div class="card" style="text-align: center; padding: 48px;">
            <h3>No projects found</h3>
            <p style="color: var(--text-muted); margin-top: 8px;">Try adjusting your location filters or search keywords.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = data.projects.map(p => `
        <div class="project-card">
          <div class="project-header">
            <div>
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                <div class="project-title" onclick="MarketplaceView.openProjectDetail('${p.id}')">${p.title}</div>
                <span class="badge ${p.location_type === 'Remote' ? 'badge-emerald' : p.location_type === 'Hybrid' ? 'badge-blue' : 'badge-amber'}">
                  ${p.location_type === 'Remote' ? '🌐 Global Remote' : p.location_type === 'Hybrid' ? '🏢 Hybrid' : '🏬 In-Office'}
                </span>
              </div>
              <div class="project-meta">
                <span>Posted by <strong>${p.company_name || p.client_name}</strong></span>
                <span>•</span>
                <span>📍 ${p.location_name || p.client_location}</span>
                <span>•</span>
                <span>💼 ${p.category}</span>
                <span>•</span>
                <span class="badge badge-emerald">$${Number(p.client_total_spent || 0).toLocaleString()} spent</span>
              </div>
            </div>
            <div class="project-budget">
              ${p.project_type === 'fixed' ? '$' + Number(p.budget).toLocaleString() : '$' + p.budget + '/hr'}
            </div>
          </div>

          <p class="project-description">${p.description}</p>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div class="skills-list">
              ${p.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 13px; color: var(--text-muted);">${p.proposal_count} proposal${p.proposal_count === 1 ? '' : 's'}</span>
              <button class="btn btn-sm btn-primary" onclick="MarketplaceView.openProjectDetail('${p.id}')">View Details</button>
            </div>
          </div>
        </div>
      `).join('');
    } catch (err) {
      console.error(err);
    }
  },

  async handleSearchInput(e) {
    this.state.query = e.target.value;
    const dropdown = document.getElementById('search-autocomplete-dropdown');

    if (this.state.query.length >= 2) {
      const suggestionsData = await API.getSearchSuggestions(this.state.query);
      if (suggestionsData.suggestions.length > 0) {
        dropdown.innerHTML = suggestionsData.suggestions.map(s => `
          <div class="autocomplete-item" onclick="MarketplaceView.selectSuggestion('${s.label}')">
            <span>${s.type === 'skill' ? '🏷️' : '💼'}</span>
            <span>${s.label}</span>
          </div>
        `).join('');
        dropdown.classList.add('active');
      } else {
        dropdown.classList.remove('active');
      }
    } else {
      dropdown?.classList.remove('active');
    }

    this.loadProjects();
  },

  selectSuggestion(val) {
    this.state.query = val;
    const input = document.getElementById('marketplace-search-input');
    if (input) input.value = val;
    document.getElementById('search-autocomplete-dropdown')?.classList.remove('active');
    this.loadProjects();
  },

  setFilter(key, val) {
    this.state[key] = val;
    this.loadProjects();
  },

  async openProjectDetail(id) {
    try {
      const { project } = await API.getProjectById(id);
      const isFreelancer = app.currentUser && app.currentUser.role === 'freelancer';

      const bodyHtml = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; background: var(--bg-input); padding: 16px; border-radius: var(--radius-md);">
            <div>
              <div style="font-size: 13px; color: var(--text-muted);">${project.category} • ${project.experience_level} Level</div>
              <div style="font-size: 24px; font-weight: 800; color: var(--accent-emerald); margin-top: 4px;">
                ${project.project_type === 'fixed' ? 'Fixed Price: $' + Number(project.budget).toLocaleString() : 'Hourly Rate: $' + project.budget + '/hr'}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 700; color: var(--text-primary);">${project.company_name || project.client_name}</div>
              <div style="font-size: 12px; color: var(--text-muted);">${project.client_location}</div>
            </div>
          </div>

          <div>
            <h4 style="margin-bottom: 8px; color: var(--text-primary);">Project Overview</h4>
            <p style="color: var(--text-secondary); line-height: 1.6; white-space: pre-line;">${project.description}</p>
          </div>

          <div>
            <h4 style="margin-bottom: 8px; color: var(--text-primary);">Required Skills</h4>
            <div class="skills-list">
              ${project.skills.map(s => `<span class="skill-tag" style="background: rgba(59,130,246,0.15); color: var(--accent-blue);">${s}</span>`).join('')}
            </div>
          </div>

          <div style="background: var(--bg-input); padding: 16px; border-radius: var(--radius-md); font-size: 13px; color: var(--text-secondary);">
            🔒 <strong>Step In Escrow Protected:</strong> Client's payment is secured before work begins and released upon milestone completion.
          </div>
        </div>
      `;

      const footerHtml = isFreelancer
        ? `<button class="btn btn-primary" onclick="Modal.close(); ProposalsView.openSubmitModal('${project.id}', '${project.title.replace(/'/g, "\\'")}', ${project.budget})">Submit Proposal</button>`
        : `<button class="btn btn-secondary" onclick="Modal.close(); app.navigate('proposals');">Manage Proposals</button>`;

      Modal.open(project.title, bodyHtml, footerHtml);
    } catch (err) {
      app.showToast(err.message, 'error');
    }
  }
};
