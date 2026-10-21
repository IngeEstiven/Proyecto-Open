import jwt from 'jsonwebtoken';

import { getAuthUser } from '../services/authService.js';


// Verifica el JWT y, además, confirma contra la base de datos (con caché de 30 s)
// que la cuenta siga activa y usa el rol vigente, no el que venía en el token.
// Así, al desactivar a un usuario o cambiarle el rol, el efecto es inmediato
// (o tarda como máximo 30 s) sin necesidad de que vuelva a iniciar sesión.
export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;


  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }


  const [type, token] = authHeader.split(' ');


  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }


  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }


  try {
    const cuenta = await getAuthUser(decoded.id);


    if (!cuenta || cuenta.estado !== 'activo') {
      return res.status(403).json({
        error: 'Tu cuenta fue desactivada. Ya no tienes acceso a OpenLeaf.',
        code: 'account_inactive'
      });
    }


    req.user = { ...decoded, rol: cuenta.rol };
    next();
  } catch (error) {
    console.error('Error verificando el estado del usuario:', error.message);
    return res.status(500).json({ error: 'Ocurrió un error inesperado. Intenta de nuevo.' });
  }
}


export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }


    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
    }


    next();
  };
}
