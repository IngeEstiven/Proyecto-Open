import { useRef, useState } from 'react';

import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import useTituloPagina from '../../hooks/useTituloPagina.js';
import {
  actualizarAvatar,
  actualizarPerfil,
  cambiarPassword,
  confirmarCambioCorreo,
  solicitarCambioCorreo
} from '../../services/authService.js';
import { PAISES } from '../../services/paises.js';

const INICIALES = (usuario) =>
  `${usuario?.nombre?.[0] || ''}${usuario?.apellido?.[0] || ''}`.toUpperCase() || '?';

export default function PerfilPage() {
  useTituloPagina('Mi perfil · OpenLeaf');

  const { usuario, guardarUsuario } = useAuth();
  const { tema, setTema, temas } = useTheme();
  const archivoRef = useRef(null);

  const [datos, setDatos] = useState({
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    username: usuario?.username || '',
    pais: usuario?.pais || PAISES[0],
    fecha_nacimiento: (usuario?.fecha_nacimiento || '').slice(0, 10),
    acepta_novedades: Boolean(usuario?.acepta_novedades)
  });
  const [estadoDatos, setEstadoDatos] = useState({ tipo: '', texto: '' });
  const [guardandoDatos, setGuardandoDatos] = useState(false);

  const [vistaAvatar, setVistaAvatar] = useState(null);
  const [estadoAvatar, setEstadoAvatar] = useState({ tipo: '', texto: '' });
  const [subiendoAvatar, setSubiendoAvatar] = useState(false);

  // Cambio de correo en dos pasos: 0 = cerrado, 1 = solicitar, 2 = confirmar.
  const [pasoCorreo, setPasoCorreo] = useState(0);
  const [formCorreo, setFormCorreo] = useState({ newEmail: '', password: '', code: '' });
  const [estadoCorreo, setEstadoCorreo] = useState({ tipo: '', texto: '' });
  const [guardandoCorreo, setGuardandoCorreo] = useState(false);

  const [claves, setClaves] = useState({ actual: '', nueva: '', confirmar: '' });
  const [estadoClaves, setEstadoClaves] = useState({ tipo: '', texto: '' });
  const [guardandoClaves, setGuardandoClaves] = useState(false);

  const cambiar = (evento) => {
    const { name, value, type, checked } = evento.target;
    setDatos((previo) => ({ ...previo, [name]: type === 'checkbox' ? checked : value }));
  };

  const cambiarClave = (evento) => {
    const { name, value } = evento.target;
    setClaves((previo) => ({ ...previo, [name]: value }));
  };

  const cambiarCorreoForm = (evento) => {
    const { name, value } = evento.target;
    setFormCorreo((previo) => ({ ...previo, [name]: value }));
  };

  const enviarDatos = async (evento) => {
    evento.preventDefault();
    setEstadoDatos({ tipo: '', texto: '' });
    setGuardandoDatos(true);
    try {
      const respuesta = await actualizarPerfil({
        nombre: datos.nombre,
        apellido: datos.apellido,
        username: datos.username,
        pais: datos.pais,
        fecha_nacimiento: datos.fecha_nacimiento,
        acepta_novedades: datos.acepta_novedades
      });
      guardarUsuario(respuesta.user);
      setEstadoDatos({ tipo: 'ok', texto: 'Perfil actualizado correctamente' });
    } catch (error) {
      setEstadoDatos({ tipo: 'error', texto: error.message });
    } finally {
      setGuardandoDatos(false);
    }
  };

  const elegirAvatar = (evento) => {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;
    setVistaAvatar(URL.createObjectURL(archivo));
    setEstadoAvatar({ tipo: '', texto: '' });
  };

  const subirAvatar = async () => {
    const archivo = archivoRef.current?.files?.[0];
    if (!archivo) {
      setEstadoAvatar({ tipo: 'error', texto: 'Selecciona una imagen primero' });
      return;
    }
    setEstadoAvatar({ tipo: '', texto: '' });
    setSubiendoAvatar(true);
    try {
      const respuesta = await actualizarAvatar(archivo);
      guardarUsuario(respuesta.user);
      setVistaAvatar(null);
      if (archivoRef.current) archivoRef.current.value = '';
      setEstadoAvatar({ tipo: 'ok', texto: 'Avatar actualizado correctamente' });
    } catch (error) {
      setEstadoAvatar({ tipo: 'error', texto: error.message });
    } finally {
      setSubiendoAvatar(false);
    }
  };

  const abrirCambioCorreo = () => {
    setPasoCorreo(1);
    setFormCorreo({ newEmail: '', password: '', code: '' });
    setEstadoCorreo({ tipo: '', texto: '' });
  };

  const enviarSolicitudCorreo = async (evento) => {
    evento.preventDefault();
    setEstadoCorreo({ tipo: '', texto: '' });
    setGuardandoCorreo(true);
    try {
      await solicitarCambioCorreo(formCorreo.newEmail, formCorreo.password);
      setPasoCorreo(2);
      setEstadoCorreo({ tipo: 'ok', texto: 'Te enviamos un código al nuevo correo. Ingrésalo para confirmar.' });
    } catch (error) {
      setEstadoCorreo({ tipo: 'error', texto: error.message });
    } finally {
      setGuardandoCorreo(false);
    }
  };

  const enviarConfirmacionCorreo = async (evento) => {
    evento.preventDefault();
    setEstadoCorreo({ tipo: '', texto: '' });
    setGuardandoCorreo(true);
    try {
      const respuesta = await confirmarCambioCorreo(formCorreo.code);
      guardarUsuario(respuesta.user);
      setPasoCorreo(0);
      setFormCorreo({ newEmail: '', password: '', code: '' });
      setEstadoCorreo({ tipo: 'ok', texto: 'Correo actualizado correctamente' });
    } catch (error) {
      setEstadoCorreo({ tipo: 'error', texto: error.message });
    } finally {
      setGuardandoCorreo(false);
    }
  };

  const enviarClaves = async (evento) => {
    evento.preventDefault();
    setEstadoClaves({ tipo: '', texto: '' });

    if (claves.nueva.length < 8) {
      setEstadoClaves({ tipo: 'error', texto: 'La nueva contraseña debe tener al menos 8 caracteres' });
      return;
    }
    if (claves.nueva !== claves.confirmar) {
      setEstadoClaves({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden' });
      return;
    }

    setGuardandoClaves(true);
    try {
      await cambiarPassword(claves.actual, claves.nueva);
      setClaves({ actual: '', nueva: '', confirmar: '' });
      setEstadoClaves({ tipo: 'ok', texto: 'Contraseña actualizada correctamente' });
    } catch (error) {
      setEstadoClaves({ tipo: 'error', texto: error.message });
    } finally {
      setGuardandoClaves(false);
    }
  };

  const claseMensaje = (tipo) =>
    `text-sm m-0 mt-3 ${tipo === 'ok' ? 'text-emerald-400' : tipo === 'error' ? 'text-rose-400' : 'text-transparent'}`;

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 min-h-[50vh]">
      <div
        className="pb-4 mb-6 border-b"
        style={{ borderColor: 'rgba(var(--sv-accent-rgb), .2)' }}
      >
        <h1 className="sv-section-title mb-1">
          <i className="fas fa-user-circle mr-2 sv-text-gradient"></i>Mi perfil
        </h1>
        <p className="text-[#94a3b8] text-sm m-0">Consulta y actualiza tus datos personales</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="sv-section lg:col-span-1 flex flex-col items-center text-center">
          <div
            className="w-32 h-32 rounded-full overflow-hidden border-2 flex items-center justify-center mb-4"
            style={{
              borderColor: 'rgba(var(--sv-accent-rgb), .4)',
              background: 'rgba(var(--sv-accent-rgb), .1)'
            }}
          >
            {vistaAvatar || usuario?.avatar_url ? (
              <img
                src={vistaAvatar || usuario.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-black sv-accent-soft">{INICIALES(usuario)}</span>
            )}
          </div>
          <p className="font-bold text-white m-0">{usuario?.nombre} {usuario?.apellido}</p>
          <p className="text-[#94a3b8] text-sm mb-1">@{usuario?.username}</p>
          <span
            className="sv-badge sv-accent-soft border mb-4"
            style={{
              background: 'rgba(var(--sv-accent-rgb), .15)',
              borderColor: 'rgba(var(--sv-accent-rgb), .3)'
            }}
          >
            {usuario?.rol || 'usuario'}
          </span>

          <input
            ref={archivoRef}
            type="file"
            accept="image/*"
            onChange={elegirAvatar}
            className="sv-input mb-3 text-xs"
          />
          <button
            type="button"
            onClick={subirAvatar}
            disabled={subiendoAvatar}
            className="btn-sv-secondary w-full justify-center disabled:opacity-60"
          >
            <i className="fas fa-camera"></i>{subiendoAvatar ? 'Subiendo…' : 'Actualizar foto'}
          </button>
          {estadoAvatar.texto && <p className={claseMensaje(estadoAvatar.tipo)}>{estadoAvatar.texto}</p>}
        </section>

        <section className="sv-section lg:col-span-2">
          <h2 className="sv-section-title text-lg mb-4">
            <i className="fas fa-id-card mr-2 sv-text-gradient"></i>Datos personales
          </h2>
          <form onSubmit={enviarDatos}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#94a3b8] text-xs block mb-1">Nombre</label>
                <input name="nombre" type="text" value={datos.nombre} onChange={cambiar} className="sv-input" required />
              </div>
              <div>
                <label className="text-[#94a3b8] text-xs block mb-1">Apellido</label>
                <input name="apellido" type="text" value={datos.apellido} onChange={cambiar} className="sv-input" required />
              </div>
              <div>
                <label className="text-[#94a3b8] text-xs block mb-1">Nombre de usuario</label>
                <input name="username" type="text" value={datos.username} onChange={cambiar} className="sv-input" required />
              </div>
              <div>
                <label className="text-[#94a3b8] text-xs block mb-1">País</label>
                <select name="pais" value={datos.pais} onChange={cambiar} className="sv-input sv-select" required>
                  {PAISES.map((pais) => (
                    <option key={pais} value={pais}>{pais}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[#94a3b8] text-xs block mb-1">Fecha de nacimiento</label>
                <input name="fecha_nacimiento" type="date" value={datos.fecha_nacimiento} onChange={cambiar} className="sv-input" required />
              </div>
              <label className="sv-check self-end pb-2">
                <input name="acepta_novedades" type="checkbox" checked={datos.acepta_novedades} onChange={cambiar} />
                Quiero recibir novedades
              </label>
            </div>
            <div className="flex items-center gap-4 mt-5">
              <button type="submit" disabled={guardandoDatos} className="btn-sv-primary disabled:opacity-60">
                <i className="fas fa-save"></i>{guardandoDatos ? 'Guardando…' : 'Guardar cambios'}
              </button>
              {estadoDatos.texto && <p className={claseMensaje(estadoDatos.tipo)}>{estadoDatos.texto}</p>}
            </div>
          </form>
        </section>

        <section className="sv-section lg:col-span-3">
          <h2 className="sv-section-title text-lg mb-4">
            <i className="fas fa-palette mr-2 sv-text-gradient"></i>Apariencia
          </h2>
          <p className="text-[#94a3b8] text-sm mb-4">
            Elige el color de acento de OpenLeaf. El cambio se aplica al instante y se recuerda en
            este navegador.
          </p>
          <div className="sv-theme-grid" role="radiogroup" aria-label="Tema de color">
            {temas.map((opcion) => {
              const activo = tema === opcion.valor;
              return (
                <button
                  key={opcion.valor}
                  type="button"
                  role="radio"
                  aria-checked={activo}
                  onClick={() => setTema(opcion.valor)}
                  className={`sv-theme-card${activo ? ' is-active' : ''}`}
                >
                  <span
                    className="sv-theme-swatch"
                    style={{ background: opcion.muestra }}
                    aria-hidden="true"
                  >
                    {activo && <i className="fas fa-check"></i>}
                  </span>
                  <span className="sv-theme-info">
                    <span className="sv-theme-name">{opcion.nombre}</span>
                    <span className="sv-theme-desc">{opcion.descripcion}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="sv-section lg:col-span-3">
          <h2 className="sv-section-title text-lg mb-4">
            <i className="fas fa-envelope mr-2 sv-text-gradient"></i>Correo electrónico
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div>
              <p className="text-[#94a3b8] text-xs m-0">Correo actual</p>
              <p className="text-slate-100 font-bold m-0">{usuario?.email}</p>
            </div>
            {pasoCorreo === 0 && (
              <button type="button" onClick={abrirCambioCorreo} className="btn-sv-secondary sm:ml-auto justify-center">
                <i className="fas fa-pen"></i> Cambiar correo
              </button>
            )}
          </div>

          {pasoCorreo === 1 && (
            <form onSubmit={enviarSolicitudCorreo} className="mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#94a3b8] text-xs block mb-1">Nuevo correo</label>
                  <input name="newEmail" type="email" value={formCorreo.newEmail} onChange={cambiarCorreoForm} className="sv-input" required />
                </div>
                <div>
                  <label className="text-[#94a3b8] text-xs block mb-1">Contraseña actual</label>
                  <input name="password" type="password" value={formCorreo.password} onChange={cambiarCorreoForm} className="sv-input" required />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-5">
                <button type="submit" disabled={guardandoCorreo} className="btn-sv-primary disabled:opacity-60">
                  <i className="fas fa-paper-plane"></i>{guardandoCorreo ? 'Enviando…' : 'Enviar código'}
                </button>
                <button type="button" onClick={() => setPasoCorreo(0)} className="btn-sv-reset sm:w-auto sm:px-5">Cancelar</button>
              </div>
            </form>
          )}

          {pasoCorreo === 2 && (
            <form onSubmit={enviarConfirmacionCorreo} className="mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#94a3b8] text-xs block mb-1">Nuevo correo</label>
                  <input type="email" value={formCorreo.newEmail} className="sv-input opacity-60" disabled />
                </div>
                <div>
                  <label className="text-[#94a3b8] text-xs block mb-1">Código de confirmación</label>
                  <input name="code" type="text" maxLength="6" value={formCorreo.code} onChange={cambiarCorreoForm} className="sv-input" required />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-5">
                <button type="submit" disabled={guardandoCorreo} className="btn-sv-primary disabled:opacity-60">
                  <i className="fas fa-circle-check"></i>{guardandoCorreo ? 'Confirmando…' : 'Confirmar cambio'}
                </button>
                <button type="button" onClick={() => setPasoCorreo(1)} className="btn-sv-reset sm:w-auto sm:px-5">
                  <i className="fas fa-arrow-left"></i> Volver
                </button>
              </div>
            </form>
          )}

          {estadoCorreo.texto && <p className={claseMensaje(estadoCorreo.tipo)}>{estadoCorreo.texto}</p>}
        </section>

        <section className="sv-section lg:col-span-3">
          <h2 className="sv-section-title text-lg mb-4">
            <i className="fas fa-lock mr-2 sv-text-gradient"></i>Cambiar contraseña
          </h2>
          <form onSubmit={enviarClaves}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[#94a3b8] text-xs block mb-1">Contraseña actual</label>
                <input name="actual" type="password" value={claves.actual} onChange={cambiarClave} className="sv-input" required />
              </div>
              <div>
                <label className="text-[#94a3b8] text-xs block mb-1">Nueva contraseña</label>
                <input name="nueva" type="password" value={claves.nueva} onChange={cambiarClave} className="sv-input" required />
              </div>
              <div>
                <label className="text-[#94a3b8] text-xs block mb-1">Confirmar nueva contraseña</label>
                <input name="confirmar" type="password" value={claves.confirmar} onChange={cambiarClave} className="sv-input" required />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-5">
              <button type="submit" disabled={guardandoClaves} className="btn-sv-primary disabled:opacity-60">
                <i className="fas fa-key"></i>{guardandoClaves ? 'Actualizando…' : 'Actualizar contraseña'}
              </button>
              {estadoClaves.texto && <p className={claseMensaje(estadoClaves.tipo)}>{estadoClaves.texto}</p>}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}