import React, { useState, useEffect, useCallback } from 'react';
import { useCategoryContext } from '../contexts/CategoryContext';
import { FaTrash, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa'; // FaSearch ya no es necesario
import CategoryEditModal from './CategoryEditModal';
import { showConfirmDialog } from '../utils/alertHelper';

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
    setSearchTerm, // Setter para el searchTerm global
    setCurrentPage,
    setPageSize,
    setSortField,
    setSortDirection,
    // refreshCategories ya no se usa directamente aquí, el contexto lo maneja
  } = useCategoryContext();
  
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Estado local para el valor del input de búsqueda
  const [searchInput, setSearchInput] = useState('');

  // Usar el hook useDebounce para el input de búsqueda
  const debouncedSearchTerm = useDebounce(searchInput, 500); // 500ms de retraso

  // Efecto que se dispara cuando el valor debounced cambia
  useEffect(() => {
    // Si el término de búsqueda debounced es diferente al que ya está en el contexto
    // y no está vacío, o si está vacío y queremos limpiar la búsqueda
    // Solo actualizamos el searchTerm en el contexto. El useEffect del contexto lo disparará.
    if (debouncedSearchTerm !== undefined) {
      setSearchTerm(debouncedSearchTerm); // Actualiza el searchTerm en el contexto
      setCurrentPage(0); // Reinicia a la primera página para la nueva búsqueda
    }
  }, [debouncedSearchTerm, setSearchTerm, setCurrentPage]); // Dependencias para este efecto

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
      `¿Estás seguro de eliminar la categoría "${name}"?`
    );
    
    if (result.isConfirmed) {
      try {
        await removeCategory(id);
      } catch (err) {
        console.error('Error al eliminar categoría:', err);
      }
    }
  };

  // Manejadores de cambio de paginación/ordenamiento
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // No necesitamos llamar a refreshCategories aquí directamente,
    // el useEffect en CategoryContext se encargará de esto cuando currentPage cambie.
  };

  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(0); // Reset to first page when page size changes
    // El useEffect en CategoryContext se encargará de esto cuando pageSize y currentPage cambien.
  };

  const handleSortChange = (field) => {
    const newDirection = sortField === field && sortDirection === 'ASC' ? 'DESC' : 'ASC';
    setSortField(field);
    setSortDirection(newDirection);
    // El useEffect en CategoryContext se encargará de esto cuando sortField y sortDirection cambien.
  };

  if (loading && !categories.length) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando categorías...</p>
      </div>
    );
  }

  // Se añadió `searchInput` para mostrar "No se encontraron categorías" solo si no hay búsqueda activa.
  // Si `searchInput` está vacío y no hay categorías, entonces no se encontraron categorías.
  // Si `searchInput` no está vacío y no hay categorías, significa que la búsqueda no arrojó resultados.
  if (!categories.length && !loading && searchInput === '') {
    return (
      <div className="alert alert-info my-4">
        No se encontraron categorías.
      </div>
    );
  } else if (!categories.length && !loading && searchInput !== '') {
    return (
        <div className="alert alert-info my-4">
            No se encontraron categorías para la búsqueda "{searchInput}".
        </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-4">Listado de Categorías ({totalElements} en total)</h5>
        
        {/* Sección del Buscador */}
        <div className="mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre..."
              value={searchInput} // Controlado por el estado local
              onChange={(e) => setSearchInput(e.target.value)} // Actualiza el estado local inmediatamente
            />
            {/* El botón de búsqueda ya no es necesario, la búsqueda es "en vivo" */}
            {/* <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>
              <FaSearch className="me-2" /> Buscar
            </button> */}
          </div>
        </div>

        {/* Controles de Paginación y Tamaño de Página */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            Mostrar
            <select className="form-select form-select-sm mx-2" value={pageSize} onChange={handleSizeChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            registros
          </div>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                  Anterior
                </button>
              </li>
              {/* Renderizar un número limitado de páginas para evitar una barra de paginación gigante */}
              {/* Se recomienda un bucle que muestre, por ejemplo, las 5 páginas alrededor de la actual */}
              {Array.from({ length: totalPages }, (_, i) => i).map(page => (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(page)}>
                    {page + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th onClick={() => handleSortChange('id')} className="cursor-pointer">
                  ID {sortField === 'id' && (sortDirection === 'ASC' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSortChange('name')} className="cursor-pointer">
                  Nombre {sortField === 'name' && (sortDirection === 'ASC' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSortChange('state')} className="cursor-pointer">
                  Estado {sortField === 'state' && (sortDirection === 'ASC' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSortChange('dateCreated')} className="cursor-pointer">
                  Creado {sortField === 'dateCreated' && (sortDirection === 'ASC' ? '▲' : '▼')}
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>
                    <span className={`badge ${category.state ? 'bg-success' : 'bg-secondary'}`}>
                      {category.state ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>{formatDate(category.dateCreated)}</td>
                  <td>
                    <div className="btn-group">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setEditingCategory(category)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => toggleCategoryState(category.id)}
                        title={category.state ? 'Desactivar' : 'Activar'}
                      >
                        {category.state ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(category.id, category.name)}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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