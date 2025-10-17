import React from 'react';

const Topbar = ({ onToggleSidebar, onToggleMobile }) => {
  return (
    <nav className="al-topbar navbar navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <button className="btn btn-outline-light d-none d-lg-inline-flex" onClick={onToggleSidebar} title="Contraer/expandir">
          <i className="bi bi-list" />
        </button>
        <button className="btn btn-outline-light d-inline-flex d-lg-none" onClick={onToggleMobile} title="Menú">
          <i className="bi bi-list" />
        </button>

        <span className="navbar-brand ms-2">
          <i className="bi bi-speedometer2 me-2" />
          AdminLTE React
        </span>

        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-light btn-sm"><i className="bi bi-bell-fill" /></button>
          <button className="btn btn-outline-light btn-sm"><i className="bi bi-gear-fill" /></button>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
