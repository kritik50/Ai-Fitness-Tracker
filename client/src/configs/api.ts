import axios from "axios";

const rawURL = import.meta.env.DEV
  ? ''
  : import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

const baseURL = rawURL.replace(/\/$/, '');

console.log('API Base URL:', baseURL); // Debug log

const api = axios.create({
    baseURL,
    timeout: 10000, // 10s timeout — prevents hanging on slow/cold servers
})

export default api;
