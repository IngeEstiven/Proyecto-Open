import axiosClient, { crearErrorApi } from '../api/axiosClient.js';

export async function listarJuegos(categoria, q) {
  try {
    const params = {};
    if (categoria) params.categoria = categoria;
    if (q) params.q = q;
    const { data } = await axiosClient.get('/juegos', { params });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function obtenerJuego(slug) {
  try {
    const { data } = await axiosClient.get(`/juegos/${slug}`);
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function crearJuego(datos) {
  try {
    const { data } = await axiosClient.post('/juegos', datos);
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function editarJuego(id, datos) {
  try {
    const { data } = await axiosClient.put(`/juegos/${id}`, datos);
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function cambiarEstadoJuego(id, estado) {
  try {
    const { data } = await axiosClient.patch(`/juegos/${id}/estado`, { estado });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function eliminarJuego(id) {
  try {
    const { data } = await axiosClient.delete(`/juegos/${id}`);
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function subirImagenJuego(id, archivo) {
  try {
    const formData = new FormData();
    formData.append('file', archivo);
    const { data } = await axiosClient.patch(`/juegos/${id}/imagen`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}
