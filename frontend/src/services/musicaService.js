import axiosClient, { extraerError } from '../api/axiosClient.js';

// Búsqueda de canciones en Jamendo (cualquier usuario con sesión).
export async function buscarCanciones(q, signal) {
  try {
    const { data } = await axiosClient.get('/musica/buscar', { params: { q }, signal });
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}

// Importación de una o varias canciones al catálogo (solo administrador).
export async function importarCanciones(canciones) {
  try {
    const { data } = await axiosClient.post('/musica/importar', { canciones });
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}
