import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const axiosClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

export function obtenerToken() {
  return localStorage.getItem('openleaf_token') || sessionStorage.getItem('openleaf_token');
}

export function borrarSesion() {
  localStorage.removeItem('openleaf_token');
  localStorage.removeItem('openleaf_usuario');
  sessionStorage.removeItem('openleaf_token');
  sessionStorage.removeItem('openleaf_usuario');
}

axiosClient.interceptors.request.use((config) => {
  const token = obtenerToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Rutas de autenticación que no exigen sesión: sus errores se muestran dentro
// del modal correspondiente y no deben provocar redirecciones.
const RUTAS_AUTH_PUBLICAS = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/resend-verification',
  '/auth/forgot-password',
  '/auth/reset-password'
];

function esRutaAuthPublica(url) {
  return RUTAS_AUTH_PUBLICAS.some((ruta) => url.includes(ruta));
}

// Garantiza que, aunque fallen varias peticiones a la vez, la sesión se cierre
// y la redirección se haga una sola vez.
let sesionYaManejada = false;

axiosClient.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const url = error.config?.url || '';
    const estado = error.response?.status;
    const code = error.response?.data?.code;

    const cuentaInactiva = (estado === 401 || estado === 403) && code === 'account_inactive';
    const sesionInvalida = estado === 401;

    if (!sesionYaManejada && !esRutaAuthPublica(url) && (cuentaInactiva || sesionInvalida)) {
      sesionYaManejada = true;
      borrarSesion();
      window.dispatchEvent(new Event('openleaf:sesion-expirada'));
      try {
        window.location.href = cuentaInactiva
          ? '/?aviso=cuenta-desactivada'
          : '/?auth=login&aviso=sesion';
      } catch {
        // el interceptor solo redirige dentro del navegador
      }
    }
    return Promise.reject(error);
  }
);

export function extraerError(error) {
  const mensajeServidor = error?.response?.data?.error;
  if (typeof mensajeServidor === 'string' && mensajeServidor.trim()) {
    return mensajeServidor;
  }
  // Sin respuesta del servidor: casi siempre es falta de conexión o el backend caído.
  if (error && !error.response) {
    return 'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.';
  }
  // Con respuesta pero sin mensaje útil: no exponemos el texto técnico en inglés.
  return 'Ocurrió un error inesperado. Intenta de nuevo.';
}

// crearErrorApi: conserva el status y la respuesta original al lanzar un error
// ya traducido, para que las páginas puedan reaccionar a códigos (400/409/etc.)
// sin volver a leer el mensaje crudo del navegador.
export function crearErrorApi(error) {
  const aviso = new Error(extraerError(error));
  aviso.status = error?.response?.status ?? null;
  aviso.response = error?.response ?? null;
  aviso.code = error?.response?.data?.code ?? null;
  return aviso;
}

export default axiosClient;
