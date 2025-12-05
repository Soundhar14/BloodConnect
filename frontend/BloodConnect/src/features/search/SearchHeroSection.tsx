import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

interface SearchHeroSectionProps {
  onSearch: (bloodGroup: string, location: string) => void;
}

const SearchHeroSection: React.FC<SearchHeroSectionProps> = ({ onSearch }) => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [availableBloodGroups, setAvailableBloodGroups] = useState<string[]>([]);

  const [location, setLocation] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [allLocations, setAllLocations] = useState<string[]>([]);
  const [searchLocation, setSearchLocation] = useState('');

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
        setAvailableBloodGroups(res.data.availableBloodGroups);
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
        setAllLocations(response.data.availableLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
        showToast('Failed to load locations. Please try again.', 'error');
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (searchLocation.trim() === '') {
      setFilteredLocations([]);
    } else {
      const filtered = allLocations.filter((loc) =>
        loc.toLowerCase().includes(searchLocation.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchLocation, allLocations]);

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setSearchLocation(selectedLocation);
    setFilteredLocations([]);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setSearchLocation(e.target.value);
  };

  const handleSearchClick = () => {
    if (!bloodGroup || !location) {
      showToast('Please select both blood group and location to search.', 'error');
      return;
    }
    showToast(`Searching for ${bloodGroup} in ${location}...`, 'success');
    onSearch(bloodGroup, location);
  };

  return (
    <section
      className="relative font-sans bg-cover bg-center"
      style={{
        backgroundImage: "url('/search bg.svg')",
        paddingTop: '130px',
        paddingBottom: '130px',
        minHeight: '90vh',
      }}
    >
      <div
        className="rounded-xl p-8 w-fit h-fit absolute"
        style={{
          left: '200px',
          backgroundColor: 'rgba(250, 250, 251, 0.8)',
          boxShadow: '0 0 10px 0 rgba(92, 90, 90, 0.5)',
        }}
      >
        <h1
          className="mb-6 text-center"
          style={{
            fontFamily: 'Carmila, sans-serif',
            fontSize: '72px',
            fontWeight: '500',
            lineHeight: '1.1',
            paddingBottom: '15px',
          }}
        >
          <span style={{ color: '#000000' }}>FIND YOUR </span>
          <span style={{ color: '#dc2626' }}>LIFE</span>
          <br />
          <span style={{ color: '#dc2626' }}>SAVER</span>
          <span style={{ color: '#000000' }}> HERE</span>
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-4 font-sans">
          <div style={{ width: '180px' }} className="relative">
            <label
              htmlFor="bloodGroup"
              className="block text-gray-700 text-sm font-medium mb-1 text-left"
            >
              Blood Group
            </label>
            <select
              id="bloodGroup"
              className="w-full h-15 px-3 py-2 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-no-repeat bg-right-center pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundSize: '1.5rem',
                backgroundPosition: 'right 0.75rem center',
              }}
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
            >
              <option value="">Blood Group</option>
              {availableBloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div style={{ width: '320px', position: 'relative' }}>
            <label
              htmlFor="location"
              className="block text-gray-700 text-sm font-medium mb-1 text-left"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              className="w-full h-15 px-3 py-2 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter the Location to search"
              value={searchLocation}
              onChange={handleLocationChange}
              autoComplete="off"
            />
            {filteredLocations.length > 0 && searchLocation.trim() !== '' && (
              <ul
                className="absolute w-full bg-white border border-gray-300 rounded-lg max-h-40 overflow-y-auto z-10 shadow-lg"
                style={{ top: 'calc(100% + 5px)' }}
              >
                {filteredLocations.map((loc) => (
                  <li
                    key={loc}
                    onMouseDown={() => handleLocationSelect(loc)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                  >
                    {loc}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={handleSearchClick}
          style={{
            width: '200px',
            height: '56px',
            fontFamily: 'Carmila, sans-serif',
            fontWeight: '400',
            borderRadius: '25px',
            backgroundColor: '#E53935',
            fontSize: '20px',
            boxShadow: '0 0 25px rgba(229, 57, 53, 0.5)',
          }}
          className="text-white font-semibold rounded-lg transition-colors duration-300 hover:bg-red-700"
        >
          Search for blood
        </button>
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

export default SearchHeroSection;