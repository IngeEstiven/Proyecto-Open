export const GENEROS_PELICULAS = [
  { valor: 'accion', etiqueta: 'Acción' },
  { valor: 'aventura', etiqueta: 'Aventura' },
  { valor: 'animacion', etiqueta: 'Animación' },
  { valor: 'ciencia_ficcion', etiqueta: 'Ciencia ficción' },
  { valor: 'comedia', etiqueta: 'Comedia' },
  { valor: 'documental', etiqueta: 'Documental' },
  { valor: 'drama', etiqueta: 'Drama' },
  { valor: 'fantasia', etiqueta: 'Fantasía' },
  { valor: 'misterio', etiqueta: 'Misterio' },
  { valor: 'romance', etiqueta: 'Romance' },
  { valor: 'terror', etiqueta: 'Terror' }
];

export const GENEROS_MUSICA = [
  { valor: 'pop', etiqueta: 'Pop' },
  { valor: 'rock', etiqueta: 'Rock' },
  { valor: 'reggaeton', etiqueta: 'Reggaetón' },
  { valor: 'salsa', etiqueta: 'Salsa' },
  { valor: 'electronica', etiqueta: 'Electrónica' },
  { valor: 'hip_hop', etiqueta: 'Hip Hop' },
  { valor: 'clasica', etiqueta: 'Clásica' },
  { valor: 'jazz', etiqueta: 'Jazz' },
  { valor: 'baladas', etiqueta: 'Baladas' },
  { valor: 'instrumental', etiqueta: 'Instrumental' },
  { valor: 'otros', etiqueta: 'Otros' }
];

// en_vivo y deportes no admiten género.
export const GENEROS_POR_SECCION = {
  peliculas: GENEROS_PELICULAS,
  musica: GENEROS_MUSICA,
  en_vivo: [],
  deportes: []
};

export const SECCIONES = ['peliculas', 'musica', 'en_vivo', 'deportes'];

// Fuentes válidas de un contenido. "spotify" solo aplica a la sección musica
// (widget oficial de embed de Spotify); "jamendo" se usa al importar canciones
// libres desde la integración de Jamendo.
export const FUENTES = ['youtube', 'twitch', 'otro', 'spotify'];

export const FUENTES_MUSICA = ['youtube', 'twitch', 'otro', 'spotify', 'jamendo'];

export const CATEGORIAS_JUEGO = [
  { valor: 'accion', etiqueta: 'Acción' },
  { valor: 'terror', etiqueta: 'Terror' },
  { valor: 'deportes', etiqueta: 'Deportes' },
  { valor: 'cooperativo', etiqueta: 'Cooperativo' }
];

export function normalizarTexto(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function esGeneroDeSeccion(seccion, genero) {
  const generos = GENEROS_POR_SECCION[seccion];
  if (!generos) return false;
  return generos.some((g) => g.valor === genero);
}

export function etiquetaGenero(seccion, genero) {
  const generos = GENEROS_POR_SECCION[seccion];
  if (!generos) return null;
  const encontrado = generos.find((g) => g.valor === genero);
  return encontrado ? encontrado.etiqueta : null;
}

// --- Spotify (widget oficial de embed) ---

// Un ID de Spotify son letras y números, sin espacios ni símbolos.
const PATRON_ID_SPOTIFY = /^[A-Za-z0-9]+$/;

// Acepta un ID directo o una URL de open.spotify.com/track/... y devuelve el
// ID de la canción, o '' si no se puede reconocer.
export function extraerIdSpotify(valor) {
  const texto = String(valor || '').trim();
  if (!texto) return '';
  if (PATRON_ID_SPOTIFY.test(texto)) return texto;
  try {
    const parsed = new URL(texto);
    if (parsed.hostname !== 'open.spotify.com') return '';
    const partes = parsed.pathname.split('/').filter(Boolean);
    const posicion = partes.lastIndexOf('track');
    const id = posicion >= 0 ? partes[posicion + 1] : '';
    return PATRON_ID_SPOTIFY.test(id) ? id : '';
  } catch {
    return '';
  }
}

// Arma la URL de embed oficial del widget de Spotify a partir del ID.
export function urlEmbedSpotify(id) {
  return `https://open.spotify.com/embed/track/${id}?utm_source=generator`;
}
