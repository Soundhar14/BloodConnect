import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { name: 'Dashboard', path: '#top' },
    { name: 'Donors', path: '#donorTable' },
    { name: 'Requests', path: '#requestTable' },
    { name: 'Reports', path: '#reportTable' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-64 bg-white text-gray-800 flex flex-col h-screen sticky top-0 overflow-y-auto shadow-lg">
      <div className="px-6 pt-6 pb-4 mb-4 border-b border-gray-200">
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

      <nav className="flex-1 px-4 space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={`/admin/dashboard${link.path}`}
            onClick={() => scrollToSection(link.path.substring(1))}
            className={`flex items-center p-3 rounded-lg text-lg font-medium transition-colors duration-200
              ${location.hash === link.path
                ? 'bg-red-100 text-red-700 font-bold border-l-4 border-red-600 -ml-4 pl-7'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-6 py-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-lg font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};