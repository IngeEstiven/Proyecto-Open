import { AppError } from '../middlewares/errorMiddleware.js';
import { normalizarTexto } from './catalogoConstantes.js';

// Cliente de la API pública de Jamendo. Solo se usa desde services: no conoce
// req/res ni códigos HTTP más allá de los AppError de configuración.

const JAMENDO_TRACKS_URL = 'https://api.jamendo.com/v3.0/tracks';
const CACHE_TTL_MS = 10 * 60 * 1000;
const LIMITE_DEFECTO = 20;
const LIMITE_MAXIMO = 50;
const TIMEOUT_MS = 12000;

// Caché en memoria por consulta para no gastar el límite mensual de Jamendo.
// clave -> { expira, datos }
const cache = new Map();

// Sinónimos de etiquetas de Jamendo hacia los géneros del catálogo de OpenLeaf.
// El orden importa: se devuelve el primer género que coincida.
const SINONIMOS_GENERO = [
  ['hip_hop', ['hiphop', 'hip-hop', 'hip hop', 'rap', 'trap']],
  ['reggaeton', ['reggaeton', 'latin', 'latino', 'urbano', 'urbana', 'bachata', 'merengue']],
  ['salsa', ['salsa', 'tropical', 'cumbia', 'vallenato']],
  ['electronica', ['electronic', 'electronica', 'electro', 'techno', 'house', 'trance', 'dubstep', 'edm', 'drum', 'dnb', 'ambient', 'chillout']],
  ['clasica', ['classical', 'clasica', 'orchestra', 'orchestral', 'baroque', 'opera', 'piano']],
  ['jazz', ['jazz', 'blues', 'swing', 'soul', 'funk']],
  ['baladas', ['ballad', 'balada', 'romantic', 'romantica', 'acoustic', 'love']],
  ['instrumental', ['instrumental', 'soundtrack', 'cinematic', 'lofi', 'lo-fi', 'score', 'relaxing']],
  ['rock', ['rock', 'indie', 'alternative', 'metal', 'punk', 'hardcore', 'grunge']],
  ['pop', ['pop']]
];

function obtenerClientId() {
  const clientId = process.env.JAMENDO_CLIENT_ID;
  if (!clientId || !clientId.trim()) {
    throw new AppError(
      503,
      'La búsqueda en Jamendo no está configurada. Falta JAMENDO_CLIENT_ID en backend/.env.'
    );
  }
  return clientId.trim();
}

function limitarLimite(limite) {
  const numero = Number.parseInt(limite, 10);
  if (!Number.isFinite(numero) || numero < 1) return LIMITE_DEFECTO;
  return Math.min(numero, LIMITE_MAXIMO);
}

function leerCache(clave) {
  const entrada = cache.get(clave);
  if (!entrada) return null;
  if (Date.now() > entrada.expira) {
    cache.delete(clave);
    return null;
  }
  return entrada.datos;
}

function guardarCache(clave, datos) {
  cache.set(clave, { expira: Date.now() + CACHE_TTL_MS, datos });
  return datos;
}

function extraerTags(musicinfo) {
  const tags = musicinfo?.tags;
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => (typeof tag === 'string' ? tag : tag?.name))
      .filter(Boolean);
  }
  if (typeof tags === 'string') {
    return tags.split(/[\s,]+/).filter(Boolean);
  }
  return [];
}

function mapearGenero(tags) {
  const normalizadas = tags.map((tag) => normalizarTexto(tag));
  for (const [genero, sinonimos] of SINONIMOS_GENERO) {
    for (const tag of normalizadas) {
      if (sinonimos.some((sinonimo) => tag === sinonimo || tag.includes(sinonimo))) {
        return genero;
      }
    }
  }
  return 'otros';
}

function nombreLicencia(licenciaUrl) {
  if (!licenciaUrl) return 'Creative Commons';
  const coincidencia = String(licenciaUrl).match(/licenses\/([a-z-]+)\/([0-9.]+)/i);
  if (coincidencia) {
    return `CC ${coincidencia[1].toUpperCase()} ${coincidencia[2]}`;
  }
  return 'Creative Commons';
}

// Jamendo puede devolver enlaces http://; el reproductor solo acepta https.
function normalizarUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const limpia = url.trim();
  if (!limpia) return null;
  return limpia.startsWith('http://') ? `https://${limpia.slice(7)}` : limpia;
}

function normalizarCancion(resultado) {
  const tags = extraerTags(resultado.musicinfo);
  return {
    fuente: 'jamendo',
    id: String(resultado.id),
    nombre: resultado.name || 'Canción sin título',
    artista: resultado.artist_name || 'Artista desconocido',
    duracion: Number(resultado.duration) || 0,
    audio: normalizarUrl(resultado.audio),
    imagen: normalizarUrl(resultado.image || resultado.album_image),
    licencia: nombreLicencia(resultado.license_ccurl),
    licencia_url: normalizarUrl(resultado.license_ccurl),
    genero: mapearGenero(tags),
    tags
  };
}

async function consultarJamendo(parametros) {
  const clientId = obtenerClientId();

  const url = new URL(JAMENDO_TRACKS_URL);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('format', 'json');
  url.searchParams.set('include', 'musicinfo+licenses');
  for (const [clave, valor] of Object.entries(parametros)) {
    if (valor !== undefined && valor !== null && valor !== '') {
      url.searchParams.set(clave, String(valor));
    }
  }

  let respuesta;
  try {
    respuesta = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS)
    });
  } catch {
    throw new Error('No se pudo conectar con la API de Jamendo');
  }

  if (!respuesta.ok) {
    throw new Error(`La API de Jamendo respondió con estado ${respuesta.status}`);
  }

  const datos = await respuesta.json();
  if (datos?.headers?.status !== 'success') {
    throw new Error(
      `La API de Jamendo devolvió un error: ${datos?.headers?.error_message || 'desconocido'}`
    );
  }

  return Array.isArray(datos.results) ? datos.results : [];
}

// Busca canciones por texto y devuelve la lista normalizada.
export async function buscarCanciones(texto, limite = LIMITE_DEFECTO) {
  const termino = String(texto ?? '').trim();
  if (!termino) return [];

  const maximo = limitarLimite(limite);
  const clave = `buscar:${normalizarTexto(termino)}:${maximo}`;

  const enCache = leerCache(clave);
  if (enCache) return enCache;

  const resultados = await consultarJamendo({
    search: termino,
    limit: maximo,
    order: 'relevance'
  });

  const canciones = resultados
    .map(normalizarCancion)
    .filter((cancion) => Boolean(cancion.audio));

  return guardarCache(clave, canciones);
}

// Devuelve canciones de un canal de radio a partir de su nombre o etiqueta.
export async function canalRadio(nombre, limite = LIMITE_DEFECTO) {
  const canal = String(nombre ?? '').trim();
  if (!canal) return [];

  const maximo = limitarLimite(limite);
  const clave = `radio:${normalizarTexto(canal)}:${maximo}`;

  const enCache = leerCache(clave);
  if (enCache) return enCache;

  const resultados = await consultarJamendo({
    fuzzytags: canal,
    limit: maximo,
    order: 'popularity_total'
  });

  const canciones = resultados
    .map(normalizarCancion)
    .filter((cancion) => Boolean(cancion.audio));

  return guardarCache(clave, canciones);
}
