import {
  registerUser,
  loginUser,
  getMe as getMeService,
  updateMe as updateMeService,
  updateAvatarUser,
  changeMyPassword as changeMyPasswordService,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
  verifyEmail as verifyEmailService,
  resendVerification as resendVerificationService,
  requestEmailChange as requestEmailChangeService,
  confirmEmailChange as confirmEmailChangeService,
  EDAD_MINIMA,
  esMayorDeEdad
} from '../services/authService.js';


import { uploadFileToStorage, createArchivo } from '../services/archivoService.js';
import { createAuditLog } from '../services/auditService.js';
import { AppError, sendError } from '../middlewares/errorMiddleware.js';


function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


export async function register(req, res) {
  try {
    const { nombre, apellido, pais, fecha_nacimiento, username, email, password, acepta_terminos } = req.body;
    const aceptaNovedades = req.body.acepta_novedades;


    const camposObligatorios = [
      'nombre', 'apellido', 'pais', 'fecha_nacimiento', 'username', 'email', 'password', 'acepta_terminos'
    ];
    if (
      camposObligatorios.some(
        (campo) =>
          req.body[campo] === undefined ||
          req.body[campo] === null ||
          String(req.body[campo]).trim() === ''
      )
    ) {
      return res.status(400).json({
        error: 'Nombre, apellido, país, fecha de nacimiento, correo, usuario, contraseña y aceptación de términos son obligatorios'
      });
    }
    if (!esEmailValido(email)) {
      return res.status(400).json({ error: 'El correo no tiene un formato válido' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }
    if (req.body.acepta_terminos !== true) {
      return res.status(400).json({ error: 'Debes aceptar los términos y condiciones' });
    }
    if (aceptaNovedades !== undefined && typeof aceptaNovedades !== 'boolean') {
      return res.status(400).json({ error: 'acepta_novedades debe ser verdadero o falso' });
    }
    if (!esMayorDeEdad(fecha_nacimiento)) {
      return res.status(400).json({
        error: `La fecha de nacimiento no es válida o debes ser mayor de ${EDAD_MINIMA} años`
      });
    }


    const cuenta = await registerUser({
      nombre,
      apellido,
      pais,
      fecha_nacimiento,
      username,
      email,
      password,
      acepta_terminos,
      acepta_novedades: Boolean(aceptaNovedades)
    });


    await createAuditLog({
      usuario_id: cuenta.id,
      accion: 'registro',
      modulo: 'usuarios',
      registro_id: cuenta.id,
      descripcion: `Se registró el usuario ${cuenta.username} (pendiente de verificación de correo)`,
      ip: req.ip
    });


    res.status(201).json({
      message: 'Te enviamos un código de verificación a tu correo',
      email: cuenta.email,
      requires_verification: true
    });
  } catch (error) {
    return sendError(res, error);
  }
}


export async function login(req, res) {
  try {
    // Permite recibir 'identifier', 'username' o 'email' desde el frontend
    const { identifier, username, email, password } = req.body;
    const loginInput = (identifier || username || email || '').trim();

    if (!loginInput || !password) {
      return res.status(400).json({
        error: 'El usuario/correo y la contraseña son obligatorios'
      });
    }

    // Le pasamos el identificador (que puede ser correo o username) a la función del servicio
    const result = await loginUser(loginInput, password);

    await createAuditLog({
      usuario_id: result.user.id,
      accion: 'iniciar_sesion',
      modulo: 'usuarios',
      registro_id: result.user.id,
      descripcion: `${result.user.username} inició sesión`,
      ip: req.ip
    });

    res.json({ message: 'Sesión iniciada correctamente', token: result.token, user: result.user });
  } catch (error) {
    if (error instanceof AppError && error.status === 403 && error.data && error.data.needs_verification) {
      return res.status(403).json({
        error: error.message,
        needs_verification: true,
        email: error.data.email
      });
    }
    return sendError(res, error);
  }
}


export async function verifyEmail(req, res) {
  try {
    const { email, code } = req.body;


    if (!email || !code) {
      return res.status(400).json({ error: 'Correo y código son obligatorios' });
    }
    if (!esEmailValido(email)) {
      return res.status(400).json({ error: 'El correo no tiene un formato válido' });
    }


    const result = await verifyEmailService(email, code);


    await createAuditLog({
      usuario_id: result.user.id,
      accion: 'verificar_email',
      modulo: 'usuarios',
      registro_id: result.user.id,
      descripcion: `${result.user.username} verificó su correo`,
      ip: req.ip
    });


    res.json({ message: 'Correo verificado correctamente', token: result.token, user: result.user });
  } catch (error) {
    return sendError(res, error);
  }
}


export async function resendVerification(req, res) {
  try {
    const { email } = req.body;


    if (!email) {
      return res.status(400).json({ error: 'El correo es obligatorio' });
    }
    if (!esEmailValido(email)) {
      return res.status(400).json({ error: 'El correo no tiene un formato válido' });
    }


    const resultado = await resendVerificationService(email);


    if (resultado.enviado && resultado.usuario) {
      await createAuditLog({
        usuario_id: resultado.usuario.id,
        accion: 'reenviar_verificacion',
        modulo: 'usuarios',
        registro_id: resultado.usuario.id,
        descripcion: `${resultado.usuario.nombre} solicitó reenviar el código de verificación`,
        ip: req.ip
      });
    }


    res.json({ message: 'Si tu correo está pendiente de verificación, recibirás un nuevo código' });
  } catch (error) {
    return sendError(res, error);
  }
}


export async function getMe(req, res) {
  try {
    const user = await getMeService(req.user.id);


    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }


    res.json(user);
  } catch (error) {
    return sendError(res, error);
  }
}


export async function updateMe(req, res) {
  try {
    const camposProhibidos = ['rol', 'estado', 'password', 'email'];
    const camposPermitidos = ['nombre', 'apellido', 'username', 'pais', 'fecha_nacimiento', 'acepta_novedades'];
    const enviado = Object.keys(req.body);


    if (enviado.some((campo) => camposProhibidos.includes(campo))) {
      return res.status(403).json({
        error: 'No puedes modificar el rol, el estado, la contraseña ni el correo desde este endpoint'
      });
    }
    if (enviado.length === 0 || !enviado.some((campo) => camposPermitidos.includes(campo))) {
      return res.status(400).json({ error: 'Debes enviar al menos un campo del perfil' });
    }


    for (const campo of camposPermitidos) {
      if (!enviado.includes(campo)) continue;
      const valor = req.body[campo];


      if (campo === 'acepta_novedades') {
        if (typeof valor !== 'boolean') {
          return res.status(400).json({ error: 'acepta_novedades debe ser verdadero o falso' });
        }
      } else if (campo === 'fecha_nacimiento') {
        if (!esMayorDeEdad(valor)) {
          return res.status(400).json({
            error: `La fecha de nacimiento no es válida o debes ser mayor de ${EDAD_MINIMA} años`
          });
        }
      } else if (typeof valor === 'string' && !valor.trim()) {
        return res.status(400).json({ error: 'Los campos de texto no pueden estar vacíos' });
      }
    }


    const user = await updateMeService(req.user.id, req.body);


    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'actualizar_perfil',
      modulo: 'usuarios',
      registro_id: req.user.id,
      descripcion: `Actualizó su perfil ${user.username}`,
      ip: req.ip
    });


    res.json({ message: 'Perfil actualizado correctamente', user });
  } catch (error) {
    return sendError(res, error);
  }
}


