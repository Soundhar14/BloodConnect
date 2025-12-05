import React from 'react';

// Feature sections
import HeroSection from '../features/hero/HeroSection';
import DonorStats from '../features/hero/DonorStats';
import AboutUsSection from '../features/about/AboutUsSection';
import FAQSection from '../features/faq/FAQSection';
import LetUsChatSection from '../features/chat/LetUsChatSection';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <DonorStats />
      <AboutUsSection />
      <FAQSection />
      <LetUsChatSection />
    </>
  );
};

export default HomePage;
