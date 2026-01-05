import React, { useState, useEffect } from 'react';
import { useSchool, School } from '../contexts/SchoolContext';
import { useNavigate } from 'react-router-dom';
import { School as SchoolIcon, Building2, Loader2 } from 'lucide-react';
import { schoolService } from '../services/schoolService';
import SchoolInitializer from './SchoolInitializer';

const SchoolSelection: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectSchool } = useSchool();
  const navigate = useNavigate();

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoading(true);
      setError(null);
      const schoolsData = await schoolService.getAll();
      setSchools(schoolsData);
    } catch (err) {
      console.error('Error loading schools:', err);
      setError('शाळा लोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSchool = (school: School) => {
    selectSchool(school);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">शाळा लोड होत आहे...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <SchoolIcon className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">त्रुटी</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadSchools}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              पुन्हा प्रयत्न करा
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            शाळा निवडा
          </h1>
          <p className="text-gray-600">
            कृपया आपली शाळा निवडा
          </p>
        </div>

        {schools.length === 0 ? (
          <SchoolInitializer />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <button
                key={school.id}
                onClick={() => handleSelectSchool(school)}
                className="bg-white rounded-lg shadow-md hover:shadow-xl p-8 text-center transition-all duration-200 hover:scale-105 border-2 border-transparent hover:border-amber-500 flex items-center justify-center"
              >
                <h3 className="text-2xl font-bold text-gray-800">
                  {school.name}
                </h3>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolSelection;


