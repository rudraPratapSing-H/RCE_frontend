import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      'linoleum-lecturer-oxidizing.ngrok-free.dev',
      'rce-frontend-ivory.vercel.app',
    ],
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
