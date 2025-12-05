import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { AxiosError } from 'axios';
import { DonorCard } from './DonorCard';

interface Donor {
  _id: string;
  Name: string;
  userLocation: string;
  userPhone: string;
  userEmail: string;
  userBloodGroup: string;
  lastDonationDate: string;
}

interface DonorListingsProps {
  bloodGroup: string;
  location: string;
}

const DonorListings: React.FC<DonorListingsProps> = ({ bloodGroup, location }) => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [requesterName, setRequesterName] = useState('');
  const [contact, setContact] = useState('');
  const [searchInitiated, setSearchInitiated] = useState(false);
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

  useEffect(() => {
    if (!bloodGroup || !location) {
      setDonors([]);
      setSearchInitiated(false);
      return;
    }

    const fetchDonors = async () => {
      setLoading(true);
      setSearchInitiated(true);
      setError(null);
      try {
        const response = await api.post('/recipient/search-donors', {
          userBloodGroup: bloodGroup,
          userLocation: location,
        });

        setDonors(Array.isArray(response.data.donors) ? response.data.donors : []);
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        console.error('Error fetching donors:', err);
        setError(axiosError.response?.data?.message || 'Failed to fetch donors.');
        setDonors([]);
        showToast('Failed to fetch donors. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [bloodGroup, location]); // Dependencies now refer to props

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        requesterName,
        bloodGroup, // Use prop bloodGroup
        location,   // Use prop location
        contact,
        status: 'pending',
      };

      await api.post('/recipient/request-blood', payload);
      showToast('Blood request submitted successfully!', 'success');
      setRequesterName('');
      setContact('');
      setFormVisible(false);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      console.error('Error submitting request:', err);
      setError(axiosError.response?.data?.message || 'Failed to submit request.');
      showToast('Failed to submit request. Please try again later.', 'error');
    }
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50 relative">
      <div className="container mx-auto px-4">
        {loading && <p className="text-center text-gray-700 text-lg font-medium">Searching for donors...</p>}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center font-semibold mb-8">
            <p>{error}</p>
          </div>
        )}

        {!loading && donors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {donors.map((donor) => (
              <DonorCard
                key={donor._id}
                name={donor.Name}
                location={donor.userLocation}
                phone={donor.userPhone}
                bloodGroup={donor.userBloodGroup}
                date={donor.lastDonationDate}
                email={donor.userEmail}
              />
            ))}
          </div>
        )}

        {!loading && searchInitiated && donors.length === 0 && (
          <div className="text-center space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800">No Donors Found</h3>
            <p className="text-gray-700 text-lg max-w-prose mx-auto">
              Unfortunately, we couldn't find any donors matching your criteria at this moment.
              You can submit a blood request, and we will notify you when a donor becomes available.
            </p>
            <button
              onClick={() => setFormVisible(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-colors duration-200 transform hover:scale-105"
            >
              Submit a Blood Request
            </button>
          </div>
        )}

        {formVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl relative">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Submit a Blood Request</h2>
              
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200"
                onClick={() => setFormVisible(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <form onSubmit={handleSubmitRequest} className="space-y-5">
                <div>
                  <label htmlFor="requesterName" className="block text-gray-700 text-sm font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    id="requesterName"
                    required
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="contactNumber" className="block text-gray-700 text-sm font-medium mb-1">Contact Number</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="bloodGroupDisplay" className="block text-gray-700 text-sm font-medium mb-1">Blood Group</label>
                  <input
                    type="text"
                    id="bloodGroupDisplay"
                    readOnly
                    value={bloodGroup}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-md bg-gray-100 cursor-not-allowed text-gray-600"
                  />
                </div>

                <div>
                  <label htmlFor="locationDisplay" className="block text-gray-700 text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    id="locationDisplay"
                    readOnly
                    value={location}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-md bg-gray-100 cursor-not-allowed text-gray-600"
                  />
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-colors duration-200 transform hover:scale-105"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {toastMessage && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 transform ${
          toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
        } ${toastMessage ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          {toastMessage}
        </div>
      )}
    </section>
  );
};

export default DonorListings;