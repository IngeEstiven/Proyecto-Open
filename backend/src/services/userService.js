import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { invalidateUserCache } from './authService.js';


const USER_SELECT = `
  id, nombre, apellido, email, username, avatar_url, estado,
  ultimo_acceso, pais, fecha_nacimiento, acepta_novedades, email_verificado,
  login_intentos, created_at, updated_at,
  rol:roles ( id, nombre )
`;


function extraerErrorDuplicado(error) {
  if (error.message.includes('usuarios_email_key')) {
    return new AppError(409, 'El correo ya está registrado');
  }
  if (error.message.includes('usuarios_username_key')) {
    return new AppError(409, 'El nombre de usuario ya está en uso');
  }
  return null;
}


async function getRolId(nombreRol) {
  const { data, error } = await supabaseAdmin
    .from('roles')
    .select('id')
    .eq('nombre', nombreRol)
    .limit(1);


  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new AppError(400, 'Rol no válido');
  return data[0].id;
}


export async function getUsers() {
  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .select(USER_SELECT)
    .order('created_at', { ascending: false });


  if (error) throw new Error(error.message);
  return data;
}


export async function getUserById(id) {
  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .select(USER_SELECT)
    .eq('id', id)
    .limit(1);


  if (error) throw new Error(error.message);
  return data[0] || null;
}


export async function createUser(userData) {
  const rolId = await getRolId(userData.rol || 'usuario');
  const passwordHash = await bcrypt.hash(userData.password, 10);


  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .insert([
      {
        nombre: userData.nombre.trim(),
        apellido: userData.apellido.trim(),
        email: userData.email.trim().toLowerCase(),
        username: userData.username.trim(),
        password_hash: passwordHash,
        rol_id: rolId,
        estado: userData.estado || 'activo',
        email_verificado: true
      }
    ])
    .select(USER_SELECT);


  if (error) {
    const duplicado = extraerErrorDuplicado(error);
    if (duplicado) throw duplicado;
    throw new Error(error.message);
  }


  return data[0];
}


export async function updateUser(id, userData) {
  const campos = {};


  if (userData.nombre !== undefined) campos.nombre = userData.nombre.trim();
  if (userData.apellido !== undefined) campos.apellido = userData.apellido.trim();
  if (userData.email !== undefined) campos.email = userData.email.trim().toLowerCase();
  if (userData.username !== undefined) campos.username = userData.username.trim();


  if (Object.keys(campos).length === 0) {
    throw new AppError(400, 'No se enviaron campos para actualizar');
  }


  campos.updated_at = new Date().toISOString();


  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .update(campos)
    .eq('id', id)
    .select(USER_SELECT);


  if (error) {
    const duplicado = extraerErrorDuplicado(error);
    if (duplicado) throw duplicado;
    throw new Error(error.message);
  }


  return data[0] || null;
}


export async function changeUserRole(id, rol) {
  const rolId = await getRolId(rol);


  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .update({ rol_id: rolId, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(USER_SELECT);


  if (error) throw new Error(error.message);
  // El rol cambia de inmediato para las peticiones siguientes (verifyToken).
  invalidateUserCache(id);
  return data[0] || null;
}


export async function changeUserPassword(id, newPassword) {
  const passwordHash = await bcrypt.hash(newPassword, 10);


  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .update({
      password_hash: passwordHash,
      login_intentos: 0,
      login_bloqueado_hasta: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select('id, username, email');


  if (error) throw new Error(error.message);
  return data[0] || null;
}


export async function deactivateUser(id) {
  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .update({ estado: 'inactivo', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(USER_SELECT);


  if (error) throw new Error(error.message);
  // Al desactivar, la sesión abierta se corta en la siguiente petición.
  invalidateUserCache(id);
  return data[0] || null;
}


export async function changeUserStatus(id, estado) {
  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .update({ estado, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(USER_SELECT);


  if (error) throw new Error(error.message);
  invalidateUserCache(id);
  return data[0] || null;
}


export async function deleteUserPermanent(id) {
  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .delete()
    .eq('id', id)
    .select('id, username, email, rol_id');


  if (error) throw new Error(error.message);
  invalidateUserCache(id);
  return data[0] || null;
}
