import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For production deployment on school server
  // Use absolute path for school server deployment
  base: '/~logan.anabi/ShopCompare/frontend/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      // For school server:
      '/api': {
        target: 'http://169.239.251.102:341',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/~logan.anabi/ShopCompare/backend/api')
      }
      // For localhost MAMP, use:
      // '/api': {
      //   target: 'http://localhost:8888',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, '/ShopCompare/backend/api')
      // }
    }
  }
})
