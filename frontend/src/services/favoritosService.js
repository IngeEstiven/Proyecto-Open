import axiosClient, { crearErrorApi } from '../api/axiosClient.js';

export async function listarFavoritos() {
  try {
    const { data } = await axiosClient.get('/favoritos');
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

// itemId es el id interno del catálogo. Para juegos también se acepta `slug`:
// las tarjetas estáticas de GameZone no manejan el id de la base de datos.
export async function agregarFavorito(tipo, itemId, slug) {
  try {
    const cuerpo = { tipo };
    if (itemId != null) cuerpo.item_id = itemId;
    if (slug) cuerpo.slug = slug;

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
