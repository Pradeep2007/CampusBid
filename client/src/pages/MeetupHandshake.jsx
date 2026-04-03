import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const MeetupHandshake = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/transactions/verify-code', {
        transactionId,
        code
      });
      setIsVerified(true);
      // We use the response here!
      setSuccessMsg(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalDecision = async (action) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/transactions/complete', {
        transactionId,
        action // 'Accept' or 'Reject'
      });
      
      // We now use the response here to fix the linter warning!
      setSuccessMsg(`${response.data.message} Redirecting to dashboard...`);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} transaction.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-indigo-600 py-6 px-8 text-center">
          <h2 className="text-2xl font-bold text-white tracking-wide">Secure Item Handover</h2>
          <p className="text-indigo-100 mt-2 text-sm">Meet the seller in person to complete this step.</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <p className="text-sm font-medium text-green-700">{successMsg}</p>
            </div>
          )}

          {/* Step 1: Verification */}
          {!isVerified ? (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-2">Step 1: Verify Meetup</h3>
                <p className="text-sm text-blue-600">Ask the seller for the 4-digit code sent to their college email. Entering this proves you are physically together.</p>
              </div>

              <form onSubmit={handleVerifyCode} className="flex flex-col items-center">
                <label className="block text-sm font-medium text-gray-700 mb-3">Enter 4-Digit Handshake Code</label>
                <input
                  type="text"
                  maxLength="4"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                  className="w-32 text-center text-4xl tracking-[0.5em] font-black px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-0 focus:border-indigo-600 transition-colors placeholder-gray-200"
                  placeholder="0000"
                />
                <button
                  type="submit"
                  disabled={isLoading || code.length !== 4}
                  className={`mt-6 w-full sm:w-auto px-8 py-3 rounded-xl text-white font-bold text-lg transition-all ${code.length === 4 && !isLoading ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  {isLoading ? 'Verifying...' : 'Unlock Inspection'}
                </button>
              </form>
            </div>
          ) : (
            
            /* Step 2: Final Decision (Visible only after code is verified) */
            <div className="space-y-6 animate-fadeIn">
               <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                <h3 className="font-bold text-green-800 text-lg">Code Verified! ✓</h3>
                <p className="text-sm text-green-600 mt-1">You may now inspect the item. Does it match the description?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <button
                  onClick={() => handleFinalDecision('Accept')}
                  disabled={isLoading}
                  className="flex flex-col items-center justify-center p-6 bg-white border-2 border-green-500 rounded-xl hover:bg-green-50 transition-colors group"
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🤝</span>
                  <span className="font-bold text-green-700 text-lg">Accept Item</span>
                  <span className="text-xs text-green-600 text-center mt-2">Item is good. +5 Trust Score to both users.</span>
                </button>

                <button
                  onClick={() => handleFinalDecision('Reject')}
                  disabled={isLoading}
                  className="flex flex-col items-center justify-center p-6 bg-white border-2 border-red-500 rounded-xl hover:bg-red-50 transition-colors group"
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">⚠️</span>
                  <span className="font-bold text-red-700 text-lg">Reject Item</span>
                  <span className="text-xs text-red-600 text-center mt-2">Item is damaged/fake. Item will be flagged.</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetupHandshake;