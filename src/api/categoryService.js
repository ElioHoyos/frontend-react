import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/category';

export const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categoryView`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener categorías');
    }
  },

  createCategory: async (name) => {
    try {
      const response = await axios.post(API_BASE_URL, { name });
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('El nombre de categoría ya existe');
      }
      throw new Error('Error al crear categoría');
    }
  },

  updateCategory: async (id, name, state) => {
    try {
      await axios.put(API_BASE_URL, { id, name, state });
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
      throw new Error('Error al eliminar categoría');
    }
  },

  toggleCategoryState: async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/${id}/toggle-state`);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Categoría no encontrada');
      }
      throw new Error('Error al cambiar el estado de la categoría');
    }
  }
};