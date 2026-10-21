import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import ModalBase from './ModalBase.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { DIRECCION_CONTACTO, EMAIL_CONTACTO, HORARIO_CONTACTO } from '../../services/informacionSitio.js';
import { PLATAFORMAS_ESTATICAS } from '../../services/plataformasEstaticas.js';
import { PAISES } from '../../services/paises.js';
import {
  EDAD_MINIMA,
  esMayorDeEdad,
  olvidarPassword,
  resendVerification,
  restablecerPassword
} from '../../services/authService.js';

// Cifras del catálogo, no inventadas: salen del contenido estático real.
const NUMERO_CATEGORIAS = new Set(PLATAFORMAS_ESTATICAS.map((p) => p.seccion)).size;

// Cierra el modal quitando el parámetro ?auth= de la URL (única fuente de verdad)
// y cambia de vista conservando el resto de parámetros. Al iniciar sesión navega
// a la ruta desde la que se abrió o a /inicio.
function useCierreModal() {
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const [parametros, setParametros] = useSearchParams();

  const cerrar = () => {
    const siguiente = new URLSearchParams(parametros);
    siguiente.delete('auth');
    setParametros(siguiente, { replace: true });
  };

  const cambiarA = (vista) => (evento) => {
    evento?.preventDefault?.();
    const siguiente = new URLSearchParams(parametros);
    siguiente.set('auth', vista);
    setParametros(siguiente, { replace: true });
  };

  const irAInicio = () => navegar(ubicacion.state?.desde || '/inicio', { replace: true });

  return { cerrar, cambiarA, irAInicio };
}

