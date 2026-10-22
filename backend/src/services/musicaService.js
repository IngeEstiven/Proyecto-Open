import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { esGeneroDeSeccion } from './catalogoConstantes.js';

// Importación de canciones de Jamendo a la tabla contenidos. Único lugar donde
// se escribe en Supabase para este recurso.

const MAXIMO_POR_LOTE = 50;

const IMPORT_SELECT = `
  id, seccion, titulo, descripcion, miniatura_url, fuente, external_id,
  embed_url, genero, licencia, estado, creado_por, created_at
`;

function esUrlHttps(valor) {
  if (!valor) return false;
  try {
    return new URL(String(valor)).protocol === 'https:';
  } catch {
    return false;
  }
}

function validarCancion(cancion) {
  if (!cancion || typeof cancion !== 'object') {
    throw new AppError(400, 'Cada canción debe ser un objeto válido');
  }

  const id = cancion.id !== undefined && cancion.id !== null ? String(cancion.id).trim() : '';
  const nombre = typeof cancion.nombre === 'string' ? cancion.nombre.trim() : '';
  const audio = typeof cancion.audio === 'string' ? cancion.audio.trim() : '';

  if (!id || !nombre || !audio) {
    throw new AppError(400, 'Cada canción debe tener identificador, nombre y enlace de audio.');
  }
  if (!esUrlHttps(audio)) {
    throw new AppError(400, `El enlace de audio de "${nombre}" no es válido. Debe comenzar con https://.`);
  }

  const genero = esGeneroDeSeccion('musica', cancion.genero) ? cancion.genero : 'otros';
  const artista = typeof cancion.artista === 'string' ? cancion.artista.trim() : '';
  const imagen = esUrlHttps(cancion.imagen) ? cancion.imagen : null;

  return {
    seccion: 'musica',
    titulo: nombre,
    descripcion: artista ? `Por ${artista}` : null,
    miniatura_url: imagen,
    fuente: 'otro',
    external_id: id,
    embed_url: audio,
    genero,
    licencia: typeof cancion.licencia === 'string' ? cancion.licencia.trim() || null : null,
    estado: 'publicado'
  };
}

export async function importarCanciones(canciones, userId) {
  if (!Array.isArray(canciones) || canciones.length === 0) {
    throw new AppError(400, 'Debes enviar al menos una canción para importar');
  }
  if (canciones.length > MAXIMO_POR_LOTE) {
    throw new AppError(400, `Solo puedes importar hasta ${MAXIMO_POR_LOTE} canciones por vez`);
  }

  const filas = [];
  const vistos = new Set();
  for (const cancion of canciones) {
    const fila = validarCancion(cancion);
    if (vistos.has(fila.external_id)) continue;
    vistos.add(fila.external_id);
    filas.push({ ...fila, creado_por: userId });
  }

  const ids = filas.map((fila) => fila.external_id);
  const { data: existentes, error: errorConsulta } = await supabaseAdmin
    .from('contenidos')
    .select('external_id')
    .eq('seccion', 'musica')
    .in('external_id', ids);

  if (errorConsulta) throw new Error(errorConsulta.message);

  const yaImportadas = new Set((existentes || []).map((fila) => fila.external_id));
  const nuevas = filas.filter((fila) => !yaImportadas.has(fila.external_id));
  const repetidas = filas
    .filter((fila) => yaImportadas.has(fila.external_id))
    .map((fila) => fila.external_id);

  if (nuevas.length === 0) {
    return { contenidos: [], repetidas };
  }

  const { data, error } = await supabaseAdmin
    .from('contenidos')
    .insert(nuevas)
    .select(IMPORT_SELECT);

  if (error) throw new Error(error.message);

  return { contenidos: data || [], repetidas };
}
