import { buscarCanciones as buscarCancionesJamendo } from '../services/jamendoService.js';
import { importarCanciones as importarCancionesMusica } from '../services/musicaService.js';
import { createAuditLog } from '../services/auditService.js';
import { AppError, sendError } from '../middlewares/errorMiddleware.js';

// Búsqueda en Jamendo (cualquier usuario con sesión).
export async function buscar(req, res) {
  try {
    const q = String(req.query.q ?? '').trim();
    if (q.length < 2) {
      throw new AppError(400, 'Escribe al menos 2 caracteres para buscar en Jamendo');
    }

    const canciones = await buscarCancionesJamendo(q, req.query.limite);
    res.json(canciones);
  } catch (error) {
    sendError(res, error);
  }
}

// Importación de una o varias canciones de Jamendo (solo administrador).
export async function importar(req, res) {
  try {
    const canciones = Array.isArray(req.body) ? req.body : req.body?.canciones;
    if (!Array.isArray(canciones) || canciones.length === 0) {
      throw new AppError(400, 'Debes enviar al menos una canción para importar');
    }

    const { contenidos, repetidas } = await importarCancionesMusica(canciones, req.user.id);

    if (contenidos.length === 0) {
      return res.json({
        message: 'Las canciones enviadas ya estaban importadas',
        contenidos: [],
        repetidas
      });
    }

    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'importar_musica',
      modulo: 'musica',
      registro_id: contenidos[0].id,
      descripcion: `Importó ${contenidos.length} canción(es) desde Jamendo`,
      ip: req.ip
    });

    res.status(201).json({
      message: `Se importaron ${contenidos.length} canción(es) desde Jamendo`,
      contenidos,
      repetidas
    });
  } catch (error) {
    sendError(res, error);
  }
}
