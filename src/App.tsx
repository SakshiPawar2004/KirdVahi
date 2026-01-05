import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SchoolProvider } from './contexts/SchoolContext';
import { AuthProvider } from './contexts/AuthContext';
import TableOfContents from './components/TableOfContents';
import LedgerPage from './components/LedgerPage';
import EntryPage from './components/EntryPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SchoolRouteGuard from './components/SchoolRouteGuard';
import './App.css';

function App() {
  return (
    <SchoolProvider>
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-amber-50">
          <Routes>
              <Route 
                path="/" 
                element={
                  <SchoolRouteGuard>
                    <TableOfContents />
                  </SchoolRouteGuard>
                } 
              />
              <Route 
                path="/ledger/:id" 
                element={
                  <SchoolRouteGuard>
                    <LedgerPage />
                  </SchoolRouteGuard>
                } 
              />
              <Route 
                path="/entry" 
                element={
                  <SchoolRouteGuard>
                    <EntryPage />
                  </SchoolRouteGuard>
                } 
              />
              <Route 
                path="/admin/login" 
                element={
                  <SchoolRouteGuard>
                    <AdminLogin />
                  </SchoolRouteGuard>
                } 
              />
            <Route 
              path="/admin" 
              element={
                  <SchoolRouteGuard>
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
                  </SchoolRouteGuard>
              } 
            />
            <Route 
              path="/admin/entry" 
              element={
                  <SchoolRouteGuard>
                <ProtectedRoute>
                  <EntryPage />
                </ProtectedRoute>
                  </SchoolRouteGuard>
              } 
            />
            <Route 
              path="/admin/accounts" 
              element={
                  <SchoolRouteGuard>
                <ProtectedRoute>
                  <TableOfContents />
                </ProtectedRoute>
                  </SchoolRouteGuard>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
    </SchoolProvider>
  );
}

export default App;