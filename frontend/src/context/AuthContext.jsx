import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import axiosClient, { borrarSesion, extraerError, obtenerToken } from '../api/axiosClient.js';

const AuthContext = createContext(null);

const CLAVE_TOKEN = 'openleaf_token';
const CLAVE_USUARIO = 'openleaf_usuario';

function leerStorage(clave) {
  return localStorage.getItem(clave) || sessionStorage.getItem(clave);
}

// Guarda la sesión en localStorage cuando el usuario marcó "Recordar sesión"
// y en sessionStorage (cierra la pestaña y termina la sesión) en caso contrario.
function guardarSesion(token, user, recordar) {
  borrarSesion();
  const almacen = recordar ? localStorage : sessionStorage;
  almacen.setItem(CLAVE_TOKEN, token);
  almacen.setItem(CLAVE_USUARIO, JSON.stringify(user));
}

function leerUsuarioGuardado() {
  try {
    const crudo = leerStorage(CLAVE_USUARIO);
    return crudo ? JSON.parse(crudo) : null;
  } catch {
    return null;
  }
}

export function normalizarUsuario(usuario) {
  if (!usuario) return null;
  return {
    ...usuario,
    rol: typeof usuario.rol === 'string' ? usuario.rol : (usuario.rol?.nombre ?? null)
  };
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado);
  const [cargando, setCargando] = useState(() => Boolean(obtenerToken()));

  useEffect(() => {
    const token = obtenerToken();
    if (!token) {
      setCargando(false);
      return undefined;
    }

    let activo = true;

    axiosClient
      .get('/auth/me')
      .then(({ data }) => {
        if (!activo) return;
        const u = normalizarUsuario(data);
        setUsuario(u);
        // Se conserva la sesión en el mismo almacén donde estaba el token.
        const almacen = localStorage.getItem(CLAVE_TOKEN) ? localStorage : sessionStorage;
        almacen.setItem(CLAVE_USUARIO, JSON.stringify(u));
      })
      .catch(() => {
        if (!activo) return;
        borrarSesion();
        setUsuario(null);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    const alExpirar = () => setUsuario(null);
    window.addEventListener('openleaf:sesion-expirada', alExpirar);
    return () => window.removeEventListener('openleaf:sesion-expirada', alExpirar);
  }, []);

  const iniciarSesion = useCallback(async (email, password, recordar = true) => {
    try {
      const { data } = await axiosClient.post('/auth/login', { email, password });
      const u = normalizarUsuario(data.user);
      guardarSesion(data.token, u, recordar);
      setUsuario(u);
      return u;
    } catch (error) {
      // El login responde 403 cuando la cuenta aún no verificó su correo
      // (needs_verification) o cuando la cuenta fue desactivada (account_inactive).
      const aviso = new Error(extraerError(error));
      aviso.needsVerificacion = Boolean(error.response?.data?.needs_verification);
      aviso.email = error.response?.data?.email || email;
      aviso.code = error.response?.data?.code || null;
      throw aviso;
    }
  }, []);

  const registrarse = useCallback(async (datos) => {
    try {
      const { data } = await axiosClient.post('/auth/register', datos);
      return data;
    } catch (error) {
      throw new Error(extraerError(error));
    }
  }, []);

  const verificarCorreo = useCallback(async (email, code, recordar = true) => {
    try {
      const { data } = await axiosClient.post('/auth/verify-email', { email, code });
      const u = normalizarUsuario(data.user);
      guardarSesion(data.token, u, recordar);
      setUsuario(u);
      return u;
    } catch (error) {
      throw new Error(extraerError(error));
    }
  }, []);

  const cerrarSesion = useCallback(() => {
    borrarSesion();
    setUsuario(null);
  }, []);

  const guardarUsuario = useCallback((datos) => {
    const u = normalizarUsuario(datos);
    setUsuario(u);
    const almacen = localStorage.getItem(CLAVE_TOKEN) ? localStorage : sessionStorage;
    almacen.setItem(CLAVE_USUARIO, JSON.stringify(u));
    return u;
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      cargando,
      autenticado: Boolean(usuario),
      esAdmin: usuario?.rol === 'administrador',
      iniciarSesion,
      registrarse,
      verificarCorreo,
      cerrarSesion,
      guardarUsuario
    }),
    [usuario, cargando, iniciarSesion, registrarse, verificarCorreo, cerrarSesion, guardarUsuario]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}