import React, { useState, useEffect } from 'react';
import app from '../../api/axios';
import { AxiosError } from 'axios';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  submittedAt: string;
}

interface BackendContactResponse {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  submittedAt: string;
}

export const AdminReportTable: React.FC = () => {
  const [reportList, setReportList] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchContactMessages = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Authentication token not found. Please log in as Admin.');
      setLoading(false);
      return;
    }

    try {
      const response = await app.get('/admin/contact-us/contact-form', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedMessages: ContactMessage[] = response.data.map((msg: BackendContactResponse) => ({
        _id: msg._id,
        name: msg.name || 'N/A',
        email: msg.email || 'N/A',
        message: msg.message || 'No message content',
        isRead: msg.isRead,
        submittedAt: msg.submittedAt ? new Date(msg.submittedAt).toLocaleString() : 'N/A',
      }));

      setReportList(fetchedMessages);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else if (axiosError.response?.status === 403) {
        setError('Access Denied. You do not have administrator privileges.');
      } else {
        console.error('Fetch contact messages error:', err);
        setError('Failed to fetch contact messages.');
      }
      showToast('Failed to load contact messages.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactMessages();
  }, []);

  const handleToggleReadStatus = async (id: string, currentStatus: boolean) => {
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('User not authenticated. Please log in.', 'error');
      return;
    }

    try {
      
      const response = await app.patch(`/admin/contact-us/update-contact-msg-read?contactId=${id}`, {}, { 
        headers: { Authorization: `Bearer ${token}` },
      });

      // The backend returns the updated contact object directly
      setReportList(prev => prev.map(msg =>
        msg._id === id ? { ...msg, isRead: response.data.isRead } : msg
      ));
      showToast(`Message marked as ${!currentStatus ? 'read' : 'unread'} successfully!`, 'success');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        console.error('Update read status error:', err);
        setError('Failed to update message status.');
      }
      showToast('Failed to update message status.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100 text-center text-gray-600">
        Loading contact messages...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center font-semibold">
        <p>{error}</p>
        <button
          onClick={fetchContactMessages}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div id="reportTable" className="bg-white p-6 md:p-8 rounded-lg shadow-xl border border-gray-100 relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
        Contact Messages (Reports)
      </h2>

      {reportList.length === 0 && !loading ? (
        <p className="text-gray-600 text-center py-4">No contact messages found.</p>
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
                  Email
                </th>
                <th scope="col" className="px-12 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted At
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
              {reportList.map((message) => (
                <tr key={message._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {message._id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {message.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {message.email}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis">
                    {message.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {message.submittedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${message.isRead ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {message.isRead ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <button
                      onClick={() => handleToggleReadStatus(message._id, message.isRead)}
                      className={`px-3 py-1 border rounded-md mr-2 text-xs transition-colors duration-200
                        ${message.isRead
                          ? 'text-yellow-600 border-yellow-600 hover:bg-yellow-50'
                          : 'text-blue-600 border-blue-600 hover:bg-blue-50'
                        }`}
                    >
                      {message.isRead ? 'Mark as Unread' : 'Mark as Read'}
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
    </div>
  );
};