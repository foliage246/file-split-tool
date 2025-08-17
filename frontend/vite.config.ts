import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8080'),
    strictPort: true,
    allowedHosts: [
      'file-split-tool-production.up.railway.app',
      '.railway.app',
      'localhost'
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  }
})
