import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AxiosError } from 'axios';

const RegistrationPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [availability, setAvailability] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | null>(null);

  const navigate = useNavigate();

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    const timer = setTimeout(() => {
      setToastMessage(null);
      setToastType(null);
    }, 3000);
    return () => clearTimeout(timer);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      showToast('Passwords do not match.', 'error');
      return;
    }

    if (
      !fullName ||
      !phone ||
      !email ||
      !bloodGroup ||
      !gender ||
      !location ||
      !password ||
      !confirmPassword
    ) {
      setError('Please fill in all required fields.');
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register-Donor', {
        userName: fullName,
        userPhone: phone,
        userEmail: email,
        userBloodGroup: bloodGroup,
        userGender: gender,
        userLocation: location,
        lastDonationDate: lastDonationDate || null,
        availability: availability ? 'available' : 'unavailable',
        password,
        confirmPassword,
      });

      showToast(res.data.message || 'Registration successful!', 'success');
      navigate('/login');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;

      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
        showToast(axiosError.response.data.message, 'error');
      } else {
        setError('Registration failed. Please try again.');
        showToast('Registration failed. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative font-sans min-h-screen bg-gradient-to-br from-red-50 to-white flex flex-col">
      <main className="flex flex-grow items-center justify-center py-10 px-4">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 bg-white shadow-2xl rounded-xl overflow-hidden">

          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              Donor Registration
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm font-medium">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <Input label="Full Name" value={fullName} onChange={setFullName} placeholder="Your full name" />
                <Input label="Mobile Number" type="tel" value={phone} onChange={setPhone} placeholder="e.g., 9876543210" />
                <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="your.email@example.com" />
                <div>
                  <Label text="Blood Group" />
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-500 shadow-sm bg-white"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    required
                  >
                    <option value="">Select blood group</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label text="Gender" />
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                    {['male', 'female', 'other'].map(g => (
                      <label key={g} className="inline-flex items-center gap-2 text-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={gender === g}
                          onChange={() => setGender(g)}
                          className="form-radio h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500 transition-colors duration-200"
                          required
                        />
                        <span className="capitalize text-base">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Input label="Location" value={location} onChange={setLocation} placeholder="City or District" />
                <Input label="Last Donation Date" type="date" value={lastDonationDate} onChange={setLastDonationDate} />
                
                <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="Enter your password" />
                <Input label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm your password" />
              </div>

              <div className="flex items-center gap-4 pt-2 pb-4">
                <Label text="Availability" />
                <button
                  type="button"
                  onClick={() => setAvailability(!availability)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    availability ? 'bg-red-600 focus:ring-red-500' : 'bg-gray-300 focus:ring-gray-500'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
                      availability ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-base font-semibold ${availability ? 'text-green-600' : 'text-gray-500'}`}>
                  {availability ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>

          <aside className="bg-red-600 flex flex-col justify-center items-center p-10 text-center text-white">
            <div className="mb-6">
              <svg
                className="w-20 h-20 animate-pulse text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 21c-4.97-4.68-8-7.99-8-11.53A4.47 4.47 0 018.5 5a5.42 5.42 0 013.5 1.39A5.42 5.42 0 0115.5 5 4.47 4.47 0 0120 9.47c0 3.54-3.03 6.85-8 11.53z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-4">Why Register?</h3>
            <p className="text-lg leading-relaxed opacity-90">
              By registering as a donor, you could help save lives. <br />
              <span className="font-bold">One donation can save up to three lives.</span>
            </p>
          </aside>
        </div>
      </main>

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

const Input = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <Label text={label} />
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-500 shadow-sm"
    />
  </div>
);

const Label = ({ text }: { text: string }) => (
  <label className="block mb-2 font-semibold text-gray-700 text-sm">{text}</label>
);

export default RegistrationPage;