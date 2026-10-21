import { NavLink, Outlet } from 'react-router-dom';

const ENLACES = [
  { ruta: '/admin', texto: 'Resumen', icono: 'fas fa-chart-line', fin: true },
  { ruta: '/admin/usuarios', texto: 'Usuarios', icono: 'fas fa-users' },
  { ruta: '/admin/juegos', texto: 'Juegos', icono: 'fas fa-gamepad' },
  { ruta: '/admin/plataformas', texto: 'Plataformas', icono: 'fas fa-tv' },
  { ruta: '/admin/contenidos', texto: 'Contenidos', icono: 'fas fa-video' },
  { ruta: '/admin/pedidos', texto: 'Pedidos', icono: 'fas fa-shopping-bag' },
  { ruta: '/admin/auditoria', texto: 'Auditoría', icono: 'fas fa-clipboard-list' }
];

function claseEnlace({ isActive }) {
  return `sv-admin-link${isActive ? ' active' : ''}`;
}

export default function AdminLayout() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6">
      <div className="pb-4 mb-6 border-b" style={{ borderColor: 'rgba(var(--sv-accent-rgb), .2)' }}>
        <h1 className="sv-section-title mb-1">
          <i className="fas fa-shield-alt mr-2 sv-text-gradient"></i>Panel de administración
        </h1>
        <p className="text-[#94a3b8] text-sm m-0">Gestiona usuarios, catálogo y pedidos de OpenLeaf</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <aside className="w-full lg:w-[240px] flex-shrink-0 sv-section p-3 lg:sticky lg:top-24">
          <nav className="flex flex-col gap-1">
            {ENLACES.map((enlace) => (
              <NavLink key={enlace.ruta} to={enlace.ruta} end={enlace.fin} className={claseEnlace}>
                <i className={`${enlace.icono} w-5 text-center`}></i>{enlace.texto}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
