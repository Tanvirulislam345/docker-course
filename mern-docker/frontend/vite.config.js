import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // polling lets Vite pick up files synced into the container by `docker compose watch`
    watch: { usePolling: true },
  },
})
