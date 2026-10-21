import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  changeUserRole,
  changeUserPassword,
  deactivateUser,
  changeUserStatus,
  deleteUserPermanent
} from '../services/userService.js';


import { createAuditLog } from '../services/auditService.js';
import { AppError, sendError } from '../middlewares/errorMiddleware.js';


const rolesPermitidos = ['administrador', 'usuario'];
const camposProhibidos = ['rol', 'estado', 'password', 'password_hash'];


function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function responderError(res, error) {
  if (error instanceof AppError) {
    return res.status(error.status).json({ error: error.message });
  }
  return sendError(res, error);
}


export async function listUsers(req, res) {
  try {
    const usuarios = await getUsers();
    res.json(usuarios);
  } catch (error) {
    responderError(res, error);
  }
}


export async function getUserDetail(req, res) {
  try {
    const usuario = await getUserById(req.params.id);


    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }


    res.json(usuario);
  } catch (error) {
    responderError(res, error);
  }
}


export async function addUser(req, res) {
  try {
    const { nombre, apellido, email, username, password, rol } = req.body;


    if (!nombre || !apellido || !email || !username || !password) {
      return res.status(400).json({ error: 'Nombre, apellido, correo, usuario y contraseña son obligatorios' });
    }
    if (!esEmailValido(email)) {
      return res.status(400).json({ error: 'El correo no tiene un formato válido' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }
    if (rol && !rolesPermitidos.includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido. Use: administrador o usuario' });
    }


    const usuario = await createUser({ nombre, apellido, email, username, password, rol });


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'crear_usuario',
      modulo: 'usuarios',
      registro_id: usuario.id,
      descripcion: `Creó el usuario ${usuario.username}`,
      ip: req.ip
    });


    res.status(201).json({ message: 'Usuario creado correctamente', usuario });
  } catch (error) {
    responderError(res, error);
  }
}


export async function editUser(req, res) {
  try {
    const enviado = Object.keys(req.body);


    if (enviado.some((campo) => camposProhibidos.includes(campo))) {
      return res.status(403).json({
        error: 'Usa los endpoints de rol o contraseña para modificar esos campos'
      });
    }


    if (req.method === 'PUT') {
      const { nombre, apellido, email, username } = req.body;
      if (!nombre || !apellido || !email || !username) {
        return res.status(400).json({ error: 'Nombre, apellido, correo y usuario son obligatorios' });
      }
    }


    if (req.body.email && !esEmailValido(req.body.email)) {
      return res.status(400).json({ error: 'El correo no tiene un formato válido' });
    }


    const usuario = await updateUser(req.params.id, req.body);


    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'actualizar_usuario',
      modulo: 'usuarios',
      registro_id: usuario.id,
      descripcion: `Actualizó el usuario ${usuario.username}`,
      ip: req.ip
    });


    res.json({ message: 'Usuario actualizado correctamente', usuario });
  } catch (error) {
    responderError(res, error);
  }
}


export async function updateUserRol(req, res) {
  try {
    const { rol } = req.body;


    if (!rol || !rolesPermitidos.includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido. Use: administrador o usuario' });
    }


    if (String(req.user.id) === String(req.params.id) && rol !== 'administrador') {
      return res.status(403).json({ error: 'No puedes quitarte el rol de administrador a ti mismo' });
    }


    const usuario = await changeUserRole(req.params.id, rol);


    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'cambiar_rol_usuario',
      modulo: 'usuarios',
      registro_id: usuario.id,
      descripcion: `Cambió el rol de ${usuario.username} a ${rol}`,
      ip: req.ip
    });


    res.json({ message: 'Rol actualizado correctamente', usuario });
  } catch (error) {
    responderError(res, error);
  }
}


export async function updateUserPassword(req, res) {
  try {
    const { newPassword } = req.body;


    if (!newPassword) {
      return res.status(400).json({ error: 'La nueva contraseña es obligatoria' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }


    const usuario = await changeUserPassword(req.params.id, newPassword);


    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'cambiar_password_usuario',
      modulo: 'usuarios',
      registro_id: usuario.id,
      descripcion: `Restableció la contraseña de ${usuario.username}`,
      ip: req.ip
    });


    res.json({ message: 'Contraseña actualizada correctamente', usuario });
  } catch (error) {
    responderError(res, error);
  }
}


export async function updateUserStatus(req, res) {
  try {
    const { estado } = req.body;


    if (!['activo', 'inactivo'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido. Use: activo o inactivo' });
    }


    if (estado === 'inactivo' && String(req.user.id) === String(req.params.id)) {
      return res.status(403).json({ error: 'No puedes desactivar tu propia cuenta' });
    }


    const usuario = await changeUserStatus(req.params.id, estado);


    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: estado === 'activo' ? 'activar_usuario' : 'desactivar_usuario',
      modulo: 'usuarios',
      registro_id: usuario.id,
      descripcion: `${estado === 'activo' ? 'Activó' : 'Desactivó'} el usuario ${usuario.username}`,
      ip: req.ip
    });


    res.json({
      message: estado === 'activo' ? 'Usuario activado correctamente' : 'Usuario desactivado correctamente',
      usuario
    });
  } catch (error) {
    responderError(res, error);
  }
}


export async function removeUser(req, res) {
  try {
    if (String(req.user.id) === String(req.params.id)) {
      return res.status(403).json({ error: 'No puedes desactivar tu propia cuenta' });
    }


    const usuario = await deactivateUser(req.params.id);


    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'desactivar_usuario',
      modulo: 'usuarios',
      registro_id: usuario.id,
      descripcion: `Desactivó el usuario ${usuario.username}`,
      ip: req.ip
    });


    res.json({ message: 'Usuario desactivado correctamente', usuario });
  } catch (error) {
    responderError(res, error);
  }
}


export async function removeUserPermanent(req, res) {
  try {
    if (String(req.user.id) === String(req.params.id)) {
      return res.status(403).json({ error: 'No puedes eliminar tu propia cuenta' });
    }


    const objetivo = await getUserById(req.params.id);


    if (!objetivo) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }


    if (objetivo.rol?.nombre === 'administrador') {
      return res.status(403).json({ error: 'No se puede eliminar permanentemente a un administrador' });
    }


    const usuario = await deleteUserPermanent(req.params.id);


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'eliminar_usuario',
      modulo: 'usuarios',
      registro_id: objetivo.id,
      descripcion: `Eliminó permanentemente el usuario ${objetivo.username}`,
      ip: req.ip
    });


    res.json({ message: 'Usuario eliminado permanentemente', usuario });
  } catch (error) {
    responderError(res, error);
  }
}
