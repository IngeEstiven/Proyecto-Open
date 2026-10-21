import axiosClient, { extraerError } from '../api/axiosClient.js';

export async function listarAuditoria() {
  try {
    const { data } = await axiosClient.get('/auditoria');
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}

export async function obtenerAuditoria(id) {
  try {
    const { data } = await axiosClient.get(`/auditoria/${id}`);
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}