// Entrada de contraseña con botón para mostrar/ocultar el texto.
export function CampoClave({ id, value, onChange, placeholder = 'Tu contraseña', minLength = 6, autocomplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="sv-password-wrap">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        className="sv-input"
        placeholder={placeholder}
        minLength={minLength}
        value={value}
        onChange={onChange}
        autoComplete={autocomplete}
        required
      />
      <button
        type="button"
        className="sv-eye"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        tabIndex={-1}
      >
        <i className={`fas ${visible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
      </button>
    </div>
  );
}

export function ModalLogin({ abierto = false }) {
  const navegar = useNavigate();
  const { iniciarSesion } = useAuth();
  const { cerrar, cambiarA, irAInicio } = useCierreModal();
  const [parametros, setParametros] = useSearchParams();

  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [recordar, setRecordar] = useState(true);
  const [error, setError] = useState('');
  const [avisoCuenta, setAvisoCuenta] = useState('');
  const [enviando, setEnviando] = useState(false);

  // ?aviso=sesion lo agrega axiosClient cuando la sesión caducó o dejó de ser válida.
  const avisoSesion = parametros.get('aviso') === 'sesion';

  const quitarAviso = () => {
    if (!parametros.get('aviso')) return;
    const siguiente = new URLSearchParams(parametros);
    siguiente.delete('aviso');
    setParametros(siguiente, { replace: true });
  };

  const cerrarLogin = () => {
    quitarAviso();
    cerrar();
  };

  const alEnviar = async (evento) => {
    evento.preventDefault();
    setError('');
    setAvisoCuenta('');
    quitarAviso();
    setEnviando(true);
    try {
      await iniciarSesion(usuario, clave, recordar);
      irAInicio();
    } catch (err) {
      if (err.needsVerificacion) {
        navegar('/?auth=verificar', { state: { correo: err.email } });
      } else if (err.code === 'account_inactive') {
        // Aviso ámbar distinto del error rojo de credenciales.
        setAvisoCuenta(err.message);
      } else {
        setError(err.message);
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ModalBase abierto={abierto} onCerrar={cerrarLogin} ancho="440px">
      <div className="text-center mb-5">
        <span className="sv-modal-badge"><i className="fas fa-play-circle mr-1"></i> OpenLeaf</span>
        <h2 className="sv-modal-title">Bienvenido de nuevo</h2>
        <p className="sv-modal-sub">Inicia sesión para acceder a todo tu entretenimiento</p>
      </div>
      {avisoSesion && (
        <p className="flex items-start gap-2 text-sm rounded-lg px-3 py-2 mb-4 m-0 bg-[rgba(99,102,241,.12)] border border-[rgba(99,102,241,.3)] text-indigo-200">
          <i className="fas fa-clock-rotate-left mt-0.5"></i>
          <span>Tu sesión expiró o ya no es válida. Inicia sesión de nuevo.</span>
        </p>
      )}
      <form onSubmit={alEnviar} className="flex flex-col gap-4">
        <div>
          <label className="sv-label" htmlFor="login-usuario">
            <i className="fas fa-user mr-1"></i> Correo o usuario <span className="text-pink-400 text-[0.65rem]">*</span>
          </label>
          <input
            id="login-usuario"
            type="text"
            className="sv-input"
            placeholder="correo@ejemplo.com o tuusuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="sv-label" htmlFor="login-clave">
            <i className="fas fa-key mr-1"></i> Contraseña <span className="text-pink-400 text-[0.65rem]">*</span>
          </label>
          <CampoClave id="login-clave" value={clave} onChange={(e) => setClave(e.target.value)} autocomplete="current-password" />
        </div>
        <label className="sv-check">
          <input type="checkbox" checked={recordar} onChange={(e) => setRecordar(e.target.checked)} /> Recordar sesión
        </label>
        {avisoCuenta && (
          <p className="flex items-start gap-2 text-sm rounded-lg px-3 py-2 m-0 bg-[rgba(245,158,11,.12)] border border-[rgba(245,158,11,.35)] text-amber-300">
            <i className="fas fa-triangle-exclamation mt-0.5"></i>
            <span>{avisoCuenta}</span>
          </p>
        )}
        {error && <p className="text-pink-400 text-center text-sm m-0">{error}</p>}
        <button className="btn-sv-submit" type="submit" disabled={enviando}>
          <i className="fas fa-right-to-bracket"></i> {enviando ? 'Ingresando…' : 'Iniciar sesión'}
        </button>
        <button className="btn-sv-reset" type="button" onClick={cambiarA('recuperar')}>
          <i className="fas fa-lock"></i> Olvidé mi contraseña
        </button>
      </form>
      <div className="flex items-center gap-3 my-4">
        <span className="flex-1 h-px bg-[rgba(102,126,234,.2)]"></span>
        <p className="text-[0.74rem] text-[#94a3b8] m-0 whitespace-nowrap">¿No tienes cuenta?</p>
        <span className="flex-1 h-px bg-[rgba(102,126,234,.2)]"></span>
      </div>
      <a href="?auth=register" className="sv-register-link" onClick={cambiarA('register')}>
        <i className="fas fa-user-plus"></i> Crear cuenta en OpenLeaf
      </a>
    </ModalBase>
  );
}

export function ModalRegistro({ abierto = false }) {
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const { registrarse } = useAuth();
  const { cerrar, cambiarA } = useCierreModal();

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    pais: PAISES[0],
    fechaNacimiento: '',
    username: '',
    password: '',
    confirmar: '',
    terminos: false,
    privacidad: false,
    novedades: false
  });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cambiar = (campo) => (evento) => {
    const valor = evento.target.type === 'checkbox' ? evento.target.checked : evento.target.value;
    setForm((f) => ({ ...f, [campo]: valor }));
  };

  const alEnviar = async (evento) => {
    evento.preventDefault();
    setError('');
    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!esMayorDeEdad(form.fechaNacimiento)) {
      setError(`Debes ser mayor de ${EDAD_MINIMA} años para registrarte`);
      return;
    }
    if (!form.terminos || !form.privacidad) {
      setError('Debes aceptar los términos y la política de privacidad');
      return;
    }
    setEnviando(true);
    try {
      await registrarse({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        username: form.username,
        password: form.password,
        pais: form.pais,
        fecha_nacimiento: form.fechaNacimiento,
        acepta_terminos: true,
        acepta_novedades: form.novedades
      });
      navegar('/?auth=verificar', { state: { correo: form.email, desde: ubicacion.state?.desde } });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ModalBase abierto={abierto} onCerrar={cerrar}>
      <div className="text-center mb-5">
        <span className="sv-modal-badge"><i className="fas fa-user-plus mr-1"></i> Nuevo usuario</span>
        <h2 className="sv-modal-title">Crea tu cuenta</h2>
        <p className="sv-modal-sub">Únete a OpenLeaf y accede a todo el entretenimiento</p>
      </div>
      <form onSubmit={alEnviar}>
        <fieldset className="sv-fieldset mb-4">
          <legend className="sv-legend"><i className="fas fa-id-card"></i> Datos personales</legend>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="sv-label">Nombre <span className="text-pink-400 text-[0.65rem]">*</span></label>
              <input type="text" className="sv-input" placeholder="Juan" value={form.nombre} onChange={cambiar('nombre')} required />
            </div>
            <div>
              <label className="sv-label">Apellido <span className="text-pink-400 text-[0.65rem]">*</span></label>
              <input type="text" className="sv-input" placeholder="Castro" value={form.apellido} onChange={cambiar('apellido')} required />
            </div>
            <div className="col-span-2">
              <label className="sv-label">Correo <span className="text-pink-400 text-[0.65rem]">*</span></label>
              <input type="email" className="sv-input" placeholder="correo@ejemplo.com" value={form.email} onChange={cambiar('email')} autoComplete="email" required />
            </div>
            <div>
              <label className="sv-label">País <span className="text-pink-400 text-[0.65rem]">*</span></label>
              <select className="sv-input" value={form.pais} onChange={cambiar('pais')} required>
                {PAISES.map((pais) => (
                  <option key={pais} value={pais}>{pais}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="sv-label">Fecha de nacimiento <span className="text-pink-400 text-[0.65rem]">*</span></label>
              <input type="date" className="sv-input" value={form.fechaNacimiento} onChange={cambiar('fechaNacimiento')} required />
            </div>
          </div>
        </fieldset>
        <fieldset className="sv-fieldset mb-4">
          <legend className="sv-legend"><i className="fas fa-lock"></i> Seguridad</legend>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="sv-label">Usuario <span className="text-pink-400 text-[0.65rem]">*</span></label>
              <input type="text" className="sv-input" placeholder="tuusuario99" value={form.username} onChange={cambiar('username')} required />
            </div>
            <div>
              <label className="sv-label">Contraseña <span className="text-pink-400 text-[0.65rem]">*</span></label>
              <CampoClave id="reg-clave" value={form.password} onChange={cambiar('password')} placeholder="Mín. 8 caracteres" minLength={8} autocomplete="new-password" />
            </div>
            <div className="col-span-2">
              <label className="sv-label">Confirmar contraseña <span className="text-pink-400 text-[0.65rem]">*</span></label>
              <CampoClave id="reg-confirmar" value={form.confirmar} onChange={cambiar('confirmar')} placeholder="Repite tu contraseña" minLength={8} autocomplete="new-password" />
            </div>
          </div>
        </fieldset>
        <fieldset className="sv-fieldset mb-4">
          <legend className="sv-legend"><i className="fas fa-circle-check"></i> Confirmación</legend>
          <div className="flex flex-col gap-2 mt-3">
            <label className="sv-check w-full">
              <input type="checkbox" checked={form.terminos} onChange={cambiar('terminos')} required /> Acepto los <Link to="/terminos" className="text-indigo-400 hover:underline">Términos de Servicio</Link>
            </label>
            <label className="sv-check w-full">
              <input type="checkbox" checked={form.privacidad} onChange={cambiar('privacidad')} required /> He leído la <Link to="/privacidad" className="text-indigo-400 hover:underline">Política de Privacidad</Link>
            </label>
            <label className="sv-check w-full">
              <input type="checkbox" checked={form.novedades} onChange={cambiar('novedades')} /> Quiero recibir novedades
            </label>
          </div>
        </fieldset>
        {error && <p className="text-pink-400 text-center text-sm mb-3">{error}</p>}
        <button className="btn-sv-submit mb-2" type="submit" disabled={enviando}>
          <i className="fas fa-rocket"></i> {enviando ? 'Creando cuenta…' : 'Crear mi cuenta en OpenLeaf'}
        </button>
        <button className="btn-sv-reset" type="reset"><i className="fas fa-rotate-left"></i> Limpiar formulario</button>
      </form>
      <p className="text-center text-[0.78rem] text-[#94a3b8] mt-3">
        ¿Ya tienes cuenta? <a href="?auth=login" className="text-indigo-400 hover:underline" onClick={cambiarA('login')}>Inicia sesión aquí</a>
      </p>
    </ModalBase>
  );
}

// Paso posterior al registro o al login con correo sin verificar.
export function ModalVerificar({ abierto = false }) {
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const { verificarCorreo, cerrarSesion } = useAuth();
  const { cerrar, irAInicio } = useCierreModal();

  const [correo, setCorreo] = useState(ubicacion.state?.correo || '');
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [segundos, setSegundos] = useState(60);

  // Al abrir el modal se sincroniza el correo recibido por estado (registro/login).
  useEffect(() => {
    if (abierto && ubicacion.state?.correo) {
      setCorreo(ubicacion.state.correo);
      setSegundos(60);
    }
  }, [abierto, ubicacion.state?.correo]);

  // Cuenta regresiva para reenviar el código.
  useEffect(() => {
    if (!abierto || segundos <= 0) return undefined;
    const temporizador = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(temporizador);
  }, [abierto, segundos]);

  const alVerificar = async (evento) => {
    evento.preventDefault();
    setError('');
    setAviso('');
    setEnviando(true);
    try {
      await verificarCorreo(correo, codigo);
      irAInicio();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const alReenviar = async () => {
    if (segundos > 0 || reenviando) return;
    setError('');
    setAviso('');
    setReenviando(true);
    try {
      await resendVerification(correo);
      setSegundos(60);
      setAviso('Te enviamos un código nuevo. Revisa tu correo.');
    } catch (err) {
      setError(err.message);
    } finally {
      setReenviando(false);
    }
  };

  const usarOtroCorreo = () => {
    cerrarSesion();
    navegar('/?auth=login', { replace: true, state: ubicacion.state });
  };

  return (
    <ModalBase abierto={abierto} onCerrar={cerrar} ancho="440px">
      <div className="text-center mb-5">
        <span className="sv-modal-badge"><i className="fas fa-envelope-circle-check mr-1"></i> Verificar correo</span>
        <h2 className="sv-modal-title">Confirma tu correo</h2>
        <p className="sv-modal-sub">Te enviamos un código de 6 dígitos para activar tu cuenta</p>
      </div>
      <form onSubmit={alVerificar} className="flex flex-col gap-4">
        <div>
          <label className="sv-label" htmlFor="verif-correo"><i className="fas fa-envelope mr-1"></i> Correo <span className="text-pink-400 text-[0.65rem]">*</span></label>
          <input
            id="verif-correo"
            type="email"
            className="sv-input"
            placeholder="correo@ejemplo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label className="sv-label" htmlFor="verif-codigo"><i className="fas fa-hashtag mr-1"></i> Código de verificación <span className="text-pink-400 text-[0.65rem]">*</span></label>
          <input
            id="verif-codigo"
            type="text"
            className="sv-input"
            placeholder="Código de 6 dígitos"
            maxLength="6"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            autoComplete="one-time-code"
            required
          />
        </div>
        {aviso && <p className="text-emerald-400 text-center text-sm m-0">{aviso}</p>}
        {error && <p className="text-pink-400 text-center text-sm m-0">{error}</p>}
        <button className="btn-sv-submit" type="submit" disabled={enviando}>
          <i className="fas fa-circle-check"></i> {enviando ? 'Verificando…' : 'Verificar cuenta'}
        </button>
        <button className="btn-sv-reset" type="button" onClick={alReenviar} disabled={reenviando || segundos > 0}>
          <i className="fas fa-paper-plane"></i>
          {reenviando ? ' Enviando…' : segundos > 0 ? ` Reenviar código en ${segundos}s` : ' Reenviar código'}
        </button>
        <button className="btn-sv-reset" type="button" onClick={usarOtroCorreo}>
          <i className="fas fa-user-pen"></i> Usar otro correo
        </button>
      </form>
      <p className="text-center text-[0.72rem] text-[#94a3b8] mt-3 mb-0">
        El código vence a los 10 minutos y solo puede usarse una vez.
      </p>
    </ModalBase>
  );
}

export function ModalRecuperacion({ abierto = false }) {
  const { cerrar, cambiarA } = useCierreModal();
  const [paso, setPaso] = useState(1);
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [clave, setClave] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const alSolicitar = async (evento) => {
    evento.preventDefault();
    setError('');
    setMensaje('');
    setEnviando(true);
    try {
      await olvidarPassword(correo);
      setMensaje('Si el correo existe, te enviamos un código de recuperación.');
      setPaso(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const alRestablecer = async (evento) => {
    evento.preventDefault();
    setError('');
    setMensaje('');
    setEnviando(true);
    try {
      await restablecerPassword(correo, codigo, clave);
      setMensaje('Tu contraseña fue actualizada. Ya puedes iniciar sesión.');
      setCodigo('');
      setClave('');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ModalBase abierto={abierto} onCerrar={cerrar} ancho="440px">
      <div className="text-center mb-5">
        <span className="sv-modal-badge"><i className="fas fa-lock mr-1"></i> Recuperar acceso</span>
        <h2 className="sv-modal-title">¿Olvidaste tu contraseña?</h2>
        <p className="sv-modal-sub">Solicita un código de recuperación a tu correo</p>
      </div>

      {paso === 1 ? (
        <form onSubmit={alSolicitar} className="flex flex-col gap-4">
          <div>
            <label className="sv-label" htmlFor="recup-correo"><i className="fas fa-envelope mr-1"></i> Correo <span className="text-pink-400 text-[0.65rem]">*</span></label>
            <input
              id="recup-correo"
              type="email"
              className="sv-input"
              placeholder="correo@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          {mensaje && <p className="text-emerald-400 text-center text-sm m-0">{mensaje}</p>}
          {error && <p className="text-pink-400 text-center text-sm m-0">{error}</p>}
          <button className="btn-sv-submit" type="submit" disabled={enviando}>
            <i className="fas fa-paper-plane"></i> {enviando ? 'Enviando…' : 'Enviar código'}
          </button>
        </form>
      ) : (
        <form onSubmit={alRestablecer} className="flex flex-col gap-4">
          <div>
            <label className="sv-label" htmlFor="recup-codigo"><i className="fas fa-hashtag mr-1"></i> Código de recuperación <span className="text-pink-400 text-[0.65rem]">*</span></label>
            <input
              id="recup-codigo"
              type="text"
              className="sv-input"
              placeholder="Código de 6 dígitos"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              autoComplete="one-time-code"
              required
            />
          </div>
          <div>
            <label className="sv-label" htmlFor="recup-clave"><i className="fas fa-key mr-1"></i> Nueva contraseña <span className="text-pink-400 text-[0.65rem]">*</span></label>
            <CampoClave id="recup-clave" value={clave} onChange={(e) => setClave(e.target.value)} placeholder="Mín. 8 caracteres" minLength={8} autocomplete="new-password" />
          </div>
          {mensaje && <p className="text-emerald-400 text-center text-sm m-0">{mensaje}</p>}
          {error && <p className="text-pink-400 text-center text-sm m-0">{error}</p>}
          <button className="btn-sv-submit" type="submit" disabled={enviando}>
            <i className="fas fa-key"></i> {enviando ? 'Actualizando…' : 'Restablecer contraseña'}
          </button>
          <button className="btn-sv-reset" type="button" onClick={() => setPaso(1)}>
            <i className="fas fa-arrow-left"></i> Volver a solicitar código
          </button>
        </form>
      )}

      <div className="flex items-center gap-3 my-4">
        <span className="flex-1 h-px bg-[rgba(102,126,234,.2)]"></span>
        <p className="text-[0.74rem] text-[#94a3b8] m-0 whitespace-nowrap">¿Ya recuerdas tu contraseña?</p>
        <span className="flex-1 h-px bg-[rgba(102,126,234,.2)]"></span>
      </div>
      <a href="?auth=login" className="sv-register-link" onClick={cambiarA('login')}>
        <i className="fas fa-right-to-bracket"></i> Iniciar sesión
      </a>
    </ModalBase>
  );
}

// Aviso mostrado en la landing cuando axiosClient detecta una cuenta desactivada
// (?aviso=cuenta-desactivada). No abre el modal de login: solo informa.
export function ModalCuentaDesactivada({ abierto = false }) {
  const [parametros, setParametros] = useSearchParams();
  const { usuario, cerrarSesion } = useAuth();
  const correoContacto = import.meta.env.VITE_CONTACT_EMAIL;

  const cerrar = () => {
    const siguiente = new URLSearchParams(parametros);
    siguiente.delete('aviso');
    setParametros(siguiente, { replace: true });
  };

  // Si quedara una sesión abierta al mostrar el aviso, se cierra.
  useEffect(() => {
    if (abierto && usuario) cerrarSesion();
  }, [abierto, usuario, cerrarSesion]);

  return (
    <ModalBase abierto={abierto} onCerrar={cerrar} ancho="440px" etiqueta="Cuenta desactivada">
      <div className="text-center mb-5">
        <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(245,158,11,.15)] border border-[rgba(245,158,11,.35)] text-2xl text-amber-400">
          <i className="fas fa-triangle-exclamation"></i>
        </span>
        <h2 className="sv-modal-title">Cuenta desactivada</h2>
        <p className="sv-modal-sub">
          Tu cuenta fue desactivada por un administrador de OpenLeaf y ya no tienes acceso.
          Si crees que es un error, comunícate con el equipo.
        </p>
        {correoContacto && (
          <p className="text-sm m-0 mt-2 text-[#94a3b8]">
            Contacto: <a className="text-indigo-400 hover:underline" href={`mailto:${correoContacto}`}>{correoContacto}</a>
          </p>
        )}
      </div>
      <button type="button" className="btn-sv-submit w-full" onClick={cerrar}>
        <i className="fas fa-circle-check"></i> Entendido
      </button>
    </ModalBase>
  );
}

// Modales de acceso de la landing pública. Se abren con ?auth=login, ?auth=register,
// ?auth=verificar o ?auth=recuperar reutilizando las vistas de OpenLeaf.
export function ModalesAcceso() {
  const [parametros] = useSearchParams();
  const vista = parametros.get('auth');
  const aviso = parametros.get('aviso');
  return (
    <>
      <ModalLogin abierto={vista === 'login'} />
      <ModalRegistro abierto={vista === 'register'} />
      <ModalVerificar abierto={vista === 'verificar'} />
      <ModalRecuperacion abierto={vista === 'recuperar'} />
      <ModalCuentaDesactivada abierto={aviso === 'cuenta-desactivada'} />
    </>
  );
}

export function ModalInfo({ abierto = false, onCerrar }) {
  return (
    <ModalBase abierto={abierto} onCerrar={onCerrar} ancho="600px" etiqueta="¿Qué es OpenLeaf?">
        <div className="text-center mb-5">
          <span className="sv-modal-badge"><i className="fas fa-circle-info mr-1"></i> Bienvenida</span>
          <h2 className="sv-modal-title">¿Qué es OpenLeaf?</h2>
          <p className="text-[#94a3b8] text-sm">Tu portal definitivo para todo el entretenimiento digital</p>
        </div>
        <div className="bg-[rgba(99,102,241,.08)] border border-[rgba(99,102,241,.18)] rounded-2xl p-5 mb-5 flex items-start gap-3">
          <span className="sv-text-gradient text-4xl flex-shrink-0"><i className="fas fa-play-circle"></i></span>
          <p className="text-slate-300 text-sm leading-relaxed m-0">
            OpenLeaf centraliza los accesos a los principales servicios de streaming. No necesitas saltar entre apps: todo organizado en un diseño limpio desde cualquier dispositivo.
          </p>
        </div>
        <div className="flex flex-col gap-3 mb-5">
          <div className="flex gap-3 items-start">
            <span className="sv-text-gradient font-black text-2xl min-w-[36px]">01</span>
            <div>
              <p className="font-bold text-sm text-slate-100 mb-0">Explora las secciones</p>
              <p className="text-[#94a3b8] text-xs m-0">Navega por Películas, Música y En Vivo desde el menú.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="sv-text-gradient font-black text-2xl min-w-[36px]">02</span>
            <div>
              <p className="font-bold text-sm text-slate-100 mb-0">Pasa el cursor sobre las tarjetas</p>
              <p className="text-[#94a3b8] text-xs m-0">Cada tarjeta se voltea mostrando detalles y acceso directo.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="sv-text-gradient font-black text-2xl min-w-[36px]">03</span>
            <div>
              <p className="font-bold text-sm text-slate-100 mb-0">Crea tu cuenta</p>
              <p className="text-[#94a3b8] text-xs m-0">Regístrate para personalizar y guardar preferencias.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="sv-text-gradient font-black text-2xl min-w-[36px]">04</span>
            <div>
              <p className="font-bold text-sm text-slate-100 mb-0">Disfruta sin límites</p>
              <p className="text-[#94a3b8] text-xs m-0">Todo tu entretenimiento centralizado desde cualquier dispositivo.</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-5">
          <div className="sv-info-stat">
            <p className="sv-text-gradient font-black text-xl m-0">Más de 10</p>
            <small className="text-[#94a3b8] text-[0.65rem]">Plataformas</small>
          </div>
          <div className="sv-info-stat">
            <p className="sv-text-gradient font-black text-xl m-0">{NUMERO_CATEGORIAS}</p>
            <small className="text-[#94a3b8] text-[0.65rem]">Categorías</small>
          </div>
          <div className="sv-info-stat">
            <p className="sv-text-gradient font-black text-xl m-0">100%</p>
            <small className="text-[#94a3b8] text-[0.65rem]">Gratuito</small>
          </div>
          <div className="sv-info-stat">
            <p className="sv-text-gradient font-black text-xl m-0">0</p>
            <small className="text-[#94a3b8] text-[0.65rem]">Anuncios</small>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Link to="/inicio" className="btn-sv-primary justify-center"><i className="fas fa-rocket"></i> Comenzar ahora</Link>
          <button type="button" className="btn-sv-secondary justify-center" onClick={onCerrar}><i className="fas fa-times"></i> Cerrar</button>
        </div>
    </ModalBase>
  );
}

export function ModalUbicacion({ abierto = false, onCerrar }) {
  return (
    <ModalBase abierto={abierto} onCerrar={onCerrar} ancho="700px" etiqueta="Nuestra ubicación">
        <div className="text-center mb-5">
          <span className="sv-modal-badge"><i className="fas fa-map-marker-alt mr-1"></i> Nuestra ubicación</span>
          <h2 className="sv-modal-title">¿Dónde estamos?</h2>
          <p className="text-[#94a3b8] text-sm">Encuéntranos aquí y ven a visitarnos</p>
        </div>
        <div className="sv-feat" style={{ borderRadius: '1rem', background: 'rgba(99,102,241,.08)', border: '1px solid rgba(102,126,234,.22)', padding: '1rem', marginBottom: '1rem' }}>
          <span className="sv-feat-icon"><i className="fas fa-map-pin"></i></span>
          <p className="text-[0.78rem] font-bold text-slate-100 m-0">Sede</p>
          <p className="text-[0.72rem] text-[#94a3b8] m-0">{DIRECCION_CONTACTO}</p>
          <p className="text-[0.72rem] text-[rgba(148,163,184,.6)] m-0 mt-1">Estamos preparando nuestro espacio de atención.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="sv-feat">
            <span className="sv-feat-icon"><i className="fas fa-map-pin"></i></span>
            <p className="text-[0.78rem] font-bold text-slate-100 m-0">Dirección</p>
            <p className="text-[0.72rem] text-[#94a3b8] m-0">{DIRECCION_CONTACTO}</p>
          </div>
          <div className="sv-feat">
            <span className="sv-feat-icon"><i className="fas fa-clock"></i></span>
            <p className="text-[0.78rem] font-bold text-slate-100 m-0">Horario</p>
            <p className="text-[0.72rem] text-[#94a3b8] m-0">{HORARIO_CONTACTO}</p>
          </div>
          <div className="sv-feat">
            <span className="sv-feat-icon"><i className="fas fa-envelope"></i></span>
            <p className="text-[0.78rem] font-bold text-slate-100 m-0">Contacto</p>
            <p className="text-[0.72rem] text-[#94a3b8] m-0">{EMAIL_CONTACTO}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" className="btn-sv-secondary justify-center" onClick={onCerrar}><i className="fas fa-times"></i> Cerrar</button>
        </div>
    </ModalBase>
  );
}