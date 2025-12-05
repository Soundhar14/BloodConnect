/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        carmila: ['Carmila', 'sans-serif'],
      },
      colors: {
        red: {
          DEFAULT: '#E53935',
          50: '#FDEEEE',
          100: '#FAD6D6',
          200: '#F6B3B1',
          300: '#F38F8C',
          400: '#EF6C67',
          500: '#E53935',
          600: '#B32A26',
          700: '#7F1B1B',
          800: '#4B0C0D',
          900: '#1F0203',
        },
        mainbg: '#E2E8F0',
      },
    },
  },
  plugins: [],
};

