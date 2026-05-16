import axios from "axios";

// In DEV: empty string → Vite's dev server proxy handles /api/* calls
// In PROD: VITE_STRAPI_API_URL must be set in Vercel's environment variables
//          pointing to your Render backend URL (e.g. https://your-app.onrender.com)
//          ⚠️  Never fall back to localhost in production — it will always timeout
const rawURL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_STRAPI_API_URL ?? '');

const baseURL = rawURL.replace(/\/$/, '');

if (!import.meta.env.DEV && !baseURL) {
  console.error(
    '[api] VITE_STRAPI_API_URL is not set! ' +
    'Add it to Vercel → Project Settings → Environment Variables.'
  );
}

const api = axios.create({
    baseURL,
    // 20 s — Render free tier can take ~15 s to wake from sleep on first request
    timeout: 20000,
});

export default api;

