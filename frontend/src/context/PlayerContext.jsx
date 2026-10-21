import { useCallback, useMemo, useState } from 'react';

import { PlayerContext } from './playerContext.js';
import { buildEmbedUrl, esAudioDirecto, resolverTipo, esUrlSpotify } from '../hooks/usePlayer.js';
import { extraerIdYouTube } from '../services/youtubeApi.js';

// Tamaños posibles del reproductor. "completo" solo aplica a video.
export const TAMANOS = ['mini', 'barra', 'completo'];

function esYouTubeUrl(url) {
  return typeof url === 'string' && (url.includes('youtube.com') || url.includes('youtube-nocookie.com'));
}

function resolverIdVideo(item, embedUrl) {
  return extraerIdYouTube(embedUrl) || extraerIdYouTube(item?.external_id) || '';
}

// Miniatura para el estado previo a la reproducción del video.
function resolverPoster(item, idVideo) {
  if (item?.miniatura_url) return item.miniatura_url;
  if (item?.imagen) return item.imagen;
  if (idVideo) return `https://i.ytimg.com/vi/${idVideo}/hqdefault.jpg`;
  return null;
}

export function PlayerProvider({ children }) {
  const [current, setCurrent] = useState(null);
  const [size, setSizeEstado] = useState('barra');
  const [miniPos, setMiniPos] = useState(null);
  const [activo, setActivo] = useState(false);

  const play = useCallback((item) => {
    if (!item) return;
    const tipo = resolverTipo(item);
    const esSpotify = item.fuente === 'spotify' || esUrlSpotify(item.embed_url);
    // El embed se arma tanto para video (YouTube/Twitch) como para el widget de
    // Spotify, que es audio pero se reproduce por iframe.
    const embedUrl = tipo === 'video' || esSpotify ? buildEmbedUrl(item) : null;
    const audioUrl =
      tipo === 'audio' && !esSpotify && esAudioDirecto(item.embed_url) ? item.embed_url : null;
    const idVideo = tipo === 'video' ? resolverIdVideo(item, embedUrl) : '';

    setCurrent({
      item,
      tipo,
      embedUrl,
      audioUrl,
      esSpotify,
      esYouTube: tipo === 'video' && esYouTubeUrl(embedUrl),
      idVideo,
      poster: resolverPoster(item, idVideo)
    });
    setSizeEstado('barra');
    setMiniPos(null);
    // El audio puede sonar de inmediato; el video espera a que el usuario pulse
    // play en el póster (carga diferida del iframe).
    setActivo(tipo === 'audio');
  }, []);

  const close = useCallback(() => {
    setCurrent(null);
    setActivo(false);
    setSizeEstado('barra');
    setMiniPos(null);
  }, []);

  const activar = useCallback(() => setActivo(true), []);

  const setSize = useCallback(
    (nuevo) => {
      if (!TAMANOS.includes(nuevo)) return;
      // El audio nunca puede pasar a "completo".
      if (current && current.tipo === 'audio' && nuevo === 'completo') return;
      setSizeEstado(nuevo);
    },
    [current]
  );

  const valor = useMemo(
    () => ({ current, size, miniPos, activo, play, close, activar, setSize, setMiniPos }),
    [current, size, miniPos, activo, play, close, activar, setSize]
  );

  return <PlayerContext.Provider value={valor}>{children}</PlayerContext.Provider>;
}
