// src/components/ArticleForm.jsx
import React, { useState, useEffect } from 'react';
import { useArticleContext } from '../../contexts/ArticleContext'; // Ajusta la ruta si es diferente
import { format } from 'date-fns'; // Para formatear la fecha de vencimiento

const ArticleForm = () => {
  const { addArticle, isAdding, categories } = useArticleContext();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [expirationDate, setExpirationDate] = useState(''); // Formato 'yyyy-MM-dd'
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');

  // Establece la primera categoría como seleccionada por defecto si hay categorías
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id.toString());
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
      code: code.trim(),
      name: name.trim(),
      description: description.trim() || null,
      amount: parseInt(amount),
      sale_price: parseFloat(salePrice),
      purchase_price: parseFloat(purchasePrice),
      expiration_date: expirationDate || null,
      category_id: parseInt(categoryId)
    };

    try {
      const success = await addArticle(articleData);
      if (success) {
        // Limpiar formulario si se añadió exitosamente
        setCode('');
        setName('');
        setDescription('');
        setAmount('');
        setSalePrice('');
        setPurchasePrice('');
        setExpirationDate('');
        if (categories.length > 0) {
          setCategoryId(categories[0].id.toString());
        } else {
          setCategoryId('');
        }
      }
    } catch (err) {
      setError(err.message || 'Error al crear el artículo');
    }
  };

  return (
    <div className="card shadow-sm mb-4 border-primary">
      <div className="card-header bg-primary text-white">
        <h5 className="card-title mb-0">Nuevo Artículo</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-medium">Código</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese el código del artículo"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isAdding}
              />
            </div>
            <div className="col-md-8">
              <label className="form-label fw-medium">Nombre</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese el nombre del artículo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isAdding}
              />
            </div>
            <div className="col-md-12">
              <label className="form-label fw-medium">Descripción (Opcional)</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Descripción del artículo"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isAdding}
              ></textarea>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium">Cantidad</label>
              <input
                type="number"
                className="form-control"
                placeholder="Cantidad"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isAdding}
                min="0"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium">Precio de Venta</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="Precio de venta"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                disabled={isAdding}
                min="0.01"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium">Precio de Compra</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="Precio de compra"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                disabled={isAdding}
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
                disabled={isAdding}
              />
            </div>
            <div className="col-md-8">
              <label className="form-label fw-medium">Categoría</label>
              <select
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={isAdding || categories.length === 0}
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

          {error && (
            <div className="alert alert-danger py-2 mt-3">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          <div className="d-flex justify-content-end mt-4">
            <button 
              type="submit" 
              className="btn btn-primary px-4"
              disabled={isAdding || !code.trim() || !name.trim() || !amount || !salePrice || !purchasePrice || !categoryId}
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
                  Agregar Artículo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleForm;