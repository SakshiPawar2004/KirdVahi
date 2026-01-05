import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSchool } from './SchoolContext';

interface AuthContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { selectedSchool } = useSchool();

  useEffect(() => {
    // Check if admin is already logged in for the selected school
    const adminSession = localStorage.getItem('admin_session');
    const sessionSchoolId = localStorage.getItem('admin_school_id');
    
    if (adminSession === 'true' && sessionSchoolId === selectedSchool?.id) {
      setIsAdmin(true);
    } else {
      // Clear admin session if school changed
      setIsAdmin(false);
      localStorage.removeItem('admin_session');
      localStorage.removeItem('admin_school_id');
    }
  }, [selectedSchool]);

  const login = (username: string, password: string): boolean => {
    if (!selectedSchool) {
      return false;
    }
    
    // Check credentials against the selected school's admin credentials
    if (username === selectedSchool.adminId && password === selectedSchool.adminPassword) {
      setIsAdmin(true);
      localStorage.setItem('admin_session', 'true');
      localStorage.setItem('admin_school_id', selectedSchool.id);
      return true;
    }
    return false;
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