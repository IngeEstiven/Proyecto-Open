import axiosClient, { crearErrorApi } from '../api/axiosClient.js';

export async function listarFavoritos() {
  try {
    const { data } = await axiosClient.get('/favoritos');
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

// itemId es el id interno del catálogo. Para juegos también se aceptan `slug`,
// `titulo` y los datos de la ficha (categoria/descripcion/imagen): las tarjetas
// de GameZone son estáticas y sus slugs cortos (gow, horizon...) no coinciden
// con el slug real de la base.
export async function agregarFavorito(tipo, itemId, datos = {}) {
  try {
    const cuerpo = { tipo };
    if (itemId != null) cuerpo.item_id = itemId;
    if (datos.slug) cuerpo.slug = datos.slug;
    if (datos.titulo) cuerpo.titulo = datos.titulo;
    if (datos.categoria) cuerpo.categoria = datos.categoria;
    if (datos.descripcion) cuerpo.descripcion = datos.descripcion;
    if (datos.imagen) cuerpo.imagen = datos.imagen;

    const { data } = await axiosClient.post('/favoritos', cuerpo);
    return data.favorito;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function eliminarFavorito(id) {
  try {
    const { data } = await axiosClient.delete(`/favoritos/${id}`);
    return data.favorito;
  } catch (error) {
    throw crearErrorApi(error);
  }
}
