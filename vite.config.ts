import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/',  // Cambia esto al puerto donde corre tu backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});