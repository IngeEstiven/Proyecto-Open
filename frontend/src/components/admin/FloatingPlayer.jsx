import { useRef } from 'react';

import { usePlayer } from '../../hooks/usePlayer.js';
import { useControlesMedia } from '../../hooks/useControlesMedia.js';
import '../../assets/opPlayer.css';

// Reproductor flotante global con tres tamaños:
//   mini    -> burbuja arrastrable con play/pausa y botón para volver a la barra.
//   barra   -> franja fija inferior con controles y progreso.
//   completo-> modal centrado a casi pantalla completa (solo video).
// El nodo de medios (iframe de video o <audio>) SIEMPRE queda montado: al cambiar
// de tamaño solo cambian las clases, para no reiniciar la reproducción.

function FormatoTiempo({ segundos }) {
  const total = Math.max(0, Math.floor(Number(segundos) || 0));
  const minutos = Math.floor(total / 60);
  const resto = String(total % 60).padStart(2, '0');
  return `${minutos}:${resto}`;
}

export default function FloatingPlayer() {
  const { current, size, setSize, close, activo, activar, miniPos, setMiniPos } = usePlayer();

  const refAudio = useRef(null);
  const refContenedorVideo = useRef(null);
  const refMini = useRef(null);
  const arrastre = useRef(null);
  const volumenPrevio = useRef(1);

  const controles = useControlesMedia({ current, activo, refAudio, refContenedorVideo });

  if (!current) return null;

  const { item, tipo, embedUrl, audioUrl, esYouTube, esSpotify, poster } = current;
  const esAudio = tipo === 'audio';
  const permiteCompleto = !esAudio;
  const titulo = item.titulo || item.nombre || 'Reproduciendo';
  const subtitulo =
    item.descripcion || item.artista || (esAudio ? 'Reproduciendo en OpenLeaf' : 'Video');
  const portada = item.miniatura_url || item.imagen || null;
  const volumenSilenciado = controles.volumen <= 0;

  const alternarPrincipal = () => {
    if (!activo) {
      activar();
      return;
    }
    controles.alternar();
  };

  const alternarSilencio = () => {
    if (controles.volumen > 0) {
      volumenPrevio.current = controles.volumen;
      controles.cambiarVolumen(0);
    } else {
      controles.cambiarVolumen(volumenPrevio.current || 1);
    }
  };

  // Arrastre del mini (ratón o dedo) con eventos de puntero.
  const bajarMini = (evento) => {
    const el = refMini.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    arrastre.current = {
      dx: evento.clientX - rect.left,
      dy: evento.clientY - rect.top,
      ancho: rect.width,
      alto: rect.height,
      movido: false
    };
    el.setPointerCapture?.(evento.pointerId);
  };

  const moverMini = (evento) => {
    const el = refMini.current;
    const datos = arrastre.current;
    if (!el || !datos) return;
    datos.movido = true;
    const maxX = Math.max(0, window.innerWidth - datos.ancho);
    const maxY = Math.max(0, window.innerHeight - datos.alto);
    const x = Math.min(Math.max(0, evento.clientX - datos.dx), maxX);
    const y = Math.min(Math.max(0, evento.clientY - datos.dy), maxY);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.right = 'auto';
    el.style.bottom = 'auto';
  };

  const soltarMini = (evento) => {
    const el = refMini.current;
    const datos = arrastre.current;
    arrastre.current = null;
    if (!el || !datos) return;
    el.releasePointerCapture?.(evento.pointerId);
    if (datos.movido) {
      const rect = el.getBoundingClientRect();
      setMiniPos({ x: rect.left, y: rect.top });
    }
  };

  const miniStyle =
    size === 'mini' && miniPos
      ? { left: `${miniPos.x}px`, top: `${miniPos.y}px`, right: 'auto', bottom: 'auto' }
      : undefined;

  return (
    <div
      className={`op-player is-${size} ${esAudio ? 'es-audio' : 'es-video'}${esSpotify ? ' es-spotify' : ''}`}
      role="region"
      aria-label="Reproductor"
    >
      {/* El respaldo siempre está montado (se muestra por CSS en "completo"),
          para que el shell no cambie de posición y el iframe nunca se recree. */}
      <div
        className="op-player-backdrop"
        onClick={() => setSize('barra')}
        aria-hidden="true"
      ></div>

      <div
        className="op-player-shell"
        ref={refMini}
        style={miniStyle}
        onPointerDown={size === 'mini' ? bajarMini : undefined}
        onPointerMove={size === 'mini' ? moverMini : undefined}
        onPointerUp={size === 'mini' ? soltarMini : undefined}
        onPointerCancel={size === 'mini' ? soltarMini : undefined}
      >
        <div className="op-player-media">
          {esAudio && !esSpotify && portada ? (
            <img className="op-player-cover" src={portada} alt="" />
          ) : null}

          {esAudio && !esSpotify && !portada ? (
            <span className="op-player-cover-icon" aria-hidden="true">
              <i className="fas fa-music"></i>
            </span>
          ) : null}

          {/* Widget oficial de Spotify: iframe con sus propios controles. */}
          {esSpotify && activo && embedUrl ? (
            <iframe
              className="op-player-frame op-player-spotify"
              src={embedUrl}
              title={titulo}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
            ></iframe>
          ) : null}

          {!esAudio && !activo && poster ? (
            <div className="op-player-poster">
              <img src={poster} alt="" />
              <button
                type="button"
                className="op-player-poster-play"
                onClick={activar}
                onPointerDown={(evento) => evento.stopPropagation()}
                aria-label="Reproducir"
              >
                <i className="fas fa-play"></i>
              </button>
            </div>
          ) : null}

          {!esAudio && activo && esYouTube ? (
            <div className="op-player-frame" ref={refContenedorVideo}></div>
          ) : null}

          {!esAudio && activo && !esYouTube && embedUrl ? (
            <iframe
              className="op-player-frame"
              src={embedUrl}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              title={titulo}
            ></iframe>
          ) : null}

          {esAudio && !esSpotify ? (
            <audio
              ref={refAudio}
              className="op-player-audio-el"
              src={audioUrl || undefined}
              autoPlay={activo}
              preload="metadata"
            ></audio>
          ) : null}
        </div>

        <div className="op-player-info">
          <p className="op-player-title">{titulo}</p>
          <p className="op-player-sub">{subtitulo}</p>
        </div>

        {controles.soportaControl ? (
          <div className="op-player-controls">
            <button
              type="button"
              className="op-player-btn play"
              onClick={alternarPrincipal}
              aria-label={controles.reproduciendo ? 'Pausar' : 'Reproducir'}
            >
              <i className={`fas ${controles.reproduciendo ? 'fa-pause' : 'fa-play'}`}></i>
            </button>

            <div className="op-player-progress">
              <span className="op-player-time">
                <FormatoTiempo segundos={controles.tiempo} />
              </span>
              <input
                type="range"
                className="op-player-range"
                min="0"
                max={controles.duracion || 0}
                step="0.1"
                value={Math.min(controles.tiempo, controles.duracion || 0)}
                onChange={(evento) => controles.buscar(evento.target.value)}
                disabled={!controles.soportaProgreso}
                aria-label="Progreso"
              />
              <span className="op-player-time">
                <FormatoTiempo segundos={controles.duracion} />
              </span>
            </div>

            <div className="op-player-volume">
              <button
                type="button"
                className="op-player-btn"
                onClick={alternarSilencio}
                aria-label={volumenSilenciado ? 'Activar sonido' : 'Silenciar'}
              >
                <i
                  className={`fas ${
                    volumenSilenciado
                      ? 'fa-volume-xmark'
                      : controles.volumen < 0.5
                        ? 'fa-volume-low'
                        : 'fa-volume-high'
                  }`}
                ></i>
              </button>
              <input
                type="range"
                className="op-player-range volume"
                min="0"
                max="1"
                step="0.01"
                value={controles.volumen}
                onChange={(evento) => controles.cambiarVolumen(evento.target.value)}
                aria-label="Volumen"
              />
            </div>
          </div>
        ) : null}

        <div className="op-player-actions">
          <button
            type="button"
            className="op-player-btn"
            onClick={() => setSize('mini')}
            title="Mini"
            aria-label="Reducir a mini"
          >
            <i className="fas fa-window-minimize"></i>
          </button>

          <button
            type="button"
            className="op-player-btn"
            onClick={() => setSize('barra')}
            title="Barra"
            aria-label="Mostrar barra"
          >
            <i className="fas fa-window-restore"></i>
          </button>

          {permiteCompleto ? (
            <button
              type="button"
              className="op-player-btn"
              onClick={() => setSize(size === 'completo' ? 'barra' : 'completo')}
              title="Pantalla completa"
              aria-label="Ampliar"
            >
              <i className={`fas ${size === 'completo' ? 'fa-compress' : 'fa-expand'}`}></i>
            </button>
          ) : null}

          <button
            type="button"
            className="op-player-btn close"
            onClick={close}
            title="Cerrar"
            aria-label="Cerrar reproductor"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Controles compactos del mini (solo se ven en tamaño mini). */}
        <div
          className="op-player-mini-actions"
          onPointerDown={(evento) => evento.stopPropagation()}
        >
          <button
            type="button"
            className="op-player-mini-play"
            onClick={alternarPrincipal}
            aria-label={controles.reproduciendo ? 'Pausar' : 'Reproducir'}
          >
            <i className={`fas ${controles.reproduciendo ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <button
            type="button"
            className="op-player-mini-expand"
            onClick={() => setSize('barra')}
            aria-label="Volver a la barra"
          >
            <i className="fas fa-up-right-and-down-left-from-center"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
