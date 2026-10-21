import axiosClient from '../api/axiosClient.js';

export async function listarJuegos(categoria, q) {
  const params = {};
  if (categoria) params.categoria = categoria;
  if (q) params.q = q;
  const { data } = await axiosClient.get('/juegos', { params });
  return data;
}

export async function obtenerJuego(slug) {
  const { data } = await axiosClient.get(`/juegos/${slug}`);
  return data;
}

export async function crearJuego(datos) {
  const { data } = await axiosClient.post('/juegos', datos);
  return data;
}

export async function editarJuego(id, datos) {
  const { data } = await axiosClient.put(`/juegos/${id}`, datos);
  return data;
}

export async function cambiarEstadoJuego(id, estado) {
  const { data } = await axiosClient.patch(`/juegos/${id}/estado`, { estado });
  return data;
}

export async function eliminarJuego(id) {
  const { data } = await axiosClient.delete(`/juegos/${id}`);
  return data;
}

export async function subirImagenJuego(id, archivo) {
  const formData = new FormData();
  formData.append('file', archivo);
  const { data } = await axiosClient.patch(`/juegos/${id}/imagen`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}
