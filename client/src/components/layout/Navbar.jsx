import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="shrink-0 flex items-center">
            <Link to="/" className="text-white font-bold text-xl tracking-wider">
              Campus<span className="text-indigo-200">Bids</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-6 items-center">
            {!isAuthenticated ? (
              <>
                <Link to="/" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                <Link to="/about" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">About</Link>
                <Link to="/contact" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</Link>
                <Link to="/login" className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-bold shadow-sm transition-all">Login / Sign Up</Link>
              </>
            ) : (
              <>
                {/* Admin-Only Link */}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="bg-amber-400 text-amber-900 hover:bg-amber-300 px-3 py-2 rounded-md text-sm font-black transition-all shadow-sm">
                    Admin Panel
                  </Link>
                )}

                <Link to="/dashboard" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
                <Link to="/auctions" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Auctions</Link>
                <Link to="/auctions/create" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Create Auction</Link>
                <Link to="/my-auctions" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">My Auctions</Link>
                <Link to="/my-bids" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">My Bids</Link>
                
                <div className="flex items-center space-x-4 ml-4 border-l border-indigo-400 pl-4">
                  <Link to="/profile" className="text-white font-semibold flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-indigo-400 flex items-center justify-center text-indigo-900 font-bold border-2 border-indigo-300">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span>{user?.name || 'User'}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-indigo-200 hover:text-white text-sm font-medium transition-colors">
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-indigo-200 hover:text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-indigo-700 px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-inner">
           {!isAuthenticated ? (
             <>
                <Link to="/" className="text-indigo-100 hover:text-white hover:bg-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                <Link to="/login" className="text-white bg-indigo-500 hover:bg-indigo-400 block px-3 py-2 rounded-md text-base font-bold mt-4">Login / Sign Up</Link>
             </>
           ) : (
             <>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-amber-900 bg-amber-400 hover:bg-amber-300 block px-3 py-2 rounded-md text-base font-black mb-4">
                    Admin Control Center
                  </Link>
                )}
                <Link to="/dashboard" className="text-indigo-100 hover:text-white hover:bg-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                <Link to="/auctions" className="text-indigo-100 hover:text-white hover:bg-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Auctions</Link>
                <Link to="/auctions/create" className="text-indigo-100 hover:text-white hover:bg-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Create Auction</Link>
                <Link to="/my-auctions" className="text-indigo-100 hover:text-white hover:bg-indigo-600 block px-3 py-2 rounded-md text-base font-medium">My Auctions</Link>
                <Link to="/profile" className="text-indigo-100 hover:text-white hover:bg-indigo-600 block px-3 py-2 rounded-md text-base font-medium">My Profile</Link>
                <button onClick={handleLogout} className="text-indigo-200 hover:text-white hover:bg-indigo-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium mt-4">Logout</button>
             </>
           )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;