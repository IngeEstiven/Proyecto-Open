import { supabaseAdmin } from '../config/supabase.js';


const FAVORITO_SELECT = `
  id, usuario_id, juego_id, contenido_id, plataforma_id, created_at,
  juego:juegos ( id, titulo, slug, categoria, imagen_url, estado ),
  contenido:contenidos ( id, seccion, titulo, miniatura_url, estado ),
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


export async function createFavorito(usuarioId, tipo, itemId) {
  const columna = columnasPorTipo[tipo];
  const tabla = tablasPorTipo[tipo];


  const { data: item, error: itemError } = await supabaseAdmin
    .from(tabla)
    .select('id')
    .eq('id', itemId)
    .limit(1);


  if (itemError) throw new Error(itemError.message);
  if (!item || item.length === 0) throw new Error('El ítem no existe');


  const { data: existente, error: existenteError } = await supabaseAdmin
    .from('favoritos')
    .select('id')
    .eq('usuario_id', usuarioId)
    .eq(columna, itemId)
    .limit(1);


  if (existenteError) throw new Error(existenteError.message);
  if (existente && existente.length > 0) {
    throw new Error('El ítem ya está en tus favoritos');
  }


  const { data, error } = await supabaseAdmin
    .from('favoritos')
    .insert([
      {
        usuario_id: usuarioId,
        juego_id: tipo === 'juego' ? itemId : null,
        contenido_id: tipo === 'contenido' ? itemId : null,
        plataforma_id: tipo === 'plataforma' ? itemId : null
      }
    ])
    .select(FAVORITO_SELECT);


  if (error) throw new Error(error.message);
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
    throw new Error('Este favorito no te pertenece');
  }


  const { data, error } = await supabaseAdmin
    .from('favoritos')
    .delete()
    .eq('id', id)
    .select('id, usuario_id, juego_id, contenido_id, plataforma_id, created_at');


  if (error) throw new Error(error.message);
  return data[0] || null;
}
