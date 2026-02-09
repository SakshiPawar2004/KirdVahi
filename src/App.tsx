import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { SchoolProvider } from './contexts/SchoolContext';
import { AuthProvider } from './contexts/AuthContext';
import SchoolRouteGuard from './components/SchoolRouteGuard';
import TableOfContents from './components/TableOfContents';
import LedgerPage from './components/LedgerPage';
import EntryPage from './components/EntryPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <SchoolProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-amber-50">
            <Routes>
              <Route element={<SchoolRouteGuard><Outlet /></SchoolRouteGuard>}>
                <Route path="/" element={<TableOfContents />} />
                <Route path="/ledger/:id" element={<LedgerPage />} />
                <Route path="/entry" element={<EntryPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/entry"
                  element={
                    <ProtectedRoute>
                      <EntryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/accounts"
                  element={
                    <ProtectedRoute>
                      <TableOfContents />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </SchoolProvider>
  );
}

export default App;