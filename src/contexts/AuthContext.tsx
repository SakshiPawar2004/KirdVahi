import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSchool } from './SchoolContext';
import { schoolService } from '../services/schoolService';

interface AuthContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { selectedSchool } = useSchool();

  useEffect(() => {
    // Check if admin is already logged in
    // Admin mode is only active for the school they logged into
    // Other schools will be in viewer mode, but session stays active
    const adminSession = localStorage.getItem('admin_session');
    const adminSchoolId = localStorage.getItem('admin_school_id');
    
    if (adminSession === 'true' && selectedSchool && adminSchoolId === selectedSchool.id) {
      // Admin is logged in and viewing their own school - admin mode
      setIsAdmin(true);
    } else if (adminSession === 'true') {
      // Admin is logged in but viewing a different school - viewer mode
      // Keep session active, just don't show admin features
      setIsAdmin(false);
    } else {
      // No admin session - viewer mode
      setIsAdmin(false);
    }
  }, [selectedSchool]);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (!selectedSchool) {
      return false;
    }
    try {
      const u = String(username || '').trim();
      const p = String(password || '').trim();
      const school = await schoolService.getById(selectedSchool.id);
      const adminId = String(school?.adminId ?? '').trim();
      const adminPassword = String(school?.adminPassword ?? '').trim();
      if (!school || u !== adminId || p !== adminPassword) {
        return false;
      }
      setIsAdmin(true);
      localStorage.setItem('admin_session', 'true');
      localStorage.setItem('admin_school_id', selectedSchool.id);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_school_id');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};