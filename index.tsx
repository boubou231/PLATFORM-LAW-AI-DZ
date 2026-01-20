import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // تم حذف src/ لأن الملفات في المجلد الرئيسي (Root)

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
