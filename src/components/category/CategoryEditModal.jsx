import React, { useState } from 'react';
import { useCategoryContext } from '../../contexts/CategoryContext';

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
      // El error se manejará a través del CategoryContext. Aquí solo se prevendría el cierre si hay un error
      // setError(err.message || 'Error al actualizar la categoría'); // Podrías usar esto para errores específicos del modal
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Editar Categoría</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="categoryName" className="form-label">Nombre de la Categoría</label>
                <input
                  type="text"
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  id="categoryName"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(''); // Limpia el error al escribir
                  }}
                  placeholder="Introduce el nombre de la categoría"
                  aria-describedby="name-error-feedback"
                />
                {error && (
                  <div id="name-error-feedback" className="invalid-feedback">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}
              </div>
              <div className="mb-3 form-check form-switch">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  role="switch"
                />
                <label className="form-check-label" htmlFor="isActive">
                  {isActive ? 'Activo' : 'Inactivo'}
                </label>
              </div>

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