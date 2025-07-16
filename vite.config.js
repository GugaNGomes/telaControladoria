import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/controladoria': {
        target: 'https://www.postallweb.com.br/homolog',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/controladoria/, '/api/controladoria'),
      },
    },
  },
})
