import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setUser } from './store/slices/authSlice';
import api from './api/axios';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateAuction from './pages/CreateAuction';
import AuctionsList from './pages/AuctionList';
import ItemDetail from './pages/ItemDetail';
import MeetupHandshake from './pages/MeetupHandshake';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import MyAuctions from './pages/MyAuctions';
import MyBids from './pages/MyBids';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const hydrateUser = async () => {
      if (token && !user) {
        try {
          const response = await api.get('/auth/profile'); 
          dispatch(setUser(response.data));
        } catch (error) {
          console.error("Session expired or invalid token.", error);
          dispatch(logout()); 
        }
      }
      setIsHydrating(false);
    };

    hydrateUser();
  }, [token, user, dispatch]);

  if (isHydrating && token && !user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600 font-bold">Verifying Session...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
        <Navbar />
        <main className="grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/auctions" element={<ProtectedRoute><AuctionsList /></ProtectedRoute>} />
            <Route path="/auctions/create" element={<ProtectedRoute><CreateAuction /></ProtectedRoute>} />
            <Route path="/auctions/:id" element={<ProtectedRoute><ItemDetail /></ProtectedRoute>} />
            <Route path="/my-auctions" element={<ProtectedRoute><MyAuctions /></ProtectedRoute>} />
            <Route path="/my-bids" element={<ProtectedRoute><MyBids /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/meetup/:transactionId" element={<ProtectedRoute><MeetupHandshake /></ProtectedRoute>} />

            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;