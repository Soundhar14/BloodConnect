import React, { useState, useEffect, type ChangeEvent } from 'react';
import app from '../../api/axios';
import { AxiosError } from 'axios';

interface DonationRecord {
  _id: string;
  date: string;
  recipient: string;
  location: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

interface ModalFormValues {
  _id?: string; // Optional for new records
  date: string;
  recipient: string;
  location: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

export const DonationHistoryTable: React.FC = () => {
  const [donationHistory, setDonationHistory] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedRecord, setSelectedRecord] = useState<DonationRecord | null>(null);
  const [formValues, setFormValues] = useState<ModalFormValues>({
    date: '',
    recipient: '',
    location: '',
    status: 'Pending',
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

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

  const fetchDonationHistory = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Authentication token not found. Please log in.');
      setLoading(false);
      showToast('Authentication token not found. Please log in.', 'error');
      return;
    }

    try {
      const response = await app.get('/donations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Ensure date is formatted for display
      const formattedData = response.data.map((record: DonationRecord) => ({
        ...record,
        date: new Date(record.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      }));
      setDonationHistory(formattedData);
    } catch (err) {
      const axiosError = err as AxiosError<{ msg: string }>;
      if (axiosError.response?.data?.msg) {
        setError(axiosError.response.data.msg);
      } else {
        console.error('Fetch donation history error:', err);
        setError('Failed to fetch donation history.');
      }
      showToast('Failed to fetch donation history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonationHistory();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setFormValues({
      date: new Date().toISOString().slice(0, 10), // Default to today's date
      recipient: '',
      location: '',
      status: 'Pending',
    });
    setIsModalOpen(true);
    setError(null);
  };

  const openEditModal = (record: DonationRecord) => {
    setModalMode('edit');
    setSelectedRecord(record);
    setFormValues({
      _id: record._id,
      date: new Date(record.date).toISOString().slice(0, 10), // Format for input type="date"
      recipient: record.recipient,
      location: record.location,
      status: record.status,
    });
    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setError(null);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const token = localStorage.getItem('token');

    if (!token) {
      showToast('User not authenticated. Please log in.', 'error');
      setSubmitting(false);
      return;
    }

    try {
      if (modalMode === 'add') {
        const payload = {
          ...formValues,
          date: new Date(formValues.date).toISOString(), // Convert date back to ISO for backend
        };
        const response = await app.post('/donations', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const newRecord = {
          ...response.data,
          date: new Date(response.data.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
        };
        setDonationHistory(prev => [...prev, newRecord]);
        showToast('Donation record added successfully!', 'success');
      } else { // edit mode
        if (!selectedRecord?._id) {
          setError('No record selected for update.');
          showToast('No record selected for update.', 'error');
          setSubmitting(false);
          return;
        }
        const payload = {
          ...formValues,
          date: new Date(formValues.date).toISOString(), // Convert date back to ISO for backend
        };
        const response = await app.put(`/donations/${selectedRecord._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedRecord = {
          ...response.data,
          date: new Date(response.data.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
        };
        setDonationHistory(prev => prev.map(record =>
          record._id === selectedRecord._id ? updatedRecord : record
        ));
        showToast('Donation record updated successfully!', 'success');
      }
      closeModal();
    } catch (err) {
      const axiosError = err as AxiosError<{ msg: string }>;
      if (axiosError.response?.data?.msg) {
        setError(axiosError.response.data.msg);
      } else {
        console.error(`${modalMode === 'add' ? 'Add' : 'Update'} donation error:`, err);
        setError(`Failed to ${modalMode === 'add' ? 'add' : 'update'} donation record.`);
      }
      showToast(`Failed to ${modalMode === 'add' ? 'add' : 'update'} donation record.`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100 text-center text-gray-600">
        Loading donation history...
      </div>
    );
  }

  if (error && !isModalOpen) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center font-semibold">
        <p>{error}</p>
        <button
          onClick={fetchDonationHistory}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div id="userHistory" className="bg-white p-6 md:p-8 rounded-lg shadow-xl border border-gray-100 relative">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h2 className="text-2xl font-semibold text-gray-800">
          Donation History
        </h2>
        <button
          onClick={openAddModal}
          className="bg-red-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md"
        >
          Add New Donation
        </button>
      </div>

      {donationHistory.length === 0 && !loading ? (
        <p className="text-gray-600 text-center py-4">No donation records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.no
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
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
              {donationHistory.map((record, index) => (
                <tr key={record._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {record.recipient}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {record.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${record.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        record.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <button
                      onClick={() => openEditModal(record)}
                      className="text-blue-600 hover:text-blue-900 px-3 py-1 border border-blue-600 rounded-md text-xs transition-colors duration-200 hover:bg-blue-50"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {modalMode === 'add' ? 'Add New Donation Record' : 'Edit Donation Record'}
            </h3>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-4">
              <div>
                <label htmlFor="modal-date" className="block text-gray-700 text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  id="modal-date"
                  name="date"
                  value={formValues.date}
                  onChange={handleFormChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label htmlFor="modal-recipient" className="block text-gray-700 text-sm font-medium mb-1">Recipient</label>
                <input
                  type="text"
                  id="modal-recipient"
                  name="recipient"
                  value={formValues.recipient}
                  onChange={handleFormChange}
                  placeholder="Recipient Name"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  required
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
                  required
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
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-gray-400 transition-colors duration-200 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};