import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/category';

export const categoryService = {
  getCategoriesPaged: async (page = 0, size = 10, sort = 'dateCreated', direction = 'DESC', searchTerm = '') => {
    try {
      const params = { page, size, sort, direction };
      if (searchTerm) {
        params.searchTerm = searchTerm;
      }
      const response = await axios.get(`${API_BASE_URL}/categoryView`, {
        params: params
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching paged categories:", error);
      throw new Error('Error al obtener categorías paginadas');
    }
  },

  getAllCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all categories:", error);
      throw new Error('Error al obtener todas las categorías');
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await axios.post(API_BASE_URL, categoryData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('El nombre de categoría ya existe');
      }
      if (error.response?.status === 400) {
        throw new Error('El nombre de categoría no debe estar vacío');
      }
      console.error("Error creating category:", error);
      throw new Error('Error al crear categoría');
    }
  },

  updateCategory: async (categoryData) => {
    try {
      await axios.put(API_BASE_URL, categoryData);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Categoría no encontrada');
      }
      if (error.response?.status === 409) {
        throw new Error('El nombre de categoría ya existe');
      }
      if (error.response?.status === 400) {
        throw new Error('Datos de solicitud inválidos');
      }
      console.error("Error updating category:", error);
      throw new Error('Error al actualizar la categoría');
    }
  },

  deleteCategory: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Categoría no encontrada');
      }
      console.error("Error deleting category:", error);
      throw new Error('Error al eliminar categoría');
    }
  },

  toggleCategoryState: async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/${id}/toggle-state`);
    } catch (error) {
      let message = 'Error al cambiar el estado';
      
      if (error.response) {
        message = error.response.data?.message || message;
        
        if (error.response.status === 404) message = 'Categoría no encontrada';
        if (error.response.status === 400) message = 'Solicitud inválida';
        if (error.response.status === 409) message = 'Conflicto de estado';
      }
      console.error("Error toggling category state:", error);
      throw new Error(message);
    }
  },
};