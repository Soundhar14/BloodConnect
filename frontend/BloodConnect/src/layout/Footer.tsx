import React from 'react';

 const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    <footer className="bg-gray-800 text-white py-8 md:py-10">
      <div className="container mx-auto px-4 text-center">
        {/* Logo/Brand Name */}
        <div className="mb-4">
          <span className="text-red-500 text-3xl font-bold">Blood Connect</span>
        </div>

        {/* Quick Links (Optional, uncomment if you need them) */}
        {/*
        <nav className="mb-6">
          <ul className="flex flex-col md:flex-row justify-center gap-y-2 md:gap-x-6 text-sm font-medium">
            <li><a href="#home" className="hover:text-red-400 transition-colors duration-200">Home</a></li>
            <li><a href="#about" className="hover:text-red-400 transition-colors duration-200">About Us</a></li>
            <li><a href="#faq" className="hover:text-red-400 transition-colors duration-200">FAQs</a></li>
            <li><a href="#contact" className="hover:text-red-400 transition-colors duration-200">Contact</a></li>
            <li><a href="/privacy" className="hover:text-red-400 transition-colors duration-200">Privacy Policy</a></li>
          </ul>
        </nav>
        */}

        {/* Social Media Links (Optional, uncomment if you need them) */}
        {/*
        <div className="flex justify-center space-x-6 mb-6">
          <a href="#" className="text-gray-400 hover:text-red-400 transition-colors duration-200" aria-label="Facebook">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.502 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-red-400 transition-colors duration-200" aria-label="Twitter">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c1.803.957 3.843 1.503 6.004 1.503 6.005 0 9.33-4.996 9.33-9.33 0-.141-.003-.28-.009-.42-.64-.457-1.464-.766-2.393-.906.74-.447 1.298-1.082 1.569-1.879-.69.41-1.45.71-2.26.877-.65-.69-1.57-1.122-2.59-1.122-1.95 0-3.35 1.76-2.9 3.645-.29-.01-.58-.04-.88-.08-2.45-1.23-4.62-3.71-6.17-6.95C7.4 7.85 7.02 6.64 7.02 5.17c0-1.14.59-2.14 1.49-2.73-.25.04-.5-.04-.75-.04-.81 0-1.58.29-2.18.79-.17 1.03.49 2.05 1.52 2.65-.66-.02-1.28-.2-1.83-.51-.01.01-.01.01-.01.02-.01.99.78 1.84 1.78 2.03-.24.08-.48.11-.73.11-.2 0-.39-.02-.58-.05.28 1.05 1.1 1.93 2.14 2.22-.85.66-1.93 1.06-3.1 1.06-.2 0-.4-.01-.59-.04 1.34.87 2.92 1.39 4.63 1.39z" /></svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-red-400 transition-colors duration-200" aria-label="LinkedIn">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.57-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
          </a>
        </div>
        */}

        {/* Copyright Information */}
        <p className="text-gray-400 text-sm md:text-base">
          &copy; {currentYear} Blood Connect. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;