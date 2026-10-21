import { useEffect, useRef, useState } from 'react';

import { buscarCanciones, importarCanciones } from '../../services/musicaService.js';
import { etiquetaGenero } from '../../services/generos.js';
import { usePlayer } from '../../hooks/usePlayer.js';
import { useToast } from './Toast.jsx';

function Portada({ url, alt }) {
  const [fallo, setFallo] = useState(false);
  if (!url || fallo) {
    return (
      <div
        className="aspect-square w-full flex items-center justify-center text-[#475569]"
        style={{ background: 'linear-gradient(135deg,#0f1223,#1e2446)' }}
      >
        <i className="fas fa-music text-3xl"></i>
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={alt}
      onError={() => setFallo(true)}
      className="aspect-square w-full object-cover"
    />
  );
}

function formatearDuracion(segundos) {
  const total = Number(segundos) || 0;
  const minutos = Math.floor(total / 60);
  const resto = String(total % 60).padStart(2, '0');
  return `${minutos}:${resto}`;
}

// Búsqueda e importación de canciones libres de Jamendo. Solo se muestra en la
// página de Música del panel; la importación la valida también el backend.
export default function BuscadorJamendo() {
  const { play } = usePlayer();
  const toast = useToast();

  const [texto, setTexto] = useState('');
  const [canciones, setCanciones] = useState([]);
  const [estado, setEstado] = useState('inicial');
  const [importandoId, setImportandoId] = useState(null);
  const [importadas, setImportadas] = useState([]);
  const controlador = useRef(null);

  useEffect(
    () => () => {
      if (controlador.current) controlador.current.abort();
    },
    []
  );

  const buscar = async (evento) => {
    evento.preventDefault();
    const termino = texto.trim();
    if (termino.length < 2) {
      toast.aviso('Escribe al menos 2 caracteres para buscar');
      return;
    }

    if (controlador.current) controlador.current.abort();
    const nuevo = new AbortController();
    controlador.current = nuevo;

    setEstado('cargando');
    try {
      const datos = await buscarCanciones(termino, nuevo.signal);
      if (nuevo.signal.aborted) return;
      const lista = Array.isArray(datos) ? datos : [];
      setCanciones(lista);
      setEstado(lista.length ? 'ok' : 'vacio');
    } catch (error) {
      if (nuevo.signal.aborted) return;
      setCanciones([]);
      setEstado('error');
      toast.error(error.message);
    }
  };

  const reproducir = (cancion) => {
    play({
      ...cancion,
      titulo: cancion.nombre,
      miniatura_url: cancion.imagen,
      embed_url: cancion.audio,
      fuente: 'otro'
    });
  };

  const agregar = async (cancion) => {
    setImportandoId(cancion.id);
    try {
      const datos = await importarCanciones([cancion]);
      if (Array.isArray(datos.contenidos) && datos.contenidos.length > 0) {
        setImportadas((previas) => [...previas, cancion.id]);
        toast.exito(datos.message);
      } else {
        setImportadas((previas) => [...previas, cancion.id]);
        toast.aviso(datos.message || 'La canción ya estaba importada');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setImportandoId(null);
    }
  };

  return (
    <section className="sv-section" aria-label="Buscar en Jamendo">
      <div className="mb-4">
        <h2 className="sv-platform-title">
          <i className="fas fa-magnifying-glass mr-2 sv-text-gradient"></i>Buscar en Jamendo
        </h2>
        <p className="sv-platform-desc">
          Música libre con licencias Creative Commons. Escucha antes de agregarla a OpenLeaf.
        </p>
      </div>

      <form onSubmit={buscar} className="flex flex-col sm:flex-row gap-2 mb-4">
        <label htmlFor="jamendo-busqueda" className="sr-only">
          Buscar canciones en Jamendo
        </label>
        <input
          id="jamendo-busqueda"
          type="search"
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          placeholder="Artista, canción o estilo…"
          className="sv-input flex-1"
          maxLength={80}
        />
        <button type="submit" className="btn-sv-primary" disabled={estado === 'cargando'}>
          <i className={`fas ${estado === 'cargando' ? 'fa-spinner fa-spin' : 'fa-magnifying-glass'} mr-1`}></i>
          Buscar
        </button>
      </form>

      {estado === 'inicial' && (
        <p className="text-slate-400 text-sm m-0">
          Busca por artista, título o género para ver resultados de Jamendo.
        </p>
      )}

      {estado === 'cargando' && (
        <p className="text-slate-400 text-sm m-0" role="status">
          <i className="fas fa-spinner fa-spin mr-2"></i>Buscando en Jamendo…
        </p>
      )}

      {estado === 'error' && (
        <p className="text-slate-300 text-sm m-0">
          No pudimos consultar Jamendo. Intenta de nuevo en unos momentos.
        </p>
      )}

      {estado === 'vacio' && (
        <p className="text-slate-300 text-sm m-0">
          No encontramos canciones para esa búsqueda.
        </p>
      )}

      {estado === 'ok' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {canciones.map((cancion) => {
            const yaImportada = importadas.includes(cancion.id);
            return (
              <article key={cancion.id} className="sv-video-card flex flex-col">
                <Portada url={cancion.imagen} alt={cancion.nombre} />
                <div className="p-3 flex flex-col flex-1 gap-2">
                  <h6 className="p-0 m-0 text-slate-100 font-bold text-base">{cancion.nombre}</h6>
                  <p className="text-slate-400 text-sm m-0">
                    {cancion.artista} · {formatearDuracion(cancion.duracion)}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-100 px-2 py-0.5 rounded-full bg-[rgba(102,126,234,.25)]">
                      {etiquetaGenero('musica', cancion.genero)}
                    </span>
                    {cancion.licencia_url ? (
                      <a
                        href={cancion.licencia_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#8ea2ff] hover:underline"
                        title="Ver los términos de la licencia"
                      >
                        <i className="fas fa-copyright mr-1"></i>
                        {cancion.licencia}
                      </a>
                    ) : (
                      <span className="text-xs text-[#8ea2ff]">
                        <i className="fas fa-copyright mr-1"></i>
                        {cancion.licencia}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    <button
                      type="button"
                      className="btn-sv-visit text-sm py-2 px-3"
                      onClick={() => reproducir(cancion)}
                    >
                      <i className="fas fa-play mr-1"></i>Reproducir
                    </button>
                    <button
                      type="button"
                      className="btn-sv-primary text-sm py-2 px-3"
                      onClick={() => agregar(cancion)}
                      disabled={yaImportada || importandoId === cancion.id}
                    >
                      {yaImportada ? (
                        <>
                          <i className="fas fa-check mr-1"></i>Agregada
                        </>
                      ) : importandoId === cancion.id ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-1"></i>Agregando…
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus mr-1"></i>Agregar a OpenLeaf
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="text-slate-500 text-xs mt-4 mb-0">
        Música proporcionada por Jamendo. Respeta la licencia de cada canción.
      </p>
    </section>
  );
}
