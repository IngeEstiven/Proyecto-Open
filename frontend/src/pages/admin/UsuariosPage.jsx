import { useEffect, useState } from 'react';

import ConfirmModal from '../../components/admin/ConfirmModal.jsx';
import PasswordModal from '../../components/admin/PasswordModal.jsx';
import { useToast } from '../../components/admin/Toast.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import useTituloPagina from '../../hooks/useTituloPagina.js';
import {
  activarUsuario,
  cambiarPasswordUsuario,
  cambiarRolUsuario,
  crearUsuario,
  desactivarUsuario,
  editarUsuario,
  eliminarUsuarioPermanente,
  listarUsuarios
} from '../../services/usuariosService.js';

const FORM_VACIO = { id: null, nombre: '', apellido: '', email: '', username: '', password: '', rol: 'usuario' };

const CONFIRMACIONES = {
  desactivar: {
    titulo: 'Desactivar usuario',
    textoConfirmar: 'Desactivar',
    variante: 'aviso',
    accion: (id) => desactivarUsuario(id),
    exito: 'Usuario desactivado correctamente'
  },
  activar: {
    titulo: 'Activar usuario',
    textoConfirmar: 'Activar',
    variante: 'normal',
    accion: (id) => activarUsuario(id),
    exito: 'Usuario activado correctamente'
  },
  eliminar: {
    titulo: 'Eliminar usuario',
    textoConfirmar: 'Eliminar',
    variante: 'peligro',
    accion: (id) => eliminarUsuarioPermanente(id),
    exito: 'Usuario eliminado permanentemente'
  }
};

