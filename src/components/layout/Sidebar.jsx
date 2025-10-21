import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Item = ({ to, icon, children }) => {
  const { pathname } = useLocation();
  const active = pathname === to ? 'active' : '';
  return (
    <li className={`al-item ${active}`}>
      <Link to={to} className="al-link">
        <i className={`bi ${icon} me-2`} />
        <span className="al-text">{children}</span>
      </Link>
    </li>
  );
};

const Sidebar = ({ onNavigate }) => {
  const { pathname } = useLocation();
  return (
    <aside className="al-sidebar">
      <div className="al-brand">
        <i className="bi bi-alexa"></i>
        <span className="ms-2">AdminLTE 3</span>
      </div>

      <div className="al-user">
        <img src="https://i.pravatar.cc/48?img=12" alt="user" className="al-avatar" />
        <div>
          <div className="al-user-name">Alexander Pierce</div>
          <div className="al-user-status">Online</div>
        </div>
      </div>

      <div className="al-search input-group mb-3">
        <input className="form-control form-control-sm" placeholder="Search..." />
        <span className="input-group-text"><i className="bi bi-search" /></span>
      </div>

      <ul className="al-menu list-unstyled" onClick={onNavigate}>
        <div className="al-section">MAIN NAVIGATION</div>

        <Item to="/" icon="bi-speedometer2">Dashboard</Item>
        <Item to="/categorias" icon="bi-tags-fill">Categorías</Item>
        <Item to="/productos" icon="bi-box-seam">Productos</Item>
        <Item to="/clientes"  icon="bi-people-fill">Clientes</Item>
        <Item to="/ventas" icon="bi-cart-fill">Ventas</Item>
        <Item to="/reportes" icon="bi-graph-up">Reportes</Item>

        <div className="al-section mt-3">EXAMPLES</div>
        <Item to="/calendar" icon="bi-calendar3">Calendar</Item>
        <Item to="/tables" icon="bi-table">Tables</Item>
      </ul>

      <div className="al-footer text-muted small">
        {pathname} • v1.0
      </div>
    </aside>
  );
};

export default Sidebar;
