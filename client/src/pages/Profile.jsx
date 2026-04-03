import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    // Clear local storage token
    localStorage.removeItem('token');
    // Force a reload to clear all Redux state and boot them to the login screen
    window.location.href = '/login';
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Cover Photo Area - Updated to bg-linear-to-r */}
        <div className="h-32 bg-linear-to-r from-indigo-500 to-purple-600"></div>
        
        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="relative -mt-16 mb-6">
            <div className="h-32 w-32 bg-white rounded-full p-2 shadow-lg">
              <div className="h-full w-full bg-indigo-100 rounded-full flex items-center justify-center text-4xl font-black text-indigo-600 uppercase">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 text-lg mt-1">{user.email}</p>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Verified MANIT Student ✓
              </div>
            </div>
            
            {/* Trust Score Box - Updated to min-w-30 */}
            <div className="text-center bg-gray-50 p-4 rounded-xl border border-gray-100 min-w-30">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Trust Score</p>
              <p className={`text-4xl font-black ${user.creditScore >= 100 ? 'text-green-600' : 'text-yellow-500'}`}>
                {user.creditScore}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 mt-8 flex justify-end">
            <button
              onClick={handleLogout}
              className="px-6 py-2 border-2 border-red-100 text-red-600 font-bold rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;