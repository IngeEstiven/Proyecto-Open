import { createPedido, getPedidosMios, getPedidos, changeEstadoPedido } from '../services/pedidoService.js';


import { createAuditLog } from '../services/auditService.js';
import { sendError } from '../middlewares/errorMiddleware.js';


const plataformasPedido = ['pc', 'consola'];
const estadosPedido = ['pendiente', 'atendido', 'cancelado'];


function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


export async function addPedido(req, res) {
  try {
    const { juego_id, nombre_completo, correo, telefono, plataforma, direccion_envio } = req.body;


    if (!juego_id || !nombre_completo || !correo || !telefono || !plataforma || !direccion_envio) {
      return res.status(400).json({
        error: 'Juego, nombre completo, correo, teléfono, plataforma y dirección de envío son obligatorios'
      });
    }
    if (!esEmailValido(correo)) {
      return res.status(400).json({ error: 'El correo no tiene un formato válido' });
    }
    if (!plataformasPedido.includes(plataforma)) {
      return res.status(400).json({ error: 'Selecciona una plataforma válida (PC o consola).' });
    }


    const pedido = await createPedido(req.user.id, {
      juego_id,
      nombre_completo,
      correo,
      telefono,
      plataforma,
      direccion_envio
    });


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'crear_pedido',
      modulo: 'pedidos',
      registro_id: pedido.id,
      descripcion: `Creó un pedido del juego ${pedido.juego?.titulo || pedido.juego_id}`,
      ip: req.ip
    });


    res.status(201).json({ message: 'Pedido creado correctamente', pedido });
  } catch (error) {
    sendError(res, error);
  }
}


export async function listPedidosMios(req, res) {
  try {
    const pedidos = await getPedidosMios(req.user.id);
    res.json(pedidos);
  } catch (error) {
    sendError(res, error);
  }
}


export async function listPedidos(req, res) {
  try {
    const pedidos = await getPedidos();
    res.json(pedidos);
  } catch (error) {
    sendError(res, error);
  }
}


export async function updateEstadoPedido(req, res) {
  try {
    const { estado } = req.body;


    if (!estado || !estadosPedido.includes(estado)) {
      return res.status(400).json({ error: 'Selecciona un estado de pedido válido.' });
    }


    const pedido = await changeEstadoPedido(req.params.id, estado);


    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }


    await createAuditLog({
      usuario_id: req.user.id,
      accion: 'cambiar_estado_pedido',
      modulo: 'pedidos',
      registro_id: pedido.id,
      descripcion: `Cambió el estado del pedido a ${pedido.estado}`,
      ip: req.ip
    });


    res.json({ message: 'Estado del pedido actualizado correctamente', pedido });
  } catch (error) {
    sendError(res, error);
  }
}
