import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSchool } from '../contexts/SchoolContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Lock, X } from 'lucide-react';
import { accountsFirebase, entriesFirebase } from '../services/firebaseService';
import { schoolService } from '../services/schoolService';

interface AdminHeaderProps {
  title?: string;
  showStats?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  title = "Admin Dashboard", 
  showStats = true 
}) => {
  const { logout } = useAuth();
  const { selectedSchool } = useSchool();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalEntries: 0,
    totalJama: 0,
    totalNave: 0
  });
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (showStats && selectedSchool) {
      loadStats();
    }
  }, [showStats, selectedSchool]);

  const loadStats = async () => {
    if (!selectedSchool) {
      setStats({
        totalAccounts: 0,
        totalEntries: 0,
        totalJama: 0,
        totalNave: 0
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Load accounts for the selected school
      const accounts = await accountsFirebase.getAll(selectedSchool.id);
      
      // Load all entries for the selected school
      const entries = await entriesFirebase.getAll(selectedSchool.id);
      
      // Calculate totals
      const jamaEntries = entries.filter(entry => entry.type === 'जमा');
      const naveEntries = entries.filter(entry => entry.type === 'नावे');
      
      const totalJama = jamaEntries.reduce((sum, entry) => sum + entry.amount, 0);
      const totalNave = naveEntries.reduce((sum, entry) => sum + entry.amount, 0);
      
      setStats({
        totalAccounts: accounts.length,
        totalEntries: entries.length,
        totalJama,
        totalNave
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({
        totalAccounts: 0,
        totalEntries: 0,
        totalJama: 0,
        totalNave: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openChangePassword = () => {
    setShowChangePassword(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess(false);
  };

  const closeChangePassword = () => {
    setShowChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!selectedSchool) {
      setPasswordError('School not selected.');
      return;
    }
    const newP = newPassword.trim();
    const confirmP = confirmPassword.trim();
    if (newP.length < 4) {
      setPasswordError('New password must be at least 4 characters.');
      return;
    }
    if (newP !== confirmP) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }
    setChangingPassword(true);
    try {
      const school = await schoolService.getById(selectedSchool.id);
      if (!school) {
        setPasswordError('School not found.');
        setChangingPassword(false);
        return;
      }
      const currentP = String(currentPassword || '').trim();
      const storedPassword = String(school.adminPassword ?? '').trim();
      if (currentP !== storedPassword) {
        setPasswordError('Current password is incorrect.');
        setChangingPassword(false);
        return;
      }
      await schoolService.update(selectedSchool.id, { adminPassword: newP });
      setPasswordSuccess(true);
      setTimeout(() => closeChangePassword(), 1500);
    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordError('Failed to update password. Please try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  const balance = stats.totalJama - stats.totalNave;

  return (
    <div className="bg-gray-800 text-white shadow-lg print:hidden">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">{title}</h1>
              <p className="text-gray-300 text-sm">Marathi Ledger Book Management</p>
            </div>
          </div>
          
          {showStats && (
            <div className="flex items-center gap-6">
              {/* Stats Cards - All in one line */}
              <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-10 rounded-lg px-3 py-2 text-center min-w-[80px]">
                  <div className="text-sm">
                    <div className="text-gray-300">एकूण खाते</div>
                    <div className="text-lg font-bold text-blue-300">
                      {loading ? '--' : stats.totalAccounts}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg px-3 py-2 text-center min-w-[80px]">
                  <div className="text-sm">
                    <div className="text-gray-300">एकूण व्यवहार</div>
                    <div className="text-lg font-bold text-green-300">
                      {loading ? '--' : stats.totalEntries}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg px-3 py-2 text-center min-w-[80px]">
                  <div className="text-sm">
                    <div className="text-gray-300">जमा</div>
                    <div className="text-lg font-bold text-yellow-300">
                      {loading ? '--' : `${stats.totalJama.toFixed(2)}`}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg px-3 py-2 text-center min-w-[80px]">
                  <div className="text-sm">
                    <div className="text-gray-300">नावे</div>
                    <div className="text-lg font-bold text-red-300">
                      {loading ? '--' : `${stats.totalNave.toFixed(2)}`}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg px-3 py-2 text-center min-w-[80px]">
                  <div className="text-sm">
                    <div className="text-gray-300">शिल्लक</div>
                    <div className="text-lg font-bold text-red-300">
                      {loading ? '--' : `${balance.toFixed(2)}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">Welcome, Admin</span>
            <button
              onClick={openChangePassword}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              title="Change password"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600" />
                Change Admin Password
              </h2>
              <button
                onClick={closeChangePassword}
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This changes the login password for <strong>{selectedSchool?.name}</strong>. You will need to use the new password next time you log in.
            </p>
            {passwordSuccess ? (
              <div className="py-4 text-center text-green-600 font-medium">
                Password updated successfully.
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    onInput={(e) => setCurrentPassword((e.target as HTMLInputElement).value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onInput={(e) => setNewPassword((e.target as HTMLInputElement).value)}
                    required
                    minLength={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter new password (min 4 characters)"
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onInput={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />
                </div>
                {passwordError && (
                  <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    {passwordError}
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeChangePassword}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white rounded-lg font-medium"
                  >
                    {changingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeader;
