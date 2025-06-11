import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortField, setSortField] = useState('dateCreated');
  const [sortDirection, setSortDirection] = useState('DESC');
  // State for search term
  const [searchTerm, setSearchTerm] = useState(''); 
  
  // *** NUEVO ESTADO: Clave para forzar la recarga de categorías ***
  const [refreshKey, setRefreshKey] = useState(0); 

  // *** CAMBIO CRÍTICO AQUÍ: fetchCategories ahora lee del estado, no de argumentos ***
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      // Usa directamente los estados del contexto
      const data = await categoryService.getCategoriesPaged(currentPage, pageSize, sortField, sortDirection, searchTerm);
      setCategories(data.content);
      setCurrentPage(data.number); // Asegurar que el estado de la paginación se actualice desde la respuesta
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setError(null);
    } catch (err) {
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortField, sortDirection, searchTerm]); // *** Dependencias de useCallback: ahora fetchCategories se recrea si estos cambian ***

  // Efecto para disparar fetchCategories cuando cambian los parámetros O refreshKey
  // Ya no incluimos `fetchCategories` en las dependencias porque se maneja su propia recreación.
  useEffect(() => {
    fetchCategories(); // Llama a la función sin argumentos
  }, [currentPage, pageSize, sortField, sortDirection, searchTerm, refreshKey, fetchCategories]); // *** Añadir 'fetchCategories' aquí también, ya que su `useCallback` ahora tiene dependencias, por lo que puede cambiar. ***

  const addCategory = async (name) => {
    setIsAdding(true);
    try {
      await categoryService.createCategory({name: name});
      setCurrentPage(0); // Asegurar que la nueva categoría aparezca en la primera página
      setRefreshKey(prev => prev + 1); // Forzar recarga si no hay otros cambios
      setSuccessMessage('Categoría creada exitosamente');
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
      await categoryService.updateCategory({id: id, name: name, state: state});
      setRefreshKey(prev => prev + 1); // Forzar recarga
      setSuccessMessage('Categoría actualizada exitosamente');
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
      // Ajustar página si la última categoría de la página actual fue eliminada.
      // Si solo queda un elemento en la página actual Y no es la primera página,
      // retrocede una página. Si es la primera página o hay más elementos, quédate.
      const newPage = (currentPage > 0 && categories.length === 1) ? currentPage - 1 : currentPage;
      
      // Actualiza la página si es necesario, esto disparará el useEffect principal.
      // Si la página no cambia, `refreshKey` lo hará.
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      } else {
        setRefreshKey(prev => prev + 1); // Forzar recarga si la página no cambió
      }
      setSuccessMessage('Categoría eliminada exitosamente');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // *** FUNCIÓN toggleCategoryState MEJORADA (sin cambios en la lógica de toggle, solo en el efecto de recarga) ***
  const toggleCategoryState = async (id) => {
    try {
      // Actualización optimista
      setCategories(prev => prev.map(cat =>
        cat.id === id ? {...cat, state: !cat.state} : cat
      ));
      
      await categoryService.toggleCategoryState(id);
      setSuccessMessage('Estado actualizado correctamente');
      
      // *** Importante: Forzar una recarga INCREMENTANDO refreshKey ***
      // Esto garantizará que el `useEffect` se dispare y `fetchCategories`
      // se ejecute, sincronizando la UI con el backend, incluso si
      // currentPage, pageSize, etc., no han cambiado.
      setRefreshKey(prev => prev + 1); 

    } catch (err) {
      // Revertir en caso de error
      setCategories(prev => prev.map(cat =>
        cat.id === id ? {...cat, state: !cat.state} : cat
      ));
      setErrorMessage(err.message);
    }
  };

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
    searchTerm, 
    addCategory,
    updateCategory,
    removeCategory,
    toggleCategoryState,
    setCurrentPage,
    setPageSize,
    setSortField,
    setSortDirection,
    setSearchTerm, 
  };

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};