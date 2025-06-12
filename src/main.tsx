
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Clear any potentially cached routes on initial page load
if (window.location.pathname === '/' || window.location.pathname === '/index') {
  sessionStorage.clear();
  localStorage.removeItem('lastVisitedRoute');
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
