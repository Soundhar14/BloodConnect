import React, { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { AxiosError } from 'axios';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    const timer = setTimeout(() => {
      setToastMessage(null);
      setToastType(null);
    }, 3000);
    return () => clearTimeout(timer);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter your email and password.');
      showToast('Please enter your email and password.', 'error');
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        userLogin: email,
        password: password,
      });

      const { token, role, userDetail, message } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', userDetail);
      localStorage.setItem('role', role);

      showToast(message || 'Login successful!', 'success');
      login(role);

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/donor/dashboard');
      }

    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
        showToast(axiosError.response.data.message, 'error');
      } else {
        setError('Login failed. Please try again.');
        showToast('Login failed. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-white flex flex-col relative"> {/* Added relative for toast positioning */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-10">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Login to Your Account</h2>

            {error && (
              <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 px-4 py-2 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="emailOrPhone" className="sr-only">Email or Phone</label>
                <input
                  id="emailOrPhone"
                  type="text"
                  placeholder="Email or Phone"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-red-500 focus:border-red-500 text-gray-800"
                />
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-red-500 focus:border-red-500 text-gray-800"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <Link to="/forgot-password" className="text-red-600 hover:text-red-500 font-medium">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white font-semibold py-3 rounded-md hover:bg-red-700 transition"
              >
                Login
              </button>

              <p className="text-center text-sm text-gray-600">
                New here?{' '}
                <Link to="/register" className="text-red-600 font-semibold hover:underline">
                  Register Here
                </Link>
              </p>
            </form>
          </div>

          <div className="bg-red-600 text-white flex flex-col items-center justify-center p-10 relative">
            <div className="mb-6">
              <svg
                className="w-12 h-12 animate-pulse text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 21c-4.97-4.68-8-7.99-8-11.53A4.47 4.47 0 018.5 5a5.42 5.42 0 013.5 1.39A5.42 5.42 0 0115.5 5 4.47 4.47 0 0120 9.47c0 3.54-3.03 6.85-8 11.53z" />
              </svg>
            </div>
            <blockquote className="text-center max-w-xs text-lg font-semibold italic">
              “The gift of blood is the gift of life.”
            </blockquote>
            <p className="text-sm mt-2 opacity-80">– World Health Organization</p>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 transform ${
          toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
        } ${toastMessage ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};
