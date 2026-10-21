import { useContext } from 'react';

import { PlayerContext } from '../context/playerContext.js';

// Hosts autorizados para incrustar contenido en el reproductor flotante.
const HOSTS_PERMITIDOS = [
  'www.youtube.com',
  'www.youtube-nocookie.com',
  'player.twitch.tv',
  'archive.org',
  'open.spotify.com'
];

// Dominios de audio directo (Jamendo y otros archivos mp3/ogg por https).
const HOSTS_AUDIO = ['jamendo.com'];

function esHostAudio(hostname) {
  return HOSTS_AUDIO.some((host) => hostname === host || hostname.endsWith(`.${host}`));
}

// Indica si el contenido es el widget oficial de Spotify.
export function esUrlSpotify(url) {
  if (!url) return false;
  try {
    return new URL(url).hostname === 'open.spotify.com';
  } catch {
    return false;
  }
}

// Un ID de Spotify son letras y números, sin espacios.
const PATRON_ID_SPOTIFY = /^[A-Za-z0-9]+$/;

// Extrae el ID de una URL de Spotify o devuelve el propio valor si ya es un ID.
function extraerIdSpotify(valor) {
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

function urlEmbedSpotify(id) {
  return `https://open.spotify.com/embed/track/${id}?utm_source=generator`;
}

// Indica si la URL es un audio directo que puede reproducirse con <audio>.
// El widget de Spotify también es audio, pero va por iframe, no por <audio>.
export function esAudioDirecto(url) {
  if (!url) return false;
  if (esUrlSpotify(url)) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    if (esHostAudio(parsed.hostname)) return true;
    return /\.(mp3|ogg|wav|m4a)(\?|$)/i.test(parsed.pathname + parsed.search);
  } catch {
    return false;
  }
}

// Indica si la URL puede incrustarse como iframe (https de la lista blanca).
export function esUrlIframe(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    return HOSTS_PERMITIDOS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

function esUrlValida(url) {
  return esUrlIframe(url) ? url : null;
}

// Decide si el contenido es de audio o de video.
// - Audio directo (mp3 de Jamendo) => audio.
// - Widget de Spotify (fuente spotify o URL de open.spotify.com) => audio.
// - iframe conocido (YouTube/Twitch/archive) => video.
// - Sección música sin iframe reconocible => audio (regla del proyecto).
// - Cualquier otro caso => video.
export function resolverTipo(item) {
  if (!item) return 'video';
  if (item.fuente === 'spotify' || esUrlSpotify(item.embed_url)) return 'audio';
  if (esAudioDirecto(item.embed_url)) return 'audio';
  if (esUrlIframe(item.embed_url) || item.fuente === 'youtube' || item.fuente === 'twitch') {
    return 'video';
  }
  if (item.seccion === 'musica') return 'audio';
  return 'video';
}

// Devuelve una URL de embed segura para el reproductor, o null si no se puede
// reproducir. Acepta https de la lista blanca, audios directos (mp3 de Jamendo)
// y el widget oficial de Spotify (a partir del ID o del enlace pegado).
export function buildEmbedUrl(item) {
  if (!item) return null;

  // Audio directo (por ejemplo, una canción importada de Jamendo).
  if (esAudioDirecto(item.embed_url)) return item.embed_url;

  // Widget de Spotify: se acepta un embed ya armado (track, playlist, álbum,
  // episodio…) o un ID/enlace de track que se normaliza.
  if (item.fuente === 'spotify' || esUrlSpotify(item.embed_url)) {
    if (esUrlSpotify(item.embed_url) && item.embed_url.includes('/embed/')) {
      return esUrlValida(item.embed_url);
    }
    const id = extraerIdSpotify(item.embed_url) || extraerIdSpotify(item.external_id);
    if (id) return esUrlValida(urlEmbedSpotify(id));
    return null;
  }

  const directa = esUrlValida(item.embed_url);
  if (directa) return directa;

  const externalId = item.external_id ? String(item.external_id).trim() : '';
  if (item.fuente === 'youtube' && externalId) {
    return esUrlValida(`https://www.youtube.com/embed/${externalId}?autoplay=1&rel=0`);
  }
  if (item.fuente === 'twitch' && externalId) {
    const parent = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    return esUrlValida(
      `https://player.twitch.tv/?channel=${externalId}&parent=${parent}&autoplay=true`
    );
  }

  return null;
}

export function usePlayer() {
  const contexto = useContext(PlayerContext);
  if (!contexto) {
    throw new Error('usePlayer debe usarse dentro de PlayerProvider');
  }
  return contexto;
}
