import React, { useState, useEffect } from 'react';
import { initializeSchools, restoreMissingSchools, updateSchoolNames, updateSchoolPasswords, defaultSchools } from '../utils/initializeSchools';
import { schoolService } from '../services/schoolService';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const SchoolInitializer: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    const [hasExistingSchools, setHasExistingSchools] = useState(false);
    const [missingSchoolCount, setMissingSchoolCount] = useState(0);
    const [checkingSchools, setCheckingSchools] = useState(true);

    useEffect(() => {
        const checkExistingSchools = async () => {
            try {
                const schools = await schoolService.getAll();
                // Check if all default schools exist by comparing adminIds
                const defaultAdminIds = new Set(defaultSchools.map(s => s.adminId));
                const existingAdminIds = new Set(schools.map(s => s.adminId));
                
                // Check if all default schools are in the database
                const allSchoolsExist = Array.from(defaultAdminIds).every(id => existingAdminIds.has(id));
                setHasExistingSchools(allSchoolsExist);
                setMissingSchoolCount(Array.from(defaultAdminIds).filter(id => !existingAdminIds.has(id)).length);
            } catch (error) {
                console.error('Error checking schools:', error);
            } finally {
                setCheckingSchools(false);
            }
        };
        checkExistingSchools();
    }, []);

    const handleInitialize = async () => {
        const actionLabel = missingSchoolCount > 0 ? 'restore the missing schools in Firebase' : 'sync the default schools in Firebase';
        if (!window.confirm(`This will ${actionLabel}. Continue?`)) {
            return;
        }

        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            if (missingSchoolCount > 0 && hasExistingSchools) {
                await restoreMissingSchools();
                setStatus({ type: 'success', message: 'Missing schools restored successfully! Refreshing page...' });
            } else {
                await initializeSchools();
                setStatus({ type: 'success', message: 'Schools synchronized successfully! Refreshing page...' });
            }
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

    const handleUpdateNames = async () => {
        if (!window.confirm('This will update existing school names to the new Marathi names. Continue?')) {
            return;
        }

        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            await updateSchoolNames();
            setStatus({ type: 'success', message: 'School names updated successfully! Refreshing page...' });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error: any) {
            setStatus({ 
                type: 'error', 
                message: error.message || 'Failed to update school names. Check console for details.' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePasswords = async () => {
        if (!window.confirm('This will update school passwords in Firebase to match the current credentials (adminId as password). Continue?')) {
            return;
        }

        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            await updateSchoolPasswords();
            setStatus({ type: 'success', message: 'School passwords updated! Refreshing page...' });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error: any) {
            setStatus({ 
                type: 'error', 
                message: error.message || 'Failed to update passwords. Check console for details.' 
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
                        {hasExistingSchools ? (missingSchoolCount > 0 ? 'Restore Missing Schools' : 'Update School Names') : 'Initialize Schools'}
                    </h1>
                    <p className="text-gray-600">
                        {hasExistingSchools 
                            ? (missingSchoolCount > 0
                                ? `${missingSchoolCount} school(s) are missing from Firebase. Click below to restore them.`
                                : 'Update existing school names to the new Marathi names.')
                            : 'No schools found. Click the button below to create 6 schools.'}
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">
                        {missingSchoolCount > 0 ? 'Schools missing from Firebase:' : 'Schools to be created:'}
                    </h2>
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

                {checkingSchools ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        {hasExistingSchools ? (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleUpdateNames}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update School Names'
                                    )}
                                </button>
                                <button
                                    onClick={handleUpdatePasswords}
                                    disabled={loading}
                                    className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Passwords'
                                    )}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleInitialize}
                                disabled={loading}
                                className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                            {missingSchoolCount > 0 ? 'Restoring...' : 'Initializing...'}
                                    </>
                                ) : (
                                        missingSchoolCount > 0 ? 'Restore Missing Schools' : 'Initialize Schools'
                                )}
                            </button>
                        )}

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

                        {!hasExistingSchools && (
                            <p className="text-sm text-gray-500 mt-4 text-center">
                                <strong>Note:</strong> After restore/init, use Admin ID as both username and password.
                                <br />
                                Example: Use the school's Admin ID for both Username and Password.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchoolInitializer;

