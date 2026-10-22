import { useEffect, useState } from 'react';

import ConfirmModal from '../../components/admin/ConfirmModal.jsx';
import { useToast } from '../../components/admin/Toast.jsx';
import useTituloPagina from '../../hooks/useTituloPagina.js';
import {
  cambiarEstadoPlataforma,
  crearPlataforma,
  editarPlataforma,
  eliminarPlataforma,
  listarPlataformas,
  subirImagenPlataforma
} from '../../services/plataformasService.js';

const SECCIONES = ['peliculas', 'musica', 'en_vivo', 'deportes'];
const ESTADOS = ['activo', 'inactivo'];

// Misma normalización que aplica el backend: recorta, colapsa espacios y
// compara en minúsculas. Solo sirve para la advertencia temprana.
function normalizarTitulo(valor) {
  return String(valor ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

const FORM_VACIO = {
  id: null,
  nombre: '',
  seccion: 'peliculas',
  descripcion: '',
  sitio_url: '',
  logo_url: '',
  imagen_url: '',
  estado: 'activo'
};

export default function PlataformasPage() {
  useTituloPagina('Plataformas · OpenLeaf');
  const toast = useToast();

  const [plataformas, setPlataformas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState(FORM_VACIO);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [errorConfirmacion, setErrorConfirmacion] = useState('');
  const [errorTitulo, setErrorTitulo] = useState('');
  const [advertenciaTitulo, setAdvertenciaTitulo] = useState('');
  const [estadoGuardando, setEstadoGuardando] = useState({});

  const cargar = () => {
    setCargando(true);
    listarPlataformas()
      .then(setPlataformas)
      .catch((err) => toast.error(err.message))
      .finally(() => setCargando(false));
  };

  const refrescar = () => {
    listarPlataformas()
      .then(setPlataformas)
      .catch((err) => toast.error(err.message));
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cambiar = (evento) => {
    const { name, value } = evento.target;
    if (name === 'nombre') {
      setErrorTitulo('');
      setAdvertenciaTitulo('');
    }
    setForm((previo) => ({ ...previo, [name]: value }));
  };

  // Advertencia temprana (no bloquea): compara contra las plataformas cargadas.
  const avisarTitulo = () => {
    const clave = normalizarTitulo(form.nombre);
    if (clave.length <= 2) {
      setAdvertenciaTitulo('');
      return;
    }
    const repetido = plataformas.some(
      (plataforma) =>
        plataforma.id !== form.id && normalizarTitulo(plataforma.nombre) === clave
    );
    setAdvertenciaTitulo(repetido ? 'Ya existe una plataforma con ese nombre.' : '');
  };

  const abrirCrear = () => {
    setForm(FORM_VACIO);
    setErrorTitulo('');
    setAdvertenciaTitulo('');
    setMostrarForm(true);
  };

  const abrirEditar = (plataforma) => {
    setForm({
      id: plataforma.id,
      nombre: plataforma.nombre || '',
      seccion: plataforma.seccion || 'peliculas',
      descripcion: plataforma.descripcion || '',
      sitio_url: plataforma.sitio_url || '',
      logo_url: plataforma.logo_url || '',
      imagen_url: plataforma.imagen_url || '',
      estado: plataforma.estado || 'activo'
    });
    setErrorTitulo('');
    setAdvertenciaTitulo('');
    setMostrarForm(true);
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    setErrorTitulo('');
    const datos = {
      nombre: form.nombre,
      seccion: form.seccion,
      descripcion: form.descripcion,
      sitio_url: form.sitio_url,
      logo_url: form.logo_url,
      imagen_url: form.imagen_url,
      estado: form.estado
    };
    try {
      if (form.id) {
        await editarPlataforma(form.id, datos);
        toast.exito('Plataforma actualizada correctamente');
      } else {
        await crearPlataforma(datos);
        toast.exito('Plataforma creada correctamente');
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

  const abrirEliminar = (plataforma) => {
    setErrorConfirmacion('');
    setConfirmacion(plataforma);
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
      await eliminarPlataforma(confirmacion.id);
      setPlataformas((previos) => previos.filter((item) => item.id !== confirmacion.id));
      toast.exito('Plataforma eliminada correctamente');
      setConfirmacion(null);
    } catch (err) {
      setErrorConfirmacion(err.message);
    } finally {
      setProcesando(false);
    }
  };

  // Cambio rápido de estado desde la fila: actualiza solo ese registro sin
  // recargar la tabla. Si falla, se restaura el valor anterior y se avisa.
  const cambiarEstadoFila = async (plataforma, nuevoEstado) => {
    const anterior = plataforma.estado;
    setPlataformas((previos) =>
      previos.map((item) => (item.id === plataforma.id ? { ...item, estado: nuevoEstado } : item))
    );
    setEstadoGuardando((previos) => ({ ...previos, [plataforma.id]: true }));
    try {
      await cambiarEstadoPlataforma(plataforma.id, nuevoEstado);
      toast.exito('Estado actualizado correctamente');
    } catch (err) {
      setPlataformas((previos) =>
        previos.map((item) => (item.id === plataforma.id ? { ...item, estado: anterior } : item))
      );
      toast.error(err.message);
    } finally {
      setEstadoGuardando((previos) => ({ ...previos, [plataforma.id]: false }));
    }
  };

  const subirImagen = async (plataforma, archivo) => {
    if (!archivo) return;
    try {
      await subirImagenPlataforma(plataforma.id, archivo);
      toast.exito('Imagen actualizada correctamente');
      refrescar();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const colorEstado = (estado) =>
    estado === 'activo' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300';

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <h2 className="sv-section-title text-lg m-0"><i className="fas fa-tv mr-2 sv-text-gradient"></i>Plataformas</h2>
        <button type="button" onClick={abrirCrear} className="btn-sv-primary"><i className="fas fa-plus"></i>Nueva plataforma</button>
      </div>

      {mostrarForm && (
        <form onSubmit={enviar} className="sv-section">
          <h3 className="text-white font-bold mb-4">{form.id ? 'Editar plataforma' : 'Crear plataforma'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
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
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">Estado</label>
              <select name="estado" value={form.estado} onChange={cambiar} className="sv-input">
                {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">Sitio (https://)</label>
              <input name="sitio_url" value={form.sitio_url} onChange={cambiar} className="sv-input" placeholder="https://…" />
            </div>
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">URL del logo</label>
              <input name="logo_url" value={form.logo_url} onChange={cambiar} className="sv-input" />
            </div>
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">URL de imagen</label>
              <input name="imagen_url" value={form.imagen_url} onChange={cambiar} className="sv-input" />
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
          <p className="text-[#94a3b8] text-sm m-0">Cargando plataformas…</p>
        ) : (
          <table className="sv-admin-table">
            <thead>
              <tr>
                <th>Plataforma</th>
                <th>Sección</th>
                <th>Estado</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {plataformas.map((plataforma) => (
                <tr key={plataforma.id}>
                  <td>
                    <div className="font-semibold text-white">{plataforma.nombre}</div>
                    <div className="text-[#64748b] text-xs">{plataforma.sitio_url || '—'}</div>
                  </td>
                  <td>{plataforma.seccion}</td>
                  <td>
                    <span className={`sv-admin-chip ${colorEstado(plataforma.estado)}`}>{plataforma.estado}</span>
                    <div className="mt-1 flex items-center gap-1">
                      <select
                        value={plataforma.estado}
                        disabled={Boolean(estadoGuardando[plataforma.id])}
                        onChange={(e) => cambiarEstadoFila(plataforma, e.target.value)}
                        className="sv-input py-1 text-xs disabled:opacity-60"
                        aria-label={`Cambiar estado de ${plataforma.nombre}`}
                      >
                        {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                      </select>
                      {estadoGuardando[plataforma.id] && (
                        <i className="fas fa-spinner fa-spin text-[#94a3b8] text-xs" title="Guardando…"></i>
                      )}
                    </div>
                  </td>
                  <td>
                    <label className="sv-admin-mini cursor-pointer">
                      <i className="fas fa-image"></i>Subir
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => subirImagen(plataforma, e.target.files?.[0])} />
                    </label>
                  </td>
                  <td>
                    <div className="sv-admin-actions">
                      <button type="button" onClick={() => abrirEditar(plataforma)} className="sv-admin-mini"><i className="fas fa-pen"></i>Editar</button>
                      <button type="button" onClick={() => abrirEliminar(plataforma)} className="sv-admin-mini peligro"><i className="fas fa-trash"></i>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {plataformas.length === 0 && (
                <tr><td colSpan={5} className="text-center text-[#64748b]">No hay plataformas registradas.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        abierto={Boolean(confirmacion)}
        titulo="Eliminar plataforma"
        mensaje={confirmacion ? `¿Eliminar la plataforma "${confirmacion.nombre}"? Esta acción no se puede deshacer.` : ''}
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
