import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, User } from 'lucide-react';

export const Chat = () => {
  const { currentUser, openAuthModal, showToast } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch('/api/messages/conversations', {
        headers: { 'x-demo-user-id': currentUser.id }
      });
      const data = await res.json();
      if (res.ok) {
        setConversations(data.conversations || []);
        if (data.conversations && data.conversations.length > 0 && !activePartner) {
          setActivePartner(data.conversations[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchThread = async (partnerId) => {
    try {
      const res = await fetch(`/api/messages/thread/${partnerId}`, {
        headers: { 'x-demo-user-id': currentUser.id }
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [currentUser]);

  useEffect(() => {
    if (activePartner) {
      fetchThread(activePartner.user_id);
    }
  }, [activePartner]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activePartner) return;

    const textToSend = inputMessage;
    setInputMessage('');

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-user-id': currentUser.id
        },
        body: JSON.stringify({
          receiver_id: activePartner.user_id,
          message: textToSend
        })
      });
      const data = await res.json();
      if (res.ok) {
        fetchThread(activePartner.user_id);
      }
    } catch (err) {
      showToast('Failed to send message', 'error');
    }
  };

  if (!currentUser) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px', maxWidth: '600px', margin: '40px auto' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
        <h2 style={{ fontSize: '26px' }}>Account Required</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>Please sign in to access client/freelancer messaging threads.</p>
        <button className="btn btn-primary" onClick={() => openAuthModal('register')}>Sign In / Create Account</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', minHeight: '600px', padding: 0, overflow: 'hidden' }}>
        
        {/* Sidebar Conversations List */}
        <div style={{ borderRight: '1px solid var(--border-color)', background: 'var(--bg-input)' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', fontWeight: 700 }}>
            Messages & Threads
          </div>

          {loading ? (
            <div style={{ padding: '20px', color: 'var(--text-muted)' }}>Loading threads...</div>
          ) : conversations.length === 0 ? (
            <div style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>No conversations yet.</div>
          ) : (
            <div>
              {conversations.map(c => (
                <div
                  key={c.user_id}
                  onClick={() => setActivePartner(c)}
                  style={{
                    padding: '16px 20px',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--border-color)',
                    background: activePartner?.user_id === c.user_id ? 'var(--bg-card-hover)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <img src={c.avatar} alt={c.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '14px' }}>{c.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {c.last_message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Thread Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {activePartner ? (
            <>
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={activePartner.avatar} alt={activePartner.name} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{activePartner.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--accent-emerald)' }}>● Active Now</div>
                </div>
              </div>

              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '460px' }}>
                {messages.map(m => {
                  const isMe = m.sender_id === currentUser.id;
                  return (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        background: isMe ? 'var(--gradient-brand)' : 'var(--bg-input)',
                        color: isMe ? 'white' : 'var(--text-primary)',
                        padding: '12px 18px',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: '14px'
                      }}
                    >
                      <div>{m.message}</div>
                      <div style={{ fontSize: '10px', opacity: 0.7, textAlign: 'right', marginTop: '4px' }}>{m.created_at}</div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSend} style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  className="search-input"
                  style={{ paddingLeft: '20px' }}
                  placeholder="Type a message or proposal update..."
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  <Send size={16} /> Send
                </button>
              </form>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              Select a conversation to start chatting.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
