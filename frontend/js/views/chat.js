// Real-time Chat View Component
const ChatView = {
  activePartnerId: null,

  async render() {
    let html = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="font-size: 28px;">Messages & Collaboration</h2>
      </div>

      <div class="chat-container">
        <!-- Sidebar Conversation List -->
        <div class="chat-sidebar">
          <div class="chat-search">
            <input type="text" class="search-input" style="padding: 10px 16px; font-size: 13px;" placeholder="Filter conversations...">
          </div>
          <div id="conversations-list-container" class="conversation-list">Loading chats...</div>
        </div>

        <!-- Main Chat Area -->
        <div id="chat-main-area" class="chat-main">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
            Select a conversation to view messages.
          </div>
        </div>
      </div>
    `;

    setTimeout(() => this.loadConversations(), 10);
    return html;
  },

  async loadConversations() {
    try {
      const { conversations } = await API.getConversations();
      const container = document.getElementById('conversations-list-container');
      if (!container) return;

      if (!conversations || conversations.length === 0) {
        container.innerHTML = `<div style="padding: 20px; color: var(--text-muted); font-size: 13px;">No conversations yet.</div>`;
        return;
      }

      container.innerHTML = conversations.map(c => `
        <div class="conversation-item ${this.activePartnerId === c.partner.id ? 'active' : ''}" onclick="ChatView.openThread('${c.partner.id}')">
          <img src="${c.partner.avatar}" class="avatar">
          <div style="flex: 1; overflow: hidden;">
            <div style="font-weight: 700; color: var(--text-primary); font-size: 14px;">${c.partner.name}</div>
            <div style="color: var(--text-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.lastMessage}</div>
          </div>
        </div>
      `).join('');

      // Auto open first conversation if none selected
      if (!this.activePartnerId && conversations.length > 0) {
        this.openThread(conversations[0].partner.id);
      }
    } catch (err) {
      console.error(err);
    }
  },

  async openThread(partnerId) {
    try {
      this.activePartnerId = partnerId;
      const { partner, messages } = await API.getThread(partnerId);

      const mainArea = document.getElementById('chat-main-area');
      if (!mainArea) return;

      mainArea.innerHTML = `
        <div class="chat-header">
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="${partner.avatar}" class="avatar">
            <div>
              <div style="font-weight: 700; font-size: 16px;">${partner.name}</div>
              <div style="color: var(--text-muted); font-size: 12px;">${partner.role.toUpperCase()} • Active Now</div>
            </div>
          </div>
        </div>

        <div id="messages-body" class="chat-messages">
          ${messages.map(m => `
            <div class="message-bubble ${m.sender_id === app.currentUser.id ? 'outgoing' : 'incoming'}">
              <div>${m.content}</div>
              ${m.attachment_name ? `<div style="margin-top: 8px; padding: 6px 10px; background: rgba(0,0,0,0.2); border-radius: var(--radius-sm); font-size: 12px;">📎 ${m.attachment_name}</div>` : ''}
              <div class="message-time">${new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          `).join('')}
        </div>

        <div class="chat-footer">
          <input type="text" id="chat-input-field" class="chat-input" placeholder="Type a message..." onkeypress="if(event.key==='Enter') ChatView.sendMessage()">
          <button class="btn btn-primary" onclick="ChatView.sendMessage()">Send</button>
        </div>
      `;

      // Auto scroll to bottom
      const body = document.getElementById('messages-body');
      if (body) body.scrollTop = body.scrollHeight;

      this.loadConversations();
    } catch (err) {
      console.error(err);
    }
  },

  async sendMessage() {
    try {
      const input = document.getElementById('chat-input-field');
      const content = input?.value;
      if (!content || !content.trim()) return;

      input.value = '';

      await API.sendMessage({
        receiver_id: this.activePartnerId,
        content: content
      });

      this.openThread(this.activePartnerId);
    } catch (err) {
      app.showToast(err.message, 'error');
    }
  }
};
