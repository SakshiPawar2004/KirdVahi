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
    } catch (err: any) {
      console.error('Error loading schools:', err);
      // Check if it's a Firebase configuration error
      if (err?.message?.includes('Firebase') || err?.code === 'failed-precondition') {
        setError('Firebase कॉन्फिगरेशन त्रुटी. कृपया .env फाइल तपासा आणि Firebase सेटिंग्ज व्हेरिफाई करा.');
      } else {
        setError('शाळा लोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
      }
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
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: "url('/classroom.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-800 font-medium">शाळा लोड होत आहे...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative px-4"
        style={{
          backgroundImage: "url('/classroom.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl p-8 max-w-md w-full">
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
    <div 
      className="min-h-screen py-12 px-4 relative"
      style={{
        backgroundImage: "url('/classroom.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for content visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Content container with backdrop blur for better readability */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Building2 className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            शाळा निवडा
          </h1>
          <p className="text-white text-lg drop-shadow-md">
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
                className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-2xl p-8 text-center transition-all duration-200 hover:scale-105 border-2 border-white hover:border-amber-400 flex items-center justify-center"
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


