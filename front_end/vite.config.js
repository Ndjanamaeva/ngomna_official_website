import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Make the dev server reachable from the LAN and localhost.
  // Using 0.0.0.0 allows connections from any network interface (including 10.100.213.4).
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
  },
  // Preview server (vite preview) should also be reachable on LAN when used.
  preview: {
    host: '0.0.0.0',
    port: 5173,
  },
});