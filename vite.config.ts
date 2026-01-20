import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // هنا نخبر Vite أن هذه المكتبات خارجية وسيجدها في المتصفح فلا يبحث عنها محلياً
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
