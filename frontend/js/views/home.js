// Landing Page View Component
const HomeView = {
  render() {
    return `
      <!-- Hero Section -->
      <section style="padding: 60px 0 80px; text-align: center; position: relative;">
        <span class="badge badge-purple" style="margin-bottom: 20px; font-size: 13px; padding: 6px 16px;">
          ⚡ Guaranteed Escrow Protection & Sub-Second Instant Search
        </span>
        <h1 style="font-size: 56px; font-weight: 900; line-height: 1.1; margin-bottom: 24px; max-width: 900px; margin-left: auto; margin-right: auto;">
          The Premier Marketplace for <span style="background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Elite Freelance Talent</span>
        </h1>
        <p style="font-size: 20px; color: var(--text-secondary); max-width: 700px; margin: 0 auto 36px; font-weight: 400;">
          Connect with top 1% software engineers, AI architects, and UI/UX designers. Fund milestones safely with integrated 256-bit encrypted Escrow.
        </p>

        <!-- CTA Buttons -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 48px;">
          <button class="btn btn-primary" style="padding: 14px 32px; font-size: 16px;" onclick="app.navigate('marketplace')">
            Explore Marketplace
          </button>
          <button class="btn btn-secondary" style="padding: 14px 32px; font-size: 16px;" onclick="app.navigate('post-project')">
            Post a Project (Client)
          </button>
        </div>

        <!-- Quick Skill Search Pills -->
        <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; align-items: center;">
          <span style="color: var(--text-muted); font-size: 13px; font-weight: 600;">Popular Skills:</span>
          <span class="skill-tag" style="cursor: pointer;" onclick="app.navigate('marketplace', { skill: 'React' })">React / Next.js</span>
          <span class="skill-tag" style="cursor: pointer;" onclick="app.navigate('marketplace', { skill: 'AI' })">Python / AI LLMs</span>
          <span class="skill-tag" style="cursor: pointer;" onclick="app.navigate('marketplace', { skill: 'UI/UX' })">UI/UX Design</span>
          <span class="skill-tag" style="cursor: pointer;" onclick="app.navigate('marketplace', { skill: 'DevOps' })">AWS & Kubernetes</span>
          <span class="skill-tag" style="cursor: pointer;" onclick="app.navigate('marketplace', { skill: 'Node.js' })">Node.js Microservices</span>
        </div>
      </section>

      <!-- Platform Key Metrics Bar -->
      <section style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 80px;">
        <div class="card" style="text-align: center;">
          <div class="metric-value">$4.8M+</div>
          <div class="metric-label">Escrow Protected Volume</div>
        </div>
        <div class="card" style="text-align: center;">
          <div class="metric-value">99.4%</div>
          <div class="metric-label">Client Satisfaction</div>
        </div>
        <div class="card" style="text-align: center;">
          <div class="metric-value">12,400+</div>
          <div class="metric-label">Vetted Engineers & Designers</div>
        </div>
        <div class="card" style="text-align: center;">
          <div class="metric-value">&lt; 15 mins</div>
          <div class="metric-label">Average Time to Proposal</div>
        </div>
      </section>

      <!-- How Escrow Workflow Works -->
      <section style="margin-bottom: 80px;">
        <h2 style="font-size: 32px; text-align: center; margin-bottom: 12px;">How Step In Guarantee Works</h2>
        <p style="text-align: center; color: var(--text-secondary); margin-bottom: 48px;">Complete financial security from contract start to final invoice delivery.</p>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px;">
          <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
            <div style="width: 48px; height: 48px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--accent-blue); font-size: 20px; font-weight: 800;">1</div>
            <h3 style="font-size: 20px;">Post & Fund Milestones</h3>
            <p style="color: var(--text-secondary); font-size: 14px;">Client posts a project and accepts a proposal. Funds are safely locked into Step In Escrow prior to work start.</p>
          </div>

          <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
            <div style="width: 48px; height: 48px; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--accent-indigo); font-size: 20px; font-weight: 800;">2</div>
            <h3 style="font-size: 20px;">Collaborate & Review</h3>
            <p style="color: var(--text-secondary); font-size: 14px;">Freelancers submit code, design assets, and milestone deliverables via real-time integrated chat and file attachments.</p>
          </div>

          <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
            <div style="width: 48px; height: 48px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--accent-emerald); font-size: 20px; font-weight: 800;">3</div>
            <h3 style="font-size: 20px;">Release Payment & Invoice</h3>
            <p style="color: var(--text-secondary); font-size: 14px;">Client approves the work and clicks 'Release Payment'. Funds deposit instantly to the freelancer's wallet with an official invoice.</p>
          </div>
        </div>
      </section>

      <!-- Featured Top 1% Freelancers Showcase -->
      <section>
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px;">
          <div>
            <h2 style="font-size: 32px;">Featured Top Talent</h2>
            <p style="color: var(--text-secondary);">Top rated specialists available for immediate hire.</p>
          </div>
          <button class="btn btn-secondary" onclick="app.navigate('marketplace')">View All Projects</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
          <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" class="avatar" style="width: 56px; height: 56px;">
              <div>
                <h4 style="font-size: 18px;">Alex Rivera</h4>
                <div style="color: var(--accent-blue); font-size: 13px; font-weight: 600;">Senior Full-Stack & AI Engineer</div>
                <div style="font-size: 12px; color: var(--accent-amber); font-weight: 700;">★ 4.98 (24 Jobs)</div>
              </div>
            </div>
            <p style="font-size: 13px; color: var(--text-secondary);">Specialized in Next.js, Node.js, Python AI Agents, PostgreSQL, and high-concurrency microservices.</p>
            <div class="skills-list">
              <span class="skill-tag">Next.js</span>
              <span class="skill-tag">Python</span>
              <span class="skill-tag">PostgreSQL</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; border-top: 1px solid var(--border-color); padding-top: 12px;">
              <span style="font-weight: 800; color: var(--accent-emerald); font-size: 18px;">$95 / hr</span>
              <button class="btn btn-sm btn-primary" onclick="app.switchRole('user_f1'); app.navigate('marketplace');">Hire Alex</button>
            </div>
          </div>

          <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150" class="avatar" style="width: 56px; height: 56px;">
              <div>
                <h4 style="font-size: 18px;">Sophia Chen</h4>
                <div style="color: var(--accent-blue); font-size: 13px; font-weight: 600;">Lead UI/UX & Design Systems</div>
                <div style="font-size: 12px; color: var(--accent-amber); font-weight: 700;">★ 5.00 (19 Jobs)</div>
              </div>
            </div>
            <p style="font-size: 13px; color: var(--text-secondary);">Crafting Apple-level design systems, Figma component libraries, and ultra-smooth fluid Web UI animations.</p>
            <div class="skills-list">
              <span class="skill-tag">UI/UX Design</span>
              <span class="skill-tag">Figma</span>
              <span class="skill-tag">CSS Animations</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; border-top: 1px solid var(--border-color); padding-top: 12px;">
              <span style="font-weight: 800; color: var(--accent-emerald); font-size: 18px;">$85 / hr</span>
              <button class="btn btn-sm btn-primary" onclick="app.switchRole('user_f2'); app.navigate('marketplace');">Hire Sophia</button>
            </div>
          </div>

          <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" class="avatar" style="width: 56px; height: 56px;">
              <div>
                <h4 style="font-size: 18px;">David Miller</h4>
                <div style="color: var(--accent-blue); font-size: 13px; font-weight: 600;">DevOps & Cloud Security</div>
                <div style="font-size: 12px; color: var(--accent-amber); font-weight: 700;">★ 4.95 (31 Jobs)</div>
              </div>
            </div>
            <p style="font-size: 13px; color: var(--text-secondary);">AWS Certified Solutions Architect, Terraform automation, Kubernetes clusters, and cloud security audits.</p>
            <div class="skills-list">
              <span class="skill-tag">AWS</span>
              <span class="skill-tag">Kubernetes</span>
              <span class="skill-tag">Terraform</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; border-top: 1px solid var(--border-color); padding-top: 12px;">
              <span style="font-weight: 800; color: var(--accent-emerald); font-size: 18px;">$110 / hr</span>
              <button class="btn btn-sm btn-primary" onclick="app.switchRole('user_f3'); app.navigate('marketplace');">Hire David</button>
            </div>
          </div>
        </div>
      </section>
    `;
  }
};
