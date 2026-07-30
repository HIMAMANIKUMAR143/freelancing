// Reusable Accessible Modal Component
const Modal = {
  open(title, bodyHtml, footerHtml = '') {
    const overlay = document.getElementById('global-modal-overlay');
    const card = document.getElementById('global-modal-card');

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0; font-size: 20px; color: var(--text-primary);">${title}</h3>
        <button onclick="Modal.close()" style="background: transparent; border: none; color: var(--text-muted); font-size: 24px; cursor: pointer;">&times;</button>
      </div>
      <div class="modal-body" style="color: var(--text-secondary); font-size: 14px; line-height: 1.6;">
        ${bodyHtml}
      </div>
      ${footerHtml ? `<div style="display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid var(--border-color); padding-top: 20px; margin-top: 24px;">${footerHtml}</div>` : ''}
    `;

    overlay.classList.add('active');
  },

  close() {
    const overlay = document.getElementById('global-modal-overlay');
    overlay.classList.remove('active');
  }
};
