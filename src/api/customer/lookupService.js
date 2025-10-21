// src/api/customer/lookupService.js
import axios from 'axios';

const BASE = 'http://localhost:8080/api/v1/lookup';

export const lookupService = {
  dni: async (dni) => {
    const { data } = await axios.get(`${BASE}/dni/${dni}`);
    return data; // {dni,nombres,apellidoPaterno,apellidoMaterno}
  },
  ruc: async (ruc) => {
    const { data } = await axios.get(`${BASE}/ruc/${ruc}`);
    return data; // {ruc,razonSocial,...,direccion,...}
  },
};
