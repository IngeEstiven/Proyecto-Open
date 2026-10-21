import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import JuegoFlipCard from '../../components/public/JuegoFlipCard.jsx';
import TarjetaPlataforma from '../../components/public/TarjetaPlataforma.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useFavoritos } from '../../context/FavoritosContext.jsx';
import { enriquecerPlataforma } from '../../hooks/usePlataformas.js';
import useTituloPagina from '../../hooks/useTituloPagina.js';
import { usePlayer } from '../../hooks/usePlayer.js';
import { buscar } from '../../services/buscarService.js';
import { obtenerFiltros } from '../../services/filtrosService.js';
import { CATEGORIAS_GZ } from '../../services/categoriasGZ.js';
import { GENEROS_POR_SECCION } from '../../services/generos.js';
import { LOGO_URL } from '../../services/informacionSitio.js';

const OPCIONES_TIPO = [
  { valor: 'todo', texto: 'Todo', icono: 'fas fa-th-large' },
  { valor: 'juegos', texto: 'GameZone', icono: 'fas fa-gamepad' },
  { valor: 'plataformas', texto: 'Plataformas', icono: 'fas fa-layer-group' },
  { valor: 'contenidos', texto: 'Contenidos', icono: 'fas fa-photo-video' }
];

const OPCIONES_SECCION = [
  { valor: 'peliculas', texto: 'Películas' },
  { valor: 'musica', texto: 'Música' },
  { valor: 'en_vivo', texto: 'En Vivo' },
  { valor: 'deportes', texto: 'Deportes' }
];

const OPCIONES_CATEGORIA = CATEGORIAS_GZ.map((c) => ({ valor: c.slug, texto: c.textoFiltro }));

const RESULTADOS_VACIOS = { juegos: [], contenidos: [], plataformas: [], total: 0 };

function EncabezadoSeccion({ icono, titulo, total }) {
  return (
    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[rgba(102,126,234,.2)]">
      <h4 className="sv-section-title m-0"><i className={`${icono} mr-2 sv-text-gradient`}></i>{titulo}</h4>
      <span className="text-[#94a3b8] text-xs">{total} {total === 1 ? 'resultado' : 'resultados'}</span>
    </div>
  );
}

function Pastilla({ activo, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`sv-filter-pill${activo ? ' active' : ''}`}
      aria-pressed={activo}
    >
      {children}
    </button>
  );
}

function EtiquetaFiltro({ children, onQuitar }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-100 px-3 py-1 rounded-full bg-[rgba(102,126,234,.25)]">
      {children}
      <button
        type="button"
        onClick={onQuitar}
        className="text-slate-300 hover:text-white"
        aria-label="Quitar filtro"
      >
        <i className="fas fa-times"></i>
      </button>
    </span>
  );
}

