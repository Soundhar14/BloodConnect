import React, { useState, useEffect, type ChangeEvent } from 'react';
import app from '../../api/axios';
import { AxiosError } from 'axios';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const difference = +targetDate - +new Date();
  let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const isValidDate = (date: Date) => date instanceof Date && !isNaN(date.getTime());

export const DonationCountdown: React.FC = () => {
  const [targetDateTime, setTargetDateTime] = useState<Date>(new Date());
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(new Date()));
  const [isCounting, setIsCounting] = useState<boolean>(false);
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
    const fetchDonationInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated. Please log in.');
        showToast('User not authenticated. Please log in.', 'error');
        return;
      }

      try {
        const response = await app.get('/donor/donation-date', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const dateString = response.data.nextDonationDate;

        if (!dateString || typeof dateString !== 'string') {
          setError('Invalid date received from server.');
          showToast('Invalid date received from server.', 'error');
          setIsCounting(false);
          return;
        }

        const lastDonationDate = new Date(dateString);

        if (!isValidDate(lastDonationDate)) {
          setError('Received invalid date from server.');
          showToast('Received invalid date from server.', 'error');
          setIsCounting(false);
          return;
        }

        const nextDonationDate = new Date(lastDonationDate);
        nextDonationDate.setDate(nextDonationDate.getDate() + 7);

        setTargetDateTime(nextDonationDate);
        setTimeLeft(calculateTimeLeft(nextDonationDate));
        setIsCounting(true);
        setError(null);
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
          showToast(axiosError.response.data.message, 'error');
        } else {
          console.error('Fetch error details:', err);
          setError('Failed to fetch donation date.');
          showToast('Failed to fetch donation date.', 'error');
        }
      }
    };

    fetchDonationInfo();
  }, []);

  useEffect(() => {
    if (!isCounting) return;

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDateTime);
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(timer);
        setIsCounting(false);
        showToast('Countdown finished! You might be eligible to donate now.', 'success');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateTime, isCounting]);

  const handleDateTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (isValidDate(newDate)) {
      setTargetDateTime(newDate);
      setTimeLeft(calculateTimeLeft(newDate));
      setIsCounting(true);
      setError(null);
      showToast('Countdown target updated!', 'success');
    } else {
      setError('Invalid date selected.');
      showToast('Invalid date selected. Please choose a valid date and time.', 'error');
    }
  };

  const formatTime = (value: number) => String(value).padStart(2, '0');

  return (
    <div id="countDown" className="bg-gradient-to-br from-red-700 to-red-900  md:p-4 py-10 rounded-xl shadow-2xl flex flex-col lg:flex-row items-center lg:justify-between gap-6 relative">
      <div className="flex-shrink-0 text-white rounded-lg p-6 w-full lg:w-auto min-w-[280px] max-w-sm mx-auto lg:mx-0 text-center bg-red-800 bg-opacity-30 backdrop-blur-sm border border-red-700">
        <h3 className="text-xl font-bold mb-6 text-white uppercase tracking-wider">
          Countdown to Next Donation
        </h3>
        <div className="flex justify-center items-end space-x-3 md:space-x-4 mb-4">
          <div className="flex flex-col items-center">
            <div className="bg-gray-900 rounded-lg px-4 py-3 relative overflow-hidden shadow-inner-lg w-20 h-20 flex items-center justify-center border border-gray-700">
              <div className="text-5xl font-mono font-bold text-red-400">
                {formatTime(timeLeft.days)}
              </div>
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-700 transform -translate-y-1/2"></div>
            </div>
            <p className="text-xs text-gray-300 mt-2">DAYS</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-gray-900 rounded-lg px-4 py-3 relative overflow-hidden shadow-inner-lg w-20 h-20 flex items-center justify-center border border-gray-700">
              <div className="text-5xl font-mono font-bold text-red-400">
                {formatTime(timeLeft.hours)}
              </div>
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-700 transform -translate-y-1/2"></div>
            </div>
            <p className="text-xs text-gray-300 mt-2">HOURS</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-gray-900 rounded-lg px-4 py-3 relative overflow-hidden shadow-inner-lg w-20 h-20 flex items-center justify-center border border-gray-700">
              <div className="text-5xl font-mono font-bold text-red-400">
                {formatTime(timeLeft.minutes)}
              </div>
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-700 transform -translate-y-1/2"></div>
            </div>
            <p className="text-xs text-gray-300 mt-2">MINUTES</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-gray-900 rounded-lg px-4 py-3 relative overflow-hidden shadow-inner-lg w-20 h-20 flex items-center justify-center border border-gray-700">
              <div className="text-5xl font-mono font-bold text-red-400">
                {formatTime(timeLeft.seconds)}
              </div>
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-700 transform -translate-y-1/2"></div>
            </div>
            <p className="text-xs text-gray-300 mt-2">SECONDS</p>
          </div>
        </div>
      </div>

      <div className="flex-grow text-center lg:text-left text-white p-4 lg:p-0">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Your Next Donation Eligibility
        </h2>
        <p className="text-red-100 mb-4 text-sm md:text-base max-w-lg lg:max-w-none mx-auto lg:mx-0">
          This timer indicates when you'll next be eligible to donate blood, based on your last donation.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label
            htmlFor="setDateTime"
            className="font-semibold text-white whitespace-nowrap text-lg"
          >
            Set a custom target:
          </label>
          <input
            type="datetime-local"
            id="setDateTime"
            className="p-3 border border-red-500 bg-red-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 w-full sm:w-auto text-base placeholder-gray-400"
            value={
              isValidDate(targetDateTime)
                ? targetDateTime.toISOString().slice(0, 16)
                : ''
            }
            onChange={handleDateTimeChange}
          />
        </div>

        {!isCounting && !error && (
          <p className="text-green-300 mt-4 font-semibold text-lg">
            Countdown finished! You are now eligible to donate.
          </p>
        )}

        {error && (
          <p className="text-red-300 mt-4 font-semibold text-lg" role="alert">
            {error}
          </p>
        )}
      </div>

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
