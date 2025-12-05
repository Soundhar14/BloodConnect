import React from 'react';

// Define the props interface for a single DonorCard
interface DonorCardProps {
  name: string;
  location: string;
  phone: string;
  bloodGroup: string;
  date: string; // Assuming 'last donated date' or 'available date'
  email: string;
}

export const DonorCard: React.FC<DonorCardProps> = ({ name, location, phone, bloodGroup, date, email }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col justify-between transform transition-transform duration-200 hover:scale-[1.02]">
      {/* Top row: Name and Blood Group */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {/* User Icon */}
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
          <span className="text-lg font-semibold text-gray-800">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Blood Drop Icon */}
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span className="text-lg font-bold text-red-600">{bloodGroup}</span>
        </div>
      </div>

      {/* Middle rows: Location and Date */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-gray-700">
          {/* Location Icon */}
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M11.54 22.351A8.287 8.287 0 0020.25 13.25c0-4.97-4.03-9-9-9a8.25 8.25 0 00-7.543 4.243c-.383.585-.564 1.25-.564 1.934 0 3.09 2.502 5.602 5.59 5.602h.008c.114 0 .227.01.34.025.163.02-.387.058-.698.423-.483.578-.45 1.157-.428 1.485.078.697 1.554 2.85 5.097 2.85 3.543 0 5.02-.667 5.097-2.85.022-.328.055-.907-.428-1.485-.311-.365-.86-.403-.997-.423A8.219 8.219 0 0012 22.5c-.235 0-.47-.008-.704-.025zM12 8.25a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
          </svg>
          <span className="text-sm md:text-base">{location}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          {/* Calendar Icon */}
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h2v2H7v-2zm-2 0h2v2H5v-2zm12 0h2v2h-2v-2zm-2 0h2v2h-2v-2zm-5 0h2v2h-2v-2zm-2 0h2v2h-2v-2z"/>
          </svg>
          <span className="text-sm md:text-base">{date}</span>
        </div>
      </div>

      {/* Bottom row: Phone and Email */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-gray-700">
          {/* Phone Icon */}
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24.9.27 1.84.41 2.82.41.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1v3.5c0 .35-.09.7-.24 1.02l-2.2 2.2z"/>
          </svg>
          <span className="text-sm md:text-base">{phone}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          {/* Email Icon */}
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <span className="text-sm md:text-base break-all">{email}</span> {/* break-all to handle long emails */}
        </div>
      </div>
    </div>
  );
};