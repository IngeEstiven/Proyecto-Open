import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { listarContenidos } from '../../services/contenidosService.js';
import { obtenerFiltros } from '../../services/filtrosService.js';
import { GENEROS_POR_SECCION, etiquetaGenero } from '../../services/generos.js';
import { usePlayer } from '../../hooks/usePlayer.js';

// Miniatura con respaldo al fondo del sitio si la imagen falla.
function Miniatura({ url, alt }) {
  const [fallo, setFallo] = useState(false);
  if (!url || fallo) {
    return (
      <div
        className="aspect-video w-full flex items-center justify-center text-[#475569]"
        style={{ background: 'linear-gradient(135deg,#0f1223,#1e2446)' }}
      >
        <i className="fas fa-film text-3xl"></i>
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={alt}
      onError={() => setFallo(true)}
      className="aspect-video w-full object-cover"
    />
  );
}

// Bloque "Reproducir en OpenLeaf": lista los contenidos de la base para una
// sección. En Películas y Música muestra, además, pastillas de género cuyo
// valor activo vive en la URL (?genero=).
export default function BloqueContenidos({ seccion, conGenero = false }) {
  const { play } = usePlayer();
  const [parametros, setParametros] = useSearchParams();
  const genero = conGenero ? parametros.get('genero') || '' : '';

  const [contenidos, setContenidos] = useState([]);
  const [estado, setEstado] = useState('cargando');
  const [reintento, setReintento] = useState(0);
  const [generos, setGeneros] = useState(GENEROS_POR_SECCION[seccion] || []);

  useEffect(() => {
    if (!conGenero) return undefined;
    let vivo = true;
    obtenerFiltros()
      .then((datos) => {
        if (!vivo) return;
        const lista = datos?.generos_por_seccion?.[seccion];
        if (Array.isArray(lista)) setGeneros(lista);
      })
      .catch(() => {
        // Se conserva el respaldo local (GENEROS_POR_SECCION).
      });
    return () => {
      vivo = false;
    };
  }, [seccion, conGenero]);

  useEffect(() => {
    let vivo = true;
    setEstado('cargando');
    listarContenidos(seccion, undefined, genero || undefined)
      .then((datos) => {
        if (!vivo) return;
        const lista = Array.isArray(datos) ? datos : [];
        setContenidos(lista);
        setEstado(lista.length ? 'ok' : 'vacio');
      })
      .catch(() => {
        if (!vivo) return;
        setContenidos([]);
        setEstado('error');
      });
    return () => {
      vivo = false;
    };
  }, [seccion, genero, reintento]);

  const seleccionarGenero = useCallback(
    (valor) => {
      const siguiente = new URLSearchParams(parametros);
      if (valor) siguiente.set('genero', valor);
      else siguiente.delete('genero');
      setParametros(siguiente, { replace: false });
    },
    [parametros, setParametros]
  );

  return (
    <section className="sv-section" aria-label="Reproducir en OpenLeaf">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="sv-platform-title">
            <i className="fas fa-circle-play mr-2 sv-text-gradient"></i>Reproducir en OpenLeaf
          </h2>
          <p className="sv-platform-desc">Contenido disponible para ver sin salir de OpenLeaf</p>
        </div>
      </div>

      {conGenero && generos.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            className={genero ? 'btn-sv-visit' : 'btn-sv-primary text-sm py-1 px-3'}
            onClick={() => seleccionarGenero('')}
          >
            Todos
          </button>
          {generos.map((g) => (
            <button
              key={g.valor}
              type="button"
              className={genero === g.valor ? 'btn-sv-primary text-sm py-1 px-3' : 'btn-sv-visit'}
              onClick={() => seleccionarGenero(g.valor)}
            >
              {g.etiqueta}
            </button>
          ))}
        </div>
      )}

      {estado === 'cargando' && (
        <p className="text-slate-400 text-sm m-0" role="status">
          <i className="fas fa-spinner fa-spin mr-2"></i>Cargando contenido…
        </p>
      )}

      {estado === 'error' && (
        <div className="text-center py-6">
          <p className="text-slate-300 mb-3">No pudimos cargar el contenido</p>
          <button type="button" className="btn-sv-primary text-sm py-2 px-4" onClick={() => setReintento((n) => n + 1)}>
            <i className="fas fa-rotate-right mr-1"></i>Reintentar
          </button>
        </div>
      )}

      {estado === 'vacio' && (
        <div className="text-center py-6">
          <p className="text-slate-300 mb-3">Aún no hay contenido en esta categoría</p>
          <button type="button" className="btn-sv-visit" onClick={() => seleccionarGenero('')}>
            Ver todos
          </button>
        </div>
      )}

      {estado === 'ok' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contenidos.map((c) => (
            <article key={c.id} className="sv-video-card flex flex-col">
              <Miniatura url={c.miniatura_url} alt={c.titulo} />
              <div className="p-3 flex flex-col flex-1 gap-2">
                <h6 className="p-0 m-0 text-slate-100 font-bold text-base">{c.titulo}</h6>
                {c.descripcion && (
                  <p className="text-slate-400 text-sm m-0 line-clamp-2">{c.descripcion}</p>
                )}
                {conGenero && c.genero && (
                  <span className="self-start text-xs font-bold text-slate-100 px-2 py-0.5 rounded-full bg-[rgba(102,126,234,.25)]">
                    {etiquetaGenero(seccion, c.genero)}
                  </span>
                )}
                {c.fuente === 'spotify' && (
                  <span className="self-start text-xs text-[#1DB954]">
                    <i className="fab fa-spotify mr-1"></i>Vía Spotify · duración completa si tienes sesión iniciada
                  </span>
                )}
                <button
                  type="button"
                  className="btn-sv-primary text-sm py-2 px-4 mt-auto self-start"
                  onClick={() => play(c)}
                >
                  <i className="fas fa-play mr-1"></i>Reproducir
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
