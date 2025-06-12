// src/components/ArticleEditModal.jsx
import React, { useState, useEffect } from 'react';
import { useArticleContext } from '../contexts/ArticleContext';
import { showErrorAlert } from '../utils/alertHelper';
import { format } from 'date-fns'; // Para formatear la fecha de vencimiento

const ArticleEditModal = ({ article, onClose }) => {
  const { updateArticle, isUpdating, categories } = useArticleContext();

  const [id, setId] = useState(article.id);
  const [code, setCode] = useState(article.code);
  const [name, setName] = useState(article.name);
  const [description, setDescription] = useState(article.description || '');
  const [amount, setAmount] = useState(article.amount);
  const [salePrice, setSalePrice] = useState(article.sale_price);
  const [purchasePrice, setPurchasePrice] = useState(article.purchase_price);
  const [expirationDate, setExpirationDate] = useState(article.expiration_date ? format(new Date(article.expiration_date), 'yyyy-MM-dd') : '');
  const [categoryId, setCategoryId] = useState(article.category_id);
  const [isActive, setIsActive] = useState(article.state);
  const [error, setError] = useState('');

  // Manejar el cambio de categorías si la lista se carga después o si el ID inicial es null
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validaciones básicas en el frontend
    if (!code.trim() || !name.trim() || !amount || !salePrice || !purchasePrice || !categoryId) {
      setError('Todos los campos obligatorios deben ser completados.');
      return;
    }
    if (isNaN(amount) || amount < 0) {
      setError('La cantidad debe ser un número positivo.');
      return;
    }
    if (isNaN(salePrice) || salePrice <= 0) {
      setError('El precio de venta debe ser un número positivo mayor a 0.');
      return;
    }
    if (isNaN(purchasePrice) || purchasePrice < 0) {
      setError('El precio de compra debe ser un número no negativo.');
      return;
    }
    if (expirationDate && new Date(expirationDate) < new Date()) {
      setError('La fecha de vencimiento no puede ser anterior a la fecha actual.');
      return;
    }

    const articleData = {
      id: id,
      code: code.trim(),
      name: name.trim(),
      description: description.trim() || null,
      amount: parseInt(amount),
      sale_price: parseFloat(salePrice),
      purchase_price: parseFloat(purchasePrice),
      expiration_date: expirationDate || null,
      category_id: parseInt(categoryId),
      state: isActive // El estado se actualiza en el `updateArticle` también
    };

    try {
      const success = await updateArticle(id, articleData);
      if (success) {
        onClose(); // Cerrar modal al éxito
      }
    } catch (err) {
      setError(err.message || 'Error al actualizar el artículo');
      showErrorAlert('Error', err.message || 'Error al actualizar el artículo');
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
      <div className="modal-dialog modal-dialog-centered modal-lg"> {/* Modal más grande */}
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">Editar Artículo</h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              disabled={isUpdating}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-medium">Código</label>
                <input
                  type="text"
                  className="form-control"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isUpdating}
                />
              </div>
              <div className="col-md-8">
                <label className="form-label fw-medium">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isUpdating}
                />
              </div>
              <div className="col-md-12">
                <label className="form-label fw-medium">Descripción (Opcional)</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isUpdating}
                ></textarea>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">Cantidad</label>
                <input
                  type="number"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isUpdating}
                  min="0"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">Precio de Venta</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  disabled={isUpdating}
                  min="0.01"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">Precio de Compra</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  disabled={isUpdating}
                  min="0.00"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">Fecha de Vencimiento (Opcional)</label>
                <input
                  type="date"
                  className="form-control"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  disabled={isUpdating}
                />
              </div>
              <div className="col-md-8">
                <label className="form-label fw-medium">Categoría</label>
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={isUpdating || categories.length === 0}
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <option value="">Cargando categorías...</option>
                  )}
                </select>
              </div>
            </div>

              <div className="form-check form-switch mt-3">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
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
              {error && (
                <div className="alert alert-danger py-2 mt-3">
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
                  disabled={isUpdating || !code.trim() || !name.trim() || !amount || !salePrice || !purchasePrice || !categoryId}
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

export default ArticleEditModal;