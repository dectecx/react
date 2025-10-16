import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com/v1', // This will be replaced with your actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// You can add interceptors here for handling requests and responses globally
// For example, to add an auth token to every request:
/*
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
*/

export default apiClient;
