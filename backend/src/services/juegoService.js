import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../middlewares/errorMiddleware.js';


// Recorta extremos, colapsa espacios repetidos y pasa a minúsculas para
// comparar títulos sin importar mayúsculas ni espacios de más.
function normalizarTitulo(valor) {
  return String(valor ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}


// Devuelve true si ya existe un juego con el mismo título normalizado dentro
// de la misma categoría, excluyendo el id propio cuando se edita.
export async function existeTitulo(titulo, idExcluir = null, categoria = null) {
  const clave = normalizarTitulo(titulo);
  if (!clave) return false;

  let query = supabaseAdmin.from('juegos').select('id, titulo');
  if (categoria) query = query.eq('categoria', categoria);
  if (idExcluir) query = query.neq('id', idExcluir);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []).some((fila) => normalizarTitulo(fila.titulo) === clave);
}


function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}


async function generateUniqueSlug(titulo, excludeId = null) {
  const baseSlug = generateSlug(titulo);
  let slug = baseSlug;
  let counter = 1;


  while (true) {
    let query = supabaseAdmin.from('juegos').select('id').eq('slug', slug);
    if (excludeId) query = query.neq('id', excludeId);


    const { data, error } = await query.limit(1);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;


    slug = `${baseSlug}-${counter}`;
    counter++;
  }


  return slug;
}


const JUEGO_SELECT = `
  id, titulo, slug, categoria, descripcion, imagen_url, trailer_youtube_id,
  webgl_url, puntuacion, destacado, estado, created_at, updated_at
`;


export async function getJuegos(user, { categoria, q } = {}) {
  let query = supabaseAdmin
    .from('juegos')
    .select(JUEGO_SELECT)
    .order('destacado', { ascending: false })
    .order('titulo', { ascending: true });


  // Los usuarios normales solo ven juegos publicados
  if (user.rol !== 'administrador') query = query.eq('estado', 'publicado');
  if (categoria) query = query.eq('categoria', categoria);
  if (q) {
    // Quitar comodines para que el texto buscado se trate como literal
    const safeQ = q.replace(/[%_,()]/g, ' ').trim();
    if (safeQ) query = query.ilike('titulo', `%${safeQ}%`);
  }


  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}


export async function getJuegoBySlug(slug, user) {
  let query = supabaseAdmin.from('juegos').select(JUEGO_SELECT).eq('slug', slug).limit(1);


  if (user.rol !== 'administrador') query = query.eq('estado', 'publicado');


  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data[0] || null;
}


export async function createJuego(juegoData) {
  if (await existeTitulo(juegoData.titulo, null, juegoData.categoria)) {
    throw new AppError(409, 'Ya existe un juego con ese título. Usa un nombre distinto.');
  }

  const slug = await generateUniqueSlug(juegoData.titulo);


  const { data, error } = await supabaseAdmin
    .from('juegos')
    .insert([
      {
        titulo: juegoData.titulo,
        slug,
        categoria: juegoData.categoria,
        descripcion: juegoData.descripcion || null,
        imagen_url: juegoData.imagen_url || null,
        trailer_youtube_id: juegoData.trailer_youtube_id || null,
        webgl_url: juegoData.webgl_url || null,
        puntuacion: juegoData.puntuacion ?? null,
        destacado: Boolean(juegoData.destacado),
        estado: juegoData.estado || 'borrador'
      }
    ])
    .select(JUEGO_SELECT);


  if (error) throw new Error(error.message);
  return data[0];
}


export async function updateJuego(id, juegoData) {
  let categoria = juegoData.categoria;

  // Solo se valida cuando llega un título; se excluye el propio registro.
  if (juegoData.titulo !== undefined) {
    if (categoria === undefined) {
      const { data: actual, error: errorActual } = await supabaseAdmin
        .from('juegos')
        .select('categoria')
        .eq('id', id)
        .limit(1);
      if (errorActual) throw new Error(errorActual.message);
      categoria = actual?.[0]?.categoria;
    }
    if (await existeTitulo(juegoData.titulo, id, categoria)) {
      throw new AppError(409, 'Ya existe un juego con ese título. Usa un nombre distinto.');
    }
  }

  const slug = await generateUniqueSlug(juegoData.titulo, id);


  const { data, error } = await supabaseAdmin
    .from('juegos')
    .update({
      titulo: juegoData.titulo,
      slug,
      categoria: juegoData.categoria,
      descripcion: juegoData.descripcion || null,
      imagen_url: juegoData.imagen_url || null,
      trailer_youtube_id: juegoData.trailer_youtube_id || null,
      webgl_url: juegoData.webgl_url || null,
      puntuacion: juegoData.puntuacion ?? null,
      destacado: Boolean(juegoData.destacado),
      estado: juegoData.estado,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select(JUEGO_SELECT);


  if (error) throw new Error(error.message);
  return data[0] || null;
}


export async function changeEstadoJuego(id, estado) {
  const { data, error } = await supabaseAdmin
    .from('juegos')
    .update({ estado, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, titulo, slug, estado');


  if (error) throw new Error(error.message);
  return data[0] || null;
}


export async function deleteJuego(id) {
  const { data, error } = await supabaseAdmin
    .from('juegos')
    .delete()
    .eq('id', id)
    .select('id, titulo, slug, estado');


  if (error) throw new Error(error.message);
  return data[0] || null;
}


export async function updateJuegoImage(id, imageUrl) {
  const { data, error } = await supabaseAdmin
    .from('juegos')
    .update({ imagen_url: imageUrl, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(JUEGO_SELECT);


  if (error) throw new Error(error.message);
  return data[0] || null;
}
