import { useEffect, useState } from 'react';

import ConfirmModal from '../../components/admin/ConfirmModal.jsx';
import { useToast } from '../../components/admin/Toast.jsx';
import useTituloPagina from '../../hooks/useTituloPagina.js';
import {
  cambiarEstadoJuego,
  crearJuego,
  editarJuego,
  eliminarJuego,
  listarJuegos,
  subirImagenJuego
} from '../../services/juegosService.js';

const CATEGORIAS = ['accion', 'terror', 'deportes', 'cooperativo'];
const ESTADOS = ['borrador', 'publicado', 'despublicado'];

const FORM_VACIO = {
  id: null,
  titulo: '',
  categoria: 'accion',
  descripcion: '',
  imagen_url: '',
  trailer_youtube_id: '',
  webgl_url: '',
  puntuacion: '',
  destacado: false,
  estado: 'borrador'
};

export default function JuegosPage() {
  useTituloPagina('Juegos · OpenLeaf');
  const toast = useToast();

  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState(FORM_VACIO);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [errorConfirmacion, setErrorConfirmacion] = useState('');

  const cargar = () => {
    setCargando(true);
    listarJuegos()
      .then(setJuegos)
      .catch((err) => toast.error(err.message))
      .finally(() => setCargando(false));
  };

  const refrescar = () => {
    listarJuegos()
      .then(setJuegos)
      .catch((err) => toast.error(err.message));
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cambiar = (evento) => {
    const { name, value, type, checked } = evento.target;
    setForm((previo) => ({ ...previo, [name]: type === 'checkbox' ? checked : value }));
  };

  const abrirCrear = () => {
    setForm(FORM_VACIO);
    setMostrarForm(true);
  };

  const abrirEditar = (juego) => {
    setForm({
      id: juego.id,
      titulo: juego.titulo || '',
      categoria: juego.categoria || 'accion',
      descripcion: juego.descripcion || '',
      imagen_url: juego.imagen_url || '',
      trailer_youtube_id: juego.trailer_youtube_id || '',
      webgl_url: juego.webgl_url || '',
      puntuacion: juego.puntuacion ?? '',
      destacado: Boolean(juego.destacado),
      estado: juego.estado || 'borrador'
    });
    setMostrarForm(true);
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    const datos = {
      titulo: form.titulo,
      categoria: form.categoria,
      descripcion: form.descripcion,
      imagen_url: form.imagen_url,
      trailer_youtube_id: form.trailer_youtube_id,
      webgl_url: form.webgl_url,
      puntuacion: form.puntuacion === '' ? null : Number(form.puntuacion),
      destacado: form.destacado,
      estado: form.estado
    };
    try {
      if (form.id) {
        await editarJuego(form.id, datos);
        toast.exito('Juego actualizado correctamente');
      } else {
        await crearJuego(datos);
        toast.exito('Juego creado correctamente');
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

  const cambiarEstado = async (juego, estado) => {
    try {
      await cambiarEstadoJuego(juego.id, estado);
      toast.exito('Estado actualizado correctamente');
      refrescar();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const abrirEliminar = (juego) => {
    setErrorConfirmacion('');
    setConfirmacion(juego);
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
      await eliminarJuego(confirmacion.id);
      setJuegos((previos) => previos.filter((item) => item.id !== confirmacion.id));
      toast.exito('Juego eliminado correctamente');
      setConfirmacion(null);
    } catch (err) {
      setErrorConfirmacion(err.message);
    } finally {
      setProcesando(false);
    }
  };

  const subirImagen = async (juego, archivo) => {
    if (!archivo) return;
    try {
      await subirImagenJuego(juego.id, archivo);
      toast.exito('Imagen actualizada correctamente');
      refrescar();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <h2 className="sv-section-title text-lg m-0"><i className="fas fa-gamepad mr-2 sv-text-gradient"></i>Juegos</h2>
        <button type="button" onClick={abrirCrear} className="btn-sv-primary"><i className="fas fa-plus"></i>Nuevo juego</button>
      </div>

      {mostrarForm && (
        <form onSubmit={enviar} className="sv-section">
          <h3 className="text-white font-bold mb-4">{form.id ? 'Editar juego' : 'Crear juego'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-[#94a3b8] text-xs block mb-1">Título</label>
              <input name="titulo" value={form.titulo} onChange={cambiar} className="sv-input" required />
            </div>
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">Categoría</label>
              <select name="categoria" value={form.categoria} onChange={cambiar} className="sv-input">
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">Estado</label>
              <select name="estado" value={form.estado} onChange={cambiar} className="sv-input">
                {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">Puntuación</label>
              <input name="puntuacion" type="number" step="0.1" min="0" max="10" value={form.puntuacion} onChange={cambiar} className="sv-input" />
            </div>
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">Trailer (YouTube ID)</label>
              <input name="trailer_youtube_id" value={form.trailer_youtube_id} onChange={cambiar} className="sv-input" />
            </div>
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">URL WebGL (https://)</label>
              <input name="webgl_url" value={form.webgl_url} onChange={cambiar} className="sv-input" placeholder="https://…" />
            </div>
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">URL de imagen</label>
              <input name="imagen_url" value={form.imagen_url} onChange={cambiar} className="sv-input" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-[#94a3b8] text-xs block mb-1">Descripción</label>
              <textarea name="descripcion" value={form.descripcion} onChange={cambiar} className="sv-input" rows={3} />
            </div>
            <label className="flex items-center gap-2 text-sm text-[#cbd5e1]">
              <input type="checkbox" name="destacado" checked={form.destacado} onChange={cambiar} />
              Destacado
            </label>
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
          <p className="text-[#94a3b8] text-sm m-0">Cargando juegos…</p>
        ) : (
          <table className="sv-admin-table">
            <thead>
              <tr>
                <th>Juego</th>
                <th>Categoría</th>
                <th>Puntuación</th>
                <th>Estado</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {juegos.map((juego) => (
                <tr key={juego.id}>
                  <td>
                    <div className="font-semibold text-white">{juego.titulo}</div>
                    <div className="text-[#64748b] text-xs">{juego.slug}</div>
                  </td>
                  <td className="capitalize">{juego.categoria}</td>
                  <td>{juego.puntuacion ?? '—'}</td>
                  <td>
                    <select value={juego.estado} onChange={(e) => cambiarEstado(juego, e.target.value)} className="sv-input py-1 text-xs">
                      {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </td>
                  <td>
                    <label className="sv-admin-mini cursor-pointer">
                      <i className="fas fa-image"></i>Subir
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => subirImagen(juego, e.target.files?.[0])} />
                    </label>
                  </td>
                  <td>
                    <div className="sv-admin-actions">
                      <button type="button" onClick={() => abrirEditar(juego)} className="sv-admin-mini"><i className="fas fa-pen"></i>Editar</button>
                      <button type="button" onClick={() => abrirEliminar(juego)} className="sv-admin-mini peligro"><i className="fas fa-trash"></i>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {juegos.length === 0 && (
                <tr><td colSpan={6} className="text-center text-[#64748b]">No hay juegos registrados.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        abierto={Boolean(confirmacion)}
        titulo="Eliminar juego"
        mensaje={confirmacion ? `¿Eliminar el juego "${confirmacion.titulo}"? Esta acción no se puede deshacer.` : ''}
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
