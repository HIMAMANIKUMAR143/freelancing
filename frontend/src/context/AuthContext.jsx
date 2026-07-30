import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [activeUserId, setActiveUserId] = useState(() => localStorage.getItem('stepin_user_id') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState(() => localStorage.getItem('stepin_theme') || 'dark');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('register');
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stepin_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const fetchUser = async (userId = activeUserId) => {
    if (!userId) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Content-Type': 'application/json',
          'x-demo-user-id': userId
        }
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
        setActiveUserId('');
        localStorage.removeItem('stepin_user_id');
      }
    } catch (err) {
      console.error('Fetch user failed:', err);
      setCurrentUser(null);
      setActiveUserId('');
      localStorage.removeItem('stepin_user_id');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [activeUserId]);

  const login = async (email) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Sign in failed');
    
    setActiveUserId(data.user.id);
    localStorage.setItem('stepin_user_id', data.user.id);
    setCurrentUser(data.user);
    showToast(data.message, 'success');
    setAuthModalOpen(false);
    return data.user;
  };

  const register = async (formData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    setActiveUserId(data.user.id);
    localStorage.setItem('stepin_user_id', data.user.id);
    setCurrentUser(data.user);
    showToast(data.message, 'success');
    setAuthModalOpen(false);
    return data.user;
  };

  const quickDemo = async (userId) => {
    setActiveUserId(userId);
    localStorage.setItem('stepin_user_id', userId);
    await fetchUser(userId);
    showToast('Signed in via quick demo', 'info');
    setAuthModalOpen(false);
  };

  const signOut = () => {
    setActiveUserId('');
    localStorage.removeItem('stepin_user_id');
    setCurrentUser(null);
    showToast('Signed out of Step In', 'info');
  };

  const openAuthModal = (tab = 'register') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{
      activeUserId,
      currentUser,
      loading,
      theme,
      toggleTheme,
      toasts,
      showToast,
      login,
      register,
      quickDemo,
      signOut,
      authModalOpen,
      setAuthModalOpen,
      authModalTab,
      setAuthModalTab,
      openAuthModal,
      fetchUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
