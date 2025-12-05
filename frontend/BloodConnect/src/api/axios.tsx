import axios from 'axios';

const app = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust port as needed
  withCredentials: true,
});

    app.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default app;