export async function requestEmailChange(req, res) {
  try {
    const { newEmail, password } = req.body;


    if (!newEmail || !password) {
      return res.status(400).json({ error: 'El nuevo correo y la contraseña son obligatorios' });
    }
    if (!esEmailValido(newEmail)) {
      return res.status(400).json({ error: 'El correo no tiene un formato válido' });
    }


    const cuenta = await requestEmailChangeService(req.user.id, newEmail, password);


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'solicitar_cambio_email',
      modulo: 'usuarios',
      registro_id: req.user.id,
      descripcion: `${cuenta.username} solicitó cambiar su correo`,
      ip: req.ip
    });


    res.json({ message: 'Te enviamos un código de verificación al nuevo correo' });
  } catch (error) {
    return sendError(res, error);
  }
}


export async function confirmEmailChange(req, res) {
  try {
    const { code } = req.body;


    if (!code) {
      return res.status(400).json({ error: 'El código es obligatorio' });
    }


    const user = await confirmEmailChangeService(req.user.id, code);


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'confirmar_cambio_email',
      modulo: 'usuarios',
      registro_id: req.user.id,
      descripcion: `${user.username} confirmó su nuevo correo`,
      ip: req.ip
    });


    res.json({ message: 'Correo actualizado correctamente', user });
  } catch (error) {
    return sendError(res, error);
  }
}


export async function updateAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Debes enviar una imagen en el campo file' });
    }


    const uploadedFile = await uploadFileToStorage(req.file, 'perfiles');
    const archivo = await createArchivo(
      { ...uploadedFile, modulo: 'perfiles', referencia_id: req.user.id },
      req.user
    );
    const user = await updateAvatarUser(req.user.id, archivo.url);


    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'actualizar_avatar',
      modulo: 'usuarios',
      registro_id: req.user.id,
      descripcion: `${user.username} actualizó su foto de perfil`,
      ip: req.ip
    });


    res.json({ message: 'Avatar actualizado correctamente', archivo, user });
  } catch (error) {
    return sendError(res, error);
  }
}


export async function changeMyPassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;


    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Debes enviar la contraseña actual y la nueva contraseña' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' });
    }


    await changeMyPasswordService(req.user.id, currentPassword, newPassword);


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'cambiar_password',
      modulo: 'usuarios',
      registro_id: req.user.id,
      descripcion: `${req.user.username} cambió su contraseña`,
      ip: req.ip
    });


    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    return sendError(res, error);
  }
}


export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;


    if (!email) {
      return res.status(400).json({ error: 'El correo es obligatorio' });
    }


    const result = await forgotPasswordService(email);


    res.json(result);
  } catch (error) {
    return sendError(res, error);
  }
}


export async function resetPassword(req, res) {
  try {
    const { email, code, newPassword } = req.body;


    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Correo, código y nueva contraseña son obligatorios' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' });
    }


    const result = await resetPasswordService(email, code, newPassword);


    await createAuditLog({
      usuario_id: result.id,
      accion: 'recuperar_password',
      modulo: 'usuarios',
      registro_id: result.id,
      descripcion: 'Recuperó su contraseña con código de verificación',
      ip: req.ip
    });


    res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    return sendError(res, error);
  }
}