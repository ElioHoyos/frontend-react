// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Si tienes un CSS global personalizado
import 'bootstrap/dist/css/bootstrap.min.css'; // ¡Importa Bootstrap CSS!
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // ¡Importa Bootstrap JavaScript para el toggler!
import App from './App';

const ignoreResizeObserverError = (e) => {
  const msg = e?.message || e?.reason?.message || '';
  if (msg.includes('ResizeObserver loop') || msg.includes('ResizeObserver loop completed')) {
    e.stopImmediatePropagation();
  }
};
window.addEventListener('error', ignoreResizeObserverError);
window.addEventListener('unhandledrejection', ignoreResizeObserverError);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);