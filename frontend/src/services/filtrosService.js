import axiosClient, { extraerError } from '../api/axiosClient.js';

// Catálogo de filtros (secciones, géneros por sección y categorías de juego).
export async function obtenerFiltros() {
  try {
    const { data } = await axiosClient.get('/buscar/filtros');
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}
