import React, { useState } from 'react';
import { useCategoryContext } from '../contexts/CategoryContext';

const CategoryForm = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { addCategory, isAdding } = useCategoryContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    try {
      const success = await addCategory(name);
      if (success) {
        setName('');
      }
    } catch (err) {
      setError(err.message || 'Error al crear la categoría');
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
                className="form-control"
                placeholder="Ingrese el nombre de la categoría"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isAdding}
                aria-label="Nombre de categoría"
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
              <div className="text-danger mt-2">
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