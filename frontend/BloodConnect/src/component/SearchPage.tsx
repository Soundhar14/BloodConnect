import React, { useState } from 'react';
import SearchHeroSection from '../features/search/SearchHeroSection';
import DonorListings from '../features/search/DonorListings';

const SearchPage: React.FC = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');

  // This handler is called by SearchHeroSection when user clicks "Search"
  const handleSearch = (selectedBloodGroup: string, selectedLocation: string) => {
    setBloodGroup(selectedBloodGroup);
    setLocation(selectedLocation);
  };

  return (
    <div>
      {/* Pass handleSearch to SearchHeroSection */}
      <SearchHeroSection onSearch={handleSearch} />

      {/* Pass bloodGroup and location to DonorListings */}
      <DonorListings bloodGroup={bloodGroup} location={location} />
    </div>
  );
};

export default SearchPage;
