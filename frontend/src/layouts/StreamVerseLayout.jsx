import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { ModalInfo, ModalUbicacion } from '../components/public/ModalesStreamVerse.jsx';
import { LOGO_URL } from '../services/informacionSitio.js';

const FONDOS = {
  '/peliculas': 'movies',
  '/musica': 'music',
  '/en-vivo': 'live',
  '/deportes': 'sports'
};

function claseEnlace({ isActive }) {
  return isActive ? 'sv-drawer-link active' : 'sv-drawer-link';
}

const REDES_SOCIALES = [
  { icono: 'fab fa-facebook-f', nombre: 'Facebook' },
  { icono: 'fab fa-instagram', nombre: 'Instagram' },
  // Font Awesome está en 6.4.0 (sin fa-x-twitter, añadido en 6.4.2); el ícono
  // de X se toma de Bootstrap Icons (1.11.3), que ya está cargado en index.html.
  { icono: 'bi bi-twitter-x', nombre: 'X (Twitter)' },
  { icono: 'fab fa-youtube', nombre: 'YouTube' },
  { icono: 'fab fa-tiktok', nombre: 'TikTok' },
  { icono: 'fab fa-whatsapp', nombre: 'WhatsApp' }
];

export default function StreamVerseLayout() {
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const { autenticado, esAdmin, usuario, cerrarSesion } = useAuth();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuarioAbierto, setUsuarioAbierto] = useState(false);
  const refDrawer = useRef(null);
  const refUsuario = useRef(null);

  const fondo = FONDOS[ubicacion.pathname] || '';

  // Modales informativos controlados por ?panel=info|ubicacion (única fuente de verdad).
  const [parametros, setParametros] = useSearchParams();
  const panel = parametros.get('panel');

  const cerrarMenu = useCallback(() => setMenuAbierto(false), []);
  const cerrarUsuario = useCallback(() => setUsuarioAbierto(false), []);
  const cerrarPanel = useCallback(() => {
    const siguiente = new URLSearchParams(parametros);
    siguiente.delete('panel');
    setParametros(siguiente, { replace: true });
  }, [parametros, setParametros]);

  // Al navegar se cierran el panel lateral y el menú de usuario.
  useEffect(() => {
    setMenuAbierto(false);
    setUsuarioAbierto(false);
  }, [ubicacion.pathname]);

  // Esc cierra el menú abierto.
  useEffect(() => {
    const alTeclado = (evento) => {
      if (evento.key === 'Escape') {
        setMenuAbierto(false);
        setUsuarioAbierto(false);
      }
    };
    window.addEventListener('keydown', alTeclado);
    return () => window.removeEventListener('keydown', alTeclado);
  }, []);

  // Clic fuera del panel o del menú de usuario los cierra.
  useEffect(() => {
    const alClicFuera = (evento) => {
      if (
        menuAbierto &&
        refDrawer.current &&
        !refDrawer.current.contains(evento.target) &&
        !evento.target.closest('.sv-hamburger')
      ) {
        setMenuAbierto(false);
      }
      if (usuarioAbierto && refUsuario.current && !refUsuario.current.contains(evento.target)) {
        setUsuarioAbierto(false);
      }
    };
    document.addEventListener('mousedown', alClicFuera);
    return () => document.removeEventListener('mousedown', alClicFuera);
  }, [menuAbierto, usuarioAbierto]);

  const alBuscar = (evento) => {
    if (evento.key !== 'Enter') return;
    const texto = evento.currentTarget.value.trim();
    navegar(texto ? `/buscar?q=${encodeURIComponent(texto)}` : '/buscar');
  };

  const alCerrarSesion = () => {
    cerrarSesion();
    navegar('/');
  };

  const nombreUsuario = usuario?.nombre || usuario?.username || 'Mi cuenta';

  return (
    <div className="sv-root min-h-screen bg-[#050810] text-slate-100 overflow-x-hidden">
      {/* ═══ SPLASH INTRO ═══ */}
      <div className="sv-splash" id="sv-splash">
        <div className="sv-splash-bg"></div>
        <div className="sv-splash-rings">
          <div className="sv-ring sv-ring1"></div>
          <div className="sv-ring sv-ring2"></div>
          <div className="sv-ring sv-ring3"></div>
        </div>
        <div className="sv-splash-content">
          <div className="sv-splash-icon">
            <img src={LOGO_URL} alt="OpenLeaf" className="sv-splash-logo-img" />
          </div>
          <div className="sv-splash-sub">Infinito Entretenimiento</div>
          <div className="sv-splash-bar"><div className="sv-splash-fill"></div></div>
        </div>
      </div>

      {/* FONDO ANIMADO */}
      <div className={`sv-bg ${fondo}`.trim()}>
        <div className="sv-orb sv-orb1"></div>
        <div className="sv-orb sv-orb2"></div>
        <div className="sv-orb sv-orb3"></div>
        <div className="sv-orb sv-orb4"></div>
        <div className="sv-particles">
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div className="sv-grid-lines"></div>
      </div>

      {/* ═══ NAVBAR (hamburguesa + logo + búsqueda + usuario) ═══ */}
      <nav className="sv-navbar sticky top-0 z-50 px-4 lg:px-6">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between py-3 gap-3">
          <div className="flex items-center gap-3 flex-shrink-0 min-w-0">
            <button
              type="button"
              className="sv-hamburger sv-icon-btn cursor-pointer"
              onClick={() => setMenuAbierto((v) => !v)}
              aria-label="Abrir menú"
            >
              <i className="fas fa-bars"></i>
            </button>
            <Link to="/inicio" className="flex items-center gap-2 no-underline flex-shrink-0">
              <span className="sv-brand-icon text-[2rem]"><i className="fas fa-play-circle"></i></span>
              <div>
                <p className="sv-brand-title text-2xl font-black tracking-widest m-0 leading-none">OpenLeaf</p>
                <p className="text-[0.68rem] text-[#94a3b8] tracking-wider m-0">Infinito Entretenimiento</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="sv-search-wrap">
              <input
                type="search"
                id="search-bar"
                className="sv-search-input"
                placeholder="Buscar en todo el catálogo…"
                onKeyDown={alBuscar}
              />
              <label htmlFor="search-bar" className="sv-icon-btn cursor-pointer"><i className="fas fa-search"></i></label>
            </div>
            <div className="sv-user-menu" ref={refUsuario}>
              {autenticado ? (
                <button
                  type="button"
                  className="sv-icon-btn"
                  title="Mi cuenta"
                  aria-label="Mi cuenta"
                  onClick={() => setUsuarioAbierto((v) => !v)}
                >
                  <i className="fas fa-user-circle"></i>
                </button>
              ) : (
                <Link to="/?auth=login" className="sv-icon-btn" title="Iniciar sesión"><i className="fas fa-user-circle"></i></Link>
              )}
              {usuarioAbierto && autenticado && (
                <div className="sv-user-drop">
                  <div className="px-3 py-2 border-b mb-1" style={{ borderColor: 'rgba(var(--sv-accent-rgb), .15)' }}>
                    <p className="font-black text-slate-100 text-sm m-0 truncate">{nombreUsuario}</p>
                    <p className="text-[0.68rem] text-[#94a3b8] m-0 truncate">{usuario?.email}</p>
                  </div>
                  <NavLink to="/perfil" className="sv-user-item" onClick={cerrarUsuario}><i className="fas fa-id-card"></i> Mi perfil</NavLink>
                  <NavLink to="/biblioteca" className="sv-user-item" onClick={cerrarUsuario}><i className="fas fa-heart"></i> Mis favoritos</NavLink>
                  <NavLink to="/mis-pedidos" className="sv-user-item" onClick={cerrarUsuario}><i className="fas fa-box"></i> Mis pedidos</NavLink>
                  {esAdmin && <NavLink to="/admin" className="sv-user-item" onClick={cerrarUsuario}><i className="fas fa-shield-alt"></i> Administración</NavLink>}
                  <div className="sv-user-sep"></div>
                  <button type="button" className="sv-user-item leave" onClick={alCerrarSesion}>
                    <i className="fas fa-right-from-bracket"></i> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ═══ PANEL LATERAL DE MENÚ ═══ */}
      {menuAbierto && <div className="sv-drawer-overlay open" onClick={cerrarMenu}></div>}
      <aside ref={refDrawer} className={`sv-drawer${menuAbierto ? ' open' : ''}`} aria-label="Menú principal">
        <div className="sv-drawer-header">
          <Link to="/inicio" className="sv-drawer-brand" onClick={cerrarMenu}>
            <img src={LOGO_URL} alt="OpenLeaf" />
            <span className="sv-brand-title font-black text-lg tracking-widest m-0">OpenLeaf</span>
          </Link>
          <button type="button" className="sv-drawer-close" onClick={cerrarMenu} aria-label="Cerrar menú">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <nav className="sv-drawer-nav">
          <p className="uppercase font-bold text-[0.66rem] tracking-[1.5px] text-[#64748b] px-3 mb-1">
            <i className="fas fa-list mr-2 sv-accent-text"></i>Navegación
          </p>
          <NavLink to="/inicio" className={claseEnlace} end onClick={cerrarMenu}><i className="fas fa-home"></i> Inicio</NavLink>
          <NavLink to="/gamezone" className={claseEnlace} onClick={cerrarMenu}><i className="fas fa-gamepad"></i> GameZone</NavLink>
          <NavLink to="/peliculas" className={claseEnlace} onClick={cerrarMenu}><i className="fas fa-film"></i> Películas</NavLink>
          <NavLink to="/musica" className={claseEnlace} onClick={cerrarMenu}><i className="fas fa-music"></i> Música</NavLink>
          <NavLink to="/en-vivo" className={claseEnlace} onClick={cerrarMenu}><i className="fas fa-satellite-dish"></i> En Vivo</NavLink>
          <NavLink to="/deportes" className={claseEnlace} onClick={cerrarMenu}><i className="fas fa-futbol"></i> Deportes</NavLink>
          <NavLink to="/biblioteca" className={claseEnlace} onClick={cerrarMenu}><i className="fas fa-heart"></i> Favoritos</NavLink>
          <div className="sv-user-sep"></div>
          <Link to="?panel=ubicacion" className="sv-drawer-link" onClick={cerrarMenu}><i className="fas fa-map-marker-alt"></i> Ubícanos</Link>
          {esAdmin && (
            <NavLink to="/admin" className={claseEnlace} onClick={cerrarMenu}><i className="fas fa-shield-alt"></i> Administración</NavLink>
          )}
        </nav>
        <div className="sv-drawer-footer">
          <p className="text-[0.7rem] text-[#64748b] m-0">© 2026 OpenLeaf · Infinito Entretenimiento</p>
        </div>
      </aside>

      {/* CONTENIDO DE LA RUTA */}
      <Outlet />

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[rgba(5,8,16,.96)] border-t pt-14 pb-6 px-4 mt-6" style={{ borderColor: 'rgba(var(--sv-accent-rgb), .2)' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="sv-text-gradient text-2xl"><i className="fas fa-play-circle"></i></span>
                <span className="font-black text-xl">OpenLeaf</span>
              </div>
              <p className="text-[#94a3b8] text-sm leading-relaxed mb-5">
                Tu portal definitivo para todo el entretenimiento digital. Todas tus plataformas favoritas, en un solo lugar.
              </p>
              <div className="flex gap-2">
                {REDES_SOCIALES.map((red) => (
                  <a key={red.nombre} href="#" className="sv-social" aria-label={red.nombre} title={red.nombre}>
                    <i className={red.icono}></i>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h6 className="text-[0.86rem] font-bold mb-3">Plataformas</h6>
              <Link to="/gamezone" className="sv-footer-link">GameZone</Link>
              <Link to="/peliculas" className="sv-footer-link">Películas y Series</Link>
              <Link to="/musica" className="sv-footer-link">Música</Link>
              <Link to="/en-vivo" className="sv-footer-link">En Vivo</Link>
              <Link to="/deportes" className="sv-footer-link">Deportes</Link>
            </div>
            <div>
              <h6 className="text-[0.86rem] font-bold mb-3">Soporte</h6>
              <a href="#" className="sv-footer-link">Ayuda</a>
              <a href="#" className="sv-footer-link">Preguntas Frecuentes</a>
              <a href="#" className="sv-footer-link">Contacto</a>
            </div>
            <div>
              <h6 className="text-[0.86rem] font-bold mb-3">Legal</h6>
              <Link to="/terminos" className="sv-footer-link">Términos de uso</Link>
              <Link to="/aviso-legal" className="sv-footer-link">Aviso legal</Link>
              <Link to="/privacidad" className="sv-footer-link">Privacidad</Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 border-t gap-2" style={{ borderColor: 'rgba(var(--sv-accent-rgb), .08)' }}>
            <p className="m-0 text-[#94a3b8] text-sm">
              © 2026 OpenLeaf · Creado por <strong className="text-slate-200">SAMB</strong>
            </p>
            <p className="m-0 text-[0.72rem] text-slate-600">Todos los derechos reservados</p>
          </div>
        </div>
      </footer>

      {/* ═══ MODALES ═══ */}
      <ModalInfo abierto={panel === 'info'} onCerrar={cerrarPanel} />
      <ModalUbicacion abierto={panel === 'ubicacion'} onCerrar={cerrarPanel} />
    </div>
  );
}