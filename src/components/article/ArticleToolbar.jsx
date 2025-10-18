import React, { useEffect, useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';

export default function ArticleToolbar({ searchTerm, setSearchTerm, onAdd }) {
  const [q, setQ] = useState(searchTerm || '');

  // debounce 400ms
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(q), 400);
    return () => clearTimeout(t);
  }, [q, setSearchTerm]);

  return (
    <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-3 align-items-stretch align-items-lg-center mb-3">
      <div className="input-group">
        <span className="input-group-text"><FaSearch /></span>
        <input
          className="form-control"
          placeholder="Buscar por nombre o código…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="ms-lg-auto">
        <button className="btn btn-success" onClick={onAdd}>
          <FaPlus className="me-2" /> Agregar producto
        </button>
      </div>
    </div>
  );
}
