import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col min-h-screen -mt-8"> {/* Negative margin to offset App.jsx padding */}
      
      {/* Hero Section */}
      <section className="bg-indigo-700 text-white py-20 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            The Safest Way to Buy & Sell on <span className="text-indigo-300">Campus</span>
          </h1>
          <p className="text-xl sm:text-2xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Exclusive to MANIT students. Buy textbooks, sell electronics, and trade safely with verified peers using our secure OTP meetup system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="px-8 py-4 bg-white text-indigo-700 font-bold rounded-full text-lg hover:bg-indigo-50 transition-colors shadow-lg">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/login" className="px-8 py-4 bg-white text-indigo-700 font-bold rounded-full text-lg hover:bg-indigo-50 transition-colors shadow-lg">
                Join with @stu.manit.ac.in
              </Link>
            )}
            <Link to="/auctions" className="px-8 py-4 bg-indigo-600 border-2 border-indigo-400 text-white font-bold rounded-full text-lg hover:bg-indigo-500 transition-colors">
              Browse Live Auctions
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How CampusBids Works</h2>
            <p className="mt-4 text-lg text-gray-600">Built specifically for college life, ensuring trust and safety.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">List or Bid</h3>
              <p className="text-gray-600">Got an old drafter or textbook? List it in 60 seconds. Need a mini-fridge? Place a live bid against other students.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Win & Meet</h3>
              <p className="text-gray-600">When the timer ends, the winner gets notified. Use your college email to coordinate a meetup spot on campus.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Handshake</h3>
              <p className="text-gray-600">Exchange the item using our secure 4-digit OTP system to build your Trust Score and prevent scams.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Banner */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">100% Verified Student Community</h2>
          <p className="text-gray-600">
            Unlike Olx or Facebook Marketplace, every single user on CampusBids has been verified via the college database. Bad actors are strictly banned through our Trust Score system.
          </p>
        </div>
      </section>

    </div>
  );
};

export default Home;