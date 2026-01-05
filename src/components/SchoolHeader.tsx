import React, { useState, useEffect, useRef } from 'react';
import { useSchool, School } from '../contexts/SchoolContext';
import { Building2, ChevronDown } from 'lucide-react';
import { schoolService } from '../services/schoolService';

const SchoolHeader: React.FC = () => {
  const { selectedSchool, selectSchool } = useSchool();
  const [isOpen, setIsOpen] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSchools = async () => {
      try {
        setLoading(true);
        const schoolsData = await schoolService.getAll();
        setSchools(schoolsData);
      } catch (error) {
        console.error('Error loading schools:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadSchools();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSchoolSelect = (school: School) => {
    selectSchool(school);
    setIsOpen(false);
  };

  if (!selectedSchool) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm print:hidden">
      <div className="container mx-auto px-4 py-2">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition-colors px-3 py-2 rounded-lg hover:bg-amber-50 border border-gray-200 hover:border-amber-300"
            title="Change School / शाळा बदला"
          >
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-medium">{selectedSchool.name}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
              {loading ? (
                <div className="px-4 py-3 text-sm text-gray-500">Loading...</div>
              ) : schools.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">No schools available</div>
              ) : (
                <div className="py-1">
                  {schools.map((school) => (
                    <button
                      key={school.id}
                      onClick={() => handleSchoolSelect(school)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-amber-50 transition-colors flex items-center gap-2 ${
                        selectedSchool.id === school.id
                          ? 'bg-amber-100 text-amber-700 font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>{school.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolHeader;

