import React, { useState, useEffect, type ChangeEvent } from 'react';
import app from '../../api/axios';
import { AxiosError } from 'axios';

interface DonorRecord {
  _id: string;
  Name: string;
  userEmail: string;
  userPhone: string;
  userBloodGroup: string;
  userLocation: string;
  lastDonationDate?: string;
  availability: boolean;
}

interface BackendUserResponse {
  _id: string;
  Name: string;
  userEmail: string;
  userPhone: string;
  userBloodGroup: string;
  userLocation: string;
  lastDonationDate?: string;
  availability: 'available' | 'unavailable';
}

interface ModalFormValues {
  Name: string;
  userEmail: string;
  userPhone: string;
  userBloodGroup: string;
  userLocation: string;
  availability: 'available' | 'unavailable';
}

export const AdminDonorTable: React.FC = () => {
  const [donorList, setDonorList] = useState<DonorRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDonor, setSelectedDonor] = useState<DonorRecord | null>(null);
  const [formValues, setFormValues] = useState<ModalFormValues>({
    Name: '',
    userEmail: '',
    userPhone: '',
    userBloodGroup: '',
    userLocation: '',
    availability: 'unavailable',
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [donorToDeleteId, setDonorToDeleteId] = useState<string | null>(null);

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

  const fetchDonors = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Authentication token not found. Please log in as Admin.');
      setLoading(false);
      return;
    }

    try {
      const response = await app.get('/admin/donor-profiles/all-donors', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedDonors: DonorRecord[] = response.data.map((user: BackendUserResponse) => ({
        _id: user._id,
        Name: user.Name || 'N/A',
        userEmail: user.userEmail || 'N/A',
        userPhone: user.userPhone || 'N/A',
        userBloodGroup: user.userBloodGroup || 'N/A',
        userLocation: user.userLocation || 'N/A',
        lastDonationDate: user.lastDonationDate ? new Date(user.lastDonationDate).toLocaleDateString() : 'N/A',
        availability: user.availability === 'available',
      }));

      setDonorList(fetchedDonors);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else if (axiosError.response?.status === 403) {
        setError('Access Denied. You do not have administrator privileges.');
      } else {
        console.error('Fetch donors error:', err);
        setError('Failed to fetch donor list.');
      }
      showToast('Failed to load donor list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const openEditModal = (donor: DonorRecord) => {
    setSelectedDonor(donor);
    setFormValues({
      Name: donor.Name,
      userEmail: donor.userEmail,
      userPhone: donor.userPhone,
      userBloodGroup: donor.userBloodGroup,
      userLocation: donor.userLocation,
      availability: donor.availability ? 'available' : 'unavailable',
    });
    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDonor(null);
    setError(null);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitEdit = async () => {
    if (!selectedDonor) return;

    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('User not authenticated. Please log in.', 'error');
      return;
    }

    try {
      const response = await app.put(`/admin/donor-profiles/update-donor-profile?userId=${selectedDonor._id}`, {
        Name: formValues.Name,
        userEmail: formValues.userEmail,
        userPhone: formValues.userPhone,
        userBloodGroup: formValues.userBloodGroup,
        userLocation: formValues.userLocation,
        availability: formValues.availability,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonorList(prev => prev.map(donor =>
        donor._id === selectedDonor._id ? {
          ...donor,
          Name: response.data.user.Name,
          userEmail: response.data.user.userEmail,
          userPhone: response.data.user.userPhone,
          userBloodGroup: response.data.user.userBloodGroup,
          userLocation: response.data.user.userLocation,
          availability: response.data.user.availability === 'available',
        } : donor
      ));
      showToast('Donor record updated successfully!', 'success');
      closeModal();
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        console.error('Update donor error:', err);
        setError('Failed to update donor record.');
      }
      showToast('Failed to update donor record.', 'error');
    }
  };

  const openDeleteConfirmModal = (donorId: string) => {
    setDonorToDeleteId(donorId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteConfirmModal = () => {
    setIsDeleteModalOpen(false);
    setDonorToDeleteId(null);
  };

  const confirmDeleteDonor = async () => {
    if (!donorToDeleteId) return;

    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('User not authenticated. Please log in.', 'error');
      closeDeleteConfirmModal();
      return;
    }

    try {
      await app.delete(`/admin/donor-profiles/delete-donor?donorId=${donorToDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonorList(prev => prev.filter(donor => donor._id !== donorToDeleteId));
      showToast('Donor record deleted successfully!', 'success');
      closeDeleteConfirmModal();
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        console.error('Delete donor error:', err);
        setError('Failed to delete donor record.');
      }
      showToast('Failed to delete donor record.', 'error');
      closeDeleteConfirmModal();
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100 text-center text-gray-600">
        Loading donor list...
      </div>
    );
  }

  if (error && !isModalOpen && !isDeleteModalOpen) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center font-semibold">
        <p>{error}</p>
        <button
          onClick={fetchDonors}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div id="donorTable" className="bg-white p-6 md:p-8 rounded-lg shadow-xl border border-gray-100 relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
        Registered Donors
      </h2>

      {donorList.length === 0 && !loading && (
        <p className="text-gray-600 text-center py-4">No registered donors found.</p>
      )}

      {donorList.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Group
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Donation
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donorList.map((donor) => (
                <tr key={donor._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {donor._id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{donor.Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{donor.userEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{donor.userPhone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">{donor.userBloodGroup}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{donor.userLocation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{donor.lastDonationDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        donor.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {donor.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <button
                      onClick={() => openEditModal(donor)}
                      className="text-blue-600 hover:text-blue-900 px-3 py-1 border border-blue-600 rounded-md mr-2 text-xs transition-colors duration-200 hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteConfirmModal(donor._id)}
                      className="text-red-600 hover:text-red-900 px-3 py-1 border border-red-600 rounded-md text-xs transition-colors duration-200 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toastMessage && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 transform ${
          toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
        } ${toastMessage ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          {toastMessage}
        </div>
      )}

      {isModalOpen && selectedDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Donor Profile</h3>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <form className="grid grid-cols-1 gap-y-4">
              <div>
                <label htmlFor="modal-name" className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  id="modal-name"
                  name="Name"
                  value={formValues.Name}
                  onChange={handleFormChange}
                  placeholder="Full Name"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="modal-email" className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  id="modal-email"
                  name="userEmail"
                  value={formValues.userEmail}
                  onChange={handleFormChange}
                  placeholder="Email"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="modal-phone" className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  id="modal-phone"
                  name="userPhone"
                  value={formValues.userPhone}
                  onChange={handleFormChange}
                  placeholder="Phone"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="modal-bloodGroup" className="block text-gray-700 text-sm font-medium mb-1">Blood Group</label>
                <select
                  id="modal-bloodGroup"
                  name="userBloodGroup"
                  value={formValues.userBloodGroup}
                  onChange={handleFormChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                >
                  <option value="">Select Blood Group</option>
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
                <label htmlFor="modal-location" className="block text-gray-700 text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  id="modal-location"
                  name="userLocation"
                  value={formValues.userLocation}
                  onChange={handleFormChange}
                  placeholder="Location"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="modal-availability" className="block text-gray-700 text-sm font-medium mb-1">Availability</label>
                <select
                  id="modal-availability"
                  name="availability"
                  value={formValues.availability}
                  onChange={handleFormChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </form>
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-gray-400 transition-colors duration-200 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEdit}
                className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors duration-200 shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && donorToDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100 opacity-100 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this donor record? This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={closeDeleteConfirmModal}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-gray-400 transition-colors duration-200 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteDonor}
                className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors duration-200 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};