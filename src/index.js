// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Si tienes un CSS global personalizado
import 'bootstrap/dist/css/bootstrap.min.css'; // ¡Importa Bootstrap CSS!
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // ¡Importa Bootstrap JavaScript para el toggler!
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);