import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

import LoginPage from './pages/LoginPage.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MailSender from './pages/MailSender.jsx'; // Renamed from Dashboard
import Scheduler from './pages/Scheduler.jsx';
import Templates from './pages/Templates.jsx';
import Settings from './pages/Settings.jsx';
import Spinner from './components/Spinner.jsx';

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-background text-red-400">Authentication Error: {error.message}</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Spinner />
      </div>
    );
  }

  return (
    <Suspense fallback={<Spinner />}>
      <BrowserRouter>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#1A2035',
              color: '#E0E0E0',
              border: '1px solid #2A3149',
            },
          }}
        />
        <Routes>
          {!user ? (
            <Route path="*" element={<LoginPage />} />
          ) : (
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="mail-sender" element={<MailSender />} />
              <Route path="scheduler" element={<Scheduler />} />
              <Route path="templates" element={<Templates />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;