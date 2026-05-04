import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1338',
    timeout: 10000, // 10s timeout — prevents hanging on slow/cold servers
})

export default api;