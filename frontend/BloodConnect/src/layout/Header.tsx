import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsLoggedIn(!!token);

    // Listen for localStorage changes (e.g. login/logout in another tab)
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('userToken');
      setIsLoggedIn(!!updatedToken);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center font-carmila relative">
        {/* Logo and Site Name */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/Give A Life Logo 2.svg"
              alt="BloodConnect Logo"
              className="h-10 w-auto"
            />
            <span className="text-2xl font-medium">
              <span style={{ fontFamily: 'Carmila, sans-serif' }}>
                <span style={{ color: '#E53935' }}>Blood</span>
                <span style={{ color: '#1C1B1B' }}>Connect</span>
              </span>
            </span>
          </Link>
        </div>

        {/* Hamburger Button (Mobile Only) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-800 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Links & Auth Buttons */}
        <nav
          className={`absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent shadow-lg md:shadow-none flex flex-col md:flex-row items-center gap-y-4 md:gap-x-6 py-4 md:py-0 transition-all duration-300 ${
            isMobileMenuOpen ? 'block' : 'hidden'
          } md:flex`}
        >
          <ul className="flex flex-col md:flex-row gap-y-3 md:gap-x-6 text-gray-700 font-medium items-center">
            <li>
              <Link to="/" className="hover:text-red-600 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <a href="#about" className="hover:text-red-600 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-red-600 transition-colors">
                Contact
              </a>
            </li>
            <li>
              <Link to="/search" className="hover:text-red-600 transition-colors">
                Search for blood
              </Link>
            </li>
          </ul>

          {/* Auth Buttons (only show if NOT logged in) */}
          
        </nav>
        {!isLoggedIn && (
            <div className="hidden md:flex flex-col md:flex-row gap-3 items-center">
              <Link
                to="/login"
                className="text-black px-4 py-2 hover:bg-gray-700 transition-colors duration-200 text-center"
                style={{
                  backgroundColor: '#E2E8F0',
                  borderRadius: '15px',
                  boxShadow: '0 0 25px 0 rgba(226, 232, 240, 0.5)',
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors duration-200 text-center"
                style={{
                  borderRadius: '15px',
                  boxShadow: '0 0 25px 0 rgba(229, 57, 53, 0.5)',
                }}
              >
                Register
              </Link>
            </div>
          )}
      </div>
    </header>
  );
};

export default Header;
