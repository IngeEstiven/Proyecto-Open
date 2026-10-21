import axiosClient, { extraerError } from '../api/axiosClient.js';

export async function listarUsuarios() {
  try {
    const { data } = await axiosClient.get('/users');
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}

export async function obtenerUsuario(id) {
  try {
    const { data } = await axiosClient.get(`/users/${id}`);
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}

export async function crearUsuario(datos) {
  try {
    const { data } = await axiosClient.post('/users', datos);
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}

export async function editarUsuario(id, datos) {
  try {
    const { data } = await axiosClient.put(`/users/${id}`, datos);
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}

export async function cambiarRolUsuario(id, rol) {
  try {
    const { data } = await axiosClient.patch(`/users/${id}/rol`, { rol });
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}

export async function cambiarPasswordUsuario(id, newPassword) {
  try {
    const { data } = await axiosClient.patch(`/users/${id}/password`, { newPassword });
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}

export async function desactivarUsuario(id) {
  try {
    const { data } = await axiosClient.delete(`/users/${id}`);
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}

export async function cambiarEstadoUsuario(id, estado) {
  try {
    const { data } = await axiosClient.patch(`/users/${id}/estado`, { estado });
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}

export async function activarUsuario(id) {
  return cambiarEstadoUsuario(id, 'activo');
}

export async function eliminarUsuarioPermanente(id) {
  try {
    const { data } = await axiosClient.delete(`/users/${id}/permanent`);
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}
