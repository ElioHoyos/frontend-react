import React, { useState, useEffect } from 'react'; // Eliminado 'useCallback'
import { useCategoryContext } from '../../contexts/CategoryContext'; // Asegúrate de que la ruta es correcta
import { FaTrash, FaEdit, FaToggleOn, FaToggleOff, FaSearch } from 'react-icons/fa';
import CategoryEditModal from '../../components/category/CategoryEditModal'; // Asegúrate de que la ruta es correcta
import { showConfirmDialog } from '../../utils/alertHelper'; // Asegúrate de que la ruta es correcta
// Asegúrate de tener los iconos de Bootstrap en tu proyecto si usas las clases bi-caret-up-fill, etc.
// Si no, puedes importarlos desde 'react-icons/bs' o usar otros.
// Por ejemplo: import { BsCaretUpFill, BsCaretDownFill } from 'react-icons/bs';

// Custom hook para debounce (simple y funcional)
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const CategoryList = () => {
  const { 
    categories, 
    loading, 
    error, 
    removeCategory, 
    toggleCategoryState, // Función para cambiar el estado
    currentPage,
    pageSize,
    totalPages,
    totalElements,
    sortField,
    sortDirection,
    setSearchTerm, // Setter para el searchTerm global del contexto
    setCurrentPage,
    setPageSize,
    setSortField,
    setSortDirection,
  } = useCategoryContext();
  
  const [editingCategory, setEditingCategory] = useState(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(''); // Estado local para el input del buscador
  const debouncedSearchTerm = useDebounce(localSearchTerm, 500); // Aplica debounce al término de búsqueda

  // Efecto para actualizar el searchTerm global del contexto cuando el debouncedSearchTerm cambia
  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
    setCurrentPage(0); // Reinicia la paginación al cambiar el término de búsqueda
  }, [debouncedSearchTerm, setSearchTerm, setCurrentPage]);

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Manejar eliminación de categoría
  const handleDelete = async (id, name) => {
    const result = await showConfirmDialog(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar la categoría "${name}"? Esta acción no se puede deshacer.` // Mensaje más descriptivo
    );
    
    if (result.isConfirmed) {
      try {
        await removeCategory(id);
      } catch (err) {
        console.error('Error al eliminar categoría:', err);
      }
    }
  };

  // Manejar ordenamiento de tabla (NUEVO)
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortDirection('ASC'); // Por defecto, ordena ascendente al cambiar de campo
    }
    setCurrentPage(0); // Vuelve a la primera página al cambiar el orden
  };

  return (
    <div className="card shadow-sm mb-4 border-primary">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Listado de Categorías</h5>
        {/* INICIO - Buscador Integrado (MEJORA DE DISEÑO) */}
        <div className="input-group" style={{ maxWidth: '300px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            aria-label="Buscar categorías"
          />
          <span className="input-group-text"><FaSearch /></span>
        </div>
        {/* FIN - Buscador Integrado */}
      </div>
      <div className="card-body">
        {loading ? (
          // INICIO - Estado de Carga (MEJORA DE DISEÑO)
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando categorías...</span>
            </div>
            <p className="mt-2 text-muted">Cargando categorías...</p>
          </div>
          // FIN - Estado de Carga
        ) : error ? (
          // INICIO - Estado de Error (MEJORA DE DISEÑO)
          <div className="alert alert-danger text-center" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Error al cargar las categorías: {error}
          </div>
          // FIN - Estado de Error
        ) : categories.length === 0 ? (
          // INICIO - Estado Vacío (MEJORA DE DISEÑO)
          <div className="text-center py-5">
            <p className="lead text-muted">
              <i className="bi bi-info-circle me-2"></i>
              Aún no hay categorías registradas. ¡Empieza agregando una!
            </p>
            {/* Opcional: un botón para ir directamente al formulario o abrir un modal de añadir */}
            {/* Si el formulario de agregar categoría está en otro lugar, podrías añadir un botón aquí */}
            {/* <button className="btn btn-primary mt-3" onClick={() => {/* Lógica para abrir formulario * /}}>
              <i className="bi bi-plus-circle me-2"></i> Agregar Nueva Categoría
            </button> */}
          </div>
          // FIN - Estado Vacío
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle">
              <thead>
                <tr>
                  {/* INICIO - Indicadores de Ordenamiento (MEJORA DE DISEÑO) */}
                  <th scope="col" onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    Nombre
                    {sortField === 'name' && (
                      <span>
                        {sortDirection === 'ASC' ? <i className="bi bi-caret-up-fill ms-1"></i> : <i className="bi bi-caret-down-fill ms-1"></i>}
                      </span>
                    )}
                  </th>
                  <th scope="col">
                    {/* El estado no suele ser clickeable para ordenar si es un booleano */}
                    Estado
                  </th>
                  <th scope="col" onClick={() => handleSort('dateCreated')} style={{ cursor: 'pointer' }}>
                    Fecha Creación
                    {sortField === 'dateCreated' && (
                      <span>
                        {sortDirection === 'ASC' ? <i className="bi bi-caret-up-fill ms-1"></i> : <i className="bi bi-caret-down-fill ms-1"></i>}
                      </span>
                    )}
                  </th>
                  <th scope="col" onClick={() => handleSort('dateModified')} style={{ cursor: 'pointer' }}>
                    Fecha Modificación
                    {sortField === 'dateModified' && (
                      <span>
                        {sortDirection === 'ASC' ? <i className="bi bi-caret-up-fill ms-1"></i> : <i className="bi bi-caret-down-fill ms-1"></i>}
                      </span>
                    )}
                  </th>
                  {/* FIN - Indicadores de Ordenamiento */}
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    {/* INICIO - Mejora Visual para toggleState (MEJORA DE DISEÑO) */}
                    <td>
                      <span
                        className={`badge ${category.state ? 'bg-success' : 'bg-danger'} me-2`}
                        style={{ fontSize: '0.85em', padding: '0.4em 0.6em' }}
                      >
                        {category.state ? 'Activo' : 'Inactivo'}
                      </span>
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => toggleCategoryState(category.id)}
                        title={category.state ? 'Desactivar Categoría' : 'Activar Categoría'}
                      >
                        {category.state ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </td>
                    {/* FIN - Mejora Visual para toggleState */}
                    <td>{formatDate(category.dateCreated)}</td>
                    <td>{formatDate(category.dateModified)}</td>
                    <td>
                      <div className="btn-group">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setEditingCategory(category)}
                          title="Editar"
                        >
                          <FaEdit /> Editar 
                        </button>
                        {/* El botón de toggle ya está arriba junto al badge */}
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(category.id, category.name)}
                          title="Eliminar"
                        >
                          <FaTrash /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* INICIO - Paginación (Mejorada con info de total) */}
            <nav className="d-flex justify-content-between align-items-center mt-3">
              <div>
                <span className="text-muted">
                  Mostrando {categories.length} de {totalElements} categorías en total
                </span>
                <select 
                  className="form-select form-select-sm ms-2 d-inline-block w-auto"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(0); // Reinicia a la primera página al cambiar el tamaño
                  }}
                >
                  <option value="5">5 por página</option>
                  <option value="10">10 por página</option>
                  <option value="25">25 por página</option>
                </select>
              </div>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(0)}>
                    Primera
                  </button>
                </li>
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}>
                    Anterior
                  </button>
                </li>
                {/* Puedes añadir números de página aquí si lo deseas, o un rango */}
                <li className="page-item active">
                  <span className="page-link">{currentPage + 1}</span>
                </li>
                <li className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}>
                    Siguiente
                  </button>
                </li>
                <li className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(totalPages - 1)}>
                    Última
                  </button>
                </li>
              </ul>
            </nav>
            {/* FIN - Paginación */}
          </div>
        )}
      </div>
      
      {/* Modal de edición */}
      {editingCategory && (
        <CategoryEditModal 
          category={editingCategory} 
          onClose={() => setEditingCategory(null)} 
        />
      )}
    </div>
  );
};

export default CategoryList;