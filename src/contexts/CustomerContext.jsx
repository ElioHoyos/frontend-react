// src/contexts/CustomerContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { customerService } from '../api/customer/customerService';
import { showErrorAlert, showSuccessAlert } from '../utils/alertHelper';

const CustomerContext = createContext();
export const useCustomerContext = () => useContext(CustomerContext);

export const CustomerProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const list = await customerService.getAll();
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      showErrorAlert('Error', e.message || 'No se pudo cargar clientes');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async (payload) => {
    setIsSaving(true);
    try {
      const created = await customerService.create(payload);
      showSuccessAlert('Éxito', 'Cliente registrado correctamente.');
      setItems(prev => [created, ...prev]);
      return true;
    } catch (e) {
      showErrorAlert('Error', e.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.document_number || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <CustomerContext.Provider value={{
      items: filtered, rawItems: items, loading,
      isSaving, add, search, setSearch
    }}>
      {children}
    </CustomerContext.Provider>
  );
};
