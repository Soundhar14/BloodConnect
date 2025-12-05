import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios'; // Assuming your axios instance is here
import { AxiosError } from 'axios';

import { DonorSidebar } from '../features/dashboard/DonorNavBar';
import { DonationCountdown } from '../features/dashboard/DonationCountDown';
import { DonorProfile } from '../features/dashboard/DonorProfile';
import { DonationHistoryTable } from '../features/dashboard/DonationHistroyTable';

interface Notification {
  id: string;
  bloodGroup: string;
  location: string;
  message: string;
  timestamp: string; // ISO string
}

export const DonorDashboardPage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [userBloodGroup, setUserBloodGroup] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState<boolean>(true);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    const timer = setTimeout(() => {
      setToastMessage(null);
      setToastType(null);
    }, 3000);
    return () => clearTimeout(timer);
  };

  // Fetch donor's profile to get blood group and location
  useEffect(() => {
    const fetchDonorProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotificationsError('User not authenticated. Please log in.');
        setNotificationsLoading(false);
        return;
      }

      try {
        const response = await api.get('/donor/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = response.data.user;
        // Set userBloodGroup and userLocation only if they are non-empty strings
        setUserBloodGroup(user.userBloodGroup || null);
        setUserLocation(user.userLocation || null);
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setNotificationsError(axiosError.response?.data?.message || 'Failed to fetch user profile for notifications.');
        showToast('Failed to load profile data for notifications.', 'error');
      }
    };
    if (isLoggedIn) {
      fetchDonorProfile();
    }
  }, [isLoggedIn]);

  // Fetch notifications based on user's blood group and location
  useEffect(() => {
    const fetchNotifications = async () => {
      // Only proceed if user is logged in AND bloodGroup/location are available (not null or empty string)
      if (!isLoggedIn || !userBloodGroup || !userLocation) {
        setNotificationsLoading(false);
        return;
      }

      setNotificationsLoading(true);
      setNotificationsError(null);
      const token = localStorage.getItem('token');

      try {
        const response = await api.get(`/notify/get-note?bloodGroup=${userBloodGroup}&location=${userLocation}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data.notifications);
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setNotificationsError(axiosError.response?.data?.message || 'Failed to fetch notifications.');
        showToast('Failed to load notifications.', 'error');
      } finally {
        setNotificationsLoading(false);
      }
    };

    fetchNotifications();
  }, [isLoggedIn, userBloodGroup, userLocation]); // Depend on isLoggedIn, userBloodGroup, userLocation

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-100 font-sans">
      <DonorSidebar />

      <div id="top" className="flex-1 p-8 md:p-12 lg:p-16 overflow-auto">
        <h3 className="text-xl md:text-3xl mb-8 font-bold text-gray-800 text-left">
          <span className='text-red-600'>Personal Donor </span>
          <span className='text-gray-800'>Dashboard</span>
        </h3>

        {/* Donation Countdown Section */}
        <div className="mb-16">
          <DonationCountdown />
        </div>

        {/* Notifications Section */}
        <div className="mb-12 p-6 bg-white rounded-lg shadow-xl border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
            Emergency Notifications
          </h2>
          {notificationsLoading ? (
            <p className="text-center text-gray-600">Loading notifications...</p>
          ) : notificationsError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <p>{notificationsError}</p>
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No emergency notifications for your criteria.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notifications.map((notification, index) => ( // Added index to map function
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-5 shadow-sm"> {/* Used index as key */}
                  <p className="text-red-800 font-semibold text-lg mb-2">
                    <span className="font-bold text-red-600 mr-2">URGENT:</span> {notification.bloodGroup} Blood Needed!
                  </p>
                  <p className="text-gray-700 text-sm mb-3">{notification.message}</p>
                  <p className="text-gray-600 text-xs">
                    Location: <span className="font-medium">{notification.location}</span> | Sent: {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Donor Profile Section */}
        <div className="mb-12">
          <DonorProfile />
        </div>

        {/* Donation History Table Section */}
        <div className="mb-12">
          <DonationHistoryTable />
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