export default function UsuariosPage() {
  useTituloPagina('Usuarios · OpenLeaf');
  const { usuario: sesion } = useAuth();
  const toast = useToast();

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState(FORM_VACIO);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardandoRolId, setGuardandoRolId] = useState(null);

  const [confirmacion, setConfirmacion] = useState(null);
  const [procesandoConfirmacion, setProcesandoConfirmacion] = useState(false);
  const [errorConfirmacion, setErrorConfirmacion] = useState('');
  const [claveUsuario, setClaveUsuario] = useState(null);

  const cargar = () => {
    setCargando(true);
    listarUsuarios()
      .then(setUsuarios)
      .catch((err) => toast.error(err.message))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const esPropio = (usuario) => String(usuario.id) === String(sesion?.id);
  const estaActivo = (usuario) => usuario.estado === 'activo';

  const reemplazarUsuario = (usuario) =>
    setUsuarios((previos) => previos.map((item) => (item.id === usuario.id ? usuario : item)));

  const cambiar = (evento) => {
    const { name, value } = evento.target;
    setForm((previo) => ({ ...previo, [name]: value }));
  };

  const abrirCrear = () => {
    setForm(FORM_VACIO);
    setMostrarForm(true);
  };

  const abrirEditar = (usuario) => {
    setForm({
      id: usuario.id,
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      email: usuario.email || '',
      username: usuario.username || '',
      password: '',
      rol: usuario.rol?.nombre || 'usuario'
    });
    setMostrarForm(true);
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    try {
      if (form.id) {
        const respuesta = await editarUsuario(form.id, {
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          username: form.username
        });
        reemplazarUsuario(respuesta.usuario);
        toast.exito('Usuario actualizado correctamente');
      } else {
        const respuesta = await crearUsuario({
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          username: form.username,
          password: form.password,
          rol: form.rol
        });
        setUsuarios((previos) => [respuesta.usuario, ...previos]);
        toast.exito('Usuario creado correctamente');
      }
      setMostrarForm(false);
      setForm(FORM_VACIO);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const cambiarRol = async (usuario, rol) => {
    setGuardandoRolId(usuario.id);
    try {
      const respuesta = await cambiarRolUsuario(usuario.id, rol);
      reemplazarUsuario(respuesta.usuario);
      toast.exito('Rol actualizado. El nuevo rol se aplicará cuando esta persona vuelva a iniciar sesión');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGuardandoRolId(null);
    }
  };

  const abrirConfirmacion = (tipo, usuario) => {
    setErrorConfirmacion('');
    setConfirmacion({ tipo, usuario });
  };

  const cancelarConfirmacion = () => {
    if (procesandoConfirmacion) return;
    setConfirmacion(null);
    setErrorConfirmacion('');
  };

  const confirmarAccion = async () => {
    if (!confirmacion) return;
    const config = CONFIRMACIONES[confirmacion.tipo];
    setErrorConfirmacion('');
    setProcesandoConfirmacion(true);
    try {
      const respuesta = await config.accion(confirmacion.usuario.id);
      if (confirmacion.tipo === 'eliminar') {
        setUsuarios((previos) => previos.filter((item) => item.id !== confirmacion.usuario.id));
      } else {
        reemplazarUsuario(respuesta.usuario);
      }
      toast.exito(config.exito);
      setConfirmacion(null);
    } catch (err) {
      setErrorConfirmacion(err.message);
    } finally {
      setProcesandoConfirmacion(false);
    }
  };

  const guardarClave = async (nueva) => {
    await cambiarPasswordUsuario(claveUsuario.id, nueva);
    setClaveUsuario(null);
    toast.exito('Contraseña actualizada correctamente');
  };

  const colorEstado = (estado) =>
    estado === 'activo' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300';

  const mensajeConfirmacion = (confirmacionActual) => {
    const { tipo, usuario } = confirmacionActual;
    if (tipo === 'eliminar') {
      return `¿Eliminar permanentemente a @${usuario.username}? Esta acción no se puede deshacer.`;
    }
    if (tipo === 'activar') {
      return `¿Activar al usuario @${usuario.username}? Podrá volver a iniciar sesión.`;
    }
    return `¿Desactivar al usuario @${usuario.username}? Perderá el acceso en un máximo de 30 segundos y verá un aviso de cuenta desactivada. No podrá iniciar sesión hasta que lo actives de nuevo.`;
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <h2 className="sv-section-title text-lg m-0"><i className="fas fa-users mr-2 sv-text-gradient"></i>Usuarios</h2>
        <button type="button" onClick={abrirCrear} className="btn-sv-primary">
          <i className="fas fa-plus"></i>Nuevo usuario
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={enviar} className="sv-section">
          <h3 className="text-white font-bold mb-4">{form.id ? 'Editar usuario' : 'Crear usuario'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">Nombre</label>
              <input name="nombre" value={form.nombre} onChange={cambiar} className="sv-input" required />
            </div>
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">Apellido</label>
              <input name="apellido" value={form.apellido} onChange={cambiar} className="sv-input" required />
            </div>
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">Usuario</label>
              <input name="username" value={form.username} onChange={cambiar} className="sv-input" required />
            </div>
            <div>
              <label className="text-[#94a3b8] text-xs block mb-1">Correo</label>
              <input name="email" type="email" value={form.email} onChange={cambiar} className="sv-input" required />
            </div>
            {!form.id && (
              <div>
                <label className="text-[#94a3b8] text-xs block mb-1">Contraseña</label>
                <input name="password" type="password" value={form.password} onChange={cambiar} className="sv-input" required minLength={8} />
              </div>
            )}
            {!form.id && (
              <div>
                <label className="text-[#94a3b8] text-xs block mb-1">Rol</label>
                <select name="rol" value={form.rol} onChange={cambiar} className="sv-input">
                  <option value="usuario">usuario</option>
                  <option value="administrador">administrador</option>
                </select>
              </div>
            )}
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
          <p className="text-[#94a3b8] text-sm m-0">Cargando usuarios…</p>
        ) : (
          <table className="sv-admin-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    <div className="font-semibold text-white">{usuario.nombre} {usuario.apellido}</div>
                    <div className="text-[#64748b] text-xs">@{usuario.username}</div>
                  </td>
                  <td>{usuario.email}</td>
                  <td>
                    <select
                      value={usuario.rol?.nombre || 'usuario'}
                      onChange={(evento) => cambiarRol(usuario, evento.target.value)}
                      className="sv-input py-1 text-xs"
                      disabled={esPropio(usuario) || guardandoRolId === usuario.id}
                      title={esPropio(usuario) ? 'No puedes cambiarte el rol a ti mismo' : undefined}
                    >
                      <option value="usuario">usuario</option>
                      <option value="administrador">administrador</option>
                    </select>
                  </td>
                  <td>
                    <span className={`sv-admin-chip ${colorEstado(usuario.estado)}`}>{usuario.estado}</span>
                  </td>
                  <td>
                    <div className="sv-admin-actions">
                      <button type="button" onClick={() => abrirEditar(usuario)} className="sv-admin-mini"><i className="fas fa-pen"></i>Editar</button>
                      <button type="button" onClick={() => setClaveUsuario(usuario)} className="sv-admin-mini"><i className="fas fa-key"></i>Clave</button>
                      {estaActivo(usuario) ? (
                        <button
                          type="button"
                          onClick={() => abrirConfirmacion('desactivar', usuario)}
                          disabled={esPropio(usuario)}
                          title={esPropio(usuario) ? 'No puedes desactivar tu propia cuenta' : undefined}
                          className="sv-admin-mini peligro disabled:opacity-50"
                        >
                          <i className="fas fa-user-slash"></i>Desactivar
                        </button>
                      ) : (
                        <button type="button" onClick={() => abrirConfirmacion('activar', usuario)} className="sv-admin-mini"><i className="fas fa-user-check"></i>Activar</button>
                      )}
                      <button
                        type="button"
                        onClick={() => abrirConfirmacion('eliminar', usuario)}
                        disabled={esPropio(usuario)}
                        title={esPropio(usuario) ? 'No puedes eliminar tu propia cuenta' : undefined}
                        className="sv-admin-mini peligro disabled:opacity-50"
                      >
                        <i className="fas fa-trash"></i>Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr><td colSpan={5} className="text-center text-[#64748b]">No hay usuarios registrados.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        abierto={Boolean(confirmacion)}
        titulo={confirmacion ? CONFIRMACIONES[confirmacion.tipo].titulo : ''}
        mensaje={confirmacion ? mensajeConfirmacion(confirmacion) : ''}
        textoConfirmar={confirmacion ? CONFIRMACIONES[confirmacion.tipo].textoConfirmar : 'Confirmar'}
        variante={confirmacion ? CONFIRMACIONES[confirmacion.tipo].variante : 'normal'}
        cargando={procesandoConfirmacion}
        error={errorConfirmacion}
        onConfirmar={confirmarAccion}
        onCancelar={cancelarConfirmacion}
      />

      <PasswordModal
        abierto={Boolean(claveUsuario)}
        usuario={claveUsuario}
        onCancelar={() => setClaveUsuario(null)}
        onGuardar={guardarClave}
      />
    </div>
  );
}
