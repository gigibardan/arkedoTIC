import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with immediate autoUpdate & background checks
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true);
  },
  onRegisteredSW(swUrl, registration) {
    if (registration) {
      // Re-check for new versions when tab gains focus or every 5 minutes
      window.addEventListener('focus', () => {
        registration.update().catch(() => {});
      });
      setInterval(() => {
        registration.update().catch(() => {});
      }, 5 * 60 * 1000);
    }
  }
});

// Auto-reload current tab once when a new service worker takes control
let isRefreshing = false;
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!isRefreshing) {
      isRefreshing = true;
      window.location.reload();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
