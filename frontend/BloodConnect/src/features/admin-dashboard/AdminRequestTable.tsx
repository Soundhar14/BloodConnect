import React, { useState, useEffect, type ChangeEvent } from 'react';
import app from '../../api/axios';
import { AxiosError } from 'axios';

interface BloodRequestRecord {
  _id: string;
  recipientName: string;
  bloodGroup: string;
  location: string;
  requestDate: string;
  status: 'pending' | 'received' | 'withdraw';
}

interface BackendRequestResponse {
  _id: string;
  recipientName: string;
  bloodGroup: string;
  location: string;
  requestDate: string;
  status: 'pending' | 'received' | 'withdraw';
}

interface ModalFormValues {
  recipientName: string;
  bloodGroup: string;
  location: string;
  status: 'pending' | 'received' | 'withdraw';
}

export const AdminRequestTable: React.FC = () => {
  const [bloodRequests, setBloodRequests] = useState<BloodRequestRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequestRecord | null>(null);
  const [formValues, setFormValues] = useState<ModalFormValues>({
    recipientName: '',
    bloodGroup: '',
    location: '',
    status: 'pending',
  });

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

  const fetchBloodRequests = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Authentication token not found. Please log in as Admin.');
      setLoading(false);
      return;
    }

    try {
      const response = await app.get('/admin/request/all-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedRequests: BloodRequestRecord[] = response.data.map((request: BackendRequestResponse) => ({
        _id: request._id,
        recipientName: request.recipientName || 'N/A',
        bloodGroup: request.bloodGroup || 'N/A',
        location: request.location || 'N/A',
        requestDate: request.requestDate ? new Date(request.requestDate).toLocaleDateString() : 'N/A',
        status: request.status || 'pending',
      }));

      setBloodRequests(fetchedRequests);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else if (axiosError.response?.status === 403) {
        setError('Access Denied. You do not have administrator privileges.');
      } else {
        console.error('Fetch blood requests error:', err);
        setError('Failed to fetch blood requests.');
      }
      showToast('Failed to load blood requests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodRequests();
  }, []);

  const openEditModal = (request: BloodRequestRecord) => {
    setSelectedRequest(request);
    setFormValues({
      recipientName: request.recipientName,
      bloodGroup: request.bloodGroup,
      location: request.location,
      status: request.status,
    });
    setIsEditModalOpen(true);
    setError(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRequest(null);
    setError(null);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitEdit = async () => {
    if (!selectedRequest) return;

    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('User not authenticated. Please log in.', 'error');
      return;
    }

    try {
      const response = await app.patch(`/admin/request/update-request-status?requestId=${selectedRequest._id}`, {
        status: formValues.status,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBloodRequests(prev => prev.map(request =>
        request._id === selectedRequest._id ? {
          ...request,
          status: response.data.request.status,
        } : request
      ));
      showToast('Request status updated successfully!', 'success');
      closeEditModal();
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        console.error('Update request status error:', err);
        setError('Failed to update request status.');
      }
      showToast('Failed to update request status.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100 text-center text-gray-600">
        Loading blood requests...
      </div>
    );
  }

  if (error && !isEditModalOpen) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center font-semibold">
        <p>{error}</p>
        <button
          onClick={fetchBloodRequests}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div id="requestTable" className="bg-white p-6 md:p-8 rounded-lg shadow-xl border border-gray-100 relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
        Blood Requests
      </h2>

      {bloodRequests.length === 0 && !loading ? (
        <p className="text-gray-600 text-center py-4">No blood requests found.</p>
      ) : (
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
                  Blood Group
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Date
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bloodRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request._id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {request.recipientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                    {request.bloodGroup}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {request.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {request.requestDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${request.status === 'received' ? 'bg-green-100 text-green-800' :
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <button
                      onClick={() => openEditModal(request)}
                      className="text-blue-600 hover:text-blue-900 px-3 py-1 border border-blue-600 rounded-md mr-2 text-xs transition-colors duration-200 hover:bg-blue-50"
                    >
                      Edit
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

      {isEditModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Blood Request</h3>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <form className="grid grid-cols-1 gap-y-4">
              <div>
                <label htmlFor="modal-recipientName" className="block text-gray-700 text-sm font-medium mb-1">Recipient Name</label>
                <input
                  type="text"
                  id="modal-recipientName"
                  name="recipientName"
                  value={formValues.recipientName}
                  onChange={handleFormChange}
                  placeholder="Recipient Name"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="modal-bloodGroup" className="block text-gray-700 text-sm font-medium mb-1">Blood Group</label>
                <input
                  type="text"
                  id="modal-bloodGroup"
                  name="bloodGroup"
                  value={formValues.bloodGroup}
                  onChange={handleFormChange}
                  placeholder="Blood Group"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="modal-location" className="block text-gray-700 text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  id="modal-location"
                  name="location"
                  value={formValues.location}
                  onChange={handleFormChange}
                  placeholder="Location"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="modal-status" className="block text-gray-700 text-sm font-medium mb-1">Status</label>
                <select
                  id="modal-status"
                  name="status"
                  value={formValues.status}
                  onChange={handleFormChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                >
                  <option value="pending">Pending</option>
                  <option value="received">Received</option>
                  <option value="withdraw">Withdraw</option>
                </select>
              </div>
            </form>
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={closeEditModal}
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
    </div>
  );
};