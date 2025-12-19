import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For production deployment on  server
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
  
        rewrite: (path) => path.replace(/^\/api/, '/backend/api')
      }
      // For server, use:
      // '/api': {
      //   target: 'http://169.239.251.102:3410',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, '/~logan.anabi/ShopCompare/backend/api')
      // }
    }
  }
})
