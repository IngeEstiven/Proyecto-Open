import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ENLACES = [
  { clave: 'todos', to: '/gamezone', icono: 'bi-grid-fill', texto: 'Todos los Juegos' },
  { clave: 'accion', to: '/gamezone/categoria/accion', icono: 'bi-crosshair', texto: 'Acción / Shooter' },
  { clave: 'terror', to: '/gamezone/categoria/terror', icono: 'bi-moon-stars', texto: 'Terror / Suspenso' },
  { clave: 'deportes', to: '/gamezone/categoria/deportes', icono: 'bi-trophy', texto: 'Deportes / Carreras' },
  { clave: 'cooperativo', to: '/gamezone/categoria/cooperativo', icono: 'bi-people', texto: 'Co-op / Puzzle' }
];

const CLASE_ACTIVA =
  'sidebar-link flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold border-l-4 border-primary bg-gradient-to-r from-primary/15 to-transparent text-primary';

const CLASE_INACTIVA =
  'sidebar-link flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold border-l-4 border-transparent bg-white/[.04] text-gray-400 hover:border-accent hover:bg-accent/10 hover:text-white';

// Barra lateral de GameZone con su botón de colapso (estado en localStorage),
// fiel a Sitio-Tailwind: #sidebarToggle + aside.gz-sidebar + nav + tarjeta GOTY.
export default function GameZoneSidebar({ activa = 'todos' }) {
  const [colapsado, setColapsado] = useState(
    () => localStorage.getItem('sidebarCollapsed') === '1'
  );

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', colapsado ? '1' : '0');
  }, [colapsado]);

  return (
    <>
      <button
        id="sidebarToggle"
        type="button"
        className={colapsado ? 'btn-collapsed' : ''}
        onClick={() => setColapsado((v) => !v)}
        aria-label="Mostrar u ocultar categorías"
      >
        <i className={`bi ${colapsado ? 'bi-layout-sidebar-reverse' : 'bi-layout-sidebar'}`}></i>
        <span className="toggle-label"></span>
      </button>

      <aside
        className={`gz-sidebar ${colapsado ? 'sidebar-collapsed' : ''} hidden md:flex flex-col sticky top-[68px] h-[calc(100vh-68px)] w-[240px] shrink-0 overflow-y-auto bg-[rgba(12,12,12,.88)] backdrop-blur-lg border-r border-primary/20 px-4 py-6`}
      >
        <p className="text-accent text-[.68rem] uppercase tracking-[3px] pb-3 border-b border-accent/25 mb-4 font-bold">
          Categorías
        </p>

        <nav className="flex flex-col gap-1.5">
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.clave}
              to={enlace.to}
              className={enlace.clave === activa ? CLASE_ACTIVA : CLASE_INACTIVA}
            >
              <i className={`bi ${enlace.icono}`}></i>
              {enlace.texto}
            </Link>
          ))}
        </nav>

        <div className="mt-auto bg-white/[.04] border border-primary/25 rounded-xl p-3.5">
          <span className="block text-gray-400 mb-1 text-xs">
            <i className="bi bi-award-fill me-1" style={{ color: 'gold' }}></i>GOTY 2025
          </span>
          <span className="text-primary font-display text-xl tracking-widest leading-snug">
            Clair Obscur:
            <br />
            Expedition 33
          </span>
        </div>
      </aside>
    </>
  );
}
