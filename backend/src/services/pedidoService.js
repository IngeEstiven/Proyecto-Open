import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../middlewares/errorMiddleware.js';


const PEDIDO_SELECT = `
  id, usuario_id, juego_id, nombre_completo, correo, telefono, plataforma,
  direccion_envio, estado, created_at, updated_at,
  juego:juegos ( id, titulo, slug, imagen_url, estado )
`;


const PEDIDO_SELECT_ADMIN = `
  ${PEDIDO_SELECT},
  usuario:usuarios ( id, nombre, apellido, username, email )
`;


export async function createPedido(usuarioId, pedidoData) {
  const { data: juegos, error: juegoError } = await supabaseAdmin
    .from('juegos')
    .select('id, estado')
    .eq('id', pedidoData.juego_id)
    .limit(1);


  if (juegoError) throw new Error(juegoError.message);
  if (!juegos || juegos.length === 0) throw new AppError(404, 'El juego que quieres pedir ya no está disponible.');
  if (juegos[0].estado !== 'publicado') {
    throw new AppError(400, 'Este juego no está disponible para pedidos en este momento.');
  }


  const { data, error } = await supabaseAdmin
    .from('pedidos')
    .insert([
      {
        usuario_id: usuarioId,
        juego_id: pedidoData.juego_id,
        nombre_completo: pedidoData.nombre_completo.trim(),
        correo: pedidoData.correo.trim().toLowerCase(),
        telefono: pedidoData.telefono.trim(),
        plataforma: pedidoData.plataforma,
        direccion_envio: pedidoData.direccion_envio.trim(),
        estado: 'pendiente'
      }
    ])
    .select(PEDIDO_SELECT);


  if (error) throw new Error(error.message);
  return data[0];
}


export async function getPedidosMios(usuarioId) {
  const { data, error } = await supabaseAdmin
    .from('pedidos')
    .select(PEDIDO_SELECT)
    .eq('usuario_id', usuarioId)
    .order('created_at', { ascending: false });


  if (error) throw new Error(error.message);
  return data;
}


export async function getPedidos() {
  const { data, error } = await supabaseAdmin
    .from('pedidos')
    .select(PEDIDO_SELECT_ADMIN)
    .order('created_at', { ascending: false });


  if (error) throw new Error(error.message);
  return data;
}


export async function changeEstadoPedido(id, estado) {
  const { data, error } = await supabaseAdmin
    .from('pedidos')
    .update({ estado, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(PEDIDO_SELECT);


  if (error) throw new Error(error.message);
  return data[0] || null;
}
