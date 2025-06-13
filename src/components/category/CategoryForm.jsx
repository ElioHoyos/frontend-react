import React, { useState } from 'react';
import { useCategoryContext } from '../../contexts/CategoryContext';

const CategoryForm = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { addCategory, isAdding } = useCategoryContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    try {
      const success = await addCategory(name);
      if (success) {
        setName('');
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
        <h5 className="card-title mb-0">Agregar Nueva Categoría</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="categoryNameInput" className="form-label visually-hidden">Nombre de la Categoría</label>
            <div className="input-group">
              <input
                type="text"
                className={`form-control form-control-lg ${error ? 'is-invalid' : ''}`}
                id="categoryNameInput"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(''); // Limpia el error al escribir
                }}
                placeholder="Nombre de la categoría"
                aria-label="Nombre de la categoría"
                aria-describedby={error ? 'name-error-feedback' : null}
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isAdding || !name.trim()}
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
            {error && (
              <div id="name-error-feedback" className="invalid-feedback d-block">
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;