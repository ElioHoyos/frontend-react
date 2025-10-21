// src/api/customer/customerService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/person';

export const customerService = {
  getAll: async () => {
    const { data } = await axios.get(API_BASE_URL);
    return data; // lista de CustomerDto
  },

  create: async (payload) => {
    try {
      const { data } = await axios.post(API_BASE_URL, payload);
      return data; // CustomerDto creado
    } catch (err) {
      // tu backend devuelve { Advertencia: "..."} o ValidationException con arrays
      const msg =
        err.response?.data?.Advertencia ||
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.Advertencia) ? err.response.data.Advertencia.join('\n') : '') ||
        'Error al registrar cliente';
      throw new Error(msg);
    }
  },
};
