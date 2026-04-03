import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // New state to handle errors

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Admin Access Denied");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <div className="p-20 text-center font-bold">Verifying Admin Credentials...</div>;

  if (error) return (
    <div className="p-20 text-center">
      <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 inline-block">
        <h2 className="text-xl font-black mb-2">Unauthorized Access</h2>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-black mb-8 text-gray-900">Admin Control Center</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-400 font-bold uppercase text-xs">Total Students</p>
          <p className="text-4xl font-black text-indigo-600">{stats?.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-400 font-bold uppercase text-xs">Active Auctions</p>
          <p className="text-4xl font-black text-green-600">{stats?.activeAuctions}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-400 font-bold uppercase text-xs">Flagged Items</p>
          <p className="text-4xl font-black text-red-500">{stats?.reportedItems?.length || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 bg-gray-50 border-b">
            <h2 className="font-black text-xl">User Directory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Trust Score</th>
                  <th className="px-6 py-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-700">{u.name}</td>
                    <td className="px-6 py-4">
                      <span className={`font-black ${u.creditScore < 60 ? 'text-red-500' : 'text-green-600'}`}>
                        {u.creditScore}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="font-black text-xl mb-6">Price Intervention Required</h2>
          {!stats?.reportedItems || stats.reportedItems.length === 0 ? (
            <p className="text-gray-400 italic">No items flagged for high prices.</p>
          ) : (
            stats.reportedItems.map(item => (
              <div key={item._id} className="flex justify-between items-center p-4 bg-red-50 rounded-xl mb-4 border border-red-100">
                <div>
                  <p className="font-bold text-red-900">{item.title}</p>
                  <p className="text-xs text-red-600">{item.feedback.tooExpensiveCount} Students complained about price</p>
                </div>
                <p className="font-black text-red-700">₹{item.currentPrice}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;