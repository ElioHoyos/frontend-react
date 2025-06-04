import React, { useState } from 'react';
import { useCategoryContext } from '../contexts/CategoryContext';
import { FaTrash, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import CategoryEditModal from './CategoryEditModal';
import { showConfirmDialog } from '../utils/alertHelper';

const CategoryList = () => {
  const { 
    categories, 
    loading, 
    error, 
    removeCategory, 
    toggleCategoryState 
  } = useCategoryContext();
  
  const [editingCategory, setEditingCategory] = useState(null);

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

  if (error) {
    return (
      <div className="alert alert-danger my-4">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="alert alert-info my-4">
        No se encontraron categorías.
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-4">Lista de Categorías</h5>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Creado</th>
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
                  <td>{formatDate(category.date_created)}</td>
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