// src/pages/customer/CustomersPage.jsx
import React, { useState } from 'react';
import { CustomerProvider } from '../../contexts/CustomerContext';
import CustomerToolbar from '../../components/customer/CustomerToolbar';
import CustomerList from '../../components/customer/CustomerList';
import CustomerForm from '../../components/customer/CustomerForm';

function CustomersScreen() {
  const [show, setShow] = useState(false);
  return (
    <div className="container-fluid px-2 px-lg-3 py-3">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3">
        <h1 className="h4 mb-2 mb-md-0">Gestión de Clientes</h1>
      </div>

      <CustomerToolbar onAdd={() => setShow(true)} />
      <CustomerList />

      {/* Offcanvas para registrar */}
      <div className={`offcanvas offcanvas-end ${show ? 'show' : ''}`}
           tabIndex="-1"
           style={{ visibility: show ? 'visible' : 'hidden', width: '520px', maxWidth: '100%' }}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Nuevo Cliente</h5>
          <button type="button" className="btn-close" onClick={() => setShow(false)} />
        </div>
        <div className="offcanvas-body">
          <CustomerForm onClose={() => setShow(false)} />
        </div>
      </div>
      {show && <div className="offcanvas-backdrop fade show" onClick={() => setShow(false)} />}
    </div>
  );
}

export default function CustomersPage() {
  return (
    <CustomerProvider>
      <CustomersScreen />
    </CustomerProvider>
  );
}
