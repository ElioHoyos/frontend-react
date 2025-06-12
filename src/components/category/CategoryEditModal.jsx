import React, { useState } from 'react';
import { useCategoryContext } from '../../contexts/CategoryContext';
// showAlerts no se usa directamente aquí, el contexto lo maneja
// import { showErrorAlert } from '../utils/alertHelper'; 

const CategoryEditModal = ({ category, onClose }) => {
  const { updateCategory, isUpdating } = useCategoryContext();
  const [name, setName] = useState(category.name);
  const [isActive, setIsActive] = useState(category.state);
  // El estado 'error' ahora manejará solo el mensaje de error de validación del formulario
  const [error, setError] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpia el error al intentar enviar
    
    if (!name.trim()) {
      setError('El nombre es obligatorio'); // Mensaje de error de validación
      return;
    }

    try {
      const success = await updateCategory(category.id, name, isActive);
      if (success) {
        onClose(); // Cierra el modal solo si la actualización fue exitosa
      }
    } catch (err) {
      // Si hay un error del backend, se mostrará via CategoryContext.
      // Aquí, podrías capturar un error más específico si el updateCategory lanzara uno
      // que no sea solo el 'name.trim()'
      //setError(err.message || 'Error al actualizar la categoría'); // Podrías usar esto para errores específicos del modal
      //showErrorAlert('Error', err.message || 'Error al actualizar la categoría'); // Esto ya lo hace el contexto
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
              aria-label="Cerrar"
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
                  // INICIO - Mejora Visual de Errores (MEJORA DE DISEÑO)
                  className={`form-control ${error ? 'is-invalid' : ''}`} // Añade clase 'is-invalid' si hay un error
                  // FIN - Mejora Visual de Errores
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError(''); // Limpia el error de validación al empezar a escribir
                  }}
                  disabled={isUpdating}
                  aria-label="Nombre de categoría"
                  // INICIO - Accesibilidad (MEJORA DE DISEÑO)
                  aria-describedby={error ? 'name-error-feedback-modal' : null} // Vincula el input al mensaje de error
                  // FIN - Accesibilidad
                />
                {/* INICIO - Mensaje de Error (MEJORA DE DISEÑO) */}
                {error && (
                  <div id="name-error-feedback-modal" className="invalid-feedback d-block"> {/* d-block para mostrar siempre */}
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}
                {/* FIN - Mensaje de Error */}
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="activeCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={isUpdating}
                />
                <label 
                  className="form-check-label fw-medium" 
                  htmlFor="activeCheck"
                >
                  Estado activo
                </label>
              </div>
              {/* Este div de error ahora es menos necesario si los errores son inline, pero se puede mantener para errores generales de la API */}
              {/* {error && (
                <div className="alert alert-danger py-2">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )} */}
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