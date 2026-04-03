import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="mt-2 text-gray-600">Manage your campus auctions and bids here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Credit Score Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Your Trust Score</h3>
          <div className={`mt-4 text-5xl font-extrabold ${user.creditScore >= 100 ? 'text-green-600' : user.creditScore >= 70 ? 'text-yellow-500' : 'text-red-600'}`}>
            {user.creditScore}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {user.creditScore >= 100 ? 'Excellent standing' : 'Needs improvement'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/auctions/create" className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100">
              <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xl mr-4">+</div>
              <div>
                <h4 className="font-semibold text-indigo-900">Sell an Item</h4>
                <p className="text-sm text-indigo-700">Create a new auction</p>
              </div>
            </Link>
            <Link to="/auctions" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-100">
              <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-xl mr-4">→</div>
              <div>
                <h4 className="font-semibold text-green-900">Browse Auctions</h4>
                <p className="text-sm text-green-700">Find items on campus</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;