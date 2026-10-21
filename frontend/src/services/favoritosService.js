import axiosClient, { extraerError } from '../api/axiosClient.js';

export async function listarFavoritos() {
  try {
    const { data } = await axiosClient.get('/favoritos');
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}

export async function agregarFavorito(tipo, itemId) {
  try {
    const { data } = await axiosClient.post('/favoritos', { tipo, item_id: itemId });
    return data.favorito;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}

export async function eliminarFavorito(id) {
  try {
    const { data } = await axiosClient.delete(`/favoritos/${id}`);
    return data.favorito;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}
