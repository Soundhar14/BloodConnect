import React from 'react';
import './App.css';

import { Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation

import Header from './layout/Header';
import Footer from './layout/Footer';

import SearchPage from './pages/SearchPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { DonorDashboardPage } from './pages/DonorDashboardPage';

import { AdminDashboardPage } from './pages/AdminDashboardPage';


const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDonorRoute = location.pathname.startsWith('/donor');

  return (
    <div className="App flex flex-col min-h-screen font-sans">
      {!isAdminRoute && !isDonorRoute && <Header />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/donor/dashboard" element={<DonorDashboardPage />} />
          <Route path="/donor/profile" element={<DonorDashboardPage />} />
          <Route path="/donor/histroy" element={<DonorDashboardPage />} />

          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/donors" element={<AdminDashboardPage />} />
          <Route path="/admin/requests" element={<AdminDashboardPage />} />
          <Route path="/admin/reports" element={<AdminDashboardPage />} />
        </Routes>
      </main>

      {!isAdminRoute && !isDonorRoute && <Footer />} 
    </div>
  );
};

export default App;
