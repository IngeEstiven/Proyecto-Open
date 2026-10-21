import axiosClient, { extraerError } from '../api/axiosClient.js';

// Búsqueda global con filtros opcionales:
// tipo (todo|juegos|contenidos|plataformas), seccion, genero y categoria (juegos).
// Acepta una señal de AbortController para cancelar peticiones anteriores.
export async function buscar(q = '', filtros = {}, signal) {
  try {
    const params = {};
    if (q) params.q = q;
    if (filtros.tipo && filtros.tipo !== 'todo') params.tipo = filtros.tipo;
    if (filtros.seccion) params.seccion = filtros.seccion;
    if (filtros.genero) params.genero = filtros.genero;
    if (filtros.categoria) params.categoria = filtros.categoria;
    const { data } = await axiosClient.get('/buscar', { params, signal });
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}
