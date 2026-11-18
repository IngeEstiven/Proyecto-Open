import axiosClient, { crearErrorApi } from '../api/axiosClient.js';

export async function listarFavoritos() {
  try {
    const { data } = await axiosClient.get('/favoritos');
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

// itemId es el id interno del catálogo. Para juegos también se acepta `slug`
// y `titulo`: las tarjetas estáticas de GameZone no manejan el id de la base
// y sus slugs cortos (gow, horizon...) no coinciden con el slug real.
export async function agregarFavorito(tipo, itemId, slug, titulo) {
  try {
    const cuerpo = { tipo };
    if (itemId != null) cuerpo.item_id = itemId;
    if (slug) cuerpo.slug = slug;
    if (titulo) cuerpo.titulo = titulo;

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
