import axiosClient, { crearErrorApi } from '../api/axiosClient.js';

// Edad mínima requerida para registrarse (misma que define el backend).
export const EDAD_MINIMA = 18;

// Comprueba que una fecha (YYYY-MM-DD) sea real, no futura y mayor de edad.
export function esMayorDeEdad(fechaNacimiento) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(fechaNacimiento || '').trim());
  if (!match) return false;

  const anio = Number(match[1]);
  const mes = Number(match[2]);
  const dia = Number(match[3]);
  const fecha = new Date(anio, mes - 1, dia);

  const esFechaReal =
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia;
  if (!esFechaReal) return false;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fecha > hoy) return false;

  let edad = hoy.getFullYear() - fecha.getFullYear();
  const cumpleDespues =
    hoy.getMonth() < fecha.getMonth() ||
    (hoy.getMonth() === fecha.getMonth() && hoy.getDate() < fecha.getDate());
  if (cumpleDespues) edad -= 1;

  return edad >= EDAD_MINIMA;
}

export async function login(email, password) {
  try {
    const { data } = await axiosClient.post('/auth/login', { email, password });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function register(datos) {
  try {
    const { data } = await axiosClient.post('/auth/register', datos);
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function verifyEmail(email, code) {
  try {
    const { data } = await axiosClient.post('/auth/verify-email', { email, code });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function resendVerification(email) {
  try {
    const { data } = await axiosClient.post('/auth/resend-verification', { email });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function actualizarPerfil(datos) {
  try {
    const { data } = await axiosClient.patch('/auth/me', datos);
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function actualizarAvatar(archivo) {
  try {
    const formulario = new FormData();
    formulario.append('file', archivo);
    const { data } = await axiosClient.patch('/auth/me/avatar', formulario, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function cambiarPassword(currentPassword, newPassword) {
  try {
    const { data } = await axiosClient.patch('/auth/change-my-password', { currentPassword, newPassword });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function solicitarCambioCorreo(newEmail, password) {
  try {
    const { data } = await axiosClient.post('/auth/me/email', { newEmail, password });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function confirmarCambioCorreo(code) {
  try {
    const { data } = await axiosClient.post('/auth/me/email/confirm', { code });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function olvidarPassword(email) {
  try {
    const { data } = await axiosClient.post('/auth/forgot-password', { email });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}

export async function restablecerPassword(email, code, newPassword) {
  try {
    const { data } = await axiosClient.post('/auth/reset-password', { email, code, newPassword });
    return data;
  } catch (error) {
    throw crearErrorApi(error);
  }
}