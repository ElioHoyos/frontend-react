import React, { useState } from 'react';
import { useCategoryContext } from '../contexts/CategoryContext';
import { showErrorAlert } from '../utils/alertHelper';

const CategoryEditModal = ({ category, onClose }) => {
  const { updateCategory, isUpdating } = useCategoryContext();
  const [name, setName] = useState(category.name);
  const [isActive, setIsActive] = useState(category.state);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    try {
      const success = await updateCategory(category.id, name, isActive);
      if (success) {
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Error al actualizar la categoría');
      showErrorAlert('Error', err.message || 'Error al actualizar la categoría');
    }
  };

  return (
    <div 
      className="modal fade show" 
      style={{ 
        display: 'block', 
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1050
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Editar Categoría</h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              disabled={isUpdating}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium">Nombre de categoría</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isUpdating}
                  autoFocus
                />
              </div>
              <div className="mb-3 form-check form-switch">
                <input
                  type="checkbox"
                  className="form-check-input"
                  role="switch"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  id="activeCheck"
                  disabled={isUpdating}
                />
                <label 
                  className="form-check-label fw-medium" 
                  htmlFor="activeCheck"
                >
                  Estado activo
                </label>
              </div>
              {error && (
                <div className="alert alert-danger py-2">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button 
                  type="button" 
                  className="btn btn-secondary px-4"
                  onClick={onClose}
                  disabled={isUpdating}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary px-4"
                  disabled={isUpdating || !name.trim()}
                >
                  {isUpdating ? (
                    <>
                      <span 
                        className="spinner-border spinner-border-sm me-2" 
                        role="status" 
                        aria-hidden="true"
                      ></span>
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditModal;