import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { extraerIdSpotify, urlEmbedSpotify } from './catalogoConstantes.js';


// Recorta extremos, colapsa espacios repetidos y pasa a minúsculas para
// comparar títulos sin importar mayúsculas ni espacios de más.
function normalizarTitulo(valor) {
  return String(valor ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}


// Devuelve true si ya existe un contenido con el mismo título normalizado en
// la misma sección, excluyendo el id propio cuando se edita.
export async function existeTitulo(titulo, idExcluir = null, seccion = null) {
  const clave = normalizarTitulo(titulo);
  if (!clave) return false;

  let query = supabaseAdmin.from('contenidos').select('id, titulo');
  if (seccion) query = query.eq('seccion', seccion);
  if (idExcluir) query = query.neq('id', idExcluir);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []).some((fila) => normalizarTitulo(fila.titulo) === clave);
}


const CONTENIDO_SELECT = `
  id, seccion, titulo, descripcion, miniatura_url, fuente, external_id,
  embed_url, genero, estado, creado_por, created_at, updated_at
`;


// Normaliza un contenido de fuente Spotify: guarda el ID en external_id y arma
// el embed_url oficial del widget a partir del ID o del enlace pegado.
function normalizarSpotify(datos) {
  if (datos.fuente !== 'spotify') return datos;
  const id =
    extraerIdSpotify(datos.embed_url) || extraerIdSpotify(datos.external_id);
  if (!id) return datos;
  return { ...datos, external_id: id, embed_url: urlEmbedSpotify(id) };
}


export async function getContenidos(user, { seccion, q, genero } = {}) {
  let query = supabaseAdmin
    .from('contenidos')
    .select(CONTENIDO_SELECT)
    .order('created_at', { ascending: false });


  if (user.rol !== 'administrador') query = query.eq('estado', 'publicado');
  if (seccion) query = query.eq('seccion', seccion);
  if (genero) query = query.eq('genero', genero);
  if (q) {
    const safeQ = q.replace(/[%_,()]/g, ' ').trim();
    if (safeQ) query = query.ilike('titulo', `%${safeQ}%`);
  }


  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}


export async function getContenidoById(id, user) {
  let query = supabaseAdmin
    .from('contenidos')
    .select(CONTENIDO_SELECT)
    .eq('id', id)
    .limit(1);


  if (user.rol !== 'administrador') query = query.eq('estado', 'publicado');


  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data[0] || null;
}


export async function createContenido(contenidoData, userId) {
  const datos = normalizarSpotify(contenidoData);
  if (await existeTitulo(datos.titulo, null, datos.seccion)) {
    throw new AppError(409, 'Ya existe un contenido con ese título. Usa un nombre distinto.');
  }

  const { data, error } = await supabaseAdmin
    .from('contenidos')
    .insert([
      {
        seccion: datos.seccion,
        titulo: datos.titulo.trim(),
        descripcion: datos.descripcion || null,
        miniatura_url: datos.miniatura_url || null,
        fuente: datos.fuente,
        external_id: datos.external_id || null,
        embed_url: datos.embed_url || null,
        genero: datos.genero || null,
        estado: datos.estado || 'borrador',
        creado_por: userId
      }
    ])
    .select(CONTENIDO_SELECT);


  if (error) throw new Error(error.message);
  return data[0];
}


export async function updateContenido(id, contenidoData) {
  const datos = normalizarSpotify(contenidoData);

  // Solo se valida cuando llega un título; se excluye el propio registro.
  if (datos.titulo !== undefined) {
    let seccion = datos.seccion;
    if (seccion === undefined) {
      const { data: actual, error: errorActual } = await supabaseAdmin
        .from('contenidos')
        .select('seccion')
        .eq('id', id)
        .limit(1);
      if (errorActual) throw new Error(errorActual.message);
      seccion = actual?.[0]?.seccion;
    }
    if (await existeTitulo(datos.titulo, id, seccion)) {
      throw new AppError(409, 'Ya existe un contenido con ese título. Usa un nombre distinto.');
    }
  }

  const campos = { updated_at: new Date().toISOString() };


  if (datos.seccion !== undefined) campos.seccion = datos.seccion;
  if (datos.titulo !== undefined) campos.titulo = datos.titulo.trim();
  if (datos.descripcion !== undefined) campos.descripcion = datos.descripcion || null;
  if (datos.miniatura_url !== undefined) campos.miniatura_url = datos.miniatura_url || null;
  if (datos.fuente !== undefined) campos.fuente = datos.fuente;
  if (datos.external_id !== undefined) campos.external_id = datos.external_id || null;
  if (datos.embed_url !== undefined) campos.embed_url = datos.embed_url || null;
  if (datos.genero !== undefined) campos.genero = datos.genero || null;
  if (datos.estado !== undefined) campos.estado = datos.estado;


  const { data, error } = await supabaseAdmin
    .from('contenidos')
    .update(campos)
    .eq('id', id)
    .select(CONTENIDO_SELECT);


  if (error) throw new Error(error.message);
  return data[0] || null;
}


export async function deleteContenido(id) {
  const { data, error } = await supabaseAdmin
    .from('contenidos')
    .delete()
    .eq('id', id)
    .select('id, titulo, seccion, estado');


  if (error) throw new Error(error.message);
  return data[0] || null;
}
