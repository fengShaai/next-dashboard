// src/utils/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your API's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
