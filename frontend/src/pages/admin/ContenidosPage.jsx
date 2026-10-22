import { useEffect, useState } from 'react';

import ConfirmModal from '../../components/admin/ConfirmModal.jsx';
import { useToast } from '../../components/admin/Toast.jsx';
import useTituloPagina from '../../hooks/useTituloPagina.js';
import { usePlayer } from '../../hooks/usePlayer.js';
import { GENEROS_POR_SECCION, etiquetaGenero } from '../../services/generos.js';
import {
  extraerIdYouTubeDeUrl,
  miniaturaYouTube
} from '../../services/enlacesContenido.js';
import {
  cambiarEstadoContenido,
  crearContenido,
  editarContenido,
  eliminarContenido,
  listarContenidos
} from '../../services/contenidosService.js';

const SECCIONES = ['peliculas', 'musica', 'en_vivo', 'deportes'];
const SECCIONES_CON_GENERO = ['peliculas', 'musica'];
const FUENTES = ['youtube', 'twitch', 'otro', 'spotify'];
// Misma lista que el backend: "jamendo" solo aplica a la sección de música.
const FUENTES_MUSICA = ['youtube', 'twitch', 'otro', 'spotify', 'jamendo'];
const ESTADOS = ['borrador', 'publicado', 'despublicado'];

// Etiqueta y texto de ayuda del campo de identificador según la fuente elegida.
const AYUDA_FUENTE = {
  youtube: {
    etiqueta: 'ID del video de YouTube',
    ayuda:
      'Es el código que aparece después de v= en la URL del video (ejemplo: en youtube.com/watch?v=R6MlUcmOul8, el ID es R6MlUcmOul8).'
  },
  jamendo: {
    etiqueta: 'ID de la canción en Jamendo',
    ayuda: 'Es el identificador numérico de la canción dentro de Jamendo (aparece en la URL del tema).'
  },
  spotify: {
    etiqueta: 'ID o enlace de Spotify',
    ayuda:
      'Es el código de la canción tras /track/ en open.spotify.com/track/… También puedes pegar el enlace completo o usar el campo de abajo.'
  },
  twitch: {
    etiqueta: 'ID o enlace de Twitch',
    ayuda: 'Pega el enlace del video o canal de Twitch, o su identificador.'
  },
  otro: {
    etiqueta: 'ID externo',
    ayuda: 'Identificador del contenido en su plataforma de origen.'
  }
};

function ayudaDeFuente(fuente) {
  return AYUDA_FUENTE[fuente] || AYUDA_FUENTE.otro;
}

function fuentesDeSeccion(seccion) {
  return seccion === 'musica' ? FUENTES_MUSICA : FUENTES;
}

