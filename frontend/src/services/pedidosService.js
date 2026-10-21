import axiosClient, { extraerError } from '../api/axiosClient.js';

export async function crearPedido(datos) {
  try {
    const { data } = await axiosClient.post('/pedidos', datos);
    return data.pedido;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}

export async function listarMisPedidos() {
  try {
    const { data } = await axiosClient.get('/pedidos/mios');
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}

export async function listarPedidos() {
  try {
    const { data } = await axiosClient.get('/pedidos');
    return data;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}

export async function cambiarEstadoPedido(id, estado) {
  try {
    const { data } = await axiosClient.patch(`/pedidos/${id}/estado`, { estado });
    return data.pedido;
  } catch (error) {
    throw new Error(extraerError(error));
  }
}
