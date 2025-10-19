import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://college-web-assistant.onrender.com/api',
});

// Attach token from localStorage to each request
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
