import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          About <span className="text-indigo-600">CampusBids</span>
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          A secure, real-time marketplace engineered exclusively for the students of MANIT.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
        {/* Our Mission */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Mission</h2>
          <p className="text-lg text-gray-600 mb-4 leading-relaxed">
            Buying and selling on campus shouldn't be stressful. Public classifieds expose students to scammers, and WhatsApp groups are chaotic and unorganized. 
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            CampusBids was built to solve this. By restricting access exclusively to verified <strong>@stu.manit.ac.in</strong> email addresses and implementing a strict 4-digit OTP escrow system for physical handovers, we've created an ecosystem where trust is built into the code.
          </p>
        </div>

        {/* The Developer / Project Context */}
        <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100 shadow-sm">
          <h3 className="text-2xl font-bold text-indigo-900 mb-4">Behind the Code</h3>
          <p className="text-indigo-800 mb-6">
            This platform is a full-stack engineering project designed to handle real-world complexities like concurrent WebSocket connections, automated cron jobs, and secure JWT authentication.
          </p>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/Pradeep2007" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View GitHub Profile
            </a>
          </div>
        </div>
      </div>

      {/* Architecture / Tech Stack Grid */}
      <div className="border-t border-gray-200 pt-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">The Architecture</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="h-12 w-12 mx-auto bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-bold text-xl mb-4">M</div>
            <h4 className="font-bold text-gray-900">MongoDB</h4>
            <p className="text-sm text-gray-500 mt-2">NoSQL database handling complex schemas for users, bids, and transactions.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="h-12 w-12 mx-auto bg-gray-100 text-gray-800 rounded-lg flex items-center justify-center font-bold text-xl mb-4">E</div>
            <h4 className="font-bold text-gray-900">Express & Node</h4>
            <p className="text-sm text-gray-500 mt-2">RESTful API powering backend logic, email services, and cron jobs.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="h-12 w-12 mx-auto bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xl mb-4">R</div>
            <h4 className="font-bold text-gray-900">React & Redux</h4>
            <p className="text-sm text-gray-500 mt-2">Vite-powered SPA with global state management via Redux Toolkit.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="h-12 w-12 mx-auto bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center font-bold text-xl mb-4">⚡</div>
            <h4 className="font-bold text-gray-900">Socket.io</h4>
            <p className="text-sm text-gray-500 mt-2">Bi-directional WebSockets for instant, real-time auction bidding.</p>
          </div>

        </div>
      </div>

      <div className="text-center mt-20">
        <Link to="/contact" className="text-indigo-600 font-medium hover:text-indigo-800">
          Have questions? Get in touch →
        </Link>
      </div>

    </div>
  );
};

export default About;