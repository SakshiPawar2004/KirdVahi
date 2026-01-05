import React, { useState } from 'react';
import { initializeSchools, defaultSchools } from '../utils/initializeSchools';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const SchoolInitializer: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

    const handleInitialize = async () => {
        if (!window.confirm('This will create 6 schools in Firebase. Continue?')) {
            return;
        }

        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            await initializeSchools();
            setStatus({ type: 'success', message: 'Schools initialized successfully! Refreshing page...' });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error: any) {
            setStatus({ 
                type: 'error', 
                message: error.message || 'Failed to initialize schools. Check console for details.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Initialize Schools
                    </h1>
                    <p className="text-gray-600">
                        No schools found. Click the button below to create 6 schools.
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Schools to be created:</h2>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        {defaultSchools.map((school, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                                <span className="font-medium">{school.name}</span>
                                <span className="text-sm text-gray-500">
                                    Admin ID: <code className="bg-gray-200 px-2 py-1 rounded">{school.adminId}</code>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={handleInitialize}
                        disabled={loading}
                        className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Initializing...
                            </>
                        ) : (
                            'Initialize Schools'
                        )}
                    </button>

                    {status.type && (
                        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
                            status.type === 'success' 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                            {status.type === 'success' ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <XCircle className="w-5 h-5" />
                            )}
                            <span>{status.message}</span>
                        </div>
                    )}

                    <p className="text-sm text-gray-500 mt-4 text-center">
                        <strong>Note:</strong> After initialization, you can log in using the admin credentials shown above.
                        <br />
                        Example: School 1 → Username: <code>admin1</code>, Password: <code>School1@2024</code>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SchoolInitializer;

