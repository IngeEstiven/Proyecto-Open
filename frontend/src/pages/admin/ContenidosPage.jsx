import { useEffect, useState } from 'react';

import ConfirmModal from '../../components/admin/ConfirmModal.jsx';
import { useToast } from '../../components/admin/Toast.jsx';
import useTituloPagina from '../../hooks/useTituloPagina.js';
import { usePlayer } from '../../hooks/usePlayer.js';
import { GENEROS_POR_SECCION, etiquetaGenero } from '../../services/generos.js';
import {
  crearContenido,
  editarContenido,
  eliminarContenido,
  listarContenidos
} from '../../services/contenidosService.js';

const SECCIONES = ['peliculas', 'musica', 'en_vivo', 'deportes'];
const SECCIONES_CON_GENERO = ['peliculas', 'musica'];
const FUENTES = ['youtube', 'twitch', 'otro', 'spotify'];
const ESTADOS = ['borrador', 'publicado', 'despublicado'];

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
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [errorConfirmacion, setErrorConfirmacion] = useState('');

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
    setForm((previo) => {
      const siguiente = { ...previo, [name]: value };
      // Al cambiar de sección se reinicia el género si ya no es válido.
      if (name === 'seccion') {
        const permitidos = GENEROS_POR_SECCION[value] || [];
        if (siguiente.genero && !permitidos.some((g) => g.valor === siguiente.genero)) {
          siguiente.genero = '';
        }
      }
      return siguiente;
    });
  };

  const abrirCrear = () => {
    setForm(FORM_VACIO);
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
    setMostrarForm(true);
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
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
      toast.error(err.message);
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
              <input name="titulo" value={form.titulo} onChange={cambiar} className="sv-input" required />
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
                {FUENTES.map((f) => <option key={f} value={f}>{f}</option>)}
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
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">
                {form.fuente === 'spotify' ? 'ID o enlace de Spotify' : 'ID externo (YouTube, etc.)'}
              </label>
              <input
                name="external_id"
                value={form.external_id}
                onChange={cambiar}
                className="sv-input"
                placeholder={form.fuente === 'spotify' ? 'https://open.spotify.com/track/… o el ID' : ''}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[#94a3b8] text-xs block mb-1">
                {form.fuente === 'spotify'
                  ? 'También puedes pegar aquí el enlace de Spotify'
                  : 'URL del embed (https://)'}
              </label>
              <input name="embed_url" value={form.embed_url} onChange={cambiar} className="sv-input" placeholder="https://www.youtube.com/embed/…" />
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
                  <td><span className={`sv-admin-chip ${colorEstado(contenido.estado)}`}>{contenido.estado}</span></td>
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
