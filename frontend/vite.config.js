import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/query': 'http://localhost:5001',
      '/chat': 'http://localhost:5001',
      '/reset': 'http://localhost:5001',
      '/version': 'http://localhost:5001',
      '/sentinel-gate.js': 'http://localhost:5001',
    },
  },
})
