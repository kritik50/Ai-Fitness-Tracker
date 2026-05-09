import axios from "axios";

const baseURL = import.meta.env.DEV
  ? ''
  : import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337'

const api = axios.create({
    baseURL,
    timeout: 10000, // 10s timeout — prevents hanging on slow/cold servers
})

export default api;
