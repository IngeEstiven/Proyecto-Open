import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import useTituloPagina from '../../hooks/useTituloPagina.js';
import { listarContenidos } from '../../services/contenidosService.js';
import { listarJuegos } from '../../services/juegosService.js';
import { listarPedidos } from '../../services/pedidosService.js';
import { listarPlataformas } from '../../services/plataformasService.js';
import { listarUsuarios } from '../../services/usuariosService.js';

export default function DashboardPage() {
  useTituloPagina('Administración · OpenLeaf');
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    let vivo = true;
    Promise.allSettled([
      listarUsuarios(),
      listarJuegos(),
      listarPlataformas(),
      listarContenidos(),
      listarPedidos()
    ]).then(([usuarios, juegos, plataformas, contenidos, pedidos]) => {
      if (!vivo) return;
      const cuenta = (resultado) => (resultado.status === 'fulfilled' ? resultado.value.length : 0);
      setResumen({
        usuarios: cuenta(usuarios),
        juegos: cuenta(juegos),
        plataformas: cuenta(plataformas),
        contenidos: cuenta(contenidos),
        pedidos: cuenta(pedidos),
        pendientes:
          pedidos.status === 'fulfilled'
            ? pedidos.value.filter((p) => p.estado === 'pendiente').length
            : 0
      });
    });
    return () => {
      vivo = false;
    };
  }, []);

  const tarjetas = [
    { ruta: '/admin/usuarios', texto: 'Usuarios', icono: 'fas fa-users', valor: resumen?.usuarios, color: 'text-[#a5b4fc]' },
    { ruta: '/admin/juegos', texto: 'Juegos', icono: 'fas fa-gamepad', valor: resumen?.juegos, color: 'text-emerald-400' },
    { ruta: '/admin/plataformas', texto: 'Plataformas', icono: 'fas fa-tv', valor: resumen?.plataformas, color: 'text-sky-400' },
    { ruta: '/admin/contenidos', texto: 'Contenidos', icono: 'fas fa-video', valor: resumen?.contenidos, color: 'text-fuchsia-400' },
    { ruta: '/admin/pedidos', texto: 'Pedidos', icono: 'fas fa-shopping-bag', valor: resumen?.pedidos, color: 'text-amber-400' },
    { ruta: '/admin/pedidos', texto: 'Pedidos pendientes', icono: 'fas fa-clock', valor: resumen?.pendientes, color: 'text-rose-400' }
  ];

  return (
    <div>
      <h2 className="sv-section-title text-lg mb-4">
        <i className="fas fa-chart-line mr-2 sv-text-gradient"></i>Resumen general
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {tarjetas.map((tarjeta) => (
          <Link
            key={tarjeta.texto}
            to={tarjeta.ruta}
            className="sv-section no-underline m-0 flex items-center gap-4 hover:border-[rgba(99,102,241,.5)] transition-colors"
          >
            <span className={`text-3xl ${tarjeta.color}`}>
              <i className={tarjeta.icono}></i>
            </span>
            <div>
              <p className="text-[#94a3b8] text-xs uppercase tracking-wider m-0">{tarjeta.texto}</p>
              <p className="text-2xl font-black text-white m-0">{resumen ? tarjeta.valor : '—'}</p>
            </div>
          </Link>
        ))}
      </div>
      <p className="text-[#64748b] text-xs mt-4">
        Los conteos se obtienen de la API del backend. Requiere un administrador autenticado.
      </p>
    </div>
  );
}
