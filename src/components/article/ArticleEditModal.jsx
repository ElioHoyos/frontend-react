// src/components/article/ArticleEditModal.jsx
import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import Select from 'react-select';
import { useArticleContext } from '../../contexts/ArticleContext';
import { categoryService } from '../../api/category/categoryService';

const ArticleEditModal = ({ article, onClose }) => {
  const { updateArticle, isUpdating } = useArticleContext();

  // ====== estado ======
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  // mañana (no se permite hoy ni pasado)
  const minDate = dayjs().add(1, 'day').format('YYYY-MM-DD');

  // normalizo la fecha a YYYY-MM-DD por si viene con hora
  const initialExp = (article.expiration_date ?? article.expirationDate)
    ? dayjs(article.expiration_date ?? article.expirationDate).format('YYYY-MM-DD')
    : '';

  // ⚠️ Declarar 'form' ANTES de usarlo en selectedCategory
  const [form, setForm] = useState({
    category_id: article.category_id ?? article.categoryId ?? '',
    name: article.name ?? '',
    description: article.description ?? '',
    amount: article.amount ?? 0,
    purchase_price: article.purchase_price ?? article.purchasePrice ?? 0,
    sale_price: article.sale_price ?? article.salePrice ?? 0,
    expiration_date: initialExp,
    code: article.code ?? '',
    state: !!article.state
  });

  // cargar categorías
  useEffect(() => {
    (async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data || []);
      } catch {}
    })();
  }, []);

  // opciones para react-select
  const categoryOptions = useMemo(
    () => categories.map(c => ({ value: c.id, label: c.name })),
    [categories]
  );

  // valor seleccionado (depende de form)
  const selectedCategory = useMemo(
    () => categoryOptions.find(o => o.value === Number(form.category_id)) ?? null,
    [categoryOptions, form.category_id]
  );

  const onCategoryChange = (opt) => {
    setForm(p => ({ ...p, category_id: opt?.value || '' }));
    setErrors(prev => ({ ...prev, category_id: null }));
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const submit = async (e) => {
    e.preventDefault();

    // Validación: no hoy ni pasado
    const exp = dayjs(form.expiration_date);
    const today = dayjs().startOf('day');
    if (!exp.isValid() || !exp.isAfter(today, 'day')) {
      setErrors(prev => ({
        ...prev,
        expiration_date: 'La fecha de vencimiento debe ser posterior a hoy.'
      }));
      return;
    }

    const ok = await updateArticle(article.id, {
      category_id: Number(form.category_id),
      name: form.name.trim(),
      description: form.description.trim(),
      amount: Number(form.amount ?? 0),
      purchase_price: Number(form.purchase_price ?? 0),
      sale_price: Number(form.sale_price ?? 0),
      expiration_date: form.expiration_date || null,
      code: form.code?.trim() || null, // no editable, pero lo enviamos por consistencia
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
                <Select
                  inputId="category_id"
                  classNamePrefix="react-select"
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={onCategoryChange}
                  isClearable
                  placeholder="— Buscar y seleccionar —"
                  noOptionsMessage={() => 'Sin resultados'}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: 38,
                      boxShadow: 'none',
                      borderColor: errors.category_id ? '#dc3545' : base.borderColor,
                      '&:hover': { borderColor: errors.category_id ? '#dc3545' : '#86b7fe' }
                    })
                  }}
                />
                {errors.category_id && (
                  <div className="text-danger small mt-1">{errors.category_id}</div>
                )}
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Nombre</label>
                <input name="name" className="form-control" value={form.name} onChange={onChange} />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Código de barras</label>
                {/* Bloqueado: no editable */}
                <input
                  name="code"
                  className="form-control"
                  value={form.code || ''}
                  disabled
                  readOnly
                  title="El Código de barra no se puede modificar"
                />
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
                <input
                  type="date"
                  name="expiration_date"
                  className={`form-control ${errors.expiration_date ? 'is-invalid' : ''}`}
                  value={form.expiration_date || ''}
                  onChange={e => setForm(f => ({ ...f, expiration_date: e.target.value }))}
                  min={minDate}
                />
                {errors.expiration_date && (
                  <div className="invalid-feedback">{errors.expiration_date}</div>
                )}
              </div>

              <div className="col-12 form-check form-switch mt-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="state"
                  name="state"
                  checked={!!form.state}
                  onChange={onChange}
                />
                <label className="form-check-label" htmlFor="state">
                  {form.state ? 'Activo' : 'Inactivo'}
                </label>
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
