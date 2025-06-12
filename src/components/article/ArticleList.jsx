// src/components/ArticleList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useArticleContext } from '../contexts/ArticleContext';
import { FaTrash, FaEdit, FaToggleOn, FaToggleOff, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import ArticleEditModal from './ArticleEditModal';
import { showConfirmDialog } from '../utils/alertHelper';
import { format } from 'date-fns';

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

const ArticleList = () => {
  const { 
    articles, 
    loading, 
    error, 
    removeArticle, 
    toggleArticleState,
    currentPage,
    pageSize,
    totalPages,
    totalElements,
    sortField,
    sortDirection,
    searchTerm,
    setCurrentPage,
    setPageSize,
    setSortField,
    setSortDirection,
    setSearchTerm,
  } = useArticleContext();
  
  const [editingArticle, setEditingArticle] = useState(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 500); // 500ms de debounce

  // Actualizar searchTerm del contexto cuando el valor debounced cambie
  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
    setCurrentPage(0); // Reiniciar paginación al cambiar el término de búsqueda
  }, [debouncedSearchTerm, setSearchTerm, setCurrentPage]);

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  };

  // Manejar eliminación de artículo
  const handleDelete = async (id, name) => {
    const result = await showConfirmDialog(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar el artículo "${name}"? Esta acción es irreversible.`
    );
    
    if (result.isConfirmed) {
      try {
        await removeArticle(id);
      } catch (err) {
        console.error('Error al eliminar artículo:', err);
      }
    }
  };

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Manejar cambio de tamaño de página
  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(0); // Reiniciar paginación
  };

  // Manejar cambio de ordenamiento
  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortDirection('ASC'); // Por defecto ASC cuando se cambia de campo
    }
    setCurrentPage(0); // Reiniciar paginación
  };

  // Icono de ordenamiento
  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === 'ASC' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="ms-3 mb-0">Cargando artículos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center my-4">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4 border-secondary">
      <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Lista de Artículos</h5>
        <div className="input-group" style={{ maxWidth: '300px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o código..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
          />
          <span className="input-group-text"><i className="bi bi-search"></i></span>
        </div>
      </div>
      <div className="card-body">
        {articles.length === 0 && !searchTerm ? (
          <div className="alert alert-info text-center">
            No hay artículos registrados.
          </div>
        ) : articles.length === 0 && searchTerm ? (
          <div className="alert alert-warning text-center">
            No se encontraron artículos para "{searchTerm}".
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" onClick={() => handleSortChange('code')} className="sortable-header">
                    Código {getSortIcon('code')}
                  </th>
                  <th scope="col" onClick={() => handleSortChange('name')} className="sortable-header">
                    Nombre {getSortIcon('name')}
                  </th>
                  <th scope="col" onClick={() => handleSortChange('category.name')} className="sortable-header">
                    Categoría {getSortIcon('category.name')}
                  </th>
                  <th scope="col" onClick={() => handleSortChange('amount')} className="sortable-header text-end">
                    Cantidad {getSortIcon('amount')}
                  </th>
                  <th scope="col" onClick={() => handleSortChange('sale_price')} className="sortable-header text-end">
                    P. Venta {getSortIcon('sale_price')}
                  </th>
                  <th scope="col" onClick={() => handleSortChange('purchase_price')} className="sortable-header text-end">
                    P. Compra {getSortIcon('purchase_price')}
                  </th>
                  <th scope="col" onClick={() => handleSortChange('expiration_date')} className="sortable-header">
                    Vencimiento {getSortIcon('expiration_date')}
                  </th>
                  <th scope="col" onClick={() => handleSortChange('state')} className="sortable-header text-center">
                    Estado {getSortIcon('state')}
                  </th>
                  <th scope="col" className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td>{article.code}</td>
                    <td>{article.name}</td>
                    <td>{article.category_name}</td>
                    <td className="text-end">{article.amount}</td>
                    <td className="text-end">S/ {article.sale_price ? article.sale_price.toFixed(2) : '0.00'}</td>
                    <td className="text-end">S/ {article.purchase_price ? article.purchase_price.toFixed(2) : '0.00'}</td>
                    <td>{formatDate(article.expiration_date)}</td>
                    <td className="text-center">
                      <span className={`badge bg-${article.state ? 'success' : 'danger'}`}>
                        {article.state ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => setEditingArticle(article)}
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => toggleArticleState(article.id)}
                          title={article.state ? 'Desactivar' : 'Activar'}
                        >
                          {article.state ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                        <button 
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(article.id, article.name)}
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
        )}
      </div>
      
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="card-footer d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Mostrando {articles.length} de {totalElements} artículos.
          </small>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                  Anterior
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(index)}>
                    {index + 1}
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
          <div className="d-flex align-items-center">
            <span className="me-2 text-muted">Artículos por página:</span>
            <select className="form-select form-select-sm w-auto" value={pageSize} onChange={handlePageSizeChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      )}
      
      {/* Modal de edición */}
      {editingArticle && (
        <ArticleEditModal 
          article={editingArticle} 
          onClose={() => setEditingArticle(null)} 
        />
      )}
    </div>
  );
};

export default ArticleList;