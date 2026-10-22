import axiosClient, { crearErrorApi } from '../api/axiosClient.js';

export async function listarContenidos(seccion, q, genero) {
  try {
    const params = {};
    if (seccion) params.seccion = seccion;
    if (q) params.q = q;
    if (genero) params.genero = genero;
    const { data } = await axiosClient.get('/contenidos', { params });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function obtenerContenido(id) {
  try {
    const { data } = await axiosClient.get(`/contenidos/${id}`);
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function crearContenido(datos) {
  try {
    const { data } = await axiosClient.post('/contenidos', datos);
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function editarContenido(id, datos) {
  try {
    const { data } = await axiosClient.put(`/contenidos/${id}`, datos);
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

// Atajo de la tabla del panel: cambia solo el estado sin abrir el formulario.
// El backend acepta un PATCH parcial (mismo handler que la edición completa).
export async function cambiarEstadoContenido(id, estado) {
  try {
    const { data } = await axiosClient.patch(`/contenidos/${id}`, { estado });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function eliminarContenido(id) {
  try {
    const { data } = await axiosClient.delete(`/contenidos/${id}`);
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}
