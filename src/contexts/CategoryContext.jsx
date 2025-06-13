import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { categoryService } from '../api/category/categoryService';
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortField, setSortField] = useState('dateCreated');
  const [sortDirection, setSortDirection] = useState('DESC');

  // State for search term (NUEVO)
  const [searchTerm, setSearchTerm] = useState(''); // Se mantiene para el input, pero se pasará como 'name' al servicio

  // NUEVO ESTADO: Clave para forzar la recarga de categorías
  // Se usa para asegurar que fetchCategories se ejecuta cuando se necesita,
  // como después de un toggleState o delete
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      // Pasamos 'searchTerm' directamente como el parámetro 'name' al servicio
      const data = await categoryService.getCategoriesPaged(currentPage, pageSize, sortField, sortDirection, searchTerm); // CAMBIADO: searchTerm se pasa como 'name'
      setCategories(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar categorías');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortField, sortDirection, searchTerm, refreshKey]); // Añadido refreshKey a las dependencias

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (name) => {
    setIsAdding(true);
    try {
      await categoryService.createCategory({ name, state: true });
      setSuccessMessage('Categoría agregada exitosamente.');
      setRefreshKey(prev => prev + 1); // Forzar recarga
      return true;
    } catch (err) {
      setErrorMessage(err.message);
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const updateCategory = async (id, name, state) => {
    setIsUpdating(true);
    try {
      await categoryService.updateCategory(id, name, state);
      setSuccessMessage('Categoría actualizada exitosamente.');
      setRefreshKey(prev => prev + 1); // Forzar recarga
      return true;
    } catch (err) {
      setErrorMessage(err.message);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const removeCategory = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      setSuccessMessage('Categoría eliminada exitosamente.');
      setRefreshKey(prev => prev + 1); // Forzar recarga
      // Si la página actual queda vacía después de eliminar, ir a la anterior
      if (categories.length === 1 && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const toggleCategoryState = async (id) => {
    // Optimistic UI update
    setCategories(prev => prev.map(cat =>
      cat.id === id ? { ...cat, state: !cat.state } : cat
    ));
    try {
      await categoryService.toggleCategoryState(id);
      setSuccessMessage('Estado de categoría cambiado exitosamente.');
      setRefreshKey(prev => prev + 1); // Forzar una recarga incrementando refreshKey
      // Esto asegura que la tabla se refresque con los datos más recientes del backend

    } catch (err) {
      // Revertir en caso de error: Si la API falla, revertimos el cambio en el UI
      setCategories(prev => prev.map(cat =>
        cat.id === id ? { ...cat, state: !cat.state } : cat
      ));
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

  // Valor que se expone a los componentes hijos
  const contextValue = {
    categories,
    loading,
    error,
    isAdding,
    isUpdating,
    currentPage,
    pageSize,
    totalPages,
    totalElements,
    sortField,
    sortDirection,
    searchTerm, // Se expone searchTerm para el input
    addCategory,
    updateCategory,
    removeCategory,
    toggleCategoryState,
    setCurrentPage,
    setPageSize,
    setSortField,
    setSortDirection,
    setSearchTerm, // NUEVO: Exponer setSearchTerm
  };

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};