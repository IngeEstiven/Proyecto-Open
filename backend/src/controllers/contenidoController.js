import {
  getContenidos,
  getContenidoById,
  createContenido,
  updateContenido,
  deleteContenido
} from '../services/contenidoService.js';


import { createAuditLog } from '../services/auditService.js';
import { esGeneroDeSeccion, SECCIONES, FUENTES, extraerIdSpotify } from '../services/catalogoConstantes.js';


const seccionesPermitidas = SECCIONES;
const fuentesPermitidas = FUENTES;
const estadosPermitidos = ['borrador', 'publicado', 'despublicado'];
const hostsPermitidos = ['www.youtube.com', 'www.youtube-nocookie.com', 'player.twitch.tv', 'archive.org'];


function esHostAudioPermitido(hostname) {
  return (
    hostname === 'jamendo.com' ||
    hostname.endsWith('.jamendo.com') ||
    hostname === 'open.spotify.com'
  );
}


function validarSpotify(body) {
  const externalValor = String(body.external_id || '').trim();
  const embedValor = String(body.embed_url || '').trim();

  // Si pegan la URL de Spotify en cualquiera de los dos campos, se acepta.
  const id = extraerIdSpotify(embedValor) || extraerIdSpotify(externalValor);
  if (!id) {
    return 'Para Spotify, pega un enlace open.spotify.com/track/... o el ID de la canción (solo letras y números)';
  }
  return null;
}


function validarEmbed(embed_url) {
  let parsed;
  try {
    parsed = new URL(embed_url);
  } catch {
    return 'La URL del embed no es válida';
  }


  if (parsed.protocol !== 'https:') {
    return 'La URL del embed debe comenzar con https://';
  }


  if (!hostsPermitidos.includes(parsed.hostname) && !esHostAudioPermitido(parsed.hostname)) {
    return 'El host del embed no está permitido. Use YouTube, Twitch, archive.org, un audio de Jamendo o Spotify';
  }


  return null;
}


function validarGenero(seccion, genero) {
  if (genero === null || genero === undefined || genero === '') return null;
  if (!seccion) return null;
  if (!esGeneroDeSeccion(seccion, genero)) return 'Género inválido para esta sección';
  return null;
}


function validateRequiredFields(body, requiereTodo = true) {
  const { seccion, titulo, fuente, estado } = body;


  if (requiereTodo && (!seccion || !titulo || !fuente || !estado)) {
    return 'Sección, título, fuente y estado son obligatorios';
  }
  if (titulo !== undefined && !titulo) {
    return 'El título es obligatorio';
  }
  if (seccion && !seccionesPermitidas.includes(seccion)) {
    return 'Sección inválida. Use: peliculas, musica, en_vivo o deportes';
  }
  if (fuente && !fuentesPermitidas.includes(fuente)) {
    return 'Fuente inválida. Use: youtube, twitch, otro o spotify';
  }
  if (estado && !estadosPermitidos.includes(estado)) {
    return 'Estado inválido. Use: borrador, publicado o despublicado';
  }


  const generoEnviado = Object.prototype.hasOwnProperty.call(body, 'genero');
  if (generoEnviado && seccion) {
    const errorGenero = validarGenero(seccion, body.genero);
    if (errorGenero) return errorGenero;
  }


  const embedEnviado = Object.prototype.hasOwnProperty.call(body, 'embed_url');
  const externalEnviado = Object.prototype.hasOwnProperty.call(body, 'external_id');
  const embedValor = embedEnviado ? String(body.embed_url || '').trim() : '';
  const externalValor = externalEnviado ? String(body.external_id || '').trim() : '';

  // Spotify: el ID o el enlace se normalizan a embed_url en el servicio, así
  // que aquí solo se valida el formato (no pasa por validarEmbed).
  const esSpotify =
    body.fuente === 'spotify' ||
    (!body.fuente && (extraerIdSpotify(embedValor) || extraerIdSpotify(externalValor)) !== '');
  if (esSpotify) {
    if (requiereTodo && !externalValor && !embedValor) {
      return 'Debes enviar el enlace o el ID de Spotify';
    }
    if (!requiereTodo && (embedEnviado || externalEnviado) && !externalValor && !embedValor) {
      return 'Debes enviar el enlace o el ID de Spotify';
    }
    if (embedValor || externalValor) {
      const errorSpotify = validarSpotify(body);
      if (errorSpotify) return errorSpotify;
    }
    return null;
  }


  if (requiereTodo && !externalValor && !embedValor) {
    return 'Debes enviar external_id o embed_url';
  }


  if (!requiereTodo && (embedEnviado || externalEnviado) && !externalValor && !embedValor) {
    return 'Debes enviar external_id o embed_url';
  }


  if (embedValor) {
    const errorEmbed = validarEmbed(embedValor);
    if (errorEmbed) return errorEmbed;
  }


  return null;
}


