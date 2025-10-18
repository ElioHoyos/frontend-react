// src/api/articleService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/article';

export const articleService = {
  getArticlesPaged: async (page = 0, size = 10, search = '') => {
    try {
      const params = { page, size };
      if (search) params.search = search;   // <-- el backend espera 'search'
      const { data } = await axios.get(API_BASE_URL, { params });
      return data; // Spring Page: { content, totalPages, totalElements, ... }
    } catch (error) {
      console.error('getArticlesPaged:', error.response?.data || error.message);
      throw new Error('Error al obtener artículos paginados');
    }
  },

  getAll: async () => {
    const { data } = await axios.get(API_BASE_URL);
    return data;
  },

  // Crear (el backend generará el código de barras si no envías "code")
  create: async (payload) => {
    try {
      const { data } = await axios.post(API_BASE_URL, payload);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear el artículo');
    }
  },

  // Update: asumo @PutMapping("/{id}") en tu controller
  update: async (id, payload) => {
  try {
    const { data } = await axios.put(`${API_BASE_URL}/${id}`, payload);
    return data;
  } catch (error) {
    const data = error.response?.data;
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const msg = Object.values(data).join('\n');
      throw new Error(msg || 'Error al actualizar el artículo');
    }
    throw new Error(error.response?.data?.message || 'Error al actualizar el artículo');
  }
},

   remove: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar el artículo');
    }
  },

  // Toggle estado (si tienes PATCH /{id}/toggle-state en tu controller).
  // Si aún no existe, puedes implementarlo igual que en categorías.
  toggleState: async (id) => {
    try {
      const { data } = await axios.patch(`${API_BASE_URL}/${id}/toggle-state`);
      return data;
    } catch (error) {
      const status = error.response?.status;
      if (status === 404) throw new Error('Artículo no encontrado');
      throw new Error(error.response?.data?.message || 'Error al cambiar estado');
    }
  },

  // Opcional: buscar por código de barras si lo tienes
  getByCode: async (code) => {
    const { data } = await axios.get(`${API_BASE_URL}/code/${code}`);
    return data;
  },
};
