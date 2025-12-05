import React, { useState, type FormEvent } from 'react';
import api from '../../api/axios'; // Assuming this is your Axios instance
import { AxiosError } from 'axios';

const LetUsChatSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToastMessage(msg);
    setToastType(type);
    const timer = setTimeout(() => {
      setToastMessage(null);
      setToastType(null);
    }, 3000);
    return () => clearTimeout(timer);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { name, email, message };
      await api.post('/recipient/contact-form', payload);

      showToast('Message sent successfully!', 'success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to send message. Please try again.';
      showToast(errorMessage, 'error');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-6 md:py-1 lg:py-10 text-white bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/mask-group.svg')`,
      }}
    >
      <div className="absolute inset-0 bg-red-700 bg-opacity-5 pointer-events-none"></div>

      <div className="relative container mx-auto px-4 max-w-6xl z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <div className="lg:w-1/2 flex flex-col justify-center space-y-6 text-left pt-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Chat</h2>
              <p className="text-red-100 text-lg md:text-xl max-w-xl">
                Have questions or need assistance? Send us a message, or find our contact details below.
              </p>
            </div>

            <div className="bg-red-800 bg-opacity-80 p-6 md:p-8 rounded-lg w-full">
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-6 text-red-100">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-200 mt-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                  </svg>
                  <div>
                    <p className="font-medium">Our Address</p>
                    <p>123 Blood Donor St, Life City, State 45678</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-200 mt-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24.9.27 1.84.41 2.82.41.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1v3.5c0 .35-.09.7-.24 1.02l-2.2 2.2z" />
                  </svg>
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p>+1 (123) 456-7890</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-200 mt-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <div>
                    <p className="font-medium">Email Us</p>
                    <p>info@bloodconnect.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 text-left text-gray-100 p-6 md:p-8 rounded-lg">
            <h3 className="text-2xl font-semibold mb-6 text-white">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 rounded-md bg-white bg-opacity-80 text-black focus:outline-none focus:ring-2 focus:ring-red-400"
                  style={{ boxShadow: '0 4px 10px rgba(92, 90, 90, 0.8)' }}
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-white text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 rounded-md bg-white bg-opacity-80 text-black focus:outline-none focus:ring-2 focus:ring-red-400"
                  style={{ boxShadow: '0 4px 10px rgba(92, 90, 90, 0.8)' }}
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-white text-sm font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full p-3 rounded-md bg-white bg-opacity-80 text-black focus:outline-none focus:ring-2 focus:ring-red-400 resize-y"
                  style={{ boxShadow: '0 4px 10px rgba(92, 90, 90, 0.8)' }}
                  placeholder="Your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#E53935] text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300 w-full shadow-[0_4px_12px_rgba(229,57,53,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
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

export default LetUsChatSection;