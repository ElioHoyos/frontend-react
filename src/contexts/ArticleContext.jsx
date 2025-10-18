// src/contexts/ArticleContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { articleService } from '../api/article/articleService';
import { showSuccessAlert, showErrorAlert } from '../utils/alertHelper';

const ArticleContext = createContext();
export const useArticleContext = () => useContext(ArticleContext);

export const ArticleProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // flags
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // pagination/sort/search
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortField, setSortField] = useState('dateCreated');
  const [sortDirection, setSortDirection] = useState('DESC');
  const [searchTerm, setSearchTerm] = useState('');

  const [refreshKey, setRefreshKey] = useState(0);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await articleService.getArticlesPaged(currentPage, pageSize, searchTerm);
      setItems(data.content || []);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar artículos');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortField, sortDirection, searchTerm, refreshKey]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const addArticle = async (payload) => {
    setIsSaving(true);
    try {
      await articleService.create(payload);
      showSuccessAlert('Éxito', 'Artículo agregado exitosamente.');
      setRefreshKey(v => v + 1);
      return true;
    } catch (err) {
      showErrorAlert('Error', err.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateArticle = async (id, payload) => {
    setIsUpdating(true);
    try {
      await articleService.update(id, payload);
      showSuccessAlert('Éxito', 'Artículo actualizado exitosamente.');
      setRefreshKey(v => v + 1);
      return true;
    } catch (err) {
      showErrorAlert('Error', err.message);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const removeArticle = async (id) => {
    try {
      await articleService.remove(id);
      showSuccessAlert('Éxito', 'Artículo eliminado exitosamente.');
    if (items.length === 1 && currentPage > 0) setCurrentPage(p => p - 1);
    setRefreshKey(v => v + 1);
  } catch (err) {
    showErrorAlert('Error', err.message);
  }
};

  const toggleArticleState = async (id) => {
    // Optimistic UI
    setItems(prev => prev.map(a => a.id === id ? { ...a, state: !a.state } : a));
    try {
      await articleService.toggleState(id);
      showSuccessAlert('Éxito', 'Estado cambiado correctamente.');
      setRefreshKey(v => v + 1);
    } catch (err) {
      // rollback
      setItems(prev => prev.map(a => a.id === id ? { ...a, state: !a.state } : a));
      showErrorAlert('Error', err.message);
    }
  };

  const value = {
    items, loading, error,
    isSaving, isUpdating,
    currentPage, pageSize, totalPages, totalElements,
    sortField, sortDirection, searchTerm,
    setCurrentPage, setPageSize, setSortField, setSortDirection, setSearchTerm,
    addArticle, updateArticle, removeArticle, toggleArticleState,
  };

  return <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>;
};
