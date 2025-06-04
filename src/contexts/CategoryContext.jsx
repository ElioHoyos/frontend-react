import React, { createContext, useState, useContext, useEffect } from 'react';
import { categoryService } from '../api/categoryService';
import { showSuccessAlert, showErrorAlert } from '../utils/alertHelper';

const CategoryContext = createContext();

export const useCategoryContext = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Función principal para cargar categorías
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar nueva categoría
  const addCategory = async (name) => {
    setIsAdding(true);
    try {
      await categoryService.createCategory(name);
      await fetchCategories();
      setSuccessMessage('Categoría creada exitosamente');
      return true;
    } catch (err) {
      setErrorMessage(err.message);
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  // Función para actualizar categoría existente
  const updateCategory = async (id, name, state) => {
    setIsUpdating(true);
    try {
      await categoryService.updateCategory(id, name, state);
      await fetchCategories();
      setSuccessMessage('Categoría actualizada exitosamente');
      return true;
    } catch (err) {
      setErrorMessage(err.message);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Función para eliminar categoría
  const removeCategory = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      await fetchCategories();
      setSuccessMessage('Categoría eliminada exitosamente');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Función para cambiar estado de categoría
  const toggleCategoryState = async (id) => {
    try {
      await categoryService.toggleCategoryState(id);
      await fetchCategories();
      setSuccessMessage('Estado de categoría cambiado exitosamente');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Efecto para mostrar alertas
  useEffect(() => {
    if (successMessage) {
      showSuccessAlert('Éxito', successMessage);
      setSuccessMessage('');
    }
    
    if (errorMessage) {
      showErrorAlert('Error', errorMessage);
      setErrorMessage('');
    }
  }, [successMessage, errorMessage]);

  // Carga inicial de categorías
  useEffect(() => {
    fetchCategories();
  }, []);

  // Valor que se expone a los componentes hijos
  const contextValue = {
    categories,
    loading,
    error,
    isAdding,
    isUpdating,
    addCategory,
    updateCategory,
    removeCategory,
    toggleCategoryState,
    refreshCategories: fetchCategories
  };

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};