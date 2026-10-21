import { useEffect, useState } from 'react';

import { useToast } from '../../components/admin/Toast.jsx';
import useTituloPagina from '../../hooks/useTituloPagina.js';
import { cambiarEstadoPedido, listarPedidos } from '../../services/pedidosService.js';

const ESTADOS = ['pendiente', 'atendido', 'cancelado'];

const COLOR_ESTADO = {
  pendiente: 'bg-amber-500/15 text-amber-300',
  atendido: 'bg-emerald-500/15 text-emerald-300',
  cancelado: 'bg-rose-500/15 text-rose-300'
};

export default function PedidosPage() {
  useTituloPagina('Pedidos · OpenLeaf');
  const toast = useToast();

  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargar = () => {
    setCargando(true);
    listarPedidos()
      .then(setPedidos)
      .catch((err) => toast.error(err.message))
      .finally(() => setCargando(false));
  };

  const refrescar = () => {
    listarPedidos()
      .then(setPedidos)
      .catch((err) => toast.error(err.message));
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cambiarEstado = async (pedido, estado) => {
    try {
      await cambiarEstadoPedido(pedido.id, estado);
      toast.exito('Estado del pedido actualizado correctamente');
      refrescar();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <h2 className="sv-section-title text-lg m-0"><i className="fas fa-shopping-bag mr-2 sv-text-gradient"></i>Pedidos</h2>
      </div>

      <div className="sv-section overflow-x-auto">
        {cargando ? (
          <p className="text-[#94a3b8] text-sm m-0">Cargando pedidos…</p>
        ) : (
          <table className="sv-admin-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Juego</th>
                <th>Plataforma</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>
                    <div className="font-semibold text-white">{pedido.nombre_completo}</div>
                    <div className="text-[#64748b] text-xs">{pedido.correo} · {pedido.telefono}</div>
                    <div className="text-[#64748b] text-xs">{pedido.direccion_envio}</div>
                    {pedido.usuario && <div className="text-[#475569] text-xs">@{pedido.usuario.username}</div>}
                  </td>
                  <td>{pedido.juego?.titulo || pedido.juego_id}</td>
                  <td className="capitalize">{pedido.plataforma}</td>
                  <td>{formatearFecha(pedido.created_at)}</td>
                  <td>
                    <div className="flex flex-col gap-2">
                      <span className={`sv-admin-chip ${COLOR_ESTADO[pedido.estado] || ''}`}>{pedido.estado}</span>
                      <select
                        value={pedido.estado}
                        onChange={(evento) => cambiarEstado(pedido, evento.target.value)}
                        className="sv-input py-1 text-xs"
                      >
                        {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {pedidos.length === 0 && (
                <tr><td colSpan={5} className="text-center text-[#64748b]">No hay pedidos registrados.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
