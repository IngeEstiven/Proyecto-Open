import axiosClient, { crearErrorApi } from '../api/axiosClient.js';

export async function listarPlataformas(seccion) {
  try {
    const params = seccion ? { seccion } : {};
    const { data } = await axiosClient.get('/plataformas', { params });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function crearPlataforma(datos) {
  try {
    const { data } = await axiosClient.post('/plataformas', datos);
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function editarPlataforma(id, datos) {
  try {
    const { data } = await axiosClient.put(`/plataformas/${id}`, datos);
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

// Atajo de la tabla del panel: cambia solo el estado sin abrir el formulario.
// El backend acepta un PATCH parcial (mismo handler que la edición completa).
export async function cambiarEstadoPlataforma(id, estado) {
  try {
    const { data } = await axiosClient.patch(`/plataformas/${id}`, { estado });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function eliminarPlataforma(id) {
  try {
    const { data } = await axiosClient.delete(`/plataformas/${id}`);
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function subirImagenPlataforma(id, archivo) {
  try {
    const formData = new FormData();
    formData.append('file', archivo);
    const { data } = await axiosClient.patch(`/plataformas/${id}/imagen`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}
