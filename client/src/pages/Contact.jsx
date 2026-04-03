import React, { useState } from 'react';
import api from '../api/axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(''); // Added proper error state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(''); // Clear any previous errors

    try {
      await api.post('/contact', formData);
      
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      // Warning fixed: We are now actively using the 'err' variable!
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Get in <span className="text-indigo-600">Touch</span>
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          Having trouble with an auction or need to report a user? The CampusBids admin team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Left Side: Contact Information */}
        <div className="bg-indigo-600 p-10 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <p className="text-indigo-100 mb-8 leading-relaxed">
              We try to respond to all student inquiries within 24 hours. For urgent meetup disputes, please include your Transaction ID in your message.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <p className="font-medium">MANIT Campus</p>
                  <p className="text-indigo-200 text-sm">Bhopal, Madhya Pradesh</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">✉️</span>
                </div>
                <div>
                  <p className="font-medium">Support Email</p>
                  <p className="text-indigo-200 text-sm">support.campusbids@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">🛡️</span>
                </div>
                <div>
                  <p className="font-medium">Trust & Safety</p>
                  <p className="text-indigo-200 text-sm">Report a user or listing</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-sm text-indigo-300">
            <p>© {new Date().getFullYear()} CampusBids. Built for MANIT students.</p>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="p-10">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {isSubmitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-4xl mb-6">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600">
                Thank you for reaching out. A campus admin will review your message and get back to your student email shortly.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-8 text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
              >
                Send another message →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Rahul Sharma"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="@stu.manit.ac.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="" disabled>Select a topic...</option>
                  <option value="General Question">General Question</option>
                  <option value="Report a User/Item">Report a User or Item</option>
                  <option value="Meetup Dispute">Meetup Dispute (Need Admin)</option>
                  <option value="Bug Report">Found a Bug</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  placeholder="How can we help you today?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg text-white font-bold text-lg shadow-md transition-all ${isSubmitting ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;