import React, { useEffect, useState } from 'react';
import app from '../../api/axios';
import { AxiosError } from 'axios';

interface StatCardProps {
  title: string;
  value: number | string;
  colorClass: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, colorClass, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClass.replace('text-', 'bg-opacity-20 text-')} flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-600 uppercase tracking-wider">{title}</h3>
        <p className={`text-3xl md:text-4xl font-extrabold mt-1 ${colorClass}`}>{value}</p>
      </div>
    </div>
  );
};

export const AdminStatsCards: React.FC = () => {
  const [totalDonors, setTotalDonors] = useState<number | string>('...');
  const [requestFulfilled, setRequestFulfilled] = useState<number | string>('...');
  const [requestPending, setRequestPending] = useState<number | string>('...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalDonors = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found.');
          setTotalDonors('Error');
          return;
        }
        const response = await app.get('/admin/dashboard/total-donors', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTotalDonors(response.data.totalDonors);
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        console.error('Failed to fetch total donors:', axiosError);
        setError(axiosError.response?.data?.message || 'Failed to fetch total donors.');
        setTotalDonors('Error');
      }
    };

    fetchTotalDonors();
  }, []);

  useEffect(() => {
    const fetchRequestFulfilled = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found.');
          setRequestFulfilled('Error');
          return;
        }
        const response = await app.get('/admin/dashboard/fullfiled-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequestFulfilled(response.data.requestFullfiled);
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        console.error('Failed to fetch count of fulfilled requests:', axiosError);
        setError(axiosError.response?.data?.message || 'Failed to fetch fulfilled requests count.');
        setRequestFulfilled('Error');
      }
    };

    fetchRequestFulfilled();
  }, []);

  useEffect(() => {
    const fetchRequestPending = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found.');
          setRequestPending('Error');
          return;
        }
        const response = await app.get('/admin/dashboard/pending-request', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequestPending(response.data.requestPending);
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        console.error('Failed to fetch count of pending requests:', axiosError);
        setError(axiosError.response?.data?.message || 'Failed to fetch pending requests count.');
        setRequestPending('Error');
      }
    };

    fetchRequestPending();
  }, []);

  const DonorIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h-2a4 4 0 01-4-4V7a4 4 0 014-4h2a4 4 0 014 4v9a4 4 0 01-4 4zm-5-10a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  );

  const FulfilledIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const PendingIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const stats = [
    {
      title: 'Total Donors',
      value: totalDonors,
      colorClass: 'text-blue-600',
      icon: DonorIcon,
    },
    {
      title: 'Requests Fulfilled',
      value: requestFulfilled,
      colorClass: 'text-green-600',
      icon: FulfilledIcon,
    },
    {
      title: 'Pending Requests',
      value: requestPending,
      colorClass: 'text-red-600',
      icon: PendingIcon,
    },
  ];

  return (
    <div id="dashboard" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          colorClass={stat.colorClass}
          icon={stat.icon}
        />
      ))}
      {error && (
        <div className="md:col-span-full lg:col-span-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
};
