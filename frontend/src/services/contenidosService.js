import axiosClient from '../api/axiosClient.js';

export async function listarContenidos(seccion, q, genero) {
  const params = {};
  if (seccion) params.seccion = seccion;
  if (q) params.q = q;
  if (genero) params.genero = genero;
  const { data } = await axiosClient.get('/contenidos', { params });
  return data;
}

export async function obtenerContenido(id) {
  const { data } = await axiosClient.get(`/contenidos/${id}`);
  return data;
}

export async function crearContenido(datos) {
  const { data } = await axiosClient.post('/contenidos', datos);
  return data;
}

export async function editarContenido(id, datos) {
  const { data } = await axiosClient.put(`/contenidos/${id}`, datos);
  return data;
}

export async function eliminarContenido(id) {
  const { data } = await axiosClient.delete(`/contenidos/${id}`);
  return data;
}
