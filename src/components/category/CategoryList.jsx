import React, { useState, useEffect } from 'react';
import { useCategoryContext } from '../../contexts/CategoryContext';
import { FaTrash, FaEdit, FaToggleOn, FaToggleOff, FaSearch } from 'react-icons/fa';
import CategoryEditModal from '../../components/category/CategoryEditModal';
import { showConfirmDialog } from '../../utils/alertHelper';

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
    toggleCategoryState,
    currentPage,
    pageSize,
    totalPages,
    totalElements,
    sortField,
    sortDirection,
    searchTerm, // Recibir searchTerm del contexto
    setCurrentPage,
    setPageSize,
    setSortField,
    setSortDirection,
    setSearchTerm, // Recibir setSearchTerm del contexto
  } = useCategoryContext();

  const [editingCategory, setEditingCategory] = useState(null);

  // Debounce para el término de búsqueda
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms de retardo

  // useEffect para resetear la página a 0 cuando el término de búsqueda cambia
  // y después de que el debounce haya actuado
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchTerm, setCurrentPage]); // Solo se ejecuta cuando debouncedSearchTerm cambia

  const handleDelete = async (id, name) => {
    const result = await showConfirmDialog(
      '¿Estás seguro?',
      `Deseas eliminar la categoría "${name}"?`
    );
    if (result.isConfirmed) {
      removeCategory(id);
    }
  };

  const handleToggleState = async (id, name, currentState) => {
    const action = currentState ? 'desactivar' : 'activar';
    const result = await showConfirmDialog(
      'Confirmar Cambio de Estado',
      `¿Estás seguro de ${action} la categoría "${name}"?`
    );
    if (result.isConfirmed) {
      toggleCategoryState(id);
    }
  };

  // Función para manejar el cambio de ordenamiento
  const handleSort = (field) => {
    if (sortField === field) {
      // Si es el mismo campo, cambia la dirección
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      // Si es un campo diferente, ordena por ASC por defecto
      setSortField(field);
      setSortDirection('ASC');
    }
    setCurrentPage(0); // Vuelve a la primera página al cambiar el ordenamiento
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === 'ASC' ? (
        <i className="bi bi-caret-up-fill ms-1"></i>
      ) : (
        <i className="bi bi-caret-down-fill ms-1"></i>
      );
    }
    return null;
  };

  return (
    <div className="card shadow-sm border-primary">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Listado de Categorías</h5>
        {/* Input de Búsqueda */}
        <div className="input-group w-50">
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Actualiza searchTerm
          />
        </div>
      </div>
      <div className="card-body">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando categorías...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        ) : categories.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            No hay categorías registradas.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th scope="col" onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                    ID {getSortIcon('id')}
                  </th>
                  <th scope="col" onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    Nombre {getSortIcon('name')}
                  </th>
                  <th scope="col" onClick={() => handleSort('state')} style={{ cursor: 'pointer' }}>
                    Estado {getSortIcon('state')}
                  </th>
                  <th scope="col" onClick={() => handleSort('dateCreated')} style={{ cursor: 'pointer' }}>
                    Fecha Creación {getSortIcon('dateCreated')}
                  </th>
                  <th scope="col" onClick={() => handleSort('dateModified')} style={{ cursor: 'pointer' }}>
                    Última Modificación {getSortIcon('dateModified')}
                  </th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>
                      <span
                        className={`badge ${
                          category.state ? 'bg-success' : 'bg-danger'
                        }`}
                      >
                        {category.state ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>{category.dateCreated}</td>
                    <td>{category.dateModified}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-info text-white"
                          onClick={() => setEditingCategory(category)}
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className={`btn btn-sm ${
                            category.state ? 'btn-warning' : 'btn-success'
                          }`}
                          onClick={() =>
                            handleToggleState(
                              category.id,
                              category.name,
                              category.state
                            )
                          }
                          title={category.state ? 'Desactivar' : 'Activar'}
                        >
                          {category.state ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleDelete(category.id, category.name)
                          }
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

            {/* INICIO - Paginación */}
            {totalPages > 0 && (
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
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
                  {/* Mostrar números de página */}
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(i)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
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
                <div className="text-center mt-2">
                  Mostrando {categories.length} de {totalElements} categorías.
                </div>
              </nav>
            )}
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