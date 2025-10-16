import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { Toaster } from '@/components/ui/toaster';
import SmoothScroll from '@/components/SmoothScroll';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SmoothScroll>
      <App />
      <Toaster />
    </SmoothScroll>
  </React.StrictMode>
);
