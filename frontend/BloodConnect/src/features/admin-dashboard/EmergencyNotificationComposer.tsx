import React, { useState, useEffect, type FormEvent } from 'react';
import api from '../../api/axios'; // Your Axios instance
import { AxiosError } from 'axios';

export const EmergencyNotificationComposer: React.FC = () => {
  const [bloodGroup, setBloodGroup] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [message, setMessage] = useState<string>(''); // New state for the message
  const [isSending, setIsSending] = useState<boolean>(false);

  const [bloodGroupOptions, setBloodGroupOptions] = useState<string[]>([]);
  const [locationOptions, setLocationOptions] = useState<string[]>([]);

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

   useEffect(() => {
    const fetchBloodGroups = async () => {
      try {
        const res = await api.get('/recipient/bloodgroup-avail');
         setBloodGroupOptions(res.data.availableBloodGroups);
      } catch (error) {
        console.error('Error fetching blood groups:', error);
        showToast('Failed to load blood groups. Please try again.', 'error');
      }
    };

    fetchBloodGroups();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get('/recipient/location-avail');
        setLocationOptions(response.data.availableLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
        showToast('Failed to load locations. Please try again.', 'error');
      }
    };

    fetchLocations();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    if (!bloodGroup || !location || !message.trim()) { 
      showToast('Please select both blood group, location, and type a message.', 'error');
      setIsSending(false);
      return;
    }

    try {
      const payload = { bloodGroup, location, message }; 
      await api.post('/notify/emergency', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      showToast('Emergency notification sent successfully!', 'success');
      setBloodGroup('');
      setLocation('');
      setMessage('');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to send notification. Please try again.';
      showToast(errorMessage, 'error');
      console.error('Error sending notification:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl border border-gray-100 relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
        Send Emergency Notification
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Blood Group Dropdown */}
        <div>
          <label htmlFor="notification-bloodGroup" className="block text-gray-700 text-left text-sm font-medium mb-1">Target Blood Group</label>
          <select
            id="notification-bloodGroup"
            name="bloodGroup"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-no-repeat bg-right-center pr-10 text-gray-900 shadow-sm"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '1.5rem', backgroundPosition: 'right 0.75rem center' }}
            disabled={isSending}
            required
          >
            <option value="">Select Blood Group</option>
            {bloodGroupOptions.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        {/* Location Dropdown */}
        <div>
          <label htmlFor="notification-location" className="block text-left text-gray-700 text-sm font-medium mb-1">Target Location</label>
          <select
            id="notification-location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-no-repeat bg-right-center pr-10 text-gray-900 shadow-sm"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '1.5rem', backgroundPosition: 'right 0.75rem center' }}
            disabled={isSending}
            required
          >
            <option value="">Select Location</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Message Textarea */}
        <div>
          <label htmlFor="notification-message" className="block text-left text-gray-700 text-sm font-medium mb-1">Message</label>
          <textarea
            id="notification-message"
            name="message"
            rows={4} // Adjust rows for desired height
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-y text-gray-900 shadow-sm"
            placeholder="Type your detailed emergency message here. This will be broadcast to relevant users."
            disabled={isSending}
            required
          ></textarea>
        </div>

        {/* Send Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSending}
          >
            {isSending ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isSending ? 'Sending...' : 'Send Notification'}
          </button>
        </div>
      </form>

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