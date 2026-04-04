import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import api from '../api/axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', otp: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setStep(1);
    setError('');
    setFormData({ name: '', email: '', password: '', phone: '', otp: '' });
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');

    const emailLower = formData.email.trim().toLowerCase();
    if (!emailLower.endsWith('@stu.manit.ac.in')) {
      setError('Please provide your official @stu.manit.ac.in email address.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/request-otp', { email: emailLower });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin 
        ? { email: formData.email.trim().toLowerCase(), password: formData.password }
        : { ...formData, email: formData.email.trim().toLowerCase() };

      const response = await api.post(endpoint, payload);
      
      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.token
      }));
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : (step === 1 ? 'Create a new account' : 'Verify Email')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={handleToggle}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isLogin ? 'Sign up here' : 'Sign in here'}
            </button>
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={isLogin ? handleSubmit : (step === 1 ? handleRequestOTP : handleSubmit)}>
          {!isLogin && step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number (WhatsApp preferred)</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  title="Please enter a valid 10-digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">College Email Address</label>
            <input
              name="email"
              type="email"
              required
              disabled={!isLogin && step === 2}
              placeholder="2311201111@stu.manit.ac.in"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm outline-none ${(!isLogin && step === 2) ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-indigo-500 focus:border-indigo-500'}`}
            />
          </div>

          {step === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                minLength="6"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none"
              />
            </div>
          )}

          {!isLogin && step === 2 && (
            <div className="animate-in fade-in duration-500">
              <label className="block text-sm medium text-indigo-700 font-bold">One-Time Password (OTP)</label>
              <input
                name="otp"
                type="text"
                required
                maxLength="6"
                placeholder="6-digit code"
                value={formData.otp}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-4 border-2 border-indigo-300 text-center text-xl font-bold rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-indigo-50 outline-none"
              />
              <p className="mt-2 text-xs text-indigo-600 italic text-center">Check your MANIT Outlook inbox for the code.</p>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="w-full mt-2 text-xs text-gray-500 hover:text-indigo-600 transition-colors"
              >
                ← Edit details or fix email
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg active:scale-95`}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : (step === 1 ? 'Send OTP' : 'Verify & Sign Up'))}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;