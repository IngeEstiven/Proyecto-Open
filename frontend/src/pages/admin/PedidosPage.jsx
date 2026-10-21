import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import useTituloPagina from '../../hooks/useTituloPagina.js';
import { LOGO_URL } from '../../services/informacionSitio.js';
import { listarMisPedidos } from '../../services/pedidosService.js';

const CLASE_ESTADO = {
  pendiente: 'border-amber-400/50 text-amber-300 bg-amber-400/10',
  atendido: 'border-indigo-400/50 text-indigo-300 bg-indigo-400/10',
  cancelado: 'border-rose-500/50 text-rose-300 bg-rose-500/10'
};

export default function PedidosPage() {
  useTituloPagina('Mis pedidos | OpenLeaf');
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let vivo = true;
    setCargando(true);
    listarMisPedidos()
      .then((datos) => {
        if (vivo) setPedidos(datos);
      })
      .catch((err) => {
        if (vivo) setError(err.message);
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });
    return () => {
      vivo = false;
    };
  }, []);

  return (
    <main className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 min-h-[50vh]">
      <div className="pb-4 mb-6 border-b border-[rgba(102,126,234,.2)]">
        <h1 className="sv-section-title mb-1"><i className="fas fa-list-check mr-2 sv-text-gradient"></i>Mis pedidos</h1>
        <p className="text-[#94a3b8] text-sm m-0">Seguimiento de tus pedidos de GameZone</p>
      </div>

      {cargando && (
        <div className="text-center py-10 text-[#94a3b8]">
          <span className="animate-spin inline-block rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-3"></span>
          <p className="m-0">Cargando pedidos…</p>
        </div>
      )}

      {!cargando && error && (
        <div className="sv-section text-center py-8">
          <i className="fas fa-triangle-exclamation text-rose-400 text-3xl mb-3"></i>
          <p className="text-rose-400 m-0">{error}</p>
        </div>
      )}

      {!cargando && !error && pedidos.length === 0 && (
        <div className="sv-section text-center py-12">
          <i className="fas fa-inbox text-[#94a3b8] text-3xl mb-3"></i>
          <p className="text-slate-200 font-bold m-0">Aún no tienes pedidos</p>
          <p className="text-[#94a3b8] text-sm mb-4">
            Explora el catálogo de GameZone y registra tu primer pedido.
          </p>
          <Link to="/gamezone" className="btn-sv-primary text-sm py-2 px-5">
            <i className="fas fa-gamepad"></i> Explorar GameZone
          </Link>
        </div>
      )}

      {!cargando && !error && pedidos.length > 0 && (
        <div className="flex flex-col gap-4">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-[rgba(102,126,234,.22)] bg-[rgba(12,15,30,.85)] p-4"
            >
              <img
                src={pedido.juego?.imagen_url || LOGO_URL}
                alt={pedido.juego?.titulo || 'Juego'}
                className="w-full sm:w-[140px] h-[90px] object-cover rounded-xl border border-[rgba(102,126,234,.3)]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h3 className="sv-card-title m-0 text-xl">
                    {pedido.juego?.titulo || 'Juego'}
                  </h3>
                  <span className={`text-[0.68rem] font-bold uppercase tracking-widest border rounded-full px-3 py-0.5 ${CLASE_ESTADO[pedido.estado] || ''}`}>
                    {pedido.estado}
                  </span>
                </div>
                <p className="text-sm text-[#94a3b8] mb-1">
                  <i className="fas fa-user mr-1"></i>{pedido.nombre_completo}
                  <span className="mx-2">·</span>
                  <i className="fas fa-gamepad mr-1"></i>{pedido.plataforma === 'pc' ? 'PC' : 'Consola'}
                </p>
                <p className="text-sm text-[#94a3b8] mb-1">
                  <i className="fas fa-location-dot mr-1"></i>{pedido.direccion_envio}
                </p>
                <p className="text-xs text-[#64748b] m-0">
                  <i className="fas fa-calendar mr-1"></i>
                  {new Date(pedido.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              {pedido.juego?.slug && (
                <Link
                  to={`/gamezone/${pedido.juego.slug}`}
                  className="self-start inline-flex items-center gap-2 border border-[rgba(102,126,234,.3)] text-[#cbd5e1] no-underline rounded-full px-4 py-2 text-sm hover:border-white hover:text-white transition-all"
                >
                  Ver juego
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}