import React, { useState } from 'react';
import { useCategoryContext } from '../../contexts/CategoryContext';

const CategoryForm = () => {
  const [name, setName] = useState('');
  // El estado 'error' ahora manejará solo el mensaje de error de validación del formulario
  const [error, setError] = useState(''); 
  const { addCategory, isAdding } = useCategoryContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpia el error al intentar enviar

    if (!name.trim()) {
      setError('El nombre de la categoría es obligatorio'); // Mensaje de error de validación
      return;
    }

    try {
      const success = await addCategory(name);
      if (success) {
        setName(''); // Limpia el campo solo si la adición fue exitosa
        // Los mensajes de éxito/error de la API se manejan en CategoryContext
      }
    } catch (err) {
      // Si hay un error del backend, se mostrará via CategoryContext.
      // Aquí, podrías capturar un error más específico si el addCategory lanzara uno
      // que no sea solo el 'name.trim()'
      // Por ahora, el CategoryContext maneja los errores generales de la API
    }
  };

  return (
    <div className="card shadow-sm mb-4 border-primary">
      <div className="card-header bg-primary text-white">
        <h5 className="card-title mb-0">Nueva Categoría</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium">Nombre de categoría</label>
            <div className="input-group">
              <input
                type="text"
                // INICIO - Mejora Visual de Errores (MEJORA DE DISEÑO)
                className={`form-control ${error ? 'is-invalid' : ''}`} // Añade clase 'is-invalid' si hay un error
                // FIN - Mejora Visual de Errores
                placeholder="Ingrese el nombre de la categoría"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(''); // Limpia el error de validación al empezar a escribir
                }}
                disabled={isAdding}
                aria-label="Nombre de categoría"
                // INICIO - Accesibilidad (MEJORA DE DISEÑO)
                aria-describedby={error ? 'name-error-feedback' : null} // Vincula el input al mensaje de error
                // FIN - Accesibilidad
              />
              <button 
                className="btn btn-primary"
                type="submit"
                disabled={isAdding || !name.trim()} // Deshabilita si está agregando o el nombre está vacío
              >
                {isAdding ? (
                  <>
                    <span 
                      className="spinner-border spinner-border-sm me-2" 
                      role="status" 
                      aria-hidden="true"
                    ></span>
                    Agregando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle me-2"></i>
                    Agregar
                  </>
                )}
              </button>
            </div>
            {/* INICIO - Mensaje de Error (MEJORA DE DISEÑO) */}
            {error && (
              <div id="name-error-feedback" className="invalid-feedback d-block"> {/* d-block para mostrar siempre */}
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </div>
            )}
            {/* FIN - Mensaje de Error */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;