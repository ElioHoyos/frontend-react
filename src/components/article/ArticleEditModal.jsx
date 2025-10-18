// src/components/article/ArticleEditModal.jsx
import React, { useEffect, useState } from 'react';
import { useArticleContext } from '../../contexts/ArticleContext';
import { categoryService } from '../../api/category/categoryService';

const ArticleEditModal = ({ article, onClose }) => {
  const { updateArticle, isUpdating } = useArticleContext();
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    category_id: article.category_id ?? article.categoryId ?? '',
    name: article.name ?? '',
    description: article.description ?? '',
    amount: article.amount ?? 0,
    purchase_price: article.purchase_price ?? article.purchasePrice ?? 0,
    sale_price: article.sale_price ?? article.salePrice ?? 0,
    expiration_date: article.expiration_date ?? article.expirationDate ?? '',
    code: article.code ?? '',
    state: !!article.state
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data || []);
      } catch {}
    })();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const ok = await updateArticle(article.id, {
      category_id: Number(form.category_id),
      name: form.name.trim(),
      description: form.description.trim(),
      amount: Number(form.amount ?? 0),
      purchase_price: Number(form.purchase_price ?? 0),
      sale_price: Number(form.sale_price ?? 0),
      expiration_date: form.expiration_date || null,
      code: form.code?.trim() || null,
      state: !!form.state
    });
    if (ok) onClose();
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">Editar Producto</h5>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>
          <div className="modal-body">
            <form onSubmit={submit} className="row g-3">
              <div className="col-12 col-md-4">
                <label className="form-label">Categoría</label>
                <select name="category_id" className="form-select" value={form.category_id} onChange={onChange}>
                  <option value="">-- Selecciona --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Nombre</label>
                <input name="name" className="form-control" value={form.name} onChange={onChange} />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Código de barras</label>
                <input name="code" className="form-control" value={form.code || ''} onChange={onChange} />
              </div>

              <div className="col-12">
                <label className="form-label">Descripción</label>
                <input name="description" className="form-control" value={form.description} onChange={onChange} />
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label">Cantidad</label>
                <input type="number" name="amount" className="form-control" value={form.amount} onChange={onChange} min="0" />
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label">Precio Compra</label>
                <input type="number" step="0.01" name="purchase_price" className="form-control" value={form.purchase_price} onChange={onChange} min="0" />
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label">Precio Venta</label>
                <input type="number" step="0.01" name="sale_price" className="form-control" value={form.sale_price} onChange={onChange} min="0" />
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label">Vence</label>
                <input type="date" name="expiration_date" className="form-control" value={form.expiration_date || ''} onChange={onChange} />
              </div>

              <div className="col-12 form-check form-switch mt-2">
                <input type="checkbox" className="form-check-input" id="state" name="state" checked={!!form.state} onChange={onChange} />
                <label className="form-check-label" htmlFor="state">{form.state ? 'Activo' : 'Inactivo'}</label>
              </div>

              <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isUpdating}>Cancelar</button>
                <button type="submit" className="btn btn-success" disabled={isUpdating}>
                  {isUpdating ? (<><span className="spinner-border spinner-border-sm me-2" />Guardando...</>) : 'Guardar Cambios'}
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
