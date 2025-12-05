import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminSidebar } from '../features/admin-dashboard/AdminSidebar';
import { AdminStatsCards } from '../features/admin-dashboard/AdminStatusCards';
import { AdminDonorTable } from '../features/admin-dashboard/AdminDonorTable';
import { AdminRequestTable } from '../features/admin-dashboard/AdminRequestTable';
import { AdminReportTable } from '../features/admin-dashboard/AdminReportTable';
import { EmergencyNotificationComposer } from '../features/admin-dashboard/EmergencyNotificationComposer'; // Import the new component

export const AdminDashboardPage: React.FC = () => {
  const { isLoggedIn, userRole } = useAuth();

  if (!isLoggedIn || userRole !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-100">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div id="top" className="flex-1 p-8 md:p-12 lg:p-16 overflow-auto">
        <h3 className="text-xl md:text-3xl   mb-8 font-carmila text-left">
          <span className ='text-red-600 font-medium'>Admin</span>
          <span className ='text-black-300 font-medium'>Dashboard</span>
        </h3>

        {/* Admin Stats Cards Section */}
        <AdminStatsCards />

        {/* Admin Donor Table Section */}
        <div className="mb-12">
          <AdminDonorTable />
        </div>

        {/* Admin Request Table Section */}
        <div className="mb-12">
          <AdminRequestTable />
        </div>
        
        <div className="mb-12">
          <AdminReportTable />
        </div>

        {/* Emergency Notification Composer Section */}
        <div> {/* No extra mb-12 needed if it's the last element */}
          <EmergencyNotificationComposer /> {/* Use the EmergencyNotificationComposer here */}
        </div>
      </div>
    </div>
  );
};