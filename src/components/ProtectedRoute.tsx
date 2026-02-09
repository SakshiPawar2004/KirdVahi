import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    // Check if admin is logged in for a different school
    const adminSession = localStorage.getItem('admin_session');
    
    if (adminSession === 'true') {
      // Admin is logged in but viewing a different school
      // Redirect to home page (viewer mode) instead of login
      return <Navigate to="/" replace />;
    } else {
      // No admin session at all - redirect to login
      return <Navigate to="/admin/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;