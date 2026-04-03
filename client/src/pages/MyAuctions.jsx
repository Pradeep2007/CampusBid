import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const MyAuctions = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyAuctions = async () => {
      try {
        // Assuming your backend has a route built for this, or filters by the logged-in user's token
        const response = await api.get('/items/my-listings'); 
        setItems(response.data);
      } catch (error) {
        console.error('Failed to fetch your auctions', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyAuctions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <p className="mt-2 text-gray-600">Track the items you are selling on campus.</p>
        </div>
        <Link to="/auctions/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
          + New Listing
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-xl font-semibold text-gray-500">Loading your items...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-medium text-gray-900">You haven't listed any items yet</h3>
          <p className="text-gray-500 mt-2">Clear out your dorm room and make some cash.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                  {item.category}
                </span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${new Date(item.endTime) < new Date() ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {new Date(item.endTime) < new Date() ? 'ENDED' : 'ACTIVE'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{item.title}</h3>
              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Current Highest Bid</p>
                  <p className="text-2xl font-black text-green-600">₹{item.currentPrice}</p>
                </div>
                <Link to={`/auctions/${item._id}`} className="text-indigo-600 font-bold hover:text-indigo-800">
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAuctions;