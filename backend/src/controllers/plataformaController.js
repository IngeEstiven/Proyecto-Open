import {
  getPlataformas,
  createPlataforma,
  updatePlataforma,
  deletePlataforma,
  updatePlataformaImage
} from '../services/plataformaService.js';


import { uploadFileToStorage, createArchivo } from '../services/archivoService.js';
import { createAuditLog } from '../services/auditService.js';
import { sendError } from '../middlewares/errorMiddleware.js';


const seccionesPermitidas = ['peliculas', 'musica', 'en_vivo', 'deportes'];
const estadosPermitidos = ['activo', 'inactivo'];


function validateRequiredFields(body, requiereTodo = true) {
  const { nombre, seccion, estado } = body;


  if (requiereTodo && (!nombre || !seccion || !estado)) {
    return 'Nombre, sección y estado son obligatorios';
  }
  if (nombre !== undefined && !nombre) {
    return 'El nombre es obligatorio';
  }
  if (seccion !== undefined && !seccion) {
    return 'La sección es obligatoria';
  }
  if (seccion && !seccionesPermitidas.includes(seccion)) {
    return 'Sección inválida. Use: peliculas, musica, en_vivo o deportes';
  }
  if (estado && !estadosPermitidos.includes(estado)) {
    return 'Estado inválido. Use: activo o inactivo';
  }
  if (body.sitio_url && !/^https:\/\//i.test(body.sitio_url)) {
    return 'La URL del sitio debe comenzar con https://';
  }
  return null;
}


export async function listPlataformas(req, res) {
  try {
    const { seccion } = req.query;


    if (seccion && !seccionesPermitidas.includes(seccion)) {
      return res.status(400).json({ error: 'Sección inválida' });
    }


    const plataformas = await getPlataformas(req.user, { seccion });
    res.json(plataformas);
  } catch (error) {
    sendError(res, error);
  }
}


export async function addPlataforma(req, res) {
  try {
    const validationError = validateRequiredFields(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }


    const plataforma = await createPlataforma(req.body);


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'crear_plataforma',
      modulo: 'plataformas',
      registro_id: plataforma.id,
      descripcion: `Creó la plataforma ${plataforma.nombre}`,
      ip: req.ip
    });


    res.status(201).json({ message: 'Plataforma creada correctamente', plataforma });
  } catch (error) {
    sendError(res, error);
  }
}


export async function editPlataforma(req, res) {
  try {
    const validationError = validateRequiredFields(req.body, false);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }


    const plataforma = await updatePlataforma(req.params.id, req.body);


    if (!plataforma) {
      return res.status(404).json({ error: 'Plataforma no encontrada' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'actualizar_plataforma',
      modulo: 'plataformas',
      registro_id: plataforma.id,
      descripcion: `Actualizó la plataforma ${plataforma.nombre}`,
      ip: req.ip
    });


    res.json({ message: 'Plataforma actualizada correctamente', plataforma });
  } catch (error) {
    sendError(res, error);
  }
}


export async function removePlataforma(req, res) {
  try {
    const plataforma = await deletePlataforma(req.params.id);


    if (!plataforma) {
      return res.status(404).json({ error: 'Plataforma no encontrada' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'eliminar_plataforma',
      modulo: 'plataformas',
      registro_id: plataforma.id,
      descripcion: `Eliminó la plataforma ${plataforma.nombre}`,
      ip: req.ip
    });


    res.json({ message: 'Plataforma eliminada correctamente', plataforma });
  } catch (error) {
    sendError(res, error);
  }
}


export async function uploadPlataformaImagen(req, res) {
  try {
    const { id } = req.params;


    if (!req.file) {
      return res.status(400).json({ error: 'Selecciona una imagen de la plataforma antes de subirla.' });
    }


    const uploadedFile = await uploadFileToStorage(req.file, 'plataformas');
    const archivo = await createArchivo(
      { ...uploadedFile, modulo: 'plataformas', referencia_id: id },
      req.user
    );
    const plataforma = await updatePlataformaImage(id, archivo.url);


    if (!plataforma) {
      return res.status(404).json({ error: 'Plataforma no encontrada' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'subir_imagen_plataforma',
      modulo: 'plataformas',
      registro_id: plataforma.id,
      descripcion: `Subió la imagen de la plataforma ${plataforma.nombre}`,
      ip: req.ip
    });


    res.json({ message: 'Imagen de la plataforma actualizada correctamente', archivo, plataforma });
  } catch (error) {
    sendError(res, error);
  }
}
