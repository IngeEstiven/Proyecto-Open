import {
  getJuegos,
  getJuegoBySlug,
  createJuego,
  updateJuego,
  changeEstadoJuego,
  deleteJuego,
  updateJuegoImage
} from '../services/juegoService.js';


import { uploadFileToStorage, createArchivo } from '../services/archivoService.js';
import { createAuditLog } from '../services/auditService.js';
import { sendError } from '../middlewares/errorMiddleware.js';


const categoriasPermitidas = ['accion', 'terror', 'deportes', 'cooperativo'];
const estadosPermitidos = ['borrador', 'publicado', 'despublicado'];


function validateRequiredFields(body) {
  const { titulo, categoria, estado } = body;


  if (!titulo || !categoria || !estado) {
    return 'Título, categoría y estado son obligatorios';
  }
  if (!categoriasPermitidas.includes(categoria)) {
    return 'Categoría inválida. Use: accion, terror, deportes o cooperativo';
  }
  if (!estadosPermitidos.includes(estado)) {
    return 'Estado inválido. Use: borrador, publicado o despublicado';
  }
  if (body.webgl_url && !/^https:\/\//i.test(body.webgl_url)) {
    return 'La URL del juego WebGL debe comenzar con https://';
  }
  return null;
}


export async function listJuegos(req, res) {
  try {
    const { categoria, q } = req.query;


    if (categoria && !categoriasPermitidas.includes(categoria)) {
      return res.status(400).json({ error: 'Categoría inválida' });
    }


    const juegos = await getJuegos(req.user, { categoria, q });
    res.json(juegos);
  } catch (error) {
    sendError(res, error);
  }
}


export async function getJuegoDetail(req, res) {
  try {
    const juego = await getJuegoBySlug(req.params.slug, req.user);


    if (!juego) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }


    res.json(juego);
  } catch (error) {
    sendError(res, error);
  }
}


export async function addJuego(req, res) {
  try {
    const validationError = validateRequiredFields(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }


    const juego = await createJuego(req.body);


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'crear_juego',
      modulo: 'juegos',
      registro_id: juego.id,
      descripcion: `Creó el juego ${juego.titulo}`,
      ip: req.ip
    });


    res.status(201).json({ message: 'Juego creado correctamente', juego });
  } catch (error) {
    sendError(res, error);
  }
}


export async function editJuego(req, res) {
  try {
    const validationError = validateRequiredFields(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }


    const juego = await updateJuego(req.params.id, req.body);


    if (!juego) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'actualizar_juego',
      modulo: 'juegos',
      registro_id: juego.id,
      descripcion: `Actualizó el juego ${juego.titulo}`,
      ip: req.ip
    });


    res.json({ message: 'Juego actualizado correctamente', juego });
  } catch (error) {
    sendError(res, error);
  }
}


export async function updateEstadoJuego(req, res) {
  try {
    const { estado } = req.body;


    if (!estado || !estadosPermitidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido. Use: borrador, publicado o despublicado' });
    }


    const juego = await changeEstadoJuego(req.params.id, estado);


    if (!juego) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'cambiar_estado_juego',
      modulo: 'juegos',
      registro_id: juego.id,
      descripcion: `Cambió el estado del juego a ${juego.estado}`,
      ip: req.ip
    });


    res.json({ message: 'Estado del juego actualizado correctamente', juego });
  } catch (error) {
    sendError(res, error);
  }
}


export async function removeJuego(req, res) {
  try {
    const juego = await deleteJuego(req.params.id);


    if (!juego) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'eliminar_juego',
      modulo: 'juegos',
      registro_id: juego.id,
      descripcion: `Eliminó el juego ${juego.titulo}`,
      ip: req.ip
    });


    res.json({ message: 'Juego eliminado correctamente', juego });
  } catch (error) {
    sendError(res, error);
  }
}


export async function uploadJuegoImagen(req, res) {
  try {
    const { id } = req.params;


    if (!req.file) {
      return res.status(400).json({ error: 'Selecciona una imagen del juego antes de subirla.' });
    }


    const uploadedFile = await uploadFileToStorage(req.file, 'juegos');
    const archivo = await createArchivo(
      { ...uploadedFile, modulo: 'juegos', referencia_id: id },
      req.user
    );
    const juego = await updateJuegoImage(id, archivo.url);


    if (!juego) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'subir_imagen_juego',
      modulo: 'juegos',
      registro_id: juego.id,
      descripcion: `Subió la imagen del juego ${juego.titulo}`,
      ip: req.ip
    });


    res.json({ message: 'Imagen del juego actualizada correctamente', archivo, juego });
  } catch (error) {
    sendError(res, error);
  }
}
