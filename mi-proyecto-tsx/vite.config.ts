import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',   
    port: 5173,          
    strictPort: true,    // si 5173 está ocupado, Vite NO cambiará de puerto
    hmr: {
      host: '127.0.0.1',
      port: 5173,        
      protocol: 'ws',
    },
  },
})
