import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward API requests to backend to avoid CORS
    proxy: {
      '/Books': {
        target: 'http://localhost:5003',
        changeOrigin: true,
      },
      '/swagger': {
        target: 'http://localhost:5003',
        changeOrigin: true,
      },
    },
  },
})
