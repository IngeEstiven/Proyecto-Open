import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../middlewares/errorMiddleware.js';


const FAVORITO_SELECT = `
  id, usuario_id, juego_id, contenido_id, plataforma_id, created_at,
  juego:juegos ( id, titulo, slug, categoria, imagen_url, estado ),
  contenido:contenidos ( id, seccion, titulo, miniatura_url, fuente, external_id, genero, estado ),
  plataforma:plataformas ( id, nombre, seccion, logo_url, estado )
`;


const columnasPorTipo = {
  juego: 'juego_id',
  contenido: 'contenido_id',
  plataforma: 'plataforma_id'
};


const tablasPorTipo = {
  juego: 'juegos',
  contenido: 'contenidos',
  plataforma: 'plataformas'
};


export async function getFavoritos(usuarioId) {
  const { data, error } = await supabaseAdmin
    .from('favoritos')
    .select(FAVORITO_SELECT)
    .eq('usuario_id', usuarioId)
    .order('created_at', { ascending: false });


  if (error) throw new Error(error.message);
  return data;
}


// Resuelve el id real del ítem. Las tarjetas de GameZone viven en el frontend
// como fichas estáticas, así que el navegador puede enviar el slug del juego
// en lugar del id de la base de datos.
async function resolverItemId(tipo, itemId, itemSlug) {
  if (itemId != null && itemId !== '') return itemId;
  if (tipo !== 'juego' || !itemSlug) return null;

  const { data, error } = await supabaseAdmin
    .from('juegos')
    .select('id')
    .eq('slug', itemSlug)
    .limit(1);

  if (error) throw new Error(error.message);
  return data?.[0]?.id ?? null;
}


export async function createFavorito(usuarioId, tipo, itemId, itemSlug = null) {
  const columna = columnasPorTipo[tipo];
  const tabla = tablasPorTipo[tipo];

  if (!columna || !tabla) {
    throw new AppError(400, 'Selecciona un tipo de favorito válido.');
  }

  const referencia = await resolverItemId(tipo, itemId, itemSlug);

  if (referencia == null) {
    throw new AppError(400, 'No pudimos identificar el contenido que quieres guardar. Recarga la página e intenta de nuevo.');
  }

  const { data: item, error: itemError } = await supabaseAdmin
    .from(tabla)
    .select('id')
    .eq('id', referencia)
    .limit(1);


  if (itemError) throw new Error(itemError.message);
  if (!item || item.length === 0) throw new AppError(404, 'Ese contenido ya no está disponible.');


  const { data: existente, error: existenteError } = await supabaseAdmin
    .from('favoritos')
    .select(FAVORITO_SELECT)
    .eq('usuario_id', usuarioId)
    .eq(columna, referencia)
    .limit(1);


  if (existenteError) throw new Error(existenteError.message);
  // Idempotente: si ya estaba guardado se devuelve el mismo registro. Evita
  // errores cuando dos botones de la misma página se pulsan a la vez.
  if (existente && existente.length > 0) return existente[0];


  const { data, error } = await supabaseAdmin
    .from('favoritos')
    .insert([
      {
        usuario_id: usuarioId,
        juego_id: tipo === 'juego' ? referencia : null,
        contenido_id: tipo === 'contenido' ? referencia : null,
        plataforma_id: tipo === 'plataforma' ? referencia : null
      }
    ])
    .select(FAVORITO_SELECT);


  if (error) {
    // Violación de la restricción única (dos clics simultáneos): devolvemos el
    // favorito que ya quedó registrado en lugar de fallar.
    if (error.code === '23505') {
      const { data: yaGuardado, error: reintentoError } = await supabaseAdmin
        .from('favoritos')
        .select(FAVORITO_SELECT)
        .eq('usuario_id', usuarioId)
        .eq(columna, referencia)
        .limit(1);
      if (reintentoError) throw new Error(reintentoError.message);
      if (yaGuardado?.[0]) return yaGuardado[0];
    }
    throw new Error(error.message);
  }
  return data[0];
}


export async function deleteFavorito(id, usuarioId) {
  const { data: existente, error: existenteError } = await supabaseAdmin
    .from('favoritos')
    .select('id, usuario_id, juego_id, contenido_id, plataforma_id')
    .eq('id', id)
    .limit(1);


  if (existenteError) throw new Error(existenteError.message);
  if (!existente || existente.length === 0) return null;


  if (String(existente[0].usuario_id) !== String(usuarioId)) {
    throw new AppError(403, 'No puedes eliminar un favorito que no es tuyo.');
  }


  const { data, error } = await supabaseAdmin
    .from('favoritos')
    .delete()
    .eq('id', id)
    .select('id, usuario_id, juego_id, contenido_id, plataforma_id, created_at');


  if (error) throw new Error(error.message);
  return data[0] || null;
}