// Misma normalización que aplica el backend: recorta, colapsa espacios y
// compara en minúsculas. Solo sirve para la advertencia temprana.
function normalizarTitulo(valor) {
  return String(valor ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

const FORM_VACIO = {
  id: null,
  seccion: 'peliculas',
  titulo: '',
  descripcion: '',
  miniatura_url: '',
  fuente: 'youtube',
  external_id: '',
  embed_url: '',
  genero: '',
  estado: 'borrador'
};

export default function ContenidosPage() {
  useTituloPagina('Contenidos · OpenLeaf');
  const toast = useToast();
  const { play } = usePlayer();

  const [contenidos, setContenidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState(FORM_VACIO);
  const [enlacePegado, setEnlacePegado] = useState('');
  const [avisoEnlace, setAvisoEnlace] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [errorConfirmacion, setErrorConfirmacion] = useState('');
  const [errorTitulo, setErrorTitulo] = useState('');
  const [errorEnlace, setErrorEnlace] = useState('');
  const [advertenciaTitulo, setAdvertenciaTitulo] = useState('');
  const [estadoGuardando, setEstadoGuardando] = useState({});

  const cargar = () => {
    setCargando(true);
    listarContenidos()
      .then(setContenidos)
      .catch((err) => toast.error(err.message))
      .finally(() => setCargando(false));
  };

  const refrescar = () => {
    listarContenidos()
      .then(setContenidos)
      .catch((err) => toast.error(err.message));
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cambiar = (evento) => {
    const { name, value } = evento.target;
    if (name === 'titulo') {
      setErrorTitulo('');
      setAdvertenciaTitulo('');
    }
    if (name === 'external_id' || name === 'embed_url' || name === 'fuente') {
      setErrorEnlace('');
    }
    setForm((previo) => {
      const siguiente = { ...previo, [name]: value };
      // Al cambiar de sección se reinicia el género si ya no es válido.
      if (name === 'seccion') {
        const permitidos = GENEROS_POR_SECCION[value] || [];
        if (siguiente.genero && !permitidos.some((g) => g.valor === siguiente.genero)) {
          siguiente.genero = '';
        }
        // Si la fuente ya no existe en la nueva sección, se vuelve a youtube.
        if (!fuentesDeSeccion(value).includes(siguiente.fuente)) {
          siguiente.fuente = 'youtube';
        }
        setAdvertenciaTitulo('');
      }
      return siguiente;
    });
  };

  // Al pegar un enlace completo: extrae el ID de YouTube y, si aún no hay
  // miniatura, la genera. Nunca bloquea el formulario.
  const pegarEnlace = (evento) => {
    const valor = evento.target.value;
    setEnlacePegado(valor);
    setAvisoEnlace('');
    setErrorEnlace('');

    const id = extraerIdYouTubeDeUrl(valor);
    if (!id) {
      if (valor.trim()) {
        setAvisoEnlace(
          'No reconocemos ese enlace. Pega el ID manualmente o usa un enlace de youtube.com'
        );
      }
      return;
    }

    setForm((previo) => ({
      ...previo,
      external_id: id,
      miniatura_url: previo.miniatura_url || miniaturaYouTube(id)
    }));
  };

  // Advertencia temprana (no bloquea): compara contra los contenidos cargados.
  const avisarTitulo = () => {
    const clave = normalizarTitulo(form.titulo);
    if (clave.length <= 2) {
      setAdvertenciaTitulo('');
      return;
    }
    const repetido = contenidos.some(
      (contenido) =>
        contenido.id !== form.id &&
        contenido.seccion === form.seccion &&
        normalizarTitulo(contenido.titulo) === clave
    );
    setAdvertenciaTitulo(repetido ? 'Ya existe un contenido con ese título en esta sección.' : '');
  };

  const abrirCrear = () => {
    setForm(FORM_VACIO);
    setEnlacePegado('');
    setAvisoEnlace('');
    setErrorTitulo('');
    setErrorEnlace('');
    setAdvertenciaTitulo('');
    setMostrarForm(true);
  };

  const abrirEditar = (contenido) => {
    setForm({
      id: contenido.id,
      seccion: contenido.seccion || 'peliculas',
      titulo: contenido.titulo || '',
      descripcion: contenido.descripcion || '',
      miniatura_url: contenido.miniatura_url || '',
      fuente: contenido.fuente || 'youtube',
      external_id: contenido.external_id || '',
      embed_url: contenido.embed_url || '',
      genero: contenido.genero || '',
      estado: contenido.estado || 'borrador'
    });
    setEnlacePegado('');
    setAvisoEnlace('');
    setErrorTitulo('');
    setErrorEnlace('');
    setAdvertenciaTitulo('');
    setMostrarForm(true);
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    setErrorTitulo('');
    setErrorEnlace('');
    const datos = {
      seccion: form.seccion,
      titulo: form.titulo,
      descripcion: form.descripcion,
      miniatura_url: form.miniatura_url,
      fuente: form.fuente,
      external_id: form.external_id,
      embed_url: form.embed_url,
      genero: form.genero || null,
      estado: form.estado
    };

    // Validación previa para dar un aviso claro antes de llamar al backend.
    const esSpotify = form.fuente === 'spotify';
    const tieneEnlace = Boolean((form.external_id || '').trim() || (form.embed_url || '').trim());
    if (!tieneEnlace) {
      setErrorEnlace(
        esSpotify
          ? 'Pega el enlace de la canción de Spotify o su identificador.'
          : 'Agrega el enlace del video o su identificador para el reproductor.'
      );
      setGuardando(false);
      return;
    }
    if (!esSpotify) {
      const enlace = (form.embed_url || form.external_id || '').trim();
      try {
        const url = new URL(enlace);
        if (url.protocol !== 'https:') {
          setErrorEnlace('El enlace debe comenzar con https://');
          setGuardando(false);
          return;
        }
      } catch {
        setErrorEnlace('El enlace no es válido. Revísalo e intenta de nuevo.');
        setGuardando(false);
        return;
      }
    }

    try {
      if (form.id) {
        await editarContenido(form.id, datos);
        toast.exito('Contenido actualizado correctamente');
      } else {
        await crearContenido(datos);
        toast.exito('Contenido creado correctamente');
      }
      setMostrarForm(false);
      setForm(FORM_VACIO);
      refrescar();
    } catch (err) {
      const mensaje = err.message;
      if (err.status === 409) {
        setErrorTitulo(mensaje);
      } else {
        toast.error(mensaje);
      }
    } finally {
      setGuardando(false);
    }
  };

  const abrirEliminar = (contenido) => {
    setErrorConfirmacion('');
    setConfirmacion(contenido);
  };

  const cancelarEliminar = () => {
    if (procesando) return;
    setConfirmacion(null);
    setErrorConfirmacion('');
  };

  const confirmarEliminar = async () => {
    setErrorConfirmacion('');
    setProcesando(true);
    try {
      await eliminarContenido(confirmacion.id);
      setContenidos((previos) => previos.filter((item) => item.id !== confirmacion.id));
      toast.exito('Contenido eliminado correctamente');
      setConfirmacion(null);
    } catch (err) {
      setErrorConfirmacion(err.message);
    } finally {
      setProcesando(false);
    }
  };

  const colorEstado = (estado) =>
    estado === 'publicado'
      ? 'bg-emerald-500/15 text-emerald-300'
      : estado === 'borrador'
        ? 'bg-amber-500/15 text-amber-300'
        : 'bg-rose-500/15 text-rose-300';

  // Cambio rápido de estado desde la fila: actualiza solo ese registro sin
  // recargar la tabla. Si falla, se restaura el valor anterior y se avisa.
  const cambiarEstadoFila = async (contenido, nuevoEstado) => {
    const anterior = contenido.estado;
    setContenidos((previos) =>
      previos.map((item) => (item.id === contenido.id ? { ...item, estado: nuevoEstado } : item))
    );
    setEstadoGuardando((previos) => ({ ...previos, [contenido.id]: true }));
    try {
      await cambiarEstadoContenido(contenido.id, nuevoEstado);
      toast.exito('Estado actualizado correctamente');
    } catch (err) {
      setContenidos((previos) =>
        previos.map((item) => (item.id === contenido.id ? { ...item, estado: anterior } : item))
      );
      toast.error(err.message);
    } finally {
      setEstadoGuardando((previos) => ({ ...previos, [contenido.id]: false }));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <h2 className="sv-section-title text-lg m-0"><i className="fas fa-video mr-2 sv-text-gradient"></i>Contenidos</h2>
        <button type="button" onClick={abrirCrear} className="btn-sv-primary"><i className="fas fa-plus"></i>Nuevo contenido</button>
      </div>

      {mostrarForm && (
        <form onSubmit={enviar} className="sv-section">
          <h3 className="text-white font-bold mb-4">{form.id ? 'Editar contenido' : 'Crear contenido'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-[#94a3b8] text-xs block mb-1">Título</label>
              <input
                name="titulo"
                value={form.titulo}
                onChange={cambiar}
                onBlur={avisarTitulo}
                className="sv-input"
                aria-invalid={Boolean(errorTitulo)}
                required
              />
              {errorTitulo ? (
                <p className="text-rose-400 text-xs mt-1 mb-0"><i className="fas fa-circle-exclamation mr-1"></i>{errorTitulo}</p>
              ) : advertenciaTitulo ? (
                <p className="text-amber-300 text-xs mt-1 mb-0"><i className="fas fa-triangle-exclamation mr-1"></i>{advertenciaTitulo}</p>
              ) : null}
            </div>
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">Sección</label>
              <select name="seccion" value={form.seccion} onChange={cambiar} className="sv-input">
                {SECCIONES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {SECCIONES_CON_GENERO.includes(form.seccion) && (
              <div>
                <label className="text-[#94a3b8] text-xs block mb-1">Género</label>
                <select name="genero" value={form.genero} onChange={cambiar} className="sv-input">
                  <option value="">Sin género</option>
                  {(GENEROS_POR_SECCION[form.seccion] || []).map((g) => (
                    <option key={g.valor} value={g.valor}>{g.etiqueta}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">Fuente</label>
              <select name="fuente" value={form.fuente} onChange={cambiar} className="sv-input">
                {fuentesDeSeccion(form.seccion).map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">Estado</label>
              <select name="estado" value={form.estado} onChange={cambiar} className="sv-input">
                {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            {form.fuente === 'spotify' && (
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="text-[#a5b4fc] text-xs m-0">
                  <i className="fab fa-spotify mr-1"></i>
                  Pega el enlace de la canción (open.spotify.com/track/…) o el ID directo. La
                  reproducción completa solo funciona si el visitante tiene sesión iniciada en
                  Spotify en su navegador; si no, sonarán 30 segundos de muestra.
                </p>
              </div>
            )}
            {form.fuente === 'youtube' && (
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-[#94a3b8] text-xs block mb-1">
                  O pega el enlace completo (opcional)
                </label>
                <input
                  name="enlace_pegado"
                  value={enlacePegado}
                  onChange={pegarEnlace}
                  className="sv-input"
                  placeholder="https://www.youtube.com/watch?v=…"
                />
                {avisoEnlace && (
                  <p className="text-amber-300 text-xs mt-1 mb-0">
                    <i className="fas fa-triangle-exclamation mr-1"></i>{avisoEnlace}
                  </p>
                )}
              </div>
            )}
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">{ayudaDeFuente(form.fuente).etiqueta}</label>
              <input
                name="external_id"
                value={form.external_id}
                onChange={cambiar}
                className="sv-input"
                aria-invalid={Boolean(errorEnlace)}
                placeholder={form.fuente === 'spotify' ? 'https://open.spotify.com/track/… o el ID' : ''}
              />
              <p className="text-[#64748b] text-xs mt-1 mb-0">{ayudaDeFuente(form.fuente).ayuda}</p>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[#94a3b8] text-xs block mb-1">
                {form.fuente === 'spotify'
                  ? 'También puedes pegar aquí el enlace de Spotify'
                  : 'URL del embed (https://)'}
              </label>
              <input name="embed_url" value={form.embed_url} onChange={cambiar} className="sv-input" aria-invalid={Boolean(errorEnlace)} placeholder="https://www.youtube.com/embed/…" />
              {errorEnlace && (
                <p className="text-rose-400 text-xs mt-1 mb-0"><i className="fas fa-circle-exclamation mr-1"></i>{errorEnlace}</p>
              )}
            </div>
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">URL de miniatura</label>
              <input name="miniatura_url" value={form.miniatura_url} onChange={cambiar} className="sv-input" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-[#94a3b8] text-xs block mb-1">Descripción</label>
              <textarea name="descripcion" value={form.descripcion} onChange={cambiar} className="sv-input" rows={3} />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button type="submit" disabled={guardando} className="btn-sv-primary disabled:opacity-60">
              <i className="fas fa-save"></i>{guardando ? 'Guardando…' : 'Guardar'}
            </button>
            <button type="button" onClick={() => setMostrarForm(false)} className="btn-sv-secondary">Cancelar</button>
          </div>
        </form>
      )}

      <div className="sv-section overflow-x-auto">
        {cargando ? (
          <p className="text-[#94a3b8] text-sm m-0">Cargando contenidos…</p>
        ) : (
          <table className="sv-admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Sección</th>
                <th>Género</th>
                <th>Fuente</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contenidos.map((contenido) => (
                <tr key={contenido.id}>
                  <td>
                    <div className="font-semibold text-white">{contenido.titulo}</div>
                    <div className="text-[#64748b] text-xs">{contenido.external_id || contenido.embed_url || '—'}</div>
                    {contenido.fuente === 'spotify' && (
                      <div className="text-[#1DB954] text-xs mt-0.5">
                        <i className="fab fa-spotify mr-1"></i>Vía Spotify · duración completa si tienes sesión iniciada
                      </div>
                    )}
                  </td>
                  <td>{contenido.seccion}</td>
                  <td>{contenido.genero ? etiquetaGenero(contenido.seccion, contenido.genero) : '—'}</td>
                  <td className="capitalize">{contenido.fuente}</td>
                  <td>
                    <span className={`sv-admin-chip ${colorEstado(contenido.estado)}`}>{contenido.estado}</span>
                    <div className="mt-1 flex items-center gap-1">
                      <select
                        value={contenido.estado}
                        disabled={Boolean(estadoGuardando[contenido.id])}
                        onChange={(e) => cambiarEstadoFila(contenido, e.target.value)}
                        className="sv-input py-1 text-xs disabled:opacity-60"
                        aria-label={`Cambiar estado de ${contenido.titulo}`}
                      >
                        {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                      </select>
                      {estadoGuardando[contenido.id] && (
                        <i className="fas fa-spinner fa-spin text-[#94a3b8] text-xs" title="Guardando…"></i>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="sv-admin-actions">
                      <button type="button" onClick={() => play(contenido)} className="sv-admin-mini"><i className="fas fa-play"></i>Probar</button>
                      <button type="button" onClick={() => abrirEditar(contenido)} className="sv-admin-mini"><i className="fas fa-pen"></i>Editar</button>
                      <button type="button" onClick={() => abrirEliminar(contenido)} className="sv-admin-mini peligro"><i className="fas fa-trash"></i>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {contenidos.length === 0 && (
                <tr><td colSpan={6} className="text-center text-[#64748b]">No hay contenidos registrados.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        abierto={Boolean(confirmacion)}
        titulo="Eliminar contenido"
        mensaje={confirmacion ? `¿Eliminar el contenido "${confirmacion.titulo}"? Esta acción no se puede deshacer.` : ''}
        textoConfirmar="Eliminar"
        variante="peligro"
        cargando={procesando}
        error={errorConfirmacion}
        onConfirmar={confirmarEliminar}
        onCancelar={cancelarEliminar}
      />
    </div>
  );
}
