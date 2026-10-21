import { getFavoritos, createFavorito, deleteFavorito } from '../services/favoritoService.js';


import { createAuditLog } from '../services/auditService.js';


const tiposPermitidos = ['juego', 'contenido', 'plataforma'];


export async function listFavoritos(req, res) {
  try {
    const favoritos = await getFavoritos(req.user.id);
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export async function addFavorito(req, res) {
  try {
    const { tipo, item_id } = req.body;


    if (!tipo || !tiposPermitidos.includes(tipo)) {
      return res.status(400).json({ error: 'Tipo inválido. Use: juego, contenido o plataforma' });
    }
    if (!item_id) {
      return res.status(400).json({ error: 'El identificador del ítem es obligatorio' });
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
    if (error.message === 'El ítem ya está en tus favoritos') {
      return res.status(409).json({ error: error.message });
    }
    if (error.message === 'El ítem no existe') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
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
    if (error.message === 'Este favorito no te pertenece') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}
