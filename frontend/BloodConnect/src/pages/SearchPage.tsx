import React, { useState } from 'react';
import SearchHeroSection from '../features/search/SearchHeroSection'; 
import DonorListings from '../features/search/DonorListings';

const SearchPage: React.FC = () => {
  // State to hold selected search criteria
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');

  // Handler passed down to SearchHeroSection
  const handleSearch = (selectedBloodGroup: string, selectedLocation: string) => {
    setBloodGroup(selectedBloodGroup);
    setLocation(selectedLocation);
  };

  return (
    <>

      <SearchHeroSection onSearch={handleSearch} />
      <DonorListings bloodGroup={bloodGroup} location={location} />
    </>
  );
};

export default SearchPage;
