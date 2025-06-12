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
  const [searchTerm, setSearchTerm] = useState(''); 
  
  // NUEVO ESTADO: Clave para forzar la recarga de categorías
  // Se usa para asegurar que fetchCategories se ejecuta cuando se necesita,
  // como después de un toggleState o delete.
  const [refreshKey, setRefreshKey] = useState(0); 

  const fetchCategories = useCallback(async () => { // Eliminamos parámetros aquí, se toman de los estados
    setLoading(true);
    try {
      // Pasamos los estados de paginación, ordenamiento y búsqueda a la función de servicio
      const data = await categoryService.getCategoriesPaged(
        currentPage, 
        pageSize, 
        sortField, 
        sortDirection,
        searchTerm // <-- Añadido: Pasa el término de búsqueda
      );
      setCategories(data.content);
      setCurrentPage(data.number);
      setPageSize(data.size);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortField, sortDirection, searchTerm, refreshKey]); // eslint-disable-next-line react-hooks/exhaustive-deps

  // Carga inicial y recarga cuando cambian las dependencias de fetchCategories
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // <-- Dependencia de fetchCategories

  // Función para agregar nueva categoría
  const addCategory = async (name) => {
    setIsAdding(true);
    try {
      await categoryService.createCategory({name: name});
      setSuccessMessage('Categoría creada exitosamente');
      setRefreshKey(prev => prev + 1); // Forzar recarga después de añadir
      return true;
    } catch (err) {
      setErrorMessage(err.message || 'Error al crear la categoría');
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  // Función para actualizar categoría
  const updateCategory = async (id, name, state) => {
    setIsUpdating(true);
    try {
      await categoryService.updateCategory({id, name, state});
      setSuccessMessage('Categoría actualizada exitosamente');
      setRefreshKey(prev => prev + 1); // Forzar recarga después de actualizar
      return true;
    } catch (err) {
      setErrorMessage(err.message || 'Error al actualizar la categoría');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Función para eliminar categoría
  const removeCategory = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      setSuccessMessage('Categoría eliminada exitosamente');
      setRefreshKey(prev => prev + 1); // Forzar recarga después de eliminar
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Función corregida para cambiar estado con actualización optimista y recarga forzada
  const toggleCategoryState = async (id) => {
    try {
      // Actualización optimista: Cambia el estado en el UI inmediatamente
      setCategories(prev => prev.map(cat => 
        cat.id === id ? {...cat, state: !cat.state} : cat
      ));
      
      await categoryService.toggleCategoryState(id);
      setSuccessMessage('Estado actualizado correctamente');
      
      // Importante: Forzar una recarga incrementando refreshKey
      // Esto asegura que la tabla se refresque con los datos más recientes del backend
      setRefreshKey(prev => prev + 1); 

    } catch (err) {
      // Revertir en caso de error: Si la API falla, revertimos el cambio en el UI
      setCategories(prev => prev.map(cat => 
        cat.id === id ? {...cat, state: !cat.state} : cat
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
    searchTerm, // <-- Añadido: Exponer searchTerm
    addCategory,
    updateCategory,
    removeCategory,
    toggleCategoryState,
    setCurrentPage,
    setPageSize,
    setSortField,
    setSortDirection,
    setSearchTerm, // <-- Añadido: Exponer setSearchTerm
    // No es necesario exponer refreshKey directamente
  };

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};