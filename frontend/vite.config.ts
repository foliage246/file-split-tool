import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 載入環境變數
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // 確保 VITE_ 開頭的環境變數能在建構時使用
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || '/api/v1'),
    },
    build: {
      // 強制緩存破壞
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
          chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
          assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`
        }
      }
    },
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
  }
})
