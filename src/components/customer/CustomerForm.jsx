// src/components/customer/CustomerForm.jsx
import React, { useState } from 'react';
import { useCustomerContext } from '../../contexts/CustomerContext';
import { lookupService } from '../../api/customer/lookupService';
import { FaSearch, FaSave } from 'react-icons/fa';

const TYPE_PERSON = [
  { value: 'Cliente', label: 'Cliente' },
  { value: 'Proveedor', label: 'Proveedor' }
];

const DOC_TYPES = [
  { value: 'DNI', label: 'DNI (8 dígitos)' },
  { value: 'RUC', label: 'RUC (11 dígitos)' }
];

export default function CustomerForm({ onClose }) {
  const { isSaving, add } = useCustomerContext();

  const [form, setForm] = useState({
    type_person: 'Cliente',
    document_type: 'DNI',
    document_number: '',
    name: '',
    cellphone: '',
    email: '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  const setField = (k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setErrors(prev => ({ ...prev, [k]: null }));
  };

  const maxLen = form.document_type === 'RUC' ? 11 : 8;

  const validate = () => {
    const e = {};
    if (!form.type_person) e.type_person = 'Requerido';
    if (!form.document_type) e.document_type = 'Requerido';
    if (!/^\d+$/.test(form.document_number) || form.document_number.length !== maxLen) {
      e.document_number = `Ingrese ${maxLen} dígitos`;
    }
    if (!form.name.trim()) e.name = 'Requerido';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido';
    if (form.cellphone && !/^\d{6,15}$/.test(form.cellphone)) e.cellphone = 'Teléfono inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLookup = async () => {
    try {
      if (form.document_type === 'DNI') {
        const d = await lookupService.dni(form.document_number);
        const fullName = [d.nombres, d.apellidoPaterno, d.apellidoMaterno].filter(Boolean).join(' ');
        setField('name', fullName.toUpperCase());
      } else {
        const r = await lookupService.ruc(form.document_number);
        setField('name', (r.razonSocial || '').toUpperCase());
        if (r.direccion) setField('address', r.direccion);
      }
    } catch (e) {
      setErrors(prev => ({ ...prev, document_number: 'No encontrado / token inválido' }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      type_person: form.type_person,
      name: form.name.trim(),
      document_type: form.document_type,
      document_number: form.document_number,
      cellphone: form.cellphone || null,
      email: form.email || null,
      address: form.address || null
    };

    const ok = await add(payload);
    if (ok) onClose?.();
  };

  return (
    <form onSubmit={submit} className="card border-success">
      <div className="card-header bg-success text-white">
        <strong>Registrar Cliente</strong>
      </div>

      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Tipo de persona</label>
            <select
              className="form-select"
              value={form.type_person}
              onChange={(e) => setField('type_person', e.target.value)}
            >
              {TYPE_PERSON.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {errors.type_person && <div className="text-danger small">{errors.type_person}</div>}
          </div>

          <div className="col-md-4">
            <label className="form-label">Tipo documento</label>
            <select
              className="form-select"
              value={form.document_type}
              onChange={(e) => setField('document_type', e.target.value)}
            >
              {DOC_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {errors.document_type && <div className="text-danger small">{errors.document_type}</div>}
          </div>

          <div className="col-md-4">
            <label className="form-label">N° documento</label>
            <div className="input-group">
              <input
                className={`form-control ${errors.document_number ? 'is-invalid' : ''}`}
                value={form.document_number}
                onChange={(e) =>
                  setField('document_number', e.target.value.replace(/\D/g, '').slice(0, maxLen))
                }
                placeholder={form.document_type === 'RUC' ? '11 dígitos' : '8 dígitos'}
              />
              <button type="button" className="btn btn-outline-secondary" title="Autocompletar" onClick={handleLookup}>
                <FaSearch />
              </button>
              <div className="invalid-feedback">{errors.document_number}</div>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label">Nombre / Razón social</label>
            <input
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
            />
            <div className="invalid-feedback">{errors.name}</div>
          </div>

          <div className="col-md-6">
            <label className="form-label">Dirección</label>
            <input
              className="form-control"
              value={form.address}
              onChange={(e) => setField('address', e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Celular</label>
            <input
              className={`form-control ${errors.cellphone ? 'is-invalid' : ''}`}
              value={form.cellphone}
              onChange={(e) => setField('cellphone', e.target.value)}
              placeholder="Opcional"
            />
            <div className="invalid-feedback">{errors.cellphone}</div>
          </div>

          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="Opcional"
            />
            <div className="invalid-feedback">{errors.email}</div>
          </div>
        </div>
      </div>

      <div className="card-footer d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={isSaving}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-success" disabled={isSaving}>
          <FaSave className="me-2" /> {isSaving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
