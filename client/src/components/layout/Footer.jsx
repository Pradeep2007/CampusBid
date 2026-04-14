import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-indigo-600 font-black text-2xl tracking-tighter">
              Campus<span className="text-gray-900">Bids</span>
            </Link>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              The exclusive marketplace for MANIT students. Buy, sell, and bid on campus essentials with trust and transparency.
            </p>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold uppercase text-xs tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/auctions" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors">Browse Auctions</Link></li>
              <li><Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors">Dashboard</Link></li>
              <li><Link to="/auctions/create" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors">Sell an Item</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold uppercase text-xs tracking-widest mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors">Contact Support</Link></li>
              <li><span className="text-gray-600 text-sm">Bhopal, MP, India</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold uppercase text-xs tracking-widest mb-4">MANIT Links</h4>
            <ul className="space-y-2">
              <li><a href="https://www.manit.ac.in/" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors">Official Website</a></li>
              <li><a href="https://students.manit.ac.in/" className="text-gray-600 hover:text-indigo-600 text-sm transition-colors">Student Portal</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-xs">
            © {currentYear} CampusBids MANIT. Developed with ❤️ by Pradeep.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;