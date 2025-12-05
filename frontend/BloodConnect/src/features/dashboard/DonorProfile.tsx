import React, { useState, useEffect, type FormEvent } from 'react';
import app from '../../api/axios';
import { AxiosError } from 'axios';

interface DonorProfileData {
  fullName: string;
  email: string;
  bloodGroup: string;
  location: string;
  userPhone: string;
  userGender: string;
}

export const DonorProfile: React.FC = () => {
  const [profile, setProfile] = useState<DonorProfileData | null>(null);
  const [formData, setFormData] = useState<DonorProfileData | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [availabilityLoading, setAvailabilityLoading] = useState<boolean>(false);

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
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated. Please log in.');
        showToast('User not authenticated. Please log in.', 'error');
        setLoading(false);
        return;
      }

      try {
        const response = await app.get('/donor/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data.user;

        const data: DonorProfileData = {
          fullName: user.Name || '',
          email: user.userEmail || '',
          bloodGroup: user.userBloodGroup || '',
          location: user.userLocation || '',
          userPhone: user.userPhone || '',
          userGender: user.userGender || '',
        };

        setProfile(data);
        setFormData(data);
        setIsAvailable(user.availability === 'available');
        setError(null);
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
          showToast(axiosError.response.data.message, 'error');
        } else {
          console.error('Fetch profile error:', err);
          setError('Failed to fetch profile data. Please try again later.');
          showToast('Failed to fetch profile data. Please try again later.', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formData) return;

    const { name, value } = e.target;

    setFormData((prevData) =>
      prevData
        ? {
            ...prevData,
            [name]: value,
          }
        : prevData
    );
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated. Please log in.');
      showToast('User not authenticated. Please log in.', 'error');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        Name: formData.fullName,
        userEmail: formData.email,
        userBloodGroup: formData.bloodGroup,
        userLocation: formData.location,
        userPhone: formData.userPhone,
        userGender: formData.userGender,
      };

      await app.put('/donor/update-profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(formData);
      setIsEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
        showToast(axiosError.response.data.message, 'error');
      } else {
        console.error('Save profile error:', err);
        setError('Failed to update profile. Please try again.');
        showToast('Failed to update profile. Please try again.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated. Please log in.');
      showToast('User not authenticated. Please log in.', 'error');
      return;
    }

    const newAvailability = !isAvailable;
    setAvailabilityLoading(true);
    setError(null);

    try {
      await app.patch(
        '/donor/availability',
        { availability: newAvailability ? 'available' : 'unavailable' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsAvailable(newAvailability);
      showToast(`Availability set to ${newAvailability ? 'Available' : 'Unavailable'}`, 'success');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
        showToast(axiosError.response.data.message, 'error');
      } else {
        console.error('Availability toggle error:', err);
        setError('Failed to update availability.');
        showToast('Failed to update availability.', 'error');
      }
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 text-center flex items-center justify-center min-h-[200px]">
        <p className="text-xl text-gray-700 font-medium">Loading profile data...</p>
      </div>
    );
  }

  if (error && !isEditing) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center font-semibold">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile || !formData) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center font-semibold">
        <p>Profile data not available. Please try logging in again.</p>
      </div>
    );
  }

  return (
    <div id="profile" className="bg-white p-8 md:p-12 rounded-lg shadow-xl border border-gray-100 w-full relative">
      <h2 className="text-xl md:text-3xl font-semibold text-gray-700 mb-6 border-b pb-3">Your Donor Profile</h2>

      {error && isEditing && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {error && !isEditing && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label htmlFor="fullName" className="block text-gray-700 text-sm font-semibold mb-2 text-left">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="userPhone" className="block text-gray-700 text-sm font-semibold mb-2 text-left">Phone Number</label>
            <input
              type="tel"
              id="userPhone"
              name="userPhone"
              value={formData.userPhone}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2 text-left">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full p-3 border border-gray-200 bg-gray-100 rounded-lg cursor-not-allowed text-gray-600 shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="bloodGroup" className="block text-gray-700 text-sm font-semibold mb-2 text-left">Blood Group</label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 shadow-sm bg-white"
              required
            >
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label htmlFor="userGender" className="block text-gray-700 text-sm font-semibold mb-2 text-left">Gender</label>
            <select
              id="userGender"
              name="userGender"
              value={formData.userGender}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 shadow-sm bg-white"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-gray-700 text-sm font-semibold mb-2 text-left">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 shadow-sm"
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-6 ">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="bg-gray-300 text-gray-800 py-3 px-8 rounded-lg font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-red-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 text-gray-700">
          <div className="flex flex-col">
            <p className="font-semibold text-gray-500 text-sm mb-1">Full Name:</p>
            <p className="text-lg text-gray-900 font-medium">{profile.fullName}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-gray-500 text-sm mb-1">Phone Number:</p>
            <p className="text-lg text-gray-900 font-medium">{profile.userPhone}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-gray-500 text-sm mb-1">Email:</p>
            <p className="text-lg text-gray-900 font-medium">{profile.email}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-gray-500 text-sm mb-1">Blood Group:</p>
            <p className="text-lg font-bold text-red-600">{profile.bloodGroup}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-gray-500 text-sm mb-1">Gender:</p>
            <p className="text-lg text-gray-900 font-medium">{profile.userGender}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-gray-500 text-sm mb-1">Location:</p>
            <p className="text-lg text-gray-900 font-medium">{profile.location}</p>
          </div>

          <div className="col-span-1 md:col-span-2 mt-6 flex justify-end">
            <button
              onClick={() => {
                setIsEditing(true);
                setError(null);
              }}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      <hr className="border-t border-gray-200 my-8" />

      <div className="flex items-center justify-center flex-wrap gap-4 py-4"> 
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-semibold text-lg">Availability for Donation:</span>
          <button
            onClick={handleAvailabilityToggle}
            disabled={availabilityLoading}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isAvailable ? 'bg-red-600 focus:ring-red-500' : 'bg-gray-300 focus:ring-gray-500'
            } ${availabilityLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
                isAvailable ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`ml-2 text-lg font-bold ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
        {availabilityLoading && (
          <span className="text-gray-500 text-sm">Updating availability...</span>
        )}
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