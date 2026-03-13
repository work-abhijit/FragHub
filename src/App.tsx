import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Receipt } from './pages/Receipt';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-dark-900" />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Public Report Page */}
        <Route path="/report.aspx" element={<Receipt />} />
        <Route path="/receipt/:sessionId" element={<Receipt />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
