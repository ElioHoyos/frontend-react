// src/components/article/ArticleForm.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { useArticleContext } from '../../contexts/ArticleContext';
import { categoryService } from '../../api/category/categoryService';
import { FaPlus, FaSyncAlt } from 'react-icons/fa';

/* ----- helpers EAN13 (solo preview UI) ----- */
const ean13CheckDigit = (base12) => {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const n = base12.charCodeAt(i) - 48; // '0' => 48
    sum += (i % 2 === 0) ? n : n * 3;
  }
  return String((10 - (sum % 10)) % 10);
};

const generateEan13Preview = () => {
  const base12 = (Date.now().toString() + Math.floor(Math.random() * 1e6).toString()).slice(0, 12);
  return base12 + ean13CheckDigit(base12);
};

/* ----- estilos react-select modo bootstrap ----- */
const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 44,
    borderColor: state.isFocused ? '#198754' : '#ced4da',
    boxShadow: state.isFocused ? '0 0 0 .2rem rgba(25,135,84,.25)' : 'none',
    '&:hover': { borderColor: '#198754' },
  }),
  menu: (base) => ({ ...base, zIndex: 9999 })
};

const ArticleForm = ({ onClose }) => {
  const { isSaving, addArticle } = useArticleContext();

  /* form state */
  const [categoryId, setCategoryId] = useState(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState(0);
  const [purchase, setPurchase] = useState(0);
  const [sale, setSale] = useState(0);
  const [expire, setExpire] = useState('');
  const [clientCode, setClientCode] = useState(generateEan13Preview());

  /* categorías para el select */
  const [catOptions, setCatOptions] = useState([]);
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const all = await categoryService.getAllCategories();
        if (!ignore) {
          setCatOptions(all.map(c => ({ value: c.id, label: c.name })));
        }
      } catch (e) {}
    })();
    return () => { ignore = true; };
  }, []);

  // al montar, muestro un código nuevo de preview
  useEffect(() => {
    setClientCode(generateEan13Preview());
  }, []);

  const selectedCat = useMemo(
    () => catOptions.find(o => o.value === categoryId) ?? null,
    [catOptions, categoryId]
  );

  const handleRegenerate = () => setClientCode(generateEan13Preview());

  /* === NUEVO: función para resetear el formulario === */
  const resetForm = () => {
    setCategoryId(null);
    setName('');
    setDesc('');
    setAmount(0);
    setPurchase(0);
    setSale(0);
    setExpire('');
    setClientCode(generateEan13Preview());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // IMPORTANTE: no enviamos `code` para que el backend lo autogenere.
    const payload = {
      category_id: categoryId,
      name: name.trim(),
      description: desc.trim(),
      amount: Number(amount) || 0,
      sale_price: Number(sale) || 0,
      purchase_price: Number(purchase) || 0,
      expiration_date: expire || null,
    };

    const ok = await addArticle(payload);
    if (ok) {
      resetForm();        // <-- limpia el formulario
      onClose?.();        // <-- cierra el modal
    }
  };

  /* === NUEVO: cancelar también limpia === */
  const handleCancel = () => {
    resetForm();
    onClose?.();
  };

  return (
    <div className="modal-body">
      <form onSubmit={handleSubmit}>

        <div className="card border-success">
          <div className="card-header bg-success text-white">
            <strong>Agregar Producto</strong>
          </div>

          <div className="card-body">
            <div className="row g-3">
              {/* Categoría (react-select con búsqueda) */}
              <div className="col-md-4">
                <label className="form-label">Categoría</label>
                <Select
                  options={catOptions}
                  value={selectedCat}
                  onChange={(opt) => setCategoryId(opt?.value ?? null)}
                  isClearable
                  placeholder="— Busca o selecciona —"
                  styles={selectStyles}
                />
              </div>

              {/* Nombre */}
              <div className="col-md-4">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre del producto"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Código de barras (preview autogenerado) */}
              <div className="col-md-4">
                <label className="form-label">Código de barras (autogenerado)</label>
                <div className="input-group">
                  <input
                    className="form-control bg-light"
                    value={clientCode}
                    readOnly
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    title="Generar otro código de vista previa"
                    onClick={handleRegenerate}
                  >
                    <FaSyncAlt />
                  </button>
                </div>
                <small className="text-muted">
                  El código definitivo lo asigna el servidor al guardar.
                </small>
              </div>

              {/* Descripción */}
              <div className="col-12">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  placeholder="Detalle del producto (opcional)"
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              {/* Cantidad / Precios / Vencimiento */}
              <div className="col-md-3">
                <label className="form-label">Cantidad</label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Precio Compra</label>
                <div className="input-group">
                  <span className="input-group-text">S/</span>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    min="0"
                    value={purchase}
                    onChange={(e) => setPurchase(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-3">
                <label className="form-label">Precio Venta</label>
                <div className="input-group">
                  <span className="input-group-text">S/</span>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    min="0"
                    value={sale}
                    onChange={(e) => setSale(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-3">
                <label className="form-label">Vence</label>
                <input
                  type="date"
                  className="form-control"
                  value={expire}
                  onChange={(e) => setExpire(e.target.value)}
                  min={new Date(Date.now() + 86400000).toISOString().slice(0,10)} // > hoy
                />
                <small className="text-muted">No se permite hoy ni fechas pasadas.</small>
              </div>
            </div>
          </div>

          <div className="card-footer d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleCancel}     // <-- ahora limpia y cierra
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={isSaving || !name.trim() || !categoryId}
            >
              {isSaving ? 'Guardando…' : (<><FaPlus className="me-2" />Agregar</>)}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default ArticleForm;
