import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const AuctionsList = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Textbooks', 'Electronics', 'Furniture', 'Lab Equipment', 'Stationery', 'Other'];

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const url = category !== 'All' ? `/items?category=${category}` : '/items';
        const response = await api.get(url);
        setItems(response.data);
      } catch (error) {
        console.error('Failed to fetch items', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campus Marketplace</h1>
          <p className="mt-2 text-gray-600">Find what you need from other students.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-xl font-semibold text-gray-500">Loading auctions...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-medium text-gray-900">No active auctions found</h3>
          <p className="text-gray-500 mt-2">Be the first to list an item in this category!</p>
          <Link to="/auctions/create" className="mt-4 inline-block text-indigo-600 font-bold hover:underline">Create Auction →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="p-6 grow">
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">{item.category}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Current Bid</p>
                    <p className="text-2xl font-extrabold text-green-600">₹{item.currentPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Ends In</p>
                    <p className="text-sm font-bold text-red-500">
                      {Math.max(0, Math.floor((new Date(item.endTime) - new Date()) / (1000 * 60 * 60)))}h{' '}
                      {Math.max(0, Math.floor(((new Date(item.endTime) - new Date()) / (1000 * 60)) % 60))}m
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <Link to={`/auctions/${item._id}`} className="w-full block text-center bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  View & Bid
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuctionsList;