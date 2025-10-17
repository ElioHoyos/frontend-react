// src/components/category/CategoryList.jsx
import React, { useState, useEffect } from 'react';
import { useCategoryContext } from '../../contexts/CategoryContext';
import { FaSearch } from 'react-icons/fa';
import CategoryEditModal from '../../components/category/CategoryEditModal';
import { showConfirmDialog } from '../../utils/alertHelper';

// NUEVO
import CategoryDataTable from './CategoryDataTable';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => { const h = setTimeout(() => setDebouncedValue(value), delay); return () => clearTimeout(h); }, [value, delay]);
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
    totalPages, // ya no se usa pero lo dejamos por si lo necesitas
    totalElements,
    sortField,
    sortDirection,
    searchTerm,
    setCurrentPage,
    setPageSize,
    setSortField,
    setSortDirection,
    setSearchTerm,
  } = useCategoryContext();

  const [editingCategory, setEditingCategory] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => { setCurrentPage(0); }, [debouncedSearchTerm, setCurrentPage]);

  const handleDelete = async (row) => {
    const result = await showConfirmDialog('¿Estás seguro?', `Deseas eliminar la categoría "${row.name}"?`);
    if (result.isConfirmed) removeCategory(row.id);
  };

  const handleToggleState = async (row) => {
    const action = row.state ? 'desactivar' : 'activar';
    const result = await showConfirmDialog('Confirmar Cambio de Estado', `¿Estás seguro de ${action} la categoría "${row.name}"?`);
    if (result.isConfirmed) toggleCategoryState(row.id);
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        {/* Buscador */}
        <div className="input-group w-100 w-lg-50">
          <span className="input-group-text"><FaSearch /></span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card-body p-0">
        <CategoryDataTable
          rows={categories}
          loading={loading}
          error={error}
          currentPage={currentPage}
          pageSize={pageSize}
          totalElements={totalElements}
          sortField={sortField}
          sortDirection={sortDirection}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
          setSortField={setSortField}
          setSortDirection={setSortDirection}
          onEdit={(row) => setEditingCategory(row)}
          onToggle={handleToggleState}
          onDelete={handleDelete}
        />
      </div>

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
