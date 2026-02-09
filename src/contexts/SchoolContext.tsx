import React, { createContext, useContext, useState, useEffect } from 'react';

export interface School {
  id: string;
  name: string;
  adminId: string;
  adminPassword: string;
}

interface SchoolContextType {
  selectedSchool: School | null;
  selectSchool: (school: School) => void;
  clearSchool: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  useEffect(() => {
    // Load selected school from sessionStorage (cleared when browser closes)
    // This ensures school selection page shows every time the app is opened
    const savedSchool = sessionStorage.getItem('selected_school');
    if (savedSchool) {
      try {
        setSelectedSchool(JSON.parse(savedSchool));
      } catch (error) {
        console.error('Error loading school from sessionStorage:', error);
        sessionStorage.removeItem('selected_school');
      }
    }
  }, []);

  const selectSchool = (school: School) => {
    setSelectedSchool(school);
    sessionStorage.setItem('selected_school', JSON.stringify(school));
  };

  const clearSchool = () => {
    setSelectedSchool(null);
    sessionStorage.removeItem('selected_school');
    // Also clear admin session when school is cleared
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_school_id');
  };

  return (
    <SchoolContext.Provider value={{ selectedSchool, selectSchool, clearSchool }}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};


