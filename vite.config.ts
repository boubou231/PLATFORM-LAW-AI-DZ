import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['jspdf', 'html2canvas'],
      output: {
        globals: {
          jspdf: 'jspdf',
          html2canvas: 'html2canvas',
        },
      },
    },
  },
});
