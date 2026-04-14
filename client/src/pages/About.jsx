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

      <div className="max-w-4xl mx-auto mb-20">
        {/* Our Mission */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Mission</h2>
          <p className="text-lg text-gray-600 mb-4 leading-relaxed">
            Buying and selling on campus shouldn't be stressful. Public classifieds expose students to scammers, and WhatsApp groups are chaotic and unorganized. 
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            CampusBids was built to solve this. By restricting access exclusively to verified <strong>@stu.manit.ac.in</strong> email addresses and implementing a strict 4-digit OTP escrow system for physical handovers, we've created an ecosystem where trust is built into the code.
          </p>
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