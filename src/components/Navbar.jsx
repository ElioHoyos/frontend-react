import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importa Link y useLocation para resaltar el enlace activo

const Navbar = () => {
  const location = useLocation(); // Hook para obtener la ubicación actual

  // Función para determinar si un enlace está activo
  const isActiveLink = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        {/* Marca de la aplicación (logo/nombre) */}
        <Link className="navbar-brand" to="/">
          <i className="bi bi-shop me-2"></i> {/* Icono de tienda/negocio */}
          Mi Tienda App
        </Link>

        {/* Botón para colapsar el menú en pantallas pequeñas */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido del menú */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto"> {/* ms-auto para alinear a la derecha */}
            {/* Enlace a la página de inicio */}
            <li className="nav-item">
              <Link className={`nav-link ${isActiveLink('/')}`} to="/">
                <i className="bi bi-house-door-fill me-1"></i> 
                Inicio
              </Link>
            </li>
            
            {/* Enlace a Productos */}
            <li className="nav-item">
              <Link className={`nav-link ${isActiveLink('/productos')}`} to="/productos">
                <i className="bi bi-box-seam me-1"></i> 
                Productos
              </Link>
            </li>
            
            {/* Enlace a Ventas */}
            <li className="nav-item">
              <Link className={`nav-link ${isActiveLink('/ventas')}`} to="/ventas">
                <i className="bi bi-cart-fill me-1"></i> 
                Ventas
              </Link>
            </li>
            
            {/* Enlace a Categorías */}
            <li className="nav-item">
              <Link className={`nav-link ${isActiveLink('/categorias')}`} to="/categorias">
                <i className="bi bi-tags-fill me-1"></i> 
                Categorías
              </Link>
            </li>
            
            {/* Enlace a Reportes */}
            <li className="nav-item">
              <Link className={`nav-link ${isActiveLink('/reportes')}`} to="/reportes">
                <i className="bi bi-graph-up me-1"></i> 
                Reportes
              </Link>
            </li>
            
            {/* Puedes añadir más enlaces aquí si los necesitas */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;