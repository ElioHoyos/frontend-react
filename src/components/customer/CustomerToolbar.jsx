// src/components/customer/CustomerToolbar.jsx
import React, { useEffect, useState } from 'react';
import { FaSearch, FaUserPlus } from 'react-icons/fa';
import { useCustomerContext } from '../../contexts/CustomerContext';

export default function CustomerToolbar({ onAdd }) {
  const { search, setSearch } = useCustomerContext();
  const [q, setQ] = useState(search || '');

  useEffect(() => {
    const t = setTimeout(() => setSearch(q), 400);
    return () => clearTimeout(t);
  }, [q, setSearch]);

  return (
    <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-3 align-items-stretch align-items-lg-center mb-3">
      <div className="input-group">
        <span className="input-group-text"><FaSearch /></span>
        <input
          className="form-control"
          placeholder="Buscar por nombre, documento o correo…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="ms-lg-auto">
        <button className="btn btn-success" onClick={onAdd}>
          <FaUserPlus className="me-2" /> Nuevo cliente
        </button>
      </div>
    </div>
  );
}
