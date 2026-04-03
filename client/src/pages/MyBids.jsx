import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/axios';

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const response = await api.get('/items/my-bids'); 
        setBids(response.data);
      } catch (error) {
        console.error('Failed to fetch your bids', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyBids();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bids</h1>
        <p className="mt-2 text-gray-600">Keep track of the items you are trying to win.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-xl font-semibold text-gray-500 animate-pulse">Loading your bids...</div>
      ) : bids.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-medium text-gray-900">You haven't bid on anything yet</h3>
          <Link to="/auctions" className="mt-4 inline-block text-indigo-600 font-bold hover:underline">Browse Market →</Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Current Price</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bids.map((item) => {
                  
                  let isWinner = false;
                  if (item.bids && item.bids.length > 0) {
                    const highestBid = item.bids.reduce((prev, current) => (prev.amount > current.amount) ? prev : current);
                    const winnerId = highestBid.bidder._id || highestBid.bidder;
                    isWinner = winnerId.toString() === user._id.toString();
                  }

                  const transactionId = item.transaction || item.transactionId || item._id;

                  return (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.status === 'Active' && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Active</span>
                        )}
                        {item.status === 'Pending_Meetup' && isWinner && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full animate-pulse">🎉 Won - Pending Meetup</span>
                        )}
                        {item.status === 'Pending_Meetup' && !isWinner && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">Lost Auction</span>
                        )}
                        {item.status === 'Sold' && isWinner && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">✅ Purchased</span>
                        )}
                        {item.status === 'Expired_Unsold' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">Expired</span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-black text-green-600">₹{item.currentPrice}</div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {item.status === 'Pending_Meetup' && isWinner ? (
                          <Link to={`/meetup/${transactionId}`} className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm transition-colors font-bold">
                            🤝 Verify OTP
                          </Link>
                        ) : (
                          <Link to={`/auctions/${item._id}`} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-4 py-2 rounded-lg font-bold transition-colors">
                            View Item
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBids;