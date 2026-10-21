import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { supabaseAdmin } from '../config/supabase.js';
import { sendResetCodeEmail, sendVerificationCodeEmail } from './mailService.js';
import { AppError } from '../middlewares/errorMiddleware.js';


const MAX_INTENTOS = 3;
const BLOQUEO_MS = 10000; // 10 s como en el CMS. Subir antes de producción.


// Edad mínima para registrarse; se define en un único lugar (este módulo).
export const EDAD_MINIMA = 18;


// Caché en memoria del estado y rol actuales de cada usuario. verifyToken la usa
// para no golpear la base de datos en cada petición; como máximo tarda 30 s en
// reflejar un cambio de rol o de estado. Cualquier escritura que cambie esos
// campos debe llamar a invalidateUserCache(id) para que el efecto sea inmediato.
const CACHE_USUARIOS_TTL_MS = 30000;
const cacheUsuarios = new Map();


export function invalidateUserCache(id) {
  if (id === undefined || id === null) return;
  cacheUsuarios.delete(String(id));
}


// Devuelve el estado y el rol vigentes del usuario (o null si ya no existe).
// Usa caché de 30 s para no consultar Supabase en cada petición autenticada.
export async function getAuthUser(userId) {
  const clave = String(userId);
  const ahora = Date.now();
  const enCache = cacheUsuarios.get(clave);
  if (enCache && enCache.expira > ahora) return enCache.valor;


  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .select('id, estado, rol:roles ( nombre )')
    .eq('id', userId)
    .limit(1);


  if (error) throw new Error(error.message);


  const user = data && data[0];
  const valor = user ? { estado: user.estado, rol: user.rol?.nombre ?? null } : null;
  cacheUsuarios.set(clave, { valor, expira: ahora + CACHE_USUARIOS_TTL_MS });
  return valor;
}


const USER_SELECT = `
  id, nombre, apellido, email, username, avatar_url, estado,
  ultimo_acceso, pais, fecha_nacimiento, acepta_novedades, email_verificado,
  created_at, updated_at,
  rol:roles ( id, nombre )
`;


function generarCode() {
  return String(crypto.randomInt(100000, 1000000));
}


// Comprueba que la fecha sea real, no futura y que el usuario sea mayor de edad.
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


function toPublicUser(user) {
  return {
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    username: user.username,
    avatar_url: user.avatar_url,
    estado: user.estado,
    ultimo_acceso: user.ultimo_acceso,
    pais: user.pais,
    fecha_nacimiento: user.fecha_nacimiento,
    acepta_novedades: Boolean(user.acepta_novedades),
    email_verificado: Boolean(user.email_verificado),
    rol: user.rol?.nombre ?? null
  };
}


function firmarToken(user) {
  const payload = { id: user.id, username: user.username, rol: user.rol?.nombre };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h'
  });
}


export async function registerUser(datos) {
  const nombre = String(datos.nombre || '').trim();
  const apellido = String(datos.apellido || '').trim();
  const pais = String(datos.pais || '').trim();
  const username = String(datos.username || '').trim();
  const emailLimpio = String(datos.email || '').trim().toLowerCase();
  const fechaNacimiento = datos.fecha_nacimiento;
  const aceptaNovedades = Boolean(datos.acepta_novedades);


  const { data: roles, error: rolError } = await supabaseAdmin
    .from('roles')
    .select('id')
    .eq('nombre', 'usuario')
    .limit(1);


  if (rolError) throw new Error(rolError.message);
  if (!roles || roles.length === 0) {
    throw new Error('El rol usuario no está configurado. Ejecuta primero el SQL inicial.');
  }


  const passwordHash = await bcrypt.hash(datos.password, 10);
  const code = generarCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expira = new Date(Date.now() + 10 * 60 * 1000).toISOString();


  const { data: existentes, error: existError } = await supabaseAdmin
    .from('usuarios')
    .select('id, email, email_verificado')
    .eq('email', emailLimpio)
    .limit(1);


  if (existError) throw new Error(existError.message);


  const camposComunes = {
    nombre,
    apellido,
    pais,
    fecha_nacimiento: fechaNacimiento,
    username,
    password_hash: passwordHash,
    acepta_novedades: aceptaNovedades,
    updated_at: new Date().toISOString()
  };
  if (datos.acepta_terminos === true) {
    camposComunes.terminos_aceptados_at = new Date().toISOString();
  }


  const camposVerificacion = {
    verif_code_hash: codeHash,
    verif_code_expira: expira,
    verif_intentos: 0,
    verif_enviado_at: new Date().toISOString()
  };


  let cuentaId;
  let cuentaUsername = username;


  if (existentes && existentes[0]) {
    const existente = existentes[0];
    if (existente.email_verificado) {
      throw new AppError(409, 'El correo ya está registrado');
    }


    // El correo existe pero sin verificar: se reemplazan los datos pendientes
    // y se reenvía el código.
    const { data: actualizado, error: updateError } = await supabaseAdmin
      .from('usuarios')
      .update({ ...camposComunes, ...camposVerificacion })
      .eq('id', existente.id)
      .select('id, username');


    if (updateError) {
      if (updateError.message.includes('usuarios_username_key')) {
        throw new AppError(409, 'El nombre de usuario ya está en uso');
      }
      throw new Error(updateError.message);
    }


    cuentaId = actualizado[0].id;
    cuentaUsername = actualizado[0].username;
  } else {
    const { data: nuevo, error: insertError } = await supabaseAdmin
      .from('usuarios')
      .insert([
        {
          ...camposComunes,
          ...camposVerificacion,
          email: emailLimpio,
          rol_id: roles[0].id,
          estado: 'activo',
          email_verificado: false
        }
      ])
      .select('id, username');


    if (insertError) {
      if (insertError.message.includes('usuarios_email_key')) {
        throw new AppError(409, 'El correo ya está registrado');
      }
      if (insertError.message.includes('usuarios_username_key')) {
        throw new AppError(409, 'El nombre de usuario ya está en uso');
      }
      throw new Error(insertError.message);
    }


    cuentaId = nuevo[0].id;
    cuentaUsername = nuevo[0].username;
  }


  try {
    await sendVerificationCodeEmail(emailLimpio, nombre, code);
  } catch (mailError) {
    console.error('Error enviando correo de verificación:', mailError.message);
    throw new AppError(502, 'No pudimos enviar el correo de verificación. Intenta de nuevo en unos minutos');
  }


  return { id: cuentaId, username: cuentaUsername, email: emailLimpio };
}


export async function loginUser(identifier, password) {
  const cleanInput = identifier.trim().toLowerCase();

  const { data: users, error } = await supabaseAdmin
    .from('usuarios')
    .select(`
      id, nombre, apellido, email, username, avatar_url, estado,
      password_hash, email_verificado, login_intentos, login_bloqueado_hasta,
      rol:roles ( id, nombre )
    `)
    .or(`email.eq.${cleanInput},username.eq.${identifier.trim()}`)
    .limit(1);

  if (error) throw new Error(error.message);

  if (!users || users.length === 0) {
    throw new AppError(401, 'Usuario/correo o contraseña incorrectos');
  }

  const user = users[0];


  // El bloqueo temporal se revisa antes que la contraseña.
  if (user.login_bloqueado_hasta) {
    const ahora = new Date();
    const bloqueo = new Date(user.login_bloqueado_hasta);
    if (bloqueo > ahora) {
      const segundos = Math.ceil((bloqueo - ahora) / 1000);
      throw new AppError(401, `Cuenta bloqueada temporalmente. Intenta en ${segundos} segundos`);
    }
  }


  const validPassword = await bcrypt.compare(password, user.password_hash);


  if (!validPassword) {
    const nuevosIntentos = (user.login_intentos || 0) + 1;
    const updateData = { login_intentos: nuevosIntentos };
    if (nuevosIntentos >= MAX_INTENTOS) {
      updateData.login_bloqueado_hasta = new Date(Date.now() + BLOQUEO_MS).toISOString();
      updateData.login_intentos = 0;
    }
    await supabaseAdmin.from('usuarios').update(updateData).eq('id', user.id);
    throw new AppError(401, 'Correo o contraseña incorrectos');
  }


  // Solo con la contraseña correcta se revela que la cuenta está desactivada:
  // así nadie descubre que un correo existe (y está inactivo) sin conocer su clave.
  if (user.estado !== 'activo') {
    throw new AppError(
      403,
      'Tu cuenta fue desactivada. Contacta al equipo de OpenLeaf si crees que es un error.',
      null,
      'account_inactive'
    );
  }


  if (!user.email_verificado) {
    throw new AppError(403, 'Debes verificar tu correo antes de iniciar sesión', {
      needs_verification: true,
      email: user.email
    });
  }


  await supabaseAdmin
    .from('usuarios')
    .update({ login_intentos: 0, login_bloqueado_hasta: null, ultimo_acceso: new Date().toISOString() })
    .eq('id', user.id);


  return {
    token: firmarToken(user),
    user: toPublicUser({ ...user, ultimo_acceso: new Date().toISOString() })
  };
}


export async function getMe(userId) {
  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .select(USER_SELECT)
    .eq('id', userId)
    .limit(1);


  if (error) throw new Error(error.message);
  return data[0] ? toPublicUser(data[0]) : null;
}


export async function updateMe(userId, { nombre, apellido, username, pais, fecha_nacimiento, acepta_novedades }) {
  const campos = { updated_at: new Date().toISOString() };


  if (nombre !== undefined) campos.nombre = String(nombre).trim();
  if (apellido !== undefined) campos.apellido = String(apellido).trim();
  if (username !== undefined) campos.username = String(username).trim();
  if (pais !== undefined) campos.pais = String(pais).trim();
  if (fecha_nacimiento !== undefined) campos.fecha_nacimiento = fecha_nacimiento;
  if (acepta_novedades !== undefined) campos.acepta_novedades = Boolean(acepta_novedades);


  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .update(campos)
    .eq('id', userId)
    .select(USER_SELECT);


  if (error) {
    if (error.message.includes('usuarios_username_key')) {
      throw new AppError(409, 'El nombre de usuario ya está en uso');
    }
    throw new Error(error.message);
  }


  return data[0] ? toPublicUser(data[0]) : null;
}


export async function updateAvatarUser(userId, imageUrl) {
  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .update({ avatar_url: imageUrl, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select(USER_SELECT);


  if (error) throw new Error(error.message);
  return data[0] ? toPublicUser(data[0]) : null;
}


export async function changeMyPassword(userId, currentPassword, newPassword) {
  const { data: users, error } = await supabaseAdmin
    .from('usuarios')
    .select('id, password_hash')
    .eq('id', userId)
    .limit(1);


  if (error) throw new Error(error.message);
  if (!users || users.length === 0) throw new AppError(404, 'Usuario no encontrado');


  const validPassword = await bcrypt.compare(currentPassword, users[0].password_hash);
  if (!validPassword) {
    throw new AppError(401, 'La contraseña actual es incorrecta');
  }


  const passwordHash = await bcrypt.hash(newPassword, 10);


  const { error: updateError } = await supabaseAdmin
    .from('usuarios')
    .update({
      password_hash: passwordHash,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);


  if (updateError) throw new Error(updateError.message);
  return { id: userId };
}


export async function verifyEmail(email, code) {
  const invalido = () => new AppError(400, 'Código inválido o vencido');
  const emailLimpio = email.trim().toLowerCase();


  const { data: users, error } = await supabaseAdmin
    .from('usuarios')
    .select(`
      id, nombre, apellido, email, username, avatar_url, estado,
      email_verificado, verif_code_hash, verif_code_expira, verif_intentos,
      rol:roles ( id, nombre )
    `)
    .eq('email', emailLimpio)
    .limit(1);


  if (error) throw new Error(error.message);


  const user = users && users[0];
  if (!user || user.email_verificado) throw invalido();
  if (!user.verif_code_hash) throw invalido();
  if ((user.verif_intentos || 0) >= 5) throw invalido();


  const expira = user.verif_code_expira ? new Date(user.verif_code_expira) : null;
  const expirado = !expira || expira <= new Date();


  let codigoCorrecto = false;
  if (!expirado) {
    codigoCorrecto = await bcrypt.compare(String(code), user.verif_code_hash);
  }


  if (!codigoCorrecto) {
    await supabaseAdmin
      .from('usuarios')
      .update({ verif_intentos: (user.verif_intentos || 0) + 1, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    throw invalido();
  }


  // Con el código válido (solo lo tiene el dueño de la cuenta) se informa que
  // la cuenta está desactivada, sin filtrar su existencia a terceros.
  if (user.estado !== 'activo') {
    throw new AppError(
      403,
      'Tu cuenta fue desactivada. Contacta al equipo de OpenLeaf si crees que es un error.',
      null,
      'account_inactive'
    );
  }


  const { error: updateError } = await supabaseAdmin
    .from('usuarios')
    .update({
      email_verificado: true,
      verif_code_hash: null,
      verif_code_expira: null,
      verif_intentos: 0,
      verif_enviado_at: null,
      login_intentos: 0,
      login_bloqueado_hasta: null,
      ultimo_acceso: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);


  if (updateError) throw new Error(updateError.message);


  return {
    token: firmarToken(user),
    user: toPublicUser({ ...user, ultimo_acceso: new Date().toISOString() })
  };
}


export async function resendVerification(email) {
  const emailLimpio = email.trim().toLowerCase();


  const { data: users, error } = await supabaseAdmin
    .from('usuarios')
    .select('id, nombre, email, estado, email_verificado, verif_enviado_at')
    .eq('email', emailLimpio)
    .limit(1);


  if (error) {
    console.error('Error buscando usuario para reenviar verificación:', error.message);
    return { enviado: false };
  }


  const user = users && users[0];
  if (!user || user.estado !== 'activo' || user.email_verificado) {
    return { enviado: false };
  }


  const ultimoEnvio = user.verif_enviado_at ? new Date(user.verif_enviado_at) : null;
  const puedeReenviar = !ultimoEnvio || Date.now() - ultimoEnvio.getTime() >= 60000;
  if (!puedeReenviar) {
    return { enviado: false };
  }


  const code = generarCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expira = new Date(Date.now() + 10 * 60 * 1000).toISOString();


  const { error: updateError } = await supabaseAdmin
    .from('usuarios')
    .update({
      verif_code_hash: codeHash,
      verif_code_expira: expira,
      verif_intentos: 0,
      verif_enviado_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);


  if (updateError) {
    console.error('Error guardando código de verificación:', updateError.message);
    return { enviado: false };
  }


  try {
    await sendVerificationCodeEmail(user.email, user.nombre, code);
    return { enviado: true, usuario: user };
  } catch (mailError) {
    console.error('Error enviando correo de verificación:', mailError.message);
    return { enviado: false };
  }
}


export async function requestEmailChange(userId, newEmail, currentPassword) {
  const nuevoLimpio = newEmail.trim().toLowerCase();


  const { data: users, error } = await supabaseAdmin
    .from('usuarios')
    .select('id, nombre, email, username, password_hash')
    .eq('id', userId)
    .limit(1);


  if (error) throw new Error(error.message);
  if (!users || users.length === 0) throw new AppError(404, 'Usuario no encontrado');


  const user = users[0];
  const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
  if (!validPassword) {
    throw new AppError(401, 'La contraseña actual es incorrecta');
  }


  if (nuevoLimpio === user.email) {
    throw new AppError(400, 'El nuevo correo debe ser diferente al actual');
  }


  const { data: otros, error: otrosError } = await supabaseAdmin
    .from('usuarios')
    .select('id')
    .eq('email', nuevoLimpio)
    .neq('id', userId)
    .limit(1);


  if (otrosError) throw new Error(otrosError.message);
  if (otros && otros.length > 0) {
    throw new AppError(409, 'El correo ya está registrado');
  }


  const code = generarCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expira = new Date(Date.now() + 10 * 60 * 1000).toISOString();


  const { error: updateError } = await supabaseAdmin
    .from('usuarios')
    .update({
      email_pendiente: nuevoLimpio,
      verif_code_hash: codeHash,
      verif_code_expira: expira,
      verif_intentos: 0,
      verif_enviado_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);


  if (updateError) throw new Error(updateError.message);


  try {
    await sendVerificationCodeEmail(nuevoLimpio, user.nombre, code);
  } catch (mailError) {
    console.error('Error enviando correo de verificación:', mailError.message);
    throw new AppError(502, 'No pudimos enviar el correo de verificación. Intenta de nuevo en unos minutos');
  }


  return { id: userId, username: user.username };
}


export async function confirmEmailChange(userId, code) {
  const invalido = () => new AppError(400, 'Código inválido o vencido');


  const { data: users, error } = await supabaseAdmin
    .from('usuarios')
    .select(`
      id, nombre, apellido, email, username, avatar_url, estado,
      email_pendiente, verif_code_hash, verif_code_expira, verif_intentos,
      rol:roles ( id, nombre )
    `)
    .eq('id', userId)
    .limit(1);


  if (error) throw new Error(error.message);


  const user = users && users[0];
  if (!user || !user.email_pendiente || !user.verif_code_hash) throw invalido();
  if ((user.verif_intentos || 0) >= 5) throw invalido();


  const expira = user.verif_code_expira ? new Date(user.verif_code_expira) : null;
  const expirado = !expira || expira <= new Date();


  let codigoCorrecto = false;
  if (!expirado) {
    codigoCorrecto = await bcrypt.compare(String(code), user.verif_code_hash);
  }


  if (!codigoCorrecto) {
    await supabaseAdmin
      .from('usuarios')
      .update({ verif_intentos: (user.verif_intentos || 0) + 1, updated_at: new Date().toISOString() })
      .eq('id', userId);
    throw invalido();
  }


  const nuevoEmail = user.email_pendiente;
  const { data, error: updateError } = await supabaseAdmin
    .from('usuarios')
    .update({
      email: nuevoEmail,
      email_pendiente: null,
      verif_code_hash: null,
      verif_code_expira: null,
      verif_intentos: 0,
      verif_enviado_at: null,
      login_intentos: 0,
      login_bloqueado_hasta: null,
      ultimo_acceso: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select(USER_SELECT);


  if (updateError) {
    if (updateError.message.includes('usuarios_email_key')) {
      throw new AppError(409, 'El correo ya está registrado');
    }
    throw new Error(updateError.message);
  }


  return toPublicUser(data[0]);
}


export async function forgotPassword(email) {
  const { data: users, error } = await supabaseAdmin
    .from('usuarios')
    .select('id, nombre, email, estado, email_verificado')
    .eq('email', email.trim().toLowerCase())
    .limit(1);


  if (error) {
    console.error('Error buscando usuario para recuperación:', error.message);
  }


  const user = users && users[0];


  if (user && user.estado === 'activo' && user.email_verificado) {
    const code = generarCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expira = new Date(Date.now() + 10 * 60 * 1000).toISOString();


    const { error: updateError } = await supabaseAdmin
      .from('usuarios')
      .update({
        reset_code_hash: codeHash,
        reset_code_expira: expira,
        reset_intentos: 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);


    if (updateError) {
      console.error('Error guardando código de recuperación:', updateError.message);
    } else {
      try {
        await sendResetCodeEmail(user.email, user.nombre, code);
      } catch (mailError) {
        console.error('Error enviando correo de recuperación:', mailError.message);
      }
    }
  }


  return { message: 'Si el correo está registrado, recibirás un código de verificación' };
}


export async function resetPassword(email, code, newPassword) {
  const codigoInvalido = () => new AppError(400, 'Código inválido o vencido');


  const { data: users, error } = await supabaseAdmin
    .from('usuarios')
    .select('id, estado, email_verificado, reset_code_hash, reset_code_expira, reset_intentos')
    .eq('email', email.trim().toLowerCase())
    .limit(1);


  if (error) throw new Error(error.message);


  const user = users && users[0];
  if (!user || !user.email_verificado) throw codigoInvalido();
  if (!user.reset_code_hash) throw codigoInvalido();
  if ((user.reset_intentos || 0) >= 5) throw codigoInvalido();


  const expira = user.reset_code_expira ? new Date(user.reset_code_expira) : null;
  const expirado = !expira || expira <= new Date();


  let codigoCorrecto = false;
  if (!expirado) {
    codigoCorrecto = await bcrypt.compare(String(code), user.reset_code_hash);
  }


  if (!codigoCorrecto) {
    await supabaseAdmin
      .from('usuarios')
      .update({
        reset_intentos: (user.reset_intentos || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    throw codigoInvalido();
  }


  // Una cuenta desactivada no puede restablecer la contraseña para volver a
  // entrar. Se informa solo tras validar el código de recuperación.
  if (user.estado !== 'activo') {
    throw new AppError(
      403,
      'Tu cuenta fue desactivada. Contacta al equipo de OpenLeaf si crees que es un error.',
      null,
      'account_inactive'
    );
  }


  const passwordHash = await bcrypt.hash(newPassword, 10);


  const { error: updateError } = await supabaseAdmin
    .from('usuarios')
    .update({
      password_hash: passwordHash,
      reset_code_hash: null,
      reset_code_expira: null,
      reset_intentos: 0,
      login_intentos: 0,
      login_bloqueado_hasta: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);


  if (updateError) throw new Error(updateError.message);
  return { id: user.id };
}