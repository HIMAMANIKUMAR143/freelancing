// Post a Project Wizard View (Client persona)
const PostProjectView = {
  step: 1,
  formData: {
    title: '',
    category: 'Web Development',
    description: '',
    experience_level: 'Intermediate',
    project_type: 'fixed',
    budget: 3500,
    duration: '1 to 3 months',
    location_type: 'Remote',
    location_name: 'Global / Remote',
    skills: []
  },

  render() {
    if (app.currentUser && app.currentUser.role !== 'client') {
      return `
        <div class="card" style="text-align: center; padding: 48px; max-width: 600px; margin: 40px auto;">
          <h3>Client Account Required</h3>
          <p style="color: var(--text-muted); margin: 12px 0 24px;">Posting jobs requires a Client account persona. Switch to the Client role in the top header navbar to post a job.</p>
          <button class="btn btn-primary" onclick="app.switchRole('user_c1'); app.navigate('post-project');">Switch to Client Persona</button>
        </div>
      `;
    }

    return `
      <div style="max-width: 800px; margin: 0 auto;">
        
        <!-- Step Progress Indicator -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; position: relative;">
          <div class="card" style="width: 100%; display: flex; justify-content: space-between; padding: 16px 24px;">
            <div style="font-weight: 700; color: ${this.step >= 1 ? 'var(--accent-blue)' : 'var(--text-muted)'};">1. Basic Info & Location</div>
            <div style="font-weight: 700; color: ${this.step >= 2 ? 'var(--accent-blue)' : 'var(--text-muted)'};">2. Scope & Description</div>
            <div style="font-weight: 700; color: ${this.step >= 3 ? 'var(--accent-blue)' : 'var(--text-muted)'};">3. Budget & Duration</div>
            <div style="font-weight: 700; color: ${this.step >= 4 ? 'var(--accent-blue)' : 'var(--text-muted)'};">4. Skills & Publish</div>
          </div>
        </div>

        <!-- Wizard Card -->
        <div class="card" id="wizard-step-container">
          ${this.renderStepContent()}
        </div>
      </div>
    `;
  },

  renderStepContent() {
    if (this.step === 1) {
      return `
        <h2 style="font-size: 24px; margin-bottom: 8px;">Step 1: Project Title, Category & Location Setup</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">Specify whether this project is Remote (Global), Hybrid, or In-Office.</p>

        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Project Title *</label>
            <input type="text" id="post-title" class="search-input" style="padding-left: 20px;" placeholder="e.g. Build a High-Frequency AI Analytics Dashboard in Next.js" value="${this.formData.title}">
          </div>

          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Category *</label>
            <select id="post-category" class="search-input" style="padding-left: 20px;">
              <option value="Web Development" ${this.formData.category === 'Web Development' ? 'selected' : ''}>Web Development</option>
              <option value="Design & Creative" ${this.formData.category === 'Design & Creative' ? 'selected' : ''}>Design & Creative</option>
              <option value="DevOps & Cloud" ${this.formData.category === 'DevOps & Cloud' ? 'selected' : ''}>DevOps & Cloud Security</option>
              <option value="AI & Data Science" ${this.formData.category === 'AI & Data Science' ? 'selected' : ''}>AI & Data Science</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Work Location Setup Model *</label>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
              <label class="card" style="padding: 16px; cursor: pointer; text-align: center;">
                <input type="radio" name="locType" value="Remote" ${this.formData.location_type === 'Remote' ? 'checked' : ''}>
                <div><strong>🌐 Remote (Global)</strong></div>
                <div style="font-size: 11px; color: var(--text-muted);">Work from anywhere</div>
              </label>
              <label class="card" style="padding: 16px; cursor: pointer; text-align: center;">
                <input type="radio" name="locType" value="Hybrid" ${this.formData.location_type === 'Hybrid' ? 'checked' : ''}>
                <div><strong>🏢 Hybrid Setup</strong></div>
                <div style="font-size: 11px; color: var(--text-muted);">Partial office & remote</div>
              </label>
              <label class="card" style="padding: 16px; cursor: pointer; text-align: center;">
                <input type="radio" name="locType" value="In-Office" ${this.formData.location_type === 'In-Office' ? 'checked' : ''}>
                <div><strong>🏬 In-Office HQ</strong></div>
                <div style="font-size: 11px; color: var(--text-muted);">Onsite location required</div>
              </label>
            </div>
          </div>

          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Location / City Name</label>
            <input type="text" id="post-location-name" class="search-input" style="padding-left: 20px;" placeholder="e.g. Global / Remote, San Francisco CA, London UK, Tokyo Japan" value="${this.formData.location_name}">
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
            <button class="btn btn-primary" onclick="PostProjectView.nextStep(1)">Next: Detailed Scope →</button>
          </div>
        </div>
      `;
    }

    if (this.step === 2) {
      return `
        <h2 style="font-size: 24px; margin-bottom: 8px;">Step 2: Project Scope & Description</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">Describe the project requirements, key deliverables, and tech stack expectations.</p>

        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Detailed Project Description *</label>
            <textarea id="post-desc" class="search-input" style="padding-left: 20px; min-height: 160px; font-family: inherit;" placeholder="Describe what you are building, key features, architecture requirements, and timeline expectations...">${this.formData.description}</textarea>
          </div>

          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Required Experience Level</label>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
              <label class="card" style="padding: 16px; cursor: pointer; text-align: center;">
                <input type="radio" name="exp" value="Entry" ${this.formData.experience_level === 'Entry' ? 'checked' : ''}> Entry Level
              </label>
              <label class="card" style="padding: 16px; cursor: pointer; text-align: center;">
                <input type="radio" name="exp" value="Intermediate" ${this.formData.experience_level === 'Intermediate' ? 'checked' : ''}> Intermediate
              </label>
              <label class="card" style="padding: 16px; cursor: pointer; text-align: center;">
                <input type="radio" name="exp" value="Expert" ${this.formData.experience_level === 'Expert' ? 'checked' : ''}> Expert
              </label>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 16px;">
            <button class="btn btn-secondary" onclick="PostProjectView.prevStep(2)">← Back</button>
            <button class="btn btn-primary" onclick="PostProjectView.nextStep(2)">Next: Budget & Terms →</button>
          </div>
        </div>
      `;
    }

    if (this.step === 3) {
      return `
        <h2 style="font-size: 24px; margin-bottom: 8px;">Step 3: Budget & Payment Terms</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">Choose fixed price or hourly billing and set your budget allocation.</p>

        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Pricing Model</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <label class="card" style="padding: 16px; cursor: pointer;">
                <input type="radio" name="ptype" value="fixed" ${this.formData.project_type === 'fixed' ? 'checked' : ''}>
                <strong>Fixed Price</strong>
                <div style="font-size: 12px; color: var(--text-muted);">Set budget funded into escrow per milestone.</div>
              </label>
              <label class="card" style="padding: 16px; cursor: pointer;">
                <input type="radio" name="ptype" value="hourly" ${this.formData.project_type === 'hourly' ? 'checked' : ''}>
                <strong>Hourly Rate</strong>
                <div style="font-size: 12px; color: var(--text-muted);">Pay weekly based on tracked hours.</div>
              </label>
            </div>
          </div>

          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Estimated Budget ($) *</label>
            <input type="number" id="post-budget" class="search-input" style="padding-left: 20px;" placeholder="e.g. 5000" value="${this.formData.budget}">
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 16px;">
            <button class="btn btn-secondary" onclick="PostProjectView.prevStep(3)">← Back</button>
            <button class="btn btn-primary" onclick="PostProjectView.nextStep(3)">Next: Required Skills →</button>
          </div>
        </div>
      `;
    }

    if (this.step === 4) {
      return `
        <h2 style="font-size: 24px; margin-bottom: 8px;">Step 4: Tag Required Skills & Publish</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">Add technology tags to match with qualified freelancers.</p>

        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Skills (comma separated)</label>
            <input type="text" id="post-skills" class="search-input" style="padding-left: 20px;" placeholder="React, Node.js, TypeScript, PostgreSQL, UI/UX" value="${this.formData.skills.join(', ')}">
          </div>

          <div style="background: var(--bg-input); padding: 20px; border-radius: var(--radius-md); font-size: 14px;">
            <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">🚀 Ready to Publish on Step In</div>
            <div style="color: var(--text-secondary);">Your job posting will immediately appear on the project marketplace with full instant search and auto-complete indexing.</div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 16px;">
            <button class="btn btn-secondary" onclick="PostProjectView.prevStep(4)">← Back</button>
            <button class="btn btn-emerald" onclick="PostProjectView.submitProject()">Publish Job Live</button>
          </div>
        </div>
      `;
    }
  },

  nextStep(fromStep) {
    if (fromStep === 1) {
      this.formData.title = document.getElementById('post-title')?.value || '';
      this.formData.category = document.getElementById('post-category')?.value || 'Web Development';
      const locTypeRadio = document.querySelector('input[name="locType"]:checked');
      if (locTypeRadio) this.formData.location_type = locTypeRadio.value;
      this.formData.location_name = document.getElementById('post-location-name')?.value || 'Global / Remote';
      if (!this.formData.title.trim()) return app.showToast('Please enter a project title', 'error');
    } else if (fromStep === 2) {
      this.formData.description = document.getElementById('post-desc')?.value || '';
      const expRadio = document.querySelector('input[name="exp"]:checked');
      if (expRadio) this.formData.experience_level = expRadio.value;
      if (!this.formData.description.trim()) return app.showToast('Please enter a detailed description', 'error');
    } else if (fromStep === 3) {
      this.formData.budget = Number(document.getElementById('post-budget')?.value || 0);
      const typeRadio = document.querySelector('input[name="ptype"]:checked');
      if (typeRadio) this.formData.project_type = typeRadio.value;
      if (this.formData.budget <= 0) return app.showToast('Please enter a valid budget amount', 'error');
    }

    this.step = fromStep + 1;
    app.renderView('post-project');
  },

  prevStep(fromStep) {
    this.step = fromStep - 1;
    app.renderView('post-project');
  },

  async submitProject() {
    try {
      const skillsInput = document.getElementById('post-skills')?.value || '';
      const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
      this.formData.skills = skillsArray.length > 0 ? skillsArray : ['React', 'Node.js'];

      const res = await API.createProject(this.formData);
      app.showToast(res.message || 'Job published successfully!', 'success');
      this.step = 1;
      this.formData = { title: '', category: 'Web Development', description: '', experience_level: 'Intermediate', project_type: 'fixed', budget: 3500, duration: '1 to 3 months', skills: [] };
      app.navigate('marketplace');
    } catch (err) {
      app.showToast(err.message, 'error');
    }
  }
};