function TarjetaContenido({ contenido }) {
  const { esFavorito, alternar } = useFavoritos();
  const { play } = usePlayer();
  const [error, setError] = useState('');
  const esFav = esFavorito('contenido', contenido.id);

  const alternarFavorito = async () => {
    setError('');
    try {
      await alternar('contenido', contenido.id);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="sv-section relative flex flex-col">
      <Link to={`/reproductor/${contenido.id}`} className="no-underline block">
        <div className="sv-video-card">
          <img src={contenido.miniatura_url || LOGO_URL} alt={contenido.titulo} />
          <p className="sv-video-title">{contenido.titulo}</p>
        </div>
      </Link>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[0.7rem] text-[#94a3b8] uppercase tracking-wide">{contenido.seccion?.replace('_', ' ')}</span>
        <button
          type="button"
          onClick={alternarFavorito}
          className="sv-btn-fav"
          title={esFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <i className={esFav ? 'fas fa-heart' : 'far fa-heart'}></i>
        </button>
      </div>
      <button
        type="button"
        onClick={() => play(contenido)}
        className="btn-sv-primary text-sm py-2 px-4 mt-2 self-start"
      >
        <i className="fas fa-play mr-1"></i>Reproducir
      </button>
      {error && <p className="text-[0.7rem] text-rose-400 m-0 mt-1">{error}</p>}
    </div>
  );
}

export default function BuscarPage() {
  useTituloPagina('Buscar · OpenLeaf');
  const { autenticado } = useAuth();
  const [parametros, setParametros] = useSearchParams();

  const consulta = (parametros.get('q') || '').trim();
  const tipo = parametros.get('tipo') || 'todo';
  const seccion = parametros.get('seccion') || '';
  const genero = parametros.get('genero') || '';
  const categoria = parametros.get('categoria') || '';

  const [resultados, setResultados] = useState(RESULTADOS_VACIOS);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [contenidoBuscador, setContenidoBuscador] = useState(consulta);
  const [generosDisponibles, setGenerosDisponibles] = useState(
    GENEROS_POR_SECCION
  );

  useEffect(() => {
    setContenidoBuscador(consulta);
  }, [consulta]);

  // Catálogo de géneros por sección (con respaldo local).
  useEffect(() => {
    if (!autenticado) return undefined;
    let vivo = true;
    obtenerFiltros()
      .then((datos) => {
        if (vivo && datos?.generos_por_seccion) setGenerosDisponibles(datos.generos_por_seccion);
      })
      .catch(() => {
        // Se conserva el respaldo local.
      });
    return () => {
      vivo = false;
    };
  }, [autenticado]);

  const opcionesGenero = seccion ? generosDisponibles[seccion] || [] : [];

  const actualizarParametros = (cambios, { replace = true } = {}) => {
    const nuevos = new URLSearchParams(parametros);
    Object.entries(cambios).forEach(([clave, valor]) => {
      if (valor) nuevos.set(clave, valor);
      else nuevos.delete(clave);
    });
    setParametros(nuevos, { replace });
  };

  const actualizarFiltro = (clave, valor) => {
    const cambios = { [clave]: valor };
    // Al cambiar de sección se limpia el género si ya no es válido para ella.
    if (clave === 'seccion') {
      const permitidos = generosDisponibles[valor] || [];
      if (genero && !permitidos.some((g) => g.valor === genero)) cambios.genero = '';
    }
    actualizarParametros(cambios);
  };

  const limpiarFiltros = () => {
    const nuevos = new URLSearchParams();
    if (consulta) nuevos.set('q', consulta);
    setParametros(nuevos, { replace: true });
  };

  const limpiarBusqueda = () => {
    const nuevos = new URLSearchParams(parametros);
    nuevos.delete('q');
    setParametros(nuevos, { replace: true });
  };

  const enviarBuscador = (evento) => {
    evento.preventDefault();
    actualizarParametros({ q: contenidoBuscador.trim() });
  };

  useEffect(() => {
    if (!autenticado) {
      setResultados(RESULTADOS_VACIOS);
      setError('');
      setCargando(false);
      return undefined;
    }

    // Con un solo carácter se avisa del mínimo sin llamar a la API.
    if (consulta.length === 1) {
      setResultados(RESULTADOS_VACIOS);
      setError('');
      setCargando(false);
      return undefined;
    }

    let vivo = true;
    const controlador = new AbortController();
    setCargando(true);
    setError('');

    // Debounce de 300 ms y cancelación de la petición anterior para no mostrar
    // resultados de una búsqueda vieja.
    const temporizador = setTimeout(() => {
      buscar(consulta, { tipo, seccion, genero, categoria }, controlador.signal)
        .then((datos) => {
          if (vivo) setResultados(datos);
        })
        .catch((err) => {
          if (vivo) {
            setResultados(RESULTADOS_VACIOS);
            setError(err.message);
          }
        })
        .finally(() => {
          if (vivo) setCargando(false);
        });
    }, 300);

    return () => {
      vivo = false;
      clearTimeout(temporizador);
      controlador.abort();
    };
  }, [autenticado, consulta, tipo, seccion, genero, categoria]);

  const totalResultados = useMemo(
    () => resultados.juegos.length + resultados.contenidos.length + resultados.plataformas.length,
    [resultados]
  );

  const plataformasEnriquecidas = useMemo(
    () => resultados.plataformas.map((fila) => enriquecerPlataforma(fila, fila.seccion)),
    [resultados.plataformas]
  );

  const hayFiltros = tipo !== 'todo' || Boolean(seccion) || Boolean(genero) || Boolean(categoria);
  const etiquetaSeccion = OPCIONES_SECCION.find((o) => o.valor === seccion)?.texto;
  const etiquetaGenero = opcionesGenero.find((g) => g.valor === genero)?.etiqueta;
  const etiquetaCategoria = OPCIONES_CATEGORIA.find((o) => o.valor === categoria)?.texto;
  const mostrarCatalogoCompleto = consulta.length < 2;

  return (
    <main className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 min-h-[50vh]">
      <div className="pb-4 mb-6 border-b border-[rgba(102,126,234,.2)]">
        <h1 className="sv-section-title mb-1"><i className="fas fa-magnifying-glass mr-2 sv-text-gradient"></i>Buscar</h1>
        <p className="text-[#94a3b8] text-sm m-0">
          Buscando en todo el catálogo
          {consulta ? <> · resultados para «<strong className="text-slate-200">{consulta}</strong>»</> : ''}
        </p>

        <form onSubmit={enviarBuscador} className="mt-3 flex flex-wrap items-center gap-2 max-w-xl">
          <input
            type="search"
            value={contenidoBuscador}
            onChange={(e) => setContenidoBuscador(e.target.value)}
            placeholder="Buscar juegos, contenidos y plataformas…"
            className="sv-input flex-1"
            aria-label="Buscar en todo el catálogo"
          />
          <button type="submit" className="btn-sv-primary text-sm py-2 px-4">
            <i className="fas fa-search mr-1"></i>Buscar
          </button>
          {consulta && (
            <button type="button" onClick={limpiarBusqueda} className="btn-sv-reset sm:w-auto sm:px-4">
              <i className="fas fa-times"></i> Limpiar búsqueda
            </button>
          )}
        </form>
      </div>

      {!autenticado && (
        <div className="sv-section text-center py-10">
          <i className="fas fa-lock sv-text-gradient text-3xl mb-3"></i>
          <p className="text-slate-200 font-bold mb-1">Inicia sesión para buscar en OpenLeaf</p>
          <p className="text-[#94a3b8] text-sm mb-4">La búsqueda consulta todo el catálogo y requiere una cuenta.</p>
          <Link to="/?auth=login" className="btn-sv-primary inline-flex text-sm py-2 px-5">Iniciar sesión</Link>
        </div>
      )}

      {autenticado && consulta.length === 1 && (
        <div className="sv-section text-center py-10">
          <i className="fas fa-keyboard text-[#94a3b8] text-3xl mb-3"></i>
          <p className="text-[#94a3b8] m-0">Escribe al menos 2 caracteres para buscar.</p>
        </div>
      )}

      {autenticado && consulta.length !== 1 && (
        <>
          <section className="sv-section mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#94a3b8] w-24">Tipo</span>
                {OPCIONES_TIPO.map((op) => (
                  <Pastilla
                    key={op.valor}
                    activo={tipo === op.valor}
                    onClick={() => actualizarFiltro('tipo', op.valor === 'todo' ? '' : op.valor)}
                  >
                    <i className={`${op.icono} mr-1`}></i>{op.texto}
                  </Pastilla>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#94a3b8] w-24">Sección</span>
                {OPCIONES_SECCION.map((op) => (
                  <Pastilla
                    key={op.valor}
                    activo={seccion === op.valor}
                    onClick={() => actualizarFiltro('seccion', seccion === op.valor ? '' : op.valor)}
                  >
                    {op.texto}
                  </Pastilla>
                ))}
              </div>
              {opcionesGenero.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#94a3b8] w-24">Género</span>
                  {opcionesGenero.map((op) => (
                    <Pastilla
                      key={op.valor}
                      activo={genero === op.valor}
                      onClick={() => actualizarFiltro('genero', genero === op.valor ? '' : op.valor)}
                    >
                      {op.etiqueta}
                    </Pastilla>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#94a3b8] w-24">Categoría</span>
                {OPCIONES_CATEGORIA.map((op) => (
                  <Pastilla
                    key={op.valor}
                    activo={categoria === op.valor}
                    onClick={() => actualizarFiltro('categoria', categoria === op.valor ? '' : op.valor)}
                  >
                    {op.texto}
                  </Pastilla>
                ))}
              </div>

              {hayFiltros && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#94a3b8] w-24">Filtros</span>
                  {tipo !== 'todo' && (
                    <EtiquetaFiltro onQuitar={() => actualizarFiltro('tipo', '')}>
                      {OPCIONES_TIPO.find((o) => o.valor === tipo)?.texto}
                    </EtiquetaFiltro>
                  )}
                  {seccion && <EtiquetaFiltro onQuitar={() => actualizarFiltro('seccion', '')}>{etiquetaSeccion}</EtiquetaFiltro>}
                  {genero && <EtiquetaFiltro onQuitar={() => actualizarFiltro('genero', '')}>{etiquetaGenero || genero}</EtiquetaFiltro>}
                  {categoria && <EtiquetaFiltro onQuitar={() => actualizarFiltro('categoria', '')}>{etiquetaCategoria}</EtiquetaFiltro>}
                  <button type="button" onClick={limpiarFiltros} className="btn-sv-reset sm:w-auto sm:px-5">
                    <i className="fas fa-filter-circle-xmark"></i> Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </section>

          {cargando && (
            <div className="text-center py-10 text-[#94a3b8]">
              <span className="animate-spin inline-block rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-3"></span>
              <p className="m-0">Buscando…</p>
            </div>
          )}

          {!cargando && error && (
            <div className="sv-section text-center py-8">
              <p className="text-rose-400 m-0">{error}</p>
              <button type="button" onClick={limpiarBusqueda} className="btn-sv-reset sm:w-auto sm:px-5 mx-auto mt-4">
                <i className="fas fa-times"></i> Limpiar búsqueda
              </button>
            </div>
          )}

          {!cargando && !error && (
            <>
              {totalResultados === 0 && (
                <div className="sv-section text-center py-10">
                  <i className="fas fa-circle-notch text-[#94a3b8] text-3xl mb-3"></i>
                  <p className="text-slate-200 font-bold m-0">
                    {mostrarCatalogoCompleto ? 'El catálogo está vacío' : `No encontramos resultados para «${consulta}»`}
                  </p>
                  <p className="text-[#94a3b8] text-sm m-0">
                    {hayFiltros ? 'Prueba quitando los filtros seleccionados.' : 'Intenta con otro término.'}
                  </p>
                  <div className="flex gap-2 justify-center mt-4 flex-wrap">
                    {hayFiltros && (
                      <button type="button" onClick={limpiarFiltros} className="btn-sv-reset sm:w-auto sm:px-5">
                        <i className="fas fa-filter-circle-xmark"></i> Limpiar filtros
                      </button>
                    )}
                    {consulta && (
                      <button type="button" onClick={limpiarBusqueda} className="btn-sv-primary sm:w-auto sm:px-5">
                        <i className="fas fa-times"></i> Limpiar búsqueda
                      </button>
                    )}
                  </div>
                </div>
              )}

              {resultados.juegos.length > 0 && (
                <section className="mb-10">
                  <EncabezadoSeccion icono="fas fa-gamepad" titulo="GameZone" total={resultados.juegos.length} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                    {resultados.juegos.map((juego) => (
                      <JuegoFlipCard key={juego.id} juego={juego} />
                    ))}
                  </div>
                </section>
              )}

              {resultados.contenidos.length > 0 && (
                <section className="mb-10">
                  <EncabezadoSeccion icono="fas fa-photo-video" titulo="Contenidos" total={resultados.contenidos.length} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                    {resultados.contenidos.map((contenido) => (
                      <TarjetaContenido key={contenido.id} contenido={contenido} />
                    ))}
                  </div>
                </section>
              )}

              {plataformasEnriquecidas.length > 0 && (
                <section className="mb-10">
                  <EncabezadoSeccion icono="fas fa-layer-group" titulo="Plataformas" total={plataformasEnriquecidas.length} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                    {plataformasEnriquecidas.map((plataforma) => (
                      <TarjetaPlataforma key={plataforma.id} p={plataforma} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
