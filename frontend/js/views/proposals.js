// Proposals Management & Creation View Component
const ProposalsView = {
  async render() {
    const isClient = app.currentUser && app.currentUser.role === 'client';

    let html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 28px;">${isClient ? 'Review Project Proposals' : 'My Submitted Proposals'}</h2>
          <p style="color: var(--text-secondary);">${isClient ? 'Evaluate bids, shortlist top candidates, or accept and fund escrow.' : 'Track proposal status and active client invitations.'}</p>
        </div>
      </div>
      <div id="proposals-list-container">Loading proposals...</div>
    `;

    setTimeout(() => this.loadProposals(), 10);
    return html;
  },

  async loadProposals() {
    try {
      const data = await API.getMyProposals();
      const container = document.getElementById('proposals-list-container');
      if (!container) return;

      if (!data.proposals || data.proposals.length === 0) {
        container.innerHTML = `
          <div class="card" style="text-align: center; padding: 48px;">
            <h3>No proposals found</h3>
            <p style="color: var(--text-muted); margin-top: 8px;">${app.currentUser?.role === 'client' ? 'No proposals have been received for your jobs yet.' : 'You have not submitted any proposals yet.'}</p>
          </div>
        `;
        return;
      }

      const isClient = app.currentUser && app.currentUser.role === 'client';

      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
          ${data.proposals.map(p => `
            <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <div style="font-size: 20px; font-weight: 700; color: var(--text-primary);">${p.project_title}</div>
                  <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
                    ${isClient ? `Applicant: <strong>${p.freelancer_name}</strong> (${p.freelancer_title || 'Freelancer'})` : `Client: <strong>${p.client_name}</strong>`}
                    • Duration: ${p.estimated_duration}
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 22px; font-weight: 800; color: var(--accent-emerald);">$${Number(p.bid_amount).toLocaleString()}</div>
                  <span class="badge ${p.status === 'accepted' ? 'badge-emerald' : p.status === 'shortlisted' ? 'badge-blue' : p.status === 'rejected' ? 'badge-amber' : 'badge-purple'}">
                    ${p.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div style="background: var(--bg-input); padding: 16px; border-radius: var(--radius-md); font-size: 14px; color: var(--text-secondary); line-height: 1.6;">
                <strong>Cover Letter:</strong><br>
                ${p.cover_letter}
              </div>

              ${isClient && p.status !== 'accepted' ? `
                <div style="display: flex; justify-content: flex-end; gap: 12px;">
                  <button class="btn btn-sm btn-secondary" onclick="ProposalsView.updateStatus('${p.id}', 'rejected')">Reject</button>
                  <button class="btn btn-sm btn-secondary" onclick="ProposalsView.updateStatus('${p.id}', 'shortlisted')">Shortlist</button>
                  <button class="btn btn-sm btn-primary" onclick="ProposalsView.acceptAndFundModal('${p.id}', '${p.freelancer_name}', ${p.bid_amount})">Accept & Fund Escrow</button>
                </div>
              ` : ''}

              ${p.status === 'accepted' ? `
                <div style="display: flex; align-items: center; gap: 10px; color: var(--accent-emerald); font-weight: 600; font-size: 13px;">
                  ✔ Contract Active & $${Number(p.bid_amount).toLocaleString()} Escrow Funded
                  <button class="btn btn-sm btn-secondary" style="margin-left: auto;" onclick="app.navigate('dashboard')">View Active Contract</button>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } catch (err) {
      console.error(err);
    }
  },

  openSubmitModal(projectId, projectTitle, suggestedBudget) {
    const bodyHtml = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px;">Your Proposed Bid Amount ($)</label>
          <input type="number" id="prop-bid" class="search-input" style="padding-left: 16px;" value="${suggestedBudget}">
        </div>

        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px;">Estimated Duration</label>
          <input type="text" id="prop-duration" class="search-input" style="padding-left: 16px;" value="3 weeks">
        </div>

        <div>
          <label style="display: block; font-weight: 600; margin-bottom: 6px; font-size: 13px;">Cover Letter & Solution Architecture Proposal</label>
          <textarea id="prop-cover" class="search-input" style="padding-left: 16px; min-height: 140px;" placeholder="Explain why you are the best fit for this project, past work experience, and technical approach..."></textarea>
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="ProposalsView.submitProposal('${projectId}')">Submit Proposal</button>
    `;

    Modal.open(`Submit Proposal: ${projectTitle}`, bodyHtml, footerHtml);
  },

  async submitProposal(projectId) {
    try {
      const bid_amount = Number(document.getElementById('prop-bid')?.value);
      const estimated_duration = document.getElementById('prop-duration')?.value;
      const cover_letter = document.getElementById('prop-cover')?.value;

      if (!bid_amount || !cover_letter) return app.showToast('Please complete all required fields', 'error');

      const res = await API.submitProposal({ project_id: projectId, bid_amount, estimated_duration, cover_letter });
      app.showToast(res.message || 'Proposal submitted successfully!', 'success');
      Modal.close();
      app.navigate('proposals');
    } catch (err) {
      app.showToast(err.message, 'error');
    }
  },

  acceptAndFundModal(proposalId, freelancerName, amount) {
    const bodyHtml = `
      <p style="margin-bottom: 16px;">Accepting this proposal will automatically create an official Step In Contract with <strong>${freelancerName}</strong> and transfer <strong>$${amount.toLocaleString()}</strong> from your wallet into Escrow Protection.</p>
      <div style="background: var(--bg-input); padding: 16px; border-radius: var(--radius-md); font-size: 13px;">
        🛡️ <strong>Guarantee:</strong> The freelancer will only receive these funds after you review and explicitly click "Release Payment" upon milestone delivery.
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-emerald" onclick="ProposalsView.updateStatus('${proposalId}', 'accepted')">Confirm & Fund $${amount.toLocaleString()} Escrow</button>
    `;

    Modal.open(`Accept & Fund Escrow ($${amount.toLocaleString()})`, bodyHtml, footerHtml);
  },

  async updateStatus(proposalId, status) {
    try {
      Modal.close();
      const res = await API.updateProposalStatus(proposalId, status);
      app.showToast(res.message, 'success');
      this.loadProposals();
    } catch (err) {
      app.showToast(err.message, 'error');
    }
  }
};
