import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import api from '../api/axios';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${id}`);
        setItem(response.data);
        // Default bid to current price + 10 for convenience
        setBidAmount(response.data.currentPrice + 10);
      } catch (err) {
        setError(err.response?.data?.message || 'Item not found');
      }
    };

    fetchItem();
    socket.emit('joinAuction', id);

    socket.on('bidUpdate', (data) => {
      if (data.itemId === id) {
        setItem((prev) => ({
          ...prev,
          currentPrice: data.newPrice,
          bids: [data.newBid, ...prev.bids]
        }));
        setBidAmount(data.newPrice + 10);
      }
    });

    socket.on('bidError', (data) => {
      setError(data.message);
    });

    return () => {
      socket.emit('leaveAuction', id);
      socket.off('bidUpdate');
      socket.off('bidError');
    };
  }, [id]);

  const handleBid = (e) => {
    e.preventDefault();
    setError('');
    
    if (user.creditScore < 50) {
      return setError('Your credit score is too low to bid.');
    }
    
    if (user._id === item.seller._id) {
      return setError('You cannot bid on your own item.');
    }

    socket.emit('placeBid', {
      itemId: id,
      userId: user._id,
      amount: Number(bidAmount)
    });
  };

  const handleFeedback = async (type) => {
    try {
      await api.post(`/items/${id}/feedback`, { feedbackType: type });
      setFeedbackMsg(`Thanks for your feedback: ${type}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting feedback');
    }
  };

  if (!item) return <div className="text-center py-20 animate-pulse font-bold text-gray-400">Loading Auction Details...</div>;

  const isSeller = user._id === item.seller._id;
  const isExpired = new Date(item.endTime) < new Date();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">
        
        {/* Left Column: Image and Description */}
        <div className="w-full lg:w-3/5 bg-gray-50 flex flex-col border-r border-gray-100">
          <div className="relative aspect-square md:aspect-video lg:aspect-auto lg:h-125 overflow-hidden bg-gray-200">
            <img 
              src={item.image || 'https://via.placeholder.com/600x400?text=No+Image+Available'} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-full shadow-lg uppercase tracking-widest">
                {item.category}
              </span>
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-black text-gray-900 mb-4">{item.title}</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 whitespace-pre-wrap">{item.description}</p>
            
            <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                {item.seller.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Listed by</p>
                <p className="font-bold text-gray-900">{item.seller.name}</p>
                <p className="text-xs text-gray-500">Trust Score: <span className="font-bold text-green-600">{item.seller.creditScore}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bidding Actions */}
        <div className="w-full lg:w-2/5 p-8 lg:p-12 bg-white flex flex-col justify-center">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Current Highest Bid</p>
            <p className="text-7xl font-black text-indigo-600">₹{item.currentPrice}</p>
            <p className="text-gray-400 text-sm mt-2">Total Bids: {item.bids?.length || 0}</p>
          </div>

          {error && <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg text-sm font-bold">{error}</div>}
          {feedbackMsg && <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg text-sm font-bold">{feedbackMsg}</div>}

          {!isExpired && !isSeller ? (
            <form onSubmit={handleBid} className="space-y-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
                <input
                  type="number"
                  required
                  min={item.currentPrice + 1}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full text-center text-3xl font-black pl-10 pr-4 py-5 border-4 border-gray-100 rounded-2xl focus:border-indigo-600 focus:ring-0 transition-all outline-none"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white font-black text-xl py-5 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:translate-y-0"
              >
                PLACE YOUR BID
              </button>
            </form>
          ) : isExpired ? (
            <div className="text-center p-6 bg-gray-100 text-gray-500 font-black rounded-2xl border-2 border-dashed border-gray-300 uppercase tracking-widest">
              Auction Closed
            </div>
          ) : (
            <div className="text-center p-6 bg-indigo-50 text-indigo-700 font-bold rounded-2xl border border-indigo-100">
              You are managing this listing
            </div>
          )}

          {/* Feedback Buttons */}
          {!isSeller && !isExpired && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <p className="text-center text-xs font-black text-gray-300 uppercase tracking-widest mb-4">Market Sentiment</p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleFeedback('Too Expensive')} 
                  className="flex-1 bg-white border-2 border-gray-100 hover:border-red-100 hover:text-red-600 text-gray-400 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-tighter"
                >
                  Price Too High
                </button>
                <button 
                  onClick={() => handleFeedback('Not Needed')} 
                  className="flex-1 bg-white border-2 border-gray-100 hover:border-indigo-100 hover:text-indigo-600 text-gray-400 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-tighter"
                >
                  Low Demand
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;