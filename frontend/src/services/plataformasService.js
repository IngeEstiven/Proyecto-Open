import axiosClient from '../api/axiosClient.js';

export async function listarPlataformas(seccion) {
  const params = seccion ? { seccion } : {};
  const { data } = await axiosClient.get('/plataformas', { params });
  return data;
}

export async function crearPlataforma(datos) {
  const { data } = await axiosClient.post('/plataformas', datos);
  return data;
}

export async function editarPlataforma(id, datos) {
  const { data } = await axiosClient.put(`/plataformas/${id}`, datos);
  return data;
}

export async function eliminarPlataforma(id) {
  const { data } = await axiosClient.delete(`/plataformas/${id}`);
  return data;
}

export async function subirImagenPlataforma(id, archivo) {
  const formData = new FormData();
  formData.append('file', archivo);
  const { data } = await axiosClient.patch(`/plataformas/${id}/imagen`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}