function responderError(res, error) {
  return res.status(500).json({ error: error.message });
}


export async function listContenidos(req, res) {
  try {
    const { seccion, q, genero } = req.query;


    if (seccion && !seccionesPermitidas.includes(seccion)) {
      return res.status(400).json({ error: 'Sección inválida' });
    }


    if (genero && seccion && !esGeneroDeSeccion(seccion, genero)) {
      return res.status(400).json({ error: 'Género inválido para esta sección' });
    }


    const contenidos = await getContenidos(req.user, { seccion, q, genero });
    res.json(contenidos);
  } catch (error) {
    responderError(res, error);
  }
}


export async function getContenidoDetail(req, res) {
  try {
    const contenido = await getContenidoById(req.params.id, req.user);


    if (!contenido) {
      return res.status(404).json({ error: 'Contenido no encontrado' });
    }


    res.json(contenido);
  } catch (error) {
    responderError(res, error);
  }
}


export async function addContenido(req, res) {
  try {
    const validationError = validateRequiredFields(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }


    const contenido = await createContenido(req.body, req.user.id);


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'crear_contenido',
      modulo: 'contenidos',
      registro_id: contenido.id,
      descripcion: `Creó el contenido ${contenido.titulo}`,
      ip: req.ip
    });


    res.status(201).json({ message: 'Contenido creado correctamente', contenido });
  } catch (error) {
    responderError(res, error);
  }
}


export async function editContenido(req, res) {
  try {
    const validationError = validateRequiredFields(req.body, false);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }


    const generoEnviado = Object.prototype.hasOwnProperty.call(req.body, 'genero');
    if (generoEnviado && req.body.seccion === undefined) {
      const actual = await getContenidoById(req.params.id, req.user);
      if (!actual) {
        return res.status(404).json({ error: 'Contenido no encontrado' });
      }
      const errorGenero = validarGenero(actual.seccion, req.body.genero);
      if (errorGenero) {
        return res.status(400).json({ error: errorGenero });
      }
    }


    const contenido = await updateContenido(req.params.id, req.body);


    if (!contenido) {
      return res.status(404).json({ error: 'Contenido no encontrado' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'actualizar_contenido',
      modulo: 'contenidos',
      registro_id: contenido.id,
      descripcion: `Actualizó el contenido ${contenido.titulo}`,
      ip: req.ip
    });


    res.json({ message: 'Contenido actualizado correctamente', contenido });
  } catch (error) {
    responderError(res, error);
  }
}


export async function removeContenido(req, res) {
  try {
    const contenido = await deleteContenido(req.params.id);


    if (!contenido) {
      return res.status(404).json({ error: 'Contenido no encontrado' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'eliminar_contenido',
      modulo: 'contenidos',
      registro_id: contenido.id,
      descripcion: `Eliminó el contenido ${contenido.titulo}`,
      ip: req.ip
    });


    res.json({ message: 'Contenido eliminado correctamente', contenido });
  } catch (error) {
    responderError(res, error);
  }
}
