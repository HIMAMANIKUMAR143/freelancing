import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/Toast';

import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import { PostProject } from './pages/PostProject';
import { Proposals } from './pages/Proposals';
import { Dashboard } from './pages/Dashboard';
import { Wallet } from './pages/Wallet';
import { Chat } from './pages/Chat';
import { Admin } from './pages/Admin';

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          
          <main className="container" style={{ minHeight: '80vh' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/post-project" element={<PostProject />} />
              <Route path="/proposals" element={<Proposals />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>

          <AuthModal />
          <ToastContainer />
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};
