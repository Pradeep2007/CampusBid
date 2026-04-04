import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const MyAuctions = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyAuctions = async () => {
      try {
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

  const handleReportBuyer = async (transactionId) => {
    const isSure = window.confirm("⚠️ Are you sure? This will cancel the sale and penalize the buyer's trust score by 15 points.");
    if (!isSure) return;

    try {
      const response = await api.post('/transactions/report-buyer', { transactionId });
      alert(response.data.message);
      
      setItems(items.map(item => {
        const currentTxId = item.transaction || item.transactionId || item._id;
        if (currentTxId === transactionId) {
          return { ...item, status: 'Expired_Unsold' };
        }
        return item;
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to report buyer.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <p className="mt-2 text-gray-600">Track the items you are selling on campus.</p>
        </div>
        <Link to="/auctions/create" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-sm transition-colors">
          + New Listing
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-xl font-semibold text-gray-500 animate-pulse">Loading your items...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-medium text-gray-900">You haven't listed any items yet</h3>
          <p className="text-gray-500 mt-2">Clear out your dorm room and make some cash.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const transactionId = item.transaction || item.transactionId || item._id;

            return (
              <div key={item._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
                <div className="h-40 bg-gray-200 w-full overflow-hidden relative">
                  <img 
                    src={(item.images && item.images.length > 0) ? item.images[0] : 'https://via.placeholder.com/400x200?text=No+Image'} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.status === 'Pending_Meetup' && (
                    <div className="absolute inset-0 bg-blue-600/80 flex items-center justify-center">
                      <span className="text-white font-black tracking-widest uppercase shadow-sm">Meetup Required</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col grow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                      {item.category}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      item.status === 'Active' ? 'bg-green-100 text-green-700' : 
                      item.status === 'Sold' ? 'bg-indigo-100 text-indigo-700' :
                      item.status === 'Pending_Meetup' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Final/Current Bid</p>
                    <p className="text-3xl font-black text-green-600 mb-4">₹{item.currentPrice}</p>
                    
                    {item.status === 'Pending_Meetup' ? (
                      <div className="space-y-2">
                        <Link to={`/auctions/${item._id}`} className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
                          📧 Check Email & Meet Buyer
                        </Link>
                        <button 
                          onClick={() => handleReportBuyer(transactionId)}
                          className="block text-center w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded-xl border border-red-100 transition-colors text-sm"
                        >
                          ⚠️ Report No-Show / Lowball
                        </button>
                      </div>
                    ) : (
                      <Link to={`/auctions/${item._id}`} className="block text-center w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-xl border border-gray-200 transition-colors">
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAuctions;