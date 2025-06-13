import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/category';

export const categoryService = {
  // Obtener categorías paginadas con opción de búsqueda
  // El parámetro searchTerm ahora se envía como 'name' para coincidir con el backend
  getCategoriesPaged: async (page = 0, size = 10, sort = 'dateCreated', direction = 'DESC', name = '') => { // CAMBIADO: searchTerm a name
    try {
      const params = { page, size, sort, direction };
      if (name) { // CAMBIADO: searchTerm a name
        params.name = name; // <-- CAMBIADO: Ahora envía 'name' para el backend
      }
      const response = await axios.get(`${API_BASE_URL}/paged`, {
        params: params
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching paged categories:", error);
      throw new Error('Error al obtener categorías paginadas');
    }
  },

  // Obtener todas las categorías (sin paginación) - Opcional si solo usas paginación
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
      const response = await axios.post(`${API_BASE_URL}`, categoryData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('El nombre de la categoría ya existe.');
      }
      if (error.response?.status === 400) {
        throw new Error('El nombre de la categoría no debe estar vacío.');
      }
      console.error("Error creating category:", error);
      throw new Error('Error al crear la categoría');
    }
  },

  updateCategory: async (id, name, state) => { // Mantener el nombre del parámetro de búsqueda consistente
    try {
      const response = await axios.put(`${API_BASE_URL}`, { id, name, state });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Categoría no encontrada');
      }
      if (error.response?.status === 409) {
        throw new Error('El nombre de la categoría ya existe en otra categoría');
      }
      if (error.response?.status === 400) {
        throw new Error('El nombre de la categoría no debe estar vacío.');
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
      const response = await axios.patch(`${API_BASE_URL}/${id}/toggle-state`);
      return response.data;
    } catch (error) {
      let message = 'Error al cambiar el estado';

      if (error.response) {
        message = error.response.data?.message || message;

        if (error.response.status === 404) message = 'Categoría no encontrada';
      }
      console.error("Error toggling category state:", error);
      throw new Error(message);
    }
  },
};