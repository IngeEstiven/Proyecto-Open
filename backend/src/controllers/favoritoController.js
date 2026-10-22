import { getFavoritos, createFavorito, deleteFavorito } from '../services/favoritoService.js';


import { createAuditLog } from '../services/auditService.js';
import { sendError } from '../middlewares/errorMiddleware.js';


const tiposPermitidos = ['juego', 'contenido', 'plataforma'];


export async function listFavoritos(req, res) {
  try {
    const favoritos = await getFavoritos(req.user.id);
    res.json(favoritos);
  } catch (error) {
    sendError(res, error);
  }
}


export async function addFavorito(req, res) {
  try {
    const { tipo, item_id } = req.body;


    if (!tipo || !tiposPermitidos.includes(tipo)) {
      return res.status(400).json({ error: 'Selecciona un tipo de favorito válido.' });
    }
    if (!item_id) {
      return res.status(400).json({ error: 'No pudimos identificar el contenido que quieres guardar. Recarga la página e intenta de nuevo.' });
    }


    const favorito = await createFavorito(req.user.id, tipo, item_id);


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'crear_favorito',
      modulo: 'favoritos',
      registro_id: favorito.id,
      descripcion: `Añadió un ${tipo} a sus favoritos`,
      ip: req.ip
    });


    res.status(201).json({ message: 'Añadido a favoritos correctamente', favorito });
  } catch (error) {
    sendError(res, error);
  }
}


export async function removeFavorito(req, res) {
  try {
    const favorito = await deleteFavorito(req.params.id, req.user.id);


    if (!favorito) {
      return res.status(404).json({ error: 'Favorito no encontrado' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'eliminar_favorito',
      modulo: 'favoritos',
      registro_id: favorito.id,
      descripcion: 'Eliminó un ítem de sus favoritos',
      ip: req.ip
    });


    res.json({ message: 'Favorito eliminado correctamente', favorito });
  } catch (error) {
    sendError(res, error);
  }
}
