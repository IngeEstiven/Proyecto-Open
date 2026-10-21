import { useCallback, useEffect, useRef, useState } from 'react';

import { cargarApiYouTube } from '../services/youtubeApi.js';

// Controla el medio activo del reproductor flotante.
// - Audio (Jamendo): usa el elemento <audio> real (refAudio).
// - Video de YouTube: usa la API IFrame (controles propios, sin controles nativos).
// - Video de Twitch u otro iframe: no tiene API; se dejan los controles nativos
//   del iframe y aquí solo se informa que no hay control propio.

const INTERVALO_PROGRESO = 500;

export function useControlesMedia({ current, activo, refAudio, refContenedorVideo }) {
  const tipo = current?.tipo || null;
  const esYouTube = Boolean(current?.esYouTube);
  const esSpotify = Boolean(current?.esSpotify);
  const idVideo = current?.idVideo || '';
  const audioUrl = current?.audioUrl || null;

  const [reproduciendo, setReproduciendo] = useState(false);
  const [tiempo, setTiempo] = useState(0);
  const [duracion, setDuracion] = useState(0);
  const [volumen, setVolumen] = useState(1);
  const [ytListo, setYtListo] = useState(false);

  const reproductorYT = useRef(null);
  const volumenRef = useRef(1);
  volumenRef.current = volumen;

  const identidad = current
    ? `${tipo}|${esSpotify ? 'spotify' : ''}|${audioUrl || ''}|${idVideo || ''}|${current.embedUrl || ''}`
    : '';

  // Al cambiar de contenido (o cerrar) se reinicia todo y se destruye el player.
  useEffect(() => {
    setReproduciendo(false);
    setTiempo(0);
    setDuracion(0);
    setYtListo(false);

    const yt = reproductorYT.current;
    reproductorYT.current = null;
    if (yt && typeof yt.destroy === 'function') {
      try {
        yt.destroy();
      } catch {
        // El player puede haber quedado inválido; se ignora.
      }
    }

    const contenedor = refContenedorVideo.current;
    if (esYouTube && contenedor) contenedor.innerHTML = '';
  }, [identidad, esYouTube, refContenedorVideo]);

  // Crea el reproductor de YouTube (carga diferida: solo al pulsar play).
  useEffect(() => {
    if (!activo || tipo !== 'video' || !esYouTube || !idVideo) return undefined;
    const contenedor = refContenedorVideo.current;
    if (!contenedor || reproductorYT.current) return undefined;

    let cancelado = false;
    const nodo = document.createElement('div');
    nodo.className = 'op-player-yt';
    contenedor.appendChild(nodo);

    cargarApiYouTube()
      .then((YT) => {
        if (cancelado || reproductorYT.current) return;
        reproductorYT.current = new YT.Player(nodo, {
          videoId: idVideo,
          playerVars: {
            controls: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            enablejsapi: 1,
            autoplay: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (evento) => {
              setYtListo(true);
              if (typeof evento.target.setVolume === 'function') {
                evento.target.setVolume(volumenRef.current * 100);
              }
              if (typeof evento.target.playVideo === 'function') evento.target.playVideo();
            },
            onStateChange: (evento) => {
              setReproduciendo(evento.data === YT.PlayerState.PLAYING);
              if (evento.data === YT.PlayerState.ENDED) setReproduciendo(false);
              const total =
                typeof evento.target.getDuration === 'function' ? evento.target.getDuration() : 0;
              if (total) setDuracion(total);
            }
          }
        });
      })
      .catch(() => {
        // Si la API no carga, queda visible el póster del video.
      });

    return () => {
      cancelado = true;
    };
  }, [activo, tipo, esYouTube, idVideo, refContenedorVideo]);

  // Progreso del video de YouTube mediante sondeo.
  useEffect(() => {
    if (tipo !== 'video' || !esYouTube || !ytListo) return undefined;
    const id = setInterval(() => {
      const player = reproductorYT.current;
      if (!player || typeof player.getCurrentTime !== 'function') return;
      const actual = player.getCurrentTime();
      if (typeof actual === 'number') setTiempo(actual);
      const total = typeof player.getDuration === 'function' ? player.getDuration() : 0;
      if (total) setDuracion(total);
    }, INTERVALO_PROGRESO);
    return () => clearInterval(id);
  }, [tipo, esYouTube, ytListo]);

  // Estado del elemento <audio> real.
  useEffect(() => {
    const audio = refAudio.current;
    if (!audio || tipo !== 'audio' || esSpotify) return undefined;

    const alTiempo = () => setTiempo(audio.currentTime || 0);
    const alDuracion = () => setDuracion(Number.isFinite(audio.duration) ? audio.duration : 0);
    const alReproducir = () => setReproduciendo(true);
    const alPausar = () => setReproduciendo(false);
    const alVolumen = () => setVolumen(audio.volume);

    audio.addEventListener('timeupdate', alTiempo);
    audio.addEventListener('loadedmetadata', alDuracion);
    audio.addEventListener('durationchange', alDuracion);
    audio.addEventListener('play', alReproducir);
    audio.addEventListener('pause', alPausar);
    audio.addEventListener('volumechange', alVolumen);

    alDuracion();
    setVolumen(audio.volume);

    return () => {
      audio.removeEventListener('timeupdate', alTiempo);
      audio.removeEventListener('loadedmetadata', alDuracion);
      audio.removeEventListener('durationchange', alDuracion);
      audio.removeEventListener('play', alReproducir);
      audio.removeEventListener('pause', alPausar);
      audio.removeEventListener('volumechange', alVolumen);
    };
  }, [tipo, audioUrl, esSpotify, refAudio]);

  const alternar = useCallback(() => {
    if (tipo === 'audio') {
      if (esSpotify) return;
      const audio = refAudio.current;
      if (!audio) return;
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
      return;
    }
    if (esYouTube) {
      const player = reproductorYT.current;
      if (!player) return;
      if (reproduciendo) {
        if (typeof player.pauseVideo === 'function') player.pauseVideo();
      } else if (typeof player.playVideo === 'function') {
        player.playVideo();
      }
    }
  }, [tipo, esSpotify, esYouTube, reproduciendo, refAudio]);

  const buscar = useCallback(
    (segundo) => {
      const valor = Number(segundo) || 0;
      setTiempo(valor);
      if (tipo === 'audio') {
        if (esSpotify) return;
        const audio = refAudio.current;
        if (audio) audio.currentTime = valor;
        return;
      }
      if (esYouTube) {
        const player = reproductorYT.current;
        if (player && typeof player.seekTo === 'function') player.seekTo(valor, true);
      }
    },
    [tipo, esSpotify, esYouTube, refAudio]
  );

  const cambiarVolumen = useCallback(
    (nuevo) => {
      const valor = Math.min(1, Math.max(0, Number(nuevo) || 0));
      setVolumen(valor);
      if (tipo === 'audio') {
        if (esSpotify) return;
        const audio = refAudio.current;
        if (audio) audio.volume = valor;
        return;
      }
      if (esYouTube) {
        const player = reproductorYT.current;
        if (player && typeof player.setVolume === 'function') player.setVolume(valor * 100);
      }
    },
    [tipo, esSpotify, esYouTube, refAudio]
  );

  // Spotify trae sus propios controles dentro del iframe, así que no se
  // muestran controles propios (igual que Twitch y otros embeds).
  const soportaControl =
    (tipo === 'audio' && !esSpotify) || (tipo === 'video' && esYouTube);
  const soportaProgreso = soportaControl && duracion > 0 && Number.isFinite(duracion);

  return {
    reproduciendo,
    tiempo,
    duracion,
    volumen,
    listo:
      tipo === 'audio'
        ? esSpotify
          ? Boolean(current?.embedUrl)
          : Boolean(audioUrl)
        : ytListo,
    soportaControl,
    soportaProgreso,
    alternar,
    buscar,
    cambiarVolumen
  };
}
