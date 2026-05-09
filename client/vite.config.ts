import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_STRAPI_API_URL || 'http://localhost:1337',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path, // Keep /api prefix
        }
      }
    }
  })
}